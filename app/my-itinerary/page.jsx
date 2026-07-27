'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Plane, Clock, Hotel, Utensils, Compass, CheckCircle2 } from 'lucide-react';

export default function MyItineraryPage() {
  const timeline = [
    {
      time: '10:00 AM',
      title: 'Flight Arrival at CSMIA Terminal 2',
      detail: 'Air India AI 102 from JFK. Flight status: On Time.',
      icon: Plane,
      badge: 'Arrival',
    },
    {
      time: '11:30 AM',
      title: 'Immigration & Baggage Claim Clearance',
      detail: 'Estimated clearance time: 45 minutes.',
      icon: CheckCircle2,
      badge: 'Security',
    },
    {
      time: '12:00 PM',
      title: 'Niranta Transit Hotel Micro-Stay Check-In',
      detail: '3-Hour rest room booked. Booking #LX-BOM-88329.',
      icon: Hotel,
      badge: 'Hotel',
    },
    {
      time: '03:30 PM',
      title: 'Peshawri ITC Maratha Express Lunch',
      detail: 'Table reserved for 2. 5 mins from Terminal 2.',
      icon: Utensils,
      badge: 'Dining',
    },
    {
      time: '05:30 PM',
      title: 'Return to Terminal 2 Departures',
      detail: 'Clear security for outgoing flight UK 985 to Delhi.',
      icon: Plane,
      badge: 'Departure',
    },
  ];

  return (
    <div className="min-h-screen pb-16 bg-slate-50">
      <Container className="pt-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">My Layover Itinerary Timeline</h1>
              <p className="text-sm text-slate-500">Real-time synchronized stopover itinerary for Mumbai CSMIA.</p>
            </div>
            <Badge variant="success" className="px-3 py-1 text-xs">Live Flight Tracked</Badge>
          </div>

          <Card className="p-6 md:p-8 bg-white border border-slate-200 shadow-lg">
            <div className="relative border-l-2 border-sky-200 ml-4 space-y-8 pl-6">
              {timeline.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-[#0369a1] text-white flex items-center justify-center shadow-md">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#0369a1] uppercase">{item.time}</span>
                      <h3 className="text-lg font-bold text-slate-900 mt-0.5">{item.title}</h3>
                      <p className="text-sm text-slate-600 mt-1">{item.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
