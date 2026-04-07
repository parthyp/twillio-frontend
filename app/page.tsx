'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Smartphone, MapPin, Loader2, XCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    zipcode: '',
    plan: 'PREMIUM',
    selectedHotels: '',
    smsConsent: false,
  });
  const [tempHotels, setTempHotels] = useState<string[]>([]);
  const [currentHotel, setCurrentHotel] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const plans = [
    {
      id: 'PREMIUM',
      name: 'Premium Plan',
      price: '$29/mo',
      features: ['Pick 10 custom hotels', '3 SMS alerts daily(9am, 12pm, 6pm)'],
      color: 'from-amber-600 via-orange-500 to-red-400'
    }
  ];

  const addHotel = () => {
    if (currentHotel && tempHotels.length < 10) {
      const newHotels = [...tempHotels, currentHotel];
      setTempHotels(newHotels);
      setFormData({ ...formData, selectedHotels: newHotels.join(',') });
      setCurrentHotel('');
    }
  };

  const removeHotel = (index: number) => {
    const newHotels = tempHotels.filter((_, i) => i !== index);
    setTempHotels(newHotels);
    setFormData({ ...formData, selectedHotels: newHotels.join(',') });
  };

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
        // Now create the Checkout Session
        const checkoutRes = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            plan: formData.plan,
            subId: data.subscription.id,
          }),
        });

        const checkoutData = await checkoutRes.json();

        if (checkoutRes.ok && checkoutData.url) {
          setStatus('success');
          setMessage('Redirecting to Stripe for payment...');
          setFormData({ name: '', phone: '', email: '', zipcode: '', plan: 'PREMIUM', selectedHotels: '', smsConsent: false });
          setTempHotels([]);
          window.location.href = checkoutData.url;
        } else {
          setStatus('error');
          setMessage(checkoutData.error || 'Failed to create Stripe session.');
        }
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

      {/* Success Notification - Moving to top as requested */}
      {status === 'success' && message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto w-full px-6 mb-8"
        >
          <div className="bg-green-500/10 text-green-400 border border-green-500/20 p-4 rounded-2xl text-center flex items-center justify-center gap-3 shadow-[0_0_50px_-12px_rgba(34,197,94,0.3)]">
            <CheckCircle className="h-5 w-5" />
            <span className="font-semibold tracking-tight">{message}</span>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-neutral-950 to-neutral-950 -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-tight"
          >
            Track Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">Competition</span>. <br />
            Protect Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-400">Revenue</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed"
          >
            The ultimate market intelligence tool for hotel owners. Get daily SMS alerts with the 10 cheapest rates from booking.com in your area.
          </motion.p>
        </div>
      </section>

      {/* Pricing and Form Section */}
      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10 w-full">
        <div className="grid max-w-md mx-auto gap-8 mb-16">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => setFormData({ ...formData, plan: plan.id })}
              className={`cursor-pointer group relative p-8 rounded-3xl border transition-all duration-300 ${formData.plan === plan.id
                ? 'bg-neutral-900 border-indigo-500 shadow-[0_0_40px_-10px_rgba(99,102,241,0.4)]'
                : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700'
                }`}
            >
              {formData.plan === plan.id && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Selected
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
                    <CheckCircle className={`h-4 w-4 shrink-0 ${formData.plan === plan.id ? 'text-indigo-400' : 'text-neutral-600'}`} />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className={`h-1 w-full rounded-full bg-gradient-to-r ${plan.color} opacity-20 group-hover:opacity-100 transition-opacity`} />
            </motion.div>
          ))}
        </div>

        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto bg-neutral-900/60 backdrop-blur-2xl border border-neutral-800 p-8 md:p-12 rounded-[2rem] shadow-2xl ring-1 ring-white/10"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Subscribe to {plans.find(p => p.id === formData.plan)?.name}</h2>
            <p className="text-neutral-400">Complete the form below to start your alerts.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">Full Name</label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full bg-neutral-800/50 border-neutral-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-neutral-500"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-300 mb-2">Phone Number</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-3.5 h-5 w-5 text-neutral-500" />
                  <input
                    type="tel"
                    id="phone"
                    required
                    className="w-full bg-neutral-800/50 border-neutral-700 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-neutral-500"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full bg-neutral-800/50 border-neutral-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-neutral-500"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="zipcode" className="block text-sm font-medium text-neutral-300 mb-2">Zip Code where hotel is location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-neutral-500" />
                <input
                  type="text"
                  id="zipcode"
                  required
                  className="w-full bg-neutral-800/50 border-neutral-700 rounded-xl pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-neutral-500"
                  placeholder="90210"
                  value={formData.zipcode}
                  onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })}
                />
              </div>
            </div>

            {formData.plan === 'PREMIUM' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4 pt-4 border-t border-neutral-800"
              >
                <label className="block text-sm font-medium text-neutral-300">
                  Select 10 Hotels ({tempHotels.length}/10)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    disabled={tempHotels.length >= 10}
                    className="flex-grow bg-neutral-800/50 border-neutral-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-amber-500 transition-all disabled:opacity-50"
                    placeholder="Enter hotel name..."
                    value={currentHotel}
                    onChange={(e) => setCurrentHotel(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHotel())}
                  />
                  <button
                    type="button"
                    onClick={addHotel}
                    disabled={!currentHotel || tempHotels.length >= 10}
                    className="px-6 bg-amber-600 hover:bg-amber-500 disabled:bg-neutral-800 text-white rounded-xl transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tempHotels.map((hotel, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 bg-neutral-800 border border-neutral-700 px-3 py-1.5 rounded-lg text-sm group"
                    >
                      {hotel}
                      <button
                        type="button"
                        onClick={() => removeHotel(idx)}
                        className="text-neutral-500 hover:text-red-400 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {tempHotels.length < 10 && (
                  <p className="text-xs text-neutral-500">Please add {10 - tempHotels.length} more hotels to continue.</p>
                )}
              </motion.div>
            )}

            <div className="pt-4">
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
                  I agree to receive recurring automated SMS messages regarding hotel rate alerts.
                  <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 underline mx-1">Privacy Policy</Link>
                  and
                  <Link href="/terms" className="text-indigo-400 hover:text-indigo-300 underline mx-1">Terms</Link>.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={status === 'loading' || (formData.plan === 'PREMIUM' && tempHotels.length < 10)}
              className={`w-full font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed mt-6 ${formData.plan === 'PREMIUM' ? 'bg-amber-600 hover:bg-amber-500' : 'bg-indigo-600 hover:bg-indigo-500'
                } text-white`}
            >
              {status === 'loading' ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <>
                  Confirm {plans.find(p => p.id === formData.plan)?.name} Subscription
                  <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {status === 'error' && message && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-xl text-sm text-center bg-red-500/10 text-red-400 border border-red-500/20"
            >
              <div className="flex items-center justify-center gap-2">
                <XCircle className="h-4 w-4" />
                {message}
              </div>
            </motion.div>
          )}

          <Suspense fallback={null}>
            <StripeStatusHandler setStatus={setStatus} setMessage={setMessage} />
          </Suspense>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

function StripeStatusHandler({ setStatus, setMessage }: { 
  setStatus: (s: 'idle' | 'loading' | 'success' | 'error') => void, 
  setMessage: (m: string) => void 
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const subId = searchParams.get('subId');

    if (success) {
      setStatus('success');
      setMessage(`Subscription successful! ${subId ? `Confirmation Number: HW-${subId.slice(-6).toUpperCase()}` : 'Welcome to HotelWatch.'}`);
    } else if (canceled) {
      setStatus('error');
      setMessage('Payment was canceled. You can try again when you are ready.');
    }
  }, [searchParams, setStatus, setMessage]);

  return null;
}
