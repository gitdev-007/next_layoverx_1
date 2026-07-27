'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Star, MapPin, Gamepad2 } from 'lucide-react';

export default function GamingEntertainmentPage() {
  const lounges = [
    {
      id: 'g1',
      name: 'Adani Executive Lounge & Esports Arena',
      location: 'Terminal 2 Departures',
      rating: 4.7,
      reviews: 140,
      price: '₹1,499 / 3 Hours',
      features: ['PS5 Pro Gaming Stations', 'High-Speed Fiber Wi-Fi', 'Complimentary Gourmet Snacks', 'Recliner Seats'],
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'g2',
      name: 'Smaaash VR & Arcade Zone',
      location: 'Phoenix Marketcity (12 Mins from T2)',
      rating: 4.8,
      reviews: 520,
      price: '₹1,999 Unlimited Pass',
      features: ['Virtual Reality Coasters', 'Cricket Simulators', 'Bowling Alley', 'Craft Beer Bar'],
      image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="theme-gaming min-h-screen pb-16">
      <section className="theme-hero py-16 text-white mb-10">
        <Container>
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/30">
              🎮 Gaming Zones & Executive Lounges
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 text-white">
              Airport Lounges & Gaming Arenas
            </h1>
            <p className="text-slate-300 text-base sm:text-lg">
              Stay entertained during your transit with high-end gaming stations, private cinema pods, and quiet work lounges.
            </p>
          </div>
        </Container>
      </section>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {lounges.map((item) => (
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
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-[#0369a1]" /> {item.location}
                  </p>

                  <div className="space-y-1.5 mb-6">
                    {item.features.map((f, idx) => (
                      <div key={idx} className="text-xs text-slate-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500"></span> {f}
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 block font-medium">Access Pass</span>
                      <span className="text-xl font-extrabold text-slate-900">{item.price}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <Button href={`/service-details?id=${item.id}`} variant="primary" className="w-full">
                  Book Lounge Pass
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
