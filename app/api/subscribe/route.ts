import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, zipcode } = body;

        if (!name || !phone || !zipcode) {
            return NextResponse.json(
                { error: 'Name, phone number, and zipcode are required.' },
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
