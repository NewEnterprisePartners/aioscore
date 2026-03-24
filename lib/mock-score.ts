import { ScanResultPayload } from "@/types";

export function buildMockScore(url: string): ScanResultPayload {
  const hostBias = Math.min(8, Math.max(1, url.length % 10));

  return {
    summary:
      "Your site has a strong technical baseline but can improve structured entity signals and LLM-friendly answer formatting.",
    overallScore: 68 + hostBias,
    categories: {
      ai_readability: {
        score: 70 + hostBias,
        findings: [
          "Readable heading hierarchy on primary pages.",
          "Content chunking is present but inconsistent.",
          "Some pages exceed optimal paragraph density for AI extraction."
        ],
        recommendations: [
          "Add concise answer blocks to key transactional pages.",
          "Normalize semantic heading patterns across templates.",
          "Introduce summary snippets above long-form sections."
        ]
      },
      geo: {
        score: 62 + hostBias,
        findings: [
          "Metadata is complete on top pages.",
          "FAQ schema coverage is low.",
          "Weak query-intent mapping for comparison keywords."
        ],
        recommendations: [
          "Deploy FAQ + HowTo schema on strategic pages.",
          "Create comparison pages for high-intent prompts.",
          "Track AI answer inclusion by prompt clusters."
        ]
      },
      technical_ai_accessibility: {
        score: 74,
        findings: ["Robots directives are clear.", "Sitemap exists and is discoverable.", "Canonical tags found on major templates."],
        recommendations: [
          "Audit JavaScript-heavy routes for crawler fallback content.",
          "Add llms.txt and evaluate AI crawler policy strategy.",
          "Improve internal linking depth for orphan resources."
        ]
      },
      entity_authority: {
        score: 59,
        findings: ["Brand entity references are sparse.", "Social profile links are present.", "Organization schema is only partially implemented."],
        recommendations: [
          "Expand organization and person schema coverage.",
          "Align external listings with canonical brand identity.",
          "Create an authoritative knowledge hub page."
        ]
      },
      seo_foundations: {
        score: 76,
        findings: ["Core pages include title and meta descriptions.", "Most key pages have indexable status.", "Page performance is moderate on mobile."],
        recommendations: [
          "Improve LCP and CLS for mobile entry pages.",
          "Reduce duplicate title patterns in long-tail templates.",
          "Strengthen internal anchor diversity for cornerstone pages."
        ]
      }
    },
    competitorBenchmark: [
      "Competitor A appears in 32% more AI answer snapshots.",
      "Competitor B has stronger entity consistency.",
      "Your technical crawl depth is above category median."
    ],
    fullActionPlan: [
      "Week 1: Deploy schema and answer block templates.",
      "Week 2: Publish GEO comparison pages.",
      "Week 3: Ship entity authority enhancements and monitor uplift."
    ]
  };
}
