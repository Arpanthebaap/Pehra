import { NextResponse } from "next/server";
import { z } from "zod";
import { answerDocumentQuestion } from "@/lib/qa";
import { clientKey, rateLimit } from "@/lib/ratelimit";
import { GeminiCallError, GeminiConfigError } from "@/lib/gemini";
import { MAX_DOCUMENT_CHARS } from "@/lib/schema";

export const runtime = "nodejs";
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

const askRequestSchema = z.object({
  documentText: z
    .string({ required_error: "Document text is required." })
    .min(30, "Document text is too short to answer questions about.")
    .max(MAX_DOCUMENT_CHARS, `Document exceeds ${MAX_DOCUMENT_CHARS} characters.`),
  question: z
    .string({ required_error: "Question is required." })
    .min(5, "Question is too short.")
    .max(500, "Question is too long (maximum 500 characters)."),
  language: z.enum(["en", "hi", "bn"]).default("en"),
});

export async function POST(request: Request) {
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
  if (contentLength > 150_000) {
    return fail("Payload too large. Please paste only the relevant document portions.", 413);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("The request body was not valid JSON.", 400);
  }

  const parsed = askRequestSchema.safeParse(body);
  if (!parsed.success) {
    return fail(
      parsed.error.issues[0]?.message ?? "Invalid question request.",
      400,
    );
  }

  const sanitize = (str: string) =>
    str
      .normalize("NFKC")
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
      .trim();

  const safeDocument = sanitize(parsed.data.documentText);
  const safeQuestion = sanitize(parsed.data.question);

  if (safeDocument.length < 30) {
    return fail("Document text is too short.", 400);
  }
  if (safeQuestion.length < 5) {
    return fail("Question is too short.", 400);
  }

  try {
    const result = await answerDocumentQuestion({
      documentText: safeDocument,
      question: safeQuestion,
      language: parsed.data.language,
    });

    return NextResponse.json(result, { headers: NO_STORE });
  } catch (error) {
    if (error instanceof GeminiConfigError) {
      console.error("[pehra:ask] configuration error:", error.message);
      return fail("Pehra is not configured correctly. The site owner has been notified.", 503);
    }
    if (error instanceof GeminiCallError) {
      console.error("[pehra:ask] model error:", error.message);
      return fail("Pehra could not finish answering that question. Try again in a moment.", 502);
    }
    console.error("[pehra:ask] unexpected error:", error);
    return fail("Something went wrong while answering that question.", 500);
  }
}

export async function GET() {
  return fail("Send a POST request with documentText and question.", 405, {
    Allow: "POST",
  });
}
