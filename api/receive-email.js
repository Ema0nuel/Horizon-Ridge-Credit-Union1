// import dotenv from 'dotenv';
// dotenv.config();

// import express from 'express';
// import crypto from 'crypto';
// import { createClient } from '@supabase/supabase-js';
// import { Resend } from 'resend';

// const router = express.Router();

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
// const resendApiKey = process.env.RESEND_API_KEY;
// const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

// console.log('\n”§ BACKEND INITIALIZATION');
// console.log('  SUPABASE_URL:', supabaseUrl ? '“' : '');
// console.log('  SERVICE_ROLE_KEY:', supabaseServiceRoleKey ? '“' : '');
// console.log('  RESEND_API_KEY:', resendApiKey ? '“' : '');
// console.log('  WEBHOOK_SECRET:', webhookSecret ? '“' : '\n');

// let supabase = null;
// let resend = null;

// if (supabaseUrl && supabaseServiceRoleKey) {
//     supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
//     console.log('“ Supabase initialized with SERVICE_ROLE key\n');
// }

// if (resendApiKey) {
//     resend = new Resend(resendApiKey);
//     console.log('“ Resend initialized\n');
// }

// // ============================================================================
// // STATUS ENDPOINT
// // ============================================================================
// router.get('/webhook-status', (req, res) => {
//     return res.status(200).json({
//         supabase_url: supabaseUrl ? 'configured' : 'missing',
//         service_role_key: supabaseServiceRoleKey ? 'configured' : 'missing',
//         resend_api_key: resendApiKey ? 'configured' : 'missing',
//         webhook_secret: webhookSecret ? 'configured' : 'missing',
//         supabase_client: supabase ? 'ready' : 'failed',
//         resend_client: resend ? 'ready' : 'failed',
//     });
// });

// // ============================================================================
// // WEBHOOK: Resend Email Events
// // ============================================================================
// router.post('/receive-email', async (req, res) => {
//     const { type, data } = req.body;

//     if (type === 'email.received') {
//         console.log('\n' + '='.repeat(70));
//         console.log('“¨ EMAIL.RECEIVED EVENT');
//         console.log('='.repeat(70));
//         console.log('Email ID:', data.email_id);
//         console.log('Timestamp:', new Date().toISOString());

//         if (!resend) {
//             console.error(' Resend not configured');
//             return res.status(500).json({ error: 'Resend not configured' });
//         }

//         if (!supabase) {
//             console.error(' Supabase not configured');
//             return res.status(500).json({ error: 'Supabase not configured' });
//         }

//         try {
//             // [1/4] Fetch email from Resend
//             console.log('\n[1/4] Fetching email from Resend...');
//             const { data: emailContent, error: fetchError } = await resend.emails.receiving.get(data.email_id);

//             if (fetchError) {
//                 console.error(' Resend error:', fetchError);
//                 throw new Error(`Resend API error: ${fetchError.message}`);
//             }

//             if (!emailContent) {
//                 console.error(' No email content returned');
//                 throw new Error('No email content returned from Resend');
//             }

//             console.log('“ Email fetched');
//             console.log('  From:', emailContent.from);
//             console.log('  To:', emailContent.to);
//             console.log('  Subject:', emailContent.subject);

//             // [2/4] Prepare insert payload
//             console.log('\n[2/4] Preparing insert payload...');
//             const insertData = {
//                 message_id: emailContent.id,
//                 from_address: emailContent.from,
//                 to_address: emailContent.to,
//                 subject: emailContent.subject,
//                 body: emailContent.text || '',
//                 html_body: emailContent.html || '',
//                 status: 'received',
//                 is_spam: false,
//                 spam_score: 0,
//                 attachments: emailContent.attachments || [],
//                 created_at: emailContent.created_at || new Date().toISOString(),
//             };
//             console.log('“ Payload prepared');

//             // [3/4] Insert into Supabase (FIXED: proper error handling)
//             console.log('\n[3/4] Inserting into Supabase...');
//             const { data: storedEmail, error: storeError } = await supabase
//                 .from('inbound_emails')
//                 .insert(insertData)
//                 .select()
//                 .single();

//             // Check for error (not thrown, but returned in object)
//             if (storeError) {
//                 console.error(' Supabase insert error:');
//                 console.error('  Code:', storeError.code);
//                 console.error('  Message:', storeError.message);
//                 console.error('  Details:', storeError.details);
//                 throw new Error(`Supabase: ${storeError.message}`);
//             }

//             if (!storedEmail) {
//                 console.error(' Insert returned no data');
//                 throw new Error('Insert returned no data');
//             }

//             console.log('“ Email inserted');
//             console.log('  ID:', storedEmail.id);

//             // [4/4] Verify insert (FIXED: proper error handling)
//             console.log('\n[4/4] Verifying in database...');
//             const { data: verify, error: verifyError } = await supabase
//                 .from('inbound_emails')
//                 .select('*')
//                 .eq('id', storedEmail.id)
//                 .single();

//             if (verifyError) {
//                 console.error(' Verification error:', verifyError.message);
//                 throw new Error(`Verify: ${verifyError.message}`);
//             }

//             console.log('“ Verified in database');
//             console.log('\n' + '='.repeat(70));
//             console.log('… SUCCESS - Email stored\n');

//             return res.status(200).json({
//                 success: true,
//                 emailId: storedEmail.id,
//             });
//         } catch (err) {
//             console.error(' ERROR:', err.message);
//             console.error('='.repeat(70) + '\n');
//             return res.status(500).json({ error: err.message });
//         }
//     }

//     // ========================================================================
//     // EMAIL.SENT
//     // ========================================================================
//     if (type === 'email.sent') {
//         console.log('“ email.sent:', data.id);
//         return res.status(200).json({ success: true });
//     }

//     // ========================================================================
//     // EMAIL.DELIVERED
//     // ========================================================================
//     if (type === 'email.delivered') {
//         console.log('“ email.delivered:', data.id);
//         return res.status(200).json({ success: true });
//     }

//     // ========================================================================
//     // EMAIL.BOUNCED
//     // ========================================================================
//     if (type === 'email.bounced') {
//         console.log('š  email.bounced:', data.id);
//         return res.status(200).json({ success: true });
//     }

//     // ========================================================================
//     // EMAIL.COMPLAINED
//     // ========================================================================
//     if (type === 'email.complained') {
//         console.log('š  email.complained:', data.id);
//         return res.status(200).json({ success: true });
//     }

//     console.log('? unknown event:', type);
//     return res.status(200).json({ success: true });
// });

// // ============================================================================
// // LIST EMAILS
// // ============================================================================
// router.get('/list-emails', async (req, res) => {
//     if (!supabase) {
//         return res.status(500).json({ error: 'Supabase not configured' });
//     }

//     try {
//         const { data, error } = await supabase
//             .from('inbound_emails')
//             .select('*')
//             .order('created_at', { ascending: false })
//             .limit(100);

//         if (error) throw error;

//         console.log(`“¬ Listed ${data?.length || 0} emails`);
//         return res.status(200).json({ success: true, emails: data || [] });
//     } catch (err) {
//         console.error(' List emails error:', err.message);
//         return res.status(500).json({ error: err.message });
//     }
// });

// // ============================================================================
// // GET EMAIL DETAILS
// // ============================================================================
// router.post('/get-email-details', async (req, res) => {
//     const { emailId } = req.body;

//     if (!resend) {
//         return res.status(500).json({ error: 'Resend not configured' });
//     }

//     if (!emailId) {
//         return res.status(400).json({ error: 'emailId required' });
//     }

//     try {
//         const { data: email, error } = await resend.emails.receiving.get(emailId);

//         if (error) throw new Error(error.message);

//         return res.status(200).json({
//             success: true,
//             email: {
//                 id: email.id,
//                 from: email.from,
//                 to: email.to,
//                 subject: email.subject,
//                 html: email.html,
//                 text: email.text,
//                 attachments: email.attachments || [],
//                 created_at: email.created_at,
//             },
//         });
//     } catch (err) {
//         console.error(' Get email error:', err.message);
//         return res.status(500).json({ error: err.message });
//     }
// });

// // ============================================================================
// // MARK EMAIL AS READ
// // ============================================================================
// router.post('/mark-email-read', async (req, res) => {
//     const { emailId } = req.body;

//     if (!supabase) {
//         return res.status(500).json({ error: 'Supabase not configured' });
//     }

//     if (!emailId) {
//         return res.status(400).json({ error: 'emailId required' });
//     }

//     try {
//         const { data, error } = await supabase
//             .from('inbound_emails')
//             .update({ status: 'processed' })
//             .eq('id', emailId)
//             .select()
//             .single();

//         if (error) throw error;

//         console.log(`“ Email ${emailId} marked as read`);
//         return res.status(200).json({ success: true, email: data });
//     } catch (err) {
//         console.error(' Mark read error:', err.message);
//         return res.status(500).json({ error: err.message });
//     }
// });

// // ============================================================================
// // DELETE EMAIL
// // ============================================================================
// router.post('/delete-email', async (req, res) => {
//     const { emailId } = req.body;

//     if (!supabase) {
//         return res.status(500).json({ error: 'Supabase not configured' });
//     }

//     if (!emailId) {
//         return res.status(400).json({ error: 'emailId required' });
//     }

//     try {
//         const { error } = await supabase
//             .from('inbound_emails')
//             .delete()
//             .eq('id', emailId);

//         if (error) throw error;

//         console.log(`“ Email ${emailId} deleted`);
//         return res.status(200).json({ success: true });
//     } catch (err) {
//         console.error(' Delete email error:', err.message);
//         return res.status(500).json({ error: err.message });
//     }
// });

// export default router;




import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;

// Initialize clients
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
const resend = new Resend(resendApiKey);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { type, data } = req.body;

    console.log(`[RECEIVE-EMAIL] Event type: ${type}`);

    // Only process email.received events
    if (type !== 'email.received') {
        console.log(`[RECEIVE-EMAIL] Ignoring event type: ${type}`);
        return res.status(200).json({ success: true, message: 'Event ignored' });
    }

    if (!data || !data.email_id) {
        return res.status(400).json({ error: 'Missing email_id in webhook data' });
    }

    try {
        console.log(`[RECEIVE-EMAIL] Processing email: ${data.email_id}`);

        // [1] Fetch full email from Resend
        const { data: emailContent, error: fetchError } = await resend.emails.receiving.get(
            data.email_id
        );

        if (fetchError) {
            throw new Error(`Resend fetch error: ${fetchError.message}`);
        }

        console.log(`[RECEIVE-EMAIL] “ Fetched from: ${emailContent.from}`);

        // [2] Prepare data for Supabase
        const insertData = {
            message_id: emailContent.id,
            from_address: emailContent.from,
            to_address: emailContent.to,
            subject: emailContent.subject,
            body: emailContent.text || '',
            html_body: emailContent.html || '',
            status: 'received',
            is_spam: false,
            spam_score: 0,
            attachments: emailContent.attachments || [],
            created_at: emailContent.created_at || new Date().toISOString(),
        };

        // [3] Insert into Supabase
        const { data: storedEmail, error: storeError } = await supabase
            .from('inbound_emails')
            .insert(insertData)
            .select()
            .single();

        if (storeError) {
            throw new Error(`Supabase insert error: ${storeError.message}`);
        }

        console.log(`[RECEIVE-EMAIL] “ Stored in DB - ID: ${storedEmail.id}`);

        return res.status(200).json({
            success: true,
            emailId: storedEmail.id,
        });
    } catch (err) {
        console.error('[RECEIVE-EMAIL]  Error:', err.message);

        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
}