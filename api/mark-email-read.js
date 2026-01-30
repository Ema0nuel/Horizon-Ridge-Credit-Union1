import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { emailId } = req.body;

    if (!emailId) {
        return res.status(400).json({ error: 'Missing emailId' });
    }

    try {
        const { data, error } = await supabase
            .from('inbound_emails')
            .update({ status: 'read' })
            .eq('id', emailId)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        console.log(`[MARK-READ] Email ${emailId} marked as read`);

        return res.status(200).json({
            success: true,
            email: data,
        });
    } catch (err) {
        console.error('[MARK-READ] Error:', err.message);

        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
}