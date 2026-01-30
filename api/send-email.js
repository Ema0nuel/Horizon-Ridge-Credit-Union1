// sendEmail.js
// import dotenv from 'dotenv';
// dotenv.config(); // â€¦ ensure .env is loaded before using process.env

// import express from 'express';
// import { Resend } from 'resend';

// const router = express.Router();
// const apiKey = process.env.RESEND_API_KEY;

// if (!apiKey) {
//     throw new Error("Missing RESEND_API_KEY in environment.");
// }

// const resend = new Resend(apiKey);

// router.post('/send-email', async (req, res) => {
//     const { to, subject, html } = req.body;
//     if (!to || !subject || !html) {
//         return res.status(400).json({ success: false, error: "Missing required fields" });
//     }

//     try {
//         const result = await resend.emails.send({
//             from: 'Summit Ridge Credit Union <support@Summitridgecreditunion.com>',
//             to,
//             subject,
//             html,
//         });
//         res.status(200).json({ success: true, result });
//     } catch (err) {
//         res.status(500).json({ success: false, error: err.message });
//     }
// });

// export default router;

import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
    console.error('Â Missing RESEND_API_KEY environment variable');
}

const resend = new Resend(resendApiKey);

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { to, subject, html } = req.body;

    // Validate input
    if (!to || !subject || !html) {
        return res.status(400).json({
            success: false,
            error: 'Missing required fields: to, subject, html',
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid email address',
        });
    }

    try {
        console.log(`[SEND-EMAIL] Sending to: ${to}`);

        const result = await resend.emails.send({
            from: 'Summit Ridge Credit Union <support@Summitridgecreditunion.cc>',
            to,
            subject,
            html,
            reply_to: 'support@Summitridgecreditunion.cc',
        });

        console.log(`[SEND-EMAIL] Success - ID: ${result.id}`);

        return res.status(200).json({
            success: true,
            result,
        });
    } catch (err) {
        console.error('[SEND-EMAIL] Error:', err.message);

        return res.status(500).json({
            success: false,
            error: err.message || 'Failed to send email',
        });
    }
}

