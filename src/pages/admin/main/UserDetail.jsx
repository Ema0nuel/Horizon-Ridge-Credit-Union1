/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../Services/supabase/supabaseClient";
import { isAdminAuthenticated } from "../auth/adminAuth";
import Header from "../../../components/admin/Header";
import SideBar from "../../../components/admin/SideBar";
import { LoadingSpinner } from "../../../components/Spinner";

// ============================================================================
// SVG ICONS
// ============================================================================

const BackIcon = () => (
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
      d="M15 19l-7-7 7-7"
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

const SaveIcon = () => (
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
      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
    />
  </svg>
);

const CancelIcon = () => (
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

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
);

const UserAvatarIcon = () => (
  <svg
    className="w-16 h-16"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
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
  readonly = false,
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
      disabled={disabled || readonly}
      readOnly={readonly}
      className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 transition-all font-sans text-sm ${
        error
          ? "border-red-500 focus:ring-red-500 focus:ring-opacity-50"
          : "border-secondary focus:ring-basic focus:ring-opacity-30"
      } ${
        disabled || readonly
          ? "bg-gray-100 opacity-50 cursor-not-allowed"
          : "bg-primary"
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
// ACCOUNT EDIT MODAL
// ============================================================================

const AccountEditModal = ({ account, onClose, onSubmit, submitting }) => {
  const [formData, setFormData] = useState({
    account_number: account?.account_number || "",
    account_type: account?.account_type || "checking",
    currency: account?.currency || "USD",
    balance: account?.balance || 0,
    available_balance: account?.available_balance || 0,
    status: account?.status || "active",
    overdraft_limit: account?.overdraft_limit || 0,
    daily_transaction_limit: account?.daily_transaction_limit || 10000,
    monthly_transaction_limit: account?.monthly_transaction_limit || 100000,
    created_at: account?.created_at
      ? new Date(account.created_at).toISOString().slice(0, 16)
      : "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("limit") || name.includes("balance")
          ? parseFloat(value) || 0
          : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.account_number)
      newErrors.account_number = "Account number is required";
    if (formData.balance < 0) newErrors.balance = "Balance cannot be negative";
    if (formData.available_balance < 0)
      newErrors.available_balance = "Available balance cannot be negative";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Convert datetime-local back to ISO string for database
    const createdAtISO = formData.created_at
      ? new Date(formData.created_at).toISOString()
      : account?.created_at;

    onSubmit({
      account_number: formData.account_number,
      account_type: formData.account_type,
      currency: formData.currency,
      balance: formData.balance,
      available_balance: formData.available_balance,
      status: formData.status,
      overdraft_limit: formData.overdraft_limit,
      daily_transaction_limit: formData.daily_transaction_limit,
      monthly_transaction_limit: formData.monthly_transaction_limit,
      created_at: createdAtISO,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-sm border border-secondary shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary">✏️ Edit Account</h2>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-secondary opacity-60 hover:opacity-100 transition-all"
          >
            <CancelIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Details */}
          <div>
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-4 opacity-80">
              Account Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Account Number"
                name="account_number"
                value={formData.account_number}
                onChange={handleChange}
                disabled={true}
                error={errors.account_number}
              />
              <SelectField
                label="Account Type"
                name="account_type"
                value={formData.account_type}
                onChange={handleChange}
                options={[
                  { value: "checking", label: "Checking" },
                  { value: "savings", label: "Savings" },
                  { value: "money_market", label: "Money Market" },
                ]}
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
              />
              <SelectField
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: "active", label: "Active" },
                  { value: "frozen", label: "Frozen" },
                  { value: "closed", label: "Closed" },
                  { value: "suspended", label: "Suspended" },
                ]}
              />
            </div>
          </div>

          {/* Account Dates */}
          <div>
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-4 opacity-80">
              📅 Account Dates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Account Created Date"
                name="created_at"
                type="datetime-local"
                value={formData.created_at}
                onChange={handleChange}
                error={errors.created_at}
              />
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80">
                  Current Value (UTC)
                </label>
                <div className="px-4 py-3 border border-secondary rounded-sm bg-gray-50 text-secondary text-sm font-mono">
                  {account?.created_at
                    ? new Date(account.created_at).toISOString()
                    : "N/A"}
                </div>
              </div>
            </div>
            <p className="text-xs text-secondary opacity-60 mt-2">
              ℹ️ Editing the "Account Created Date" allows you to correct when
              this account was created. The current UTC value is shown for
              reference.
            </p>
          </div>

          {/* Balance Information */}
          <div>
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-4 opacity-80">
              Balance
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Current Balance"
                name="balance"
                type="number"
                step="0.01"
                value={formData.balance}
                onChange={handleChange}
                placeholder="0.00"
                error={errors.balance}
              />
              <FormField
                label="Available Balance"
                name="available_balance"
                type="number"
                step="0.01"
                value={formData.available_balance}
                onChange={handleChange}
                placeholder="0.00"
                error={errors.available_balance}
              />
            </div>
          </div>

          {/* Limits */}
          <div>
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-4 opacity-80">
              Limits & Overdraft
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Overdraft Limit"
                name="overdraft_limit"
                type="number"
                step="0.01"
                value={formData.overdraft_limit}
                onChange={handleChange}
                placeholder="0.00"
              />
              <FormField
                label="Daily Transaction Limit"
                name="daily_transaction_limit"
                type="number"
                step="0.01"
                value={formData.daily_transaction_limit}
                onChange={handleChange}
                placeholder="10000.00"
              />
              <FormField
                label="Monthly Transaction Limit"
                name="monthly_transaction_limit"
                type="number"
                step="0.01"
                value={formData.monthly_transaction_limit}
                onChange={handleChange}
                placeholder="100000.00"
              />
            </div>
          </div>

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
              className="flex-1 py-3 px-4 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" /> Saving...
                </>
              ) : (
                <>
                  <SaveIcon /> Save Account
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
// CREATE ACCOUNT MODAL
// ============================================================================

const CreateAccountModal = ({ userId, onClose, onSubmit, submitting }) => {
  const [formData, setFormData] = useState({
    account_type: "checking",
    currency: "USD",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-sm border border-secondary shadow-lg max-w-md w-full p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-secondary mb-6">
          ➕ Create New Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <SelectField
            label="Account Type"
            name="account_type"
            value={formData.account_type}
            onChange={handleChange}
            options={[
              { value: "checking", label: "Checking" },
              { value: "savings", label: "Savings" },
              { value: "money_market", label: "Money Market" },
            ]}
            required
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
            required
          />

          <div className="flex gap-3 pt-4 border-t border-secondary">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-2 px-4 border border-secondary text-secondary font-semibold rounded-sm hover:bg-secondary hover:bg-opacity-5 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2 px-4 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" /> Creating...
                </>
              ) : (
                <>
                  <PlusIcon /> Create
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
// DELETE ACCOUNT MODAL
// ============================================================================

const DeleteAccountModal = ({ account, onConfirm, onCancel, submitting }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-sm border border-secondary shadow-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-secondary mb-4">
          🗑️ Delete Account
        </h3>
        <p className="text-secondary opacity-70 mb-6">
          Are you sure you want to delete account{" "}
          <span className="font-semibold">{account?.account_number}</span>? This
          action cannot be undone.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-sm p-4 mb-6">
          <p className="text-sm text-red-800">
            ⚠️ This will soft-delete the account from the system.
          </p>
        </div>

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
// EDIT USER PROFILE MODAL
// ============================================================================

const EditUserProfileModal = ({ user, onClose, onSubmit, submitting }) => {
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    phone_number: user?.phone_number || "",
    date_of_birth: user?.date_of_birth || "",
    nationality: user?.nationality || "",
    address: user?.address || "",
    city: user?.city || "",
    postal_code: user?.postal_code || "",
    country: user?.country || "",
    kyc_status: user?.kyc_status || "pending",
    is_active: user?.is_active !== false ? "true" : "false",
    created_at: user?.created_at
      ? new Date(user.created_at).toISOString().slice(0, 16)
      : "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name) newErrors.full_name = "Full name is required";
    if (!formData.phone_number) newErrors.phone_number = "Phone is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Convert datetime-local back to ISO string for database
    const createdAtISO = formData.created_at
      ? new Date(formData.created_at).toISOString()
      : user?.created_at;

    onSubmit({
      full_name: formData.full_name,
      phone_number: formData.phone_number,
      date_of_birth: formData.date_of_birth || null,
      nationality: formData.nationality || null,
      address: formData.address || null,
      city: formData.city || null,
      postal_code: formData.postal_code || null,
      country: formData.country || null,
      kyc_status: formData.kyc_status,
      is_active: formData.is_active === "true",
      created_at: createdAtISO,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-sm border border-secondary shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary">
            ✏️ Edit User Profile
          </h2>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-secondary opacity-60 hover:opacity-100 transition-all"
          >
            <CancelIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-4 opacity-80">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                error={errors.full_name}
              />
              <FormField
                label="Phone Number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="+31 6 XXXX XXXX"
                required
                error={errors.phone_number}
              />
              <FormField
                label="Date of Birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
              <FormField
                label="Nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                placeholder="Nationality"
              />
            </div>
          </div>

          {/* Account Dates */}
          <div>
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-4 opacity-80">
              📅 Account Dates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Date Joined (Created At)"
                name="created_at"
                type="datetime-local"
                value={formData.created_at}
                onChange={handleChange}
                error={errors.created_at}
              />
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80">
                  Current Value (UTC)
                </label>
                <div className="px-4 py-3 border border-secondary rounded-sm bg-gray-50 text-secondary text-sm font-mono">
                  {user?.created_at
                    ? new Date(user.created_at).toISOString()
                    : "N/A"}
                </div>
              </div>
            </div>
            <p className="text-xs text-secondary opacity-60 mt-2">
              ℹ️ Editing the "Date Joined" allows you to correct account
              creation timestamps. The current UTC value is shown for reference.
            </p>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-4 opacity-80">
              Address
            </h3>
            <div className="space-y-4">
              <FormField
                label="Street Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                />
                <FormField
                  label="Postal Code"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  placeholder="Postal code"
                />
                <FormField
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div>
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-4 opacity-80">
              Account Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField
                label="Active Status"
                name="is_active"
                value={formData.is_active}
                onChange={handleChange}
                options={[
                  { value: "true", label: "Active" },
                  { value: "false", label: "Suspended" },
                ]}
              />
              <SelectField
                label="KYC Status"
                name="kyc_status"
                value={formData.kyc_status}
                onChange={handleChange}
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "verified", label: "Verified" },
                  { value: "rejected", label: "Rejected" },
                  { value: "suspended", label: "Suspended" },
                ]}
              />
            </div>
          </div>

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
              className="flex-1 py-3 px-4 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" /> Saving...
                </>
              ) : (
                <>
                  <SaveIcon /> Save Changes
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
// MAIN USER DETAIL PAGE COMPONENT
// ============================================================================

const UserDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Auth & UI State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  // Data State
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState("profile"); // profile, accounts, activity

  // Modal State
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [deletingAccount, setDeletingAccount] = useState(null);
  const [showCreateAccount, setShowCreateAccount] = useState(false);

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
  // FETCH USER & ACCOUNTS
  // ============================================================================

  useEffect(() => {
    if (!isAuthenticated || !id) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Fetch user profile
        const { data: userData, error: userError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", id)
          .eq("is_deleted", false)
          .single();

        if (userError) throw userError;
        setUser(userData);

        // Fetch user accounts
        const { data: accountsData, error: accountsError } = await supabase
          .from("accounts")
          .select("*")
          .eq("user_id", id)
          .eq("is_deleted", false)
          .order("created_at", { ascending: false });

        if (accountsError) throw accountsError;
        setAccounts(accountsData || []);
      } catch (err) {
        console.error("[USER_DETAIL] Fetch error:", err);
        setMessage({ type: "error", text: "Failed to load user data" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, id]);

  // ============================================================================
  // UPDATE USER PROFILE
  // ============================================================================

  const handleUpdateProfile = async (formData) => {
    setSubmitting(true);
    try {
      const updateData = {
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        date_of_birth: formData.date_of_birth || null,
        nationality: formData.nationality || null,
        address: formData.address || null,
        city: formData.city || null,
        postal_code: formData.postal_code || null,
        country: formData.country || null,
        kyc_status: formData.kyc_status,
        is_active: formData.is_active,
        updated_at: new Date().toISOString(),
      };

      // Only update created_at if it was explicitly changed
      if (formData.created_at) {
        updateData.created_at = formData.created_at;
      }

      const { error } = await supabase
        .from("user_profiles")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      setUser((prev) => ({
        ...prev,
        ...formData,
        updated_at: new Date().toISOString(),
      }));

      setMessage({
        type: "success",
        text: "✅ Profile updated successfully",
      });
      setEditingProfile(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      console.error("[USER_DETAIL] Update error:", err);
      setMessage({
        type: "error",
        text: err?.message || "Failed to update profile",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================================
  // CREATE ACCOUNT
  // ============================================================================

  const handleCreateAccount = async (formData) => {
    setSubmitting(true);
    try {
      const accountNumber = Math.floor(
        Math.random() * 9000000000 + 1000000000
      ).toString();

      const { data: newAccount, error } = await supabase
        .from("accounts")
        .insert({
          user_id: id,
          account_number: accountNumber,
          account_type: formData.account_type,
          currency: formData.currency,
          status: "active",
          balance: 0.0,
          available_balance: 0.0,
          metadata: {},
          feature_flags: {},
          settings: {},
        })
        .select()
        .single();

      if (error) throw error;

      setAccounts((prev) => [newAccount, ...prev]);
      setMessage({
        type: "success",
        text: `✅ Account created! Account #: ${accountNumber}`,
      });
      setShowCreateAccount(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      console.error("[USER_DETAIL] Create account error:", err);
      setMessage({
        type: "error",
        text: err?.message || "Failed to create account",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================================
  // UPDATE ACCOUNT
  // ============================================================================

  const handleUpdateAccount = async (formData) => {
    setSubmitting(true);
    try {
      // Convert datetime-local back to ISO string for database
      const createdAtISO = formData.created_at
        ? new Date(formData.created_at).toISOString()
        : editingAccount?.created_at;

      const updateData = {
        account_type: formData.account_type,
        currency: formData.currency,
        balance: formData.balance,
        available_balance: formData.available_balance,
        status: formData.status,
        overdraft_limit: formData.overdraft_limit,
        daily_transaction_limit: formData.daily_transaction_limit,
        monthly_transaction_limit: formData.monthly_transaction_limit,
        created_at: createdAtISO, // NOW INCLUDED IN UPDATE
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("accounts")
        .update(updateData)
        .eq("id", editingAccount.id);

      if (error) throw error;

      // Update local state with new created_at
      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === editingAccount.id
            ? {
                ...acc,
                ...formData,
                created_at: createdAtISO, // Update local state
                updated_at: new Date().toISOString(),
              }
            : acc
        )
      );

      setMessage({ type: "success", text: "✅ Account updated successfully" });
      setEditingAccount(null);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      console.error("[USER_DETAIL] Update account error:", err);
      setMessage({
        type: "error",
        text: err?.message || "Failed to update account",
      });
    } finally {
      setSubmitting(false);
    }
  };
  // ============================================================================
  // DELETE ACCOUNT
  // ============================================================================

  const handleDeleteAccount = async () => {
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("accounts")
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString(),
          deleted_reason: "Deleted by admin",
          status: "closed",
        })
        .eq("id", deletingAccount.id);

      if (error) throw error;

      setAccounts((prev) =>
        prev.filter((acc) => acc.id !== deletingAccount.id)
      );
      setMessage({ type: "success", text: "✅ Account deleted successfully" });
      setDeletingAccount(null);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      console.error("[USER_DETAIL] Delete account error:", err);
      setMessage({
        type: "error",
        text: err?.message || "Failed to delete account",
      });
    } finally {
      setSubmitting(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-primary">
        <Header
          adminEmail={adminEmail}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="flex">
          <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </main>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-primary">
        <Header
          adminEmail={adminEmail}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="flex">
          <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1">
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-6">
              <button
                onClick={() => navigate("/admin/users")}
                className="flex items-center gap-2 text-basic hover:opacity-80 transition-all mb-6"
              >
                <BackIcon /> Back to Users
              </button>
              <div className="bg-red-50 border border-red-200 rounded-sm p-6 text-center">
                <p className="text-red-800 font-semibold">User not found</p>
              </div>
            </div>
          </main>
        </div>
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
            {/* Back Button */}
            <button
              onClick={() => navigate("/admin/users")}
              className="flex items-center gap-2 text-basic hover:opacity-80 transition-all mb-6"
            >
              <BackIcon /> Back to Users
            </button>

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

            {/* User Header Card */}
            <div className="bg-primary border border-secondary rounded-sm shadow-md p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-24 h-24 flex-shrink-0 text-basic opacity-30 rounded-full overflow-hidden bg-basic bg-opacity-5 flex items-center justify-center">
                  {user?.profile_image_url ? (
                    <img
                      src={user.profile_image_url}
                      alt={user.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserAvatarIcon />
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-secondary">
                    {user.full_name}
                  </h1>
                  <p className="text-secondary opacity-70 mt-1">{user.email}</p>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        user.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.is_active ? <CheckIcon /> : "🔒"}
                      {user.is_active ? "Active" : "Suspended"}
                    </span>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded capitalize ${
                        user.kyc_status === "verified"
                          ? "bg-green-100 text-green-800"
                          : user.kyc_status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      KYC: {user.kyc_status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setEditingProfile(true)}
                  className="px-4 py-2 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 transition-all flex items-center gap-2"
                >
                  <EditIcon /> Edit Profile
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-secondary">
              {["profile", "accounts"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 font-semibold text-sm uppercase tracking-wider transition-all border-b-2 ${
                    activeTab === tab
                      ? "border-basic text-basic"
                      : "border-transparent text-secondary opacity-60 hover:opacity-100"
                  }`}
                >
                  {tab === "profile" ? "👤 Profile" : "💳 Accounts"}
                </button>
              ))}
            </div>

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-primary border border-secondary rounded-sm p-6">
                  <h3 className="text-lg font-bold text-secondary mb-4">
                    📋 Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                        Full Name
                      </p>
                      <p className="text-sm font-semibold text-secondary">
                        {user.full_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                        Email
                      </p>
                      <p className="text-sm font-semibold text-secondary">
                        {user.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                        Phone
                      </p>
                      <p className="text-sm font-semibold text-secondary">
                        {user.phone_number || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                        Date of Birth
                      </p>
                      <p className="text-sm font-semibold text-secondary">
                        {user.date_of_birth
                          ? new Date(user.date_of_birth).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-primary border border-secondary rounded-sm p-6">
                  <h3 className="text-lg font-bold text-secondary mb-4">
                    🏠 Address
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                        Street Address
                      </p>
                      <p className="text-sm font-semibold text-secondary">
                        {user.address || "-"}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                          City
                        </p>
                        <p className="text-sm font-semibold text-secondary">
                          {user.city || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                          Postal Code
                        </p>
                        <p className="text-sm font-semibold text-secondary">
                          {user.postal_code || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                          Country
                        </p>
                        <p className="text-sm font-semibold text-secondary">
                          {user.country || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                          Nationality
                        </p>
                        <p className="text-sm font-semibold text-secondary">
                          {user.nationality || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div className="bg-primary border border-secondary rounded-sm p-6">
                  <h3 className="text-lg font-bold text-secondary mb-4">
                    🔐 Account Status
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                        Status
                      </p>
                      <p
                        className={`text-sm font-semibold ${
                          user.is_active ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {user.is_active ? "Active" : "Suspended"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                        KYC Status
                      </p>
                      <p
                        className={`text-sm font-semibold capitalize ${
                          user.kyc_status === "verified"
                            ? "text-green-600"
                            : user.kyc_status === "pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {user.kyc_status}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Dates */}
                <div className="bg-primary border border-secondary rounded-sm p-6">
                  <h3 className="text-lg font-bold text-secondary mb-4">
                    📅 Account Dates
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                        Date Joined
                      </p>
                      <p className="text-sm font-semibold text-secondary">
                        {new Date(user.created_at).toLocaleDateString()} at{" "}
                        {new Date(user.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                        Last Updated
                      </p>
                      <p className="text-sm font-semibold text-secondary">
                        {new Date(user.updated_at).toLocaleDateString()} at{" "}
                        {new Date(user.updated_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                        Last Login
                      </p>
                      <p className="text-sm font-semibold text-secondary">
                        {user.last_login
                          ? new Date(user.last_login).toLocaleDateString()
                          : "Never"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Accounts Tab */}
            {activeTab === "accounts" && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-secondary">
                    💳 Linked Accounts
                  </h2>
                  <button
                    onClick={() => setShowCreateAccount(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 transition-all"
                  >
                    <PlusIcon /> Create Account
                  </button>
                </div>

                {accounts.length === 0 ? (
                  <div className="bg-primary border border-secondary rounded-sm p-12 text-center">
                    <p className="text-secondary opacity-70">
                      No accounts yet. Create one to get started.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {accounts.map((account) => (
                      <div
                        key={account.id}
                        className="bg-primary border border-secondary rounded-sm p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-secondary">
                              {account.account_number}
                            </h3>
                            <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mt-1">
                              {account.account_type} • {account.currency}
                            </p>
                          </div>
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded capitalize ${
                              account.status === "active"
                                ? "bg-green-100 text-green-800"
                                : account.status === "frozen"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {account.status}
                          </span>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div>
                            <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                              Balance
                            </p>
                            <p className="text-2xl font-bold text-basic">
                              {account.currency}{" "}
                              {account.balance.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                                Available
                              </p>
                              <p className="text-sm font-semibold text-secondary">
                                {account.currency}{" "}
                                {account.available_balance.toLocaleString(
                                  "en-US",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                                Daily Limit
                              </p>
                              <p className="text-sm font-semibold text-secondary">
                                {account.currency}{" "}
                                {account.daily_transaction_limit.toLocaleString(
                                  "en-US",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-secondary">
                          <button
                            onClick={() => setEditingAccount(account)}
                            className="flex-1 py-2 px-3 bg-basic bg-opacity-10 text-basic font-semibold rounded-sm hover:bg-opacity-20 transition-all flex items-center justify-center gap-2 text-sm"
                          >
                            <EditIcon /> Edit
                          </button>
                          <button
                            onClick={() => setDeletingAccount(account)}
                            className="flex-1 py-2 px-3 bg-red-100 text-red-600 font-semibold rounded-sm hover:bg-red-200 transition-all flex items-center justify-center gap-2 text-sm"
                          >
                            <TrashIcon /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {editingProfile && (
        <EditUserProfileModal
          user={user}
          onClose={() => setEditingProfile(false)}
          onSubmit={handleUpdateProfile}
          submitting={submitting}
        />
      )}

      {editingAccount && (
        <AccountEditModal
          account={editingAccount}
          onClose={() => setEditingAccount(null)}
          onSubmit={handleUpdateAccount}
          submitting={submitting}
        />
      )}

      {deletingAccount && (
        <DeleteAccountModal
          account={deletingAccount}
          onConfirm={handleDeleteAccount}
          onCancel={() => setDeletingAccount(null)}
          submitting={submitting}
        />
      )}

      {showCreateAccount && (
        <CreateAccountModal
          userId={id}
          onClose={() => setShowCreateAccount(false)}
          onSubmit={handleCreateAccount}
          submitting={submitting}
        />
      )}
    </div>
  );
};

export default UserDetailPage;
