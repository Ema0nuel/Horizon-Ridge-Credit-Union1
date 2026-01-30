import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;

let supabaseStatus = 'unchecked';
let resendStatus = 'unchecked';

// Try to initialize
try {
    if (supabaseUrl && supabaseServiceRoleKey) {
        createClient(supabaseUrl, supabaseServiceRoleKey);
        supabaseStatus = 'configured';
    } else {
        supabaseStatus = 'missing_keys';
    }
} catch (err) {
    supabaseStatus = 'error';
    console.log(err);
}

try {
    if (resendApiKey) {
        new Resend(resendApiKey);
        resendStatus = 'configured';
    } else {
        resendStatus = 'missing_key';
    }
} catch (err) {
    resendStatus = 'error';
    console.log(err);
}

export default async function handler(req, res) {
    return res.status(200).json({
        status: 'operational',
        timestamp: new Date().toISOString(),
        supabase: supabaseStatus,
        resend: resendStatus,
        environment: {
            supabase_url: supabaseUrl ? 'yes' : 'No',
            service_role_key: supabaseServiceRoleKey ? 'yes' : 'No',
            resend_api_key: resendApiKey ? 'yes' : 'No',
        },
    });
}