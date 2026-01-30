/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../Services/supabase/supabaseClient";
import UserHeader from "../../../components/UserHeader";
import { LoadingSpinner } from "../../../components/Spinner";
import { handleSignout } from "../../../Services/supabase/authService";

// ============================================================================
// ICON COMPONENTS
// ============================================================================

const LoanIcon = ({ type }) => {
  const iconMap = {
    personal: (
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
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    business: (
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
    education: (
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
          d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17.25m20-11.002c5.5 3.5 9 8.25 9 11.002M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };
  return <div className="text-basic">{iconMap[type] || null}</div>;
};

// ============================================================================
// STATUS BADGE
// ============================================================================

const StatusBadge = ({ status }) => {
  const config = {
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      label: "Pending Approval",
    },
    approved: { bg: "bg-green-100", text: "text-green-800", label: "Approved" },
    rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
    completed: { bg: "bg-blue-100", text: "text-blue-800", label: "Completed" },
  };

  const stat = config[status] || config.pending;

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${stat.bg} ${stat.text}`}
    >
      {stat.label}
    </span>
  );
};

// ============================================================================
// LOAN TYPE CARD
// ============================================================================

const LoanTypeCard = ({
  type,
  title,
  description,
  minAmount,
  maxAmount,
  isSelected,
  onClick,
}) => (
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
      <LoanIcon type={type} />
    </div>
    <div className="flex-1">
      <h3 className="font-semibold text-secondary text-base">{title}</h3>
      <p className="text-xs text-secondary opacity-70 mt-1">{description}</p>
      <p className="text-xs text-basic font-semibold mt-2">
        {minAmount} - {maxAmount}
      </p>
    </div>
    {isSelected && <div className="ml-auto text-basic font-bold">✔️</div>}
  </button>
);

// ============================================================================
// FORM FIELD COMPONENT
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
  options = null,
}) => (
  <div className="mb-4">
    <label className="block text-xs sm:text-sm font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80">
      {label}
      {required && <span className="text-red-600 ml-1">*</span>}
    </label>
    {options ? (
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
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ) : (
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
    )}
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

// ============================================================================
// RECEIPT MODAL
// ============================================================================

const ReceiptModal = ({ isOpen, loan, onClose }) => {
  if (!isOpen || !loan) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-sm border border-secondary shadow-2xl max-w-md w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="bg-basic text-primary p-6 text-center">
          <div className="text-5xl mb-3"></div>
          <h2 className="text-2xl font-bold">Summit Ridge Credit Union</h2>
          <p className="text-sm opacity-90 mt-1">Loan Application Receipt</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Status */}
          <div className="text-center py-3 bg-yellow-50 border border-yellow-200 rounded-sm">
            <p className="text-sm font-semibold text-yellow-800">
              Pending Admin Review
            </p>
          </div>

          {/* Details */}
          <div className="space-y-3 text-sm border-b border-secondary pb-4">
            <div className="flex justify-between">
              <span className="text-secondary opacity-70">Reference:</span>
              <span className="font-mono font-semibold text-secondary">
                {loan.reference_number}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary opacity-70">Date:</span>
              <span className="font-semibold text-secondary">
                {new Date(loan.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary opacity-70">Type:</span>
              <span className="font-semibold text-secondary capitalize">
                {loan.metadata?.loan_type || "Personal"}
              </span>
            </div>
          </div>

          {/* Amount */}
          <div className="text-center py-4">
            <p className="text-xs text-secondary opacity-70 mb-1">
              Requested Amount
            </p>
            <p className="text-3xl font-bold text-basic">
              {loan.currency} {parseFloat(loan.amount).toFixed(2)}
            </p>
          </div>

          {/* Purpose */}
          {loan.description && (
            <div className="text-sm border-t border-secondary pt-4">
              <p className="text-secondary opacity-70 font-medium mb-1">
                Purpose
              </p>
              <p className="text-secondary">{loan.description}</p>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-sm p-4 border border-blue-200">
            <p className="text-blue-900 text-xs font-semibold">
              â„¹ï¸ Your loan application has been submitted. We will review it
              within 1-2 business days.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-secondary text-center">
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
// MAIN LOAN PAGE
// ============================================================================

export function LoanPage() {
  const navigate = useNavigate();

  // Auth & User State
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [activeTab, setActiveTab] = useState("apply"); // apply | history
  const [selectedLoanType, setSelectedLoanType] = useState("personal");
  const [showForm, setShowForm] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastLoan, setLastLoan] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    loanType: "personal",
    targetAccountId: "",
    loanAmount: "",
    loanTerm: "12",
    purpose: "",
    employmentStatus: "employed",
    annualIncome: "",
    employerName: "",
  });

  // UI Feedback
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });
  const [submitting, setSubmitting] = useState(false);

  // Fetch user & loans on mount
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

        // Fetch loan transactions
        const { data: loansData } = await supabase
          .from("transactions")
          .select("*")
          .eq("transaction_type", "loan")
          .in(
            "from_account_id",
            (accountsData || []).map((a) => a.id),
          )
          .order("created_at", { ascending: false });

        if (mounted) {
          setProfile(profileData);
          setAccounts(accountsData || []);
          setLoans(loansData || []);
          if (accountsData?.length > 0) {
            setFormData((prev) => ({
              ...prev,
              targetAccountId: accountsData[0].id,
            }));
          }
        }
      } catch (err) {
        console.error("[LOAN] Load error:", err);
        setMessage({ type: "error", text: "Failed to load data" });
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

    if (!formData.targetAccountId)
      newErrors.targetAccountId = "Select target account";
    if (!formData.loanAmount || parseFloat(formData.loanAmount) <= 0)
      newErrors.loanAmount = "Enter valid loan amount";
    if (parseFloat(formData.loanAmount) > 100000)
      newErrors.loanAmount = "Loan amount cannot exceed 100,000";
    if (!formData.loanTerm) newErrors.loanTerm = "Select loan term";
    if (!formData.purpose) newErrors.purpose = "Enter loan purpose";
    if (!formData.annualIncome || parseFloat(formData.annualIncome) <= 0)
      newErrors.annualIncome = "Enter valid annual income";
    if (formData.employmentStatus === "employed" && !formData.employerName)
      newErrors.employerName = "Enter employer name";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestLoan = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const targetAccount = accounts.find(
        (a) => a.id === formData.targetAccountId,
      );
      if (!targetAccount) {
        throw new Error("Target account not found");
      }

      // Create loan transaction
      const { data: loanTxn, error: txnError } = await supabase
        .from("transactions")
        .insert([
          {
            from_account_id: formData.targetAccountId,
            to_account_id: formData.targetAccountId, // Self-transfer for loan
            amount: parseFloat(formData.loanAmount),
            currency: targetAccount.currency || "EUR",
            transaction_type: "loan",
            status: "pending",
            description: `Loan Request: ${formData.purpose}`,
            reference_number: `LOAN-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)
              .toUpperCase()}`,
            initiated_by_user_id: userId,
            metadata: {
              loan_type: formData.loanType,
              loan_term: formData.loanTerm,
              purpose: formData.purpose,
              employment_status: formData.employmentStatus,
              annual_income: formData.annualIncome,
              employer_name: formData.employerName,
            },
          },
        ])
        .select("*")
        .single();

      if (txnError) throw txnError;

      setLastLoan(loanTxn);
      setShowForm(false);
      setShowReceipt(true);
      setLoans((prev) => [loanTxn, ...prev]);

      setMessage({
        type: "success",
        text: `Loan request submitted! Reference: ${loanTxn.reference_number}`,
      });

      // Reset form
      setFormData({
        loanType: "personal",
        targetAccountId: accounts[0]?.id || "",
        loanAmount: "",
        loanTerm: "12",
        purpose: "",
        employmentStatus: "employed",
        annualIncome: "",
        employerName: "",
      });
    } catch (err) {
      console.error("[LOAN] request error:", err);
      setMessage({
        type: "error",
        text: err.message || "Failed to submit loan request",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!userId) return null;

  const loanTypes = [
    {
      type: "personal",
      title: "Personal Loan",
      desc: "For personal expenses",
      min: "$1,000",
      max: "$50,000",
    },
    {
      type: "business",
      title: "Business Loan",
      desc: "For business growth",
      min: "$5,000",
      max: "$100,000",
    },
    {
      type: "education",
      title: "Education Loan",
      desc: "For educational needs",
      min: "$2,000",
      max: "$75,000",
    },
  ];

  const accountOptions = accounts.map((acc) => ({
    value: acc.id,
    label: `${acc.account_number} - ${acc.currency} ${parseFloat(
      acc.balance || 0,
    ).toFixed(2)}`,
  }));

  const loanTermOptions = [
    { value: "6", label: "6 Months" },
    { value: "12", label: "12 Months" },
    { value: "24", label: "24 Months" },
    { value: "36", label: "36 Months" },
    { value: "60", label: "60 Months" },
  ];

  const employmentOptions = [
    { value: "employed", label: "Employed" },
    { value: "self-employed", label: "Self-Employed" },
    { value: "retired", label: "Retired" },
    { value: "student", label: "Student" },
  ];

  return (
    <div className="min-h-screen bg-primary">
      <UserHeader
        handleSignOut={() => handleSignout(navigate)}
        profile={profile}
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
          <span className="font-semibold opacity-100">Loan</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-2">
            Loan Management
          </h1>
          <p className="text-sm sm:text-base text-secondary opacity-70">
            Request a loan or view your loan history
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

        {/* Tabs */}
        <div className="mb-8 flex gap-3 border-b border-secondary">
          <button
            onClick={() => setActiveTab("apply")}
            className={`py-3 px-6 font-semibold text-sm transition-all border-b-2 ${
              activeTab === "apply"
                ? "text-basic border-basic"
                : "text-secondary opacity-70 border-transparent hover:opacity-100"
            }`}
          >
            Apply for Loan
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`py-3 px-6 font-semibold text-sm transition-all border-b-2 ${
              activeTab === "history"
                ? "text-basic border-basic"
                : "text-secondary opacity-70 border-transparent hover:opacity-100"
            }`}
          >
            Loan History ({loans.length})
          </button>
        </div>

        {/* Apply Tab */}
        {activeTab === "apply" && (
          <div>
            {!showForm ? (
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-secondary mb-6">
                  Select Loan Type
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {loanTypes.map((type) => (
                    <LoanTypeCard
                      key={type.type}
                      type={type.type}
                      title={type.title}
                      description={type.desc}
                      minAmount={type.min}
                      maxAmount={type.max}
                      isSelected={selectedLoanType === type.type}
                      onClick={() => {
                        setSelectedLoanType(type.type);
                        setFormData((prev) => ({
                          ...prev,
                          loanType: type.type,
                        }));
                        setShowForm(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-primary rounded-sm border border-secondary shadow-md p-6 sm:p-8 max-w-2xl">
                <h2 className="text-xl sm:text-2xl font-bold text-secondary mb-6">
                  {loanTypes.find((t) => t.type === selectedLoanType)?.title}{" "}
                  Application
                </h2>

                <form onSubmit={handleRequestLoan}>
                  {/* Target Account */}
                  <FormField
                    label="Credit to Account"
                    name="targetAccountId"
                    value={formData.targetAccountId}
                    onChange={handleFormChange}
                    required
                    error={errors.targetAccountId}
                    options={accountOptions}
                  />

                  {/* Loan Amount */}
                  <FormField
                    label="Loan Amount"
                    name="loanAmount"
                    type="number"
                    step="100"
                    value={formData.loanAmount}
                    onChange={handleFormChange}
                    placeholder="e.g., 5000"
                    required
                    error={errors.loanAmount}
                  />

                  {/* Loan Term */}
                  <FormField
                    label="Loan Term"
                    name="loanTerm"
                    value={formData.loanTerm}
                    onChange={handleFormChange}
                    required
                    error={errors.loanTerm}
                    options={loanTermOptions}
                  />

                  {/* Purpose */}
                  <FormField
                    label="Loan Purpose"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleFormChange}
                    placeholder="e.g., Home renovation, Car purchase"
                    required
                    error={errors.purpose}
                  />

                  {/* Employment Status */}
                  <FormField
                    label="Employment Status"
                    name="employmentStatus"
                    value={formData.employmentStatus}
                    onChange={handleFormChange}
                    required
                    error={errors.employmentStatus}
                    options={employmentOptions}
                  />

                  {/* Annual Income */}
                  <FormField
                    label="Annual Income"
                    name="annualIncome"
                    type="number"
                    step="1000"
                    value={formData.annualIncome}
                    onChange={handleFormChange}
                    placeholder="e.g., 50000"
                    required
                    error={errors.annualIncome}
                  />

                  {/* Employer Name */}
                  {formData.employmentStatus === "employed" && (
                    <FormField
                      label="Employer Name"
                      name="employerName"
                      value={formData.employerName}
                      onChange={handleFormChange}
                      placeholder="Your current employer"
                      required
                      error={errors.employerName}
                    />
                  )}

                  {/* Summary */}
                  <div className="mb-6 p-4 sm:p-6 rounded-sm border border-secondary bg-primary shadow-sm space-y-4">
                    <h4 className="font-semibold text-secondary text-base">
                      Summary
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between pb-3 border-b border-secondary opacity-70">
                        <span className="text-secondary">Loan Type:</span>
                        <span className="font-semibold text-secondary capitalize">
                          {formData.loanType}
                        </span>
                      </div>
                      <div className="flex justify-between pb-3 border-b border-secondary opacity-70">
                        <span className="text-secondary">Amount:</span>
                        <span className="font-semibold text-basic text-lg">
                          ${parseFloat(formData.loanAmount || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between pb-3 border-b border-secondary opacity-70">
                        <span className="text-secondary">Term:</span>
                        <span className="font-semibold text-secondary">
                          {
                            loanTermOptions.find(
                              (t) => t.value === formData.loanTerm,
                            )?.label
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary">Purpose:</span>
                        <span className="font-semibold text-secondary">
                          {formData.purpose}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setErrors({});
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
                          <LoadingSpinner size="sm" /> Submitting...
                        </>
                      ) : (
                        "Submit Loan Request"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div>
            {loans.length > 0 ? (
              <div className="space-y-4">
                {loans.map((loan) => (
                  <div
                    key={loan.id}
                    className="bg-primary rounded-sm border border-secondary p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                      <div>
                        <p className="text-xs text-secondary opacity-70 uppercase tracking-wider font-semibold mb-1">
                          {new Date(loan.created_at).toLocaleDateString()}
                        </p>
                        <p className="font-mono font-semibold text-secondary">
                          {loan.reference_number}
                        </p>
                      </div>
                      <StatusBadge status={loan.status} />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-secondary opacity-70 mb-1 text-xs">
                          Type
                        </p>
                        <p className="font-semibold text-secondary capitalize">
                          {loan.metadata?.loan_type || "Loan"}
                        </p>
                      </div>
                      <div>
                        <p className="text-secondary opacity-70 mb-1 text-xs">
                          Amount
                        </p>
                        <p className="font-bold text-basic">
                          {loan.currency} {parseFloat(loan.amount).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-secondary opacity-70 mb-1 text-xs">
                          Term
                        </p>
                        <p className="font-semibold text-secondary">
                          {loan.metadata?.loan_term} months
                        </p>
                      </div>
                      <div>
                        <p className="text-secondary opacity-70 mb-1 text-xs">
                          Purpose
                        </p>
                        <p className="font-semibold text-secondary truncate">
                          {loan.metadata?.purpose || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-sm border border-secondary">
                <p className="text-lg text-secondary opacity-70 mb-2">
                  No loan applications
                </p>
                <p className="text-sm text-secondary opacity-50">
                  Click "Apply for Loan" to submit your first application
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={showReceipt}
        loan={lastLoan}
        onClose={() => {
          setShowReceipt(false);
        }}
      />
    </div>
  );
}

export default LoanPage;

