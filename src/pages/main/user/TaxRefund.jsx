/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../Services/supabase/supabaseClient";
import UserHeader from "../../../components/UserHeader";
import { LoadingSpinner } from "../../../components/Spinner";
import { handleSignout } from "../../../Services/supabase/authService";

// ============================================================================
// ICON COMPONENTS (Dashboard SVG Pattern)
// ============================================================================

const TaxIcon = () => (
  <svg
    className="w-8 h-8"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const FileIcon = () => (
  <svg
    className="w-8 h-8"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-6 h-6"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
);

const AlertIcon = () => (
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
  </svg>
);

const ClockIcon = () => (
  <svg
    className="w-6 h-6"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </svg>
);

const InfoIcon = () => (
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </svg>
);

const DownloadIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

// ============================================================================
// FORM INPUT FIELD
// ============================================================================

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
  helpText,
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
    {helpText && !error && (
      <p className="text-xs text-secondary opacity-60 mt-1">{helpText}</p>
    )}
  </div>
);

// ============================================================================
// SELECT FIELD
// ============================================================================

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

// ============================================================================
// RECEIPT MODAL COMPONENT
// ============================================================================

const ReceiptModal = ({
  isOpen,
  transaction,
  account,
  profile,
  onClose,
  onDownload,
}) => {
  if (!isOpen || !transaction) return null;

  const formatCurrency = (amount, currency) =>
    `${currency} ${parseFloat(amount).toFixed(2)}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-sm border border-secondary shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Receipt Header */}
        <div className="bg-basic text-primary p-6 text-center">
          <div className="text-5xl mb-3"></div>
          <h2 className="text-2xl font-bold">Tax Refund Request</h2>
          <p className="text-sm opacity-90 mt-1">Application Receipt</p>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-4">
          {/* Status Badge */}
          <div className="text-center py-4 rounded-sm border-l-4 border-yellow-500 bg-yellow-50">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ClockIcon />
              <p className="font-bold text-yellow-800">Processing</p>
            </div>
            <p className="text-xs text-yellow-700">
              Awaiting admin approval & verification
            </p>
          </div>

          {/* Reference Number */}
          <div className="space-y-2 text-sm border-b border-secondary pb-4">
            <p className="text-secondary opacity-70 text-xs uppercase tracking-wider font-semibold">
              Reference Number
            </p>
            <p className="font-mono font-bold text-secondary text-base break-all">
              {transaction.reference_number}
            </p>
          </div>

          {/* Refund Amount */}
          <div className="text-center py-4">
            <p className="text-xs text-secondary opacity-70 mb-1 uppercase tracking-wider font-semibold">
              Refund Amount
            </p>
            <p className="text-3xl font-bold text-basic">
              {formatCurrency(transaction.amount, transaction.currency)}
            </p>
          </div>

          {/* Tax Year & Filing Status */}
          <div className="space-y-3 text-sm border-y border-secondary py-4">
            {transaction.metadata?.tax_year && (
              <div className="flex justify-between">
                <span className="text-secondary opacity-70">Tax Year:</span>
                <span className="font-semibold text-secondary">
                  {transaction.metadata.tax_year}
                </span>
              </div>
            )}
            {transaction.metadata?.filing_status && (
              <div className="flex justify-between">
                <span className="text-secondary opacity-70">
                  Filing Status:
                </span>
                <span className="font-semibold text-secondary capitalize">
                  {transaction.metadata.filing_status}
                </span>
              </div>
            )}
            {transaction.metadata?.employment_status && (
              <div className="flex justify-between">
                <span className="text-secondary opacity-70">Employment:</span>
                <span className="font-semibold text-secondary capitalize">
                  {transaction.metadata.employment_status}
                </span>
              </div>
            )}
          </div>

          {/* Bank Account */}
          <div className="space-y-2 text-sm border-b border-secondary pb-4">
            <p className="text-secondary opacity-70 text-xs uppercase tracking-wider font-semibold">
              Refund Destination
            </p>
            <p className="font-semibold text-secondary">
              {account?.account_number}
            </p>
            <p className="text-xs text-secondary opacity-70">
              {profile?.full_name}
            </p>
          </div>

          {/* Submitted Date & Time */}
          <div className="space-y-3 text-xs text-secondary opacity-70">
            <div className="flex justify-between">
              <span>Submitted:</span>
              <span>
                {new Date(transaction.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span>
                {new Date(transaction.created_at).toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Process Timeline Info */}
          <div className="bg-blue-50 rounded-sm border border-blue-200 p-4 text-xs text-blue-900">
            <div className="flex gap-2 mb-2">
              <InfoIcon />
              <strong>What Happens Next:</strong>
            </div>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Admin verification of documents</li>
              <li>Tax authority comparison & calculation</li>
              <li>Approval decision (5-10 business days)</li>
              <li>Funds credited to your account</li>
            </ol>
          </div>

          {/* Important Notes */}
          <div className="bg-orange-50 rounded-sm border border-orange-200 p-3 text-xs text-orange-900 space-y-1">
            <p className="font-semibold">âš ï¸ Important Notes:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-1">
              <li>Do not close this page until admin approval</li>
              <li>Keep your reference number for tracking</li>
              <li>Contact support if you have questions</li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 p-4 border-t border-secondary space-y-3">
          <button
            onClick={onDownload}
            className="w-full py-2 px-4 border border-secondary text-secondary font-semibold rounded-sm hover:bg-primary transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
          >
            <DownloadIcon />
            Download Receipt
          </button>
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

// ============================================================================
// STEP INDICATOR COMPONENT
// ============================================================================

const StepIndicator = ({ currentStep, steps }) => (
  <div className="mb-8">
    <div className="flex justify-between items-center">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center flex-1">
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
              index < currentStep
                ? "bg-green-500 text-white"
                : index === currentStep
                  ? "bg-basic text-primary"
                  : "bg-gray-200 text-gray-600"
            }`}
          >
            {index < currentStep ? "✔️" : index + 1}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-2 sm:mx-4 transition-all ${
                index < currentStep ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
    <div className="flex justify-between mt-2 text-xs sm:text-sm">
      {steps.map((step, index) => (
        <span
          key={index}
          className={`font-semibold ${
            index === currentStep
              ? "text-basic"
              : index < currentStep
                ? "text-green-600"
                : "text-secondary opacity-50"
          }`}
        >
          {step}
        </span>
      ))}
    </div>
  </div>
);

// ============================================================================
// MAIN TAX REFUND PAGE
// ============================================================================

export function TaxRefundPage() {
  const navigate = useNavigate();

  // Auth & User State
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    accountId: "",
    taxYear: new Date().getFullYear() - 1,
    filingStatus: "single",
    employmentStatus: "employed",
    grossIncome: "",
    taxWithheld: "",
    taxOwed: "",
    refundAmount: "",
    taxReturnFiledDate: "",
    description: "",
  });

  // UI & Transaction State
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const steps = ["Review Info", "Tax Details", "Calculation", "Confirm"];

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
              accountId: accountsData[0].id,
            }));
          }
        }
      } catch (err) {
        console.error("[TAX_REFUND] Load error:", err);
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

  // Auto-calculate refund amount
  useEffect(() => {
    if (formData.taxWithheld && formData.taxOwed) {
      const withheld = parseFloat(formData.taxWithheld) || 0;
      const owed = parseFloat(formData.taxOwed) || 0;
      const refund = Math.max(0, withheld - owed);
      setFormData((prev) => ({
        ...prev,
        refundAmount: refund.toFixed(2),
      }));
    }
  }, [formData.taxWithheld, formData.taxOwed]);

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      // Review Info
      if (!formData.accountId)
        newErrors.accountId = "Select destination account";
    }

    if (step === 1) {
      // Tax Details
      if (!formData.taxYear) newErrors.taxYear = "Select tax year";
      if (!formData.filingStatus)
        newErrors.filingStatus = "Select filing status";
      if (!formData.employmentStatus)
        newErrors.employmentStatus = "Select employment status";
      if (!formData.taxReturnFiledDate)
        newErrors.taxReturnFiledDate = "Enter date filed";
    }

    if (step === 2) {
      // Calculation
      if (!formData.grossIncome || parseFloat(formData.grossIncome) <= 0)
        newErrors.grossIncome = "Enter valid gross income";
      if (!formData.taxWithheld || parseFloat(formData.taxWithheld) < 0)
        newErrors.taxWithheld = "Enter valid tax withheld";
      if (!formData.taxOwed || parseFloat(formData.taxOwed) < 0)
        newErrors.taxOwed = "Enter valid tax owed";
      if (!formData.refundAmount || parseFloat(formData.refundAmount) <= 0)
        newErrors.refundAmount = "Refund amount must be greater than 0";
    }

    if (step === 3) {
      // Confirm
      if (!formData.description) newErrors.description = "Provide description";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      setMessage({ type: "", text: "" });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    setMessage({ type: "", text: "" });
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const selectedAccount = accounts.find((a) => a.id === formData.accountId);
      const refundAmount = parseFloat(formData.refundAmount);

      // Create transaction with status pending (awaiting admin approval)
      const { data: txnData, error: txnError } = await supabase
        .from("transactions")
        .insert([
          {
            from_account_id: formData.accountId,
            amount: refundAmount,
            currency: selectedAccount?.currency || "EUR",
            transaction_type: "tax_refund",
            status: "pending", // Awaiting admin approval
            description: formData.description,
            reference_number: `TR-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)
              .toUpperCase()}`,
            initiated_by_user_id: userId,
            metadata: {
              tax_year: formData.taxYear,
              filing_status: formData.filingStatus,
              employment_status: formData.employmentStatus,
              gross_income: formData.grossIncome,
              tax_withheld: formData.taxWithheld,
              tax_owed: formData.taxOwed,
              refund_amount: refundAmount,
              tax_return_filed_date: formData.taxReturnFiledDate,
              workflow_stage: "submitted", // Bank reports to authority
              submitted_at: new Date().toISOString(),
            },
          },
        ])
        .select("*")
        .single();

      if (txnError) throw txnError;

      setTransactionData(txnData);
      setShowReceipt(true);
      setMessage({
        type: "success",
        text: `Tax refund request submitted! Reference: ${txnData.reference_number}`,
      });
    } catch (err) {
      console.error("[TAX_REFUND] Submission error:", err);
      setMessage({
        type: "error",
        text: err.message || "Failed to submit tax refund request",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadReceipt = () => {
    if (!transactionData) return;

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Tax Refund Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 2px solid #1b9466b9; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { margin: 0; color: #1b9466b9; font-size: 24px; }
          .header p { margin: 5px 0 0 0; color: #666; }
          .section { margin-bottom: 25px; }
          .section-title { font-weight: bold; color: #1b1b1b; font-size: 14px; text-transform: uppercase; margin-bottom: 10px; }
          .field { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .field-label { color: #666; }
          .field-value { font-weight: bold; color: #1b1b1b; }
          .amount-box { background: #f0f8f0; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
          .amount-label { color: #666; font-size: 12px; }
          .amount-value { font-size: 32px; font-weight: bold; color: #1b9466b9; }
          .status { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; border-radius: 3px; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Tax Refund Request Receipt</h1>
            <p>Summit Ridge Credit Union Bank</p>
          </div>

          <div class="section">
            <div class="section-title">Request Status</div>
            <div class="status">
              <strong>Processing</strong><br>
              <small>Awaiting admin approval & verification</small>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Request Details</div>
            <div class="field">
              <span class="field-label">Reference Number:</span>
              <span class="field-value">${
                transactionData.reference_number
              }</span>
            </div>
            <div class="field">
              <span class="field-label">Submitted Date:</span>
              <span class="field-value">${new Date(
                transactionData.created_at,
              ).toLocaleDateString()}</span>
            </div>
          </div>

          <div class="amount-box">
            <div class="amount-label">Refund Amount</div>
            <div class="amount-value">${transactionData.currency} ${parseFloat(
              transactionData.amount,
            ).toFixed(2)}</div>
          </div>

          <div class="section">
            <div class="section-title">Tax Information</div>
            <div class="field">
              <span class="field-label">Tax Year:</span>
              <span class="field-value">${
                transactionData.metadata?.tax_year || "N/A"
              }</span>
            </div>
            <div class="field">
              <span class="field-label">Filing Status:</span>
              <span class="field-value">${
                transactionData.metadata?.filing_status || "N/A"
              }</span>
            </div>
            <div class="field">
              <span class="field-label">Gross Income:</span>
              <span class="field-value">${
                transactionData.metadata?.gross_income || "N/A"
              }</span>
            </div>
            <div class="field">
              <span class="field-label">Tax Withheld:</span>
              <span class="field-value">${
                transactionData.metadata?.tax_withheld || "N/A"
              }</span>
            </div>
            <div class="field">
              <span class="field-label">Tax Owed:</span>
              <span class="field-value">${
                transactionData.metadata?.tax_owed || "N/A"
              }</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">What Happens Next</div>
            <ol style="color: #666; line-height: 1.8;">
              <li>Bank reports your request to tax authority</li>
              <li>System verifies documents & calculations</li>
              <li>Approval decision (5-10 business days)</li>
              <li>Funds credited to your account</li>
            </ol>
          </div>

          <div class="footer">
            <p>Thank you for banking with Summit Ridge Credit Union</p>
            <p>Keep this receipt for your records</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([receiptHTML], { type: "text/html;charset=utf-8" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `tax-refund-receipt-${transactionData.reference_number}.html`,
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetForm = () => {
    setCurrentStep(0);
    setFormData({
      accountId: accounts[0]?.id || "",
      taxYear: new Date().getFullYear() - 1,
      filingStatus: "single",
      employmentStatus: "employed",
      grossIncome: "",
      taxWithheld: "",
      taxOwed: "",
      refundAmount: "",
      taxReturnFiledDate: "",
      description: "",
    });
    setErrors({});
    setMessage({ type: "", text: "" });
    setTransactionData(null);
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

  const selectedAccount = accounts.find((a) => a.id === formData.accountId);
  const accountOptions = accounts.map((acc) => ({
    id: acc.id,
    label: `${acc.account_number} (${acc.account_type}) - ${acc.currency}`,
  }));

  return (
    <div className="min-h-screen bg-primary">
      <UserHeader
        profile={profile}
        handleSignOut={() => handleSignout(navigate)}
      />

      <main className="container mx-auto max-w-4xl px-4 py-6 sm:py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-secondary opacity-70">
          <button
            onClick={() => navigate("/dashboard")}
            className="hover:opacity-100 font-bold"
          >
            &lt; Dashboard
          </button>
          <span>/</span>
          <span className="font-semibold opacity-100">Tax Refund</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <TaxIcon />
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary">
              Request Tax Refund
            </h1>
          </div>
          <p className="text-sm sm:text-base text-secondary opacity-70">
            File your tax refund request with Summit Ridge Credit Union. We'll
            report to the tax authority and credit your account upon approval.
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

        {/* Step Indicator */}
        {!showReceipt && (
          <StepIndicator currentStep={currentStep} steps={steps} />
        )}

        {/* Main Form Container */}
        {!showReceipt ? (
          <div className="bg-primary rounded-sm border border-secondary shadow-md p-6 sm:p-8">
            <form onSubmit={handleSubmitRequest}>
              {/* STEP 0: REVIEW INFO */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-secondary mb-6">
                    Account Information
                  </h2>

                  <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 mb-6 flex gap-3">
                    <InfoIcon />
                    <div className="text-sm text-blue-900">
                      <p className="font-semibold mb-1">About This Process:</p>
                      <p>
                        Bank reports withheld tax to authority â†’ System
                        compares tax paid vs. owed â†’ Refund is calculated â†’
                        Authority approves â†’ Funds credited to your account
                      </p>
                    </div>
                  </div>

                  <SelectField
                    label="Refund Destination Account"
                    name="accountId"
                    value={formData.accountId}
                    onChange={handleFormChange}
                    options={accountOptions}
                    required
                    error={errors.accountId}
                  />

                  {selectedAccount && (
                    <div className="bg-primary rounded-sm border border-secondary p-6 space-y-4">
                      <h3 className="font-bold text-secondary text-base">
                        Selected Account Details
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-secondary opacity-70">
                            Account Number:
                          </span>
                          <span className="font-semibold text-secondary">
                            {selectedAccount.account_number}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary opacity-70">
                            Account Type:
                          </span>
                          <span className="font-semibold text-secondary capitalize">
                            {selectedAccount.account_type}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary opacity-70">
                            Currency:
                          </span>
                          <span className="font-semibold text-secondary">
                            {selectedAccount.currency}
                          </span>
                        </div>
                        <div className="flex justify-between pt-3 border-t border-secondary">
                          <span className="text-secondary opacity-70">
                            Current Balance:
                          </span>
                          <span className="font-bold text-basic">
                            {selectedAccount.currency}{" "}
                            {parseFloat(selectedAccount.balance || 0).toFixed(
                              2,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 1: TAX DETAILS */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-secondary mb-6">
                    Tax Year & Filing Details
                  </h2>

                  <SelectField
                    label="Tax Year"
                    name="taxYear"
                    value={formData.taxYear}
                    onChange={handleFormChange}
                    options={Array.from({ length: 5 }, (_, i) => ({
                      id: new Date().getFullYear() - i - 1,
                      label: new Date().getFullYear() - i - 1,
                    }))}
                    required
                    error={errors.taxYear}
                  />

                  <SelectField
                    label="Filing Status"
                    name="filingStatus"
                    value={formData.filingStatus}
                    onChange={handleFormChange}
                    options={[
                      { id: "single", label: "Single" },
                      { id: "married", label: "Married Filing Jointly" },
                      { id: "married_sep", label: "Married Filing Separately" },
                      { id: "head_household", label: "Head of Household" },
                    ]}
                    required
                    error={errors.filingStatus}
                  />

                  <SelectField
                    label="Employment Status"
                    name="employmentStatus"
                    value={formData.employmentStatus}
                    onChange={handleFormChange}
                    options={[
                      { id: "employed", label: "Employed" },
                      { id: "self_employed", label: "Self-Employed" },
                      { id: "retired", label: "Retired" },
                      { id: "student", label: "Student" },
                    ]}
                    required
                    error={errors.employmentStatus}
                  />

                  <FormField
                    label="Tax Return Filed Date"
                    name="taxReturnFiledDate"
                    type="date"
                    value={formData.taxReturnFiledDate}
                    onChange={handleFormChange}
                    required
                    error={errors.taxReturnFiledDate}
                  />
                </div>
              )}

              {/* STEP 2: CALCULATION */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-secondary mb-6">
                    Tax Calculation
                  </h2>

                  <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 flex gap-3 mb-6">
                    <InfoIcon />
                    <p className="text-sm text-blue-900">
                      The system compares your withheld taxes against what you
                      actually owe to calculate your refund amount.
                    </p>
                  </div>

                  <FormField
                    label="Gross Annual Income"
                    name="grossIncome"
                    type="number"
                    step="0.01"
                    value={formData.grossIncome}
                    onChange={handleFormChange}
                    placeholder="0.00"
                    required
                    error={errors.grossIncome}
                  />

                  <FormField
                    label="Total Tax Withheld (by employer)"
                    name="taxWithheld"
                    type="number"
                    step="0.01"
                    value={formData.taxWithheld}
                    onChange={handleFormChange}
                    placeholder="0.00"
                    required
                    error={errors.taxWithheld}
                  />

                  <FormField
                    label="Total Tax Owed (based on return)"
                    name="taxOwed"
                    type="number"
                    step="0.01"
                    value={formData.taxOwed}
                    onChange={handleFormChange}
                    placeholder="0.00"
                    required
                    error={errors.taxOwed}
                  />

                  {/* Refund Summary */}
                  {formData.taxWithheld && formData.taxOwed && (
                    <div className="bg-primary rounded-sm border border-basic shadow-lg p-6">
                      <h3 className="font-bold text-secondary text-base mb-4">
                        Refund Calculation
                      </h3>
                      <div className="space-y-3 text-sm mb-4">
                        <div className="flex justify-between pb-2 border-b border-secondary">
                          <span className="text-secondary opacity-70">
                            Tax Withheld:
                          </span>
                          <span className="font-semibold text-secondary">
                            {selectedAccount?.currency}{" "}
                            {parseFloat(formData.taxWithheld).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between pb-2 border-b border-secondary">
                          <span className="text-secondary opacity-70">
                            Tax Owed:
                          </span>
                          <span className="font-semibold text-secondary">
                            {selectedAccount?.currency}{" "}
                            {parseFloat(formData.taxOwed).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between pt-4 text-lg">
                        <span className="font-bold text-secondary">
                          Refund Amount:
                        </span>
                        <span className="font-bold text-basic text-2xl">
                          {selectedAccount?.currency}{" "}
                          {parseFloat(formData.refundAmount || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: CONFIRM */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-secondary mb-6">
                    Confirm & Submit
                  </h2>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-sm p-4 flex gap-3 mb-6">
                    <AlertIcon />
                    <p className="text-sm text-yellow-900">
                      <strong>Important:</strong> By submitting this request, I
                      confirm that all information provided is accurate and
                      complete. This request is subject to admin verification
                      and tax authority approval.
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="bg-primary rounded-sm border border-secondary p-6 space-y-4 mb-6">
                    <h3 className="font-bold text-secondary text-base">
                      Request Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between pb-2 border-b border-secondary">
                        <span className="text-secondary opacity-70">
                          Account:
                        </span>
                        <span className="font-semibold text-secondary">
                          {selectedAccount?.account_number}
                        </span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-secondary">
                        <span className="text-secondary opacity-70">
                          Tax Year:
                        </span>
                        <span className="font-semibold text-secondary">
                          {formData.taxYear}
                        </span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-secondary">
                        <span className="text-secondary opacity-70">
                          Gross Income:
                        </span>
                        <span className="font-semibold text-secondary">
                          {selectedAccount?.currency}{" "}
                          {parseFloat(formData.grossIncome).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-secondary">
                        <span className="text-secondary opacity-70">
                          Tax Withheld:
                        </span>
                        <span className="font-semibold text-secondary">
                          {selectedAccount?.currency}{" "}
                          {parseFloat(formData.taxWithheld).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-secondary">
                        <span className="text-secondary opacity-70">
                          Tax Owed:
                        </span>
                        <span className="font-semibold text-secondary">
                          {selectedAccount?.currency}{" "}
                          {parseFloat(formData.taxOwed).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-4 text-lg font-bold">
                        <span className="text-secondary">Refund Amount:</span>
                        <span className="text-basic text-2xl">
                          {selectedAccount?.currency}{" "}
                          {parseFloat(formData.refundAmount || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      placeholder="Enter any additional information..."
                      rows="4"
                      className="w-full px-4 py-3 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic focus:ring-opacity-30 font-sans bg-primary"
                    />
                    {errors.description && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-secondary">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                  className="flex-1 py-3 px-6 border border-secondary text-secondary font-semibold rounded-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                  Back
                </button>

                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex-1 py-3 px-6 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 transition-all active:scale-95"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 px-6 bg-green-600 text-white font-bold rounded-sm hover:bg-green-700 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <LoadingSpinner size="sm" /> Submitting...
                      </>
                    ) : (
                      <>
                        <CheckIcon /> Submit Request
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : null}
      </main>

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={showReceipt}
        transaction={transactionData}
        account={selectedAccount}
        profile={profile}
        onClose={() => {
          setShowReceipt(false);
          setTimeout(() => {
            resetForm();
            navigate("/dashboard");
          }, 2000);
        }}
        onDownload={handleDownloadReceipt}
      />
    </div>
  );
}

export default TaxRefundPage;

