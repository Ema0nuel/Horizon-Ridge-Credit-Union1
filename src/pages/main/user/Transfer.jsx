/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../Services/supabase/supabaseClient";
import { sendEmailAPI } from "../../../Services/api";
import UserHeader from "../../../components/UserHeader";
import { LoadingSpinner } from "../../../components/Spinner";
import { handleSignout } from "../../../Services/supabase/authService";

// Icon Components (matches Dashboard.jsx)
const TransferTypeIcon = ({ type }) => {
  const iconMap = {
    local: (
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
          d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"
        />
      </svg>
    ),
    international: (
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
    wire: (
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
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
  };
  return <div className="text-basic">{iconMap[type] || null}</div>;
};

// Transfer Type Card
const TransferCard = ({ type, title, description, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-start gap-3 p-4 sm:p-6 rounded-sm border transition-all active:scale-95 w-full text-left ${
      isSelected
        ? "border-basic bg-primary shadow-lg"
        : "border-secondary bg-primary hover:border-basic hover:shadow-md"
    }`}
    aria-pressed={isSelected}
  >
    <div className="text-basic">
      <TransferTypeIcon type={type} />
    </div>
    <div className="flex-1">
      <h3 className="font-semibold text-secondary text-base">{title}</h3>
      <p className="text-xs text-secondary opacity-70 mt-1">{description}</p>
    </div>
    {isSelected && <div className="ml-auto text-basic font-bold">✔️</div>}
  </button>
);

// Form Input Field
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

// Select Field
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

// Code Verification Modal Component
const CodeVerificationModal = ({
  isOpen,
  codeType,
  onVerify,
  onClose,
  isLoading,
  error,
}) => {
  const [codeInput, setCodeInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify(codeType, codeInput);
    setCodeInput("");
  };

  if (!isOpen) return null;

  const codeLabels = {
    cot: { label: "COT Code", desc: "Certificate of Transfer" },
    imf: { label: "IMF Code", desc: "International Monetary Fund" },
    vat: { label: "VAT Code", desc: "Value Added Tax" },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-sm border border-secondary shadow-lg max-w-md w-full p-6 sm:p-8">
        <h3 className="text-xl sm:text-2xl font-bold text-secondary mb-2">
          {codeLabels[codeType]?.label}
        </h3>
        <p className="text-sm text-secondary opacity-70 mb-6">
          {codeLabels[codeType]?.desc}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80">
              Enter Code
            </label>
            <input
              type="text"
              value={codeInput}
              onChange={(e) => {
                setCodeInput(e.target.value);
              }}
              placeholder="Enter code"
              disabled={isLoading}
              className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 transition-all font-mono text-center text-lg tracking-widest ${
                error
                  ? "border-red-500 focus:ring-red-500"
                  : "border-secondary focus:ring-basic focus:ring-opacity-30"
              }`}
              autoFocus
            />
            {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-2 px-4 border border-secondary text-secondary font-semibold rounded-sm hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !codeInput.trim()}
              className="flex-1 py-2 px-4 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" /> Verifying...
                </>
              ) : (
                "Verify"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Receipt Modal Component
const ReceiptModal = ({ isOpen, transaction, account, profile, onClose }) => {
  if (!isOpen || !transaction) return null;

  const formatCurrency = (amount, currency) =>
    `${currency} ${parseFloat(amount).toFixed(2)}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-sm border border-secondary shadow-2xl max-w-md w-full max-h-96 overflow-y-auto">
        {/* Receipt Header */}
        <div className="bg-basic text-primary p-6 text-center">
          <div className="text-5xl mb-3"></div>
          <h2 className="text-2xl font-bold">Summit Ridge Credit Union</h2>
          <p className="text-sm opacity-90 mt-1">Transaction Receipt</p>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-4">
          {/* Status */}
          <div className="text-center py-3 bg-green-50 border border-green-200 rounded-sm">
            <p className="text-sm font-semibold text-green-800">✔️ Completed</p>
          </div>

          {/* Transaction Details */}
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

          {/* Amount */}
          <div className="text-center py-4">
            <p className="text-xs text-secondary opacity-70 mb-1">Amount</p>
            <p className="text-3xl font-bold text-basic">
              {formatCurrency(transaction.amount, transaction.currency)}
            </p>
          </div>

          {/* From/To */}
          <div className="space-y-3 text-sm border-y border-secondary py-4">
            <div>
              <p className="text-secondary opacity-70 text-xs uppercase tracking-wider mb-1">
                From
              </p>
              <p className="font-semibold text-secondary">
                {account?.account_number}
              </p>
              <p className="text-xs text-secondary opacity-70">
                {profile?.full_name}
              </p>
            </div>
            <div>
              <p className="text-secondary opacity-70 text-xs uppercase tracking-wider mb-1">
                To
              </p>
              <p className="font-semibold text-secondary">
                {transaction.external_recipient_iban}
              </p>
              {transaction.external_recipient_name && (
                <p className="text-xs text-secondary opacity-70">
                  {transaction.external_recipient_name}
                </p>
              )}
            </div>
          </div>

          {/* Type */}
          <div className="text-sm">
            <p className="text-secondary opacity-70 text-xs uppercase tracking-wider mb-1">
              Transfer Type
            </p>
            <p className="font-semibold text-secondary capitalize">
              {transaction.transaction_type === "local"
                ? "Local Transfer"
                : transaction.transaction_type === "international"
                  ? "International Transfer"
                  : "Wire Transfer"}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-secondary text-center">
          <p className="text-xs text-secondary opacity-70 mb-4">
            Thank you for using Summit Ridge Credit Union
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

// OTP Email Template - MATCHES API PATTERN
const generateOTPEmailHTML = (code, recipientName, amount, transferType) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Montserrat', 'Segoe UI', sans-serif; background: linear-gradient(135deg, #1b9466b9 0%, #1b1b1b 100%); margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 3px; box-shadow: 0 4px 12px rgba(27, 148, 102, 0.15); overflow: hidden; }
    .header { background: linear-gradient(135deg, #1b9466b9 0%, #1b1b1b 100%); color: #fff; padding: 40px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: bold; font-family: 'Montserrat', sans-serif; }
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
      <h1>Transfer Verification</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">One-Time Password (OTP)</p>
    </div>
    <div class="content">
      <p>Hello <strong>${recipientName || "User"}</strong>,</p>
      <p>We received a request to transfer funds from your Summit Ridge Credit Union account. Please use the verification code below to complete your transaction:</p>
      
      <div class="otp-box">
        <div class="otp-code">${code}</div>
        <div class="otp-label">Valid for 5 minutes</div>
      </div>

      <div class="details">
        <div class="detail-row">
          <span class="detail-label">Transfer Type:</span>
          <span class="detail-value">${
            transferType === "local"
              ? "Local Transfer"
              : transferType === "international"
                ? "International Transfer"
                : "Wire Transfer"
          }</span>
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
        <strong>âš ï¸ Important:</strong> Never share this code with anyone. Summit Ridge Credit Union staff will never ask for your OTP.
      </div>

      <p>If you did not request this transfer, please ignore this email and contact our support team immediately.</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Summit Ridge Credit Union Bank. All rights reserved.</p>
      <p>This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`;

export function TransferPage() {
  const navigate = useNavigate();

  // Auth & User State
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [activeTransferType, setActiveTransferType] = useState("local");
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fromAccountId: "",
    toAccountNumber: "",
    beneficiaryName: "",
    bankName: "",
    recipientName: "",
    recipientEmail: "",
    amount: "",
    description: "",
    bankCode: "",
    country: "NL",
  });

  // OTP & Verification State
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpCodeId, setOtpCodeId] = useState(null);
  const [codeRecord, setCodeRecord] = useState(null);

  // Transaction State
  const [transactionId, setTransactionId] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [transactionData, setTransactionData] = useState(null);
  const [pendingBalance, setPendingBalance] = useState(0);

  // Code Verification State
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [currentCodeType, setCurrentCodeType] = useState(null);
  const [codeError, setCodeError] = useState("");
  const [verifiedCodes, setVerifiedCodes] = useState({
    cot: false,
    imf: false,
    vat: false,
  });
  const [codingLoading, setCodingLoading] = useState(false);

  // Receipt Modal State
  const [showReceipt, setShowReceipt] = useState(false);

  // UI Feedback
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  // Fetch user & accounts on mount
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data: { session } = {} } = await supabase.auth.getSession();
        const id = session?.user?.id;

        if (!id) {
          navigate("/auth/login", { replace: true });
          return;
        }

        setUserId(id);

        const { data: profileData } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", id)
          .eq("is_deleted", false)
          .maybeSingle();

        const { data: accountsData } = await supabase
          .from("accounts")
          .select("*")
          .eq("user_id", id)
          .eq("is_deleted", false)
          .order("created_at", { ascending: false });

        if (mounted) {
          setProfile(profileData);
          setAccounts(accountsData || []);
          if (accountsData?.length > 0) {
            setFormData((prev) => ({
              ...prev,
              fromAccountId: accountsData[0].id,
            }));
          }
        }
      } catch (err) {
        console.error("[TRANSFER] Load error:", err);
        setMessage({ type: "error", text: "Failed to load account data" });
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fromAccountId)
      newErrors.fromAccountId = "Select source account";
    if (!formData.toAccountNumber)
      newErrors.toAccountNumber = "Enter recipient account";
    if (!formData.beneficiaryName)
      newErrors.beneficiaryName = "Enter beneficiary name";
    if (!formData.bankName) newErrors.bankName = "Enter bank name";
    if (activeTransferType !== "local" && !formData.recipientName)
      newErrors.recipientName = "Enter recipient name";
    if (activeTransferType === "international" && !formData.bankCode)
      newErrors.bankCode = "Enter SWIFT/BIC code";
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      newErrors.amount = "Enter valid amount";

    const fromAccount = accounts.find((a) => a.id === formData.fromAccountId);
    if (
      fromAccount &&
      parseFloat(formData.amount) > parseFloat(fromAccount.balance || 0)
    ) {
      newErrors.amount = "Insufficient balance";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================================================
  // HANDLE REQUEST OTP - FOLLOWS EXISTING sendEmailAPI PATTERN
  // ============================================================================
  const handleRequestOTP = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      // Step 1: Fetch available OTP code
      const { data: codeData, error: codeError } = await supabase
        .from("codes")
        .select("*")
        .eq("code_type", "transfer_otp")
        .eq("is_used", false)
        .gt("expires_at", new Date().toISOString())
        .limit(1)
        .single();

      if (codeError || !codeData) {
        throw new Error("No available OTP codes. Please try again later.");
      }

      // Step 2: Get the from account for currency
      const fromAccount = accounts.find((a) => a.id === formData.fromAccountId);
      if (!fromAccount) {
        throw new Error("Selected account not found");
      }
      // Step 3: Verify user email exists
      if (!profile?.email) {
        throw new Error("User email not found. Please update your profile.");
      }

      const htmlContent = generateOTPEmailHTML(
        codeData.code,
        formData.recipientName || profile?.full_name || "User",
        `${fromAccount.currency} ${parseFloat(formData.amount).toFixed(2)}`,
        activeTransferType,
      );

      if (!htmlContent || htmlContent.length === 0) {
        throw new Error(
          "Failed to generate email content. generateOTPEmailHTML() returned empty.",
        );
      }
      const emailResponse = await sendEmailAPI({
        to: profile.email,
        subject: "Your Summit Ridge Credit Union Transfer Verification Code",
        html: htmlContent,
      });
      // Step 6: Store code reference and show OTP input
      setCodeRecord(codeData);
      setOtpCodeId(codeData.id);
      setShowOTPInput(true);

      setMessage({
        type: "success",
        text: `OTP sent to ${profile.email}. Check your inbox (valid for 5 minutes).`,
      });
    } catch (err) {
      console.error("[TRANSFER] OTP request failed:", {
        message: err.message,
        status: err.status,
      });

      let userMessage = "Failed to send OTP. ";

      if (err.message.includes("Network error")) {
        userMessage +=
          "Backend server is not running. Start with: npm start in backend folder.";
      } else if (err.message.includes("Cannot connect")) {
        userMessage +=
          "Cannot reach email server. Check backend is running on port 3001.";
      } else if (err.message.includes("No available OTP")) {
        userMessage += "Temporary service issue. Try again in a moment.";
      } else if (err.message.includes("authentication")) {
        userMessage +=
          "Email service authentication failed. Check backend credentials.";
      } else {
        userMessage += err.message || "Please try again.";
      }

      setMessage({
        type: "error",
        text: userMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otpInput.trim()) {
      setErrors({ otpCode: "Enter OTP code" });
      return;
    }

    if (otpInput !== codeRecord?.code) {
      setErrors({ otpCode: "Invalid OTP code" });
      return;
    }

    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const fromAccount = accounts.find((a) => a.id === formData.fromAccountId);
      const transferAmount = parseFloat(formData.amount);

      await supabase
        .from("codes")
        .update({
          is_used: true,
          used_at: new Date().toISOString(),
          used_by_user_id: userId,
        })
        .eq("id", otpCodeId);

      const { data: txnData, error: txnError } = await supabase
        .from("transactions")
        .insert([
          {
            from_account_id: formData.fromAccountId,
            external_recipient_name:
              formData.recipientName || formData.beneficiaryName,
            external_recipient_iban: formData.toAccountNumber,
            amount: transferAmount,
            currency: fromAccount?.currency || "EUR",
            transaction_type: activeTransferType,
            description: formData.description || null,
            status: "pending",
            reference_number: `TXN-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)
              .toUpperCase()}`,
            initiated_by_user_id: userId,
            metadata: {
              transfer_type: activeTransferType,
              bank_code: formData.bankCode || null,
              bank_name: formData.bankName || null,
              beneficiary_name: formData.beneficiaryName || null,
              country: formData.country || "NL",
              otp_verified_at: new Date().toISOString(),
            },
          },
        ])
        .select("*")
        .single();

      if (txnError) throw txnError;

      const newBalance = parseFloat(fromAccount.balance || 0) - transferAmount;
      setPendingBalance(newBalance);

      await supabase
        .from("accounts")
        .update({ balance: newBalance })
        .eq("id", formData.fromAccountId);

      setTransactionId(txnData.id);
      setTransactionData(txnData);
      setTransactionStatus(txnData.status);
      setShowOTPInput(false);
      setOtpInput("");
      setMessage({
        type: "success",
        text: `Transfer initiated! Reference: ${txnData.reference_number}`,
      });
    } catch (err) {
      console.error("[TRANSFER] OTP verification error:", err);
      setMessage({ type: "error", text: err.message || "Verification failed" });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle code verification flow
  const handleVerifyCode = async (codeType, codeInput) => {
    setCodingLoading(true);
    setCodeError("");

    try {
      const { data: codeData, error: codeQueryError } = await supabase
        .from("codes")
        .select("*")
        .eq("code_type", codeType)
        .eq("code", codeInput)
        .eq("is_used", false)
        .gt("expires_at", new Date().toISOString())
        .single();

      if (codeQueryError || !codeData) {
        setCodeError("Invalid or expired code");
        return;
      }

      // Mark code as used
      await supabase
        .from("codes")
        .update({
          is_used: true,
          used_at: new Date().toISOString(),
          used_by_user_id: userId,
        })
        .eq("id", codeData.id);

      // Mark code as verified
      setVerifiedCodes((prev) => ({ ...prev, [codeType]: true }));
      setShowCodeModal(false);

      // If all codes verified, show receipt
      if (codeType === "vat") {
        // Last code - show receipt
        await supabase
          .from("transactions")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
          })
          .eq("id", transactionId);

        setTransactionStatus("completed");
        setShowReceipt(true);
        setMessage({
          type: "success",
          text: "Transfer completed successfully!",
        });
      } else {
        // Move to next code
        const codeSequence = ["cot", "imf", "vat"];
        const nextIndex = codeSequence.indexOf(codeType) + 1;
        if (nextIndex < codeSequence.length) {
          setCurrentCodeType(codeSequence[nextIndex]);
          setShowCodeModal(true);
        }
      }
    } catch (err) {
      console.error("[TRANSFER] Code verification error:", err);
      setCodeError(err.message || "Verification failed");
    } finally {
      setCodingLoading(false);
    }
  };

  const handleCompleteTransfer = async () => {
    // Start code verification sequence
    setCurrentCodeType("cot");
    setShowCodeModal(true);
  };

  const resetForm = () => {
    setFormData({
      fromAccountId: accounts[0]?.id || "",
      toAccountNumber: "",
      beneficiaryName: "",
      bankName: "",
      recipientName: "",
      recipientEmail: "",
      amount: "",
      description: "",
      bankCode: "",
      country: "NL",
    });
    setErrors({});
    setMessage({ type: "", text: "" });
    setShowForm(false);
    setShowOTPInput(false);
    setOtpInput("");
    setTransactionId(null);
    setTransactionStatus(null);
    setTransactionData(null);
    setPendingBalance(0);
    setVerifiedCodes({ cot: false, imf: false, vat: false });
    setShowReceipt(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!userId) return null;

  const transferTypes = [
    {
      type: "local",
      title: "Local Transfer",
      description: "Transfer within Netherlands",
    },
    {
      type: "international",
      title: "International",
      description: "Send money abroad",
    },
    {
      type: "wire",
      title: "Wire Transfer",
      description: "Fast SWIFT transfer",
    },
  ];

  const accountOptions = accounts.map((acc) => ({
    id: acc.id,
    label: `${acc.account_number} (${acc.account_type}) - ${
      acc.currency
    } ${parseFloat(acc.balance || 0).toFixed(2)}`,
  }));

  const fromAccount = accounts.find((a) => a.id === formData.fromAccountId);

  return (
    <div className="min-h-screen bg-primary">
      <UserHeader
        profile={profile}
        handleSignOut={() => handleSignout(navigate)}
      />

      <main className="container mx-auto max-w-6xl px-4 py-6 sm:py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-secondary opacity-70">
          <button
            onClick={() => navigate("/dashboard")}
            className="hover:opacity-100 font-bold"
          >
            &lt; Dashboard
          </button>
          <span>/</span>
          <span className="font-semibold opacity-100">Transfer Money</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-2">
            Send Money
          </h1>
          <p className="text-sm sm:text-base text-secondary opacity-70">
            Choose your transfer type and complete the transaction
          </p>
        </div>

        {/* Alert Message */}
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

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left: Transfer Type Selection */}
          <div className="lg:col-span-1">
            <div className="bg-primary rounded-sm border border-secondary shadow-md p-6 sticky top-24">
              <h2 className="text-lg sm:text-xl font-semibold text-secondary mb-4">
                Transfer Type
              </h2>
              <div className="space-y-3">
                {transferTypes.map((type) => (
                  <TransferCard
                    key={type.type}
                    type={type.title}
                    title={type.title}
                    description={type.description}
                    isSelected={activeTransferType === type.type}
                    onClick={() => {
                      setActiveTransferType(type.type);
                      setShowForm(true);
                      setErrors({});
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form Panel */}
          {showForm && (
            <div className="lg:col-span-2">
              <div className="bg-primary rounded-sm border border-secondary shadow-md p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-secondary mb-6">
                  {
                    transferTypes.find((t) => t.type === activeTransferType)
                      ?.title
                  }{" "}
                  Details
                </h2>

                {!showOTPInput && transactionStatus !== "pending" ? (
                  /* Transfer Form */
                  <form onSubmit={handleRequestOTP}>
                    <SelectField
                      label="From Account"
                      name="fromAccountId"
                      value={formData.fromAccountId}
                      onChange={handleFormChange}
                      options={accountOptions}
                      required
                      error={errors.fromAccountId}
                    />

                    {/* Beneficiary Name (All Types) */}
                    <FormField
                      label="Beneficiary Name"
                      name="beneficiaryName"
                      value={formData.beneficiaryName}
                      onChange={handleFormChange}
                      placeholder="Full name of beneficiary"
                      required
                      error={errors.beneficiaryName}
                    />

                    {/* Bank Name (All Types) */}
                    <FormField
                      label="Bank Name"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleFormChange}
                      placeholder="Name of receiving bank"
                      required
                      error={errors.bankName}
                    />

                    {/* Recipient Name (International & Wire) */}
                    {(activeTransferType === "international" ||
                      activeTransferType === "wire") && (
                      <FormField
                        label="Recipient Name"
                        name="recipientName"
                        value={formData.recipientName}
                        onChange={handleFormChange}
                        placeholder="Full name"
                        required
                        error={errors.recipientName}
                      />
                    )}

                    {/* Recipient Account */}
                    <FormField
                      label="Recipient Account Number"
                      name="toAccountNumber"
                      value={formData.toAccountNumber}
                      onChange={handleFormChange}
                      placeholder={
                        activeTransferType === "local"
                          ? "Account number"
                          : "IBAN"
                      }
                      required
                      error={errors.toAccountNumber}
                    />

                    {/* Bank Code (International & Wire) */}
                    {(activeTransferType === "international" ||
                      activeTransferType === "wire") && (
                      <FormField
                        label="SWIFT/BIC Code"
                        name="bankCode"
                        value={formData.bankCode}
                        onChange={handleFormChange}
                        placeholder="e.g., ABNANL2A"
                        required
                        error={errors.bankCode}
                      />
                    )}

                    {/* Amount */}
                    <FormField
                      label={`Amount (${fromAccount?.currency || "EUR"})`}
                      name="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={handleFormChange}
                      placeholder="0.00"
                      required
                      error={errors.amount}
                    />

                    {/* Description */}
                    <div className="mb-6">
                      <label className="block text-xs sm:text-sm font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80">
                        Description (Optional)
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        placeholder="Enter description"
                        rows="3"
                        className="w-full px-4 py-3 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic focus:ring-opacity-30 font-sans bg-primary"
                      />
                    </div>

                    {/* Summary */}
                    {formData.amount && fromAccount && (
                      <div className="mb-6 p-4 sm:p-6 rounded-sm border border-secondary bg-primary shadow-sm space-y-4">
                        <h4 className="font-semibold text-secondary text-base">
                          Summary
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between pb-3 border-b border-secondary opacity-70">
                            <span className="text-secondary">
                              From Account:
                            </span>
                            <span className="font-semibold text-secondary">
                              {fromAccount.account_number}
                            </span>
                          </div>
                          <div className="flex justify-between pb-3 border-b border-secondary opacity-70">
                            <span className="text-secondary">Beneficiary:</span>
                            <span className="font-semibold text-secondary">
                              {formData.beneficiaryName}
                            </span>
                          </div>
                          <div className="flex justify-between pb-3 border-b border-secondary opacity-70">
                            <span className="text-secondary">Bank:</span>
                            <span className="font-semibold text-secondary">
                              {formData.bankName}
                            </span>
                          </div>
                          <div className="flex justify-between pb-3 border-b border-secondary opacity-70">
                            <span className="text-secondary">To Account:</span>
                            <span className="font-semibold text-secondary">
                              {formData.toAccountNumber}
                            </span>
                          </div>
                          <div className="flex justify-between pt-2">
                            <span className="font-semibold text-secondary">
                              Amount:
                            </span>
                            <span className="font-bold text-basic text-lg">
                              {fromAccount.currency}{" "}
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
                ) : showOTPInput && !transactionStatus ? (
                  /* OTP Verification Form */
                  <form onSubmit={handleVerifyOTP}>
                    <div className="mb-6 p-4 sm:p-6 rounded-sm border border-secondary bg-primary">
                      <p className="text-secondary text-sm">
                        OTP code sent to{" "}
                        <strong className="text-basic">{profile?.email}</strong>
                        . Valid for 5 minutes.
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
                          "Verify & Continue"
                        )}
                      </button>
                    </div>
                  </form>
                ) : transactionStatus === "pending" ? (
                  /* Pending Transaction Panel */
                  <div className="space-y-6">
                    <div className="p-4 sm:p-6 rounded-sm border-l-4 border-yellow-500 bg-yellow-50">
                      <h3 className="font-bold text-secondary mb-2 text-base">
                        Transfer Pending
                      </h3>
                      <p className="text-secondary text-sm opacity-80">
                        Your transfer is pending verification. Click the button
                        below to complete.
                      </p>
                    </div>

                    <div className="bg-primary rounded-sm border border-secondary p-6 shadow-sm space-y-4">
                      <h4 className="font-bold text-secondary text-base">
                        Transaction Details
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between pb-3 border-b border-secondary opacity-70">
                          <span className="text-secondary">From Account:</span>
                          <span className="font-semibold text-secondary">
                            {fromAccount?.account_number}
                          </span>
                        </div>
                        <div className="flex justify-between pb-3 border-b border-secondary opacity-70">
                          <span className="text-secondary">Beneficiary:</span>
                          <span className="font-semibold text-secondary">
                            {formData.beneficiaryName}
                          </span>
                        </div>
                        <div className="flex justify-between pb-3 border-b border-secondary opacity-70">
                          <span className="text-secondary">Bank:</span>
                          <span className="font-semibold text-secondary">
                            {formData.bankName}
                          </span>
                        </div>
                        <div className="flex justify-between pb-3 border-b border-secondary opacity-70">
                          <span className="text-secondary">To Account:</span>
                          <span className="font-semibold text-secondary">
                            {formData.toAccountNumber}
                          </span>
                        </div>
                        <div className="flex justify-between pb-3 border-b border-secondary pt-2">
                          <span className="font-semibold text-secondary">
                            Amount:
                          </span>
                          <span className="font-bold text-basic text-lg">
                            -{fromAccount?.currency}{" "}
                            {parseFloat(formData.amount).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between opacity-70">
                          <span className="text-secondary">
                            Previous Balance:
                          </span>
                          <span className="font-semibold text-secondary">
                            {fromAccount?.currency}{" "}
                            {parseFloat(fromAccount?.balance || 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between rounded-sm border border-secondary p-3 bg-gray-50">
                          <span className="font-semibold text-secondary">
                            Updated Balance:
                          </span>
                          <span className="font-bold text-basic">
                            {fromAccount?.currency} {pendingBalance.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleCompleteTransfer}
                      disabled={submitting}
                      className="w-full py-3 px-6 bg-basic text-primary font-bold rounded-sm hover:bg-opacity-90 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <LoadingSpinner size="sm" /> Completing...
                        </>
                      ) : (
                        "Complete Transfer"
                      )}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Code Verification Modal */}
      <CodeVerificationModal
        isOpen={showCodeModal}
        codeType={currentCodeType}
        onVerify={handleVerifyCode}
        onClose={() => {
          setShowCodeModal(false);
          setCodeError("");
        }}
        isLoading={codingLoading}
        error={codeError}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={showReceipt}
        transaction={transactionData}
        account={fromAccount}
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

export default TransferPage;

