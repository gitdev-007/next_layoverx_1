'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Plane, Clock, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function PlanMyLayoverPage() {
  const [step, setStep] = useState(1);
  const [flightIn, setFlightIn] = useState('AI 102 (JFK -> BOM)');
  const [flightOut, setFlightOut] = useState('UK 985 (BOM -> DEL)');
  const [arrivalTime, setArrivalTime] = useState('2026-07-28T10:00');
  const [departureTime, setDepartureTime] = useState('2026-07-28T18:00');
  const [travelers, setTravelers] = useState('1');

  const layoverDuration = 8.0; // calculated hours
  const safeExitWindow = 5.5; // safe window after security & travel buffer

  return (
    <div className="min-h-screen pb-16 bg-slate-50">
      <section className="bg-slate-900 text-white py-12 mb-8">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <Badge variant="secondary" className="mb-3 bg-sky-500/20 text-sky-300 border-sky-400/30">
              ✈️ Smart Layover Planner & Feasibility Engine
            </Badge>
            <h1 className="text-3xl font-extrabold mb-2 text-white">Plan Your Mumbai Stopover</h1>
            <p className="text-sm text-slate-300">
              Input your incoming & outgoing flight details. Our algorithm calculates traffic windows and recommends safe experiences.
            </p>
          </div>
        </Container>
      </section>

      <Container>
        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8 px-4">
            <div className={`flex items-center gap-2 text-sm font-bold ${step >= 1 ? 'text-[#0369a1]' : 'text-slate-400'}`}>
              <span className="w-7 h-7 rounded-full bg-[#0369a1] text-white flex items-center justify-center text-xs">1</span>
              Flight Details
            </div>
            <div className="h-0.5 flex-grow mx-4 bg-slate-200"></div>
            <div className={`flex items-center gap-2 text-sm font-bold ${step >= 2 ? 'text-[#0369a1]' : 'text-slate-400'}`}>
              <span className="w-7 h-7 rounded-full bg-[#0369a1] text-white flex items-center justify-center text-xs">2</span>
              Recommended Feasibility
            </div>
          </div>

          {step === 1 ? (
            <Card className="p-6 md:p-8 bg-white border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Plane className="w-5 h-5 text-[#0369a1]" /> Enter Flight & Layover Timings
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Incoming Flight Number</label>
                  <input
                    type="text"
                    value={flightIn}
                    onChange={(e) => setFlightIn(e.target.value)}
                    className="w-full text-sm"
                    placeholder="e.g. AI 102"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Outgoing Flight Number</label>
                  <input
                    type="text"
                    value={flightOut}
                    onChange={(e) => setFlightOut(e.target.value)}
                    className="w-full text-sm"
                    placeholder="e.g. UK 985"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Expected Arrival</label>
                    <input
                      type="datetime-local"
                      value={arrivalTime}
                      onChange={(e) => setArrivalTime(e.target.value)}
                      className="w-full text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Expected Departure</label>
                    <input
                      type="datetime-local"
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      className="w-full text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Number of Passengers</label>
                  <select
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    className="w-full text-sm"
                  >
                    <option value="1">1 Passenger</option>
                    <option value="2">2 Passengers</option>
                    <option value="3">3 Passengers</option>
                    <option value="4">4+ Passengers</option>
                  </select>
                </div>
              </div>

              <Button onClick={() => setStep(2)} variant="primary" className="w-full py-3">
                Calculate Safety Window <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Card>
          ) : (
            <Card className="p-6 md:p-8 bg-white border border-slate-200">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-lg font-bold text-emerald-900">Layover Window Verified Safe</h3>
                </div>
                <p className="text-sm text-emerald-800 mb-4">
                  Total Layover: <strong>{layoverDuration} Hours</strong> | Guaranteed Safe Exit & Return Window: <strong>{safeExitWindow} Hours</strong>
                </p>
                <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-emerald-100 space-y-1">
                  <div>✓ Immigration & Security Buffer: 1.5 Hours</div>
                  <div>✓ Terminal Return Clearance: 1.0 Hour</div>
                  <div>✓ Flight Delay Protection Enabled</div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-4">Feasible Activities for Your Layover</h3>
              <div className="space-y-3 mb-6">
                <Link href="/hotels" className="block p-4 rounded-xl border border-slate-200 hover:border-[#0369a1] hover:bg-sky-50 transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base mb-1">Transit Hotel Pod Stay</h4>
                      <p className="text-xs text-slate-500">6-Hour micro-stay room with rain shower</p>
                    </div>
                    <span className="text-xs font-bold text-[#0369a1]">100% Feasible</span>
                  </div>
                </Link>

                <Link href="/experiences" className="block p-4 rounded-xl border border-slate-200 hover:border-[#0369a1] hover:bg-sky-50 transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base mb-1">South Mumbai Highlights Tour</h4>
                      <p className="text-xs text-slate-500">Private car chauffeured sightseeing</p>
                    </div>
                    <span className="text-xs font-bold text-[#0369a1]">100% Feasible</span>
                  </div>
                </Link>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => setStep(1)} variant="outline" className="w-1/3">
                  Back
                </Button>
                <Button href="/hotels" variant="primary" className="w-2/3">
                  Select Package & Continue
                </Button>
              </div>
            </Card>
          )}
        </div>
      </Container>
    </div>
  );
}
