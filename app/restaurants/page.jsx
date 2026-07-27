'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Utensils, MapPin, Star, Clock } from 'lucide-react';

export default function RestaurantsPage() {
  const restaurants = [
    {
      id: 'r1',
      name: 'Peshawri — ITC Maratha',
      cuisine: 'North Indian / Mughlai / Kebab',
      location: 'Sahar, 5 Mins from T2',
      rating: 4.9,
      reviews: 410,
      avgCost: '₹2,500 for two',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'r2',
      name: 'Global Buffet — CSMIA Lounge Dining',
      cuisine: 'Multi-Cuisine / International Buffet',
      location: 'Inside Terminal 2 (Departures)',
      rating: 4.7,
      reviews: 185,
      avgCost: '₹1,299 per person',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'r3',
      name: 'Mahesh Lunch Home — Seafood Special',
      cuisine: 'Mangalorean / Coastal Indian Seafood',
      location: 'Andheri East (10 Mins from T2)',
      rating: 4.8,
      reviews: 620,
      avgCost: '₹1,800 for two',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="theme-restaurants min-h-screen pb-16">
      <section className="theme-hero py-16 text-white mb-10">
        <Container>
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 bg-orange-500/20 text-orange-300 border-orange-400/30">
              🍽️ Airport Dining & Express Restaurants
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 text-white">
              Mumbai Layover Dining & Authentic Cuisine
            </h1>
            <p className="text-slate-300 text-base sm:text-lg">
              Savor authentic Mumbai flavors, 5-star hotel buffets, and fast-track airport dining with reserved tables and priority service.
            </p>
          </div>
        </Container>
      </section>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {restaurants.map((res) => (
            <Card key={res.id} className="flex flex-col justify-between hover:shadow-xl transition-all">
              <div>
                <div className="relative h-48 w-full overflow-hidden">
                  <img src={res.image} alt={res.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-900 flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {res.rating} ({res.reviews})
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{res.name}</h3>
                  <p className="text-xs font-semibold text-orange-600 mb-2">{res.cuisine}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-[#0369a1]" /> {res.location}
                  </p>

                  <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 block font-medium">Estimated Pricing</span>
                      <span className="text-lg font-extrabold text-slate-900">{res.avgCost}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <Button href={`/service-details?id=${res.id}`} variant="primary" className="w-full">
                  Reserve Table & Fast-Pass
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
