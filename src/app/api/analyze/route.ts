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
  // Prevent cross-site abuse via Fetch Metadata
  const secFetchSite = request.headers.get("sec-fetch-site");
  if (secFetchSite === "cross-site") {
    return fail("Cross-site requests are not permitted.", 403);
  }

  const limit = rateLimit(clientKey(request.headers));
  if (!limit.allowed) {
    return fail(
      `Too many requests. Try again in ${limit.retryAfterSeconds} seconds.`,
      429,
      { "Retry-After": String(limit.retryAfterSeconds) },
    );
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 100_000) {
    return fail("Payload too large. Please paste only the relevant portions.", 413);
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

  // Security: Normalize Unicode and strip non-printable control characters
  const sanitizedText = parsed.data.text
    .normalize("NFKC")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();

  if (sanitizedText.length < 40) {
    return fail("That document is too short to read. Paste the full agreement or section.", 400);
  }

  const language = parsed.data.language;

  // The client's date is a convenience, not a trust boundary. An unparseable or
  // absent value falls back to server time rather than failing the request.
  const today = (parsed.data.today && parseIsoDate(parsed.data.today)) || new Date();
  const todayIso = toIsoDate(today);

  try {
    const output = await analyzeDocument({ text: sanitizedText, language, today: todayIso });

    const { findings, discarded } = groundFindings(output.findings, language);
    const deadlines = buildClock(output.events, today, language);

    return NextResponse.json(
      {
        documentKind: output.documentKind,
        summary: output.summary,
        findings,
        deadlines,
        urgent: mostUrgent(deadlines),
        questionsForALawyer: output.questionsForALawyer,
        inconsistencies: output.inconsistencies || [],
        optionsAndNextSteps: output.optionsAndNextSteps || [],
        actionableChecklist: output.actionableChecklist || [],
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
