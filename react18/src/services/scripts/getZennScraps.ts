import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "npm:zod";

// リクエストペイロードのスキーマ
const RequestPayloadSchema = z.object({
    username: z.string().min(1),
});

// Zenn Scrap APIのレスポンススキーマ
const ZennScrapSchema = z.object({
    id: z.number(),
    title: z.string(),
    slug: z.string(),
    published_at: z.string(),
    body_letters_count: z.number().optional(),
    path: z.string(),
}).passthrough(); // 未知のフィールドも許可

const ZennScrapsResponseSchema = z.object({
    scraps: z.array(ZennScrapSchema),
}).passthrough(); // 未知のフィールドも許可

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

        console.log(JSON.stringify({ level: 'info', message: 'Fetching Zenn scraps for user', username }));
        const apiResponse = await fetch(`https://zenn.dev/api/scraps?username=${username}`);

        if (!apiResponse.ok) {
            console.error(JSON.stringify({ level: 'error', message: 'Failed to fetch from Zenn Scraps API', status: apiResponse.status, username }));
            return new Response(JSON.stringify({ error: "Failed to fetch scraps from Zenn" }), {
                status: apiResponse.status,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const data = await apiResponse.json();

        // デバッグ用: 実際のレスポンス構造をログ出力
        console.log(JSON.stringify({ level: 'debug', message: 'Zenn Scraps API raw response', data: JSON.stringify(data).substring(0, 500) }));

        // サーバー側でZodによるレスポンス検証を実行
        const validationResult = ZennScrapsResponseSchema.safeParse(data);
        if (!validationResult.success) {
            console.error(JSON.stringify({ level: 'error', message: 'Zenn Scraps API response validation failed', error: validationResult.error.issues }));
            // 検証に失敗した場合でも、基本的な構造チェックのみ行って続行
            if (data && typeof data === 'object' && Array.isArray(data.scraps)) {
                console.log(JSON.stringify({ level: 'warn', message: 'Using fallback validation for Zenn Scraps API' }));
                return new Response(JSON.stringify(data), {
                    status: 200,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }
            return new Response(JSON.stringify({ error: "Invalid data structure from Zenn Scraps API" }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify(validationResult.data), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error(JSON.stringify({ level: 'error', message: 'Error in getZennScraps function', error: error.message }));
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
