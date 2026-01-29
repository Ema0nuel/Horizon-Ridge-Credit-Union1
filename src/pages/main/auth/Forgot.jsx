import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { LoadingSpinner } from "../../../components/Spinner";

export function ForgotPasswordPage() {
  const { resetPasswordRequest, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    try {
      await resetPasswordRequest(email);
      setSent(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-primary rounded-sm border border-secondary shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Reset Password
          </h1>
          <p className="text-sm text-secondary opacity-70">
            Enter your email to receive reset link
          </p>
        </div>

        {sent ? (
          <div className="space-y-6">
            <div className="p-6 bg-green-100 border border-green-300 rounded-sm text-center">
              <h2 className="font-semibold text-green-800 mb-2">Email Sent</h2>
              <p className="text-sm text-green-700">
                Check your email for a password reset link. The link expires in
                1 hour.
              </p>
            </div>

            <Link
              to="/auth/login"
              className="block text-center py-3 px-4 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-100 border border-red-300 text-red-800 rounded-xs text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-secondary rounded-xs text-secondary bg-primary focus:outline-none focus:ring-2 focus:ring-basic"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" /> Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>

            <Link
              to="/auth/login"
              className="block text-center text-sm text-basic hover:underline font-semibold"
            >
              Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
