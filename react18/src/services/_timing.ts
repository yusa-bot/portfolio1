export function startTiming() {
  return { map: new Map() };
}

export async function withServerTiming(name, ctx, fn) {
  const t0 = performance.now();
  try {
    return await fn();
  } finally {
    const dur = Math.round(performance.now() - t0);
    ctx.map.set(name, (ctx.map.get(name) ?? 0) + dur);
  }
}

export function timingHeaders(ctx) {
  const h = new Headers();
  if (ctx.map.size) {
    h.set("Server-Timing", [...ctx.map.entries()].map(([k, v]) => `${k};dur=${v}`).join(", "));
  }

  // 実行リージョン情報
  h.set("X-Region", "edge-us-east-1");

  // キャッシュ状態（サンプル）
  h.set("X-Cache", Math.random() > 0.5 ? "HIT" : "MISS");

  return h;
}
