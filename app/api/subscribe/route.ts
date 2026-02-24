import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, zipcode, smsConsent, plan, selectedHotels } = body;

        if (!name || !phone || !zipcode || !plan) {
            return NextResponse.json(
                { error: 'Name, phone number, zipcode, and plan are required.' },
                { status: 400 }
            );
        }

        if (plan === 'PREMIUM' && (!selectedHotels || selectedHotels.split(',').length < 15)) {
            return NextResponse.json(
                { error: 'Premium plan requires selecting exactly 15 hotels.' },
                { status: 400 }
            );
        }

        if (!smsConsent) {
            return NextResponse.json(
                { error: 'You must agree to the SMS consent to subscribe.' },
                { status: 400 }
            );
        }

        // Basic validation (can be improved)
        if (phone.length < 10) {
            return NextResponse.json(
                { error: 'Please enter a valid phone number.' },
                { status: 400 }
            );
        }

        if (zipcode.length < 5) {
            return NextResponse.json(
                { error: 'Please enter a valid zipcode.' },
                { status: 400 }
            );
        }

        const subscription = await prisma.subscription.create({
            data: {
                name,
                phone,
                zipcode,
                plan,
                selectedHotels,
                smsConsent: !!smsConsent,
            },
        });

        return NextResponse.json(
            { message: 'Subscription successful!', subscription },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating subscription:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
