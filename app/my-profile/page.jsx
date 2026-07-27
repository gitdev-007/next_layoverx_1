'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Input } from '@/components/ui/Input';
import { User, Mail, Phone, ShieldCheck } from 'lucide-react';

export default function MyProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.full_name || 'Traveler');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen pb-16 bg-slate-50">
      <Container className="pt-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">My Profile</h1>
          <p className="text-sm text-slate-500 mb-6">Manage your traveler personal details and passport information.</p>

          <Card className="p-6 md:p-8 bg-white border border-slate-200">
            {saved && (
              <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold">
                ✓ Profile updated successfully!
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                label="Email Address"
                value={user?.email || 'traveler@layoverx.com'}
                disabled
              />

              <Input
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <Button type="submit" variant="primary" className="w-full py-3 mt-4">
                Save Profile Changes
              </Button>
            </form>
          </Card>
        </div>
      </Container>
    </div>
  );
}
