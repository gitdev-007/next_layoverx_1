'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Clock, Hotel, ArrowRight, AlertCircle } from 'lucide-react';

export default function BookingReviewPage() {
  return (
    <div className="min-h-screen pb-16 bg-slate-50">
      <Container className="pt-8">
        <div className="max-w-2xl mx-auto">
          <Badge variant="secondary" className="mb-3 bg-sky-500/20 text-sky-800 border-sky-300">
            Step 2 of 4: Booking Review & Inventory Lock
          </Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Review Your Booking</h1>

          <Card className="p-6 md:p-8 bg-white border border-slate-200 mb-6">
            <div className="flex items-start gap-4 mb-6 border-b border-slate-100 pb-6">
              <div className="w-16 h-16 rounded-xl bg-sky-100 text-[#0369a1] flex items-center justify-center flex-shrink-0">
                <Hotel className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Niranta Transit Hotel & Lounge</h2>
                <p className="text-xs text-slate-500">CSMIA Terminal 2 (Inside Security)</p>
                <Badge variant="success" className="mt-2 text-[10px]">Slot Temporarily Held for 10:00 Mins</Badge>
              </div>
            </div>

            <div className="space-y-4 mb-6 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
                <div>
                  <span className="text-xs text-slate-500 block uppercase font-bold">Check-In</span>
                  <span className="font-bold text-slate-900">28 July 2026, 12:00 PM</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block uppercase font-bold">Check-Out</span>
                  <span className="font-bold text-slate-900">28 July 2026, 03:00 PM</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500 block uppercase font-bold mb-1">Lead Guest Details</span>
                <p className="font-semibold text-slate-800">John Doe (john.doe@example.com)</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 mb-6 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>3-Hour Transit Slot</span>
                <span className="font-semibold text-slate-900">₹3,499</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Taxes & Airport Surcharge</span>
                <span className="font-semibold text-slate-900">₹420</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-3 text-lg font-extrabold text-slate-900">
                <span>Total Amount Due</span>
                <span className="text-[#0369a1]">₹3,919</span>
              </div>
            </div>

            <Button href="/payment-selection" variant="primary" className="w-full py-3">
              Proceed to Payment <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Card>
        </div>
      </Container>
    </div>
  );
}
