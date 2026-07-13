"use client";

import {
  FormEvent,
  KeyboardEvent,
  useRef,
  useState,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { ChatMessage } from "@/app/types/chat";

type AIChatProps = {
  reportContext: string;
  reportTitle?: string;
};

type ChatErrorResponse = {
  error?: string;
};

export default function AIChat({
  reportContext,
  reportTitle,
}: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    []
  );
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<
    string | null
  >(null);

  const activeRequestRef =
    useRef<AbortController | null>(null);

  async function askQuestion(
    event?: FormEvent<HTMLFormElement>
  ) {
    event?.preventDefault();

    const trimmedQuestion = question.trim();

    if (
      !trimmedQuestion ||
      isLoading ||
      !reportContext.trim()
    ) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedQuestion,
      createdAt: new Date().toISOString(),
    };

    const assistantMessageId = crypto.randomUUID();

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

    const abortController = new AbortController();
    activeRequestRef.current = abortController;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortController.signal,
        body: JSON.stringify({
          question: trimmedQuestion,
          reportTitle,
          reportContext,
          messages: conversationWithQuestion.map(
            (message) => ({
              role: message.role,
              content: message.content,
            })
          ),
        }),
      });

      if (!response.ok) {
        let apiError =
          "PoliticalPulse could not answer this question.";

        try {
          const data =
            (await response.json()) as ChatErrorResponse;

          if (data.error?.trim()) {
            apiError = data.error.trim();
          }
        } catch {
          // Keep the fallback message when the API
          // response does not contain valid JSON.
        }

        throw new Error(apiError);
      }

      if (!response.body) {
        throw new Error(
          "PoliticalPulse could not start the response stream."
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let streamedAnswer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const chunk = decoder.decode(value, {
          stream: true,
        });

        if (!chunk) {
          continue;
        }

        streamedAnswer += chunk;

        setMessages((previous) =>
          previous.map((message) =>
            message.id === assistantMessageId
              ? {
                  ...message,
                  content: streamedAnswer,
                }
              : message
          )
        );
      }

      const finalChunk = decoder.decode();

      if (finalChunk) {
        streamedAnswer += finalChunk;

        setMessages((previous) =>
          previous.map((message) =>
            message.id === assistantMessageId
              ? {
                  ...message,
                  content: streamedAnswer,
                }
              : message
          )
        );
      }

      if (!streamedAnswer.trim()) {
        throw new Error(
          "PoliticalPulse returned an empty response."
        );
      }
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        setErrorMessage(
          "The PoliticalPulse response was stopped."
        );
      } else {
        const message =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.";

        setErrorMessage(message);
      }

      setMessages((previous) =>
        previous.filter(
          (message) =>
            message.id !== assistantMessageId ||
            message.content.trim().length > 0
        )
      );
    } finally {
      activeRequestRef.current = null;
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

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 md:p-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-red-500">
        Ask PoliticalPulse
      </p>

      <h2 className="mt-2 text-3xl font-bold">
        Ask questions about this report
      </h2>

      <p className="mt-3 max-w-3xl text-slate-400">
        Ask follow-up questions to better understand the
        story, evidence, political perspectives, and
        possible outcomes.
      </p>

      {reportTitle && (
        <p className="mt-4 text-sm text-slate-500">
          Report context: {reportTitle}
        </p>
      )}

      <div
        className="mt-8 space-y-4"
        aria-live="polite"
        aria-busy={isLoading}
      >
        {messages.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/40 p-5 text-sm text-slate-400">
            Ask a question about the intelligence report
            above. PoliticalPulse will answer using the
            report as its primary source of context.
          </div>
        )}

        {messages.map((message) => {
          const isCurrentStreamingMessage =
            isLoading &&
            message.role === "assistant" &&
            message.id ===
              messages[messages.length - 1]?.id;

          return (
            <div
              key={message.id}
              className={`max-w-3xl rounded-xl p-4 leading-7 ${
                message.role === "user"
                  ? "ml-auto bg-red-600 text-white"
                  : "mr-auto border border-slate-700/70 bg-slate-800 text-slate-200"
              }`}
            >
              {message.role === "assistant" &&
              !message.content ? (
                <p className="animate-pulse text-slate-400">
                  PoliticalPulse is analyzing the report...
                </p>
              ) : message.role === "assistant" ? (
                <div>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="mb-3 mt-5 text-2xl font-bold text-white first:mt-0">
                          {children}
                        </h1>
                      ),

                      h2: ({ children }) => (
                        <h2 className="mb-3 mt-5 text-xl font-bold text-white first:mt-0">
                          {children}
                        </h2>
                      ),

                      h3: ({ children }) => (
                        <h3 className="mb-2 mt-4 text-lg font-semibold text-white first:mt-0">
                          {children}
                        </h3>
                      ),

                      p: ({ children }) => (
                        <p className="mb-4 leading-7 last:mb-0">
                          {children}
                        </p>
                      ),

                      strong: ({ children }) => (
                        <strong className="font-semibold text-white">
                          {children}
                        </strong>
                      ),

                      em: ({ children }) => (
                        <em className="text-slate-300">
                          {children}
                        </em>
                      ),

                      ul: ({ children }) => (
                        <ul className="mb-4 ml-6 list-disc space-y-2 marker:text-red-500">
                          {children}
                        </ul>
                      ),

                      ol: ({ children }) => (
                        <ol className="mb-4 ml-6 list-decimal space-y-2 marker:font-semibold marker:text-red-400">
                          {children}
                        </ol>
                      ),

                      li: ({ children }) => (
                        <li className="pl-1 leading-7">
                          {children}
                        </li>
                      ),

                      blockquote: ({ children }) => (
                        <blockquote className="my-4 border-l-4 border-red-500 bg-slate-900/70 px-4 py-3 text-slate-300">
                          {children}
                        </blockquote>
                      ),

                      hr: () => (
                        <hr className="my-5 border-slate-700" />
                      ),

                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-red-400 underline decoration-red-500/50 underline-offset-4 transition hover:text-red-300"
                        >
                          {children}
                        </a>
                      ),

                      table: ({ children }) => (
                        <div className="my-5 overflow-x-auto rounded-lg border border-slate-700">
                          <table className="min-w-full border-collapse text-left text-sm">
                            {children}
                          </table>
                        </div>
                      ),

                      thead: ({ children }) => (
                        <thead className="bg-slate-900 text-white">
                          {children}
                        </thead>
                      ),

                      tbody: ({ children }) => (
                        <tbody className="divide-y divide-slate-700">
                          {children}
                        </tbody>
                      ),

                      tr: ({ children }) => (
                        <tr className="transition hover:bg-slate-700/30">
                          {children}
                        </tr>
                      ),

                      th: ({ children }) => (
                        <th className="border-r border-slate-700 px-4 py-3 font-semibold last:border-r-0">
                          {children}
                        </th>
                      ),

                      td: ({ children }) => (
                        <td className="border-r border-slate-700 px-4 py-3 align-top last:border-r-0">
                          {children}
                        </td>
                      ),

                      code: ({ children }) => (
                        <code className="rounded bg-slate-950 px-1.5 py-0.5 font-mono text-sm text-red-300">
                          {children}
                        </code>
                      ),

                      pre: ({ children }) => (
                        <pre className="my-4 overflow-x-auto rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm leading-6">
                          {children}
                        </pre>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>

                  {isCurrentStreamingMessage && (
                    <span
                      className="ml-1 inline-block animate-pulse text-red-400"
                      aria-hidden="true"
                    >
                      ▍
                    </span>
                  )}
                </div>
              ) : (
                <p className="whitespace-pre-wrap">
                  {message.content}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300"
        >
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={askQuestion}
        className="mt-8 flex flex-col gap-3 sm:flex-row"
      >
        <input
          value={question}
          onChange={(event) =>
            setQuestion(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Ask PoliticalPulse..."
          disabled={isLoading}
          aria-label="Ask a question about this report"
          className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        />

        {isLoading ? (
          <button
            type="button"
            onClick={stopResponse}
            className="rounded-xl border border-slate-600 bg-slate-800 px-6 py-3 font-bold text-white transition hover:bg-slate-700"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={
              !question.trim() ||
              !reportContext.trim()
            }
            className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Ask
          </button>
        )}
      </form>

      <p className="mt-3 text-xs text-slate-500">
        AI-generated responses may contain errors. Review
        the report evidence and cited sources when making
        conclusions.
      </p>
    </section>
  );
}