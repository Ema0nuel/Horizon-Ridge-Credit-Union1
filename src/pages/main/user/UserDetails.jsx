/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../Services/supabase/supabaseClient";
import UserHeader from "../../../components/UserHeader";
import { LoadingSpinner } from "../../../components/Spinner";
import { handleSignout } from "../../../Services/supabase/authService";

// ============================================================================
// ICON COMPONENTS (SVG-based, matching Dashboard pattern)
// ============================================================================

const UserAvatarIcon = () => (
  <svg
    className="w-24 h-24"
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

const UploadIcon = () => (
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
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

const TabIcon = ({ name }) => {
  const iconMap = {
    account: (
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
          d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"
        />
      </svg>
    ),
    settings: (
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
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    risk: (
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
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    status: (
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
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };
  return iconMap[name] || null;
};

// ============================================================================
// FORM COMPONENTS
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
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

// ============================================================================
// TAB: ACCOUNT DETAILS
// ============================================================================

const AccountDetailsTab = ({
  accounts,
  loading,
  onSuspendAccount,
  onReactivateAccount,
  submitting,
  selectedAccountId,
}) => {
  const [suspendModal, setSuspendModal] = useState(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  if (loading) return <LoadingSpinner size="md" />;

  if (!accounts || accounts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary opacity-70">No accounts found</p>
      </div>
    );
  }

  const handleSuspend = async (accountId) => {
    if (!suspendReason.trim()) {
      setMessage({ type: "error", text: "Please provide a reason" });
      return;
    }

    try {
      await onSuspendAccount(accountId, suspendReason);
      setMessage({
        type: "success",
        text: "Account suspended successfully",
      });
      setSuspendModal(null);
      setSuspendReason("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.message || "Failed to suspend account",
      });
    }
  };

  const handleReactivate = async (accountId) => {
    try {
      await onReactivateAccount(accountId);
      setMessage({
        type: "success",
        text: "Account reactivated successfully",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.message || "Failed to reactivate account",
      });
    }
  };

  return (
    <div className="space-y-6">
      {message.text && (
        <div
          className={`p-4 rounded-sm border-l-4 ${
            message.type === "success"
              ? "bg-green-50 border-green-500 text-green-800"
              : "bg-red-50 border-red-500 text-red-800"
          }`}
        >
          <p className="text-sm font-semibold">{message.text}</p>
        </div>
      )}

      {accounts.map((account) => (
        <div
          key={account.id}
          className="bg-primary rounded-sm border border-secondary p-6 shadow-sm"
        >
          {/* Account Number & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pb-6 border-b border-secondary">
            <div>
              <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                Account Number
              </p>
              <p className="text-lg font-bold text-secondary font-mono mt-2">
                {account.account_number}
              </p>
            </div>
            <div>
              <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                Account Type
              </p>
              <p className="text-lg font-semibold text-secondary capitalize mt-2">
                {account.account_type}
              </p>
            </div>
          </div>

          {/* Currency & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pb-6 border-b border-secondary">
            <div>
              <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                Currency
              </p>
              <p className="text-lg font-semibold text-secondary mt-2">
                {account.currency}
              </p>
            </div>
            <div>
              <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                Status
              </p>
              <p
                className={`text-lg font-semibold capitalize mt-2 ${
                  account.status === "active"
                    ? "text-green-600"
                    : account.status === "frozen"
                    ? "text-yellow-600"
                    : account.status === "suspended"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {account.status}
              </p>
            </div>
          </div>

          {/* Balance Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pb-6 border-b border-secondary">
            <div>
              <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                Balance
              </p>
              <p className="text-xl font-bold text-basic mt-2">
                {account.currency} {parseFloat(account.balance || 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                Available Balance
              </p>
              <p className="text-xl font-bold text-basic mt-2">
                {account.currency}{" "}
                {parseFloat(
                  account.available_balance || account.balance || 0
                ).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Limits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pb-6 border-b border-secondary">
            <div>
              <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                Daily Limit
              </p>
              <p className="text-lg font-semibold text-secondary mt-2">
                {account.currency}{" "}
                {parseFloat(account.daily_transaction_limit || 0).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                Monthly Limit
              </p>
              <p className="text-lg font-semibold text-secondary mt-2">
                {account.currency}{" "}
                {parseFloat(account.monthly_transaction_limit || 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* IBAN & SWIFT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pb-6 border-b border-secondary">
            <div>
              <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                IBAN
              </p>
              <p className="text-sm font-mono text-secondary mt-2">
                {account.iban || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                SWIFT Code
              </p>
              <p className="text-sm font-mono text-secondary mt-2">
                {account.swift_code || "Not provided"}
              </p>
            </div>
          </div>

          {/* Account Control Actions */}
          <div className="flex gap-3">
            {account.status === "active" ? (
              <button
                onClick={() => setSuspendModal(account.id)}
                disabled={submitting}
                className="flex-1 py-2 px-4 bg-red-600 text-white font-semibold rounded-sm hover:bg-red-700 disabled:opacity-50 transition-all active:scale-95"
              >
                Suspend Account
              </button>
            ) : account.status === "suspended" ? (
              <button
                onClick={() => handleReactivate(account.id)}
                disabled={submitting}
                className="flex-1 py-2 px-4 bg-green-600 text-white font-semibold rounded-sm hover:bg-green-700 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <LoadingSpinner size="sm" /> Reactivating...
                  </>
                ) : (
                  "Reactivate Account"
                )}
              </button>
            ) : (
              <div className="flex-1 py-2 px-4 bg-gray-100 text-secondary text-center rounded-sm opacity-60">
                {account.status === "closed"
                  ? "Account Closed"
                  : account.status === "frozen"
                  ? "Account Frozen"
                  : "Account Status: " + account.status}
              </div>
            )}
          </div>

          {/* Suspend Modal for this Account */}
          {suspendModal === account.id && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-primary rounded-sm border border-secondary shadow-lg max-w-md w-full p-6">
                <h3 className="text-xl font-bold text-secondary mb-4">
                  Suspend Account {account.account_number}
                </h3>
                <p className="text-sm text-secondary opacity-70 mb-4">
                  Are you sure you want to suspend this account? You will not be
                  able to perform transactions until it is reactivated.
                </p>

                <textarea
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  placeholder="Reason for suspension (required)"
                  rows="3"
                  className="w-full px-4 py-3 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic focus:ring-opacity-30 font-sans bg-primary mb-4"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSuspendModal(null);
                      setSuspendReason("");
                    }}
                    className="flex-1 py-2 px-4 border border-secondary text-secondary font-semibold rounded-sm hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSuspend(account.id)}
                    disabled={submitting || !suspendReason.trim()}
                    className="flex-1 py-2 px-4 bg-red-600 text-white font-semibold rounded-sm hover:bg-red-700 disabled:opacity-50 transition-all"
                  >
                    Confirm Suspension
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// TAB: USER SETTINGS (UPDATED WITH IMAGE UPLOAD)
// ============================================================================

const UserSettingsTab = ({
  profile,
  onUpdate,
  onUploadImage,
  loading,
  submitting,
  imageUploading,
}) => {
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    email: profile?.email || "",
    phone_number: profile?.phone_number || "",
    date_of_birth: profile?.date_of_birth || "",
    nationality: profile?.nationality || "",
    address: profile?.address || "",
    city: profile?.city || "",
    postal_code: profile?.postal_code || "",
    country: profile?.country || "",
  });

  const [profileImage, setProfileImage] = useState(
    profile?.profile_image_url || null
  );
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please select a valid image file" });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image size must be less than 5MB" });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadImage = async (file) => {
    if (!file) return;

    try {
      await onUploadImage(file);
      setMessage({
        type: "success",
        text: "Profile image updated successfully",
      });
      setPreviewUrl(null);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.message || "Failed to upload image",
      });
    }
  };

  const handleDeleteImage = async () => {
    if (!profileImage) return;

    try {
      const fileName = profileImage.split("/").pop();
      await supabase.storage
        .from("profile-images")
        .remove([`${profile?.id}/${fileName}`]);

      // Update profile to remove image reference
      await supabase
        .from("user_profiles")
        .update({ profile_image_url: null })
        .eq("id", profile?.id);

      setProfileImage(null);
      setPreviewUrl(null);
      setMessage({
        type: "success",
        text: "Profile image removed successfully",
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.message || "Failed to delete image",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name) newErrors.full_name = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone_number) newErrors.phone_number = "Phone is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onUpdate(formData);
    setMessage({ type: "success", text: "Profile updated successfully" });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  if (loading) return <LoadingSpinner size="md" />;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {message.text && (
        <div
          className={`p-4 rounded-sm border-l-4 ${
            message.type === "success"
              ? "bg-green-50 border-green-500 text-green-800"
              : "bg-red-50 border-red-500 text-red-800"
          }`}
        >
          <p className="text-sm font-semibold">{message.text}</p>
        </div>
      )}

      {/* Profile Image Section */}
      <div className="bg-gradient-to-br from-basic to-secondary rounded-sm p-8 text-white shadow-md">
        <h3 className="text-lg font-semibold mb-6">Profile Picture</h3>

        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Image Display */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white bg-opacity-10 flex items-center justify-center shadow-lg">
              {previewUrl || profileImage ? (
                <img
                  src={previewUrl || profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserAvatarIcon />
              )}
            </div>
          </div>

          {/* Upload Controls */}
          <div className="flex-1 w-full sm:w-auto">
            <label className="block mb-4">
              <div className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-white rounded-sm cursor-pointer hover:bg-white hover:bg-opacity-10 transition-all">
                <UploadIcon />
                <div className="text-center">
                  <p className="font-semibold">Choose Image</p>
                  <p className="text-xs opacity-90">JPG, PNG up to 5MB</p>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                disabled={imageUploading}
                className="hidden"
              />
            </label>

            {previewUrl && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    handleUploadImage(
                      document.querySelector('input[type="file"]').files?.[0]
                    )
                  }
                  disabled={imageUploading}
                  className="flex-1 py-2 px-4 bg-white text-basic font-semibold rounded-sm hover:bg-opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {imageUploading ? (
                    <>
                      <LoadingSpinner size="sm" /> Uploading...
                    </>
                  ) : (
                    "Save Image"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewUrl(null)}
                  disabled={imageUploading}
                  className="flex-1 py-2 px-4 border-2 border-white text-white font-semibold rounded-sm hover:bg-white hover:bg-opacity-10 disabled:opacity-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            )}

            {profileImage && !previewUrl && (
              <button
                type="button"
                onClick={handleDeleteImage}
                className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-sm hover:bg-red-700 transition-all"
              >
                Remove Current Image
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Information Section */}
      <div className="border-t border-secondary pt-8">
        <h3 className="text-lg font-semibold text-secondary mb-6">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            label="Full Name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Your full name"
            required
            error={errors.full_name}
          />

          <FormField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            disabled
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            error={errors.date_of_birth}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            label="Nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            placeholder="e.g., Dutch"
            error={errors.nationality}
          />

          <FormField
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="e.g., Netherlands"
            error={errors.country}
          />
        </div>

        <div>
          <FormField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street address"
            error={errors.address}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <FormField
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            error={errors.city}
          />

          <FormField
            label="Postal Code"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            placeholder="Postal code"
            error={errors.postal_code}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto py-3 px-8 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <LoadingSpinner size="sm" /> Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </button>
    </form>
  );
};

// ============================================================================
// TAB: RISK SCORE
// ============================================================================

const RiskScoreTab = ({ profile, loading }) => {
  const riskLevel = profile?.risk_score || 0;

  const getRiskColor = (score) => {
    if (score <= 20) return "text-green-600";
    if (score <= 50) return "text-yellow-600";
    if (score <= 75) return "text-orange-600";
    return "text-red-600";
  };

  const getRiskLabel = (score) => {
    if (score <= 20) return "Low Risk";
    if (score <= 50) return "Medium Risk";
    if (score <= 75) return "High Risk";
    return "Critical Risk";
  };

  if (loading) return <LoadingSpinner size="md" />;

  return (
    <div className="space-y-6">
      {/* Risk Score Gauge */}
      <div className="bg-primary rounded-sm border border-secondary p-8 text-center shadow-sm">
        <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-4">
          Current Risk Score
        </p>

        {/* Circular Gauge */}
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="55"
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="55"
                fill="none"
                stroke={
                  riskLevel <= 20
                    ? "#10b981"
                    : riskLevel <= 50
                    ? "#f59e0b"
                    : riskLevel <= 75
                    ? "#f97316"
                    : "#ef4444"
                }
                strokeWidth="8"
                strokeDasharray={`${(riskLevel / 100) * 345.6} 345.6`}
                strokeLinecap="round"
                style={{
                  transform: "rotate(-90deg)",
                  transformOrigin: "50% 50%",
                }}
              />
            </svg>

            {/* Score in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className={`text-4xl font-bold ${getRiskColor(riskLevel)}`}>
                {riskLevel}
              </p>
              <p className="text-xs text-secondary opacity-60">out of 100</p>
            </div>
          </div>
        </div>

        <p className={`text-2xl font-bold ${getRiskColor(riskLevel)} mb-2`}>
          {getRiskLabel(riskLevel)}
        </p>
        <p className="text-sm text-secondary opacity-70">
          {riskLevel <= 20
            ? "Your account has a healthy risk profile"
            : riskLevel <= 50
            ? "Monitor your account activity"
            : riskLevel <= 75
            ? "Your account requires attention"
            : "Your account is at critical risk"}
        </p>
      </div>

      {/* Risk Flags */}
      {profile?.metadata?.risk_flags &&
        profile.metadata.risk_flags.length > 0 && (
          <div className="bg-primary rounded-sm border border-secondary p-6 shadow-sm">
            <h3 className="font-semibold text-secondary mb-4">Risk Flags</h3>
            <div className="space-y-2">
              {profile.metadata.risk_flags.map((flag, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-red-600 mt-1">⚠️</span>
                  <span className="text-secondary">{flag}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* KYC Status */}
      <div className="bg-primary rounded-sm border border-secondary p-6 shadow-sm">
        <h3 className="font-semibold text-secondary mb-4">KYC Status</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-secondary opacity-70">
              Verification Status
            </p>
            <p
              className={`text-lg font-bold capitalize ${
                profile?.kyc_status === "verified"
                  ? "text-green-600"
                  : profile?.kyc_status === "rejected"
                  ? "text-red-600"
                  : profile?.kyc_status === "suspended"
                  ? "text-orange-600"
                  : "text-yellow-600"
              }`}
            >
              {profile?.kyc_status}
            </p>
          </div>
          {profile?.kyc_verified_at && (
            <div className="text-right">
              <p className="text-sm text-secondary opacity-70">Verified At</p>
              <p className="text-sm font-semibold text-secondary">
                {new Date(profile.kyc_verified_at).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-sm border border-blue-200 p-6">
        <p className="text-sm text-blue-900">
          ℹ️ Account suspension is managed per account in the "Account Details"
          tab. Your KYC status determines eligibility for account features,
          while account status controls transaction ability.
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// TAB: ACCOUNT STATUS EDIT
// ============================================================================

const AccountStatusEditTab = ({
  profile,
  onUpdateAccount,
  loading,
  submitting,
}) => {
  const [formData, setFormData] = useState({
    metadata: profile?.metadata || {},
    feature_flags: profile?.feature_flags || {},
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  const handleMetadataChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, [key]: value },
    }));
  };

  const handleFeatureFlagChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      feature_flags: { ...prev.feature_flags, [key]: value === "true" },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onUpdateAccount({
        metadata: formData.metadata,
        feature_flags: formData.feature_flags,
      });
      setMessage({
        type: "success",
        text: "Account settings updated successfully",
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.message || "Failed to update settings",
      });
    }
  };

  if (loading) return <LoadingSpinner size="md" />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message.text && (
        <div
          className={`p-4 rounded-sm border-l-4 ${
            message.type === "success"
              ? "bg-green-50 border-green-500 text-green-800"
              : "bg-red-50 border-red-500 text-red-800"
          }`}
        >
          <p className="text-sm font-semibold">{message.text}</p>
        </div>
      )}

      {/* Metadata Section */}
      <div className="bg-primary rounded-sm border border-secondary p-6 shadow-sm">
        <h3 className="font-semibold text-secondary mb-4">Metadata</h3>

        <div className="space-y-4">
          <FormField
            label="Preferred Language"
            name="preferred_language"
            value={formData.metadata?.preferred_language || ""}
            onChange={(e) =>
              handleMetadataChange("preferred_language", e.target.value)
            }
            placeholder="e.g., en, nl, de"
          />

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80">
              Risk Flags
            </label>
            <textarea
              value={JSON.stringify(
                formData.metadata?.risk_flags || [],
                null,
                2
              )}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  handleMetadataChange("risk_flags", parsed);
                } catch {
                  // Invalid JSON, let user continue typing
                }
              }}
              placeholder='["flag1", "flag2"]'
              rows="4"
              className="w-full px-4 py-3 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic focus:ring-opacity-30 font-mono bg-primary text-xs"
            />
            <p className="text-xs text-secondary opacity-60 mt-2">
              Enter as JSON array
            </p>
          </div>
        </div>
      </div>

      {/* Feature Flags Section */}
      <div className="bg-primary rounded-sm border border-secondary p-6 shadow-sm">
        <h3 className="font-semibold text-secondary mb-4">Feature Flags</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-secondary">
              Enable Biometric
            </label>
            <select
              value={
                formData.feature_flags?.enable_biometric ? "true" : "false"
              }
              onChange={(e) =>
                handleFeatureFlagChange("enable_biometric", e.target.value)
              }
              className="px-3 py-2 border border-secondary rounded-sm bg-primary"
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-secondary">
              Enable Crypto
            </label>
            <select
              value={formData.feature_flags?.enable_crypto ? "true" : "false"}
              onChange={(e) =>
                handleFeatureFlagChange("enable_crypto", e.target.value)
              }
              className="px-3 py-2 border border-secondary rounded-sm bg-primary"
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-secondary">
              Enable 2FA
            </label>
            <select
              value={formData.feature_flags?.enable_2fa ? "true" : "false"}
              onChange={(e) =>
                handleFeatureFlagChange("enable_2fa", e.target.value)
              }
              className="px-3 py-2 border border-secondary rounded-sm bg-primary"
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto py-3 px-8 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <LoadingSpinner size="sm" /> Saving...
          </>
        ) : (
          "Save Settings"
        )}
      </button>
    </form>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function UserDetailsPage() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("account");

  // Load data on mount
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data: { session } = {} } = await supabase.auth.getSession();
        const uid = session?.user?.id;

        if (!uid) {
          navigate("/auth/login", { replace: true });
          return;
        }

        setUserId(uid);

        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", uid)
          .eq("is_deleted", false)
          .maybeSingle();

        if (profileError) {
          console.error("[USER_DETAILS] Profile error:", profileError);
          throw new Error("Failed to load profile");
        }

        const { data: accountsData, error: accountsError } = await supabase
          .from("accounts")
          .select("*")
          .eq("user_id", uid)
          .eq("is_deleted", false)
          .order("created_at", { ascending: false });

        if (accountsError) {
          console.error("[USER_DETAILS] Accounts error:", accountsError);
        }

        if (mounted) {
          setProfile(profileData);
          setAccounts(accountsData || []);
        }
      } catch (err) {
        console.error("[USER_DETAILS] Load error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleUpdateProfile = async (formData) => {
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update(formData)
        .eq("id", userId);

      if (error) throw error;

      setProfile((prev) => ({ ...prev, ...formData }));
    } catch (err) {
      console.error("[USER_DETAILS] Update error:", err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadImage = async (file) => {
    if (!file || !userId) return;

    setImageUploading(true);
    try {
      // Generate unique filename
      const ext = file.name.split(".").pop();
      const fileName = `profile-${Date.now()}.${ext}`;
      const filePath = `${userId}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(filePath, file, { upsert: false });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-images").getPublicUrl(filePath);

      // Update user profile with image URL
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({ profile_image_url: publicUrl })
        .eq("id", userId);

      if (updateError) throw updateError;

      setProfile((prev) => ({ ...prev, profile_image_url: publicUrl }));
    } catch (err) {
      console.error("[USER_DETAILS] Image upload error:", err);
      throw err;
    } finally {
      setImageUploading(false);
    }
  };

  const handleUpdateAccount = async (formData) => {
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update(formData)
        .eq("id", userId);

      if (error) throw error;

      setProfile((prev) => ({ ...prev, ...formData }));
    } catch (err) {
      console.error("[USER_DETAILS] Account update error:", err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuspendAccount = async (accountId, reason) => {
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("accounts")
        .update({
          status: "suspended",
          metadata: {
            suspended_reason: reason,
            suspended_at: new Date().toISOString(),
          },
        })
        .eq("id", accountId)
        .eq("user_id", userId);

      if (error) throw error;

      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === accountId
            ? {
                ...acc,
                status: "suspended",
                metadata: {
                  suspended_reason: reason,
                  suspended_at: new Date().toISOString(),
                },
              }
            : acc
        )
      );
    } catch (err) {
      console.error("[USER_DETAILS] Suspend error:", err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleReactivateAccount = async (accountId) => {
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("accounts")
        .update({
          status: "active",
          metadata: {
            reactivated_at: new Date().toISOString(),
          },
        })
        .eq("id", accountId)
        .eq("user_id", userId);

      if (error) throw error;

      setAccounts((prev) =>
        prev.map((acc) =>
          acc.id === accountId
            ? {
                ...acc,
                status: "active",
                metadata: {
                  reactivated_at: new Date().toISOString(),
                },
              }
            : acc
        )
      );
    } catch (err) {
      console.error("[USER_DETAILS] Reactivate error:", err);
      throw err;
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

  if (!userId || !profile) {
    navigate("/auth/login", { replace: true });
    return null;
  }

  const tabs = [
    { id: "account", label: "Account Details", icon: "account" },
    { id: "settings", label: "User Settings", icon: "settings" },
    { id: "risk", label: "Risk Score", icon: "risk" },
    { id: "status", label: "Account Status", icon: "status" },
  ];

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
            className="hover:opacity-100 font-semibold"
          >
            Dashboard
          </button>
          <span>/</span>
          <span className="font-semibold opacity-100">Account Details</span>
        </div>

        {/* Header with Avatar */}
        <div className="mb-8 flex flex-col sm:flex-row items-center sm:items-end gap-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gradient-to-br from-basic to-secondary rounded-full flex items-center justify-center text-primary overflow-hidden">
              {profile?.profile_image_url ? (
                <img
                  src={profile.profile_image_url}
                  alt={profile.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserAvatarIcon />
              )}
            </div>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl font-bold text-secondary">
              {profile?.full_name}
            </h1>
            <p className="text-sm text-secondary opacity-70 mt-1">
              {profile?.email}
            </p>
            <p className="text-xs text-secondary opacity-60 mt-1">
              ID: {userId?.substring(0, 8)}...
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-secondary">
          <div className="flex flex-wrap gap-2 sm:gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 sm:px-6 border-b-2 transition-all font-semibold text-sm ${
                  activeTab === tab.id
                    ? "border-basic text-basic"
                    : "border-transparent text-secondary opacity-70 hover:opacity-100"
                }`}
              >
                <TabIcon name={tab.icon} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-primary rounded-sm border border-secondary p-6 sm:p-8 shadow-md">
          {activeTab === "account" && (
            <AccountDetailsTab
              accounts={accounts}
              loading={loading}
              onSuspendAccount={handleSuspendAccount}
              onReactivateAccount={handleReactivateAccount}
              submitting={submitting}
            />
          )}

          {activeTab === "settings" && (
            <UserSettingsTab
              profile={profile}
              onUpdate={handleUpdateProfile}
              onUploadImage={handleUploadImage}
              loading={loading}
              submitting={submitting}
              imageUploading={imageUploading}
            />
          )}

          {activeTab === "risk" && (
            <RiskScoreTab profile={profile} loading={loading} />
          )}

          {activeTab === "status" && (
            <AccountStatusEditTab
              profile={profile}
              onUpdateAccount={handleUpdateAccount}
              loading={loading}
              submitting={submitting}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default UserDetailsPage;
