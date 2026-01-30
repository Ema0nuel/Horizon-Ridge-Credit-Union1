import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { supabase } from "../../../Services/supabase/supabaseClient";
import { LoadingSpinner } from "../../../components/Spinner";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { updatePassword, loading } = useAuth();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      setIsValidating(true);

      try {
        // ✅ Method 1: Check URL parameter
        if (token) {
          setValidToken(true);
          setIsValidating(false);
          return;
        }

        // ✅ Method 2: Check Supabase session (token in URL hash from email link)
        const { data } = await supabase.auth.getSession();

        if (data?.session) {
          setValidToken(true);
        } else {
          setValidToken(false);
        }
      } catch (err) {
        console.error("[RESET] Token validation error:", err);
        setValidToken(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (err) {
      console.error("[RESET] Password update error:", err);
      setError(err.message || "Failed to reset password");
    }
  };

  // Loading state
  if (isValidating) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-primary rounded-sm border border-secondary shadow-lg p-8 text-center">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-secondary opacity-70 mt-4">
            Validating reset link...
          </p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!validToken) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-primary rounded-sm border border-secondary shadow-lg p-8 text-center">
          <div className="text-4xl mb-4">⏰</div>
          <h1 className="text-3xl font-bold text-secondary mb-4">
            Invalid or Expired Link
          </h1>
          <p className="text-sm text-secondary opacity-70 mb-6">
            This reset link has expired or is invalid. Reset links are valid for
            24 hours.
          </p>
          <div className="space-y-3">
            <a
              href="/auth/forgot-password"
              className="block w-full py-3 px-6 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 transition-all"
            >
              Request New Reset Link
            </a>
            <a
              href="/auth/login"
              className="block w-full py-3 px-6 border border-secondary text-secondary font-semibold rounded-sm hover:bg-primary hover:bg-opacity-50 transition-all"
            >
              Back to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Valid token - show reset form
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-primary rounded-sm border border-secondary shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Create New Password
          </h1>
          <p className="text-sm text-secondary opacity-70">
            Enter a strong password for your account
          </p>
        </div>

        {success ? (
          <div className="p-6 bg-green-100 border border-green-300 rounded-sm text-center">
            <div className="text-4xl mb-4">✓</div>
            <h2 className="font-semibold text-green-800 mb-2">Success!</h2>
            <p className="text-sm text-green-700">
              Your password has been reset. Redirecting to login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {error && (
              <div
                className="p-4 bg-red-50 border border-red-300 text-red-800 rounded-sm text-sm flex items-start gap-3"
                role="alert"
              >
                <span className="text-lg">⚠</span>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-secondary mb-2"
              >
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="w-full px-4 py-3 border border-secondary rounded-sm text-secondary bg-primary focus:outline-none focus:ring-2 focus:ring-basic focus:border-transparent transition-all"
                disabled={loading}
                required
                aria-describedby="password-hint"
              />
              <p
                id="password-hint"
                className="text-xs text-secondary opacity-60 mt-1"
              >
                Use uppercase, lowercase, numbers, and symbols for strength
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-secondary mb-2"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-4 py-3 border border-secondary rounded-sm text-secondary bg-primary focus:outline-none focus:ring-2 focus:ring-basic focus:border-transparent transition-all"
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-95"
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" /> Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}

        {/* Footer Help */}
        <div className="mt-6 pt-6 border-t border-secondary text-center">
          <p className="text-xs text-secondary opacity-60">
            Remember your password?{" "}
            <a
              href="/auth/login"
              className="text-basic hover:underline font-semibold"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
