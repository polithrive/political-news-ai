"use client";

import {
  FormEvent,
  KeyboardEvent,
  useRef,
  useState,
} from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { ANALYTICS_EVENTS, failureDetailFromHttpStatus } from "@/lib/analytics/taxonomy";
import { trackEvent } from "@/lib/analytics/track";

import type { ChatMessage } from "@/app/types/chat";

import SectionHeader from "@/app/components/ui/SectionHeader";

import { colors } from "@/lib/design/theme";

type AIChatProps = {
  reportContext: string;
  reportTitle?: string;
  variant?: "default" | "compact";
  independentSourceCount?: number;
  storyRef?: string;
};

type ChatErrorResponse = {
  error?: string;
};

const SUGGESTED_QUESTIONS_DELIMITER =
  "<<<POLITICALPULSE_SUGGESTED_QUESTIONS>>>";

function getVisibleAnswer(value: string): string {
  const delimiterIndex = value.indexOf(
    SUGGESTED_QUESTIONS_DELIMITER
  );

  if (delimiterIndex >= 0) {
    return value.slice(0, delimiterIndex).trimEnd();
  }

  // Prevent a partially streamed delimiter from flashing in the UI.
  const maxPrefixLength = Math.min(
    value.length,
    SUGGESTED_QUESTIONS_DELIMITER.length - 1
  );

  for (
    let prefixLength = maxPrefixLength;
    prefixLength > 0;
    prefixLength -= 1
  ) {
    if (
      value.endsWith(
        SUGGESTED_QUESTIONS_DELIMITER.slice(
          0,
          prefixLength
        )
      )
    ) {
      return value.slice(0, -prefixLength);
    }
  }

  return value;
}

function getSuggestedQuestions(
  value: string
): string[] {
  const delimiterIndex = value.indexOf(
    SUGGESTED_QUESTIONS_DELIMITER
  );

  if (delimiterIndex < 0) {
    return [];
  }

  const rawQuestions = value
    .slice(
      delimiterIndex +
        SUGGESTED_QUESTIONS_DELIMITER.length
    )
    .trim();

  try {
    const parsed = JSON.parse(rawQuestions);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (item): item is string =>
          typeof item === "string" &&
          item.trim().length > 0
      )
      .map((item) => item.trim())
      .slice(0, 4);
  } catch {
    return [];
  }
}

const COMPACT_PROMPTS_MULTI_SOURCE = [
  "What do the sources agree on?",
  "What is still unclear?",
];

const COMPACT_PROMPTS_LIMITED_EVIDENCE = [
  "What does the reporting support?",
  "What is still unclear?",
];

export default function AIChat({
  reportContext,
  reportTitle,
  variant = "default",
  independentSourceCount,
  storyRef = "unknown",
}: AIChatProps) {
  const isCompact = variant === "compact";
  const compactPrompts =
    typeof independentSourceCount === "number" &&
    independentSourceCount < 2
      ? COMPACT_PROMPTS_LIMITED_EVIDENCE
      : COMPACT_PROMPTS_MULTI_SOURCE;

  function markAskOpened() {
    trackEvent(
      ANALYTICS_EVENTS.askAngleOpened,
      { surface: "chat", detail: storyRef },
      { onceKey: `ask_open:${storyRef}` }
    );
  }
  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  const [question, setQuestion] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [suggestedQuestions, setSuggestedQuestions] =
    useState<Record<string, string[]>>({});

  const activeRequestRef =
    useRef<AbortController | null>(null);

  async function askQuestion(
    event?: FormEvent<HTMLFormElement>,
    suggestedQuestion?: string
  ) {
    event?.preventDefault();

    const trimmedQuestion =
      (suggestedQuestion ?? question).trim();

    if (
      !trimmedQuestion ||
      isLoading ||
      !reportContext.trim()
    ) {
      return;
    }

    markAskOpened();

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedQuestion,
      createdAt: new Date().toISOString(),
    };

    const assistantMessageId =
      crypto.randomUUID();

    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
    };

    const conversationWithQuestion = [
      ...messages,
      userMessage,
    ];

    setMessages([
      ...conversationWithQuestion,
      assistantMessage,
    ]);

    setQuestion("");
    setErrorMessage(null);
    setIsLoading(true);

    const abortController =
      new AbortController();

    activeRequestRef.current =
      abortController;

    let countedFailure = false;

    try {
      const response = await fetch(
        "/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          signal:
            abortController.signal,
          body: JSON.stringify({
            question: trimmedQuestion,
            reportTitle,
            reportContext,
            messages:
              conversationWithQuestion.map(
                (message) => ({
                  role: message.role,
                  content:
                    message.content,
                })
              ),
          }),
        }
      );

      if (!response.ok) {
        const detail = failureDetailFromHttpStatus(response.status);

        if (response.status === 429) {
          trackEvent(ANALYTICS_EVENTS.rateLimited, {
            surface: "chat",
            detail: "ai-chat",
          });
        }

        countedFailure = true;
        trackEvent(ANALYTICS_EVENTS.askAngleFailed, {
          surface: "chat",
          detail,
        });

        let apiError =
          "The Angle Report could not answer this question.";

        try {
          const data =
            (await response.json()) as ChatErrorResponse;

          if (data.error?.trim()) {
            apiError =
              data.error.trim();
          }
        } catch {
          // Keep fallback error message.
        }

        throw new Error(apiError);
      }

      if (!response.body) {
        throw new Error(
          "The Angle Report could not start the response stream."
        );
      }

      const reader =
        response.body.getReader();

      const decoder =
        new TextDecoder();

      let streamedAnswer = "";

      while (true) {
        const { done, value } =
          await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(
          value,
          {
            stream: true,
          }
        );

        if (!chunk) {
          continue;
        }

        streamedAnswer += chunk;

        const visibleAnswer =
          getVisibleAnswer(streamedAnswer);

        setMessages((previous) =>
          previous.map((message) =>
            message.id ===
            assistantMessageId
              ? {
                  ...message,
                  content:
                    visibleAnswer,
                }
              : message
          )
        );
      }

      const finalChunk =
        decoder.decode();

      if (finalChunk) {
        streamedAnswer += finalChunk;

        const visibleAnswer =
          getVisibleAnswer(streamedAnswer);

        setMessages((previous) =>
          previous.map((message) =>
            message.id ===
            assistantMessageId
              ? {
                  ...message,
                  content:
                    visibleAnswer,
                }
              : message
          )
        );
      }

      const finalVisibleAnswer =
        getVisibleAnswer(streamedAnswer);

      const finalSuggestedQuestions =
        getSuggestedQuestions(streamedAnswer);

      setMessages((previous) =>
        previous.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                content: finalVisibleAnswer,
              }
            : message
        )
      );

      if (finalSuggestedQuestions.length > 0) {
        setSuggestedQuestions((previous) => ({
          ...previous,
          [assistantMessageId]:
            finalSuggestedQuestions,
        }));
      }

      if (!finalVisibleAnswer.trim()) {
        countedFailure = true;
        trackEvent(ANALYTICS_EVENTS.askAngleFailed, {
          surface: "chat",
          detail: "empty",
        });
        throw new Error(
          "The Angle Report returned an empty response."
        );
      }

      trackEvent(ANALYTICS_EVENTS.askAngleSuccess, {
        surface: "chat",
        detail: storyRef,
      });
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        setErrorMessage(
          "The Angle Report response was stopped."
        );
      } else {
        if (!countedFailure) {
          trackEvent(ANALYTICS_EVENTS.askAngleFailed, {
            surface: "chat",
            detail: "network",
          });
        }

        const message =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.";

        setErrorMessage(message);
      }

      setMessages((previous) =>
        previous.filter(
          (message) =>
            message.id !==
              assistantMessageId ||
            message.content.trim()
              .length > 0
        )
      );
    } finally {
      activeRequestRef.current =
        null;

      setIsLoading(false);
    }
  }

  function stopResponse() {
    activeRequestRef.current?.abort();
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement>
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !isLoading
    ) {
      event.preventDefault();

      event.currentTarget.form?.requestSubmit();
    }
  }

  if (isCompact) {
    return (
      <section
        aria-label="Ask The Angle"
        className="rounded-xl border border-[#17446D]/60 bg-[#04162C] p-4 sm:p-5"
      >
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
          Ask The Angle
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8EA3B7]">
          Have a question about this story? Get answers based on the
          reporting we&apos;ve analyzed.
        </p>

        {messages.length === 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {compactPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled={isLoading || !reportContext.trim()}
                onClick={() => {
                  void askQuestion(undefined, prompt);
                }}
                className="rounded-lg border border-[#214B70] px-3 py-2 text-left text-sm text-[#D5E0EC] transition hover:border-[#38BDF8] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        ) : (
          <div
            className="mt-5 space-y-4"
            aria-live="polite"
            aria-busy={isLoading}
          >
            {messages.map((message) => {
              const isAssistant = message.role === "assistant";
              const isCurrentStreamingMessage =
                isLoading &&
                isAssistant &&
                message.id === messages[messages.length - 1]?.id;

              return (
                <article
                  key={message.id}
                  className={`rounded-xl border px-4 py-3 text-sm leading-6 ${
                    isAssistant
                      ? "border-[#17446D]/70 bg-[#05182E] text-[#E6EDF4]"
                      : "border-[#214B70] bg-[#061A31] text-white"
                  }`}
                >
                  {isAssistant ? (
                    <>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#55C8FF]">
                        The Angle
                      </p>
                      {message.content ? (
                        <div className="max-w-none text-[#E6EDF4] [&_p]:mb-3 [&_p]:last:mb-0">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : isCurrentStreamingMessage ? (
                        <p className="text-[#8EA3B7]">Thinking…</p>
                      ) : null}
                    </>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {errorMessage ? (
          <p role="alert" className="mt-4 text-sm text-[#FF7A86]">
            {errorMessage}
          </p>
        ) : null}

        <form onSubmit={askQuestion} className="mt-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={markAskOpened}
              placeholder="Ask a question about this story..."
              disabled={isLoading}
              aria-label="Ask a question about this story"
              className="min-w-0 flex-1 rounded-lg border border-[#214B70] bg-[#020D21] px-3 py-2.5 text-base text-white outline-none placeholder:text-[#7A93AA] focus-visible:border-[#38BDF8] disabled:cursor-not-allowed disabled:opacity-60"
            />

            {isLoading ? (
              <button
                type="button"
                onClick={stopResponse}
                className="rounded-lg border border-[#214B70] px-4 py-2.5 text-sm font-semibold text-[#D5E0EC] transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8]"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                disabled={!question.trim() || !reportContext.trim()}
                className="rounded-lg bg-[#FF2638] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#FF4151] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38BDF8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Ask
              </button>
            )}
          </div>
        </form>

        <p className="mt-3 text-xs leading-5 text-[#7A93AA]">
          Answers are based on the reporting reviewed for this brief.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-label="Ask The Angle Report"
      className="relative overflow-hidden rounded-3xl border p-6 shadow-[0_20px_55px_rgba(37,54,74,0.08)] sm:p-8 lg:p-10"
      style={{
        backgroundColor:
          colors.background.surface,
        borderColor:
          colors.border.default,
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl"
        style={{
          backgroundColor:
            `${colors.brand.primary}10`,
        }}
      />

      <div className="relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <SectionHeader
            eyebrow="Ask about this story"
            title="What else do you want to understand?"
            subtitle="Ask about what reporting agrees on, where it differs, or what remains uncertain."
          />

          <div
            className="flex w-fit shrink-0 items-center gap-2 rounded-full border px-4 py-2"
            style={{
              backgroundColor:
                colors.status.successSoft,
              borderColor:
                `${colors.status.success}35`,
              color:
                colors.status.success,
            }}
          >
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor:
                  colors.status.success,
              }}
            />

            <span className="text-xs font-semibold uppercase tracking-[0.14em]">
              Uses this brief
            </span>
          </div>
        </div>

        {reportTitle ? (
          <div
            className="mt-7 rounded-xl border px-4 py-3"
            style={{
              backgroundColor:
                colors.background.elevated,
              borderColor:
                colors.border.default,
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-[0.16em]"
              style={{
                color: colors.text.muted,
              }}
            >
              Current Report
            </p>

            <p
              className="mt-1 line-clamp-2 text-sm font-medium"
              style={{
                color:
                  colors.text.secondary,
              }}
            >
              {reportTitle}
            </p>
          </div>
        ) : null}

        <div
          className="mt-8 min-h-[220px] rounded-2xl border p-4 sm:p-6"
          style={{
            backgroundColor:
              colors.background.elevated,
            borderColor:
              colors.border.default,
          }}
          aria-live="polite"
          aria-busy={isLoading}
        >
          {messages.length === 0 ? (
            <div className="flex min-h-[170px] items-center justify-center">
              <div className="max-w-xl text-center">
                <div
                  aria-hidden="true"
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border text-xl font-bold"
                  style={{
                    backgroundColor:
                      colors.brand.primarySoft,
                    borderColor:
                      colors.border.brand,
                    color:
                      colors.brand.primary,
                  }}
                >
                  ✦
                </div>

                <h3
                  className="mt-4 text-lg font-semibold"
                  style={{
                    color:
                      colors.text.primary,
                  }}
                >
                  What would you like to
                  understand?
                </h3>

                <p
                  className="mt-2 text-sm leading-6"
                  style={{
                    color:
                      colors.text.secondary,
                  }}
                >
                  Ask a question about this
                  intelligence report.
                  The Angle Report will use the
                  report as its primary source
                  of context.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((message) => {
                const isAssistant =
                  message.role ===
                  "assistant";

                const isCurrentStreamingMessage =
                  isLoading &&
                  isAssistant &&
                  message.id ===
                    messages[
                      messages.length - 1
                    ]?.id;

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isAssistant
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <article
                      className="max-w-3xl rounded-2xl border px-4 py-4 sm:px-5"
                      style={
                        isAssistant
                          ? {
                              backgroundColor:
                                colors
                                  .background
                                  .surface,
                              borderColor:
                                colors.border
                                  .default,
                              color:
                                colors.text
                                  .secondary,
                            }
                          : {
                              backgroundColor:
                                colors.brand
                                  .primary,
                              borderColor:
                                colors.brand
                                  .primary,
                              color: "#ffffff",
                            }
                      }
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <span
                          className="text-[11px] font-bold uppercase tracking-[0.15em]"
                          style={{
                            color:
                              isAssistant
                                ? colors
                                    .brand
                                    .primary
                                : "rgba(255,255,255,0.75)",
                          }}
                        >
                          {isAssistant
                            ? "The Angle Report AI"
                            : "You"}
                        </span>
                      </div>

                      {isAssistant &&
                      !message.content ? (
                        <div className="flex items-center gap-3">
                          <span
                            aria-hidden="true"
                            className="h-2.5 w-2.5 animate-pulse rounded-full"
                            style={{
                              backgroundColor:
                                colors.brand
                                  .primary,
                            }}
                          />

                          <p
                            className="text-sm"
                            style={{
                              color:
                                colors.text
                                  .muted,
                            }}
                          >
                            The Angle Report is
                            analyzing the
                            report...
                          </p>
                        </div>
                      ) : isAssistant ? (
                        <div>
                          <ReactMarkdown
                            remarkPlugins={[
                              remarkGfm,
                            ]}
                            components={{
                              h1: ({
                                children,
                              }) => (
                                <h1
                                  className="mb-3 mt-5 text-2xl font-bold first:mt-0"
                                  style={{
                                    color:
                                      colors
                                        .text
                                        .primary,
                                  }}
                                >
                                  {children}
                                </h1>
                              ),

                              h2: ({
                                children,
                              }) => (
                                <h2
                                  className="mb-3 mt-5 text-xl font-bold first:mt-0"
                                  style={{
                                    color:
                                      colors
                                        .text
                                        .primary,
                                  }}
                                >
                                  {children}
                                </h2>
                              ),

                              h3: ({
                                children,
                              }) => (
                                <h3
                                  className="mb-2 mt-4 text-lg font-semibold first:mt-0"
                                  style={{
                                    color:
                                      colors
                                        .text
                                        .primary,
                                  }}
                                >
                                  {children}
                                </h3>
                              ),

                              p: ({
                                children,
                              }) => (
                                <p className="mb-4 leading-7 last:mb-0">
                                  {children}
                                </p>
                              ),

                              strong: ({
                                children,
                              }) => (
                                <strong
                                  className="font-semibold"
                                  style={{
                                    color:
                                      colors
                                        .text
                                        .primary,
                                  }}
                                >
                                  {children}
                                </strong>
                              ),

                              em: ({
                                children,
                              }) => (
                                <em
                                  style={{
                                    color:
                                      colors
                                        .text
                                        .secondary,
                                  }}
                                >
                                  {children}
                                </em>
                              ),

                              ul: ({
                                children,
                              }) => (
                                <ul
                                  className="mb-4 ml-6 list-disc space-y-2"
                                  style={{
                                    color:
                                      colors
                                        .text
                                        .secondary,
                                  }}
                                >
                                  {children}
                                </ul>
                              ),

                              ol: ({
                                children,
                              }) => (
                                <ol
                                  className="mb-4 ml-6 list-decimal space-y-2"
                                  style={{
                                    color:
                                      colors
                                        .text
                                        .secondary,
                                  }}
                                >
                                  {children}
                                </ol>
                              ),

                              li: ({
                                children,
                              }) => (
                                <li className="pl-1 leading-7">
                                  {children}
                                </li>
                              ),

                              blockquote: ({
                                children,
                              }) => (
                                <blockquote
                                  className="my-4 rounded-r-xl border-l-4 px-4 py-3"
                                  style={{
                                    backgroundColor:
                                      colors
                                        .background
                                        .elevated,
                                    borderColor:
                                      colors
                                        .brand
                                        .primary,
                                    color:
                                      colors
                                        .text
                                        .secondary,
                                  }}
                                >
                                  {children}
                                </blockquote>
                              ),

                              hr: () => (
                                <hr
                                  className="my-5"
                                  style={{
                                    borderColor:
                                      colors
                                        .border
                                        .default,
                                  }}
                                />
                              ),

                              a: ({
                                href,
                                children,
                              }) => (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="font-medium underline underline-offset-4 transition hover:opacity-80"
                                  style={{
                                    color:
                                      colors
                                        .brand
                                        .secondary,
                                  }}
                                >
                                  {children}
                                </a>
                              ),

                              table: ({
                                children,
                              }) => (
                                <div
                                  className="my-5 overflow-x-auto rounded-xl border"
                                  style={{
                                    borderColor:
                                      colors
                                        .border
                                        .default,
                                  }}
                                >
                                  <table className="min-w-full border-collapse text-left text-sm">
                                    {children}
                                  </table>
                                </div>
                              ),

                              thead: ({
                                children,
                              }) => (
                                <thead
                                  style={{
                                    backgroundColor:
                                      colors
                                        .background
                                        .elevated,
                                    color:
                                      colors
                                        .text
                                        .primary,
                                  }}
                                >
                                  {children}
                                </thead>
                              ),

                              tbody: ({
                                children,
                              }) => (
                                <tbody>
                                  {children}
                                </tbody>
                              ),

                              tr: ({
                                children,
                              }) => (
                                <tr
                                  className="border-t"
                                  style={{
                                    borderColor:
                                      colors
                                        .border
                                        .default,
                                  }}
                                >
                                  {children}
                                </tr>
                              ),

                              th: ({
                                children,
                              }) => (
                                <th
                                  className="border-r px-4 py-3 font-semibold last:border-r-0"
                                  style={{
                                    borderColor:
                                      colors
                                        .border
                                        .default,
                                  }}
                                >
                                  {children}
                                </th>
                              ),

                              td: ({
                                children,
                              }) => (
                                <td
                                  className="border-r px-4 py-3 align-top last:border-r-0"
                                  style={{
                                    borderColor:
                                      colors
                                        .border
                                        .default,
                                  }}
                                >
                                  {children}
                                </td>
                              ),

                              code: ({
                                children,
                              }) => (
                                <code
                                  className="rounded px-1.5 py-0.5 font-mono text-sm"
                                  style={{
                                    backgroundColor:
                                      colors
                                        .background
                                        .muted,
                                    color:
                                      colors
                                        .brand
                                        .primary,
                                  }}
                                >
                                  {children}
                                </code>
                              ),

                              pre: ({
                                children,
                              }) => (
                                <pre
                                  className="my-4 overflow-x-auto rounded-xl border p-4 text-sm leading-6"
                                  style={{
                                    backgroundColor:
                                      colors
                                        .background
                                        .elevated,
                                    borderColor:
                                      colors
                                        .border
                                        .default,
                                    color:
                                      colors
                                        .text
                                        .primary,
                                  }}
                                >
                                  {children}
                                </pre>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>

                          {isCurrentStreamingMessage ? (
                            <span
                              className="ml-1 inline-block animate-pulse"
                              style={{
                                color:
                                  colors.brand
                                    .primary,
                              }}
                              aria-hidden="true"
                            >
                              ▍
                            </span>
                          ) : null}

                          {!isCurrentStreamingMessage &&
                          suggestedQuestions[message.id]
                            ?.length ? (
                            <div
                              className="mt-6 border-t pt-5"
                              style={{
                                borderColor:
                                  colors.border.default,
                              }}
                            >
                              <p
                                className="mb-3 text-xs font-bold uppercase tracking-[0.14em]"
                                style={{
                                  color:
                                    colors.text.muted,
                                }}
                              >
                                Continue exploring
                              </p>

                              <div className="flex flex-wrap gap-2">
                                {suggestedQuestions[
                                  message.id
                                ].map(
                                  (suggestion) => (
                                    <button
                                      key={suggestion}
                                      type="button"
                                      disabled={isLoading}
                                      onClick={() =>
                                        void askQuestion(
                                          undefined,
                                          suggestion
                                        )
                                      }
                                      className="rounded-xl border px-3 py-2 text-left text-sm font-medium transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                                      style={{
                                        backgroundColor:
                                          colors.background
                                            .elevated,
                                        borderColor:
                                          colors.border
                                            .brand,
                                        color:
                                          colors.brand
                                            .secondary,
                                      }}
                                    >
                                      {suggestion}
                                    </button>
                                  )
                                )}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap leading-7">
                          {message.content}
                        </p>
                      )}
                    </article>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {errorMessage ? (
          <div
            role="alert"
            className="mt-5 rounded-xl border px-4 py-3"
            style={{
              backgroundColor:
                colors.status.dangerSoft,
              borderColor:
                `${colors.status.danger}35`,
              color:
                colors.status.danger,
            }}
          >
            <p className="text-sm leading-6">
              {errorMessage}
            </p>
          </div>
        ) : null}

        <form
          onSubmit={askQuestion}
          className="mt-6"
        >
          <div
            className="flex flex-col gap-3 rounded-2xl border p-3 sm:flex-row"
            style={{
              backgroundColor:
                colors.background.elevated,
              borderColor:
                colors.border.default,
            }}
          >
            <input
              value={question}
              onChange={(event) =>
                setQuestion(
                  event.target.value
                )
              }
              onKeyDown={handleKeyDown}
              onFocus={markAskOpened}
              placeholder="Ask The Angle Report about this report..."
              disabled={isLoading}
              aria-label="Ask a question about this report"
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-base outline-none disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                color: colors.text.primary,
              }}
            />

            {isLoading ? (
              <button
                type="button"
                onClick={stopResponse}
                className="rounded-xl border px-6 py-3 text-sm font-bold transition hover:opacity-80"
                style={{
                  backgroundColor:
                    colors.background
                      .surface,
                  borderColor:
                    colors.border.default,
                  color:
                    colors.text.primary,
                }}
              >
                Stop Response
              </button>
            ) : (
              <button
                type="submit"
                disabled={
                  !question.trim() ||
                  !reportContext.trim()
                }
                className="rounded-xl px-6 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  backgroundColor:
                    colors.brand.primary,
                }}
              >
                Ask The Angle Report
              </button>
            )}
          </div>
        </form>

        <div className="mt-4 flex items-start gap-2">
          <span
            aria-hidden="true"
            className="mt-1 text-xs"
            style={{
              color: colors.text.muted,
            }}
          >
            ⓘ
          </span>

          <p
            className="text-xs leading-5"
            style={{
              color: colors.text.muted,
            }}
          >
            AI-generated responses may contain
            errors. Review the report evidence
            and original sources before making
            important conclusions.
          </p>
        </div>
      </div>
    </section>
  );
}