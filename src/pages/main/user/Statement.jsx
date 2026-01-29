import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../Services/supabase/supabaseClient";
import { LoadingSpinner } from "../../../components/Spinner";
import UserHeader from "../../../components/UserHeader";
import { handleSignout } from "../../../Services/supabase/authService";

// Filter & Sort Icons
const FilterIcon = () => (
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
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
);

const SortIcon = () => (
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
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
);

const DownloadIcon = () => (
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

const ChevronDownIcon = () => (
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
      d="M19 14l-7 7m0 0l-7-7m7 7V3"
    />
  </svg>
);

// Transaction Status Badge
const StatusBadge = ({ status }) => {
  const statusConfig = {
    completed: {
      bg: "bg-green-100",
      text: "text-green-800",
      label: "Completed",
    },
    pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
    failed: { bg: "bg-red-100", text: "text-red-800", label: "Failed" },
    reversed: { bg: "bg-blue-100", text: "text-blue-800", label: "Reversed" },
    on_hold: { bg: "bg-orange-100", text: "text-orange-800", label: "On Hold" },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};

// Transaction Type Badge
const TransactionTypeBadge = ({ type }) => {
  const typeConfig = {
    transfer: { icon: "💸", label: "Transfer" },
    deposit: { icon: "📥", label: "Deposit" },
    withdrawal: { icon: "📤", label: "Withdrawal" },
    fee: { icon: "💰", label: "Fee" },
  };

  const config = typeConfig[type] || typeConfig.transfer;

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{config.icon}</span>
      <span className="text-sm font-semibold text-secondary">
        {config.label}
      </span>
    </div>
  );
};

// Filter Panel
const FilterPanel = ({
  isOpen,
  filters,
  onFilterChange,
  onReset,
  accounts,
  transactionTypes,
  statuses,
}) => {
  if (!isOpen) return null;

  return (
    <div className="mb-6 p-4 sm:p-6 bg-gray-50 rounded-sm border border-secondary">
      <h3 className="text-lg font-semibold text-secondary mb-4">Filters</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Account Filter */}
        <div>
          <label className="block text-xs font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80">
            Account
          </label>
          <select
            value={filters.accountId}
            onChange={(e) => onFilterChange("accountId", e.target.value)}
            className="w-full px-3 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic text-sm"
          >
            <option value="">All Accounts</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.account_number}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-xs font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80">
            Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange("type", e.target.value)}
            className="w-full px-3 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic text-sm"
          >
            <option value="">All Types</option>
            {transactionTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-xs font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="w-full px-3 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic text-sm"
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Range */}
        <div>
          <label className="block text-xs font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80">
            Min Amount
          </label>
          <input
            type="number"
            value={filters.minAmount}
            onChange={(e) => onFilterChange("minAmount", e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic text-sm"
          />
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80">
            From Date
          </label>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => onFilterChange("fromDate", e.target.value)}
            className="w-full px-3 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-secondary mb-2 uppercase tracking-wider opacity-80">
            To Date
          </label>
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => onFilterChange("toDate", e.target.value)}
            className="w-full px-3 py-2 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic text-sm"
          />
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="w-full py-2 px-4 border border-secondary text-secondary font-semibold rounded-sm hover:bg-gray-100 transition-all text-sm"
      >
        Reset Filters
      </button>
    </div>
  );
};

// Transaction Details Modal
const TransactionDetailsModal = ({
  isOpen,
  transaction,
  account,
  profile,
  onClose,
}) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-sm border border-secondary shadow-2xl max-w-lg w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="bg-basic text-primary p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">Transaction Details</h2>
            <p className="text-sm opacity-90 mt-1">
              {transaction.reference_number}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-primary hover:opacity-70 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Status */}
          <div className="flex justify-between items-center pb-4 border-b border-secondary">
            <span className="text-secondary opacity-70 font-medium">
              Status
            </span>
            <StatusBadge status={transaction.status} />
          </div>

          {/* Amount */}
          <div className="bg-blue-50 rounded-sm p-4 border border-blue-200">
            <p className="text-blue-700 text-xs font-semibold uppercase tracking-wider mb-1">
              Amount
            </p>
            <p className="text-3xl font-bold text-basic">
              {transaction.currency} {parseFloat(transaction.amount).toFixed(2)}
            </p>
          </div>

          {/* Type & Date */}
          <div className="grid grid-cols-2 gap-4 text-sm border-b border-secondary pb-4">
            <div>
              <p className="text-secondary opacity-70 font-medium mb-1">Type</p>
              <p className="font-semibold text-secondary capitalize">
                {transaction.transaction_type}
              </p>
            </div>
            <div>
              <p className="text-secondary opacity-70 font-medium mb-1">Date</p>
              <p className="font-semibold text-secondary">
                {new Date(transaction.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* From Account */}
          <div className="text-sm border-b border-secondary pb-4">
            <p className="text-secondary opacity-70 font-medium mb-1 uppercase tracking-wider text-xs">
              From
            </p>
            <p className="font-semibold text-secondary">
              {account?.account_number}
            </p>
            <p className="text-xs text-secondary opacity-70 mt-1">
              {profile?.full_name}
            </p>
          </div>

          {/* To Account/Recipient */}
          {transaction.to_account_id ? (
            <div className="text-sm border-b border-secondary pb-4">
              <p className="text-secondary opacity-70 font-medium mb-1 uppercase tracking-wider text-xs">
                To Account
              </p>
              <p className="font-semibold text-secondary font-mono">
                {transaction.to_account_id}
              </p>
            </div>
          ) : (
            <>
              {transaction.external_recipient_name && (
                <div className="text-sm border-b border-secondary pb-4">
                  <p className="text-secondary opacity-70 font-medium mb-1 uppercase tracking-wider text-xs">
                    Recipient
                  </p>
                  <p className="font-semibold text-secondary">
                    {transaction.external_recipient_name}
                  </p>
                </div>
              )}
              {transaction.external_recipient_iban && (
                <div className="text-sm border-b border-secondary pb-4">
                  <p className="text-secondary opacity-70 font-medium mb-1 uppercase tracking-wider text-xs">
                    Recipient IBAN
                  </p>
                  <p className="font-semibold text-secondary font-mono">
                    {transaction.external_recipient_iban}
                  </p>
                </div>
              )}
            </>
          )}

          {/* Description */}
          {transaction.description && (
            <div className="text-sm border-b border-secondary pb-4">
              <p className="text-secondary opacity-70 font-medium mb-1 uppercase tracking-wider text-xs">
                Description
              </p>
              <p className="text-secondary">{transaction.description}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="text-xs text-secondary opacity-70 space-y-1">
            <div className="flex justify-between">
              <span>Created:</span>
              <span>{new Date(transaction.created_at).toLocaleString()}</span>
            </div>
            {transaction.completed_at && (
              <div className="flex justify-between">
                <span>Completed:</span>
                <span>
                  {new Date(transaction.completed_at).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-secondary text-center">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 transition-all text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
export function StatementPage() {
  const navigate = useNavigate();

  // Auth & User State
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [showFilters, setShowFilters] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Filter & Sort State
  const [filters, setFilters] = useState({
    accountId: "",
    type: "",
    status: "",
    minAmount: "",
    fromDate: "",
    toDate: "",
  });

  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });

  // Pagination
  const [pageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch user data on mount
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const id = session?.user?.id || null;
        setUserId(id);

        if (id) {
          // Fetch profile
          const { data: profileData } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", id)
            .eq("is_deleted", false)
            .maybeSingle();

          // Fetch accounts
          const { data: accountsData } = await supabase
            .from("accounts")
            .select("*")
            .eq("user_id", id)
            .eq("is_deleted", false)
            .order("created_at", { ascending: false });

          // Fetch transactions
          const { data: transactionsData } = await supabase
            .from("transactions")
            .select("*")
            .in(
              "from_account_id",
              (accountsData || []).map((a) => a.id)
            )
            .order("created_at", { ascending: false });

          if (mounted) {
            setProfile(profileData);
            setAccounts(accountsData || []);
            setTransactions(transactionsData || []);
          }
        } else {
          navigate("/auth/login", { replace: true });
        }
      } catch (err) {
        console.error("[STATEMENT] load error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  // Filter transactions based on filter state
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (filters.accountId) {
      result = result.filter((t) => t.from_account_id === filters.accountId);
    }

    if (filters.type) {
      result = result.filter((t) => t.transaction_type === filters.type);
    }

    if (filters.status) {
      result = result.filter((t) => t.status === filters.status);
    }

    if (filters.minAmount) {
      const minAmount = parseFloat(filters.minAmount);
      result = result.filter((t) => parseFloat(t.amount) >= minAmount);
    }

    if (filters.fromDate) {
      const fromDate = new Date(filters.fromDate);
      result = result.filter((t) => new Date(t.created_at) >= fromDate);
    }

    if (filters.toDate) {
      const toDate = new Date(filters.toDate);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter((t) => new Date(t.created_at) <= toDate);
    }

    return result;
  }, [transactions, filters]);

  // Sort transactions
  const sortedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

    return sorted;
  }, [filteredTransactions, sortConfig]);

  // Paginate transactions
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedTransactions.slice(startIndex, startIndex + pageSize);
  }, [sortedTransactions, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedTransactions.length / pageSize);

  // Handlers
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      accountId: "",
      type: "",
      status: "",
      minAmount: "",
      fromDate: "",
      toDate: "",
    });
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    const fromAccount = accounts.find(
      (a) => a.id === transaction.from_account_id
    );
    setSelectedAccount(fromAccount);
    setShowDetailsModal(true);
  };

  const handleExportCSV = () => {
    const headers = [
      "Date",
      "Type",
      "Status",
      "From Account",
      "To Account/Recipient",
      "Amount",
      "Currency",
      "Reference",
      "Description",
    ];

    const rows = sortedTransactions.map((t) => [
      new Date(t.created_at).toLocaleString(),
      t.transaction_type,
      t.status,
      accounts.find((a) => a.id === t.from_account_id)?.account_number || "",
      t.external_recipient_name || t.to_account_id || "",
      parseFloat(t.amount).toFixed(2),
      t.currency,
      t.reference_number,
      t.description || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) =>
            typeof cell === "string" && cell.includes(",") ? `"${cell}"` : cell
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `statements-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!userId) {
    navigate("/auth/login", { replace: true });
    return null;
  }

  const transactionTypes = [
    ...new Set(transactions.map((t) => t.transaction_type)),
  ];
  const statuses = [...new Set(transactions.map((t) => t.status))];

  const totalAmount = sortedTransactions.reduce(
    (sum, t) => sum + parseFloat(t.amount || 0),
    0
  );
  const completedCount = sortedTransactions.filter(
    (t) => t.status === "completed"
  ).length;
  const pendingCount = sortedTransactions.filter(
    (t) => t.status === "pending"
  ).length;

  return (
    <div className="min-h-screen bg-primary">
      <UserHeader
        handleSignOut={() => handleSignout(navigate)}
        profile={profile}
      />

      <main className="container mx-auto max-w-7xl px-4 py-6 sm:py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-secondary opacity-70">
          <button
            onClick={() => navigate("/dashboard")}
            className="hover:opacity-100"
          >
            Dashboard
          </button>
          <span>/</span>
          <span className="opacity-100 font-semibold">Statements</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-2">
            Transaction Statements
          </h1>
          <p className="text-secondary opacity-75">
            View and manage your complete transaction history
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-primary rounded-sm border border-secondary p-4 sm:p-6 text-center">
            <p className="text-xs sm:text-sm text-secondary opacity-70 mb-2 uppercase tracking-wider font-semibold">
              Total Transactions
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-basic">
              {sortedTransactions.length}
            </p>
          </div>

          <div className="bg-primary rounded-sm border border-secondary p-4 sm:p-6 text-center">
            <p className="text-xs sm:text-sm text-secondary opacity-70 mb-2 uppercase tracking-wider font-semibold">
              Total Amount
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-basic">
              {transactions[0]?.currency || "USD"} {totalAmount.toFixed(2)}
            </p>
          </div>

          <div className="bg-primary rounded-sm border border-green-200 bg-green-50 p-4 sm:p-6 text-center">
            <p className="text-xs sm:text-sm text-green-700 mb-2 uppercase tracking-wider font-semibold">
              Completed
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">
              {completedCount}
            </p>
          </div>

          <div className="bg-primary rounded-sm border border-yellow-200 bg-yellow-50 p-4 sm:p-6 text-center">
            <p className="text-xs sm:text-sm text-yellow-700 mb-2 uppercase tracking-wider font-semibold">
              Pending
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
              {pendingCount}
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 py-2 px-4 border border-secondary text-secondary font-semibold rounded-sm hover:bg-gray-50 transition-all active:scale-95 text-sm"
          >
            <FilterIcon />
            {showFilters ? "Hide" : "Show"} Filters
          </button>

          <button
            onClick={handleExportCSV}
            disabled={sortedTransactions.length === 0}
            className="flex items-center justify-center gap-2 py-2 px-4 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <DownloadIcon />
            Export CSV
          </button>

          <div className="ml-auto flex items-center gap-2 text-sm text-secondary opacity-70">
            <span>
              {sortedTransactions.length === 0
                ? "No transactions"
                : `${(currentPage - 1) * pageSize + 1}–${Math.min(
                    currentPage * pageSize,
                    sortedTransactions.length
                  )} of ${sortedTransactions.length}`}
            </span>
          </div>
        </div>

        {/* Filter Panel */}
        <FilterPanel
          isOpen={showFilters}
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          accounts={accounts}
          transactionTypes={transactionTypes}
          statuses={statuses}
        />

        {/* Transactions Table - Desktop */}
        {sortedTransactions.length > 0 ? (
          <div className="hidden md:block rounded-sm border border-secondary overflow-hidden shadow-md">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-secondary">
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-secondary opacity-70 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("created_at")}
                  >
                    <div className="flex items-center gap-2">
                      Date & Time
                      {sortConfig.key === "created_at" && (
                        <span className="text-basic">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-secondary opacity-70 uppercase tracking-wider">
                    Type
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-secondary opacity-70 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      {sortConfig.key === "status" && (
                        <span className="text-basic">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-secondary opacity-70 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-secondary opacity-70 uppercase tracking-wider">
                    To/Recipient
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-semibold text-secondary opacity-70 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("amount")}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Amount
                      {sortConfig.key === "amount" && (
                        <span className="text-basic">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-secondary opacity-70 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((transaction) => {
                  const fromAccount = accounts.find(
                    (a) => a.id === transaction.from_account_id
                  );
                  return (
                    <tr
                      key={transaction.id}
                      className="border-b border-secondary hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4 text-sm text-secondary font-medium">
                        {new Date(transaction.created_at).toLocaleDateString()}{" "}
                        <span className="opacity-70 text-xs">
                          {new Date(transaction.created_at).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <TransactionTypeBadge
                          type={transaction.transaction_type}
                        />
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <StatusBadge status={transaction.status} />
                      </td>
                      <td className="px-4 py-4 text-sm text-secondary font-mono">
                        {fromAccount?.account_number || "N/A"}
                      </td>
                      <td className="px-4 py-4 text-sm text-secondary truncate">
                        {transaction.external_recipient_name ||
                          transaction.external_recipient_iban ||
                          "Internal"}
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-right text-basic">
                        {transaction.currency}{" "}
                        {parseFloat(transaction.amount).toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleViewDetails(transaction)}
                          className="text-basic hover:opacity-70 font-semibold text-sm"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-sm border border-secondary">
            <p className="text-lg text-secondary opacity-70 mb-2">
              No transactions found
            </p>
            <p className="text-sm text-secondary opacity-50">
              Try adjusting your filters or check back later
            </p>
          </div>
        )}

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {paginatedTransactions.length > 0 ? (
            paginatedTransactions.map((transaction) => {
              const fromAccount = accounts.find(
                (a) => a.id === transaction.from_account_id
              );
              return (
                <div
                  key={transaction.id}
                  className="bg-primary rounded-sm border border-secondary p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Header Row */}
                  <div className="flex justify-between items-start mb-3 pb-3 border-b border-secondary">
                    <div>
                      <p className="text-xs text-secondary opacity-70 uppercase tracking-wider font-semibold mb-1">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-secondary opacity-50">
                        {new Date(transaction.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <StatusBadge status={transaction.status} />
                  </div>

                  {/* Type & Amount */}
                  <div className="flex justify-between items-center mb-3">
                    <TransactionTypeBadge type={transaction.transaction_type} />
                    <div className="text-right">
                      <p className="text-xs text-secondary opacity-70 uppercase tracking-wider font-semibold mb-1">
                        Amount
                      </p>
                      <p className="text-lg font-bold text-basic">
                        {transaction.currency}{" "}
                        {parseFloat(transaction.amount).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Accounts */}
                  <div className="text-sm text-secondary opacity-70 mb-3 space-y-1">
                    <p>
                      <strong className="text-secondary opacity-100">
                        From:
                      </strong>{" "}
                      {fromAccount?.account_number || "N/A"}
                    </p>
                    <p>
                      <strong className="text-secondary opacity-100">
                        To:
                      </strong>{" "}
                      {transaction.external_recipient_name ||
                        transaction.external_recipient_iban ||
                        "Internal"}
                    </p>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleViewDetails(transaction)}
                    className="w-full py-2 px-3 text-sm border border-secondary text-secondary font-semibold rounded-sm hover:bg-gray-50 transition-all active:scale-95"
                  >
                    View Details
                  </button>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-secondary opacity-70">
              No transactions found
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="py-2 px-4 border border-secondary text-secondary font-semibold rounded-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
            >
              Previous
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(
                  Math.max(0, currentPage - 2),
                  Math.min(totalPages, currentPage + 1)
                )
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`py-2 px-3 rounded-sm font-semibold text-sm transition-all ${
                      currentPage === page
                        ? "bg-basic text-primary"
                        : "border border-secondary text-secondary hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="py-2 px-4 border border-secondary text-secondary font-semibold rounded-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        isOpen={showDetailsModal}
        transaction={selectedTransaction}
        account={selectedAccount}
        profile={profile}
        onClose={() => setShowDetailsModal(false)}
      />
    </div>
  );
}

export default StatementPage;
