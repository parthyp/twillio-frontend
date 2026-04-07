'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

function UnsubscribeForm() {
    const searchParams = useSearchParams();
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [stripeStatus, setStripeStatus] = useState('');

    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const response = await fetch('/api/unsubscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    phone: phone || undefined,
                    email: email || undefined 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message || 'Successfully unsubscribed.');
                setStripeStatus(data.stripeStatus || '');
            } else {
                setStatus('error');
                setMessage(data.error || 'Failed to unsubscribe. Please check your details.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 p-8 rounded-3xl shadow-2xl"
        >
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-100 to-neutral-500 bg-clip-text text-transparent mb-2">
                    Unsubscribe
                </h1>
                <p className="text-neutral-400">
                    Enter your phone number or email to opt-out of hotel rate alerts.
                </p>
            </div>

            {status === 'success' ? (
                <div className="text-center">
                    <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <p className="text-lg font-medium text-neutral-200 mb-2">{message}</p>
                    {stripeStatus && (
                        <p className="text-sm text-neutral-500 mb-8 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg inline-block">
                            {stripeStatus}
                        </p>
                    )}
                    <div className="mt-4"></div>
                    <Link 
                        href="/"
                        className="inline-block w-full py-4 px-6 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-xl transition-all"
                    >
                        Back to Home
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-400 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-neutral-700"
                            />
                        </div>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-neutral-800" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-neutral-900 px-2 text-neutral-500">Or</span>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-neutral-400 mb-2">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                placeholder="(555) 000-0000"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-neutral-700"
                            />
                        </div>
                    </div>

                    {status === 'error' && (
                        <p className="text-sm text-red-400 text-center bg-red-400/5 py-3 rounded-lg border border-red-400/10">
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'loading' || (!email && !phone)}
                        className={`w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-[0.98] ${
                            status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {status === 'loading' ? 'Processing...' : 'Unsubscribe Now'}
                    </button>

                    <div className="text-center mt-6">
                        <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">
                            Changed your mind? Go back
                        </Link>
                    </div>
                </form>
            )}
        </motion.div>
    );
}

export default function UnsubscribePage() {
    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950">
            <Suspense fallback={<div className="text-neutral-400 italic">Loading...</div>}>
                <UnsubscribeForm />
            </Suspense>
        </main>
    );
}
