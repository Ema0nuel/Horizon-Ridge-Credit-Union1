/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth, useAuthRedirect } from "../../../hooks/useAuth";
import { LoadingSpinner } from "../../../components/Spinner";
import LOGO from "../../../assets/images/Logo-abn.png";

export function LoginPage() {
  // call auth redirect hook first
  useAuthRedirect("if-authenticated");

  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [localLoading, setLocalLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!accountNumber || !password) {
      setError("Please enter account number and password");
      return;
    }

    setLocalLoading(true);
    console.log("[LOGIN] Attempting login for account:", accountNumber);

    try {
      await signIn(accountNumber, password);
      console.log("[LOGIN] Sign in succeeded");
      // no direct navigation here; redirect handled by useAuthRedirect observing user state
      setLocalLoading(false);
    } catch (err) {
      console.error("[LOGIN] Sign in error:", err);
      setError(err.message || "Login failed");
      setLocalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-primary rounded-sm border border-secondary shadow-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={LOGO}
            alt="Horizon Ridge Credit Union"
            className="w-auto h-10"
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Secure Banking
          </h1>
          <p className="text-sm text-secondary opacity-70">
            Sign in to your account
          </p>
          <div className="h-1 w-12 bg-basic mx-auto mt-3 rounded-xs" />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-xs text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Account Number
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter your 10-digit account number"
              className="w-full px-4 py-3 border border-secondary rounded-xs text-secondary bg-primary focus:outline-none focus:ring-2 focus:ring-basic focus:border-transparent"
              disabled={localLoading}
              aria-label="Account Number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-secondary rounded-xs text-secondary bg-primary focus:outline-none focus:ring-2 focus:ring-basic focus:border-transparent"
              disabled={localLoading}
              aria-label="Password"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 rounded-xs border-secondary cursor-pointer"
              disabled={localLoading}
            />
            <label
              htmlFor="remember"
              className="text-sm text-secondary cursor-pointer"
            >
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={localLoading}
            className="w-full py-3 px-4 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 active:scale-95 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            aria-busy={localLoading}
          >
            {localLoading ? (
              <>
                <LoadingSpinner size="sm" /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 space-y-3 border-t border-secondary pt-6">
          <p className="text-center text-sm text-secondary">
            Don't have an account?{" "}
            <Link
              to="/auth/signup"
              className="text-basic font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-basic rounded-xs px-1"
            >
              Create one
            </Link>
          </p>
          <p className="text-center text-sm text-secondary">
            <Link
              to="/auth/forgot-password"
              className="text-basic font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-basic rounded-xs px-1"
            >
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
