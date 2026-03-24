export type ScanCategoryKey =
  | "ai_readability"
  | "geo"
  | "technical_ai_accessibility"
  | "entity_authority"
  | "seo_foundations";

export type CategoryResult = {
  score: number;
  findings: string[];
  recommendations: string[];
};

export type ScanResultPayload = {
  summary: string;
  overallScore: number;
  categories: Record<ScanCategoryKey, CategoryResult>;
  competitorBenchmark: string[];
  fullActionPlan: string[];
};

export type PlanType = "free" | "starter" | "pro";
