import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { data, error } = await supabase
            .from('inbound_emails')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) {
            throw new Error(error.message);
        }

        console.log(`[LIST-EMAILS] “ Retrieved ${data?.length || 0} emails`);

        return res.status(200).json({
            success: true,
            emails: data || [],
        });
    } catch (err) {
        console.error('[LIST-EMAILS]  Error:', err.message);

        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
}