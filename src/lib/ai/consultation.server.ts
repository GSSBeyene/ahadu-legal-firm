import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "./run-id.server";

const Input = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(5).max(30),
  area: z.string().trim().max(60),
  issue: z.string().trim().min(20).max(4000),
});

const INSTRUCTIONS = `You are an intake assistant for Ahadu Law Firm, an Ethiopian law firm.
Turn a prospective client's description of their legal issue into a concise consultation summary for the firm's advocates.
Use these markdown sections exactly: "## Client", "## Matter type", "## Summary of facts", "## Key legal issues", "## Urgency", "## Questions to ask at consultation", "## Documents to request".
Be factual; do not invent facts; note missing information. Do not give the client legal advice. Write in English even if the input is in Tigrinya or Amharic (keep names as given). Keep under 400 words.`;

export async function handleConsultation(request: Request) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return Response.json({ error: "AI is not configured." }, { status: 500 });
  const parsed = Input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Please fill in your name, phone and at least a few sentences about your issue." }, { status: 400 });
  const d = parsed.data;

  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  let failure: { status: number; message: string } | undefined;
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    instructions: INSTRUCTIONS,
    messages: [{ role: "user", content: `Name: ${d.name}\nPhone: ${d.phone}\nArea selected: ${d.area || "Not sure"}\n\nIssue:\n${d.issue}` }],
    abortSignal: request.signal,
    maxRetries: 0,
    providerOptions: {
      openai: { store: false, forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", include: ["reasoning.encrypted_content"] },
    },
    onError: ({ error }) => {
      const e = error as { statusCode?: number; message?: string };
      failure = { status: e.statusCode ?? 500, message: e.message ?? "AI error" };
      console.error("consultation AI error", error);
    },
  });
  const res = result.toTextStreamResponse();
  void failure;
  return withLovableAiGatewayRunIdHeader(res, runIdFetch);
}
