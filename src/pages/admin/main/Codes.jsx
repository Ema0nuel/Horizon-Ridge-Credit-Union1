/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
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

const CopyIcon = () => (
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
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const DownloadIcon = () => (
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
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
);

const ChevronLeftIcon = () => (
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

const ChevronRightIcon = () => (
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

const SparklesIcon = () => (
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
      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const InfoIcon = () => (
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
);

// ============================================================================
// CODE TYPE CONFIGURATION
// ============================================================================

const CODE_TYPES = {
  transfer_otp: {
    label: "Transfer OTP",
    digits: 5,
    validityHours: 0.5,
    color: "blue",
    description: "5-digit transfer verification code",
    icon: "📱",
  },
  "2fa_otp": {
    label: "2FA OTP",
    digits: 6,
    validityHours: 0.5,
    color: "purple",
    description: "6-digit two-factor authentication code",
    icon: "🔐",
  },
  kyc_verification: {
    label: "KYC Verification",
    digits: 8,
    validityHours: 72,
    color: "green",
    description: "8-digit KYC verification code",
    icon: "✅",
  },
  cot: {
    label: "Certificate of Transfer (COT)",
    digits: 4,
    validityHours: 720,
    color: "orange",
    description: "4-digit COT code",
    icon: "📄",
  },
  imf: {
    label: "International Monetary Fund (IMF)",
    digits: 4,
    validityHours: 720,
    color: "indigo",
    description: "4-digit IMF code",
    icon: "🌍",
  },
  vat: {
    label: "Value Added Tax (VAT)",
    digits: 4,
    validityHours: 720,
    color: "red",
    description: "4-digit VAT code",
    icon: "💰",
  },
};

// ============================================================================
// GENERATE CODES MODAL
// ============================================================================

const GenerateCodesModal = ({
  isOpen,
  codeType,
  onClose,
  onGenerate,
  isSubmitting,
}) => {
  const [quantity, setQuantity] = useState(10);
  const [error, setError] = useState("");

  const config = CODE_TYPES[codeType];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (quantity < 1) {
      setError("Quantity must be at least 1");
      return;
    }
    if (quantity > 1000) {
      setError("Quantity cannot exceed 1000");
      return;
    }

    try {
      await onGenerate(codeType, quantity);
      setQuantity(10);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isOpen || !config) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-primary rounded-sm border border-secondary shadow-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-secondary">
            {config.icon} Generate {config.label}
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

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex gap-2">
            <InfoIcon className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold">{config.label}</p>
              <p className="opacity-80 mt-1">
                {config.digits}-digit code • Valid for {config.validityHours}{" "}
                hour{config.validityHours !== 1 ? "s" : ""}
              </p>
              <p className="opacity-70 text-xs mt-2">{config.description}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={quantity}
              onChange={(e) => {
                setQuantity(
                  Math.max(1, Math.min(1000, parseInt(e.target.value) || 0))
                );
                if (error) setError("");
              }}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 transition-all text-sm ${
                error
                  ? "border-red-500 focus:ring-red-500 focus:ring-opacity-50"
                  : "border-secondary focus:ring-basic focus:ring-opacity-30"
              } ${
                isSubmitting
                  ? "bg-gray-100 opacity-50 cursor-not-allowed"
                  : "bg-primary"
              }`}
            />
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
            <p className="text-xs text-secondary opacity-60 mt-1">
              Generate up to 1000 codes at once
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 border border-secondary text-secondary font-semibold rounded-sm hover:bg-secondary hover:bg-opacity-5 disabled:opacity-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" /> Generating...
                </>
              ) : (
                <>
                  <PlusIcon /> Generate
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
// MESSAGE TOAST
// ============================================================================

const MessageToast = ({ message }) => {
  if (!message || !message.text) return null;

  const bgColors = {
    success: "bg-green-100 border-green-300",
    error: "bg-red-100 border-red-300",
    info: "bg-blue-100 border-blue-300",
  };

  const textColors = {
    success: "text-green-800",
    error: "text-red-800",
    info: "text-blue-800",
  };

  return (
    <div
      className={`fixed top-4 right-4 border rounded-sm p-4 ${
        bgColors[message.type]
      } ${textColors[message.type]} shadow-lg z-40 max-w-sm`}
      role="alert"
    >
      <p className="text-sm font-semibold">{message.text}</p>
    </div>
  );
};

// ============================================================================
// PAGINATION COMPONENT
// ============================================================================

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  perPage,
  onPerPageChange,
  totalItems,
  displayedItems,
}) => {
  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-secondary bg-opacity-5 border-t border-secondary">
      {/* Items Per Page */}
      <div className="flex items-center gap-2">
        <label htmlFor="perPage" className="text-sm text-secondary opacity-70">
          Show per page:
        </label>
        <select
          id="perPage"
          value={perPage}
          onChange={(e) => {
            onPerPageChange(parseInt(e.target.value));
            onPageChange(1); // Reset to page 1
          }}
          className="px-3 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic focus:ring-opacity-30 text-sm bg-primary"
        >
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      {/* Item Counter */}
      <div className="text-sm text-secondary opacity-70">
        Showing <span className="font-semibold">{startItem}</span> to{" "}
        <span className="font-semibold">{endItem}</span> of{" "}
        <span className="font-semibold">{totalItems}</span> codes
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-secondary rounded-sm hover:bg-secondary hover:bg-opacity-5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Previous page"
        >
          <ChevronLeftIcon />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
            const pageNum =
              totalPages <= 5 ? i + 1 : Math.max(1, currentPage - 2) + i;

            if (pageNum > totalPages) return null;

            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-2 rounded-sm text-sm font-semibold transition-all ${
                  currentPage === pageNum
                    ? "bg-basic text-primary"
                    : "border border-secondary text-secondary hover:bg-secondary hover:bg-opacity-5"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="text-secondary opacity-50">...</span>
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-3 py-2 rounded-sm text-sm font-semibold border border-secondary text-secondary hover:bg-secondary hover:bg-opacity-5 transition-all"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-secondary rounded-sm hover:bg-secondary hover:bg-opacity-5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Next page"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN CODES PAGE
// ============================================================================

const CodesPage = () => {
  const navigate = useNavigate();

  // Auth & UI State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  // Data State
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCodeType, setSelectedCodeType] = useState("all");
  const [usageFilter, setUsageFilter] = useState("all");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  // Modal State
  const [generatingCodeType, setGeneratingCodeType] = useState(null);

  // Message State
  const [message, setMessage] = useState({ type: "", text: "" });

  // UI State for Copy
  const [copiedCodeId, setCopiedCodeId] = useState(null);

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
  // FETCH CODES
  // ============================================================================

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCodes = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("codes")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setCodes(data || []);
        setCurrentPage(1); // Reset to page 1 on data refresh
      } catch (err) {
        console.error("[ADMIN_CODES] Fetch error:", err.message);
        setMessage({
          type: "error",
          text: `Failed to load codes: ${err.message}`,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCodes();
  }, [isAuthenticated]);

  // ============================================================================
  // GENERATE CODES
  // ============================================================================

  const handleGenerateCodes = async (codeType, quantity) => {
    setSubmitting(true);
    try {
      const config = CODE_TYPES[codeType];
      const maxNumber = Math.pow(10, config.digits) - 1;

      const existingCodes = new Set(
        codes.filter((c) => c.code_type === codeType).map((c) => c.code)
      );

      const newCodes = [];
      const expiresAt = new Date(
        Date.now() + config.validityHours * 60 * 60 * 1000
      ).toISOString();

      for (let i = 0; i < quantity; i++) {
        let code;
        let attempts = 0;
        const maxAttempts = 100;

        do {
          const random = Math.floor(Math.random() * (maxNumber + 1));
          code = String(random).padStart(config.digits, "0");
          attempts++;
        } while (existingCodes.has(code) && attempts < maxAttempts);

        if (attempts < maxAttempts) {
          newCodes.push({
            code_type: codeType,
            code,
            expires_at: expiresAt,
            is_used: false,
            metadata: {},
          });
          existingCodes.add(code);
        }
      }

      if (newCodes.length === 0) {
        throw new Error(
          "Failed to generate unique codes. Try a smaller quantity."
        );
      }

      const { error: insertErr } = await supabase
        .from("codes")
        .insert(newCodes);

      if (insertErr) throw insertErr;

      setCodes((prev) => [...newCodes, ...prev]);
      setCurrentPage(1); // Reset to page 1 after generation

      setMessage({
        type: "success",
        text: `✅ Generated ${newCodes.length} ${config.label} codes`,
      });
      setGeneratingCodeType(null);
      setTimeout(() => setMessage({ type: "", text: "" }), 4000);
    } catch (err) {
      console.error("[ADMIN_CODES] Generation error:", err.message);
      setMessage({
        type: "error",
        text: err.message || "Failed to generate codes",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================================
  // EXPORT CODES AS CSV
  // ============================================================================

  const handleExportCodes = (codesArray) => {
    try {
      const headers = [
        "Code Type",
        "Code",
        "Email",
        "Phone",
        "Is Used",
        "Used At",
        "Expires At",
        "Created At",
      ];

      const rows = codesArray.map((c) => [
        c.code_type,
        c.code,
        c.email || "",
        c.phone || "",
        c.is_used ? "Yes" : "No",
        c.used_at || "",
        c.expires_at || "",
        c.created_at || "",
      ]);

      const csv = [headers, ...rows]
        .map((row) =>
          row
            .map((cell) => {
              const str = String(cell);
              if (str.includes(",") || str.includes('"')) {
                return `"${str.replace(/"/g, '""')}"`;
              }
              return str;
            })
            .join(",")
        )
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `codes-export-${new Date().toISOString().slice(0, 10)}.csv`
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMessage({
        type: "success",
        text: `✅ Exported ${codesArray.length} codes`,
      });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      console.error("[ADMIN_CODES] Export error:", err.message);
      setMessage({
        type: "error",
        text: "Failed to export codes",
      });
    }
  };

  // ============================================================================
  // COPY TO CLIPBOARD
  // ============================================================================

  const handleCopyCode = (codeId, code) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(codeId);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // ============================================================================
  // FILTER & SEARCH
  // ============================================================================

  const filteredCodes = useMemo(() => {
    return codes.filter((code) => {
      const matchesSearch =
        code.code.includes(searchQuery) ||
        code.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        code.phone?.includes(searchQuery);

      const matchesCodeType =
        selectedCodeType === "all" || code.code_type === selectedCodeType;

      const matchesUsage =
        usageFilter === "all" ||
        (usageFilter === "used" ? code.is_used : !code.is_used);

      return matchesSearch && matchesCodeType && matchesUsage;
    });
  }, [codes, searchQuery, selectedCodeType, usageFilter]);

  // ============================================================================
  // PAGINATION LOGIC
  // ============================================================================

  const totalPages = Math.ceil(filteredCodes.length / perPage);
  const startIdx = (currentPage - 1) * perPage;
  const endIdx = startIdx + perPage;
  const paginatedCodes = filteredCodes.slice(startIdx, endIdx);

  // Reset to page 1 if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // ============================================================================
  // STATISTICS
  // ============================================================================

  const stats = useMemo(() => {
    const codeTypeStats = {};
    let totalUsed = 0;
    let totalExpired = 0;
    const now = new Date();

    codes.forEach((code) => {
      if (!codeTypeStats[code.code_type]) {
        codeTypeStats[code.code_type] = {
          total: 0,
          used: 0,
          unused: 0,
          expired: 0,
        };
      }

      codeTypeStats[code.code_type].total++;
      if (code.is_used) {
        codeTypeStats[code.code_type].used++;
        totalUsed++;
      } else {
        codeTypeStats[code.code_type].unused++;
      }

      if (new Date(code.expires_at) < now) {
        codeTypeStats[code.code_type].expired++;
        totalExpired++;
      }
    });

    return {
      codeTypeStats,
      totalCodes: codes.length,
      totalUsed,
      totalUnused: codes.length - totalUsed,
      totalExpired,
    };
  }, [codes]);

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
                🔐 Codes Management
              </h1>
              <p className="text-sm text-secondary opacity-70">
                Generate and manage OTP, 2FA, KYC, COT, IMF, and VAT
                verification codes
              </p>
            </div>

            {/* Message Toast */}
            <MessageToast message={message} />

            {/* Stats Grid */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-primary border border-secondary rounded-sm p-4">
                <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-1 font-semibold">
                  Total Codes
                </p>
                <p className="text-3xl font-bold text-basic">
                  {stats.totalCodes}
                </p>
              </div>
              <div className="bg-primary border border-secondary rounded-sm p-4">
                <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-1 font-semibold">
                  Unused
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.totalUnused}
                </p>
              </div>
              <div className="bg-primary border border-secondary rounded-sm p-4">
                <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-1 font-semibold">
                  Used
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.totalUsed}
                </p>
              </div>
              <div className="bg-primary border border-secondary rounded-sm p-4">
                <p className="text-xs text-secondary opacity-60 uppercase tracking-wider mb-1 font-semibold">
                  Expired
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.totalExpired}
                </p>
              </div>
            </div>

            {/* Generate Buttons Section */}
            <div className="mb-8 bg-primary border border-secondary rounded-sm p-6">
              <h2 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-4 flex items-center gap-2 opacity-80">
                <SparklesIcon /> Generate New Codes
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {Object.entries(CODE_TYPES).map(([type, config]) => (
                  <button
                    key={type}
                    onClick={() => setGeneratingCodeType(type)}
                    className="py-3 px-4 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 transition-all active:scale-95 flex flex-col items-center gap-1 text-sm"
                  >
                    <span className="text-lg">{config.icon}</span>
                    <span className="hidden sm:inline truncate">
                      {config.label.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search & Filter Section */}
            <div className="mb-6 bg-primary border border-secondary rounded-sm p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative sm:col-span-1">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary opacity-60">
                    <SearchIcon />
                  </div>
                  <input
                    type="text"
                    placeholder="Search codes, emails, phones..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1); // Reset to page 1 on search
                    }}
                    className="w-full pl-12 pr-4 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic focus:ring-opacity-30 text-sm"
                  />
                </div>

                {/* Code Type Filter */}
                <select
                  value={selectedCodeType}
                  onChange={(e) => {
                    setSelectedCodeType(e.target.value);
                    setCurrentPage(1); // Reset to page 1 on filter
                  }}
                  className="px-4 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic focus:ring-opacity-30 text-sm bg-primary"
                >
                  <option value="all">All Code Types</option>
                  {Object.entries(CODE_TYPES).map(([type, config]) => (
                    <option key={type} value={type}>
                      {config.label}
                    </option>
                  ))}
                </select>

                {/* Usage Filter */}
                <select
                  value={usageFilter}
                  onChange={(e) => {
                    setUsageFilter(e.target.value);
                    setCurrentPage(1); // Reset to page 1 on filter
                  }}
                  className="px-4 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic focus:ring-opacity-30 text-sm bg-primary"
                >
                  <option value="all">All Status</option>
                  <option value="unused">Unused Only</option>
                  <option value="used">Used Only</option>
                </select>
              </div>

              {/* Export Button */}
              <button
                onClick={() => handleExportCodes(filteredCodes)}
                disabled={filteredCodes.length === 0}
                className="w-full sm:w-auto px-6 py-2 border border-secondary text-secondary font-semibold rounded-sm hover:bg-secondary hover:bg-opacity-5 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <DownloadIcon /> Export CSV ({filteredCodes.length})
              </button>
            </div>

            {/* Codes Table */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredCodes.length === 0 ? (
              <div className="bg-primary border border-secondary rounded-sm p-12 text-center">
                <p className="text-secondary opacity-70">No codes found</p>
              </div>
            ) : (
              <div className="bg-primary border border-secondary rounded-sm shadow-md overflow-hidden flex flex-col">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto flex-1">
                  <table className="w-full">
                    <thead className="bg-secondary bg-opacity-5 border-b border-secondary sticky top-0">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase tracking-wider">
                          Type
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
                          Expires
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
                      {paginatedCodes.map((code) => {
                        const config = CODE_TYPES[code.code_type];
                        const isExpired =
                          new Date(code.expires_at) < new Date();
                        return (
                          <tr
                            key={code.id}
                            className="hover:bg-secondary hover:bg-opacity-5 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <span className="font-mono text-sm font-semibold text-basic flex items-center gap-2">
                                {config?.icon} {code.code}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-semibold text-secondary bg-secondary bg-opacity-10 px-2 py-1 rounded">
                                {config?.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-secondary opacity-70">
                              {code.email || "—"}
                            </td>
                            <td className="px-6 py-4 text-sm text-secondary opacity-70">
                              {code.phone || "—"}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                {code.is_used ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                    <CheckIcon /> Used
                                  </span>
                                ) : isExpired ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                    Expired
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                    <CheckIcon /> Available
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-secondary opacity-70">
                              {new Date(code.expires_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-xs text-secondary opacity-70">
                              {new Date(code.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() =>
                                  handleCopyCode(code.id, code.code)
                                }
                                className={`p-2 rounded-sm transition-all ${
                                  copiedCodeId === code.id
                                    ? "bg-green-100"
                                    : "hover:bg-secondary hover:bg-opacity-10"
                                }`}
                                title="Copy code"
                              >
                                {copiedCodeId === code.id ? (
                                  <CheckIcon className="text-green-600" />
                                ) : (
                                  <CopyIcon />
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-secondary flex-1">
                  {paginatedCodes.map((code) => {
                    const config = CODE_TYPES[code.code_type];
                    const isExpired = new Date(code.expires_at) < new Date();
                    return (
                      <div
                        key={code.id}
                        className="p-4 hover:bg-secondary hover:bg-opacity-5 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-mono font-bold text-basic text-lg flex items-center gap-1">
                              {config?.icon} {code.code}
                            </p>
                            <p className="text-xs text-secondary opacity-60 mt-1">
                              {config?.label}
                            </p>
                          </div>
                          <button
                            onClick={() => handleCopyCode(code.id, code.code)}
                            className={`p-2 rounded-sm transition-all ${
                              copiedCodeId === code.id
                                ? "bg-green-100"
                                : "hover:bg-secondary hover:bg-opacity-10"
                            }`}
                          >
                            {copiedCodeId === code.id ? (
                              <CheckIcon className="text-green-600" />
                            ) : (
                              <CopyIcon />
                            )}
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                          {code.email && (
                            <div>
                              <p className="text-secondary opacity-60">Email</p>
                              <p className="font-semibold text-secondary truncate">
                                {code.email}
                              </p>
                            </div>
                          )}
                          {code.phone && (
                            <div>
                              <p className="text-secondary opacity-60">Phone</p>
                              <p className="font-semibold text-secondary">
                                {code.phone}
                              </p>
                            </div>
                          )}
                          <div>
                            <p className="text-secondary opacity-60">Expires</p>
                            <p className="font-semibold text-secondary">
                              {new Date(code.expires_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-secondary opacity-60">Status</p>
                            {code.is_used ? (
                              <p className="font-semibold text-blue-600">
                                Used
                              </p>
                            ) : isExpired ? (
                              <p className="font-semibold text-red-600">
                                Expired
                              </p>
                            ) : (
                              <p className="font-semibold text-green-600">
                                Available
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  perPage={perPage}
                  onPerPageChange={setPerPage}
                  totalItems={filteredCodes.length}
                  displayedItems={paginatedCodes.length}
                />
              </div>
            )}

            {/* Code Type Breakdown Stats */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-secondary mb-4">
                Code Type Breakdown
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(CODE_TYPES).map(([type, config]) => {
                  const stat = stats.codeTypeStats[type] || {
                    total: 0,
                    used: 0,
                    unused: 0,
                    expired: 0,
                  };
                  return (
                    <div
                      key={type}
                      className="bg-primary border border-secondary rounded-sm p-4"
                    >
                      <h3 className="text-sm font-semibold text-secondary mb-3 flex items-center gap-2">
                        <span className="text-lg">{config.icon}</span>
                        {config.label}
                      </h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-secondary opacity-70">
                            Total
                          </span>
                          <span className="font-semibold text-basic">
                            {stat.total}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary opacity-70">
                            Used
                          </span>
                          <span className="font-semibold text-blue-600">
                            {stat.used}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-secondary opacity-70">
                            Unused
                          </span>
                          <span className="font-semibold text-green-600">
                            {stat.unused}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-secondary">
                          <span className="text-secondary opacity-70">
                            Expired
                          </span>
                          <span className="font-semibold text-red-600">
                            {stat.expired}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Generate Modal */}
      {generatingCodeType && (
        <GenerateCodesModal
          isOpen={true}
          codeType={generatingCodeType}
          onClose={() => setGeneratingCodeType(null)}
          onGenerate={handleGenerateCodes}
          isSubmitting={submitting}
        />
      )}
    </div>
  );
};

export default CodesPage;
