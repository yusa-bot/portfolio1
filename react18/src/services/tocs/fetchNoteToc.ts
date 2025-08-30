import { z } from "npm:zod";

function decodeEntities(str = "") {
  return str
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, " ");
}

function stripTags(html = "") {
  return decodeEntities(html.replace(/<[^>]*>/g, "")).trim();
}

function slugify(text = "") {
  return text
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036F]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\u3040-\u30ff\u4e00-\u9faf\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function extractTitle(html = "") {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (m && m[1]) return stripTags(m[1]);
  const og = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["'][^>]*>/i);
  if (og && og[1]) return decodeEntities(og[1]).trim();
  return "";
}

function extractHeadingsFromHtml(html = "") {
  const toc = [];
  const re = /<h([1-3])([^>]*)>([\s\S]*?)<\/h\1>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const level = parseInt(m[1], 10);
    const attrs = m[2] || "";
    const inner = m[3] || "";
    const text = stripTags(inner);
    if (!text) continue;

    let id = "";
    const idMatch = attrs.match(/\sid=["']([^"']+)["']/i);
    if (idMatch && idMatch[1]) {
      id = idMatch[1];
    } else {
      id = slugify(text);
    }
    toc.push({ id, text, level });
  }
  return toc;
}

const SingleSchema = z.object({
  url: z.string().url()
});

const BatchSchema = z.object({
  urls: z.array(z.string().url()).min(1)
});

Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    let payload = {};
    try {
      payload = await req.json();
    } catch {
      // ignore
    }

    // 単体 or 複数どちらもサポート
    const single = SingleSchema.safeParse(payload);
    const batch = BatchSchema.safeParse(payload);

    if (!single.success && !batch.success) {
      return new Response(JSON.stringify({ error: "Provide { url } or { urls: string[] }" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    async function fetchOne(url) {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Note TOC Bot/1.0)",
          "Accept": "text/html,application/xhtml+xml"
        }
      });
      if (!res.ok) {
        return { url, error: `Failed to fetch HTML (${res.status})` };
      }
      const html = await res.text();
      const title = extractTitle(html);
      const toc = extractHeadingsFromHtml(html);
      return { url, title, toc };
    }

    if (single.success) {
      const item = await fetchOne(single.data.url);
      if (item.error) {
        return new Response(JSON.stringify({ error: item.error }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      return new Response(JSON.stringify({ url: item.url, title: item.title, toc: item.toc }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } else {
      const results = await Promise.all(batch.data.urls.map((u) => fetchOne(u)));
      const okItems = results.filter((r) => !r.error);
      return new Response(JSON.stringify({ items: okItems }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
