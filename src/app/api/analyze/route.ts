import { NextResponse } from "next/server";
import { analyzeRequestSchema, groundFindings } from "@/lib/schema";
import { analyzeDocument, GeminiCallError, GeminiConfigError } from "@/lib/gemini";
import { buildClock, mostUrgent, parseIsoDate, toIsoDate } from "@/lib/clock";
import { clientKey, rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";
/** Nothing here is cacheable, and caching a legal analysis would be a data leak. */
export const dynamic = "force-dynamic";

const NO_STORE = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
} as const;

function fail(message: string, status: number, extra: HeadersInit = {}) {
  return NextResponse.json(
    { error: message },
    { status, headers: { ...NO_STORE, ...extra } },
  );
}

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request.headers));
  if (!limit.allowed) {
    return fail(
      `Too many requests. Try again in ${limit.retryAfterSeconds} seconds.`,
      429,
      { "Retry-After": String(limit.retryAfterSeconds) },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("The request body was not valid JSON.", 400);
  }

  const parsed = analyzeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return fail(
      parsed.error.issues[0]?.message ?? "That request could not be read.",
      400,
    );
  }

  const { text, language } = parsed.data;

  // The client's date is a convenience, not a trust boundary. An unparseable or
  // absent value falls back to server time rather than failing the request.
  const today = (parsed.data.today && parseIsoDate(parsed.data.today)) || new Date();
  const todayIso = toIsoDate(today);

  try {
    const output = await analyzeDocument({ text, language, today: todayIso });

    const { findings, discarded } = groundFindings(output.findings);
    const deadlines = buildClock(output.events, today);

    return NextResponse.json(
      {
        documentKind: output.documentKind,
        summary: output.summary,
        findings,
        deadlines,
        urgent: mostUrgent(deadlines),
        questionsForALawyer: output.questionsForALawyer,
        // Surfaced, not swallowed. The UI tells the user when we dropped a claim.
        ungroundedClaimsDiscarded: discarded,
        analysedOn: todayIso,
      },
      { headers: NO_STORE },
    );
  } catch (error) {
    if (error instanceof GeminiConfigError) {
      // Configuration faults are ours, not the user's. Log server-side, stay vague publicly.
      console.error("[pehra] configuration error:", error.message);
      return fail("Pehra is not configured correctly. The site owner has been notified.", 503);
    }
    if (error instanceof GeminiCallError) {
      console.error("[pehra] model error:", error.message);
      return fail("Pehra could not finish reading that document. Try again in a moment.", 502);
    }
    console.error("[pehra] unexpected error:", error);
    return fail("Something went wrong while reading that document.", 500);
  }
}

export async function GET() {
  return fail("Send a POST request with the document text.", 405, {
    Allow: "POST",
  });
}
