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

// AFTER - w-5 h-5 (bigger)
const EditIcon = () => (
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
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const TrashIcon = () => (
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
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
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

const EyeIcon = () => (
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
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

// ============================================================================
// UTILITY: ISO ↔ Local DateTime Conversion
// ============================================================================

const isoToLocalDatetime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const localDatetimeToISO = (localDatetime) => {
  if (!localDatetime) return null;
  return new Date(localDatetime).toISOString();
};

// ============================================================================
// HELPER: Identify Transaction Type Category
// ============================================================================

const isDebitTransaction = (type) => {
  return ["withdrawal", "payment", "loan_repayment"].includes(type);
};

const isCreditTransaction = (type) => {
  return ["deposit", "tax_refund"].includes(type);
};

const isLoanTransaction = (type) => {
  return ["loan_disbursement", "loan_repayment"].includes(type);
};

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

const DateTimeField = ({
  label,
  name,
  value,
  onChange,
  disabled = false,
  error,
  required = false,
  helper = "",
}) => (
  <div className="mb-4">
    <label className="block text-xs sm:text-sm font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80 flex items-center gap-1">
      <ClockIcon />
      {label}
      {required && <span className="text-red-600 ml-1">*</span>}
    </label>
    <input
      type="datetime-local"
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
    />
    {helper && (
      <p className="text-xs text-secondary opacity-60 mt-1">{helper}</p>
    )}
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
// TRANSACTION DETAIL MODAL (VIEW ONLY)
// ============================================================================

const TransactionDetailModal = ({
  transaction,
  accounts,
  onClose,
  onEditClick,
}) => {
  const fromAccount = accounts.find(
    (a) => a.id === transaction?.from_account_id
  );
  const toAccount = accounts.find((a) => a.id === transaction?.to_account_id);

  const isDebit = isDebitTransaction(transaction?.transaction_type);
  const isCredit = isCreditTransaction(transaction?.transaction_type);
  const isLoan = isLoanTransaction(transaction?.transaction_type);

  const displayType = isCredit
    ? "CREDIT (Balance +)"
    : isDebit
    ? "DEBIT (Balance -)"
    : "TRANSFER";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-sm border border-secondary shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary">
            📋 Transaction Details
          </h2>
          <button
            onClick={onClose}
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

        <div className="space-y-6">
          {/* Reference & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-secondary bg-opacity-5 border border-secondary rounded-sm p-4">
              <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-1">
                Reference
              </p>
              <p className="font-mono font-bold text-basic text-sm">
                {transaction?.reference_number}
              </p>
            </div>
            <div className="bg-secondary bg-opacity-5 border border-secondary rounded-sm p-4">
              <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-1">
                Amount
              </p>
              <p className="font-bold text-lg text-basic">
                {transaction?.currency} {transaction?.amount?.toFixed(2)}
              </p>
            </div>
            <div className="bg-secondary bg-opacity-5 border border-secondary rounded-sm p-4">
              <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-1">
                Status
              </p>
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  transaction?.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : transaction?.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : transaction?.status === "failed"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {transaction?.status === "completed" && <CheckIcon />}
                {transaction?.status === "failed" && <XIcon />}
                {transaction?.status?.charAt(0).toUpperCase() +
                  transaction?.status?.slice(1)}
              </span>
            </div>
          </div>

          {/* Type & Accounts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-secondary bg-opacity-5 border border-secondary rounded-sm p-4">
              <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-2">
                Type
              </p>
              <div>
                <p className="font-semibold text-secondary capitalize text-sm">
                  {transaction?.transaction_type.replace(/_/g, " ")}
                </p>
                <p className="text-xs text-secondary opacity-60 mt-1">
                  {displayType}
                </p>
              </div>
            </div>

            <div className="bg-secondary bg-opacity-5 border border-secondary rounded-sm p-4">
              <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-2">
                From Account
              </p>
              <p className="font-semibold text-secondary">
                {fromAccount?.account_number || "Unknown"}
              </p>
              <p className="text-xs text-secondary opacity-60 mt-1">
                Balance: {fromAccount?.currency}{" "}
                {fromAccount?.balance?.toFixed(2)}
              </p>
            </div>
          </div>

          {toAccount && (
            <div className="bg-secondary bg-opacity-5 border border-secondary rounded-sm p-4">
              <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-2">
                To Account
              </p>
              <p className="font-semibold text-secondary">
                {toAccount.account_number}
              </p>
              <p className="text-xs text-secondary opacity-60 mt-1">
                Balance: {toAccount.currency} {toAccount.balance?.toFixed(2)}
              </p>
            </div>
          )}

          {transaction?.external_recipient_iban && (
            <div className="bg-secondary bg-opacity-5 border border-secondary rounded-sm p-4">
              <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-2">
                External Recipient
              </p>
              <p className="font-semibold text-secondary">
                {transaction?.external_recipient_name}
              </p>
              <p className="font-mono text-xs text-secondary mt-1">
                {transaction?.external_recipient_iban}
              </p>
            </div>
          )}

          {/* Description */}
          {transaction?.description && (
            <div className="bg-secondary bg-opacity-5 border border-secondary rounded-sm p-4">
              <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-2">
                Description
              </p>
              <p className="text-sm text-secondary">
                {transaction?.description}
              </p>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-secondary bg-opacity-5 border border-secondary rounded-sm p-4">
              <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-2">
                Created
              </p>
              <p className="font-semibold text-secondary text-sm">
                {new Date(transaction?.created_at).toLocaleString()}
              </p>
            </div>
            <div className="bg-secondary bg-opacity-5 border border-secondary rounded-sm p-4">
              <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-2">
                Approved
              </p>
              <p className="font-semibold text-secondary text-sm">
                {transaction?.approved_at
                  ? new Date(transaction.approved_at).toLocaleString()
                  : "—"}
              </p>
            </div>
            <div className="bg-secondary bg-opacity-5 border border-secondary rounded-sm p-4">
              <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-2">
                Completed
              </p>
              <p className="font-semibold text-secondary text-sm">
                {transaction?.completed_at
                  ? new Date(transaction.completed_at).toLocaleString()
                  : "—"}
              </p>
            </div>
          </div>

          {transaction?.failure_reason && (
            <div className="bg-red-50 border border-red-200 rounded-sm p-4">
              <p className="text-xs text-red-800 font-semibold uppercase tracking-wider mb-2">
                Failure Reason
              </p>
              <p className="text-sm text-red-800">
                {transaction?.failure_reason}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-secondary">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-secondary text-secondary font-semibold rounded-sm hover:bg-secondary hover:bg-opacity-5 transition-all"
            >
              Close
            </button>
            {
              <button
                onClick={onEditClick}
                className="flex-1 py-3 px-4 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <EditIcon /> Edit Transaction
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TRANSACTION FORM MODAL (Create/Edit)
// ============================================================================

const TransactionFormModal = ({
  mode,
  transaction,
  accounts,
  onClose,
  onSubmit,
  submitting,
}) => {
  const [formData, setFormData] = useState({
    from_account_id: transaction?.from_account_id || "",
    to_account_id: transaction?.to_account_id || "",
    external_recipient_name: transaction?.external_recipient_name || "",
    external_recipient_iban: transaction?.external_recipient_iban || "",
    amount: transaction?.amount || "",
    currency: transaction?.currency || "USD",
    transaction_type: transaction?.transaction_type || "deposit",
    status: transaction?.status || "pending",
    description: transaction?.description || "",
    failure_reason: transaction?.failure_reason || "",
    created_at: transaction
      ? isoToLocalDatetime(transaction.created_at)
      : isoToLocalDatetime(new Date().toISOString()),
    approved_at: transaction?.approved_at
      ? isoToLocalDatetime(transaction.approved_at)
      : "",
    completed_at: transaction?.completed_at
      ? isoToLocalDatetime(transaction.completed_at)
      : "",
  });

  const [errors, setErrors] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    accounts: true,
    timestamps: false,
    notes: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? (value ? parseFloat(value) : "") : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const amount = parseFloat(formData.amount);

    if (!formData.from_account_id)
      newErrors.from_account_id = "Source account required";
    if (!amount || amount <= 0)
      newErrors.amount = "Amount must be greater than 0";
    if (!formData.currency) newErrors.currency = "Currency required";
    if (!formData.transaction_type)
      newErrors.transaction_type = "Transaction type required";
    if (!formData.created_at) newErrors.created_at = "Created date required";

    // Validate timestamp ordering
    if (formData.created_at && formData.approved_at) {
      const createdTime = new Date(formData.created_at).getTime();
      const approvedTime = new Date(formData.approved_at).getTime();
      if (approvedTime < createdTime) {
        newErrors.approved_at = "Approved time must be after created time";
      }
    }

    if (formData.approved_at && formData.completed_at) {
      const approvedTime = new Date(formData.approved_at).getTime();
      const completedTime = new Date(formData.completed_at).getTime();
      if (completedTime < approvedTime) {
        newErrors.completed_at = "Completed time must be after approved time";
      }
    }

    // Transfer validation
    if (formData.transaction_type === "transfer") {
      if (!formData.to_account_id)
        newErrors.to_account_id = "Destination account required";
      if (formData.from_account_id === formData.to_account_id) {
        newErrors.to_account_id = "Cannot transfer to same account";
      }
    }

    // External transfer validation
    if (formData.transaction_type === "external_transfer") {
      if (!formData.external_recipient_iban)
        newErrors.external_recipient_iban = "Recipient IBAN required";
      if (!formData.external_recipient_name)
        newErrors.external_recipient_name = "Recipient name required";
    }

    // Balance validation for debit transactions when completing
    const isDebit = isDebitTransaction(formData.transaction_type);
    const isLoan = isLoanTransaction(formData.transaction_type);

    if (isDebit && !isLoan && formData.status === "completed") {
      const fromAccount = accounts.find(
        (a) => a.id === formData.from_account_id
      );
      if (fromAccount && fromAccount.balance < amount) {
        newErrors.amount = `Insufficient balance. Available: ${
          fromAccount.currency
        } ${fromAccount.balance.toFixed(2)}, Required: ${
          formData.currency
        } ${amount.toFixed(2)}`;
      }
    }

    // Currency mismatch for transfers
    if (formData.transaction_type === "transfer" && formData.to_account_id) {
      const fromAcc = accounts.find((a) => a.id === formData.from_account_id);
      const toAcc = accounts.find((a) => a.id === formData.to_account_id);
      if (fromAcc && toAcc && fromAcc.currency !== toAcc.currency) {
        newErrors.currency =
          "Source and destination accounts have different currencies";
      }
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
      from_account_id: formData.from_account_id,
      to_account_id: formData.to_account_id || null,
      external_recipient_name: formData.external_recipient_name || null,
      external_recipient_iban: formData.external_recipient_iban || null,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      transaction_type: formData.transaction_type,
      status: formData.status,
      description: formData.description || null,
      failure_reason: formData.failure_reason || null,
      created_at: localDatetimeToISO(formData.created_at),
      approved_at: formData.approved_at
        ? localDatetimeToISO(formData.approved_at)
        : null,
      completed_at: formData.completed_at
        ? localDatetimeToISO(formData.completed_at)
        : null,
    });
  };

  const fromAccount = accounts.find((a) => a.id === formData.from_account_id);
  const toAccount = accounts.find((a) => a.id === formData.to_account_id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-sm border border-secondary shadow-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary">
            {mode === "create"
              ? "➕ Create Transaction"
              : "✏️ Edit Transaction"}
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
          {/* Basic Information */}
          <CollapsibleSection
            title="Basic Information"
            icon="💳"
            isOpen={expandedSections.basic}
            onToggle={() => toggleSection("basic")}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField
                label="Transaction Type"
                name="transaction_type"
                value={formData.transaction_type}
                onChange={handleChange}
                options={[
                  { value: "deposit", label: "Deposit (Credit)" },
                  { value: "withdrawal", label: "Withdrawal (Debit)" },
                  { value: "transfer", label: "Transfer (Debit)" },
                  { value: "tax_refund", label: "Tax Refund (Credit)" },
                  { value: "loan_disbursement", label: "Loan Disbursement" },
                  { value: "loan_repayment", label: "Loan Repayment (Debit)" },
                  {
                    value: "external_transfer",
                    label: "External Transfer (Debit)",
                  },
                  { value: "payment", label: "Payment (Debit)" },
                ]}
                required
                error={errors.transaction_type}
              />
              <div className="mb-4">
                <label className="block text-xs sm:text-sm font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80">
                  Amount <span className="text-red-600 ml-1">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={`flex-1 px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 transition-all font-sans text-sm ${
                      errors.amount
                        ? "border-red-500 focus:ring-red-500 focus:ring-opacity-50"
                        : "border-secondary focus:ring-basic focus:ring-opacity-30"
                    }`}
                  />
                  <SelectField
                    label="Currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    options={[
                      { value: "USD", label: "USD" },
                      { value: "EUR", label: "EUR" },
                      { value: "GBP", label: "GBP" },
                      { value: "CAD", label: "CAD" },
                    ]}
                    error={errors.currency}
                  />
                </div>
                {errors.amount && (
                  <p className="text-xs text-red-600 mt-1">{errors.amount}</p>
                )}
              </div>
            </div>

            <SelectField
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: "pending", label: "Pending (Awaiting Approval)" },
                { value: "completed", label: "Completed (Approved)" },
                { value: "failed", label: "Failed" },
                { value: "on_hold", label: "On Hold" },
                { value: "reversed", label: "Reversed" },
              ]}
              required
              error={errors.status}
            />

            {formData.status === "failed" && (
              <TextAreaField
                label="Failure Reason"
                name="failure_reason"
                value={formData.failure_reason}
                onChange={handleChange}
                placeholder="Explain why this transaction failed..."
                rows={2}
              />
            )}

            <TextAreaField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional: Transaction notes or reference"
              rows={2}
            />
          </CollapsibleSection>

          {/* Account Selection */}
          <CollapsibleSection
            title="Account Details"
            icon="🏦"
            isOpen={expandedSections.accounts}
            onToggle={() => toggleSection("accounts")}
          >
            <SelectField
              label="From Account (Source)"
              name="from_account_id"
              value={formData.from_account_id}
              onChange={handleChange}
              options={accounts.map((acc) => ({
                value: acc.id,
                label: `${acc.account_number} (${
                  acc.currency
                } ${acc.balance.toFixed(2)}) - ${acc.account_type}`,
              }))}
              required
              error={errors.from_account_id}
            />

            {fromAccount && (
              <div className="bg-secondary bg-opacity-5 border border-secondary rounded-sm p-4 mb-4">
                <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-2">
                  Source Account Balance
                </p>
                <p className="text-lg font-bold text-basic">
                  {fromAccount.currency} {fromAccount.balance.toFixed(2)}
                </p>
                <p className="text-xs text-secondary opacity-60 mt-1">
                  Available: {fromAccount.currency}{" "}
                  {fromAccount.available_balance.toFixed(2)}
                </p>
              </div>
            )}

            {formData.transaction_type === "transfer" && (
              <>
                <SelectField
                  label="To Account (Destination)"
                  name="to_account_id"
                  value={formData.to_account_id}
                  onChange={handleChange}
                  options={accounts
                    .filter((acc) => acc.id !== formData.from_account_id)
                    .map((acc) => ({
                      value: acc.id,
                      label: `${acc.account_number} (${
                        acc.currency
                      } ${acc.balance.toFixed(2)})`,
                    }))}
                  required
                  error={errors.to_account_id}
                />

                {toAccount && (
                  <div className="bg-secondary bg-opacity-5 border border-secondary rounded-sm p-4">
                    <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-2">
                      Destination Account Balance
                    </p>
                    <p className="text-lg font-bold text-basic">
                      {toAccount.currency} {toAccount.balance.toFixed(2)}
                    </p>
                  </div>
                )}
              </>
            )}

            {formData.transaction_type === "external_transfer" && (
              <>
                <FormField
                  label="Recipient Name"
                  name="external_recipient_name"
                  value={formData.external_recipient_name}
                  onChange={handleChange}
                  placeholder="Full name of recipient"
                  required
                  error={errors.external_recipient_name}
                />
                <FormField
                  label="Recipient IBAN"
                  name="external_recipient_iban"
                  value={formData.external_recipient_iban}
                  onChange={handleChange}
                  placeholder="International Bank Account Number"
                  required
                  error={errors.external_recipient_iban}
                />
              </>
            )}
          </CollapsibleSection>

          {/* Timestamps */}
          <CollapsibleSection
            title="Transaction Timestamps"
            icon="🕐"
            isOpen={expandedSections.timestamps}
            onToggle={() => toggleSection("timestamps")}
          >
            <DateTimeField
              label="Created Date & Time"
              name="created_at"
              value={formData.created_at}
              onChange={handleChange}
              required
              helper="When the transaction was initiated"
              error={errors.created_at}
            />

            {formData.status === "completed" && (
              <>
                <DateTimeField
                  label="Approved Date & Time"
                  name="approved_at"
                  value={formData.approved_at}
                  onChange={handleChange}
                  helper="When the transaction was approved by admin"
                  error={errors.approved_at}
                />
                <DateTimeField
                  label="Completed Date & Time"
                  name="completed_at"
                  value={formData.completed_at}
                  onChange={handleChange}
                  helper="When the transaction was finalized"
                  error={errors.completed_at}
                />
              </>
            )}
          </CollapsibleSection>
        </form>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-6 border-t border-secondary mt-6">
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
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-3 px-4 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <LoadingSpinner size="sm" /> Saving...
              </>
            ) : mode === "create" ? (
              <>
                <PlusIcon /> Create Transaction
              </>
            ) : (
              <>
                <EditIcon /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// APPROVAL MODAL
// ============================================================================

const ApprovalModal = ({
  transaction,
  accounts,
  onApprove,
  onReject,
  onCancel,
  submitting,
}) => {
  const fromAccount = accounts.find(
    (a) => a.id === transaction?.from_account_id
  );
  const isDebit = isDebitTransaction(transaction?.transaction_type);
  const isLoan = isLoanTransaction(transaction?.transaction_type);

  const willBeInsufficientFunds =
    isDebit &&
    !isLoan &&
    fromAccount &&
    fromAccount.balance < transaction?.amount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-sm border border-secondary shadow-lg max-w-md w-full p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-secondary mb-6">
          🔍 Review Transaction
        </h2>

        {/* Transaction Summary */}
        <div className="bg-secondary bg-opacity-5 border border-secondary rounded-sm p-4 mb-4 space-y-3">
          <div>
            <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
              Reference
            </p>
            <p className="font-mono font-bold text-basic text-sm">
              {transaction?.reference_number}
            </p>
          </div>
          <div>
            <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
              Amount
            </p>
            <p className="text-lg font-bold text-basic">
              {transaction?.currency} {transaction?.amount?.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
              Type
            </p>
            <p className="capitalize text-secondary font-semibold">
              {transaction?.transaction_type.replace(/_/g, " ")}
            </p>
          </div>
        </div>

        {/* Source Account Info */}
        {fromAccount && (
          <div className="bg-secondary bg-opacity-5 border border-secondary rounded-sm p-4 mb-4">
            <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-2">
              Source Account
            </p>
            <p className="font-semibold text-secondary">
              {fromAccount.account_number}
            </p>
            <p className="text-xs text-secondary opacity-60 mt-1">
              Current Balance: {fromAccount.currency}{" "}
              {fromAccount.balance.toFixed(2)}
            </p>
          </div>
        )}

        {/* Insufficient Funds Warning */}
        {willBeInsufficientFunds && (
          <div className="bg-red-50 border border-red-200 rounded-sm p-4 mb-4">
            <p className="text-sm font-semibold text-red-800 mb-2">
              ⚠️ INSUFFICIENT FUNDS
            </p>
            <p className="text-xs text-red-800">
              Account balance ({fromAccount?.currency}{" "}
              {fromAccount?.balance.toFixed(2)}) is less than transaction amount
              ({transaction?.currency} {transaction?.amount?.toFixed(2)})
            </p>
          </div>
        )}

        {/* Loan Approval Note */}
        {isLoan && (
          <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 mb-4">
            <p className="text-sm font-semibold text-blue-800">
              💰 Loan Transaction
            </p>
            <p className="text-xs text-blue-800 mt-1">
              Balance will not be affected. Loan records will be updated.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={submitting}
            className="flex-1 py-2 px-4 border border-secondary text-secondary font-semibold rounded-sm hover:bg-secondary hover:bg-opacity-5 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onReject}
            disabled={submitting || willBeInsufficientFunds}
            className="flex-1 py-2 px-4 bg-red-100 text-red-600 font-semibold rounded-sm hover:bg-red-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <LoadingSpinner size="sm" /> Rejecting...
              </>
            ) : (
              <>
                <RejectIcon /> Reject
              </>
            )}
          </button>
          <button
            onClick={onApprove}
            disabled={submitting || willBeInsufficientFunds}
            className="flex-1 py-2 px-4 bg-green-100 text-green-600 font-semibold rounded-sm hover:bg-green-200 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <LoadingSpinner size="sm" /> Approving...
              </>
            ) : (
              <>
                <ApproveIcon /> Approve
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// DELETE CONFIRMATION MODAL
// ============================================================================

const DeleteConfirmModal = ({
  transaction,
  onConfirm,
  onCancel,
  submitting,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-sm border border-secondary shadow-lg max-w-md w-full p-6 sm:p-8">
        <h3 className="text-xl font-bold text-secondary mb-4">
          🗑️ Delete Transaction
        </h3>
        <p className="text-secondary opacity-70 mb-6">
          Are you sure you want to permanently delete transaction{" "}
          <span className="font-mono font-semibold">
            {transaction?.reference_number}
          </span>
          ?
        </p>

        {transaction?.status === "completed" && (
          <div className="bg-red-50 border border-red-200 rounded-sm p-4 mb-6">
            <p className="text-sm font-semibold text-red-800 mb-2">
              ⚠️ COMPLETED TRANSACTION
            </p>
            <p className="text-xs text-red-800">
              This transaction is completed. Deleting it will REVERSE all
              balance changes made by this transaction.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={submitting}
            className="flex-1 py-2 px-4 border border-secondary text-secondary font-semibold rounded-sm hover:bg-secondary hover:bg-opacity-5 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            className="flex-1 py-2 px-4 bg-red-600 text-white font-semibold rounded-sm hover:bg-red-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <LoadingSpinner size="sm" /> Deleting...
              </>
            ) : (
              <>
                <TrashIcon /> Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN TRANSACTIONS PAGE COMPONENT
// ============================================================================

const TransactionsPage = () => {
  const navigate = useNavigate();

  // State Management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [message, setMessage] = useState({ type: "", text: "" });

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingTransaction, setViewingTransaction] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [approvingTransaction, setApprovingTransaction] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(null);

  // ========================================================================
  // AUTHENTICATION & INITIALIZATION
  // ========================================================================

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await isAdminAuthenticated();
        if (!isAuth) {
          navigate("/user/admin/auth/login");
          return;
        }
        setIsAuthenticated(true);
        const { data: userData } = await supabase.auth.getUser();
        setAdminEmail(userData?.user?.email || "Admin");
        await fetchTransactions();
        await fetchAccounts();
      } catch (err) {
        console.error("[AUTH_ERROR]", err);
        navigate("/admin/login");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  // ========================================================================
  // FETCH DATA
  // ========================================================================

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      console.error("[FETCH_TRANSACTIONS]", err);
      setMessage({ type: "error", text: "Failed to load transactions" });
    }
  };

  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("is_deleted", false);

      if (error) throw error;
      setAccounts(data || []);
    } catch (err) {
      console.error("[FETCH_ACCOUNTS]", err);
      setMessage({ type: "error", text: "Failed to load accounts" });
    }
  };

  // ========================================================================
  // APPLY BALANCE CHANGES - ENHANCED FOR ALL TRANSACTION TYPES
  // ========================================================================

  const applyBalanceChanges = async (formData) => {
    try {
      const isDebit = isDebitTransaction(formData.transaction_type);
      const isCredit = isCreditTransaction(formData.transaction_type);
      const isLoan = isLoanTransaction(formData.transaction_type);

      if (isLoan) return; // Skip balance updates for loans

      // Fetch fresh account data to prevent race conditions
      const { data: freshAccounts, error: fetchErr } = await supabase
        .from("accounts")
        .select("*")
        .eq("is_deleted", false);

      if (fetchErr) throw fetchErr;

      const freshFromAccount = freshAccounts.find(
        (a) => a.id === formData.from_account_id
      );

      if (!freshFromAccount) {
        throw new Error("Source account not found");
      }

      // CREDIT FIRST: Deposit, Tax Refund - Add to balance
      if (isCredit) {
        const { error } = await supabase
          .from("accounts")
          .update({
            balance: freshFromAccount.balance + formData.amount,
            available_balance:
              freshFromAccount.available_balance + formData.amount,
            updated_at: new Date().toISOString(),
          })
          .eq("id", formData.from_account_id);

        if (error) throw error;

        setAccounts((prev) =>
          prev.map((acc) =>
            acc.id === formData.from_account_id
              ? {
                  ...acc,
                  balance: freshFromAccount.balance + formData.amount,
                  available_balance:
                    freshFromAccount.available_balance + formData.amount,
                  updated_at: new Date().toISOString(),
                }
              : acc
          )
        );
        return;
      }

      // TRANSFER: Debit from source, credit to destination
      if (formData.transaction_type === "transfer") {
        const freshToAccount = freshAccounts.find(
          (a) => a.id === formData.to_account_id
        );

        if (!freshToAccount) {
          throw new Error("Destination account not found");
        }

        // Validate sufficient balance
        if (freshFromAccount.balance < formData.amount) {
          throw new Error(
            `Insufficient balance in source account. Available: ${
              freshFromAccount.currency
            } ${freshFromAccount.balance.toFixed(2)}, Required: ${
              formData.currency
            } ${formData.amount.toFixed(2)}`
          );
        }

        // Update from account (debit)
        const { error: fromErr } = await supabase
          .from("accounts")
          .update({
            balance: freshFromAccount.balance - formData.amount,
            available_balance:
              freshFromAccount.available_balance - formData.amount,
            updated_at: new Date().toISOString(),
          })
          .eq("id", formData.from_account_id);

        if (fromErr) throw fromErr;

        // Update to account (credit)
        const { error: toErr } = await supabase
          .from("accounts")
          .update({
            balance: freshToAccount.balance + formData.amount,
            available_balance:
              freshToAccount.available_balance + formData.amount,
            updated_at: new Date().toISOString(),
          })
          .eq("id", formData.to_account_id);

        if (toErr) throw toErr;

        // Update local state
        setAccounts((prev) =>
          prev.map((acc) => {
            if (acc.id === formData.from_account_id) {
              return {
                ...acc,
                balance: freshFromAccount.balance - formData.amount,
                available_balance:
                  freshFromAccount.available_balance - formData.amount,
                updated_at: new Date().toISOString(),
              };
            } else if (acc.id === formData.to_account_id) {
              return {
                ...acc,
                balance: freshToAccount.balance + formData.amount,
                available_balance:
                  freshToAccount.available_balance + formData.amount,
                updated_at: new Date().toISOString(),
              };
            }
            return acc;
          })
        );
        return;
      }

      // DEBIT (Withdrawal, Payment, External Transfer): Subtract from balance
      if (isDebit) {
        if (freshFromAccount.balance < formData.amount) {
          throw new Error(
            `Insufficient balance. Available: ${
              freshFromAccount.currency
            } ${freshFromAccount.balance.toFixed(2)}, Required: ${
              formData.currency
            } ${formData.amount.toFixed(2)}`
          );
        }

        const { error } = await supabase
          .from("accounts")
          .update({
            balance: freshFromAccount.balance - formData.amount,
            available_balance:
              freshFromAccount.available_balance - formData.amount,
            updated_at: new Date().toISOString(),
          })
          .eq("id", formData.from_account_id);

        if (error) throw error;

        setAccounts((prev) =>
          prev.map((acc) =>
            acc.id === formData.from_account_id
              ? {
                  ...acc,
                  balance: freshFromAccount.balance - formData.amount,
                  available_balance:
                    freshFromAccount.available_balance - formData.amount,
                  updated_at: new Date().toISOString(),
                }
              : acc
          )
        );
      }
    } catch (err) {
      console.error("[BALANCE_UPDATE] Error:", err.message);
      throw err;
    }
  };

  // ========================================================================
  // REVERSE BALANCE CHANGES UTILITY - ENHANCED
  // ========================================================================

  const reverseBalanceChanges = async (transaction) => {
    try {
      const isDebit = isDebitTransaction(transaction.transaction_type);
      const isCredit = isCreditTransaction(transaction.transaction_type);
      const isLoan = isLoanTransaction(transaction.transaction_type);

      if (isLoan) return; // Loan transactions don't affect balances

      const { data: freshAccounts, error: fetchErr } = await supabase
        .from("accounts")
        .select("*")
        .eq("is_deleted", false);

      if (fetchErr) throw fetchErr;

      if (transaction.transaction_type === "transfer") {
        // TRANSFER: Reverse by crediting source and debiting destination
        const freshFromAccount = freshAccounts.find(
          (a) => a.id === transaction.from_account_id
        );
        const freshToAccount = freshAccounts.find(
          (a) => a.id === transaction.to_account_id
        );

        if (freshFromAccount) {
          const { error } = await supabase
            .from("accounts")
            .update({
              balance: freshFromAccount.balance + transaction.amount,
              available_balance:
                freshFromAccount.available_balance + transaction.amount,
              updated_at: new Date().toISOString(),
            })
            .eq("id", transaction.from_account_id);

          if (error) throw error;
        }

        if (freshToAccount) {
          const { error } = await supabase
            .from("accounts")
            .update({
              balance: freshToAccount.balance - transaction.amount,
              available_balance:
                freshToAccount.available_balance - transaction.amount,
              updated_at: new Date().toISOString(),
            })
            .eq("id", transaction.to_account_id);

          if (error) throw error;
        }
      } else if (isDebit) {
        // DEBIT: Reverse by adding back to balance
        const freshFromAccount = freshAccounts.find(
          (a) => a.id === transaction.from_account_id
        );

        if (freshFromAccount) {
          const { error } = await supabase
            .from("accounts")
            .update({
              balance: freshFromAccount.balance + transaction.amount,
              available_balance:
                freshFromAccount.available_balance + transaction.amount,
              updated_at: new Date().toISOString(),
            })
            .eq("id", transaction.from_account_id);

          if (error) throw error;
        }
      } else if (isCredit) {
        // CREDIT: Reverse by subtracting from balance
        const freshFromAccount = freshAccounts.find(
          (a) => a.id === transaction.from_account_id
        );

        if (freshFromAccount) {
          const { error } = await supabase
            .from("accounts")
            .update({
              balance: freshFromAccount.balance - transaction.amount,
              available_balance:
                freshFromAccount.available_balance - transaction.amount,
              updated_at: new Date().toISOString(),
            })
            .eq("id", transaction.from_account_id);

          if (error) throw error;
        }
      }

      // Refresh accounts in state
      const { data: updatedAccounts } = await supabase
        .from("accounts")
        .select("*")
        .eq("is_deleted", false);

      setAccounts(updatedAccounts || []);
    } catch (err) {
      console.error("[BALANCE_REVERSE] Error:", err.message);
      throw err;
    }
  };

  // ========================================================================
  // CREATE TRANSACTION WITH VALIDATION
  // ========================================================================

  const handleCreateTransaction = async (formData) => {
    setSubmitting(true);
    try {
      const referenceNumber = `TXN-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`;

      // Validate balance before creating completed transaction
      if (formData.status === "completed") {
        const isDebit = isDebitTransaction(formData.transaction_type);
        const isLoan = isLoanTransaction(formData.transaction_type);

        if (!isLoan && isDebit) {
          const fromAcc = accounts.find(
            (a) => a.id === formData.from_account_id
          );
          if (fromAcc && fromAcc.balance < formData.amount) {
            throw new Error(
              `Insufficient balance. Available: ${
                fromAcc.currency
              } ${fromAcc.balance.toFixed(2)}, Required: ${
                formData.currency
              } ${formData.amount.toFixed(2)}`
            );
          }
        }
      }

      const { data, error } = await supabase
        .from("transactions")
        .insert([
          {
            from_account_id: formData.from_account_id,
            to_account_id: formData.to_account_id || null,
            external_recipient_name: formData.external_recipient_name || null,
            external_recipient_iban: formData.external_recipient_iban || null,
            amount: formData.amount,
            currency: formData.currency,
            transaction_type: formData.transaction_type,
            status: formData.status,
            description: formData.description || null,
            reference_number: referenceNumber,
            failure_reason: formData.failure_reason || null,
            created_at: formData.created_at,
            approved_at: formData.approved_at || null,
            completed_at: formData.completed_at || null,
            metadata: {
              created_by: "admin",
              initiated_at: new Date().toISOString(),
            },
          },
        ])
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error("Transaction was created but response is empty");
      }

      const newTransaction = data[0];

      // If completed, update balances immediately
      if (formData.status === "completed") {
        try {
          await applyBalanceChanges(formData);
        } catch (balanceErr) {
          // Delete transaction if balance update fails
          await supabase
            .from("transactions")
            .delete()
            .eq("id", newTransaction.id);
          throw new Error(`Balance update failed: ${balanceErr.message}`);
        }
      }

      setTransactions((prev) => [newTransaction, ...prev]);

      setMessage({
        type: "success",
        text: `✅ Transaction created! Ref: ${referenceNumber}${
          formData.status === "completed" ? " (Balance updated)" : ""
        }`,
      });
      setShowCreateModal(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    } catch (err) {
      console.error("[CREATE_TRANSACTION]", err.message);
      setMessage({
        type: "error",
        text: `Failed to create transaction: ${err.message}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ========================================================================
  // UPDATE TRANSACTION WITH SMART BALANCE RECALCULATION
  // ========================================================================

  const handleUpdateTransaction = async (formData) => {
    setSubmitting(true);
    try {
      const oldTransaction = editingTransaction;
      const oldStatus = oldTransaction.status;
      const newStatus = formData.status;

      // Update transaction in database
      const { error: updateError } = await supabase
        .from("transactions")
        .update({
          from_account_id: formData.from_account_id,
          to_account_id: formData.to_account_id || null,
          external_recipient_name: formData.external_recipient_name || null,
          external_recipient_iban: formData.external_recipient_iban || null,
          amount: formData.amount,
          currency: formData.currency,
          transaction_type: formData.transaction_type,
          status: formData.status,
          description: formData.description || null,
          failure_reason: formData.failure_reason || null,
          created_at: formData.created_at,
          approved_at: formData.approved_at,
          completed_at: formData.completed_at,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingTransaction.id);

      if (updateError) throw updateError;

      // BALANCE LOGIC:
      // 1. If old transaction was completed, reverse its balance changes
      // 2. If new transaction is completed, apply new balance changes

      if (oldStatus === "completed") {
        // Reverse old transaction's balance changes
        await reverseBalanceChanges(oldTransaction);
      }

      if (newStatus === "completed") {
        // Apply new transaction's balance changes with validation
        try {
          await applyBalanceChanges(formData);
        } catch (balanceErr) {
          // Revert transaction update if balance fails
          await supabase
            .from("transactions")
            .update({
              status: oldStatus,
              updated_at: new Date().toISOString(),
            })
            .eq("id", editingTransaction.id);

          throw new Error(`Balance validation failed: ${balanceErr.message}`);
        }
      }

      // Update local state
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === editingTransaction.id
            ? {
                ...t,
                ...formData,
                updated_at: new Date().toISOString(),
              }
            : t
        )
      );

      setMessage({
        type: "success",
        text: "✅ Transaction updated successfully",
      });
      setEditingTransaction(null);
      setViewingTransaction(null);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      console.error("[UPDATE_TRANSACTION]", err.message);
      setMessage({
        type: "error",
        text: `Failed to update transaction: ${err.message}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ========================================================================
  // APPROVE TRANSACTION WITH BALANCE UPDATES & TIMESTAMP
  // ========================================================================

  const handleApproveTransaction = async () => {
    setSubmitting(true);
    try {
      const txn = approvingTransaction;
      const isLoan = isLoanTransaction(txn.transaction_type);
      const isDebit = isDebitTransaction(txn.transaction_type);

      // Validate balance before approval
      if (!isLoan && isDebit) {
        const { data: freshAccounts } = await supabase
          .from("accounts")
          .select("*")
          .eq("is_deleted", false);

        const fromAcc = freshAccounts.find((a) => a.id === txn.from_account_id);
        if (fromAcc && fromAcc.balance < txn.amount) {
          throw new Error(
            `Insufficient funds. Available: ${
              fromAcc.currency
            } ${fromAcc.balance.toFixed(2)}, Required: ${
              txn.currency
            } ${txn.amount.toFixed(2)}`
          );
        }
      }

      const approvalTimestamp = new Date().toISOString();

      // Update transaction status
      const { error: txnError } = await supabase
        .from("transactions")
        .update({
          status: "completed",
          approved_at: approvalTimestamp,
          completed_at: approvalTimestamp,
          updated_at: approvalTimestamp,
        })
        .eq("id", txn.id);

      if (txnError) throw txnError;

      // Apply balance changes if not a loan
      if (!isLoan) {
        try {
          await applyBalanceChanges({
            ...txn,
            status: "completed",
          });
        } catch (balanceErr) {
          // Revert status if balance update fails
          await supabase
            .from("transactions")
            .update({
              status: "pending",
              approved_at: null,
              completed_at: null,
              updated_at: new Date().toISOString(),
            })
            .eq("id", txn.id);

          throw new Error(`Balance update failed: ${balanceErr.message}`);
        }
      }

      setTransactions((prev) =>
        prev.map((t) =>
          t.id === txn.id
            ? {
                ...t,
                status: "completed",
                approved_at: approvalTimestamp,
                completed_at: approvalTimestamp,
                updated_at: approvalTimestamp,
              }
            : t
        )
      );

      setMessage({
        type: "success",
        text: `✅ Transaction approved! ${
          isLoan ? "(Loan - balance unchanged)" : "(Balance updated)"
        }`,
      });
      setApprovingTransaction(null);
      setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    } catch (err) {
      console.error("[APPROVE_TRANSACTION]", err.message);
      setMessage({
        type: "error",
        text: `Failed to approve transaction: ${err.message}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ========================================================================
  // REJECT TRANSACTION
  // ========================================================================

  const handleRejectTransaction = async () => {
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("transactions")
        .update({
          status: "failed",
          failure_reason: "Rejected by admin during approval",
          updated_at: new Date().toISOString(),
        })
        .eq("id", approvingTransaction.id);

      if (error) throw error;

      setTransactions((prev) =>
        prev.map((t) =>
          t.id === approvingTransaction.id
            ? {
                ...t,
                status: "failed",
                failure_reason: "Rejected by admin during approval",
                updated_at: new Date().toISOString(),
              }
            : t
        )
      );

      setMessage({
        type: "success",
        text: "✅ Transaction rejected successfully",
      });
      setApprovingTransaction(null);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      console.error("[REJECT_TRANSACTION]", err.message);
      setMessage({
        type: "error",
        text: `Failed to reject transaction: ${err.message}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ========================================================================
  // DELETE TRANSACTION WITH BALANCE REVERSAL
  // ========================================================================

  const handleDeleteTransaction = async () => {
    setSubmitting(true);
    try {
      const txn = deletingTransaction;

      // Reverse balance if transaction was completed
      if (txn.status === "completed") {
        await reverseBalanceChanges(txn);
      }

      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", txn.id);

      if (error) throw error;

      setTransactions((prev) => prev.filter((t) => t.id !== txn.id));

      setMessage({
        type: "success",
        text: "✅ Transaction deleted and balance reversed",
      });
      setDeletingTransaction(null);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      console.error("[DELETE_TRANSACTION]", err.message);
      setMessage({
        type: "error",
        text: `Failed to delete transaction: ${err.message}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ========================================================================
  // SEARCH & FILTER
  // ========================================================================

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.reference_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.amount?.toString().includes(searchQuery);

    const matchesFilter = filterStatus === "all" || txn.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getAccountNumber = (accountId) => {
    const acc = accounts.find((a) => a.id === accountId);
    return acc?.account_number || "Unknown";
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    return date.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ========================================================================
  // RENDER
  // ========================================================================

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
                💳 Transaction Management
              </h1>
              <p className="text-sm text-secondary opacity-70">
                Create, edit, approve, and manage all transactions with full
                timestamp control and balance validation
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

            {/* Controls Section */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
              {/* Search */}
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary opacity-60">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search by reference, description, or amount..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic focus:ring-opacity-30 text-sm"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic focus:ring-opacity-30 text-sm bg-primary"
              >
                <option value="all">All Transactions</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="reversed">Reversed</option>
                <option value="on_hold">On Hold</option>
              </select>

              {/* Create Button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 transition-all whitespace-nowrap"
              >
                <PlusIcon /> Create Transaction
              </button>
            </div>

            {/* Transactions Table/Cards */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="bg-primary border border-secondary rounded-sm p-12 text-center">
                <p className="text-secondary opacity-70">
                  No transactions found
                </p>
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
                          From Account
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          Approved
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-secondary uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary">
                      {filteredTransactions.map((txn) => (
                        <tr
                          key={txn.id}
                          className="hover:bg-secondary hover:bg-opacity-5 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setViewingTransaction(txn)}
                              className="font-mono text-sm text-basic font-semibold hover:underline cursor-pointer"
                            >
                              {txn.reference_number}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-sm text-secondary opacity-70">
                            {getAccountNumber(txn.from_account_id)}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-basic">
                              {txn.currency} {txn.amount.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-secondary opacity-70">
                            <span className="capitalize">
                              {txn.transaction_type.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                txn.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : txn.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : txn.status === "failed"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {txn.status === "completed" && <CheckIcon />}
                              {txn.status === "failed" && <XIcon />}
                              {txn.status.charAt(0).toUpperCase() +
                                txn.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-secondary opacity-70">
                            {formatDateTime(txn.created_at)}
                          </td>
                          <td className="px-6 py-4 text-xs text-secondary opacity-70">
                            {formatDateTime(txn.approved_at)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setViewingTransaction(txn)}
                                className="p-2 hover:bg-basic hover:bg-opacity-10 rounded-sm transition-all"
                                title="View transaction details"
                              >
                                <EyeIcon />
                              </button>
                              {txn.status === "pending" && (
                                <button
                                  onClick={() => setApprovingTransaction(txn)}
                                  className="p-2 hover:bg-green-100 rounded-sm transition-all text-green-600"
                                  title="Approve transaction"
                                >
                                  <ApproveIcon />
                                </button>
                              )}
                              <button
                                onClick={() => setEditingTransaction(txn)}
                                className="p-2 hover:bg-basic hover:bg-opacity-10 rounded-sm transition-all"
                                title="Edit transaction details"
                              >
                                <EditIcon />
                              </button>
                              <button
                                onClick={() => setDeletingTransaction(txn)}
                                className="p-2 hover:bg-red-500 hover:bg-opacity-10 rounded-sm transition-all text-red-600"
                                title="Delete transaction"
                              >
                                <TrashIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-secondary">
                  {filteredTransactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="p-4 hover:bg-secondary hover:bg-opacity-5 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => setViewingTransaction(txn)}
                        >
                          <p className="font-mono font-semibold text-basic text-sm hover:underline">
                            {txn.reference_number}
                          </p>
                          <p className="text-xs text-secondary opacity-60 mt-1">
                            {txn.description || "No description"}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
                            txn.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : txn.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : txn.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {txn.status.charAt(0).toUpperCase() +
                            txn.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                        <div>
                          <p className="text-secondary opacity-60">Amount</p>
                          <p className="font-semibold text-basic">
                            {txn.currency} {txn.amount.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-secondary opacity-60">Type</p>
                          <p className="font-semibold text-secondary capitalize">
                            {txn.transaction_type.replace(/_/g, " ")}
                          </p>
                        </div>
                        <div>
                          <p className="text-secondary opacity-60">From</p>
                          <p className="font-semibold text-secondary">
                            {getAccountNumber(txn.from_account_id)}
                          </p>
                        </div>
                        <div>
                          <p className="text-secondary opacity-60">Created</p>
                          <p className="font-semibold text-secondary">
                            {new Date(txn.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-3 border-t border-secondary">
                        <button
                          onClick={() => setViewingTransaction(txn)}
                          className="flex-1 py-2 px-3 text-xs font-semibold border border-secondary text-secondary rounded-sm hover:bg-secondary hover:bg-opacity-5 transition-all flex items-center justify-center gap-1"
                        >
                          <EyeIcon /> View
                        </button>
                        {txn.status === "pending" && (
                          <button
                            onClick={() => setApprovingTransaction(txn)}
                            className="flex-1 py-2 px-3 text-xs font-semibold bg-green-100 text-green-600 rounded-sm hover:bg-green-200 transition-all flex items-center justify-center gap-1"
                          >
                            <ApproveIcon /> Approve
                          </button>
                        )}
                        <button
                          onClick={() => setEditingTransaction(txn)}
                          className="flex-1 py-2 px-3 text-xs font-semibold border border-secondary text-secondary rounded-sm hover:bg-secondary hover:bg-opacity-5 transition-all flex items-center justify-center gap-1"
                        >
                          <EditIcon /> Edit
                        </button>
                        <button
                          onClick={() => setDeletingTransaction(txn)}
                          className="flex-1 py-2 px-3 text-xs font-semibold bg-red-100 text-red-600 rounded-sm hover:bg-red-200 transition-all flex items-center justify-center gap-1"
                        >
                          <TrashIcon /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Statistics Footer */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-primary border border-secondary rounded-sm p-4 text-center">
                <p className="text-xs text-secondary opacity-60 mb-2 uppercase tracking-wider font-semibold">
                  Total Transactions
                </p>
                <p className="text-3xl font-bold text-basic">
                  {transactions.length}
                </p>
              </div>

              <div className="bg-primary border border-secondary rounded-sm p-4 text-center">
                <p className="text-xs text-secondary opacity-60 mb-2 uppercase tracking-wider font-semibold">
                  Pending Approval
                </p>
                <p className="text-3xl font-bold text-yellow-600">
                  {transactions.filter((t) => t.status === "pending").length}
                </p>
              </div>

              <div className="bg-primary border border-secondary rounded-sm p-4 text-center">
                <p className="text-xs text-secondary opacity-60 mb-2 uppercase tracking-wider font-semibold">
                  Completed
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {transactions.filter((t) => t.status === "completed").length}
                </p>
              </div>

              <div className="bg-primary border border-secondary rounded-sm p-4 text-center">
                <p className="text-xs text-secondary opacity-60 mb-2 uppercase tracking-wider font-semibold">
                  Failed
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {transactions.filter((t) => t.status === "failed").length}
                </p>
              </div>

              <div className="bg-primary border border-secondary rounded-sm p-4 text-center">
                <p className="text-xs text-secondary opacity-60 mb-2 uppercase tracking-wider font-semibold">
                  Total Amount
                </p>
                <p className="text-xl font-bold text-basic">
                  {transactions
                    .reduce((sum, t) => sum + (t.amount || 0), 0)
                    .toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <TransactionFormModal
          mode="create"
          transaction={null}
          accounts={accounts}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTransaction}
          submitting={submitting}
        />
      )}

      {viewingTransaction && (
        <TransactionDetailModal
          transaction={viewingTransaction}
          accounts={accounts}
          onClose={() => setViewingTransaction(null)}
          onEditClick={() => {
            setViewingTransaction(null);
            setEditingTransaction(viewingTransaction);
          }}
        />
      )}

      {editingTransaction && (
        <TransactionFormModal
          mode="edit"
          transaction={editingTransaction}
          accounts={accounts}
          onClose={() => setEditingTransaction(null)}
          onSubmit={handleUpdateTransaction}
          submitting={submitting}
        />
      )}

      {approvingTransaction && (
        <ApprovalModal
          transaction={approvingTransaction}
          accounts={accounts}
          onApprove={handleApproveTransaction}
          onReject={handleRejectTransaction}
          onCancel={() => setApprovingTransaction(null)}
          submitting={submitting}
        />
      )}

      {deletingTransaction && (
        <DeleteConfirmModal
          transaction={deletingTransaction}
          onConfirm={handleDeleteTransaction}
          onCancel={() => setDeletingTransaction(null)}
          submitting={submitting}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
