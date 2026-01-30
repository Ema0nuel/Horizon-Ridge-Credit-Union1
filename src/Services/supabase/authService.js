
import { supabase } from './supabaseClient';
import { sendEmailAPI } from '../api';

const TIMEOUT_MS = 15000;

function withTimeout(promise, ms = TIMEOUT_MS) {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms)
        ),
    ]);
}

export const authService = {
    /**
     * Login: account number â†’ user_id â†’ email â†’ Supabase Auth
     * Simple, linear, no surprises.
     */
    async signInWithAccountNumber(accountNumber, password) {
        try {
            // Step 1: Find account by number
            const { data: account, error: accountError } = await withTimeout(
                supabase
                    .from('accounts')
                    .select('user_id')
                    .eq('account_number', accountNumber)
                    .eq('is_deleted', false)
                    .single()
            );

            if (accountError) {
                console.error('[AUTH_LOGIN] Step 1 FAILED - Account not found:', accountError.message);
                throw new Error('Account not found. Please check your account number.');
            }

            if (!account?.user_id) {
                console.error('[AUTH_LOGIN] Step 1 FAILED - No user_id in account record');
                throw new Error('Account data is incomplete.');
            }

            const userId = account.user_id;

            // Step 2: Get email from user_profiles
            const { data: profile, error: profileError } = await withTimeout(
                supabase
                    .from('user_profiles')
                    .select('email')
                    .eq('id', userId)
                    .eq('is_deleted', false)
                    .maybeSingle() // Avoid 406 if not found
            );

            if (profileError) {
                console.error('[AUTH_LOGIN] Step 2 FAILED - Profile lookup error:', profileError.message);
                throw new Error('User profile not found.');
            }

            if (!profile?.email) {
                console.error('[AUTH_LOGIN] Step 2 FAILED - No email in profile');
                throw new Error('User profile is incomplete.');
            }

            const { data: authData, error: authError } = await withTimeout(
                supabase.auth.signInWithPassword({
                    email: profile.email,
                    password,
                })
            );

            if (authError) {
                console.error('[AUTH_LOGIN] Step 3 FAILED - Auth error:', authError.message);
                throw new Error('Invalid password or account is locked.');
            }

            if (!authData.user) {
                console.error('[AUTH_LOGIN] Step 3 FAILED - No user in auth response');
                throw new Error('Sign in failed unexpectedly.');
            }

            return { user: authData.user, session: authData.session };
        } catch (err) {
            console.error('[AUTH_LOGIN] ===== LOGIN FAILED =====');
            console.error('[AUTH_LOGIN] Error:', err.message);
            throw err;
        }
    },

    /**
     * Sign up: create auth user â†’ profile â†’ account â†’ send email
     */
    async signUp(email, password, fullName, phoneNumber, dateOfBirth, accountType, currency) {
        try {
            const { data: authData, error: authError } = await withTimeout(
                supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            phone_number: phoneNumber,
                            date_of_birth: dateOfBirth,
                        },
                    },
                })
            );

            if (authError) {
                console.error('[AUTH_SIGNUP] Step 1 FAILED:', authError.message);
                throw new Error(authError.message || 'Failed to create auth user');
            }

            const userId = authData.user?.id;
            if (!userId) {
                console.error('[AUTH_SIGNUP] Step 1 FAILED - No userId');
                throw new Error('Failed to create user account');
            }

            const { error: profileError } = await withTimeout(
                supabase.from('user_profiles').insert({
                    id: userId,
                    email,
                    full_name: fullName,
                    phone_number: phoneNumber,
                    date_of_birth: dateOfBirth,
                    kyc_status: 'pending',
                    is_active: true,
                    metadata: {},
                    feature_flags: {},
                })
            );

            if (profileError) {
                console.error('[AUTH_SIGNUP] Step 2 FAILED:', profileError.message);
                throw new Error(`Failed to create profile: ${profileError.message}`);
            }

            const accountNumber = Math.floor(Math.random() * 9000000000 + 1000000000).toString();

            const { error: accountError } = await withTimeout(
                supabase.from('accounts').insert({
                    user_id: userId,
                    account_number: accountNumber,
                    account_type: accountType,
                    currency,
                    status: 'active',
                    balance: 0.0,
                    available_balance: 0.0,
                    daily_transaction_limit: 100000000,
                    monthly_transaction_limit: 100000000,
                    metadata: {},
                    feature_flags: {},
                    settings: {},
                })
            );

            if (accountError) {
                console.error('[AUTH_SIGNUP] Step 3 FAILED:', accountError.message);
                throw new Error(`Failed to create account: ${accountError.message}`);
            }

            sendWelcomeEmailAsync(email, fullName, accountNumber, password).catch((err) => {
                console.warn('[AUTH_SIGNUP] Email send failed (non-critical):', err.message);
            });

            return { success: true, accountNumber, userId };
        } catch (err) {
            console.error('[AUTH_SIGNUP] ===== SIGNUP FAILED =====');
            console.error('[AUTH_SIGNUP] Error:', err.message);
            throw err;
        }
    },

    async resetPasswordRequest(email) {
        try {
            const { error } = await withTimeout(
                supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth/reset-password`,
                })
            );

            if (error) throw error;

            return { success: true };
        } catch (err) {
            console.error('[AUTH_RESET] FAILED:', err.message);
            throw new Error(err.message || 'Password reset request failed');
        }
    },

    async updatePassword(newPassword) {
        try {
            const { error } = await withTimeout(supabase.auth.updateUser({ password: newPassword }));

            if (error) throw error;
            return { success: true };
        } catch (err) {
            console.error('[AUTH_UPDATE_PWD] FAILED:', err.message);
            throw new Error(err.message || 'Password update failed');
        }
    },

    async signOut() {
        try {
            const { error } = await withTimeout(supabase.auth.signOut());

            if (error) throw error;
            return { success: true };
        } catch (err) {
            console.error('[AUTH_SIGNOUT] FAILED:', err.message);
            throw new Error(err.message || 'Sign out failed');
        }
    },

    async getSession() {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            return session;
        } catch (err) {
            console.warn('[AUTH_SESSION] Get session error:', err.message);
            return null;
        }
    },

    async getUserProfile(userId) {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', userId)
                .eq('is_deleted', false)
                .maybeSingle(); // Avoid 406

            if (error) {
                console.warn('[AUTH_PROFILE] Get profile error:', error.message);
                return null;
            }

            return data;
        } catch (err) {
            console.warn('[AUTH_PROFILE] Get profile exception:', err.message);
            return null;
        }
    },

    async getUserAccounts(userId) {
        try {
            const { data, error } = await supabase
                .from('accounts')
                .select('*')
                .eq('user_id', userId)
                .eq('is_deleted', false)
                .order('created_at', { ascending: false });

            if (error) {
                console.warn('[AUTH_ACCOUNTS] Get accounts error:', error.message);
                return [];
            }

            return data || [];
        } catch (err) {
            console.warn('[AUTH_ACCOUNTS] Get accounts exception:', err.message);
            return [];
        }
    },
};

/**
 * Send welcome email asynchronously (non-blocking)
 */
async function sendWelcomeEmailAsync(email, fullName, accountNumber, password) {
    try {
        const subject = 'Welcome to Horizon Ridge Credit Union â€“ Your Account Details';
        const html = generateWelcomeEmail(fullName, accountNumber, password);

        await sendEmailAPI({ to: email, subject, html });
    } catch (err) {
        console.error('[EMAIL_SERVICE] Failed to send email:', err.message);
        throw err;
    }
}

/**
 * Generate welcome email HTML
 */
function generateWelcomeEmail(fullName, accountNumber, password) {
    return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="UTF-8" /></head>
      <body style="font-family: Montserrat, sans-serif; color: #1b1b1b; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #1b1b1b; border-radius: 3px;">
          <div style="background: #1b1b1b; color: #fff; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to Horizon Ridge Credit Union</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your Banking Partner</p>
          </div>
          <div style="padding: 30px;">
            <p>Hello ${fullName},</p>
            <p>Your account has been successfully created. Here are your credentials:</p>
            <div style="background: #f9f9f9; border-left: 4px solid #f10; padding: 20px; margin: 20px 0;">
              <p><strong>Account Number:</strong> <code style="font-family: monospace; background: #fff; padding: 2px 6px;">${accountNumber}</code></p>
              <p><strong>Temporary Password:</strong> <code style="font-family: monospace; background: #fff; padding: 2px 6px;">${password}</code></p>
              <p style="font-size: 12px; color: #666;">âš  Please change your password immediately after login.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export const handleSignout = async (navigate) => {

    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("[DASHBOARD] signOut error:", error);
        }

        navigate("/auth/login", { replace: true });
    } catch (err) {
        console.error("SignOut err exception:", err);
    }
}
