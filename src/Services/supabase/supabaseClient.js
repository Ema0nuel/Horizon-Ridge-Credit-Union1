/* eslint-disable no-undef */
import { createClient } from '@supabase/supabase-js'

const getSupabaseUrl = () => {
    // Try Vercel environment variables first
    if (typeof window === 'undefined') {
        return process.env.NEXT_PUBLIC_SUPABASE_URL;
    }
    // Fallback to Vite environment variables for local development
    return import.meta.env.VITE_SUPABASE_URL;
};

const getSupabaseAnonKey = () => {
    if (typeof window === 'undefined') {
        return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    }
    return import.meta.env.VITE_SUPABASE_ANON_KEY;
};

export const supabase = createClient(
    getSupabaseUrl(),
    getSupabaseAnonKey()
);
