'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Plane, ShieldCheck, Clock, MapPin, AlertCircle } from 'lucide-react';

export default function TripDetailsPage() {
  return (
    <div className="min-h-screen pb-16 bg-slate-50">
      <Container className="pt-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-mono text-slate-500">Booking ID: #LX-BOM-88329</span>
              <h1 className="text-3xl font-extrabold text-slate-900">Trip Details & Flight Monitor</h1>
            </div>
            <Badge variant="success">Active Trip</Badge>
          </div>

          <Card className="p-6 md:p-8 bg-white border border-slate-200 mb-6">
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Plane className="w-6 h-6 text-[#0369a1]" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Flight AI 102 (JFK -&gt; BOM)</h4>
                  <p className="text-xs text-slate-600">Scheduled Arrival: 10:00 AM | Status: <strong className="text-emerald-700">On Time</strong></p>
                </div>
              </div>
              <Badge variant="primary">Synced 2m ago</Badge>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-4">Reserved Layover Services</h3>
            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Niranta Transit Hotel & Lounge</h4>
                  <p className="text-xs text-slate-500">3-Hour Micro-Stay (12:00 PM - 03:00 PM)</p>
                </div>
                <span className="text-sm font-extrabold text-[#0369a1]">₹3,919</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex gap-4">
              <Button href="/booking-confirmation" variant="outline" className="w-1/2">
                Download Voucher
              </Button>
              <Button href="/contact" variant="secondary" className="w-1/2">
                Need Support?
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
