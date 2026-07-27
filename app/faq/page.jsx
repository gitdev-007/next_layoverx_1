'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      q: 'Do I need a transit visa to leave Mumbai Airport during a layover?',
      a: 'If you plan to leave CSMIA Terminal 1 or 2 for a city tour or off-site hotel, international travelers require an Indian Tourist or Transit Visa. For inside-terminal hotels like Niranta T2, no visa is required as you remain within the transit area.',
    },
    {
      q: 'What happens if my incoming flight is delayed?',
      a: 'LayoverX automatically tracks incoming flight status via FlightAware AeroAPI. If your flight is delayed by over 60 minutes, your booking duration is automatically shifted or refunded without penalties.',
    },
    {
      q: 'Where do I meet my private chauffeur driver?',
      a: 'Your driver will meet you at the arrival hall exit gate with a personalized LayoverX name sign.',
    },
  ];

  return (
    <div className="min-h-screen pb-16 bg-slate-50">
      <Container className="pt-8">
        <div className="max-w-3xl mx-auto">
          <Badge variant="secondary" className="mb-2">Frequently Asked Questions</Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Got Questions? We Have Answers.</h1>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="p-6 bg-white border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#0369a1]" /> {faq.q}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed pl-7">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
