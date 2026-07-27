'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Compass, Clock, MapPin, Star, ShieldCheck } from 'lucide-react';

export default function ExperiencesPage() {
  const tours = [
    {
      id: 't1',
      name: 'Mumbai Highlights Express Private Tour',
      duration: '5 Hours (Safe Window: 6+ Hr Layover)',
      rating: 4.9,
      reviews: 480,
      price: '₹3,999 per car',
      highlights: ['Gateway of India', 'Taj Mahal Palace', 'Marine Drive Queen\'s Necklace', 'Bandra Worli Sea Link'],
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 't2',
      name: 'Bandra Heritage & Street Food Crawl',
      duration: '4 Hours (Safe Window: 5+ Hr Layover)',
      rating: 4.8,
      reviews: 290,
      price: '₹2,499 per person',
      highlights: ['Mount Mary Church', 'Bollywood Stars Mansions', 'Portuguese Villages', 'Local Street Food Tasting'],
      image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 't3',
      name: 'South Mumbai Heritage & Elephanta Caves',
      duration: '8 Hours (Safe Window: 9+ Hr Layover)',
      rating: 4.9,
      reviews: 310,
      price: '₹5,999 per car',
      highlights: ['Elephanta Island Ferry', 'UNESCO World Heritage Caves', 'CSMT Station Tour', 'Colaba Causeway'],
      image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="theme-tours min-h-screen pb-16">
      <section className="theme-hero py-16 text-white mb-10">
        <Container>
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 bg-rose-500/20 text-rose-300 border-rose-400/30">
              🌆 Curated City Tours & Private Chauffeurs
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 text-white">
              Mumbai Layover City Tours with On-Time Guarantee
            </h1>
            <p className="text-slate-300 text-base sm:text-lg">
              Explore Mumbai with private air-conditioned cars, licensed local guides, airport door-to-door pickups, and traffic-buffered return windows.
            </p>
          </div>
        </Container>
      </section>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <Card key={tour.id} className="flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                <div className="relative h-48 w-full overflow-hidden">
                  <img src={tour.image} alt={tour.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-900 flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {tour.rating} ({tour.reviews})
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{tour.name}</h3>
                  <p className="text-xs font-bold text-rose-600 mb-4 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {tour.duration}
                  </p>

                  <div className="space-y-1.5 mb-6">
                    {tour.highlights.map((h, idx) => (
                      <div key={idx} className="text-xs text-slate-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> {h}
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 block font-medium">Tour Price</span>
                      <span className="text-xl font-extrabold text-slate-900">{tour.price}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <Button href={`/service-details?id=${tour.id}`} variant="primary" className="w-full">
                  Book Private Tour
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
