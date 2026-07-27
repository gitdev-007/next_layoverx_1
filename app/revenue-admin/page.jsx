'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Shield, TrendingUp, Users, AlertTriangle } from 'lucide-react';

export default function RevenueAdminPage() {
  return (
    <div className="min-h-screen pb-16 bg-slate-900 text-white">
      <Container className="pt-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Badge variant="secondary" className="mb-2 bg-sky-500/20 text-sky-300 border-sky-400/30">
                🛡️ Superadmin & Concierge Operations
              </Badge>
              <h1 className="text-3xl font-extrabold text-white">LayoverX Platform Command Center</h1>
            </div>
            <Badge variant="success">All Systems Live</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-slate-800 border border-slate-700 text-white">
              <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Gross Booking Value</span>
              <span className="text-2xl font-extrabold text-emerald-400">₹14,92,000</span>
            </Card>
            <Card className="p-6 bg-slate-800 border border-slate-700 text-white">
              <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Active Layover Trips</span>
              <span className="text-2xl font-extrabold text-[#7dd3fc]">38</span>
            </Card>
            <Card className="p-6 bg-slate-800 border border-slate-700 text-white">
              <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Pending KYC Applications</span>
              <span className="text-2xl font-extrabold text-amber-400">4</span>
            </Card>
            <Card className="p-6 bg-slate-800 border border-slate-700 text-white">
              <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Flight Delay Engine</span>
              <span className="text-2xl font-extrabold text-emerald-400">Active (AeroAPI)</span>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
