import { Footer } from '@/components/Footer';
import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-300 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
            <nav className="p-6 border-b border-neutral-900 bg-neutral-950/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                        HotelWatch
                    </Link>
                    <Link href="/" className="text-sm text-neutral-400 hover:text-white transition-colors">
                        Back to Home
                    </Link>
                </div>
            </nav>

            <main className="flex-grow max-w-4xl mx-auto px-6 py-12 w-full">
                <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>

                <div className="space-y-8 text-neutral-400 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>By accessing and using HotelWatch ("the Service"), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
                        <p>HotelWatch provides a subscription-based SMS notification service that alerts users about hotel rates in their specified zip code. The Service is provided "as is" and is subject to change or termination at any time. <strong>Message frequency varies.</strong></p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">3. User Responsibilities</h2>
                        <p>You correspond to provide accurate and current information when subscribing. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">4. SMS Communications</h2>
                        <p>By subscribing, you consent to receive recurring automated marketing messages and alerts from HotelWatch at the phone number provided. <strong>Message frequency varies.</strong> Message and data rates may apply. Consent is not a condition of purchase. For help, reply <strong>HELP</strong> to any message or email support@hotelwatch.com. To opt-out, reply <strong>STOP</strong> at any time to unsubscribe. After texting STOP, you will receive one final message confirming that you have been unsubscribed.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">5. Cancellation and Termination</h2>
                        <p>You may cancel your subscription at any time by replying <strong>STOP</strong> to any message or contacting our support. After texting STOP, you will receive one final message confirming that you have been unsubscribed. We reserve the right to terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">6. Limitation of Liability</h2>
                        <p>In no event shall HotelWatch, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">7. Changes to Terms</h2>
                        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">8. Contact Us</h2>
                        <p>If you have any questions about these Terms, please contact us at support@hotelwatch.com.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">9. Privacy</h2>
                        <p>Your use of the Service is also governed by our <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 underline">Privacy Policy</Link>, which is incorporated into these Terms by reference. Please review the Privacy Policy to understand our practices regarding the collection and use of your information.</p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
