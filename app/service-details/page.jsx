'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Star, MapPin, ShieldCheck, Clock, Check, ArrowRight } from 'lucide-react';

export default function ServiceDetailsPage() {
  return (
    <div className="min-h-screen pb-16 bg-slate-50">
      <Container className="pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 md:p-8 bg-white border border-slate-200">
              <div className="relative h-72 w-full rounded-2xl overflow-hidden mb-6">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
                  alt="Niranta Transit Hotel"
                  className="w-full h-full object-cover"
                />
                <Badge variant="primary" className="absolute top-4 left-4 bg-sky-600 text-white">
                  Inside Airport Security (T2)
                </Badge>
              </div>

              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                Niranta Transit Hotel & Lounge
              </h1>
              <p className="text-sm text-slate-500 flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-[#0369a1]" /> Mumbai CSMIA Terminal 2 (Level 2 & Level 1)
              </p>

              <div className="flex items-center gap-4 text-sm mb-6 border-y border-slate-100 py-3">
                <span className="flex items-center gap-1 font-bold text-slate-900">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> 4.8 / 5.0 (320 Reviews)
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Flight Delay Insurance Included
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-3">Service Description</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Niranta Transit Hotel offers air-conditioned micro-stay rooms right inside Mumbai CSMIA Terminal 2. Perfect for international passengers with long layovers who wish to sleep, shower, and refresh without clearing customs or leaving the airport premises.
              </p>

              <h2 className="text-xl font-bold text-slate-900 mb-3">Included Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['Rain Shower', 'High-Speed Wi-Fi', 'Express Check-In', 'Flight Status Monitor', '24/7 Room Service', 'Soundproof Windows'].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <Check className="w-4 h-4 text-emerald-600" /> {item}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Booking Side Card */}
          <div>
            <Card className="p-6 bg-white border border-slate-200 sticky top-24 shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Book Hourly Slot</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Select Duration</label>
                  <select className="w-full text-sm">
                    <option value="3">3 Hours Stay — ₹3,499</option>
                    <option value="6">6 Hours Stay — ₹5,299</option>
                    <option value="12">12 Hours Stay — ₹8,999</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Check-in Date & Time</label>
                  <input type="datetime-local" className="w-full text-sm" defaultValue="2026-07-28T12:00" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Travelers</label>
                  <select className="w-full text-sm">
                    <option>1 Adult</option>
                    <option>2 Adults</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 mb-6 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Slot Base Fee</span>
                  <span className="font-semibold text-slate-900">₹3,499</span>
                </div>
                <div className="flex justify-between">
                  <span>GST & Airport Taxes</span>
                  <span className="font-semibold text-slate-900">₹420</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2 text-sm font-bold text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-[#0369a1]">₹3,919</span>
                </div>
              </div>

              <Button href="/booking-review" variant="primary" className="w-full py-3">
                Proceed to Review <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}
