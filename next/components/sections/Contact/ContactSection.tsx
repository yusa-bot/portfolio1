"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MessageSquare, User, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('メッセージが送信されました！');
        setFormData({
          name: '',
          email: '',
          company: '',
          subject: '',
          message: ''
        });
      } else {
        const errorData = await response.json();
        alert(`送信に失敗しました: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('送信エラー:', error);
      alert('送信に失敗しました。再度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
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
          <h2 className="text-center mb-16 font-thin md:text-5xl tracking-tighter">
            Contact
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">お名前</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="company">会社名</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('company', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="subject">件名</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('subject', e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="message">メッセージ</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('message', e.target.value)}
                required
                rows={6}
              />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? '送信中...' : '送信'}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
