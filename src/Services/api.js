/**
 * Send email via Resend API
 */
export async function sendEmailAPI({ to, subject, html }) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const res = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ to, subject, html }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to send email');
        }

        return data.result;
    } catch (err) {
        console.error('Email send error:', err);
        if (err.name === 'AbortError') {
            throw new Error('Request timed out - server might be down');
        }
        if (err.message.includes('Failed to fetch')) {
            throw new Error('Could not connect to email server - is it running?');
        }
        throw err;
    }
}

/**
 * Get list of received emails
 */
export async function getInboxEmails() {
    try {
        const res = await fetch('/api/list-emails', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        return data.emails || [];
    } catch (err) {
        console.error('Inbox fetch error:', err);
        throw err;
    }
}

/**
 * Mark email as read
 */
export async function markEmailAsRead(emailId) {
    try {
        const res = await fetch('/api/mark-email-read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailId }),
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        return data.email;
    } catch (err) {
        console.error('Mark read error:', err);
        throw err;
    }
}

/**
 * Delete email
 */
export async function deleteEmailAPI(emailId) {
    try {
        const res = await fetch('/api/delete-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailId }),
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        return data;
    } catch (err) {
        console.error('Delete email error:', err);
        throw err;
    }
}

/**
 * Get email details from Resend
 */
export async function getEmailDetails(emailId) {
    try {
        const res = await fetch('/api/get-email-details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailId }),
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        return data.email;
    } catch (err) {
        console.error('Get email details error:', err);
        throw err;
    }
}