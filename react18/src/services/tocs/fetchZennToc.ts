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
    .replace(/\s+/g, "-");
}

function extractHeadingsFromHtml(bodyHtml = "") {
  const toc = [];
  const re = /<h([1-3])([^>]*)>([\s\S]*?)<\/h\1>/gi;
  let m;
  while ((m = re.exec(bodyHtml)) !== null) {
    const level = parseInt(m[1], 10);
    const attrs = m[2] || "";
    const inner = m[3] || "";
    const text = stripTags(inner);
    if (!text) continue;

    let id = "";
    const idMatch = attrs.match(/\sid="([^"]+)"/i);
    if (idMatch && idMatch[1]) {
      id = idMatch[1];
    } else {
      const anchor = inner.match(/<a[^>]+href=["']#([^"']+)["'][^>]*>/i);
      id = anchor?.[1] || slugify(text);
    }
    toc.push({ id, text, level });
  }
  return toc;
}

const PayloadSchema = z.object({
  username: z.string().min(1),
  count: z.number().int().positive().max(10).optional()
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
      payload = {};
    }

    const url = new URL(req.url);
    const countFromQuery = url.searchParams.get("count");
    const parsed = PayloadSchema.safeParse({
      username: payload.username,
      count: typeof payload.count === "number" ? payload.count : (countFromQuery ? Number(countFromQuery) : undefined)
    });
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid payload. Provide { username, count? }" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const { username, count = 2 } = parsed.data;

    // 1) 記事一覧から最新slug取得（公開記事のみ）
    const listRes = await fetch(`https://zenn.dev/api/articles?username=${encodeURIComponent(username)}`);
    if (!listRes.ok) {
      return new Response(JSON.stringify({ error: `Failed to fetch article list (${listRes.status})` }), {
        status: listRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    const listJson = await listRes.json();
    const articles = Array.isArray(listJson.articles) ? listJson.articles : [];

    const publicArticles = articles
      .filter(a => a && a.slug && a.post_type === "Article" && a.is_suspending_private === false)
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, count);

    // 2) slugごとに詳細取得 → 3) rendered_body/body_html から h1~h3 抽出
    const items = [];
    for (const a of publicArticles) {
      const slug = a.slug;
      const detailRes = await fetch(`https://zenn.dev/api/articles/${slug}`);
      if (!detailRes.ok) {
        items.push({
          slug,
          title: a.title ?? "(no title)",
          url: `https://zenn.dev${a.path ?? `/articles/${slug}`}`,
          toc: []
        });
        continue;
      }
      const detail = await detailRes.json();
      const title = detail?.title ?? a.title ?? "(no title)";
      const urlStr = `https://zenn.dev${detail?.path || a.path || `/articles/${slug}`}`;

      let toc = [];
      if (Array.isArray(detail?.toc) && detail.toc.length > 0) {
        const flatten = (nodes, acc = []) => {
          for (const n of nodes) {
            if (n && typeof n.level === "number" && n.text) {
              if (n.level >= 1 && n.level <= 3) {
                acc.push({ id: n.id || slugify(n.text), text: n.text, level: n.level });
              }
            }
            if (Array.isArray(n.children) && n.children.length) {
              flatten(n.children, acc);
            }
          }
          return acc;
        };
        toc = flatten(detail.toc, []);
      } else {
        const html = detail?.rendered_body || detail?.body_html || "";
        toc = extractHeadingsFromHtml(html);
      }

      toc = toc.filter(h => h.level >= 1 && h.level <= 3);

      items.push({
        slug,
        title,
        url: urlStr,
        toc
      });
    }

    return new Response(JSON.stringify({ items }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
