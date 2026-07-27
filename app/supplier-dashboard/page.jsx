'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Hotel, DollarSign, Calendar, CheckCircle } from 'lucide-react';

export default function SupplierDashboardPage() {
  return (
    <div className="min-h-screen pb-16 bg-slate-50">
      <Container className="pt-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Partner Management Portal</h1>
              <p className="text-sm text-slate-500">Niranta Transit Hotel — CSMIA Terminal 2</p>
            </div>
            <Badge variant="success">Verified Partner</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-white border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Monthly Revenue</span>
              <span className="text-2xl font-extrabold text-slate-900">₹4,28,500</span>
            </Card>
            <Card className="p-6 bg-white border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Completed Bookings</span>
              <span className="text-2xl font-extrabold text-slate-900">142</span>
            </Card>
            <Card className="p-6 bg-white border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Live Occupancy Rate</span>
              <span className="text-2xl font-extrabold text-emerald-600">88%</span>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
