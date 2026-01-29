import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../../../components/Spinner";
import LOGO from "../../../assets/images/Logo-abn.png";
import { isAdminAuthenticated, validateAdminLogin } from "./adminAuth";

export function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  // Load remembered email if stored
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("admin_remembered_email");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    console.log("[ADMIN LOGIN] Attempting authentication");

    try {
      // Simulate auth delay (in production, could call backend API)
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (validateAdminLogin(email, password)) {
        console.log("[ADMIN LOGIN] Authentication successful");

        // Store remembered email if checked
        if (rememberMe) {
          localStorage.setItem("admin_remembered_email", email);
        } else {
          localStorage.removeItem("admin_remembered_email");
        }

        // Navigate to admin dashboard
        navigate("/admin/dashboard", { replace: true });
      } else {
        console.error("[ADMIN LOGIN] Invalid credentials");
        setError("Invalid email or password. Please try again.");
        setPassword(""); // Clear password on failure
      }
    } catch (err) {
      console.error("[ADMIN LOGIN] Error:", err);
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-primary rounded-sm border border-secondary shadow-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={LOGO} alt="Horizon Ridge Credit Union Admin" className="h-12" />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg
              className="w-6 h-6 text-basic"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h1 className="text-2xl font-bold text-secondary">Admin Portal</h1>
          </div>
          <p className="text-sm text-secondary opacity-70">
            Secure administrator access
          </p>
          <div className="h-1 w-12 bg-basic mx-auto mt-3 rounded-xs" />
        </div>

        {/* Error Alert */}
        {error && (
          <div
            className="mb-6 p-4 bg-red-50 border border-red-300 text-red-800 rounded-sm text-sm flex items-start gap-3"
            role="alert"
            aria-live="polite"
          >
            <svg
              className="w-5 h-5 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Email Field */}
          <div>
            <label
              htmlFor="admin-email"
              className="block text-sm font-semibold text-secondary mb-2 uppercase tracking-wide opacity-80"
            >
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              disabled={loading}
              className="w-full px-4 py-3 border border-secondary rounded-sm text-secondary bg-primary focus:outline-none focus:ring-2 focus:ring-basic focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label="Admin Email"
              autoComplete="email"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="admin-password"
              className="block text-sm font-semibold text-secondary mb-2 uppercase tracking-wide opacity-80"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={loading}
              className="w-full px-4 py-3 border border-secondary rounded-sm text-secondary bg-primary focus:outline-none focus:ring-2 focus:ring-basic focus:border-transparent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              aria-label="Password"
              autoComplete="current-password"
              required
            />
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2">
            <input
              id="admin-remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
              className="w-4 h-4 rounded-xs border-secondary cursor-pointer accent-basic disabled:opacity-60 disabled:cursor-not-allowed"
            />
            <label
              htmlFor="admin-remember"
              className="text-sm text-secondary cursor-pointer"
            >
              Remember this email
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 active:scale-95 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" /> Authenticating...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h12.5M3 12c0 4.418 3.582 8 8 8s8-3.582 8-8"
                  />
                </svg>
                Sign In as Admin
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 border-t border-secondary pt-6">
          <div className="bg-blue-50 rounded-sm border border-blue-200 p-4">
            <p className="text-xs font-semibold text-blue-900 mb-2">
              âš ï¸ Restricted Access
            </p>
            <p className="text-xs text-blue-800 opacity-90">
              This portal is restricted to authorized administrators only.
              Unauthorized access attempts are logged and monitored.
            </p>
          </div>

          <p className="text-center text-xs text-secondary opacity-60 mt-6">
            Horizon Ridge Credit Union Admin Dashboard â€¢ Secure Session
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;

