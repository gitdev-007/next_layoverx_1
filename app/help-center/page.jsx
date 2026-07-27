'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Headset, Mail, Phone, MessageSquare } from 'lucide-react';

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen pb-16 bg-slate-50">
      <Container className="pt-8">
        <div className="max-w-3xl mx-auto text-center">
          <Headset className="w-12 h-12 text-[#0369a1] mx-auto mb-3" />
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">LayoverX Help Center & Airport Assistance</h1>
          <p className="text-sm text-slate-500 mb-8">24/7 Support Desk for Mumbai Airport Travelers.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <Card className="p-6 bg-white border border-slate-200">
              <Phone className="w-6 h-6 text-[#0369a1] mb-2" />
              <h3 className="font-bold text-slate-900 text-base mb-1">Airport Emergency Phone Hotline</h3>
              <p className="text-xs text-slate-500 mb-4">+91 22 1234 5678 (24/7 Desk)</p>
              <Button href="tel:+912212345678" variant="outline" size="sm" className="w-full">
                Call Concierge
              </Button>
            </Card>

            <Card className="p-6 bg-white border border-slate-200">
              <Mail className="w-6 h-6 text-[#0369a1] mb-2" />
              <h3 className="font-bold text-slate-900 text-base mb-1">Email Priority Support</h3>
              <p className="text-xs text-slate-500 mb-4">hello@layoverx.com</p>
              <Button href="mailto:hello@layoverx.com" variant="outline" size="sm" className="w-full">
                Send Email
              </Button>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
