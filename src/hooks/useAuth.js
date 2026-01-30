import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../Services/supabase/supabaseClient';
import { authService } from '../Services/supabase/authService';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initialize auth on mount
    useEffect(() => {
        const initAuth = async () => {
            try {
                const session = await authService.getSession();
                if (session?.user?.id) {
                    setUser(session.user);
                    const profileData = await authService.getUserProfile(session.user.id);
                    setProfile(profileData);
                    const accountsData = await authService.getUserAccounts(session.user.id);
                    setAccounts(accountsData);
                }
            } catch (err) {
                console.error('[USEAUTH] Init error:', err.message);
                setError(err.message);
            }
        };

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {

                if (event === 'SIGNED_OUT') {
                    setUser(null);
                    setProfile(null);
                    setAccounts([]);
                    setError(null);
                } else if (session?.user?.id) {
                    setUser(session.user);
                    try {
                        const profileData = await authService.getUserProfile(session.user.id);
                        setProfile(profileData);
                        const accountsData = await authService.getUserAccounts(session.user.id);
                        setAccounts(accountsData);
                    } catch (err) {
                        console.error('[USEAUTH] State change error:', err.message);
                        setError(err.message);
                    }
                }
            }
        );

        return () => subscription?.unsubscribe();
    }, []);

    const signIn = useCallback(async (accountNumber, password) => {
        setLoading(true);
        setError(null);
        try {
            const result = await authService.signInWithAccountNumber(accountNumber, password);

            // store auth state immediately
            setUser(result.user);


            const profileData = await authService.getUserProfile(result.user.id);
            setProfile(profileData);

            const accountsData = await authService.getUserAccounts(result.user.id);
            setAccounts(accountsData);

            return result;
        } catch (err) {
            console.error('[USEAUTH] signIn error:', err.message);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const signUp = useCallback(async (email, password, fullName, phoneNumber, dateOfBirth, accountType, currency) => {
        setLoading(true);
        setError(null);
        try {
            const result = await authService.signUp(email, password, fullName, phoneNumber, dateOfBirth, accountType, currency);
            return result;
        } catch (err) {
            console.error('[USEAUTH] signUp error:', err.message);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const resetPasswordRequest = useCallback(async (email) => {
        setLoading(true);
        setError(null);
        try {
            await authService.resetPasswordRequest(email);
        } catch (err) {
            console.error('[USEAUTH] resetPasswordRequest error:', err.message);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updatePassword = useCallback(async (newPassword) => {
        setLoading(true);
        setError(null);
        try {
            await authService.updatePassword(newPassword);
        } catch (err) {
            console.error('[USEAUTH] updatePassword error:', err.message);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const signOut = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await authService.signOut();
            setUser(null);
            setProfile(null);
            setAccounts([]);
        } catch (err) {
            console.error('[USEAUTH] signOut error:', err.message);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        user,
        profile,
        accounts,
        loading,
        error,
        signIn,
        signUp,
        resetPasswordRequest,
        updatePassword,
        signOut,
    };
}

/**
 * New helper hook: call this at the top of a page component to perform redirects
 * - For login page: call useAuthRedirect('if-authenticated') so signed-in users go to dashboard
 * - For dashboard page: call useAuthRedirect('if-unauthenticated') so unsigned users go to login
 */
export function useAuthRedirect(mode) {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (mode === 'if-authenticated' && user) {
            navigate('/dashboard', { replace: true });
        } else if (mode === 'if-unauthenticated' && !user) {
            navigate('/auth/login', { replace: true });
        }
    }, [mode, user, loading, navigate]);
}