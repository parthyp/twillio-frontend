import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
            apiVersion: '2024-06-20' as any,
        });

        const body = await request.json();
        const { name, phone, email, plan } = body;

        if (!name || !phone || !plan) {
            return NextResponse.json(
                { error: 'Name, phone, and plan are required.' },
                { status: 400 }
            );
        }

        const cleanPhone = phone.replace(/\D/g, '');

        // Use the absolute URL of the home page
        const origin = request.headers.get('origin') || 'http://localhost:3000';

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${origin}/?success=true`,
            cancel_url: `${origin}/?canceled=true`,
            customer_email: email || undefined,
            metadata: {
                name,
                phone: cleanPhone,
                email: email || '',
                plan,
            },
            // We can also set the phone number directly on the customer if we create one
            // but for simple checkout, metadata is enough for our searching
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
