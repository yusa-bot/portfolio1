import { NextRequest } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const EmailSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  company: z.string().optional(),
  subject: z.string().min(1, "件名は必須です"),
  message: z.string().min(1, "メッセージは必須です"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = EmailSchema.parse(body);

    const data = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'yusaaihara3@gmail.com',
      subject: `Contact from ${validatedData.name}: ${validatedData.subject}`,
      html: `
        <h2>新しいお問い合わせ</h2>
        <p><strong>名前:</strong> ${validatedData.name}</p>
        <p><strong>メール:</strong> ${validatedData.email}</p>
        <p><strong>会社:</strong> ${validatedData.company || '未入力'}</p>
        <p><strong>件名:</strong> ${validatedData.subject}</p>
        <p><strong>メッセージ:</strong></p>
        <p>${validatedData.message}</p>
      `,
    });

    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify({
        error: 'バリデーションエラー',
        details: error.errors
      }), { status: 400 });
    }
    console.error('Email sending error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
