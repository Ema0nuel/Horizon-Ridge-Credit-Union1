import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../Services/supabase/supabaseClient';
import { sendEmailAPI, markEmailAsRead } from '../Services/api';

export function useEmailManager() {
    const [emails, setEmails] = useState([]);
    const [sentEmails, setSentEmails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // ============================================================================
    // Fetch inbox emails from Supabase
    // ============================================================================
    const refreshInbox = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const { data, error: fetchError } = await supabase
                .from('inbound_emails')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);

            if (fetchError) throw fetchError;

            setEmails(data || []);
        } catch (err) {
            console.error('❌ Refresh inbox error:', err.message);
            setError(err.message || 'Failed to load inbox');
        } finally {
            setLoading(false);
        }
    }, []);

    // ============================================================================
    // Fetch sent emails from localStorage
    // ============================================================================
    const refreshSent = useCallback(async () => {
        try {
            const storedSent = localStorage.getItem('sent_emails');
            const sent = storedSent ? JSON.parse(storedSent) : [];
            setSentEmails(sent);
        } catch (err) {
            console.error('❌ Refresh sent error:', err.message);
        }
    }, []);

    // ============================================================================
    // Send email
    // ============================================================================
    const sendEmail = useCallback(
        async ({ to, subject, html }) => {
            try {
                setLoading(true);
                setError('');
                setSuccess('');

                if (!to || !subject || !html) {
                    throw new Error('All fields are required');
                }

                // Send via API
                await sendEmailAPI({ to, subject, html });

                // Store in localStorage for tracking
                const sentEmail = {
                    id: `sent_${Date.now()}`,
                    to,
                    subject,
                    html,
                    timestamp: new Date().toISOString(),
                    status: 'sent',
                };

                const currentSent = localStorage.getItem('sent_emails');
                const allSent = currentSent ? JSON.parse(currentSent) : [];
                allSent.unshift(sentEmail);
                localStorage.setItem('sent_emails', JSON.stringify(allSent));

                setSentEmails(allSent);
                setSuccess(`✓ Email sent successfully to ${to}`);

                return sentEmail;
            } catch (err) {
                console.error('❌ Send email error:', err.message);
                setError(err.message || 'Failed to send email');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // ============================================================================
    // Mark email as read
    // ============================================================================
    const markAsRead = useCallback(async (emailId) => {
        try {
            setLoading(true);

            await markEmailAsRead(emailId);

            setEmails((prev) =>
                prev.map((email) =>
                    email.id === emailId ? { ...email, status: 'processed' } : email
                )
            );

            setSuccess('Email marked as read');
        } catch (err) {
            console.error('❌ Mark as read error:', err.message);
            setError(err.message || 'Failed to mark email as read');
        } finally {
            setLoading(false);
        }
    }, []);

    // ============================================================================
    // Delete email
    // ============================================================================
    const deleteEmail = useCallback(async (emailId) => {
        try {
            setLoading(true);

            const { error: deleteError } = await supabase
                .from('inbound_emails')
                .delete()
                .eq('id', emailId);

            if (deleteError) throw deleteError;

            setEmails((prev) => prev.filter((email) => email.id !== emailId));
            setSuccess('Email deleted');
        } catch (err) {
            console.error('❌ Delete email error:', err.message);
            setError(err.message || 'Failed to delete email');
        } finally {
            setLoading(false);
        }
    }, []);

    // ============================================================================
    // Initial load + Real-time subscription
    // ============================================================================
    useEffect(() => {
        // Load initial data
        refreshInbox();
        refreshSent();

        // Subscribe to real-time updates from Supabase
        const channel = supabase
            .channel('inbound_emails_realtime')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'inbound_emails',
                },
                (payload) => {

                    if (payload.eventType === 'INSERT') {
                        setEmails((prev) => [payload.new, ...prev]);
                        setSuccess(`📨 New email: ${payload.new.subject}`);
                    } else if (payload.eventType === 'UPDATE') {
                        setEmails((prev) =>
                            prev.map((email) =>
                                email.id === payload.new.id ? payload.new : email
                            )
                        );
                    } else if (payload.eventType === 'DELETE') {
                        setEmails((prev) =>
                            prev.filter((email) => email.id !== payload.old.id)
                        );
                    }
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    return;
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [refreshInbox, refreshSent]);

    // ============================================================================
    // Auto-clear success/error messages after 5 seconds
    // ============================================================================
    useEffect(() => {
        if (error || success) {
            const timeout = setTimeout(() => {
                setError('');
                setSuccess('');
            }, 5000);
            return () => clearTimeout(timeout);
        }
    }, [error, success]);

    return {
        emails,
        sentEmails,
        loading,
        error,
        success,
        sendEmail,
        markAsRead,
        deleteEmail,
        refreshInbox,
    };
}