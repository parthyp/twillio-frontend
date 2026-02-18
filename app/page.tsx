'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Smartphone, MapPin, Loader2 } from 'lucide-react';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    zipcode: '',
    smsConsent: false,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('You have successfully subscribed!');
        setFormData({ name: '', phone: '', zipcode: '', smsConsent: false });
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to connect to the server.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
          HotelWatch
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-neutral-950 to-neutral-950 -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight"
          >
            Never Miss a <span className="text-indigo-400">Hotel Deal</span> Again.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-neutral-400 max-w-2xl mx-auto"
          >
            Get daily SMS updates with the best hotel rates in your area. Simple, fast, and straight to your phone.
          </motion.p>
        </div>
      </section>

      {/* Subscription Form */}
      <div className="max-w-md mx-auto px-6 py-12 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 p-8 rounded-2xl shadow-2xl ring-1 ring-white/10"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">Join the Waitlist</h2>
            <p className="text-neutral-400 text-sm">Start saving on your next stay.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-1">Name</label>
              <input
                type="text"
                id="name"
                required
                className="w-full bg-neutral-800 border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-neutral-500"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-300 mb-1">Phone Number</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-3 h-5 w-5 text-neutral-500" />
                <input
                  type="tel"
                  id="phone"
                  required
                  className="w-full bg-neutral-800 border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-neutral-500"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="zipcode" className="block text-sm font-medium text-neutral-300 mb-1">Zip Code</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-neutral-500" />
                <input
                  type="text"
                  id="zipcode"
                  required
                  className="w-full bg-neutral-800 border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-neutral-500"
                  placeholder="90210"
                  value={formData.zipcode}
                  onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center pt-1">
                  <input
                    type="checkbox"
                    id="smsConsent"
                    required
                    className="peer sr-only"
                    checked={formData.smsConsent}
                    onChange={(e) => setFormData({ ...formData, smsConsent: e.target.checked })}
                  />
                  <div className="h-5 w-5 border-2 border-neutral-700 rounded peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all flex items-center justify-center">
                    <CheckCircle className={`h-3.5 w-3.5 text-white transition-opacity ${formData.smsConsent ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                </div>
                <span className="text-xs text-neutral-400 leading-normal">
                  I agree to receive recurring automated SMS messages from HotelWatch regarding hotel rate alerts for my selected zip code. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for assistance. Consent is not a condition of purchase.
                  <br />
                  <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 underline mt-1 inline-block">Privacy Policy</Link>
                  <span className="mx-1 text-neutral-600">|</span>
                  <Link href="/terms" className="text-indigo-400 hover:text-indigo-300 underline mt-1 inline-block">Terms of Service</Link>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-6"
            >
              {status === 'loading' ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Subscribe Now
                  <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-3 rounded-lg text-sm text-center ${status === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                {status === 'success' && <CheckCircle className="h-4 w-4" />}
                {message}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Value Props */}
      <div className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8 w-full flex-grow">
        {[
          { title: "Real-time Updates", description: "Get instant notifications when prices drop in your area." },
          { title: "Curated Deals", description: "We filter out the noise and only send you the best offers." },
          { title: "Cancel Anytime", description: "No commitments. Text STOP to unsubscribe instantly." }
        ].map((item, i) => (
          <div key={i} className="bg-neutral-900/30 p-6 rounded-xl border border-neutral-800">
            <h3 className="text-xl font-semibold mb-2 text-indigo-300">{item.title}</h3>
            <p className="text-neutral-400">{item.description}</p>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
