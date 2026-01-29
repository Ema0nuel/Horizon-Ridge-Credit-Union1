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

            console.log(`📬 Loaded ${data?.length || 0} emails from inbox`);
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
            console.log(`📤 Loaded ${sent.length} sent emails`);
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
                console.log('📧 Sending email...');
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
                console.log(`✓ Email sent to ${to}`);

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

            console.log(`✓ Email ${emailId} marked as read`);
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
            console.log(`✓ Email ${emailId} deleted`);
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
        console.log('🔄 Setting up real-time subscription for inbound_emails...');
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
                    console.log('🔔 Real-time update received:', payload.eventType);

                    if (payload.eventType === 'INSERT') {
                        console.log('📨 New email received:', payload.new.subject);
                        setEmails((prev) => [payload.new, ...prev]);
                        setSuccess(`📨 New email: ${payload.new.subject}`);
                    } else if (payload.eventType === 'UPDATE') {
                        console.log('✏️ Email updated:', payload.new.id);
                        setEmails((prev) =>
                            prev.map((email) =>
                                email.id === payload.new.id ? payload.new : email
                            )
                        );
                    } else if (payload.eventType === 'DELETE') {
                        console.log('🗑️ Email deleted:', payload.old.id);
                        setEmails((prev) =>
                            prev.filter((email) => email.id !== payload.old.id)
                        );
                    }
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('✓ Real-time subscription active');
                } else {
                    console.log('❌ Real-time subscription status:', status);
                }
            });

        return () => {
            console.log('Cleaning up real-time subscription');
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