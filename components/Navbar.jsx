'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, User, LogOut, Heart, Calendar, Settings, Shield } from 'lucide-react';

export const Navbar = () => {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Close mobile menu and dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/hotels', label: 'Hotels' },
    { href: '/restaurants', label: 'Restaurants' },
    { href: '/spa-wellness', label: 'Spa' },
    { href: '/gaming-entertainment', label: 'Gaming' },
    { href: '/experiences', label: 'Tours' },
    { href: '/airport-transfers', label: 'Transfers' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-sm py-2">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-8 h-8 bg-[#0369a1] rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[#0F172A]">LayoverX</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 mx-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors duration-200 ${
                    isActive ? 'text-[#0369a1] border-b-2 border-[#0369a1]' : 'text-[#64748B] hover:text-[#0369a1]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/my-itinerary"
              className="text-sm font-semibold text-[#64748B] hover:text-[#0369a1] transition-colors"
            >
              My Itinerary
            </Link>

            <Link
              href="/plan-my-layover"
              className="btn btn-primary btn-sm text-xs font-bold"
            >
              Plan My Layover
            </Link>

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 border border-[#E5E7EB] px-3 py-1.5 rounded-full hover:bg-slate-50 transition"
                >
                  <div className="w-6 h-6 bg-[#0369a1] text-white rounded-full flex items-center justify-center text-xs font-bold uppercase">
                    {user.email ? user.email[0] : 'U'}
                  </div>
                  <span className="text-xs font-bold text-[#0F172A] truncate max-w-[100px]">
                    {user.user_metadata?.full_name || 'Traveler'}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-[1010]">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                    </div>
                    <Link href="/my-profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      <User size={16} /> My Profile
                    </Link>
                    <Link href="/my-trips" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      <Calendar size={16} /> My Trips
                    </Link>
                    <Link href="/saved-itineraries" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      <Heart size={16} /> Saved Itineraries
                    </Link>
                    <Link href="/account-settings" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      <Settings size={16} /> Account Settings
                    </Link>
                    {user.app_metadata?.role === 'admin' && (
                      <Link href="/revenue-admin" className="flex items-center gap-2 px-4 py-2 text-sm text-[#0369a1] font-bold hover:bg-slate-50">
                        <Shield size={16} /> Admin Portal
                      </Link>
                    )}
                    <button
                      onClick={signOut}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 border-t border-slate-100"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 border-l border-[#E5E7EB] pl-3">
                <Link href="/my-profile" className="text-sm font-semibold text-[#64748B] hover:text-[#0369a1]">
                  Login
                </Link>
                <Link href="/my-profile" className="btn btn-secondary btn-sm text-xs font-bold">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 text-slate-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 py-4 px-2 space-y-2 rounded-b-2xl shadow-lg mt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2.5 text-base font-semibold text-slate-800 hover:bg-sky-50 rounded-xl"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link href="/my-itinerary" className="px-4 py-2 text-sm font-semibold text-slate-700">
                My Itinerary
              </Link>
              <Link href="/plan-my-layover" className="btn btn-primary w-full text-center">
                Plan My Layover
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
