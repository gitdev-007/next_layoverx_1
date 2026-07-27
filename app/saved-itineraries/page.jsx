'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Heart, Clock, MapPin, ArrowRight } from 'lucide-react';

export default function SavedItinerariesPage() {
  const saved = [
    {
      id: 's1',
      title: '6-Hour Transit Hotel & Spa Bundle',
      duration: '6 Hours',
      items: ['Niranta Transit Hotel (3 Hr)', 'O2 Express Spa Session'],
      total: '₹4,999',
    },
    {
      id: 's2',
      title: '8-Hour South Mumbai Express Heritage Tour',
      duration: '8 Hours',
      items: ['Private AC Sedan', 'Gateway of India & Sea Link', 'Peshawri Lunch'],
      total: '₹6,499',
    },
  ];

  return (
    <div className="min-h-screen pb-16 bg-slate-50">
      <Container className="pt-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Saved Layover Packages</h1>
          <p className="text-sm text-slate-500 mb-6">Your bookmarked stopover itineraries and custom trip packages.</p>

          <div className="space-y-6">
            {saved.map((pkg) => (
              <Card key={pkg.id} className="p-6 bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <h3 className="text-lg font-bold text-slate-900">{pkg.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">Duration: {pkg.duration}</p>
                  <div className="flex flex-wrap gap-2">
                    {pkg.items.map((item, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-2 w-full md:w-auto">
                  <span className="text-xl font-extrabold text-[#0369a1]">{pkg.total}</span>
                  <Button href="/plan-my-layover" variant="primary" size="sm" className="w-full md:w-auto">
                    Book Saved Package <ArrowRight className="w-4 h-4 ml-1" />
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
