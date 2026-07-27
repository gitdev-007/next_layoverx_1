'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';

export default function TermsPage() {
  return (
    <div className="min-h-screen pb-16 bg-slate-50">
      <Container className="pt-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Terms of Service</h1>
          <p className="text-xs text-slate-400 mb-6">Last Updated: June 2026</p>

          <Card className="p-6 md:p-8 bg-white border border-slate-200 space-y-4 text-xs text-slate-600 leading-relaxed">
            <h3 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h3>
            <p>
              By accessing LayoverX (layoverx.in), booking micro-stay hotel rooms, dining passes, city tours, or airport transfers near CSMIA Mumbai, you agree to comply with these terms.
            </p>

            <h3 className="text-base font-bold text-slate-900">2. Flight Delay Guarantee & Refund Policy</h3>
            <p>
              If your incoming flight is delayed as verified by AeroAPI flight data and your layover safety window shrinks below 60 minutes, LayoverX will issue a 100% full refund or re-book your slot without penalties.
            </p>

            <h3 className="text-base font-bold text-slate-900">3. Partner Compliance</h3>
            <p>
              All transit hotel, restaurant, and chauffeur service partners are verified for local licensing, safety, and hygiene standards.
            </p>
          </Card>
        </div>
      </Container>
    </div>
  );
}
