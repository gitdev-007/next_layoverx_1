'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Plane, Clock, Hotel, Utensils, Compass, Car, Sparkles, ShieldCheck, Star } from 'lucide-react';

export default function HomePage() {
  const [arrival, setArrival] = useState('');
  const [departure, setDeparture] = useState('');
  const [layoverHours, setLayoverHours] = useState(null);

  const calculateHours = (arr, dep) => {
    if (arr && dep) {
      const diffMs = new Date(dep) - new Date(arr);
      const hours = (diffMs / (1000 * 60 * 60)).toFixed(1);
      setLayoverHours(hours > 0 ? hours : null);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="theme-hero py-20 lg:py-28 relative overflow-hidden text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 bg-sky-500/20 text-sky-300 border-sky-400/30 px-4 py-1">
              ✈️ CSMIA Mumbai Airport Layover Hub
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-white leading-tight">
              Transform Your Mumbai Layover Into an Unforgettable Experience
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Book hourly transit hotel pods, luxury lounges, authentic dining, airport transfers, and quick city tours designed specifically for flight stopovers.
            </p>

            {/* Quick Layover Feasibility Widget */}
            <Card className="bg-white p-6 rounded-2xl shadow-2xl text-slate-900 border-0 max-w-2xl mx-auto">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 text-[#0369a1]" /> Calculate Your Layover Safety Window
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1 text-left">Arrival Time</label>
                  <input
                    type="datetime-local"
                    value={arrival}
                    onChange={(e) => {
                      setArrival(e.target.value);
                      calculateHours(e.target.value, departure);
                    }}
                    className="w-full text-sm border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1 text-left">Departure Time</label>
                  <input
                    type="datetime-local"
                    value={departure}
                    onChange={(e) => {
                      setDeparture(e.target.value);
                      calculateHours(arrival, e.target.value);
                    }}
                    className="w-full text-sm border-slate-200"
                  />
                </div>
              </div>
              {layoverHours && (
                <div className="mb-4 p-3 bg-sky-50 rounded-xl border border-sky-100 text-sm font-semibold text-[#0369a1]">
                  Available Layover Window: <span className="text-lg font-extrabold">{layoverHours} Hours</span>
                  {parseFloat(layoverHours) >= 4 ? (
                    <span className="block text-xs text-emerald-600 font-bold mt-1">✓ Feasible for City Tours & Hotel Stays</span>
                  ) : (
                    <span className="block text-xs text-amber-600 font-bold mt-1">⚠️ Recommended for Airport Lounges & Transit Pods</span>
                  )}
                </div>
              )}
              <Button href="/plan-my-layover" variant="primary" className="w-full py-3 text-sm">
                Explore Verified Layover Experiences
              </Button>
            </Card>
          </div>
        </Container>
      </section>

      {/* Service Categories */}
      <section className="section bg-slate-50">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Curated Services for Travelers
            </h2>
            <p className="text-slate-600 text-base">
              Hand-picked services near Mumbai International Airport (CSMIA) Terminal 1 & Terminal 2.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 flex flex-col justify-between hover:shadow-xl transition-all border border-slate-200">
              <div>
                <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center mb-4">
                  <Hotel className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Transit Hotels & Pods</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Book flexible 3, 6, or 12-hour hourly rooms near T1 & T2 with express check-in and luggage storage.
                </p>
              </div>
              <Button href="/hotels" variant="outline" size="sm" className="w-full">
                View Hotels
              </Button>
            </Card>

            <Card className="p-6 flex flex-col justify-between hover:shadow-xl transition-all border border-slate-200">
              <div>
                <div className="w-12 h-12 bg-orange-100 text-orange-800 rounded-xl flex items-center justify-center mb-4">
                  <Utensils className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Restaurants & Dining</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Authentic Mumbai street food tours, fine dining, and fast-track airport lounge buffets.
                </p>
              </div>
              <Button href="/restaurants" variant="outline" size="sm" className="w-full">
                View Dining
              </Button>
            </Card>

            <Card className="p-6 flex flex-col justify-between hover:shadow-xl transition-all border border-slate-200">
              <div>
                <div className="w-12 h-12 bg-rose-100 text-rose-800 rounded-xl flex items-center justify-center mb-4">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Guided Layover Tours</h3>
                <p className="text-sm text-slate-600 mb-4">
                  4 to 8-hour private driver tours covering Gateway of India, Bandra Sea Link, and Marine Drive.
                </p>
              </div>
              <Button href="/experiences" variant="outline" size="sm" className="w-full">
                View Tours
              </Button>
            </Card>

            <Card className="p-6 flex flex-col justify-between hover:shadow-xl transition-all border border-slate-200">
              <div>
                <div className="w-12 h-12 bg-purple-100 text-purple-800 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Spas & Wellness</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Rejuvenate with express massage therapy, shower suites, and quiet rest lounges.
                </p>
              </div>
              <Button href="/spa-wellness" variant="outline" size="sm" className="w-full">
                View Spas
              </Button>
            </Card>

            <Card className="p-6 flex flex-col justify-between hover:shadow-xl transition-all border border-slate-200">
              <div>
                <div className="w-12 h-12 bg-fuchsia-100 text-fuchsia-800 rounded-xl flex items-center justify-center mb-4">
                  <Star className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Gaming & Lounges</h3>
                <p className="text-sm text-slate-600 mb-4">
                  High-speed Wi-Fi, gaming pods, VR simulators, and executive meeting lounges.
                </p>
              </div>
              <Button href="/gaming-entertainment" variant="outline" size="sm" className="w-full">
                View Lounges
              </Button>
            </Card>

            <Card className="p-6 flex flex-col justify-between hover:shadow-xl transition-all border border-slate-200">
              <div>
                <div className="w-12 h-12 bg-slate-200 text-slate-800 rounded-xl flex items-center justify-center mb-4">
                  <Car className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Airport Transfers</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Guaranteed flight-tracked chauffeur pickups with 0-minute wait times at T1 and T2 gates.
                </p>
              </div>
              <Button href="/airport-transfers" variant="outline" size="sm" className="w-full">
                View Transfers
              </Button>
            </Card>
          </div>
        </Container>
      </section>

      {/* Why LayoverX */}
      <section className="section bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-14 h-14 bg-sky-100 text-[#0369a1] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Flight Delay Protection</h3>
              <p className="text-sm text-slate-600">
                Real-time automated flight delay tracking automatically reschedules or refunds your bookings.
              </p>
            </div>

            <div className="p-6">
              <div className="w-14 h-14 bg-sky-100 text-[#0369a1] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Guaranteed On-Time Return</h3>
              <p className="text-sm text-slate-600">
                Our smart layover engine calculates traffic windows so you never miss your connecting flight.
              </p>
            </div>

            <div className="p-6">
              <div className="w-14 h-14 bg-sky-100 text-[#0369a1] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plane className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">24/7 Airport Support</h3>
              <p className="text-sm text-slate-600">
                On-ground airport concierges ready to assist you at Mumbai CSMIA Terminal 1 & 2.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
