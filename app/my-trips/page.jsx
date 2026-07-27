'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Plane, MapPin, ArrowRight } from 'lucide-react';

export default function MyTripsPage() {
  const trips = [
    {
      id: 't-1',
      bookingId: 'LX-BOM-88329',
      date: '28 July 2026',
      service: 'Niranta Transit Hotel & Lounge (3 Hrs)',
      status: 'Confirmed',
      badge: 'success',
      arrivalFlight: 'AI 102 (JFK -> BOM)',
    },
    {
      id: 't-2',
      bookingId: 'LX-BOM-77102',
      date: '14 May 2026',
      service: 'Mumbai Highlights Express Private Tour',
      status: 'Completed',
      badge: 'secondary',
      arrivalFlight: 'BA 199 (LHR -> BOM)',
    },
  ];

  return (
    <div className="min-h-screen pb-16 bg-slate-50">
      <Container className="pt-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">My Layover Trips</h1>
          <p className="text-sm text-slate-500 mb-6">Manage past and upcoming stopover bookings.</p>

          <div className="space-y-4">
            {trips.map((trip) => (
              <Card key={trip.id} className="p-6 bg-white border border-slate-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <span className="text-xs text-slate-400 font-mono">Ref: {trip.bookingId}</span>
                    <h3 className="text-lg font-bold text-slate-900">{trip.service}</h3>
                  </div>
                  <Badge variant={trip.badge}>{trip.status}</Badge>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-slate-600">
                  <div>
                    <span>Date: <strong>{trip.date}</strong></span> | <span>Flight: <strong>{trip.arrivalFlight}</strong></span>
                  </div>
                  <Button href={`/trip-details?id=${trip.bookingId}`} variant="outline" size="sm">
                    View Details <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
