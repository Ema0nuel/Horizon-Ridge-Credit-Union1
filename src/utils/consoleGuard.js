/* eslint-disable no-unused-vars */
/**
 * Console Guard - Prevents unauthorized console access and inspection
 * Logs tampering attempts to localStorage + optional Supabase
 * PRODUCTION-SAFE: No debugger, no backend required
 */

const ConsoleGuard = {
    isDevMode: import.meta.env.MODE === 'development' || import.meta.env.DEV,
    isTamperingDetected: false,
    tamperingAttempts: [],
    _originalConsole: null,

    /**
     * Initialize console guard - call on app mount
     */
    init: function () {
        // Store original console before overriding
        this._originalConsole = { ...console };

        if (this.isDevMode) {
            console.log(
                '%c✅ Dev Mode Active - Console Debugging Enabled',
                'color: #4caf50; font-weight: bold;'
            );
            return;
        }

        // Production: Disable console output
        this.disableConsole();
        this.detectDevTools();
        this.preventConsoleTampering();
    },

    /**
     * Disable all console methods in production
     */
    disableConsole: function () {
        const noop = () => { };

        try {
            console.log = noop;
            console.warn = noop;
            console.error = noop;
            console.debug = noop;
            console.info = noop;
            console.table = noop;
            console.group = noop;
            console.groupEnd = noop;
            console.time = noop;
            console.timeEnd = noop;
            console.trace = noop;
            console.assert = noop;
            console.clear = noop;
        } catch (e) {
            // Silently fail
        }
    },

    /**
     * Detect if DevTools is open using safe behavioral checks
     */
    detectDevTools: function () {
        let devToolsOpen = false;

        const checkConsoleOverride = () => {
            try {
                const test = new Error();
                return test.stack && test.stack.includes('chrome-extension');
            } catch (e) {
                return false;
            }
        };

        const checkConsoleIntegrity = () => {
            try {
                const original = console.log;
                console.log = () => { };
                const modified = console.log !== original;
                console.log = original;
                return modified;
            } catch (e) {
                return false;
            }
        };

        const checkDevtoolsPattern = () => {
            try {
                const before = performance.now();
                const testObj = { test: new Array(100).fill('x') };
                JSON.stringify(testObj);
                const after = performance.now();
                return after - before > 100;
            } catch (e) {
                return false;
            }
        };

        const checkErrorStack = () => {
            try {
                throw new Error();
            } catch (e) {
                return (
                    e.stack &&
                    (e.stack.includes('chrome-extension') ||
                        e.stack.includes('devtools') ||
                        e.stack.includes('webkit'))
                );
            }
        };

        if (
            checkConsoleOverride() ||
            checkConsoleIntegrity() ||
            checkDevtoolsPattern() ||
            checkErrorStack()
        ) {
            devToolsOpen = true;
        }

        if (devToolsOpen) {
            this.handleTampering('devtools_detected');
        }

        // Continuous monitoring (throttled)
        let lastCheck = Date.now();
        setInterval(() => {
            const now = Date.now();
            if (now - lastCheck < 2000) return;

            try {
                if (
                    checkConsoleOverride() ||
                    checkDevtoolsPattern() ||
                    checkErrorStack()
                ) {
                    if (!devToolsOpen) {
                        this.handleTampering('devtools_opened');
                        devToolsOpen = true;
                    }
                }
            } catch (e) {
                // Silently fail
            }
            lastCheck = now;
        }, 2000);
    },

    /**
     * Prevent console method overrides (safe, non-destructive)
     */
    preventConsoleTampering: function () {
        const self = this;
        const originalDefineProperty = Object.defineProperty;

        try {
            Object.defineProperty(window, 'console', {
                get: function () {
                    self.handleTampering('console_access_attempt');
                    return self._originalConsole;
                },
                set: function () {
                    self.handleTampering('console_override_attempt');
                },
                configurable: false,
            });
        } catch (e) {
            // Silently fail
        }

        Object.defineProperty = function (...args) {
            try {
                if (args[0] === window || args[0] === console) {
                    self.handleTampering('object_defineProperty_abuse');
                }
            } catch (e) {
                // Silently fail
            }
            return originalDefineProperty.apply(this, args);
        };

        try {
            Object.freeze(console);
        } catch (e) {
            // Silently fail
        }
    },

    /**
     * Handle tampering attempts - store locally only
     */
    handleTampering: function (tamperingType) {
        this.isTamperingDetected = true;
        const attempt = {
            type: tamperingType,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
        };

        this.tamperingAttempts.push(attempt);
        this.storeLocalLog(attempt);
    },

    /**
     * Store tampering attempts in localStorage (no backend needed)
     */
    storeLocalLog: function (attempt) {
        try {
            const existing = JSON.parse(
                localStorage.getItem('console_tampering_logs') || '[]'
            );
            existing.push(attempt);

            // Keep only last 50 attempts to avoid bloating localStorage
            if (existing.length > 50) {
                existing.shift();
            }

            localStorage.setItem('console_tampering_logs', JSON.stringify(existing));
        } catch (e) {
            // Silently fail if localStorage unavailable
        }
    },

    /**
     * Get tampering logs from localStorage
     */
    getTamperingReport: function () {
        try {
            const logs = JSON.parse(
                localStorage.getItem('console_tampering_logs') || '[]'
            );
            return logs;
        } catch (e) {
            return [];
        }
    },

    /**
     * Clear tampering logs (admin utility)
     */
    clearTamperingLogs: function () {
        if (this.isDevMode) {
            try {
                localStorage.removeItem('console_tampering_logs');
                this.tamperingAttempts = [];
                this._originalConsole?.log('✅ Tampering logs cleared');
            } catch (e) {
                // Silently fail
            }
        }
    },

    /**
     * Export tampering logs as JSON (admin utility)
     */
    exportTamperingLogs: function () {
        const logs = this.getTamperingReport();
        const json = JSON.stringify(logs, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tampering-logs-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    },

    /**
     * Safe logging for dev mode
     */
    devLog: function (message, data = null) {
        if (this.isDevMode && this._originalConsole) {
            this._originalConsole.log(`[DEV] ${message}`, data || '');
        }
    },
};

// Attach to window for global access
if (typeof window !== 'undefined') {
    window.ConsoleGuard = ConsoleGuard;
}

export default ConsoleGuard;