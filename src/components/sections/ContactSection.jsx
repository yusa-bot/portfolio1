
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MessageSquare, User, Building } from 'lucide-react';
import { Contact } from '@/api/entities';
import { SendEmail } from '@/api/integrations';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // お問い合わせをデータベースに保存
      await Contact.create(formData);
      
      // 自分宛にメール通知を送信
      await SendEmail({
        to: 'your-email@example.com', // 実際のメールアドレスに変更してください
        subject: `ポートフォリオサイトからお問い合わせ: ${formData.subject}`,
        body: `
お問い合わせがありました。

お名前: ${formData.name}
メールアドレス: ${formData.email}
会社名: ${formData.company || '未入力'}
件名: ${formData.subject}

メッセージ:
${formData.message}
        `
      });

      window.alert("送信完了\n\nお問い合わせありがとうございます。後日ご連絡いたします。");

      // フォームをリセット
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      window.alert("送信エラー\n\n送信に失敗しました。しばらく時間をおいて再度お試しください。");
    }

    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-extralight text-slate-800 mb-16 text-center tracking-tight">
            Contact
          </h2>
          
          <div className="bg-slate-50 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-lg text-slate-600 font-light">
                プロジェクトのご相談やお仕事のご依頼など、お気軽にお問い合わせください。
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    お名前 *
                  </Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-white border-slate-200 focus:border-blue-400"
                    placeholder="山田太郎"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    メールアドレス *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-white border-slate-200 focus:border-blue-400"
                    placeholder="example@company.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company" className="text-slate-700 flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  会社名・組織名
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="bg-white border-slate-200 focus:border-blue-400"
                  placeholder="株式会社サンプル"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-slate-700 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  件名 *
                </Label>
                <Input
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="bg-white border-slate-200 focus:border-blue-400"
                  placeholder="プロジェクトのご相談"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="text-slate-700">
                  メッセージ *
                </Label>
                <Textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="bg-white border-slate-200 focus:border-blue-400"
                  placeholder="お問い合わせ内容をご記入ください..."
                />
              </div>
              
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-light py-3"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      送信中...
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      送信する
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
