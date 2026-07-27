'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { CreditCard, Wallet, Smartphone, ShieldCheck, ArrowRight } from 'lucide-react';

export default function PaymentSelectionPage() {
  const [method, setMethod] = useState('razorpay');

  return (
    <div className="min-h-screen pb-16 bg-slate-50">
      <Container className="pt-8">
        <div className="max-w-xl mx-auto">
          <Badge variant="secondary" className="mb-3 bg-sky-500/20 text-sky-800 border-sky-300">
            Step 3 of 4: Select Payment Method
          </Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Choose Payment Option</h1>

          <Card className="p-6 md:p-8 bg-white border border-slate-200 mb-6">
            <div className="space-y-4 mb-6">
              <label
                onClick={() => setMethod('razorpay')}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                  method === 'razorpay' ? 'border-[#0369a1] bg-sky-50/50 ring-2 ring-sky-500/20' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-[#0369a1]" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Razorpay Secure Checkout</h3>
                    <p className="text-xs text-slate-500">UPI, Credit/Debit Cards, NetBanking, GPay, PhonePe</p>
                  </div>
                </div>
                <input type="radio" checked={method === 'razorpay'} readOnly />
              </label>

              <label
                onClick={() => setMethod('international')}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                  method === 'international' ? 'border-[#0369a1] bg-sky-50/50 ring-2 ring-sky-500/20' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Wallet className="w-6 h-6 text-slate-700" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">International Cards (Visa/MasterCard/Amex)</h3>
                    <p className="text-xs text-slate-500">Auto-converts foreign currency with zero markup</p>
                  </div>
                </div>
                <input type="radio" checked={method === 'international'} readOnly />
              </label>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl mb-6 text-xs text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              256-bit SSL Cryptographic Encryption guaranteed by Razorpay & Supabase Security.
            </div>

            <Button href="/checkout" variant="primary" className="w-full py-3">
              Pay ₹3,919 & Confirm Voucher <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Card>
        </div>
      </Container>
    </div>
  );
}
