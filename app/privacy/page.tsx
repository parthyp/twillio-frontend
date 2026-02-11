import { Footer } from '@/components/Footer';
import Link from 'next/link';

export default function PrivacyPage() {
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
                <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>

                <div className="space-y-8 text-neutral-400 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h2>
                        <p>We collect information that you provide directly to us, including your name, phone number, and zip code when you subscribe to our Service. We may also automatically collect certain information about your device and usage of our Service.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Provide, maintain, and improve our Service.</li>
                            <li>Send you SMS notifications about hotel rates.</li>
                            <li>Respond to your comments, questions, and requests.</li>
                            <li>Monitor and analyze trends, usage, and activities in connection with our Service.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">3. Data Security</h2>
                        <p>We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no method of transmission over the Internet or electronic storage is 100% secure.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">4. Sharing of Information</h2>
                        <p>We do not share your personal information with third parties except as described in this policy or with your consent. We may disclose your information if required by law or to protect our rights or property.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">5. Your Choices</h2>
                        <p>You may opt out of receiving SMS communications from us by following the instructions in those messages (e.g., replying STOP). You may also contact us to request access to, correction of, or deletion of your personal information.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">6. Changes to This Policy</h2>
                        <p>We may update this Privacy Policy from time to time. If we make material changes, we will notify you by revising the date at the top of the policy and, in some cases, provide you with additional notice.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">7. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at privacy@hotelwatch.com.</p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
