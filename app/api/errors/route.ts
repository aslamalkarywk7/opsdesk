import { NextResponse } from "next/server";
import { z } from "zod";
import { reportError } from "@/lib/errors";

// POST /api/errors { scope, message } - client error beacon. Always 202.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = z
      .object({ scope: z.string().max(80), message: z.string().max(500) })
      .safeParse(body);
    if (parsed.success) reportError(parsed.data.scope, new Error(parsed.data.message));
  } catch {
    // never fail the beacon
  }
  return NextResponse.json({ received: true }, { status: 202 });
}
