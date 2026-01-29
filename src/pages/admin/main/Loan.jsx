/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../Services/supabase/supabaseClient";
import { isAdminAuthenticated } from "../auth/adminAuth";
import Header from "../../../components/admin/Header";
import SideBar from "../../../components/admin/SideBar";
import { LoadingSpinner } from "../../../components/Spinner";

// ============================================================================
// SVG ICONS
// ============================================================================

const SearchIcon = () => (
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
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const PlusIcon = () => (
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
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

const ApproveIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const RejectIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const ChevronDownIcon = () => (
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
      d="M19 14l-7 7m0 0l-7-7m7 7V3"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// ============================================================================
// FORM FIELD COMPONENTS
// ============================================================================

const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  required = false,
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
      className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 transition-all font-sans text-sm ${
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
  disabled = false,
  error,
  required = false,
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
      className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 transition-all font-sans text-sm ${
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
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  rows = 3,
}) => (
  <div className="mb-4">
    <label className="block text-xs sm:text-sm font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80">
      {label}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 transition-all font-sans text-sm resize-none ${
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

// ============================================================================
// COLLAPSIBLE SECTION COMPONENT
// ============================================================================

const CollapsibleSection = ({ title, icon, isOpen, onToggle, children }) => (
  <div className="border border-secondary rounded-sm overflow-hidden">
    <button
      type="button"
      onClick={onToggle}
      className="w-full px-6 py-4 bg-secondary bg-opacity-5 hover:bg-opacity-10 flex items-center justify-between transition-all"
    >
      <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </h3>
      <ChevronDownIcon
        className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
    {isOpen && (
      <div className="px-6 py-4 bg-primary border-t border-secondary">
        {children}
      </div>
    )}
  </div>
);

// ============================================================================
// LOAN ACTION MODAL (Approve/Decline)
// ============================================================================

const LoanActionModal = ({
  mode,
  loan,
  accounts,
  onClose,
  onSubmit,
  submitting,
}) => {
  const [formData, setFormData] = useState({
    account_id: "",
    action_reason: "",
  });

  const [errors, setErrors] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    details: true,
    action: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (mode === "approve" && !formData.account_id) {
      newErrors.account_id = "Account is required for approval";
    }
    if (!formData.action_reason) {
      newErrors.action_reason = "Reason is required";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit({
      ...formData,
      loan_id: loan.id,
      mode,
    });
  };

  const userAccount = accounts.find((a) => a.user_id === loan.user_id);
  const selectedAccount = accounts.find((a) => a.id === formData.account_id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-sm border border-secondary shadow-lg max-w-2xl w-full max-h-[95vh] overflow-y-auto p-6 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-secondary">
            {mode === "approve" ? "✅ Approve Loan" : "❌ Decline Loan"}
          </h2>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-secondary opacity-60 hover:opacity-100 transition-all"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Loan Details Section */}
          <CollapsibleSection
            title="Loan Details"
            icon="📋"
            isOpen={expandedSections.details}
            onToggle={() => toggleSection("details")}
          >
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary bg-opacity-5 p-3 rounded-sm">
                  <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-1">
                    Loan ID
                  </p>
                  <p className="font-semibold text-basic font-mono">
                    {loan.id.slice(0, 8)}...
                  </p>
                </div>
                <div className="bg-secondary bg-opacity-5 p-3 rounded-sm">
                  <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-1">
                    Amount
                  </p>
                  <p className="font-bold text-basic text-lg">
                    ${loan.amount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary bg-opacity-5 p-3 rounded-sm">
                  <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-1">
                    Interest Rate
                  </p>
                  <p className="font-semibold text-secondary">
                    {loan.interest_rate}%
                  </p>
                </div>
                <div className="bg-secondary bg-opacity-5 p-3 rounded-sm">
                  <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-1">
                    Term (Months)
                  </p>
                  <p className="font-semibold text-secondary">
                    {loan.term_months}
                  </p>
                </div>
              </div>

              <div className="bg-secondary bg-opacity-5 p-3 rounded-sm">
                <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-1">
                  Purpose
                </p>
                <p className="font-semibold text-secondary">{loan.purpose}</p>
              </div>

              <div className="bg-secondary bg-opacity-5 p-3 rounded-sm">
                <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-1">
                  Status
                </p>
                <p
                  className={`font-semibold capitalize ${
                    loan.status === "pending"
                      ? "text-yellow-600"
                      : "text-gray-600"
                  }`}
                >
                  {loan.status}
                </p>
              </div>
            </div>
          </CollapsibleSection>

          {/* Action Section */}
          <CollapsibleSection
            title={mode === "approve" ? "Approval Details" : "Decline Reason"}
            icon={mode === "approve" ? "✅" : "❌"}
            isOpen={expandedSections.action}
            onToggle={() => toggleSection("action")}
          >
            <div className="space-y-4">
              {mode === "approve" && (
                <>
                  <SelectField
                    label="Credit Account"
                    name="account_id"
                    value={formData.account_id}
                    onChange={handleChange}
                    options={accounts
                      .filter(
                        (a) =>
                          a.user_id === loan.user_id && a.is_deleted === false
                      )
                      .map((acc) => ({
                        value: acc.id,
                        label: `${acc.account_number} (${acc.currency} ${acc.balance})`,
                      }))}
                    required
                    error={errors.account_id}
                  />

                  {selectedAccount && (
                    <div className="bg-green-50 border border-green-200 rounded-sm p-4">
                      <p className="text-xs text-green-800 font-semibold mb-2">
                        💰 Account to be credited:
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-green-700 opacity-70">
                            Account Number
                          </p>
                          <p className="font-mono font-semibold text-green-900">
                            {selectedAccount.account_number}
                          </p>
                        </div>
                        <div>
                          <p className="text-green-700 opacity-70">
                            Current Balance
                          </p>
                          <p className="font-semibold text-green-900">
                            {selectedAccount.currency}{" "}
                            {selectedAccount.balance.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-green-700 opacity-70">
                            New Balance (After)
                          </p>
                          <p className="font-bold text-green-900">
                            {selectedAccount.currency}{" "}
                            {(selectedAccount.balance + loan.amount).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              <TextAreaField
                label={
                  mode === "approve"
                    ? "Approval Notes (Optional)"
                    : "Decline Reason (Required)"
                }
                name="action_reason"
                value={formData.action_reason}
                onChange={handleChange}
                placeholder={
                  mode === "approve"
                    ? "Add notes about the approval..."
                    : "Explain why the loan is being declined..."
                }
                rows={3}
                error={errors.action_reason}
              />
            </div>
          </CollapsibleSection>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-6 border-t border-secondary">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-3 px-4 border border-secondary text-secondary font-semibold rounded-sm hover:bg-secondary hover:bg-opacity-5 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 py-3 px-4 font-semibold rounded-sm hover:bg-opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-primary ${
                mode === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" /> Processing...
                </>
              ) : mode === "approve" ? (
                <>
                  <ApproveIcon /> Approve Loan
                </>
              ) : (
                <>
                  <RejectIcon /> Decline Loan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN LOANS PAGE COMPONENT
// ============================================================================

const LoansPage = () => {
  const navigate = useNavigate();

  // Auth & UI State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  // Data State
  const [loans, setLoans] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");

  // Modal State
  const [approvingLoan, setApprovingLoan] = useState(null);
  const [decliningLoan, setDecliningLoan] = useState(null);

  // Message State
  const [message, setMessage] = useState({ type: "", text: "" });

  // ============================================================================
  // AUTHENTICATION CHECK
  // ============================================================================

  useEffect(() => {
    const authenticated = isAdminAuthenticated();
    if (!authenticated) {
      navigate("/user/admin/auth/login", { replace: true });
      return;
    }

    setIsAuthenticated(true);
    const email = sessionStorage.getItem("admin_email") || "admin@example.com";
    setAdminEmail(email);
  }, [navigate]);

  // ============================================================================
  // FETCH LOANS, ACCOUNTS & USERS
  // ============================================================================

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch loans (from transactions with type loan_disbursement)
        const { data: loanData, error: loanError } = await supabase
          .from("transactions")
          .select("*")
          .eq("transaction_type", "loan_disbursement")
          .order("created_at", { ascending: false });

        if (loanError) throw loanError;

        // Fetch accounts
        const { data: accData, error: accError } = await supabase
          .from("accounts")
          .select("*")
          .eq("is_deleted", false)
          .order("created_at", { ascending: false });

        if (accError) throw accError;

        // Fetch users
        const { data: userData, error: userError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("is_deleted", false);

        if (userError) throw userError;

        // Transform transactions into loans
        const transformedLoans = loanData.map((txn) => ({
          id: txn.id,
          user_id: txn.initiated_by_user_id,
          amount: txn.amount,
          currency: txn.currency,
          purpose: txn.description || "Loan",
          interest_rate: 5.5, // Default, could be stored in metadata
          term_months: 12, // Default, could be stored in metadata
          status: txn.status,
          created_at: txn.created_at,
          approved_at: txn.approved_at,
          completed_at: txn.completed_at,
          failure_reason: txn.failure_reason,
          reference_number: txn.reference_number,
          metadata: txn.metadata || {},
        }));

        setLoans(transformedLoans);
        setAccounts(accData || []);
        setUsers(userData || []);
      } catch (err) {
        console.error("[ADMIN_LOANS] Fetch error:", err.message);
        setMessage({
          type: "error",
          text: `Failed to load loans: ${err.message}`,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // ============================================================================
  // APPROVE LOAN
  // ============================================================================

  const handleApproveLoan = async (formData) => {
    setSubmitting(true);
    try {
      const loan = approvingLoan;
      const selectedAccount = accounts.find(
        (a) => a.id === formData.account_id
      );

      if (!selectedAccount) throw new Error("Selected account not found");

      const newBalance =
        parseFloat(selectedAccount.balance) + parseFloat(loan.amount);

      // Update transaction to completed
      const { error: txnError } = await supabase
        .from("transactions")
        .update({
          status: "completed",
          approved_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          metadata: {
            ...loan.metadata,
            approval_notes: formData.action_reason,
            approved_by_admin: adminEmail,
          },
        })
        .eq("id", loan.id);

      if (txnError) throw txnError;

      // Credit the account
      const { error: accError } = await supabase
        .from("accounts")
        .update({
          balance: newBalance,
          available_balance: newBalance,
          updated_at: new Date().toISOString(),
        })
        .eq("id", formData.account_id);

      if (accError) throw accError;

      // Update local state
      setLoans((prev) =>
        prev.map((l) =>
          l.id === loan.id
            ? {
                ...l,
                status: "completed",
                approved_at: new Date().toISOString(),
                completed_at: new Date().toISOString(),
              }
            : l
        )
      );

      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === formData.account_id
            ? { ...acc, balance: newBalance, available_balance: newBalance }
            : acc
        )
      );

      setMessage({
        type: "success",
        text: `✅ Loan approved! Account ${
          selectedAccount.account_number
        } credited with $${loan.amount.toFixed(2)}`,
      });
      setApprovingLoan(null);
      setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    } catch (err) {
      console.error("[ADMIN_LOANS] Approve error:", err.message);
      setMessage({
        type: "error",
        text: `Failed to approve loan: ${err.message}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================================
  // DECLINE LOAN
  // ============================================================================

  const handleDeclineLoan = async (formData) => {
    setSubmitting(true);
    try {
      const loan = decliningLoan;

      const { error } = await supabase
        .from("transactions")
        .update({
          status: "failed",
          failure_reason: formData.action_reason,
          updated_at: new Date().toISOString(),
          metadata: {
            ...loan.metadata,
            declined_by_admin: adminEmail,
          },
        })
        .eq("id", loan.id);

      if (error) throw error;

      setLoans((prev) =>
        prev.map((l) =>
          l.id === loan.id
            ? {
                ...l,
                status: "failed",
                failure_reason: formData.action_reason,
              }
            : l
        )
      );

      setMessage({
        type: "success",
        text: "✅ Loan declined successfully",
      });
      setDecliningLoan(null);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      console.error("[ADMIN_LOANS] Decline error:", err.message);
      setMessage({
        type: "error",
        text: `Failed to decline loan: ${err.message}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================================
  // SEARCH & FILTER
  // ============================================================================

  const filteredLoans = loans.filter((loan) => {
    const user = users.find((u) => u.id === loan.user_id);
    const matchesSearch =
      loan.reference_number
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.purpose?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.amount?.toString().includes(searchQuery);

    const matchesFilter =
      filterStatus === "all" || loan.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user?.full_name || "Unknown User";
  };

  const getUserEmail = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user?.email || "—";
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <Header
        adminEmail={adminEmail}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        {/* Sidebar */}
        <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-secondary mb-2">
                💰 Loan Management
              </h1>
              <p className="text-sm text-secondary opacity-70">
                Review, approve, and decline pending loan requests
              </p>
            </div>

            {/* Message Alert */}
            {message.text && (
              <div
                className={`mb-6 p-4 rounded-sm border-l-4 ${
                  message.type === "success"
                    ? "bg-green-50 border-green-500 text-green-800"
                    : "bg-red-50 border-red-500 text-red-800"
                }`}
              >
                <p className="text-sm font-semibold">{message.text}</p>
              </div>
            )}

            {/* Controls */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
              {/* Search */}
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary opacity-60">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, reference, or amount..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic focus:ring-opacity-30 text-sm"
                />
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic focus:ring-opacity-30 text-sm bg-primary"
              >
                <option value="all">All Loans</option>
                <option value="pending">Pending</option>
                <option value="completed">Approved</option>
                <option value="failed">Declined</option>
              </select>
            </div>

            {/* Loans Table/Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredLoans.length === 0 ? (
              <div className="bg-primary border border-secondary rounded-sm p-12 text-center">
                <p className="text-secondary opacity-70">No loans found</p>
              </div>
            ) : (
              <div className="bg-primary border border-secondary rounded-sm shadow-md overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary bg-opacity-5 border-b border-secondary">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          Reference
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          Borrower
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          Term
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          Rate
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-secondary uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary">
                      {filteredLoans.map((loan) => (
                        <tr
                          key={loan.id}
                          className="hover:bg-secondary hover:bg-opacity-5 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm text-basic font-semibold">
                              {loan.reference_number.slice(0, 12)}...
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-secondary">
                                {getUserName(loan.user_id)}
                              </p>
                              <p className="text-xs text-secondary opacity-60">
                                {getUserEmail(loan.user_id)}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-basic">
                              {loan.currency} {loan.amount.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-secondary opacity-70">
                            {loan.term_months} months
                          </td>
                          <td className="px-6 py-4 text-sm text-secondary opacity-70">
                            {loan.interest_rate}%
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                loan.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : loan.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {loan.status === "completed" && <CheckIcon />}
                              {loan.status === "failed" && <XIcon />}
                              {loan.status === "pending" && <ClockIcon />}
                              {loan.status.charAt(0).toUpperCase() +
                                loan.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-secondary opacity-70">
                            {new Date(loan.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {loan.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => setApprovingLoan(loan)}
                                    className="p-2 hover:bg-green-100 rounded-sm transition-all text-green-600"
                                    title="Approve loan"
                                  >
                                    <ApproveIcon />
                                  </button>
                                  <button
                                    onClick={() => setDecliningLoan(loan)}
                                    className="p-2 hover:bg-red-100 rounded-sm transition-all text-red-600"
                                    title="Decline loan"
                                  >
                                    <RejectIcon />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-secondary">
                  {filteredLoans.map((loan) => (
                    <div
                      key={loan.id}
                      className="p-4 hover:bg-secondary hover:bg-opacity-5 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-basic text-sm">
                            {getUserName(loan.user_id)}
                          </p>
                          <p className="text-xs text-secondary opacity-60">
                            {getUserEmail(loan.user_id)}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            loan.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : loan.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {loan.status.charAt(0).toUpperCase() +
                            loan.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                        <div>
                          <p className="text-secondary opacity-60">Amount</p>
                          <p className="font-bold text-basic">
                            {loan.currency} {loan.amount.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-secondary opacity-60">Term</p>
                          <p className="font-semibold text-secondary">
                            {loan.term_months}mo
                          </p>
                        </div>
                        <div>
                          <p className="text-secondary opacity-60">Rate</p>
                          <p className="font-semibold text-secondary">
                            {loan.interest_rate}%
                          </p>
                        </div>
                        <div>
                          <p className="text-secondary opacity-60">Created</p>
                          <p className="font-semibold text-secondary">
                            {new Date(loan.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {loan.status === "pending" && (
                        <div className="flex gap-2 pt-3 border-t border-secondary">
                          <button
                            onClick={() => setApprovingLoan(loan)}
                            className="flex-1 py-2 px-3 text-xs font-semibold bg-green-100 text-green-600 rounded-sm hover:bg-green-200 transition-all flex items-center justify-center gap-1"
                          >
                            <ApproveIcon /> Approve
                          </button>
                          <button
                            onClick={() => setDecliningLoan(loan)}
                            className="flex-1 py-2 px-3 text-xs font-semibold bg-red-100 text-red-600 rounded-sm hover:bg-red-200 transition-all flex items-center justify-center gap-1"
                          >
                            <RejectIcon /> Decline
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Footer */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-primary border border-secondary rounded-sm p-4 text-center">
                <p className="text-sm text-secondary opacity-60 mb-1">
                  Total Loans
                </p>
                <p className="text-2xl font-bold text-basic">{loans.length}</p>
              </div>
              <div className="bg-primary border border-secondary rounded-sm p-4 text-center">
                <p className="text-sm text-secondary opacity-60 mb-1">
                  Pending
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {loans.filter((l) => l.status === "pending").length}
                </p>
              </div>
              <div className="bg-primary border border-secondary rounded-sm p-4 text-center">
                <p className="text-sm text-secondary opacity-60 mb-1">
                  Approved
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {loans.filter((l) => l.status === "completed").length}
                </p>
              </div>
              <div className="bg-primary border border-secondary rounded-sm p-4 text-center">
                <p className="text-sm text-secondary opacity-60 mb-1">
                  Declined
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {loans.filter((l) => l.status === "failed").length}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {approvingLoan && (
        <LoanActionModal
          mode="approve"
          loan={approvingLoan}
          accounts={accounts}
          onClose={() => setApprovingLoan(null)}
          onSubmit={handleApproveLoan}
          submitting={submitting}
        />
      )}

      {decliningLoan && (
        <LoanActionModal
          mode="decline"
          loan={decliningLoan}
          accounts={accounts}
          onClose={() => setDecliningLoan(null)}
          onSubmit={handleDeclineLoan}
          submitting={submitting}
        />
      )}
    </div>
  );
};

export default LoansPage;
