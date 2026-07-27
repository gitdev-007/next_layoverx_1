'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pb-16 bg-slate-50">
      <Container className="pt-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Privacy Policy</h1>
          <p className="text-xs text-slate-400 mb-6">Last Updated: June 2026</p>

          <Card className="p-6 md:p-8 bg-white border border-slate-200 space-y-4 text-xs text-slate-600 leading-relaxed">
            <h3 className="text-base font-bold text-slate-900">1. Data Privacy & Storage</h3>
            <p>
              LayoverX respects traveler data privacy. Personal details and flight itineraries are stored securely via encrypted Supabase PostgreSQL database schemas protected with Row Level Security (RLS).
            </p>

            <h3 className="text-base font-bold text-slate-900">2. Flight Tracking Information</h3>
            <p>
              Flight numbers provided during booking are used strictly to query AeroAPI real-time flight status and send automated delay alerts.
            </p>
          </Card>
        </div>
      </Container>
    </div>
  );
}
