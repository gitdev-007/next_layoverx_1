'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Car, Clock, ShieldCheck, Star } from 'lucide-react';

export default function AirportTransfersPage() {
  const transfers = [
    {
      id: 'c1',
      name: 'Executive Sedan Airport Pickup',
      vehicle: 'Toyota Innova Crysta / Camry',
      rating: 4.9,
      reviews: 670,
      price: '₹1,499 per ride',
      features: ['Flight-Tracked Pickup', '60-Min Free Wait Time', 'Gate Chauffeur Greeting', 'Luggage Assistance'],
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'c2',
      name: 'Luxury SUV Chauffeur Package',
      vehicle: 'Mercedes E-Class / BMW 5 Series',
      rating: 5.0,
      reviews: 190,
      price: '₹3,999 per ride',
      features: ['Uniformed Chauffeur', 'Water & Wi-Fi Onboard', 'Terminal Arrival Meet & Greet', 'Zero Cancellation Fee'],
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="theme-transfers min-h-screen pb-16">
      <section className="theme-hero py-16 text-white mb-10">
        <Container>
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 bg-slate-500/20 text-slate-300 border-slate-400/30">
              🚕 Guaranteed Flight-Tracked Airport Transfers
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 text-white">
              Mumbai Airport Transfers & Private Chauffeurs
            </h1>
            <p className="text-slate-300 text-base sm:text-lg">
              Seamless terminal pickup at CSMIA T1 & T2 with live flight tracking, zero wait time, and professional drivers.
            </p>
          </div>
        </Container>
      </section>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {transfers.map((item) => (
            <Card key={item.id} className="flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                <div className="relative h-52 w-full overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-900 flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {item.rating} ({item.reviews})
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{item.name}</h3>
                  <p className="text-xs font-semibold text-slate-600 mb-4">{item.vehicle}</p>

                  <div className="space-y-1.5 mb-6">
                    {item.features.map((f, idx) => (
                      <div key={idx} className="text-xs text-slate-600 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> {f}
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 block font-medium">Flat Transfer Fee</span>
                      <span className="text-xl font-extrabold text-slate-900">{item.price}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <Button href={`/service-details?id=${item.id}`} variant="primary" className="w-full">
                  Book Airport Transfer
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
