import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-neutral-900 bg-neutral-950 py-12">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-neutral-500 text-sm">
                    © {new Date().getFullYear()} HotelWatch. All rights reserved.
                </div>

                <div className="flex gap-6 text-sm">
                    <Link href="/terms" className="text-neutral-500 hover:text-indigo-400 transition-colors">
                        Terms of Service
                    </Link>
                    <Link href="/privacy" className="text-neutral-500 hover:text-indigo-400 transition-colors">
                        Privacy Policy
                    </Link>
                </div>
            </div>
        </footer>
    );
}
