const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
    console.log('Testing SMTP connection with Gmail...');
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_USER:', process.env.SMTP_USER);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || `"HotelWatch" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_TO || 'hotelrates@parthyp.com',
            subject: 'Email Test Success!',
            text: 'This is a test email to verify your SMTP settings.',
            html: '<b>Your email notification system is now working correctly!</b>',
        });
        console.log('Message sent: %s', info.messageId);
        console.log('Test email SENT successfully!');
    } catch (error) {
        console.error('Error sending test email:', error);
    }
}

testEmail();
