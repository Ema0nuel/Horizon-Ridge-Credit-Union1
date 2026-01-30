import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../Services/supabase/supabaseClient";
import { sendEmailAPI } from "../../../Services/api";
import UserHeader from "../../../components/UserHeader";
import { LoadingSpinner } from "../../../components/Spinner";
import { handleSignout } from "../../../Services/supabase/authService";

// Network Providers with Professional Icons
const NETWORKS = [
  {
    id: "kpn",
    name: "KPN",
    color: "bg-green-600",
    desc: "KPN Mobile Network",
  },
  {
    id: "vodafoneziggo",
    name: "Vodafone",
    color: "bg-red-600",
    desc: "Vodafone Netherlands Network",
  },
  {
    id: "tmobile",
    name: "T-Mobile",
    color: "bg-pink-600",
    desc: "T-Mobile Netherlands Network",
  },
  {
    id: "tele2",
    name: "Tele2",
    color: "bg-black",
    desc: "Tele2 Mobile Network",
  },
];

// Network Icon Component (SVG-based, matches Dashboard icons)
const NetworkIcon = ({ networkId }) => {
  const iconMap = {
    mtn: (
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
    vodafone: (
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
          d="M12 8c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 2c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 8c-3.314 0-6 2.686-6 6v2h12v-2c0-3.314-2.686-6-6-6z"
        />
      </svg>
    ),
    airtel: (
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
    glo: (
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
          d="M12 21a9 9 0 100-18 9 9 0 000 18zm0-2a7 7 0 100-14 7 7 0 000 14z"
        />
      </svg>
    ),
    "9mobile": (
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
          d="M9 3v2a2 2 0 002 2h2a2 2 0 002-2V3m0 18v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2m9-13a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return (
    <div className="text-white group-hover:text-opacity-90 transition-all">
      {iconMap[networkId] || iconMap.mtn}
    </div>
  );
};

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

// Network Card with SVG Icon
const NetworkCard = ({ network, isSelected, onClick }) => (
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
      className={`w-16 h-16 ${network.color} rounded-full flex items-center justify-center`}
    >
      <NetworkIcon networkId={network.id} />
    </div>
    <div className="flex-1">
      <h3 className="font-semibold text-secondary text-sm">{network.name}</h3>
      <p className="text-xs text-secondary opacity-70 mt-1">{network.desc}</p>
    </div>
    {isSelected && <div className="text-basic font-bold text-lg">✔️</div>}
  </button>
);

// OTP Email Template
const generateAirtimeOTPEmailHTML = (code, phoneNumber, amount, network) => `
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
      <h1>Airtime Purchase Verification</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">One-Time Password (OTP)</p>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>We received a request to purchase airtime on your Horizon Ridge Credit Union account. Please use the verification code below to confirm your purchase:</p>
      
      <div class="otp-box">
        <div class="otp-code">${code}</div>
        <div class="otp-label">Valid for 5 minutes</div>
      </div>

      <div class="details">
        <div class="detail-row">
          <span class="detail-label">Network:</span>
          <span class="detail-value">${network}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Phone Number:</span>
          <span class="detail-value">${phoneNumber}</span>
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

      <p>If you did not request this airtime purchase, please ignore this email and contact our support team immediately.</p>
    </div>
    <div class="footer">
      <p>&copy; 2026 Horizon Ridge Credit Union Bank. All rights reserved.</p>
      <p>This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`;

// Receipt Modal
const ReceiptModal = ({ isOpen, transaction, account, profile, onClose }) => {
  if (!isOpen || !transaction) return null;

  const network = NETWORKS.find((n) => n.id === transaction.metadata?.network);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-sm border border-secondary shadow-2xl max-w-md w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="bg-basic text-primary p-6 text-center">
          <div className="text-5xl mb-3"></div>
          <h2 className="text-2xl font-bold">Horizon Ridge Credit Union</h2>
          <p className="text-sm opacity-90 mt-1">Airtime Receipt</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Status */}
          <div className="text-center py-3 bg-yellow-50 border border-yellow-200 rounded-sm">
            <p className="text-sm font-semibold text-yellow-800">
              Pending Admin Approval
            </p>
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
              {transaction.currency} {parseFloat(transaction.amount).toFixed(2)}
            </p>
          </div>

          {/* Network & Phone */}
          <div className="text-sm border-b border-secondary pb-4 space-y-3">
            <div>
              <p className="text-secondary opacity-70 text-xs uppercase tracking-wider mb-1">
                Network
              </p>
              <p className="font-semibold text-secondary capitalize">
                {network?.name || "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-secondary opacity-70 text-xs uppercase tracking-wider mb-1">
                Phone Number
              </p>
              <p className="font-semibold text-secondary font-mono">
                {transaction.metadata?.phone_number}
              </p>
            </div>
          </div>

          {/* From Account */}
          <div className="text-sm border-b border-secondary pb-4">
            <p className="text-secondary opacity-70 text-xs uppercase tracking-wider mb-1">
              Purchased From
            </p>
            <p className="font-semibold text-secondary">
              {account?.account_number}
            </p>
            <p className="text-xs text-secondary opacity-70 mt-1">
              {profile?.full_name}
            </p>
          </div>

          {/* Description */}
          {transaction.description && (
            <div className="text-sm">
              <p className="text-secondary opacity-70 text-xs uppercase tracking-wider mb-1">
                Description
              </p>
              <p className="text-secondary">{transaction.description}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-secondary text-center">
          <p className="text-xs text-secondary opacity-70 mb-4">
            Your airtime purchase will be processed once approved by our team
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

// Phone Number Formatter
const formatPhoneNumber = (value) => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length === 0) return "";
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(
    7,
    11,
  )}`;
};

// Phone Validation (international format: 10-15 digits)
const isValidPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 10 && cleaned.length <= 15;
};

// Main Component
export function BuyAirtimePage() {
  const navigate = useNavigate();

  // Auth & User State
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fromAccountId: "",
    phoneNumber: "",
    network: "",
    amount: "",
    description: "",
  });

  // OTP & Verification State
  const [otpInput, setOtpInput] = useState("");
  const [otpCodeId, setOtpCodeId] = useState(null);
  const [codeRecord, setCodeRecord] = useState(null);

  // Transaction State
  const [transactionData, setTransactionData] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState(null);

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
        console.error("[BUY_AIRTIME] Load error:", err);
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
    let { name, value } = e.target;

    if (name === "phoneNumber") {
      value = formatPhoneNumber(value);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const airtimeAmounts = [
    { id: "500", label: "500", value: "500" },
    { id: "1000", label: "1,000", value: "1000" },
    { id: "2000", label: "2,000", value: "2000" },
    { id: "5000", label: "5,000", value: "5000" },
    { id: "10000", label: "10,000", value: "10000" },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fromAccountId) newErrors.fromAccountId = "Select account";
    if (!formData.phoneNumber || !isValidPhoneNumber(formData.phoneNumber))
      newErrors.phoneNumber = "Enter valid phone number (10-15 digits)";
    if (!formData.network) newErrors.network = "Select network";
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      newErrors.amount = "Enter valid amount";
    if (parseFloat(formData.amount) > 50000)
      newErrors.amount = "Amount exceeds maximum limit (50,000)";

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

  const handleRequestOTP = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
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

      const network = NETWORKS.find((n) => n.id === formData.network);

      await sendEmailAPI({
        to: profile?.email,
        subject:
          "Your Horizon Ridge Credit Union Airtime Purchase Verification Code",
        html: generateAirtimeOTPEmailHTML(
          codeData.code,
          formData.phoneNumber,
          `$${parseFloat(formData.amount).toFixed(2)}`,
          network?.name || "Network",
        ),
      });

      setCodeRecord(codeData);
      setOtpCodeId(codeData.id);
      setShowOTPInput(true);
      setMessage({ type: "success", text: `OTP sent to ${profile?.email}` });
    } catch (err) {
      console.error("[BUY_AIRTIME] OTP request error:", err);
      setMessage({ type: "error", text: err.message || "Failed to send OTP" });
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
      const airtimeAmount = parseFloat(formData.amount);
      const network = NETWORKS.find((n) => n.id === formData.network);

      // Mark OTP as used
      await supabase
        .from("codes")
        .update({
          is_used: true,
          used_at: new Date().toISOString(),
          used_by_user_id: userId,
        })
        .eq("id", otpCodeId);

      // Create airtime transaction (pending status for admin approval)
      const { data: txnData, error: txnError } = await supabase
        .from("transactions")
        .insert([
          {
            from_account_id: formData.fromAccountId,
            to_account_id: null,
            amount: airtimeAmount,
            currency: fromAccount?.currency || "NGN",
            transaction_type: "airtime",
            status: "pending", // Pending admin approval
            description:
              formData.description ||
              `Airtime purchase - ${network?.name} - ${formData.phoneNumber}`,
            reference_number: `AIR-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)
              .toUpperCase()}`,
            initiated_by_user_id: userId,
            metadata: {
              transaction_type: "airtime",
              network: formData.network,
              network_name: network?.name,
              phone_number: formData.phoneNumber,
              otp_verified_at: new Date().toISOString(),
              awaiting_admin_approval: true,
            },
          },
        ])
        .select("*")
        .single();

      if (txnError) throw txnError;

      // Deduct from account balance (will be reversed if admin rejects)
      const newBalance = parseFloat(fromAccount.balance || 0) - airtimeAmount;
      await supabase
        .from("accounts")
        .update({ balance: newBalance })
        .eq("id", formData.fromAccountId);

      setTransactionData(txnData);
      setTransactionStatus("pending");
      setShowOTPInput(false);
      setOtpInput("");
      setShowReceipt(true);
      setMessage({
        type: "success",
        text: `Airtime purchase submitted! Reference: ${txnData.reference_number}`,
      });
    } catch (err) {
      console.error("[BUY_AIRTIME] OTP verification error:", err);
      setMessage({ type: "error", text: err.message || "Verification failed" });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fromAccountId: accounts[0]?.id || "",
      phoneNumber: "",
      network: "",
      amount: "",
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
    setSelectedNetwork("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!userId) return null;

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
          <span className="font-semibold opacity-100">Buy Airtime</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-2">
            Buy Airtime
          </h1>
          <p className="text-sm sm:text-base text-secondary opacity-70">
            Purchase airtime for any network instantly
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
          {/* Left: Network Selection */}
          <div className="lg:col-span-1">
            <div className="bg-primary rounded-sm border border-secondary shadow-md p-6 sticky top-24">
              <h2 className="text-lg sm:text-xl font-semibold text-secondary mb-4">
                Select Network
              </h2>
              <div className="space-y-3">
                {NETWORKS.map((network) => (
                  <NetworkCard
                    key={network.id}
                    network={network}
                    isSelected={selectedNetwork === network.id}
                    onClick={() => {
                      setSelectedNetwork(network.id);
                      setFormData((prev) => ({
                        ...prev,
                        network: network.id,
                      }));
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
                  Airtime Purchase
                </h2>

                {!showOTPInput && transactionStatus !== "pending" ? (
                  /* Airtime Form */
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

                    <FormField
                      label="Phone Number"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleFormChange}
                      placeholder="Enter phone number"
                      maxLength="15"
                      required
                      error={errors.phoneNumber}
                    />

                    <div className="mb-4">
                      <label className="block text-xs sm:text-sm font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80">
                        Select Amount
                        <span className="text-red-600 ml-1">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {airtimeAmounts.map((amt) => (
                          <button
                            key={amt.id}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                amount: amt.value,
                              }))
                            }
                            className={`py-2 px-3 rounded-sm font-semibold text-sm transition-all active:scale-95 ${
                              formData.amount === amt.value
                                ? "bg-basic text-primary border border-basic"
                                : "border border-secondary text-secondary hover:bg-gray-50"
                            }`}
                          >
                            {amt.label}
                          </button>
                        ))}
                      </div>
                      {errors.amount && (
                        <p className="text-xs text-red-600 mt-2">
                          {errors.amount}
                        </p>
                      )}
                    </div>

                    <FormField
                      label="Custom Amount (Optional)"
                      name="amount"
                      type="number"
                      step="100"
                      min="100"
                      max="50000"
                      value={formData.amount}
                      onChange={handleFormChange}
                      placeholder="Or enter custom amount"
                    />

                    <div className="mb-6">
                      <label className="block text-xs sm:text-sm font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80">
                        Description (Optional)
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        placeholder="Add a note for this purchase"
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
                            <span className="text-secondary">Network:</span>
                            <span className="font-semibold text-secondary capitalize">
                              {NETWORKS.find((n) => n.id === formData.network)
                                ?.name || "Select Network"}
                            </span>
                          </div>
                          <div className="flex justify-between pb-3 border-b border-secondary opacity-70">
                            <span className="text-secondary">
                              Phone Number:
                            </span>
                            <span className="font-semibold text-secondary font-mono">
                              {formData.phoneNumber || "---"}
                            </span>
                          </div>
                          <div className="flex justify-between pt-2">
                            <span className="font-semibold text-secondary">
                              Amount:
                            </span>
                            <span className="font-bold text-basic text-lg">
                              ${parseFloat(formData.amount || 0).toFixed(2)}
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

export default BuyAirtimePage;
