'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, Clock } from 'lucide-react';

export default function SupplierStatusPage() {
  return (
    <div className="min-h-screen pb-16 bg-slate-50">
      <Container className="pt-8">
        <div className="max-w-xl mx-auto text-center">
          <Clock className="w-12 h-12 text-[#0369a1] mx-auto mb-3" />
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Application Status</h1>
          <p className="text-sm text-slate-500 mb-6">Track your partner verification progress.</p>

          <Card className="p-6 bg-white border border-slate-200 text-left">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase">App Ref #APP-9982</span>
              <Badge variant="warning">Under Compliance Audit</Badge>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> GSTIN Verification: Complete
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Bank Payout Sync: Complete
              </div>
              <div className="flex items-center gap-2 text-amber-700 font-semibold">
                <Clock className="w-4 h-4" /> Property Safety Inspection: Pending Schedule
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
