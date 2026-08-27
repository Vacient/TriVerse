import { generatePlan } from "@/lib/engine";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    const { originId, destinationId, startDate, days, budget, travelers, preferences } =
      body || {};

    if (!destinationId || !startDate) {
      return Response.json({ ok: false, error: "destinationId and startDate are required." }, { status: 400 });
    }

    // Simulate a short Atlas Agent computation window server-side.
    await new Promise((r) => setTimeout(r, 350));

    const draft = generatePlan({
      originId,
      destinationId,
      startDate,
      days,
      budget,
      travelers,
      preferences,
    });

    return Response.json({ ok: true, draft });
  } catch (err) {
    return Response.json(
      { ok: false, error: "Atlas Agent could not process this request." },
      { status: 500 }
    );
  }
}
