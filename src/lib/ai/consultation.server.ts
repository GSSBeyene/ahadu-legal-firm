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
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { data: saved, error: saveError } = await supabaseAdmin.from('consultations').insert({ client_name: d.name, phone: d.phone, matter_type: d.area, issue: d.issue }).select('id').single();
  if (saveError || !saved) return Response.json({ error: 'Your consultation could not be saved. Please try again before preparing a summary.' }, { status: 503 });

  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    instructions: INSTRUCTIONS,
    messages: [{ role: "user", content: `Name: ${d.name}\nPhone: ${d.phone}\nArea selected: ${d.area || "Not sure"}\n\nIssue:\n${d.issue}` }],
    abortSignal: request.signal,
    maxRetries: 0,
    providerOptions: {
      openai: { store: false, forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", include: ["reasoning.encrypted_content"] },
    },
  });
  const enc = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let summary = '';
      try {
        for await (const part of result.fullStream) {
          if (part.type === "text-delta") { summary += part.text; controller.enqueue(enc.encode(part.text)); }
          else if (part.type === "error") throw part.error;
        }
        if (request.signal.aborted) throw new DOMException('Cancelled', 'AbortError');
        if (!summary.trim()) throw new Error('Empty summary');
        const { error } = await supabaseAdmin.from('consultations').update({ summary, generation_status: 'ready' }).eq('id', saved.id);
        if (error) throw new Error('Summary save failed');
        controller.enqueue(enc.encode('\n\n[[SAVED]]'));
      } catch (error) {
        await supabaseAdmin.from('consultations').update({ generation_status: request.signal.aborted ? 'cancelled' : 'failed' }).eq('id', saved.id);
        if (request.signal.aborted) { controller.close(); return; }
        const status = (error as { statusCode?: number }).statusCode;
        const msg = status === 402 ? "The AI service is out of credits right now. Your issue is saved for the team." : status === 429 ? "Too many requests — please try again in a minute. Your issue is saved." : "The summary could not be completed and saved. Your original issue is saved for the team; please call us instead.";
        controller.enqueue(enc.encode(`\n\n[[ERROR]]${msg}`));
      }
      controller.close();
    },
  });
  return withLovableAiGatewayRunIdHeader(
    new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache, no-transform" } }),
    runIdFetch,
  );
}
