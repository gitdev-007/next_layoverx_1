'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      router.push('/booking-confirmation');
    }, 1500);
  };

  return (
    <div className="min-h-screen pb-16 bg-slate-50">
      <Container className="pt-8">
        <div className="max-w-md mx-auto text-center">
          <Badge variant="secondary" className="mb-3 bg-emerald-500/20 text-emerald-800 border-emerald-300">
            Step 4 of 4: Razorpay Secure Processing
          </Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Complete Payment</h1>

          <Card className="p-6 md:p-8 bg-white border border-slate-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-1">Razorpay Checkout Gateway</h2>
            <p className="text-xs text-slate-500 mb-6">Order ID: #LX-2026-9841</p>

            <div className="bg-slate-50 p-4 rounded-xl mb-6 text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Service</span>
                <span className="font-bold text-slate-900">Niranta Transit Hotel</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Duration</span>
                <span className="font-bold text-slate-900">3 Hours</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-extrabold text-slate-900">
                <span>Amount Charged</span>
                <span className="text-emerald-700">₹3,919</span>
              </div>
            </div>

            <Button
              onClick={handlePay}
              disabled={processing}
              variant="primary"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              {processing ? 'Processing Payment...' : 'Simulate Successful Razorpay Payment'}
            </Button>
          </Card>
        </div>
      </Container>
    </div>
  );
}
