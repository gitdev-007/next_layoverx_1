'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Shield, Bell, Lock } from 'lucide-react';

export default function AccountSettingsPage() {
  return (
    <div className="min-h-screen pb-16 bg-slate-50">
      <Container className="pt-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Account Settings</h1>
          <p className="text-sm text-slate-500 mb-6">Security preferences, password updates, and flight notification alerts.</p>

          <Card className="p-6 md:p-8 bg-white border border-slate-200 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#0369a1]" /> Security & Password
              </h3>
              <Button variant="outline" size="sm">
                Change Password
              </Button>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#0369a1]" /> SMS & WhatsApp Alerts
              </h3>
              <p className="text-xs text-slate-600 mb-4">
                Receive real-time automated flight delay updates and driver dispatch alerts on your phone.
              </p>
              <label className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                <input type="checkbox" defaultChecked className="rounded text-[#0369a1]" />
                Enable Flight Delay Push Alerts
              </label>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
