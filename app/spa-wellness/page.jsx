'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, MapPin, Star, Clock } from 'lucide-react';

export default function SpaWellnessPage() {
  const spas = [
    {
      id: 's1',
      name: 'O2 Spa — CSMIA Terminal 2',
      location: 'Inside T2 Security (Gate 68)',
      rating: 4.8,
      reviews: 230,
      price: '₹1,999',
      treatment: '45-Min Express Foot Reflexology & Back Massage',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 's2',
      name: 'Quan Spa — JW Marriott Sahar',
      location: 'Sahar, 3 Mins from Airport T2',
      rating: 4.9,
      reviews: 410,
      price: '₹4,499',
      treatment: '90-Min Full Body Jetlag Recovery & Steam Suite',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="theme-spa min-h-screen pb-16">
      <section className="theme-hero py-16 text-white mb-10">
        <Container>
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 bg-purple-500/20 text-purple-300 border-purple-400/30">
              ✨ Express Spas & Rejuvenation Lounges
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 text-white">
              Airport Spas & Jetlag Recovery Therapies
            </h1>
            <p className="text-slate-300 text-base sm:text-lg">
              Unwind between flights with aromatherapy, deep tissue massages, hot shower packages, and foot reflexology.
            </p>
          </div>
        </Container>
      </section>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {spas.map((spa) => (
            <Card key={spa.id} className="flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                <div className="relative h-52 w-full overflow-hidden">
                  <img src={spa.image} alt={spa.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-900 flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {spa.rating} ({spa.reviews})
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{spa.name}</h3>
                  <p className="text-xs font-semibold text-purple-600 mb-2">{spa.treatment}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-[#0369a1]" /> {spa.location}
                  </p>

                  <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 block font-medium">Session Price</span>
                      <span className="text-xl font-extrabold text-slate-900">{spa.price}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <Button href={`/service-details?id=${spa.id}`} variant="primary" className="w-full">
                  Book Spa Session
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
