import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { contactSchema } from "@/lib/validations";
import { Lead } from "@/models";

export const runtime = "nodejs";

/** In-memory IP rate limit: max 8 submissions / 15 minutes */
const RATE_LIMIT_MAX = 8;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const hits = new Map<string, number[]>();

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          error:
            "Too many inquiries from this network. Please try again later.",
        },
        { status: 429 },
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please check the form fields and try again.",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const data = parsed.data;

    // Honeypot triggered — pretend success without storing
    if (
      (data.website && data.website.length > 0) ||
      (data.companyWebsite && data.companyWebsite.length > 0)
    ) {
      return NextResponse.json({
        ok: true,
        message: "Your inquiry has been saved successfully.",
      });
    }

    await connectToDatabase();

    await Lead.create({
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      reason: data.reason,
      timeframe: data.timeframe,
      preferredRegion: data.preferredRegion || "",
      acquisitionType: data.acquisitionType || "",
      budgetRange: data.budgetRange || "",
      currentStage: data.currentStage || "",
      preferredContactMethod: data.preferredContactMethod || "",
      details: data.details || "",
      consent: true,
      status: "New",
      internalNotes: "",
    });

    return NextResponse.json({
      ok: true,
      message: "Your inquiry has been saved successfully.",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      {
        error:
          "Unable to save your inquiry right now. Please try again later.",
      },
      { status: 500 },
    );
  }
}

/** Reject listing of leads */
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
