export const benchmarkDimensions = [
  {
    key: "compliance-fidelity",
    title: "Compliance Fidelity",
    description: "How accurately applicable requirements are identified, validated, and supported by evidence.",
  },
  {
    key: "tender-discovery",
    title: "Tender Discovery",
    description: "How precisely relevant opportunities are identified for a specific organization and its capabilities.",
  },
  {
    key: "complication-resolution",
    title: "Complication Resolution",
    description:
      "How effectively eligibility gaps, compliance issues, and recoverable complications are identified and resolved.",
  },
  {
    key: "strategy-quality",
    title: "Strategy Quality",
    description:
      "How useful, defensible, and competitive the resulting bid strategy is when reviewed by experienced tender professionals.",
  },
  {
    key: "time-to-first-draft",
    title: "Time to First Draft",
    description: "How quickly a review-ready proposal can be produced from the start of the workflow.",
  },
  {
    key: "value-for-money",
    title: "Value for Money",
    description: "The capability delivered relative to the cost of using the platform.",
  },
] as const;

export type BenchmarkDimensionKey = (typeof benchmarkDimensions)[number]["key"];

export const benchmarkTitleByKey: Record<BenchmarkDimensionKey, string> = Object.fromEntries(
  benchmarkDimensions.map((d) => [d.key, d.title]),
) as Record<BenchmarkDimensionKey, string>;
