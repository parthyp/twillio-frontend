import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, email, zipcode, smsConsent, plan, selectedHotels } = body;

        if (!name || !phone || !email || !zipcode || !plan) {
            return NextResponse.json(
                { error: 'Name, email, phone number, zipcode, and plan are required.' },
                { status: 400 }
            );
        }

        if (plan === 'PREMIUM' && (!selectedHotels || selectedHotels.split(',').length < 10)) {
            return NextResponse.json(
                { error: 'Premium plan requires selecting exactly 10 hotels.' },
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

        if (!email.includes('@')) {
            return NextResponse.json(
                { error: 'Please enter a valid email address.' },
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
                email,
                zipcode,
                plan,
                selectedHotels,
                smsConsent: !!smsConsent,
            },
        });

        // Use the absolute URL of the home page for the unsubscribe link
        const origin = request.headers.get('origin') || 'http://localhost:3000';
        const unsubscribeLink = `${origin}/unsubscribe?email=${encodeURIComponent(email)}`;

        // Send emails
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            // 1. Send admin notification
            await transporter.sendMail({
                from: process.env.SMTP_FROM || '"HotelWatch" <noreply@hotelwatch.com>',
                to: process.env.SMTP_TO || 'hotelrates@parthyp.com',
                subject: 'New Subscription - HotelWatch',
                text: `New subscriber details:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nZipcode: ${zipcode}\nPlan: ${plan}\nSelected Hotels: ${selectedHotels}\nSMS Consent: ${smsConsent}`,
                html: `<p>New subscriber details:</p><ul><li><strong>Name:</strong> ${name}</li><li><strong>Email:</strong> ${email}</li><li><strong>Phone:</strong> ${phone}</li><li><strong>Zipcode:</strong> ${zipcode}</li><li><strong>Plan:</strong> ${plan}</li><li><strong>Selected Hotels:</strong> ${selectedHotels}</li><li><strong>SMS Consent:</strong> ${smsConsent}</li></ul>`,
            });

            // 2. Send welcome email to subscriber
            await transporter.sendMail({
                from: process.env.SMTP_FROM || '"HotelWatch" <noreply@hotelwatch.com>',
                to: email,
                subject: 'Welcome to HotelWatch!',
                text: `Hi ${name},\n\nThank you for subscribing to HotelWatch! You will now receive daily SMS alerts for the 10 cheapest hotel rates in your area.\n\nYour subscription details:\nPlan: ${plan}\nZipcode: ${zipcode}\n\nIf you ever wish to stop receiving these alerts, you can unsubscribe here: ${unsubscribeLink}\n\nBest regards,\nThe HotelWatch Team`,
                html: `
                    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 10px;">
                        <h2 style="color: #6366f1;">Welcome to HotelWatch!</h2>
                        <p>Hi <strong>${name}</strong>,</p>
                        <p>Thank you for subscribing to HotelWatch! You will now receive daily SMS alerts for the 10 cheapest hotel rates in your area.</p>
                        <hr style="border: 0; border-top: 1px solid #eee;" />
                        <p><strong>Your Subscription Details:</strong></p>
                        <ul>
                            <li><strong>Plan:</strong> ${plan}</li>
                            <li><strong>Zipcode:</strong> ${zipcode}</li>
                        </ul>
                        <p>If you have any questions, just reply to this email.</p>
                        <p style="margin-top: 30px; font-size: 0.8em; color: #999;">
                            If you ever wish to stop receiving these alerts, you can <a href="${unsubscribeLink}" style="color: #6366f1;">unsubscribe here</a>.
                        </p>
                    </div>
                `,
            });
        } catch (emailError) {
            console.error('Failed to send notification email:', emailError);
            // We don't fail the request if the email fails, so we just log it
        }

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
