'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Bell, CheckCircle, Plane } from 'lucide-react';

export default function NotificationsPage() {
  const notifs = [
    {
      id: 'n1',
      title: 'Booking Confirmed: Niranta Transit Hotel',
      message: 'Your 3-Hour micro-stay room booking #LX-BOM-88329 is confirmed for 28 July 2026.',
      time: '10 mins ago',
      type: 'success',
    },
    {
      id: 'n2',
      title: 'Flight Tracker Active',
      message: 'Air India AI 102 is currently tracking on schedule with no reported delays.',
      time: '1 hour ago',
      type: 'info',
    },
  ];

  return (
    <div className="min-h-screen pb-16 bg-slate-50">
      <Container className="pt-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Notifications Center</h1>
          <p className="text-sm text-slate-500 mb-6">Recent flight updates, booking vouchers, and concierge alerts.</p>

          <div className="space-y-4">
            {notifs.map((n) => (
              <Card key={n.id} className="p-4 md:p-6 bg-white border border-slate-200">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-slate-900 text-base">{n.title}</h3>
                  <span className="text-xs text-slate-400">{n.time}</span>
                </div>
                <p className="text-xs text-slate-600">{n.message}</p>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
