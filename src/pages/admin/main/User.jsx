import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../Services/supabase/supabaseClient";
import { isAdminAuthenticated } from "../auth/adminAuth";
import { sendEmailAPI } from "../../../Services/api";
import Header from "../../../components/admin/Header";
import SideBar from "../../../components/admin/SideBar";
import { LoadingSpinner } from "../../../components/Spinner";

// ============================================================================
// SVG ICONS (Inline, No Dependencies)
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

const UserPlusIcon = () => (
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
      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
    />
  </svg>
);

const ArrowRightIcon = () => (
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
      d="M9 5l7 7-7 7"
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

// ============================================================================
// USER FORM MODAL (Create/Edit)
// ============================================================================

const UserFormModal = ({ mode, user, onClose, onSubmit, submitting }) => {
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone_number: user?.phone_number || "",
    date_of_birth: user?.date_of_birth || "",
    nationality: user?.nationality || "",
    address: user?.address || "",
    city: user?.city || "",
    postal_code: user?.postal_code || "",
    country: user?.country || "",
    is_active: user?.is_active !== false ? "true" : "false",
    kyc_status: user?.kyc_status || "pending",
  });

  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name) newErrors.full_name = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone_number) newErrors.phone_number = "Phone is required";
    if (mode === "create" && !password)
      newErrors.password = "Password is required";
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
      is_active: formData.is_active === "true",
      password: mode === "create" ? password : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-sm border border-secondary shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary">
            {mode === "create" ? "Create New User" : "Edit User"}
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
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                disabled={mode === "edit"}
                required
                error={errors.email}
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
                error={errors.date_of_birth}
              />
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-4 opacity-80">
              Address
            </h3>
            <div className="space-y-4">
              <FormField
                label="Address"
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

          {/* Password (Create Only) */}
          {mode === "create" && (
            <div>
              <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-4 opacity-80">
                Credentials
              </h3>
              <FormField
                label="Temporary Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: "" }));
                }}
                placeholder="Enter password (min 8 characters)"
                required
                error={errors.password}
              />
              <p className="text-xs text-secondary opacity-60 mt-2">
                Password will be sent to user's email along with account number.
              </p>
            </div>
          )}

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
              ) : mode === "create" ? (
                <>
                  <UserPlusIcon /> Create User
                </>
              ) : (
                <>
                  <EditIcon /> Save Changes
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
// DELETE CONFIRMATION MODAL
// ============================================================================

const DeleteConfirmModal = ({ user, onConfirm, onCancel, submitting }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-sm border border-secondary shadow-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-secondary mb-4">
          ðŸ—‘ï¸ Delete User
        </h3>
        <p className="text-secondary opacity-70 mb-6">
          Are you sure you want to permanently delete{" "}
          <span className="font-semibold">{user?.full_name}</span> and all their
          accounts? This action cannot be undone.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-sm p-4 mb-6">
          <p className="text-sm text-red-800">
            âš ï¸ This will soft-delete the user profile and all associated
            accounts from the system.
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
                <TrashIcon /> Delete User
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN USERS PAGE COMPONENT
// ============================================================================

const UsersPage = () => {
  const navigate = useNavigate();

  // Auth & UI State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  // Data State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState("all"); // all, active, suspended

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

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
  // FETCH USERS
  // ============================================================================

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("is_deleted", false)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setUsers(data || []);
      } catch (err) {
        console.error("[ADMIN_USERS] Fetch error:", err);
        setMessage({ type: "error", text: "Failed to load users" });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAuthenticated]);

  // ============================================================================
  // CREATE USER
  // ============================================================================

  const handleCreateUser = async (formData) => {
    setSubmitting(true);
    try {
      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
          },
        },
      });

      if (authError) throw new Error(authError.message);

      const userId = authData.user?.id;
      if (!userId) throw new Error("Failed to create auth user");

      // Step 2: Create user profile
      const { error: profileError } = await supabase
        .from("user_profiles")
        .insert({
          id: userId,
          email: formData.email,
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
          metadata: {},
          feature_flags: {},
        });

      if (profileError) throw new Error(profileError.message);

      // Step 3: Create default account
      const accountNumber = Math.floor(
        Math.random() * 9000000000 + 1000000000,
      ).toString();

      const { error: accountError } = await supabase.from("accounts").insert({
        user_id: userId,
        account_number: accountNumber,
        account_type: "checking",
        currency: "USD",
        status: "active",
        balance: 0.0,
        available_balance: 0.0,
        metadata: {},
        feature_flags: {},
        settings: {},
      });

      if (accountError) throw new Error(accountError.message);

      // Step 4: Send welcome email (non-blocking)
      try {
        await sendWelcomeEmail(
          formData.email,
          formData.full_name,
          accountNumber,
          formData.password,
        );
      } catch (emailErr) {
        console.warn(
          "[ADMIN_USERS] Email send failed (non-critical):",
          emailErr,
        );
      }

      // Update local state
      setUsers((prev) => [
        {
          id: userId,
          email: formData.email,
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
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: null,
          is_deleted: false,
        },
        ...prev,
      ]);

      setMessage({
        type: "success",
        text: `âœ… User created! Account #: ${accountNumber}`,
      });
      setShowCreateModal(false);
      setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    } catch (err) {
      console.error("[ADMIN_USERS] Create error:", err);
      setMessage({
        type: "error",
        text: err?.message || "Failed to create user",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================================
  // UPDATE USER (Quick edit from modal only)
  // ============================================================================

  const handleUpdateUser = async (formData) => {
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({
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
        })
        .eq("id", editingUser.id);

      if (error) throw error;

      // Update local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
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
              }
            : u,
        ),
      );

      setMessage({ type: "success", text: "âœ… User updated successfully" });
      setEditingUser(null);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      console.error("[ADMIN_USERS] Update error:", err);
      setMessage({
        type: "error",
        text: err?.message || "Failed to update user",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================================
  // DELETE USER
  // ============================================================================

  const handleDeleteUser = async () => {
    setSubmitting(true);
    try {
      // Soft-delete using RPC function
      const { error: rpcError } = await supabase.rpc("soft_delete_user", {
        p_user_id: deletingUser.id,
        p_reason: "Deleted by admin",
        p_admin_id: null,
      });

      // Fallback: manual soft-delete if RPC not available
      if (rpcError) {
        const { error: manualError } = await supabase
          .from("user_profiles")
          .update({
            is_deleted: true,
            deleted_at: new Date().toISOString(),
            deleted_reason: "Deleted by admin",
            is_active: false,
          })
          .eq("id", deletingUser.id);

        if (manualError) throw manualError;

        // Also soft-delete all accounts
        await supabase
          .from("accounts")
          .update({
            is_deleted: true,
            deleted_at: new Date().toISOString(),
            deleted_reason: "User deleted",
            status: "closed",
          })
          .eq("user_id", deletingUser.id);
      }

      // Update local state
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));

      setMessage({
        type: "success",
        text: "âœ… User deleted successfully",
      });
      setDeletingUser(null);
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      console.error("[ADMIN_USERS] Delete error:", err);
      setMessage({
        type: "error",
        text: err?.message || "Failed to delete user",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================================
  // SEARCH & FILTER
  // ============================================================================

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && user.is_active) ||
      (filterActive === "suspended" && !user.is_active);

    return matchesSearch && matchesFilter;
  });

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
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-secondary mb-2">
                User Management
              </h1>
              <p className="text-sm text-secondary opacity-70">
                Click any user to view & edit their complete profile, accounts,
                and balances
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
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic focus:ring-opacity-30 text-sm"
                />
              </div>

              {/* Filter */}
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value)}
                className="px-4 py-3 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic focus:ring-opacity-30 text-sm bg-primary"
              >
                <option value="all">All Users</option>
                <option value="active">Active Only</option>
                <option value="suspended">Suspended Only</option>
              </select>

              {/* Create Button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 transition-all active:scale-95 whitespace-nowrap"
              >
                <PlusIcon />
                <span>Create User</span>
              </button>
            </div>

            {/* Users Table/Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="bg-primary border border-secondary rounded-sm p-12 text-center">
                <p className="text-secondary opacity-70">No users found</p>
              </div>
            ) : (
              <div className="bg-primary border border-secondary rounded-sm shadow-md overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary bg-opacity-5 border-b border-secondary">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          KYC
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-secondary uppercase tracking-wider">
                          Quick Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary">
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-secondary hover:bg-opacity-5 transition-colors cursor-pointer group"
                          onClick={() => navigate(`/admin/user/${user.id}`)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-basic group-hover:opacity-80 transition-all">
                                {user.full_name}
                              </span>
                              <ArrowRightIcon className="opacity-0 group-hover:opacity-100 transition-opacity text-basic" />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-secondary opacity-70">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-secondary opacity-70">
                            {user.phone_number || "-"}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                user.is_active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {user.is_active ? <CheckIcon /> : <XIcon />}
                              {user.is_active ? "Active" : "Suspended"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded capitalize ${
                                user.kyc_status === "verified"
                                  ? "bg-green-100 text-green-800"
                                  : user.kyc_status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {user.kyc_status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-secondary opacity-70">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div
                              className="flex items-center justify-end gap-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => setEditingUser(user)}
                                className="p-2 hover:bg-basic hover:bg-opacity-10 rounded-sm transition-all"
                                title="Quick edit"
                              >
                                <EditIcon />
                              </button>
                              <button
                                onClick={() => setDeletingUser(user)}
                                className="p-2 hover:bg-red-500 hover:bg-opacity-10 rounded-sm transition-all text-red-600"
                                title="Delete user"
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
                  {filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => navigate(`/admin/user/${user.id}`)}
                      className="w-full p-4 hover:bg-secondary hover:bg-opacity-5 transition-colors text-left active:scale-95"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-basic text-sm">
                              {user.full_name}
                            </p>
                            <ArrowRightIcon className="w-4 h-4 text-basic opacity-60" />
                          </div>
                          <p className="text-xs text-secondary opacity-60 mt-1">
                            {user.email}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                            user.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.is_active ? <CheckIcon /> : <XIcon />}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                        <div>
                          <p className="text-secondary opacity-60">Phone</p>
                          <p className="font-semibold text-secondary text-sm">
                            {user.phone_number || "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-secondary opacity-60">KYC</p>
                          <p
                            className={`font-semibold capitalize text-sm ${
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

                      <div className="flex gap-2 pt-3 border-t border-secondary">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingUser(user);
                          }}
                          className="flex-1 py-2 px-3 text-xs font-semibold border border-secondary text-secondary rounded-sm hover:bg-secondary hover:bg-opacity-5 transition-all flex items-center justify-center gap-1"
                        >
                          <EditIcon /> Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingUser(user);
                          }}
                          className="flex-1 py-2 px-3 text-xs font-semibold bg-red-100 text-red-600 rounded-sm hover:bg-red-200 transition-all flex items-center justify-center gap-1"
                        >
                          <TrashIcon /> Delete
                        </button>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Footer */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-primary border border-secondary rounded-sm p-4 text-center">
                <p className="text-sm text-secondary opacity-60 mb-1">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-basic">{users.length}</p>
              </div>
              <div className="bg-primary border border-secondary rounded-sm p-4 text-center">
                <p className="text-sm text-secondary opacity-60 mb-1">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter((u) => u.is_active).length}
                </p>
              </div>
              <div className="bg-primary border border-secondary rounded-sm p-4 text-center">
                <p className="text-sm text-secondary opacity-60 mb-1">
                  Suspended
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {users.filter((u) => !u.is_active).length}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <UserFormModal
          mode="create"
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateUser}
          submitting={submitting}
        />
      )}

      {editingUser && (
        <UserFormModal
          mode="edit"
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={handleUpdateUser}
          submitting={submitting}
        />
      )}

      {deletingUser && (
        <DeleteConfirmModal
          user={deletingUser}
          onConfirm={handleDeleteUser}
          onCancel={() => setDeletingUser(null)}
          submitting={submitting}
        />
      )}
    </div>
  );
};

// ============================================================================
// EMAIL HELPER FUNCTION
// ============================================================================

async function sendWelcomeEmail(email, fullName, accountNumber, password) {
  try {
    const subject =
      "Welcome to Summit Ridge Credit Union â€“ Your Account Details";
    const html = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="UTF-8" /></head>
        <body style="font-family: 'Montserrat', sans-serif; color: #1b1b1b; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #1b1b1b; border-radius: 3px;">
            <div style="background: #1b1b1b; color: #fff; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">Welcome to Summit Ridge Credit Union</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your Banking Partner</p>
            </div>
            <div style="padding: 30px;">
              <p>Hello <strong>${fullName}</strong>,</p>
              <p>Your account has been successfully created by an administrator. Here are your credentials:</p>
              <div style="background: #f9f9f9; border-left: 4px solid #1b9466; padding: 20px; margin: 20px 0; border-radius: 3px;">
                <p><strong>ðŸ” Account Number:</strong></p>
                <code style="font-family: monospace; background: #fff; padding: 8px; border-radius: 2px; display: inline-block; margin-bottom: 15px;">${accountNumber}</code>
                <p style="margin-top: 15px;"><strong>ðŸ”‘ Temporary Password:</strong></p>
                <code style="font-family: monospace; background: #fff; padding: 8px; border-radius: 2px; display: inline-block;">${password}</code>
                <p style="font-size: 12px; color: #666; margin-top: 15px;">âš ï¸ Please change your password immediately after your first login.</p>
              </div>
              <p><strong>Next Steps:</strong></p>
              <ol style="color: #666; font-size: 14px;">
                <li>Log in with your account number and temporary password</li>
                <li>Change your password to something secure</li>
                <li>Update your profile and security settings</li>
              </ol>
              <p>If you have any questions, please contact our support team.</p>
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
              <p style="font-size: 12px; color: #999; margin: 0;">
                Best regards,<br/>
                <strong>Summit Ridge Credit Union Admin Team</strong><br/>
                Â© ${new Date().getFullYear()} Summit Ridge Credit Union Bank. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendEmailAPI({ to: email, subject, html });
    console.log("[EMAIL] Welcome email sent to:", email);
  } catch (err) {
    console.error("[EMAIL] Failed to send welcome email:", err.message);
    throw err;
  }
}

export default UsersPage;

