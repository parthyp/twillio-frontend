import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import nodemailer from 'nodemailer';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-06-20' as any,
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { phone, email } = body;

        if (!phone && !email) {
            return NextResponse.json(
                { error: 'Phone number or email is required.' },
                { status: 400 }
            );
        }

        let whereClause: any = { active: true };
        let searchIdentifier = '';

        if (phone) {
            const cleanPhone = phone.replace(/\D/g, '');
            if (cleanPhone.length < 10) {
                return NextResponse.json(
                    { error: 'Please enter a valid phone number.' },
                    { status: 400 }
                );
            }
            whereClause.phone = { contains: cleanPhone };
            searchIdentifier = cleanPhone;
        } else if (email) {
            if (!email.includes('@')) {
                return NextResponse.json(
                    { error: 'Please enter a valid email address.' },
                    { status: 400 }
                );
            }
            whereClause.email = email;
            searchIdentifier = email;
        }

        // 1. Update Database (Mark as Inactive)
        const dbResult = await prisma.subscription.updateMany({
            where: whereClause,
            data: {
                active: false,
            },
        });

        const subscriberFound = dbResult.count > 0;

        // 2. Attempt Stripe Cancellation
        let stripeMessage = 'No Stripe subscription linked to this identifier found.';
        let stripeSuccess = false;

        if (process.env.STRIPE_SECRET_KEY) {
            try {
                let customerId = '';

                if (phone) {
                    const cleanPhone = phone.replace(/\D/g, '');
                    const customers = await stripe.customers.search({
                        query: `phone:"${cleanPhone}"`,
                    });
                    if (customers.data.length > 0) customerId = customers.data[0].id;
                } else if (email) {
                    const customers = await stripe.customers.search({
                        query: `email:"${email}"`,
                    });
                    if (customers.data.length > 0) customerId = customers.data[0].id;
                }

                if (customerId) {
                    // List active subscriptions for this customer
                    const subscriptions = await stripe.subscriptions.list({
                        customer: customerId,
                        status: 'active',
                        limit: 1,
                    });

                    if (subscriptions.data.length > 0) {
                        const subId = subscriptions.data[0].id;
                        await stripe.subscriptions.cancel(subId);
                        stripeSuccess = true;
                        stripeMessage = 'Stripe subscription has been cancelled.';
                    } else {
                        stripeMessage = 'Found customer, but no active Stripe subscription was found.';
                    }
                }
            } catch (stripeErr) {
                console.error('Stripe Cancellation Error:', stripeErr);
                stripeMessage = 'Alerts stopped, but we could not cancel your Stripe billing automatically. Please cancel manually.';
            }
        }

        // 3. Send Email Notification to Admin
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.SMTP_PORT || '465'),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            await transporter.sendMail({
                from: process.env.SMTP_FROM || `"HotelWatch" <${process.env.SMTP_USER}>`,
                to: process.env.SMTP_TO || 'hotelrates@parthyp.com',
                subject: `Unsubscribe Alert - ${searchIdentifier}`,
                text: `A user has unsubscribed.\nIdentifier: ${searchIdentifier}\nStripe Status: ${stripeMessage}\nSubscriber found in DB: ${subscriberFound}`,
                html: `<h3>Unsubscribe Alert</h3><p><strong>Identifier:</strong> ${searchIdentifier}</p><p><strong>Stripe Status:</strong> ${stripeMessage}</p><p><strong>Database Status:</strong> ${subscriberFound ? 'Marked Inactive' : 'Not found in database'}</p>`,
            });
        } catch (emailError) {
            console.error('Failed to send unsubscribe notification email:', emailError);
        }

        if (!subscriberFound && !stripeSuccess) {
            return NextResponse.json(
                { message: 'We couldn\'t find an active subscription for this identifier.' },
                { status: 200 }
            );
        }

        return NextResponse.json(
            {
                message: subscriberFound ? 'You have been successfully unsubscribed.' : 'Stripe subscription cancelled.',
                stripeStatus: stripeMessage,
                subscriberFound
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in unsubscribe API:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
