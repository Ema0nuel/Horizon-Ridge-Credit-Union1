import ConsoleWarning from './consoleWarning';
import ConsoleGuard from './consoleGuard';

/**
 * Security Monitor - Logs all suspicious activity to console (dev) and backend
 */
export const SecurityMonitor = {
    logUnauthorizedAccess: (action, user, details = {}) => {
        const logData = {
            user: user?.email || 'Unknown',
            timestamp: new Date().toISOString(),
            ...details,
        };

        // Dev: Show in console
        if (ConsoleGuard.isDevMode) {
            ConsoleWarning.unauthorized(action, logData);
        }

        // Production: Silent backend report
        SecurityMonitor.reportToBackend('unauthorized_access', { action, ...logData });
    },

    detectInjection: (payload, source = 'unknown') => {
        const injectionPatterns = [
            /<script/i,
            /javascript:/i,
            /onerror=/i,
            /onclick=/i,
            /eval\(/i,
        ];

        if (injectionPatterns.some(pattern => pattern.test(payload))) {
            if (ConsoleGuard.isDevMode) {
                ConsoleWarning.securityBreach('injection', 'critical');
            }
            SecurityMonitor.reportToBackend('injection_detected', { payload: payload.substring(0, 100), source });
        }
    },

    auditAdminAction: (action, resource, result) => {
        const auditData = {
            action,
            resource,
            result,
            timestamp: new Date().toISOString(),
            admin: sessionStorage.getItem('adminEmail') || 'unknown',
        };

        if (ConsoleGuard.isDevMode) {
            console.log(`%c✅ ADMIN ACTION AUDIT`, `color: #4caf50; font-weight: bold; font-size: 12px;`);
            console.table(auditData);
        }

        SecurityMonitor.reportToBackend('admin_action', auditData);
    },

    /**
     * Silent backend reporting
     */
    reportToBackend: async function (eventType, data) {
        try {
            await fetch('/api/security/log-event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: eventType,
                    data,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                }),
            }).catch(() => { });
        } catch (e) {
            // Silently fail
            console.error(e);
        }
    },
};

export default SecurityMonitor;