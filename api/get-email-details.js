import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { emailId } = req.body;

    if (!emailId) {
        return res.status(400).json({ error: 'Missing emailId' });
    }

    try {
        const { data: email, error } = await resend.emails.receiving.get(emailId);

        if (error) {
            throw new Error(error.message);
        }

        console.log(`[GET-DETAILS] Retrieved email ${emailId}`);

        return res.status(200).json({
            success: true,
            email: {
                id: email.id,
                from: email.from,
                to: email.to,
                subject: email.subject,
                html: email.html,
                text: email.text,
                attachments: email.attachments || [],
                created_at: email.created_at,
            },
        });
    } catch (err) {
        console.error('[GET-DETAILS] Error:', err.message);

        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
}