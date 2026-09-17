import type { ReactNode } from "react";

export function isPlaceholderText(value: string): boolean {
  const lower = value.toLowerCase();

  return (
    lower.includes("is not available") ||
    lower.includes("could not generate") ||
    lower.includes("could not determine") ||
    lower.includes("could not be determined") ||
    lower.includes("potential areas of agreement") ||
    lower.includes("additional reporting may change")
  );
}

const EVIDENCE_SOURCE_CITATION =
  /[ \t]*[[(][ \t]*S\d+(?:[ \t]*,[ \t]*S\d+)*[ \t]*[\])]/gi;

export function stripEvidenceSourceCitations(value: string): string {
  return value
    .replace(EVIDENCE_SOURCE_CITATION, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+([.,;:!?])/g, "$1")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function usableText(value: string | undefined): string | null {
  const trimmed = value?.trim();

  if (!trimmed || isPlaceholderText(trimmed)) {
    return null;
  }

  return trimmed;
}

export function readerFacingBriefText(
  value: string | undefined
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  return usableText(stripEvidenceSourceCitations(value));
}

export function usableList(items: string[] | undefined): string[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => item.trim())
    .filter((item) => item && !isPlaceholderText(item));
}

export function BriefSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="py-8">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#55C8FF]">
        {title}
      </h2>

      <div className="mt-4">{children}</div>
    </section>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex items-start gap-3 text-base leading-7 text-[#D5E0EC]"
        >
          <span
            aria-hidden="true"
            className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#55C8FF]"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
