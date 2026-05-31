import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiKey = process.env.SEALION_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "SEALION_API_KEY is not configured" }, { status: 500 });
  }

  const body = await req.json();

  const upstream = await fetch("https://api.sea-lion.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "aisingapore/Qwen-SEA-LION-v4-32B-IT",
      messages: body.messages,
      stream: true,
      max_completion_tokens: 4096,
    }),
  });

  if (!upstream.ok) {
    const err = await upstream.text();
    return NextResponse.json({ error: err }, { status: upstream.status });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
