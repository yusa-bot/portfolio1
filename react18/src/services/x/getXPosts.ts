import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "npm:zod";

// リクエストペイロードのスキーマ
const RequestPayloadSchema = z.object({
    username: z.string().min(1),
});

// 注意: 実際のX APIは認証が必要です。これはモックデータを返すサンプルです
const XPostSchema = z.object({
    content: z.string(),
    created_at: z.string(),
    url: z.string(),
    engagement: z.object({
        likes: z.number(),
        retweets: z.number(),
    }).optional(),
});

const XResponseSchema = z.array(XPostSchema);

Deno.serve(async (req) => {
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };

    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const payload = await req.json();

        const payloadValidation = RequestPayloadSchema.safeParse(payload);
        if (!payloadValidation.success) {
            return new Response(JSON.stringify({ error: "Username is required" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const { username } = payloadValidation.data;

        // 注意: 実際の実装では、X API v2を使用する必要があります
        // ここではサンプルデータを返しています
        const mockPosts = [
            {
                content: "技術の進歩について考えていました。AIとの共存は単なる効率化だけでなく、創造性の拡張でもあると思います。",
                created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                url: `https://twitter.com/${username}/status/1234567890`,
                engagement: { likes: 12, retweets: 3 }
            },
            {
                content: "プロダクト開発で大切なのは、ユーザーの本質的な課題を理解すること。表面的な要望に惑わされず、根本的な問題解決を目指したい。",
                created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
                url: `https://twitter.com/${username}/status/1234567891`,
                engagement: { likes: 28, retweets: 7 }
            },
            {
                content: "今日のコードレビューで学んだこと：シンプルなコードが最も美しい。複雑さは必要最小限に抑えるのが鉄則。",
                created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                url: `https://twitter.com/${username}/status/1234567892`,
                engagement: { likes: 45, retweets: 12 }
            },
            {
                content: "新しいフレームワークを学習中。学び続けることで視野が広がり、問題解決の選択肢が増える実感があります。",
                created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                url: `https://twitter.com/${username}/status/1234567893`,
                engagement: { likes: 18, retweets: 4 }
            }
        ];

        const validationResult = XResponseSchema.safeParse(mockPosts);
        if (!validationResult.success) {
            return new Response(JSON.stringify({ error: "Invalid mock data structure" }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify(validationResult.data), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error(JSON.stringify({ level: 'error', message: 'Error in getXPosts function', error: error.message }));
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
