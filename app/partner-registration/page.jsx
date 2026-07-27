'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export default function PartnerRegistrationPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pb-16 bg-slate-50">
      <Container className="pt-8">
        <div className="max-w-2xl mx-auto">
          <Badge variant="secondary" className="mb-2">Partner Onboarding Portal</Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Register as a LayoverX Partner</h1>
          <p className="text-sm text-slate-500 mb-6">List your transit hotel, restaurant, spa, or cab fleet on LayoverX.</p>

          <Card className="p-6 md:p-8 bg-white border border-slate-200">
            {submitted ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center text-sm font-bold">
                ✓ Partner Application Submitted! Your KYC documents are currently under administrative review.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Business Name" required placeholder="Niranta Transit Hotel" />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-900">Category</label>
                  <select className="w-full text-sm">
                    <option>Transit Hotel / Pods</option>
                    <option>Restaurant & Dining</option>
                    <option>Spa & Rejuvenation</option>
                    <option>Tours & Experiences</option>
                    <option>Airport Transfers / Cab Fleet</option>
                  </select>
                </div>
                <Input label="Contact Person Email" type="email" required placeholder="partner@hotel.com" />
                <Input label="GSTIN / Business Registration Number" required placeholder="27AAAAA0000A1Z5" />
                
                <Button type="submit" variant="primary" className="w-full py-3 mt-4">
                  Submit Application & Upload KYC
                </Button>
              </form>
            )}
          </Card>
        </div>
      </Container>
    </div>
  );
}
