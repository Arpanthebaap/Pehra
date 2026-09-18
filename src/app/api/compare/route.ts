import { NextResponse } from "next/server";
import { z } from "zod";
import { compareDocuments } from "@/lib/compare";
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

const compareRequestSchema = z.object({
  originalText: z
    .string({ required_error: "Original document text is required." })
    .min(30, "Original document is too short to compare.")
    .max(MAX_DOCUMENT_CHARS, `Original document exceeds ${MAX_DOCUMENT_CHARS} characters.`),
  modifiedText: z
    .string({ required_error: "Modified document text is required." })
    .min(30, "Modified document is too short to compare.")
    .max(MAX_DOCUMENT_CHARS, `Modified document exceeds ${MAX_DOCUMENT_CHARS} characters.`),
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
  if (contentLength > 200_000) {
    return fail("Payload too large. Please paste only the relevant portions.", 413);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("The request body was not valid JSON.", 400);
  }

  const parsed = compareRequestSchema.safeParse(body);
  if (!parsed.success) {
    return fail(
      parsed.error.issues[0]?.message ?? "Invalid comparison request.",
      400,
    );
  }

  const sanitize = (str: string) =>
    str
      .normalize("NFKC")
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
      .trim();

  const safeOriginal = sanitize(parsed.data.originalText);
  const safeModified = sanitize(parsed.data.modifiedText);

  if (safeOriginal.length < 30 || safeModified.length < 30) {
    return fail("Both documents must contain at least 30 characters.", 400);
  }

  try {
    const result = await compareDocuments({
      originalText: safeOriginal,
      modifiedText: safeModified,
      language: parsed.data.language,
    });

    return NextResponse.json(result, { headers: NO_STORE });
  } catch (error) {
    if (error instanceof GeminiConfigError) {
      console.error("[pehra:compare] configuration error:", error.message);
      return fail("Pehra is not configured correctly. The site owner has been notified.", 503);
    }
    if (error instanceof GeminiCallError) {
      console.error("[pehra:compare] model error:", error.message);
      return fail("Pehra could not finish comparing those documents. Try again in a moment.", 502);
    }
    console.error("[pehra:compare] unexpected error:", error);
    return fail("Something went wrong while comparing those documents.", 500);
  }
}

export async function GET() {
  return fail("Send a POST request with originalText and modifiedText.", 405, {
    Allow: "POST",
  });
}
