
const ADMIN_CREDENTIALS = {
    email: import.meta.env.VITE_ADMIN_EMAIL,
    password: import.meta.env.VITE_ADMIN_PASSWORD,
};

/**
 * Validate admin credentials and set session
 * @param {string} email
 * @param {string} password
 * @returns {boolean}
 */
export function validateAdminLogin(email, password) {
    if (
        email === ADMIN_CREDENTIALS.email &&
        password === ADMIN_CREDENTIALS.password
    ) {
        sessionStorage.setItem("admin_authenticated", "true");
        sessionStorage.setItem("admin_login_time", Date.now().toString());
        sessionStorage.setItem("admin_email", email);
        return true;
    }
    return false;
}

/**
 * Check if admin is authenticated
 * @returns {boolean}
 */
export function isAdminAuthenticated() {
    return sessionStorage.getItem("admin_authenticated") === "true";
}

/**
 * Require admin authentication (guard for routes)
 * @returns {boolean}
 */
export function requireAdminAuth() {
    if (isAdminAuthenticated()) {
        return true;
    }
    // Redirect handled by component-level guards
    return false;
}

/**
 * Logout admin and clear session
 */
export function adminLogout() {
    sessionStorage.removeItem("admin_authenticated");
    sessionStorage.removeItem("admin_login_time");
    sessionStorage.removeItem("admin_email");
}
