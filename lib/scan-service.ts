import OpenAI from "openai";
import { buildMockScore } from "@/lib/mock-score";
import { env } from "@/lib/env";
import { ScanResultPayload } from "@/types";

const model = "gpt-4.1-mini";

export async function generateScanResult(url: string): Promise<ScanResultPayload> {
  if (!env.openAiApiKey) {
    return buildMockScore(url);
  }

  try {
    const client = new OpenAI({ apiKey: env.openAiApiKey });
    const response = await client.responses.create({
      model,
      input: [
        {
          role: "system",
          content:
            "You are an AI visibility analyst. Return compact JSON with numeric scores and clear findings/recommendations."
        },
        {
          role: "user",
          content: `Generate an AIO report JSON for ${url} with keys: summary, overallScore, categories(ai_readability,geo,technical_ai_accessibility,entity_authority,seo_foundations), competitorBenchmark, fullActionPlan.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const jsonText = response.output_text;
    const parsed = JSON.parse(jsonText) as ScanResultPayload;

    // TODO: Replace with robust schema validation before production launch.
    return parsed;
  } catch {
    // TODO: Log to observability pipeline and add retry logic.
    return buildMockScore(url);
  }
}
