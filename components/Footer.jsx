import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-12 mt-12 border-t border-slate-800">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">LayoverX</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Mumbai Travel & Layover Experience Platform. Transform your transit hours into memorable journeys with premium hotels, fine dining, curated city tours, and airport transfers near CSIA.
            </p>
          </div>

          {/* Services Col */}
          <div>
            <h3 className="font-bold mb-4 text-sm text-sky-400 uppercase tracking-wider">Explore Services</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link className="hover:text-white transition-colors" href="/hotels">Airport Hotels</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/restaurants">Restaurants & Dining</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/experiences">Tours & Experiences</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/spa-wellness">Spa & Lounges</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/airport-transfers">Airport Transfers</Link></li>
            </ul>
          </div>

          {/* Company Col */}
          <div>
            <h3 className="font-bold mb-4 text-sm text-sky-400 uppercase tracking-wider">Company</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link className="hover:text-white transition-colors" href="/how-it-works">How It Works</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/contact">Contact Us</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/partner-registration">Partner With Us</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/faq">FAQs</Link></li>
              <li><Link className="hover:text-white transition-colors" href="/help-center">Help Center</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h3 className="font-bold mb-4 text-sm text-sky-400 uppercase tracking-wider">Get In Touch</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-sky-400" />
                <a href="mailto:hello@layoverx.com" className="hover:text-white transition-colors">hello@layoverx.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-sky-400" />
                <a href="tel:+912212345678" className="hover:text-white transition-colors">+91 22 1234 5678</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-sky-400 mt-0.5" />
                <span>Andheri East, Near CSMIA Terminal 2,<br/>Mumbai, MH 400099, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} LayoverX. All rights reserved. Mumbai Airport Layover Platform.</p>
          <div className="flex items-center gap-6">
            <Link className="hover:text-white transition-colors" href="/privacy">Privacy Policy</Link>
            <Link className="hover:text-white transition-colors" href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
