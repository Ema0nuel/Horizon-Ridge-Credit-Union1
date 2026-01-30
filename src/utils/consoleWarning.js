import ConsoleGuard from './consoleGuard';

/**
 * Custom Console Warning System
 * Respects production/dev mode from ConsoleGuard
 */

const ConsoleWarning = {
    // ...existing colors object...
    colors: {
        danger: {
            title: '#ff4444',
            border: '#ff0000',
            background: '#fff0f0',
            text: '#cc0000',
        },
        warning: {
            title: '#ff9800',
            border: '#ff6b00',
            background: '#fff8f0',
            text: '#cc5500',
        },
        info: {
            title: '#2196F3',
            border: '#0066cc',
            background: '#f0f8ff',
            text: '#0033aa',
        },
        success: {
            title: '#4caf50',
            border: '#2e7d32',
            background: '#f0fff0',
            text: '#1b5e20',
        },
    },

    warn: function (title, message, type = 'danger', options = {}) {
        // Skip console output in production
        if (!ConsoleGuard.isDevMode) {
            return;
        }

        const colors = this.colors[type] || this.colors.danger;
        const emoji = options.emoji || '❌';
        const showCancel = options.showCancel !== false;

        const titleStyle = `
      font-size: 16px;
      font-weight: bold;
      color: ${colors.title};
      text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
      padding: 8px 0;
    `;

        const messageStyle = `
      font-size: 13px;
      color: ${colors.text};
      line-height: 1.5;
      padding: 8px 0;
      font-family: 'Courier New', monospace;
    `;

        const borderStyle = `
      border-left: 4px solid ${colors.border};
      padding: 12px 16px;
      background-color: ${colors.background};
      margin: 10px 0;
      border-radius: 4px;
    `;

        console.log(`%c${emoji} ${title}`, titleStyle);
        console.log(`%c${message}`, `${borderStyle}${messageStyle}`);

        if (type === 'danger' && showCancel) {
            const footerStyle = `
        font-size: 11px;
        color: #999;
        font-style: italic;
        padding: 8px 0;
        border-top: 1px solid ${colors.border};
        margin-top: 8px;
        padding-top: 8px;
      `;

            console.log(
                `%cℹ️ This is a security feature. Do not paste or execute code here unless you understand what you're doing.`,
                footerStyle
            );
        }

        if (options.metadata) {
            console.table(options.metadata);
        }
    },

    unauthorized: function (action, details = {}) {
        if (!ConsoleGuard.isDevMode) return;

        this.warn(
            '🚫 UNAUTHORIZED ACCESS ATTEMPT',
            `Action "${action}" is NOT ALLOWED. This action has been logged and reported.`,
            'danger',
            {
                emoji: '🚫',
                metadata: {
                    action,
                    timestamp: new Date().toISOString(),
                    ...details,
                },
            }
        );
    },

    securityBreach: function (type, severity = 'high') {
        if (!ConsoleGuard.isDevMode) return;

        const messages = {
            injection: 'XSS/Injection attack detected',
            unauthorized: 'Unauthorized access attempt',
            malicious: 'Malicious code execution prevented',
            fraud: 'Potential fraud detected',
        };

        this.warn(
            '🛑 SECURITY BREACH',
            `${messages[type] || type} - Severity: ${severity.toUpperCase()}. Incident logged.`,
            'danger',
            {
                emoji: '🛑',
                metadata: {
                    type,
                    severity,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                },
            }
        );
    },

    dev: function (title, message) {
        if (!ConsoleGuard.isDevMode) return;
        this.warn(title, message, 'warning', { emoji: '⚠️' });
    },

    success: function (title, message) {
        if (!ConsoleGuard.isDevMode) return;
        this.warn(title, message, 'success', { emoji: '✅', showCancel: false });
    },

    info: function (title, message) {
        if (!ConsoleGuard.isDevMode) return;
        this.warn(title, message, 'info', { emoji: 'ℹ️', showCancel: false });
    },

    banner: function (text, type = 'danger') {
        if (!ConsoleGuard.isDevMode) return;

        const colors = this.colors[type];
        const style = `
      background: linear-gradient(135deg, ${colors.background} 0%, ${colors.title}15 100%);
      color: ${colors.text};
      padding: 16px 20px;
      border-radius: 6px;
      border-left: 6px solid ${colors.border};
      font-weight: bold;
      font-size: 14px;
      text-align: center;
    `;

        console.log(`%c${text}`, style);
    },

    table: function (title, data, type = 'danger') {
        if (!ConsoleGuard.isDevMode) return;
        this.warn(title, 'See table below for details', type);
        console.table(data);
    },
};

if (typeof window !== 'undefined') {
    window.ConsoleWarning = ConsoleWarning;
}

export default ConsoleWarning;