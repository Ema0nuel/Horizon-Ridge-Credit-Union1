import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { LoadingSpinner } from "../../../components/Spinner";
import LOGO from "../../../assets/images/Logo-abn.png";

export function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth(); // Don't use global loading for form UI
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "savings",
    currency: "USD",
  });
  const [formLoading, setFormLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  const getStepErrors = () => {
    switch (step) {
      case 1:
        if (
          !formData.fullName?.trim() ||
          !formData.phoneNumber?.trim() ||
          !formData.dateOfBirth?.trim()
        ) {
          return "Please fill in all fields";
        }
        return "";
      case 2:
        if (
          !formData.email?.trim() ||
          !formData.password?.trim() ||
          !formData.confirmPassword?.trim()
        ) {
          return "Please fill in all fields";
        }
        if (formData.password.length < 8) {
          return "Password must be at least 8 characters";
        }
        if (formData.password !== formData.confirmPassword) {
          return "Passwords do not match";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          return "Please enter a valid email address";
        }
        return "";
      default:
        return "";
    }
  };

  const handleNext = () => {
    const validationError = getStepErrors();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    setError("");
    setSuccessMessage("");
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = getStepErrors();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setSuccessMessage("Creating your account...");
    setFormLoading(true);
    try {
      const result = await signUp(
        formData.email,
        formData.password,
        formData.fullName,
        formData.phoneNumber,
        formData.dateOfBirth,
        formData.accountType,
        formData.currency,
      );
      setSuccessMessage(
        `âœ… Account created successfully! Account #: ${result.accountNumber}`,
      );
      setTimeout(() => {
        navigate("/auth/login?registered=true");
      }, 2000);
    } catch (err) {
      setSuccessMessage("");
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const StepIndicator = ({ currentStep, totalSteps }) => (
    <div className="flex gap-2 mb-8 justify-center">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`h-2 w-8 rounded-xs transition-colors ${
            i < currentStep
              ? "bg-basic"
              : i === currentStep - 1
                ? "bg-basic"
                : "bg-gray-300"
          }`}
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-8">
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
            Create Account
          </h1>
          <p className="text-sm text-secondary opacity-70">Step {step} of 4</p>
        </div>

        <StepIndicator currentStep={step} totalSteps={4} />

        {error && (
          <div
            className="mb-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-xs text-sm"
            role="alert"
          >
            âŒ {error}
          </div>
        )}

        {successMessage && (
          <div
            className="mb-6 p-4 bg-green-100 border border-green-300 text-green-800 rounded-xs text-sm"
            role="status"
          >
            ✔️ {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-secondary rounded-xs text-secondary bg-primary focus:outline-none focus:ring-2 focus:ring-basic disabled:opacity-50"
                  aria-label="Full Name"
                  disabled={formLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 border border-secondary rounded-xs text-secondary bg-primary focus:outline-none focus:ring-2 focus:ring-basic disabled:opacity-50"
                  aria-label="Phone Number"
                  disabled={formLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-secondary rounded-xs text-secondary bg-primary focus:outline-none focus:ring-2 focus:ring-basic disabled:opacity-50"
                  aria-label="Date of Birth"
                  disabled={formLoading}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-secondary rounded-xs text-secondary bg-primary focus:outline-none focus:ring-2 focus:ring-basic disabled:opacity-50"
                  aria-label="Email Address"
                  disabled={formLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Min 8 characters"
                  className="w-full px-4 py-3 border border-secondary rounded-xs text-secondary bg-primary focus:outline-none focus:ring-2 focus:ring-basic disabled:opacity-50"
                  aria-label="Password"
                  disabled={formLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder="Re-enter password"
                  className="w-full px-4 py-3 border border-secondary rounded-xs text-secondary bg-primary focus:outline-none focus:ring-2 focus:ring-basic disabled:opacity-50"
                  aria-label="Confirm Password"
                  disabled={formLoading}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label className="block text-sm font-medium text-secondary mb-4">
                  Account Type
                </label>
                <div className="space-y-3">
                  {["savings", "checking"].map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-3 p-3 border border-secondary rounded-xs cursor-pointer hover:bg-gray-50 focus-within:ring-2 focus-within:ring-basic"
                    >
                      <input
                        type="radio"
                        name="account_type"
                        value={type}
                        checked={formData.accountType === type}
                        onChange={(e) =>
                          handleInputChange("accountType", e.target.value)
                        }
                        className="w-4 h-4"
                        aria-label={`${type} account type`}
                        disabled={formLoading}
                      />
                      <span className="text-secondary capitalize font-medium">
                        {type === "savings"
                          ? "Savings Account"
                          : "Checking Account"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-4">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    handleInputChange("currency", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-secondary rounded-xs text-secondary bg-primary focus:outline-none focus:ring-2 focus:ring-basic disabled:opacity-50"
                  aria-label="Account Currency"
                  disabled={formLoading}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (Â£)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="CNY">CNY (¥)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="ZAR">ZAR (R)</option>
                  <option value="KES">KES (KSh)</option>
                  <option value="GHS">GHS (â‚µ)</option>
                  <option value="AED">AED (Ø¯.Ø¥)</option>
                  <option value="SAR">SAR (ï·¼)</option>
                  <option value="CHF">CHF (CHF)</option>
                  <option value="SEK">SEK (kr)</option>
                  <option value="NOK">NOK (kr)</option>
                  <option value="BRL">BRL (R$)</option>
                  <option value="MXN">MXN ($)</option>
                  <option value="TRY">TRY (₺)</option>
                </select>
              </div>
            </>
          )}

          {step === 4 && (
            <div className="space-y-4 bg-gray-50 rounded-sm p-6 border border-secondary">
              <h3 className="font-semibold text-secondary mb-4">
                Review Your Details
              </h3>
              <div className="text-sm space-y-2">
                <p>
                  <span className="text-secondary opacity-70">Name:</span>{" "}
                  <span className="text-secondary font-medium">
                    {formData.fullName}
                  </span>
                </p>
                <p>
                  <span className="text-secondary opacity-70">Email:</span>{" "}
                  <span className="text-secondary font-medium">
                    {formData.email}
                  </span>
                </p>
                <p>
                  <span className="text-secondary opacity-70">Phone:</span>{" "}
                  <span className="text-secondary font-medium">
                    {formData.phoneNumber}
                  </span>
                </p>
                <p>
                  <span className="text-secondary opacity-70">
                    Account Type:
                  </span>{" "}
                  <span className="text-secondary font-medium capitalize">
                    {formData.accountType === "savings"
                      ? "Savings Account"
                      : "Checking Account"}
                  </span>
                </p>
                <p>
                  <span className="text-secondary opacity-70">Currency:</span>{" "}
                  <span className="text-secondary font-medium">
                    {formData.currency}
                  </span>
                </p>
              </div>
              <p className="text-xs text-secondary opacity-60 mt-6">
                By creating an account, you agree to our Terms of Service and
                Privacy Policy.
              </p>
            </div>
          )}

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={handlePrev}
              disabled={step === 1 || formLoading}
              className="flex-1 py-3 px-4 border border-secondary text-secondary rounded-sm font-semibold hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={formLoading}
                className="flex-1 py-3 px-4 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={formLoading}
                className="flex-1 py-3 px-4 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {formLoading ? (
                  <>
                    <LoadingSpinner size="sm" /> Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            )}
          </div>
        </form>

        {/* Navigation to Login */}
        <div className="mt-8 pt-6 border-t border-secondary text-center">
          <p className="text-sm text-secondary">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-basic font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-basic rounded-xs px-1"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
