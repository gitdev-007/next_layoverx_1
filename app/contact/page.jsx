'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Input } from '@/components/ui/Input';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pb-16 bg-slate-50">
      <Container className="pt-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Contact Us</h1>
          <p className="text-sm text-slate-500 mb-6">Reach out to our Mumbai Airport team for inquiries or partner onboarding.</p>

          <Card className="p-6 md:p-8 bg-white border border-slate-200">
            {submitted ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center text-sm font-bold">
                ✓ Thank you for reaching out! Our team will contact you within 15 minutes.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Your Name" required placeholder="John Doe" />
                <Input label="Your Email" type="email" required placeholder="john@example.com" />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-900">Message</label>
                  <textarea
                    rows={4}
                    required
                    className="w-full text-sm rounded-xl border border-slate-200 p-3"
                    placeholder="How can we assist you?"
                  ></textarea>
                </div>
                <Button type="submit" variant="primary" className="w-full py-3">
                  Send Message
                </Button>
              </form>
            )}
          </Card>
        </div>
      </Container>
    </div>
  );
}
