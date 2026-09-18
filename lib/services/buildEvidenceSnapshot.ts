import type { EvidenceBrief } from "@/app/types/report";
import type { EvidenceSnapshotV1 } from "@/lib/db/evidence";
import type { EvidenceSource } from "@/lib/services/evidenceContext";

import {
  type StorySnapshotInput,
  type StorySnapshotInputSource,
} from "./storySnapshotInput";
import { tryBuildStoryKey } from "./storyKey";

function cleanText(value: string | null | undefined) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

export function createStorySnapshotInput(input: {
  primary: {
    url: string;
    title: string;
    sourceName: string;
    publishedAt?: string;
  };
  sources: EvidenceSource[];
  brief: EvidenceBrief;
}): StorySnapshotInput {
  return {
    primary: {
      url: cleanText(input.primary.url),
      title: cleanText(input.primary.title),
      sourceName: cleanText(input.primary.sourceName),
      publishedAt: cleanText(input.primary.publishedAt),
    },
    sources: input.sources.map((source) => ({
      sourceId: cleanText(source.sourceId),
      url: cleanText(source.url),
      sourceName: cleanText(source.sourceName),
      publishedAt: cleanText(source.publishedAt),
      title: cleanText(source.title),
      isPrimary: Boolean(source.isPrimary),
    })),
    brief: {
      corroboratedFacts: input.brief.corroboratedFacts.map((fact) => ({
        text: cleanText(fact.text),
        supportedBy: fact.supportedBy.map((name) => cleanText(name)).filter(Boolean),
        evidence: fact.evidence.map((item) => ({
          sourceId: cleanText(item.sourceId),
          publisher: cleanText(item.publisher),
          supportText: cleanText(item.supportText),
          supportField: item.supportField,
        })),
      })),
      uncertainties: input.brief.uncertainties.map((item) => cleanText(item)).filter(Boolean),
      coverageDifferences: input.brief.coverageDifferences.map((item) => ({
        text: cleanText(item.text),
        representedBy: item.representedBy
          .map((name) => cleanText(name))
          .filter(Boolean),
      })),
      independentSourceCount: input.brief.independentSourceCount,
      limitedEvidence: input.brief.limitedEvidence,
    },
  };
}

function sourceUrlById(sources: StorySnapshotInputSource[]) {
  const lookup = new Map<string, string>();

  for (const source of sources) {
    const sourceId = source.sourceId.trim().toUpperCase();
    const url = tryBuildStoryKey(source.url);

    if (!sourceId || !url) {
      continue;
    }

    lookup.set(sourceId, url);
  }

  return lookup;
}

export function buildEvidenceSnapshot(
  input: StorySnapshotInput
): EvidenceSnapshotV1 | null {
  const primaryUrl = tryBuildStoryKey(input.primary.url);

  if (!primaryUrl) {
    return null;
  }

  const primaryTitle = cleanText(input.primary.title);

  if (!primaryTitle) {
    return null;
  }

  const urlsBySourceId = sourceUrlById(input.sources);
  const sources: EvidenceSnapshotV1["sources"] = [];
  const seenSourceUrls = new Set<string>();

  for (const source of input.sources) {
    const url = tryBuildStoryKey(source.url);

    if (!url || seenSourceUrls.has(url)) {
      continue;
    }

    seenSourceUrls.add(url);
    sources.push({
      url,
      sourceName: cleanText(source.sourceName),
      publishedAt: cleanText(source.publishedAt),
      title: cleanText(source.title),
      isPrimary: Boolean(source.isPrimary),
    });
  }

  if (sources.length === 0) {
    return null;
  }

  const facts: EvidenceSnapshotV1["facts"] = [];

  for (const fact of input.brief.corroboratedFacts) {
    const text = cleanText(fact.text);

    if (!text) {
      continue;
    }

    const support: EvidenceSnapshotV1["facts"][number]["support"] = [];
    const seenSupport = new Set<string>();

    for (const item of fact.evidence) {
      const url = urlsBySourceId.get(item.sourceId.trim().toUpperCase());

      if (!url) {
        continue;
      }

      const fragment = cleanText(item.supportText);
      const publisher = cleanText(item.publisher);
      const field = item.supportField;

      if (!fragment || (field !== "title" && field !== "description")) {
        continue;
      }

      const supportKey = `${url}|${field}|${fragment}`;

      if (seenSupport.has(supportKey)) {
        continue;
      }

      seenSupport.add(supportKey);
      support.push({
        url,
        publisher,
        fragment,
        field,
      });
    }

    if (support.length === 0) {
      continue;
    }

    facts.push({
      text,
      publishers: fact.supportedBy.map((name) => cleanText(name)).filter(Boolean),
      support,
    });
  }

  return {
    primary: {
      url: primaryUrl,
      title: primaryTitle,
      sourceName: cleanText(input.primary.sourceName),
      publishedAt: cleanText(input.primary.publishedAt),
    },
    sources,
    facts,
    uncertainties: input.brief.uncertainties
      .map((item) => cleanText(item))
      .filter(Boolean),
    coverageDifferences: input.brief.coverageDifferences
      .map((item) => ({
        text: cleanText(item.text),
        publishers: item.representedBy
          .map((name) => cleanText(name))
          .filter(Boolean),
      }))
      .filter((item) => item.text),
    independentSourceCount: input.brief.independentSourceCount,
    limitedEvidence: input.brief.limitedEvidence,
  };
}
