import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { question } = (await request.json()) as { question: string };
  if (!question?.trim()) return NextResponse.json({ error: "Question required" }, { status: 400 });

  if (!env.openAiApiKey) {
    return NextResponse.json({
      answer:
        "Starter assistant mode: prioritize structured data coverage, answer-first content modules, and stronger entity consistency across key pages."
    });
  }

  const client = new OpenAI({ apiKey: env.openAiApiKey });
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: `User question about improving AIO score: ${question}. Provide concise tactical guidance.`
  });

  return NextResponse.json({ answer: response.output_text });
}
