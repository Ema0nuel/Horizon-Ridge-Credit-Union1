/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../Services/supabase/supabaseClient";
import { sendEmailAPI } from "../../../Services/api";
import UserHeader from "../../../components/UserHeader";
import { LoadingSpinner } from "../../../components/Spinner";
import { handleSignout } from "../../../Services/supabase/authService";

const DepositIcon = ({ bankName }) => {
  const iconMap = {
    "Bank Transfer": (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-4-2m4 2l4-2"
        />
      </svg>
    ),
    "Credit Card": (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h18M7 15h4m4 0h4M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    Stripe: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  };
  return (
    <div className="text-white group-hover:text-opacity-90 transition-all">
      {iconMap[bankName] || iconMap["Bank Transfer"]}
    </div>
  );
};

const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  disabled = false,
  maxLength,
  min,
  max,
  step,
}) => (
  <div className="mb-4">
    <label className="block text-xs sm:text-sm font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80">
      {label}
      {required && <span className="text-red-600 ml-1">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
      min={min}
      max={max}
      step={step}
      className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 transition-all font-sans ${
        error
          ? "border-red-500 focus:ring-red-500 focus:ring-opacity-50"
          : "border-secondary focus:ring-basic focus:ring-opacity-30"
      } ${
        disabled ? "bg-gray-100 opacity-50 cursor-not-allowed" : "bg-primary"
      }`}
    />
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  error,
  disabled = false,
}) => (
  <div className="mb-4">
    <label className="block text-xs sm:text-sm font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80">
      {label}
      {required && <span className="text-red-600 ml-1">*</span>}
    </label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 transition-all font-sans ${
        error
          ? "border-red-500 focus:ring-red-500 focus:ring-opacity-50"
          : "border-secondary focus:ring-basic focus:ring-opacity-30"
      } ${
        disabled ? "bg-gray-100 opacity-50 cursor-not-allowed" : "bg-primary"
      }`}
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((opt) => (
        <option key={opt.id || opt.value} value={opt.id || opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

const BankCard = ({ name, description, isSelected, onClick, bankColor }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-3 p-4 sm:p-6 rounded-sm border transition-all active:scale-95 w-full text-center group ${
      isSelected
        ? "border-basic bg-primary shadow-lg"
        : "border-secondary bg-primary hover:border-basic hover:shadow-md"
    }`}
    aria-pressed={isSelected}
  >
    <div
      className={`w-16 h-16 ${bankColor} rounded-full flex items-center justify-center`}
    >
      <DepositIcon bankName={name} />
    </div>
    <div className="flex-1">
      <h3 className="font-semibold text-secondary text-sm">{name}</h3>
      <p className="text-xs text-secondary opacity-70 mt-1">{description}</p>
    </div>
    {isSelected && <div className="text-basic font-bold text-lg">✔️</div>}
  </button>
);

const generateDepositOTPEmailHTML = (code, amount, bankName) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Montserrat', 'Segoe UI', sans-serif; background: linear-gradient(135deg, #1b9466b9 0%, #1b1b1b 100%); margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 3px; box-shadow: 0 4px 12px rgba(27, 148, 102, 0.15); overflow: hidden; }
    .header { background: linear-gradient(135deg, #1b9466b9 0%, #1b1b1b 100%); color: #fff; padding: 40px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
    .content { padding: 40px 20px; color: #1b1b1b; }
    .otp-box { background: #f5f5f5; border-left: 4px solid #1b9466b9; border-radius: 3px; padding: 20px; margin: 20px 0; text-align: center; }
    .otp-code { font-size: 48px; font-weight: bold; color: #1b9466b9; letter-spacing: 8px; font-family: 'Courier New', monospace; }
    .otp-label { color: #666; font-size: 14px; margin-top: 10px; }
    .details { background: #f5f5f5; border-radius: 3px; padding: 20px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ddd; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #666; font-weight: 500; font-size: 14px; }
    .detail-value { color: #1b1b1b; font-weight: bold; text-align: right; }
    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 3px; margin: 20px 0; color: #856404; font-size: 14px; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; }
    p { margin: 0 0 15px 0; font-size: 14px; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Deposit Verification</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">One-Time Password (OTP)</p>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>We received a request to add funds to your Horizon Ridge Credit Union account. Please use the verification code below to confirm your deposit:</p>
      <div class="otp-box">
        <div class="otp-code">${code}</div>
        <div class="otp-label">Valid for 5 minutes</div>
      </div>
      <div class="details">
        <div class="detail-row">
          <span class="detail-label">Bank Method:</span>
          <span class="detail-value">${bankName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Amount:</span>
          <span class="detail-value">${amount}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Timestamp:</span>
          <span class="detail-value">${new Date().toLocaleString()}</span>
        </div>
      </div>
      <div class="warning">
        <strong>âš ï¸ Important:</strong> Never share this code with anyone. Horizon Ridge Credit Union staff will never ask for your OTP.
      </div>
      <p>If you did not request this deposit, please ignore this email and contact our support team immediately.</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Horizon Ridge Credit Union Bank. All rights reserved.</p>
      <p>This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`;

const ReceiptModal = ({ isOpen, transaction, account, profile, onClose }) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-sm border border-secondary shadow-2xl max-w-md w-full max-h-96 overflow-y-auto">
        <div className="bg-basic text-primary p-6 text-center">
          <div className="text-5xl mb-3"></div>
          <h2 className="text-2xl font-bold">Horizon Ridge Credit Union</h2>
          <p className="text-sm opacity-90 mt-1">Deposit Receipt</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="text-center py-3 bg-yellow-50 border border-yellow-200 rounded-sm">
            <p className="text-sm font-semibold text-yellow-800">
              Pending Admin Approval
            </p>
          </div>
          <div className="space-y-3 text-sm border-b border-secondary pb-4">
            <div className="flex justify-between">
              <span className="text-secondary opacity-70">Reference:</span>
              <span className="font-mono font-semibold text-secondary">
                {transaction.reference_number}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary opacity-70">Date:</span>
              <span className="font-semibold text-secondary">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary opacity-70">Time:</span>
              <span className="font-semibold text-secondary">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
          <div className="text-center py-4">
            <p className="text-xs text-secondary opacity-70 mb-1">Amount</p>
            <p className="text-3xl font-bold text-basic">
              {transaction.currency} {parseFloat(transaction.amount).toFixed(2)}
            </p>
          </div>
          <div className="text-sm border-b border-secondary pb-4">
            <p className="text-secondary opacity-70 text-xs uppercase tracking-wider mb-1">
              Depositing To
            </p>
            <p className="font-semibold text-secondary">
              {account?.account_number}
            </p>
            <p className="text-xs text-secondary opacity-70 mt-1">
              {profile?.full_name}
            </p>
          </div>
          {transaction.description && (
            <div className="text-sm">
              <p className="text-secondary opacity-70 text-xs uppercase tracking-wider mb-1">
                Description
              </p>
              <p className="text-secondary">{transaction.description}</p>
            </div>
          )}
        </div>
        <div className="bg-gray-50 p-4 border-t border-secondary text-center">
          <p className="text-xs text-secondary opacity-70 mb-4">
            Your deposit will be processed once approved by our team
          </p>
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 transition-all active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export function AddMoneyPage() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBank, setSelectedBank] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const [formData, setFormData] = useState({
    toAccountId: "",
    amount: "",
    bankMethod: "",
    accountHolderName: "",
    description: "",
  });

  const [otpInput, setOtpInput] = useState("");
  const [otpCodeId, setOtpCodeId] = useState(null);
  const [codeRecord, setCodeRecord] = useState(null);

  const [transactionData, setTransactionData] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState(null);

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("[ADD_MONEY] Session error:", sessionError?.message);
          throw new Error("Authentication session failed");
        }

        if (!session?.user?.id) {
          navigate("/auth/login", { replace: true });
          return;
        }

        const uid = session.user.id;
        setUserId(uid);

        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("id, email, full_name, phone_number, is_deleted")
          .eq("id", uid)
          .maybeSingle();

        if (profileError) {
          console.error(
            "[ADD_MONEY] Profile fetch error:",
            profileError?.message,
          );
          throw new Error(`Profile load failed: ${profileError?.message}`);
        }

        if (!profileData) {
          console.warn("[ADD_MONEY] Profile not found");
          setMessage({
            type: "error",
            text: "Profile not found. Please complete registration.",
          });
          setLoading(false);
          return;
        }

        if (profileData.is_deleted) {
          console.warn("[ADD_MONEY] User profile is deleted");
          setMessage({ type: "error", text: "Account has been deleted." });
          setLoading(false);
          return;
        }

        setProfile(profileData);

        // FIX: Fetch all accounts (not .maybeSingle() since user can have multiple accounts)
        const { data: accountsData, error: accountsError } = await supabase
          .from("accounts")
          .select(
            "id, user_id, account_number, account_type, currency, balance, status, is_deleted",
          )
          .eq("user_id", uid);

        if (accountsError) {
          console.error(
            "[ADD_MONEY] Accounts fetch error:",
            accountsError?.message,
          );
          throw new Error(`Accounts load failed: ${accountsError?.message}`);
        }

        const normAccounts = Array.isArray(accountsData)
          ? accountsData
          : accountsData
            ? [accountsData]
            : [];
        const activeAccounts = normAccounts.filter(
          (a) => !a.is_deleted && a.status === "active",
        );

        if (mounted) {
          setAccounts(activeAccounts);
          if (activeAccounts.length > 0) {
            setFormData((prev) => ({
              ...prev,
              toAccountId: activeAccounts[0].id,
            }));
          }
        }
      } catch (err) {
        console.error("[ADD_MONEY] Init error:", err?.message || err);
        setMessage({
          type: "error",
          text: err?.message || "Failed to load account data",
        });
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const bankMethods = [
    {
      id: "bank_transfer",
      label: "Bank Transfer",
      desc: "Direct bank deposit",
      color: "bg-blue-600",
    },
    {
      id: "credit_card",
      label: "Credit Card",
      desc: "Via credit card",
      color: "bg-purple-600",
    },
    {
      id: "stripe",
      label: "Stripe",
      desc: "Secure payment",
      color: "bg-indigo-600",
    },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.toAccountId) newErrors.toAccountId = "Select account";
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      newErrors.amount = "Enter valid amount";
    if (parseFloat(formData.amount) > 100000)
      newErrors.amount = "Amount exceeds limit (100,000)";
    if (!formData.bankMethod) newErrors.bankMethod = "Select payment method";
    if (!formData.accountHolderName)
      newErrors.accountHolderName = "Enter account holder name";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const now = new Date().toISOString();
      const { data: codeData, error: codeError } = await supabase
        .from("codes")
        .select("id, code, code_type, expires_at, is_used")
        .eq("code_type", "transfer_otp")
        .eq("is_used", false)
        .gt("expires_at", now)
        .limit(1)
        .maybeSingle();

      if (codeError) {
        console.error("[ADD_MONEY] Code query error:", codeError?.message);
        throw new Error(`OTP code query failed: ${codeError?.message}`);
      }

      if (!codeData) {
        console.warn("[ADD_MONEY] No available transfer_otp codes");
        throw new Error("No OTP codes available. Try again later.");
      }

      if (!profile?.email) {
        throw new Error("User email missing. Complete profile.");
      }

      const selectedMethod = bankMethods.find(
        (m) => m.id === formData.bankMethod,
      );
      const toAccount = accounts.find((a) => a.id === formData.toAccountId);

      if (!toAccount) {
        throw new Error("Selected account not found");
      }

      const emailPayload = {
        to: profile.email.trim(),
        subject: "Your Horizon Ridge Credit Union Deposit Verification Code",
        html: generateDepositOTPEmailHTML(
          codeData.code,
          `${toAccount.currency} ${parseFloat(formData.amount).toFixed(2)}`,
          selectedMethod?.label || "Bank Deposit",
        ),
      };

      if (!emailPayload.to || !emailPayload.subject || !emailPayload.html) {
        throw new Error("Email payload incomplete");
      }

      const emailResponse = await sendEmailAPI(emailPayload);

      setCodeRecord(codeData);
      setOtpCodeId(codeData.id);
      setShowOTPInput(true);
      setMessage({ type: "success", text: `OTP sent to ${profile.email}` });
    } catch (err) {
      console.error("[ADD_MONEY] OTP request failed:", err?.message || err);
      setMessage({ type: "error", text: err?.message || "Failed to send OTP" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otpInput.trim()) {
      setErrors({ otpCode: "Enter OTP" });
      return;
    }

    if (otpInput !== codeRecord?.code) {
      setErrors({ otpCode: "Invalid OTP" });
      return;
    }

    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const toAccount = accounts.find((a) => a.id === formData.toAccountId);
      if (!toAccount) throw new Error("Account not found");

      const depositAmount = parseFloat(formData.amount);

      // Mark code as used
      const { error: updateCodeError } = await supabase
        .from("codes")
        .update({
          is_used: true,
          used_at: new Date().toISOString(),
          used_by_user_id: userId,
        })
        .eq("id", otpCodeId);

      if (updateCodeError) {
        console.error(
          "[ADD_MONEY] Code update error:",
          updateCodeError?.message,
        );
        throw new Error(`Failed to mark OTP used: ${updateCodeError?.message}`);
      }

      // ===== CRITICAL FIX: Use toAccountId for both from and to =====
      // Deposit transaction: user's own account receives funds
      // from_account_id = toAccountId (internal transfer from deposit source)
      // to_account_id = toAccountId (destination account)
      // In practice: from_account_id can be same as to_account_id for deposits,
      // or set to a system/clearing account if one exists

      const { data: txnData, error: txnError } = await supabase
        .from("transactions")
        .insert([
          {
            from_account_id: formData.toAccountId, // FIX: Use account ID instead of null
            to_account_id: formData.toAccountId,
            amount: depositAmount,
            currency: toAccount.currency,
            transaction_type: "deposit",
            status: "pending",
            description: formData.description || `Deposit via ${selectedBank}`,
            reference_number: `DEP-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)
              .toUpperCase()}`,
            initiated_by_user_id: userId,
            metadata: {
              bank_method: formData.bankMethod,
              account_holder_name: formData.accountHolderName,
              otp_verified_at: new Date().toISOString(),
              deposit_source: "external",
            },
          },
        ])
        .select("*")
        .maybeSingle();

      if (txnError) {
        console.error(
          "[ADD_MONEY] Transaction insert error:",
          txnError?.message,
        );
        throw new Error(`Transaction creation failed: ${txnError?.message}`);
      }

      if (!txnData) {
        throw new Error("Transaction created but no data returned");
      }

      setTransactionData(txnData);
      setTransactionStatus("pending");
      setShowOTPInput(false);
      setOtpInput("");
      setShowReceipt(true);
      setMessage({
        type: "success",
        text: `Deposit submitted! Ref: ${txnData.reference_number}`,
      });
    } catch (err) {
      console.error("[ADD_MONEY] OTP verify failed:", err?.message || err);
      setMessage({
        type: "error",
        text: err?.message || "Verification failed",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      toAccountId: accounts[0]?.id || "",
      amount: "",
      bankMethod: "",
      accountHolderName: "",
      description: "",
    });
    setErrors({});
    setMessage({ type: "", text: "" });
    setShowForm(false);
    setShowOTPInput(false);
    setOtpInput("");
    setTransactionData(null);
    setTransactionStatus(null);
    setShowReceipt(false);
    setSelectedBank("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!userId || !profile) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-secondary mb-4">
            {message.text || "Unable to load profile"}
          </p>
          <button
            onClick={() => navigate("/auth/login")}
            className="py-2 px-6 bg-basic text-primary font-semibold rounded-sm"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="min-h-screen bg-primary">
        <UserHeader
          profile={profile}
          handleSignOut={() => handleSignout(navigate)}
        />
        <main className="container mx-auto max-w-6xl px-4 py-8 text-center">
          <p className="text-secondary mb-4">No active accounts found</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="py-2 px-6 bg-basic text-primary font-semibold rounded-sm"
          >
            Back to Dashboard
          </button>
        </main>
      </div>
    );
  }

  const accountOptions = accounts.map((acc) => ({
    id: acc.id,
    label: `${acc.account_number} (${acc.account_type}) - ${
      acc.currency
    } ${parseFloat(acc.balance || 0).toFixed(2)}`,
  }));

  const toAccount = accounts.find((a) => a.id === formData.toAccountId);

  return (
    <div className="min-h-screen bg-primary">
      <UserHeader
        profile={profile}
        handleSignOut={() => navigate("/auth/login")}
      />

      <main className="container mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <div className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-secondary opacity-70">
          <button
            onClick={() => navigate("/dashboard")}
            className="hover:opacity-100 font-bold"
          >
            &lt; Dashboard
          </button>
          <span>/</span>
          <span className="font-semibold opacity-100">Add Money</span>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-2">
            Add Money to Your Account
          </h1>
          <p className="text-sm sm:text-base text-secondary opacity-70">
            Deposit funds via your preferred payment method
          </p>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 sm:p-6 rounded-sm border-l-4 ${
              message.type === "success"
                ? "bg-green-50 border-green-500 text-green-800"
                : "bg-red-50 border-red-500 text-red-800"
            }`}
          >
            <p className="text-sm font-semibold">{message.text}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-1">
            <div className="bg-primary rounded-sm border border-secondary shadow-md p-6 sticky top-24">
              <h2 className="text-lg sm:text-xl font-semibold text-secondary mb-4">
                Payment Method
              </h2>
              <div className="space-y-3">
                {bankMethods.map((method) => (
                  <BankCard
                    key={method.id}
                    name={method.label}
                    description={method.desc}
                    isSelected={selectedBank === method.id}
                    onClick={() => {
                      setSelectedBank(method.id);
                      setFormData((prev) => ({
                        ...prev,
                        bankMethod: method.id,
                      }));
                      setShowForm(true);
                      setErrors({});
                    }}
                    bankColor={method.color}
                  />
                ))}
              </div>
            </div>
          </div>

          {showForm && (
            <div className="lg:col-span-2">
              <div className="bg-primary rounded-sm border border-secondary shadow-md p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-secondary mb-6">
                  Deposit Details
                </h2>

                {!showOTPInput && transactionStatus !== "pending" ? (
                  <form onSubmit={handleRequestOTP}>
                    <SelectField
                      label="Deposit To Account"
                      name="toAccountId"
                      value={formData.toAccountId}
                      onChange={handleFormChange}
                      options={accountOptions}
                      required
                      error={errors.toAccountId}
                    />

                    <FormField
                      label="Account Holder Name"
                      name="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={handleFormChange}
                      placeholder="Full name"
                      required
                      error={errors.accountHolderName}
                    />

                    <FormField
                      label={`Deposit Amount (${toAccount?.currency || "USD"})`}
                      name="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="100000"
                      value={formData.amount}
                      onChange={handleFormChange}
                      placeholder="0.00"
                      required
                      error={errors.amount}
                    />

                    <div className="mb-6">
                      <label className="block text-xs sm:text-sm font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80">
                        Description (Optional)
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        placeholder="Notes"
                        rows="3"
                        className="w-full px-4 py-3 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic focus:ring-opacity-30 font-sans bg-primary"
                      />
                    </div>

                    {formData.amount && toAccount && (
                      <div className="mb-6 p-4 sm:p-6 rounded-sm border border-secondary bg-primary shadow-sm space-y-4">
                        <h4 className="font-semibold text-secondary text-base">
                          Summary
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between pb-3 border-b border-secondary opacity-70">
                            <span className="text-secondary">To Account:</span>
                            <span className="font-semibold text-secondary">
                              {toAccount.account_number}
                            </span>
                          </div>
                          <div className="flex justify-between pb-3 border-b border-secondary opacity-70">
                            <span className="text-secondary">Method:</span>
                            <span className="font-semibold text-secondary capitalize">
                              {
                                bankMethods.find(
                                  (m) => m.id === formData.bankMethod,
                                )?.label
                              }
                            </span>
                          </div>
                          <div className="flex justify-between pb-3 border-b border-secondary opacity-70">
                            <span className="text-secondary">Holder:</span>
                            <span className="font-semibold text-secondary">
                              {formData.accountHolderName}
                            </span>
                          </div>
                          <div className="flex justify-between pt-2">
                            <span className="font-semibold text-secondary">
                              Amount:
                            </span>
                            <span className="font-bold text-basic text-lg">
                              {toAccount.currency}{" "}
                              {parseFloat(formData.amount).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 px-6 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <LoadingSpinner size="sm" /> Sending OTP...
                        </>
                      ) : (
                        "Request OTP & Continue"
                      )}
                    </button>
                  </form>
                ) : showOTPInput && transactionStatus !== "pending" ? (
                  <form onSubmit={handleVerifyOTP}>
                    <div className="mb-6 p-4 sm:p-6 rounded-sm border border-secondary bg-primary">
                      <p className="text-secondary text-sm">
                        OTP sent to{" "}
                        <strong className="text-basic">{profile?.email}</strong>
                      </p>
                    </div>

                    <FormField
                      label="Enter OTP Code"
                      name="otpCode"
                      value={otpInput}
                      onChange={(e) => {
                        setOtpInput(e.target.value);
                        setErrors({});
                      }}
                      placeholder="000000"
                      required
                      error={errors.otpCode}
                    />

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowOTPInput(false);
                          setOtpInput("");
                        }}
                        className="flex-1 py-3 px-6 border border-secondary text-secondary font-semibold rounded-sm hover:bg-gray-50 transition-all active:scale-95"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 py-3 px-6 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <LoadingSpinner size="sm" /> Verifying...
                          </>
                        ) : (
                          "Verify & Complete"
                        )}
                      </button>
                    </div>
                  </form>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </main>

      <ReceiptModal
        isOpen={showReceipt}
        transaction={transactionData}
        account={toAccount}
        profile={profile}
        onClose={() => {
          setShowReceipt(false);
          setTimeout(() => {
            resetForm();
            navigate("/dashboard");
          }, 1500);
        }}
      />
    </div>
  );
}

export default AddMoneyPage;
