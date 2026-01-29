import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAdminAuthenticated } from "../auth/adminAuth";
import Header from "../../../components/admin/Header";
import SideBar from "../../../components/admin/SideBar";
import { LoadingSpinner } from "../../../components/Spinner";
import { useEmailManager } from "../../../hooks/useEmailManager";

// ============================================================================
// SVG ICONS
// ============================================================================

const SendIcon = () => (
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
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-4-2m4 2l4-2"
    />
  </svg>
);

const InboxIcon = () => (
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
      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
    />
  </svg>
);

const MailIcon = () => (
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
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
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

const XIcon = () => (
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
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
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
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const UserIcon = () => (
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
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const PaperClipIcon = () => (
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
      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
    />
  </svg>
);

// ============================================================================
// COMPOSE MODAL
// ============================================================================

const ComposeModal = ({ isOpen, onClose, onSend, isLoading }) => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!to.trim() || !subject.trim() || !body.trim()) {
      setError("All fields are required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      setError("Invalid email address");
      return;
    }

    try {
      await onSend({
        to: to.trim(),
        subject: subject.trim(),
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">${body
          .trim()
          .replace(/\n/g, "<br>")}</div>`,
      });
      setTo("");
      setSubject("");
      setBody("");
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-primary rounded-sm border border-secondary shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-primary border-b border-secondary p-4 sm:p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <MailIcon className="text-basic" />
            <h2 className="text-xl sm:text-2xl font-bold text-secondary">
              Compose Email
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary hover:bg-opacity-10 rounded-sm transition-all"
            aria-label="Close"
          >
            <XIcon className="text-secondary" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-sm">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* To Field */}
          <div>
            <label className="block text-sm font-semibold text-secondary mb-2 uppercase opacity-70 tracking-wider">
              To
            </label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              disabled={isLoading}
              className="w-full px-4 py-3 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic focus:ring-opacity-30 text-sm disabled:bg-gray-100"
              required
            />
          </div>

          {/* Subject Field */}
          <div>
            <label className="block text-sm font-semibold text-secondary mb-2 uppercase opacity-70 tracking-wider">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              disabled={isLoading}
              className="w-full px-4 py-3 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic focus:ring-opacity-30 text-sm disabled:bg-gray-100"
              required
            />
          </div>

          {/* Body Field */}
          <div>
            <label className="block text-sm font-semibold text-secondary mb-2 uppercase opacity-70 tracking-wider">
              Message
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type your message here..."
              rows={8}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic focus:ring-opacity-30 text-sm disabled:bg-gray-100 resize-none"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-secondary">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 px-4 border border-secondary text-secondary font-semibold rounded-sm hover:bg-secondary hover:bg-opacity-5 disabled:opacity-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" /> Sending...
                </>
              ) : (
                <>
                  <SendIcon /> Send
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
// EMAIL DETAILS MODAL (NEW)
// ============================================================================

const EmailDetailsModal = ({
  isOpen,
  onClose,
  email,
  onMarkRead,
  onDelete,
  isLoading,
}) => {
  const [isRead, setIsRead] = React.useState(email?.status === "processed");

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "UTC",
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const handleMarkRead = async () => {
    if (email?.id && !isRead) {
      await onMarkRead(email.id);
      setIsRead(true);
    }
  };

  const handleDelete = async () => {
    if (
      email?.id &&
      window.confirm("Are you sure you want to delete this email?")
    ) {
      await onDelete(email.id);
      onClose();
    }
  };

  if (!isOpen || !email) return null;

  const hasAttachments = email.attachments && email.attachments.length > 0;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-primary rounded-sm border border-secondary shadow-lg max-w-4xl w-full my-8">
        {/* Header */}
        <div className="sticky top-0 bg-primary border-b border-secondary p-4 sm:p-6 flex justify-between items-start sm:items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold text-secondary truncate">
              {email.subject}
            </h2>
            <p className="text-xs sm:text-sm text-secondary opacity-60 mt-1">
              {email.message_id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary hover:bg-opacity-10 rounded-sm transition-all flex-shrink-0"
            aria-label="Close"
          >
            <XIcon className="text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          {/* From/To Section */}
          <div className="space-y-4 pb-4 border-b border-secondary">
            {/* From */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-2 text-secondary opacity-70 font-semibold text-sm uppercase tracking-wider flex-shrink-0">
                <UserIcon />
                From:
              </div>
              <div className="flex flex-col">
                <p className="text-sm sm:text-base font-semibold text-secondary break-all">
                  {email.from_address}
                </p>
              </div>
            </div>

            {/* To */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-2 text-secondary opacity-70 font-semibold text-sm uppercase tracking-wider flex-shrink-0">
                <UserIcon />
                To:
              </div>
              <div className="flex flex-col">
                <p className="text-sm sm:text-base font-semibold text-secondary break-all">
                  {email.to_address}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-2 text-secondary opacity-70 font-semibold text-sm uppercase tracking-wider flex-shrink-0">
                <ClockIcon />
                Date:
              </div>
              <p className="text-sm sm:text-base text-secondary">
                {formatFullDate(email.created_at)}
              </p>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2 pt-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  email.status === "processed"
                    ? "bg-green-100 text-green-700"
                    : email.status === "received"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {email.status === "processed"
                  ? "✓ Read"
                  : email.status === "received"
                  ? "Unread"
                  : "Error"}
              </span>
              {email.is_spam && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-yellow-100 text-yellow-700">
                  ⚠ Spam
                </span>
              )}
            </div>
          </div>

          {/* Email Body */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-secondary uppercase opacity-70 tracking-wider">
              Message
            </h3>
            <div className="bg-secondary bg-opacity-5 border border-secondary rounded-sm p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
              {email.html_body ? (
                <div
                  className="prose prose-sm max-w-none text-secondary"
                  dangerouslySetInnerHTML={{
                    __html: email.html_body,
                  }}
                />
              ) : email.body ? (
                <p className="text-sm text-secondary whitespace-pre-wrap break-words">
                  {email.body}
                </p>
              ) : (
                <p className="text-sm text-secondary opacity-50">
                  No message content
                </p>
              )}
            </div>
          </div>

          {/* Attachments */}
          {hasAttachments && (
            <div className="space-y-3 pb-4 border-t border-secondary pt-4">
              <h3 className="text-sm font-semibold text-secondary uppercase opacity-70 tracking-wider flex items-center gap-2">
                <PaperClipIcon /> Attachments ({email.attachments.length})
              </h3>
              <div className="space-y-2">
                {email.attachments.map((attachment, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-secondary bg-opacity-5 border border-secondary rounded-sm hover:bg-opacity-10 transition-colors"
                  >
                    <PaperClipIcon className="text-basic flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-secondary truncate">
                        {attachment.filename || `Attachment ${idx + 1}`}
                      </p>
                      {attachment.size && (
                        <p className="text-xs text-secondary opacity-60">
                          {formatFileSize(attachment.size)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="space-y-2 pb-4 border-t border-secondary pt-4">
            <h3 className="text-sm font-semibold text-secondary uppercase opacity-70 tracking-wider">
              Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-secondary opacity-60">Email ID</p>
                <p className="text-secondary font-mono break-all">
                  {email.message_id}
                </p>
              </div>
              <div>
                <p className="text-secondary opacity-60">Received At</p>
                <p className="text-secondary">
                  {new Date(email.created_at).toLocaleString()}
                </p>
              </div>
              {email.processed_at && (
                <div>
                  <p className="text-secondary opacity-60">Processed At</p>
                  <p className="text-secondary">
                    {new Date(email.processed_at).toLocaleString()}
                  </p>
                </div>
              )}
              <div>
                <p className="text-secondary opacity-60">Status</p>
                <p className="text-secondary capitalize">{email.status}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-primary border-t border-secondary p-4 sm:p-6 flex gap-3 flex-wrap">
          {!isRead && (
            <button
              onClick={handleMarkRead}
              disabled={isLoading}
              className="flex-1 min-w-[120px] py-3 px-4 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <CheckIcon /> Mark as Read
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 min-w-[120px] py-3 px-4 border border-red-500 text-red-600 font-semibold rounded-sm hover:bg-red-50 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <TrashIcon /> Delete
          </button>
          <button
            onClick={onClose}
            className="flex-1 min-w-[120px] py-3 px-4 border border-secondary text-secondary font-semibold rounded-sm hover:bg-secondary hover:bg-opacity-5 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// EMAIL LIST ITEM
// ============================================================================

const EmailListItem = ({
  email,
  isReceived,
  onMarkRead,
  onDelete,
  onViewDetails,
  isLoading,
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    if (isToday) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const isUnread = isReceived && email.status === "received";

  return (
    <div
      className={`p-4 border-b border-secondary hover:bg-secondary hover:bg-opacity-5 transition-colors ${
        isUnread ? "bg-blue-50" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox/Read indicator */}
        {isReceived && (
          <button
            onClick={() => onMarkRead(email.id)}
            disabled={isLoading}
            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
              isUnread
                ? "border-basic bg-basic"
                : "border-secondary bg-transparent"
            }`}
            aria-label="Mark as read"
          >
            {!isUnread && <CheckIcon />}
          </button>
        )}

        {/* Content */}
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => onViewDetails(email)}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
            <p
              className={`text-sm sm:text-base font-semibold truncate ${
                isUnread ? "text-basic" : "text-secondary"
              }`}
            >
              {isReceived ? email.from_address : email.to}
            </p>
            <p className="text-xs text-secondary opacity-60">
              {formatDate(email.created_at)}
            </p>
          </div>

          <p
            className={`text-sm truncate ${
              isUnread
                ? "font-semibold text-secondary"
                : "text-secondary opacity-70"
            }`}
          >
            {email.subject}
          </p>

          {email.body && (
            <p className="text-xs text-secondary opacity-50 truncate mt-1">
              {email.body.substring(0, 100)}...
            </p>
          )}
        </div>

        {/* Delete Button */}
        {isReceived && (
          <button
            onClick={() => onDelete(email.id)}
            disabled={isLoading}
            className="p-2 text-secondary opacity-60 hover:opacity-100 hover:bg-red-50 hover:text-red-600 rounded-sm transition-all flex-shrink-0"
            aria-label="Delete"
          >
            <TrashIcon />
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function EmailsPage() {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [activeTab, setActiveTab] = useState("inbox");
  const [showCompose, setShowCompose] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    emails,
    sentEmails,
    loading,
    error,
    success,
    sendEmail,
    markAsRead,
    deleteEmail,
  } = useEmailManager();

  // Check authentication
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Filter emails based on search
  const filteredEmails = (activeTab === "inbox" ? emails : sentEmails).filter(
    (email) => {
      const searchLower = searchQuery.toLowerCase();
      const fromTo = activeTab === "inbox" ? email.from_address : email.to;
      return (
        fromTo.toLowerCase().includes(searchLower) ||
        email.subject.toLowerCase().includes(searchLower) ||
        (email.body && email.body.toLowerCase().includes(searchLower))
      );
    }
  );

  const handleViewDetails = (email) => {
    setSelectedEmail(email);
    setShowDetails(true);
  };

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
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
            {/* Page Header */}
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-secondary mb-2 flex items-center gap-3">
                  <MailIcon className="text-basic" /> Email Manager
                </h1>
                <p className="text-sm text-secondary opacity-70">
                  Send and manage your emails
                </p>
              </div>
              <button
                onClick={() => setShowCompose(true)}
                className="w-full sm:w-auto py-3 px-6 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <PlusIcon /> Compose
              </button>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-6 p-4 sm:p-6 bg-red-50 border-l-4 border-red-500 rounded-sm">
                <p className="text-sm text-red-800 font-semibold">Error</p>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 sm:p-6 bg-green-50 border-l-4 border-green-500 rounded-sm">
                <p className="text-sm text-green-800 font-semibold">Success</p>
                <p className="text-xs text-green-700 mt-1">{success}</p>
              </div>
            )}

            {/* Tabs */}
            <div className="mb-8 flex gap-2 border-b border-secondary">
              <button
                onClick={() => {
                  setActiveTab("inbox");
                  setSearchQuery("");
                }}
                className={`py-3 px-4 sm:px-6 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === "inbox"
                    ? "border-basic text-basic"
                    : "border-transparent text-secondary hover:text-basic"
                }`}
              >
                <InboxIcon /> Inbox
                {emails.filter((e) => e.status === "received").length > 0 && (
                  <span className="text-xs bg-basic text-primary rounded-full px-2 py-1">
                    {emails.filter((e) => e.status === "received").length}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setActiveTab("sent");
                  setSearchQuery("");
                }}
                className={`py-3 px-4 sm:px-6 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === "sent"
                    ? "border-basic text-basic"
                    : "border-transparent text-secondary hover:text-basic"
                }`}
              >
                <SendIcon /> Sent ({sentEmails.length})
              </button>
            </div>

            {/* Search */}
            <div className="mb-6 relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary opacity-60 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${
                  activeTab === "inbox" ? "inbox" : "sent"
                } emails...`}
                className="w-full pl-12 pr-4 py-3 border border-secondary rounded-sm focus:outline-none focus:ring-2 focus:ring-basic focus:ring-opacity-30 text-sm"
              />
            </div>

            {/* Email List */}
            {loading && activeTab === "inbox" ? (
              <div className="flex justify-center py-16">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredEmails.length === 0 ? (
              <div className="bg-primary border border-secondary rounded-sm p-12 text-center">
                <MailIcon className="w-12 h-12 text-secondary opacity-30 mx-auto mb-4" />
                <p className="text-secondary opacity-70">
                  {searchQuery
                    ? "No emails match your search"
                    : `No ${activeTab} emails`}
                </p>
              </div>
            ) : (
              <div className="bg-primary border border-secondary rounded-sm shadow-md overflow-hidden">
                {filteredEmails.map((email) => (
                  <EmailListItem
                    key={email.id}
                    email={email}
                    isReceived={activeTab === "inbox"}
                    onMarkRead={markAsRead}
                    onDelete={deleteEmail}
                    onViewDetails={handleViewDetails}
                    isLoading={loading}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Compose Modal */}
      <ComposeModal
        isOpen={showCompose}
        onClose={() => setShowCompose(false)}
        onSend={sendEmail}
        isLoading={loading}
      />

      {/* Email Details Modal */}
      <EmailDetailsModal
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedEmail(null);
        }}
        email={selectedEmail}
        onMarkRead={markAsRead}
        onDelete={deleteEmail}
        isLoading={loading}
      />
    </div>
  );
}
