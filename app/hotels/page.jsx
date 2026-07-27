'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Hotel, Clock, MapPin, Star, ShieldCheck, Wifi } from 'lucide-react';

export default function HotelsPage() {
  const hotels = [
    {
      id: 'h1',
      name: 'Niranta Transit Hotel & Lounge',
      terminal: 'CSMIA Terminal 2 (Inside Security)',
      rating: 4.8,
      reviews: 320,
      price3h: '₹3,499',
      price6h: '₹5,299',
      amenities: ['In-Terminal Access', 'Express Check-in', 'Free High-Speed Wi-Fi', 'Rain Shower'],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'h2',
      name: 'Urbanpod Airport Pod Hotel',
      terminal: 'Andheri East (5 Mins from T2)',
      rating: 4.6,
      reviews: 210,
      price3h: '₹1,499',
      price6h: '₹2,499',
      amenities: ['Individual Sleeping Pod', 'Air Conditioned', 'Shared Luxury Baths', 'Luggage Lockers'],
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'h3',
      name: 'The Leela Mumbai Transit Suites',
      terminal: 'Airport Road (7 Mins from T2)',
      rating: 4.9,
      reviews: 540,
      price3h: '₹4,999',
      price6h: '₹7,999',
      amenities: ['5-Star Luxury', 'Chauffeur Shuttle', 'Outdoor Pool & Spa', '24/7 Room Service'],
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="theme-hotels min-h-screen pb-16">
      {/* Page Hero */}
      <section className="theme-hero py-16 text-white mb-10">
        <Container>
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 bg-amber-500/20 text-amber-300 border-amber-400/30">
              🏨 Hourly Transit Hotels & Sleeping Pods
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 text-white">
              Mumbai Airport Transit Hotels & Micro-Stays
            </h1>
            <p className="text-slate-300 text-base sm:text-lg">
              Book flexible 3, 6, or 12-hour slots inside or right outside CSMIA Terminal 1 and Terminal 2. Refresh and rest before your next flight.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {hotels.map((hotel) => (
            <Card key={hotel.id} className="flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                <div className="relative h-48 w-full overflow-hidden">
                  <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-900 flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {hotel.rating} ({hotel.reviews})
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{hotel.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-[#0369a1]" /> {hotel.terminal}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {hotel.amenities.map((item, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-medium">
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 block font-medium">3-Hour Stay From</span>
                      <span className="text-xl font-extrabold text-[#0369a1]">{hotel.price3h}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block font-medium">6-Hour Stay From</span>
                      <span className="text-base font-bold text-slate-800">{hotel.price6h}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <Button href={`/service-details?id=${hotel.id}`} variant="primary" className="w-full">
                  Book Hourly Stay
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
