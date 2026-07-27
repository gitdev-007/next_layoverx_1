'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Plane, Clock, ShieldCheck, CheckCircle } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Enter Flight Timings',
      desc: 'Provide your incoming and outgoing flight details. Our algorithm computes your guaranteed safe layover duration.',
    },
    {
      num: '02',
      title: 'Browse & Book Micro-Services',
      desc: 'Choose hourly transit hotel pods, airport lounge passes, authentic dining, or private chauffeurs.',
    },
    {
      num: '03',
      title: 'Live Flight Sync & Protection',
      desc: 'Our system constantly monitors AeroAPI flight feeds. If your flight is delayed, your booking is automatically adjusted.',
    },
  ];

  return (
    <div className="min-h-screen pb-16 bg-slate-50">
      <section className="bg-slate-900 text-white py-16 text-center mb-12">
        <Container>
          <div className="max-w-2xl mx-auto">
            <Badge variant="secondary" className="mb-3 bg-sky-500/20 text-sky-300 border-sky-400/30">
              ⚡ How LayoverX Works
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 text-white">
              Maximizing Your Airport Transit Hours
            </h1>
            <p className="text-slate-300 text-base">
              Learn how LayoverX guarantees safe exit windows, zero missed flights, and instant hourly vouchers.
            </p>
          </div>
        </Container>
      </section>

      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((s, idx) => (
            <Card key={idx} className="p-6 bg-white border border-slate-200 text-center">
              <span className="text-4xl font-extrabold text-[#0369a1] block mb-2">{s.num}</span>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
