'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, QrCode, Download, Calendar, MapPin, Plane } from 'lucide-react';

export default function BookingConfirmationPage() {
  return (
    <div className="min-h-screen pb-16 bg-slate-50">
      <Container className="pt-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10" />
          </div>
          <Badge variant="success" className="mb-2">Booking Confirmed & Guaranteed</Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">You're All Set for Your Mumbai Layover!</h1>
          <p className="text-sm text-slate-600 mb-8">
            Your instant confirmation voucher has been sent to your email and SMS.
          </p>

          <Card className="p-6 md:p-8 bg-white border border-slate-200 text-left mb-6 shadow-xl">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className="text-xs text-slate-400 font-mono uppercase">Booking Reference</span>
                <h3 className="text-xl font-extrabold text-slate-900">LX-BOM-88329</h3>
              </div>
              <Badge variant="primary" className="bg-sky-100 text-sky-800 border-sky-200">Flight Tracked</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <span className="text-xs text-slate-500 block uppercase font-bold mb-1">Service Purchased</span>
                <h4 className="font-bold text-slate-900 text-base mb-1">Niranta Transit Hotel & Lounge</h4>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0369a1]" /> CSMIA Terminal 2 (Inside Security)
                </p>
              </div>

              <div>
                <span className="text-xs text-slate-500 block uppercase font-bold mb-1">Scheduled Time</span>
                <p className="font-bold text-slate-900 text-sm flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-slate-600" /> 28 July 2026, 12:00 PM - 03:00 PM
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold uppercase text-slate-500 block mb-1">Entry Gate QR Code</span>
                <p className="text-xs text-slate-600">Scan at the Niranta hotel reception desk in Terminal 2 for priority check-in.</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex-shrink-0">
                <QrCode className="w-20 h-20 text-slate-800" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/my-itinerary" variant="primary" className="w-full sm:w-1/2">
                View My Itinerary Timeline
              </Button>
              <Button href="/my-trips" variant="outline" className="w-full sm:w-1/2">
                Manage My Trips
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
