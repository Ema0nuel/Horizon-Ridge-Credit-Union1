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

const CardIcon = () => (
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
      d="M3 10h18M7 15h4m4 0h4M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
    />
  </svg>
);

const PlusIcon = () => (
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
      d="M12 4v16m8-8H4"
    />
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

const LockIcon = () => (
  <svg
    className="w-6 h-6"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.54L19 6.25v4.75c0 5.23-3.66 9.79-7 11-3.34-1.21-7-5.77-7-11V6.25l7-2.71z" />
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

const ZapIcon = () => (
  <svg
    className="w-6 h-6"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

const EyeIcon = () => (
  <svg
    className="w-6 h-6"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);

// ============================================================================
// FEATURE NOT AVAILABLE MODAL
// ============================================================================

const FeatureNotAvailableModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feature-modal-title"
    >
      <div className="bg-primary rounded-sm border border-secondary shadow-2xl max-w-md w-full p-6 sm:p-8">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="text-6xl">ðŸŒ</div>
        </div>

        {/* Title */}
        <h2
          id="feature-modal-title"
          className="text-2xl font-bold text-secondary text-center mb-3"
        >
          Feature Not Available
        </h2>

        {/* Message */}
        <p className="text-secondary text-center mb-2 opacity-80">
          Virtual bank cards are not yet available in your region.
        </p>

        <p className="text-secondary text-center text-sm opacity-70 mb-6">
          We're actively expanding our services. Check back soon or contact
          support for more information.
        </p>

        {/* Contact Info */}
        <div className="bg-blue-50 rounded-sm p-4 border border-blue-200 mb-6">
          <p className="text-blue-900 text-xs font-semibold mb-2">
            ðŸ“§ Contact Support:
          </p>
          <p className="text-blue-800 text-sm">
            support@summitridgecreditunion.cc
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 transition-all active:scale-95"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// VIRTUAL CARD COMPONENT
// ============================================================================

const VirtualCard = ({ account, profile, onRequestCard }) => {
  return (
    <div className="relative group">
      {/* Card Container */}
      <div className="bg-gradient-to-br from-basic via-basic to-secondary rounded-sm p-6 sm:p-8 text-primary shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-64 sm:h-72 flex flex-col justify-between overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 opacity-10 w-40 h-40">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full"
            aria-hidden="true"
          >
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="white"
              strokeWidth="1"
            />
            <circle
              cx="100"
              cy="100"
              r="60"
              fill="none"
              stroke="white"
              strokeWidth="1"
            />
            <circle
              cx="100"
              cy="100"
              r="40"
              fill="none"
              stroke="white"
              strokeWidth="1"
            />
          </svg>
        </div>

        {/* Top Section */}
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-xs opacity-70 font-semibold tracking-wider uppercase">
                Virtual Bank Card
              </p>
              <h3 className="text-lg sm:text-xl font-bold mt-1">
                {profile?.full_name || "Cardholder"}
              </h3>
            </div>
            <CardIcon />
          </div>
        </div>

        {/* Middle Section (Account Info) */}
        <div className="relative z-10 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xs opacity-70 tracking-wider uppercase mb-2">
              Account Number
            </p>
            <p className="text-lg sm:text-xl font-mono font-bold tracking-wider">
              {account?.account_number?.slice(-8).padStart(8, "*") ||
                "â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"}
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="relative z-10">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs opacity-70 tracking-wider uppercase mb-1">
                Card Status
              </p>
              <p className="font-semibold flex items-center gap-2">
                <CheckIcon />
                Active
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-70 tracking-wider uppercase mb-1">
                Expires
              </p>
              <p className="font-mono font-semibold">12/28</p>
            </div>
          </div>
        </div>
      </div>

      {/* Request Button Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100">
        <button
          onClick={onRequestCard}
          className="py-2 px-6 bg-white text-basic font-semibold rounded-sm hover:bg-opacity-90 transition-all active:scale-95 flex items-center gap-2"
        >
          <PlusIcon />
          Request Physical Card
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// EMPTY STATE COMPONENT
// ============================================================================

const EmptyState = ({ onRequestCard }) => (
  <div className="text-center py-16 bg-gray-50 rounded-sm border border-secondary border-dashed">
    <div className="text-6xl mb-4">ðŸ’³</div>
    <h3 className="text-xl font-bold text-secondary mb-2">No Cards Yet</h3>
    <p className="text-secondary opacity-70 mb-6">
      Get started with a virtual bank card
    </p>
    <button
      onClick={onRequestCard}
      className="py-2 px-6 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 transition-all active:scale-95 inline-flex items-center gap-2"
    >
      <PlusIcon />
      Request Card
    </button>
  </div>
);

// ============================================================================
// FEATURES & BENEFITS SECTION
// ============================================================================

const FeaturesSection = () => (
  <div className="mt-12 bg-primary rounded-sm border border-secondary shadow-md p-6 sm:p-8">
    <h2 className="text-2xl font-bold text-secondary mb-6">Card Features</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Feature 1 */}
      <div className="flex gap-4">
        <div className="flex-shrink-0 text-basic">
          <LockIcon />
        </div>
        <div>
          <h3 className="font-semibold text-secondary mb-1">
            Secure & Protected
          </h3>
          <p className="text-sm text-secondary opacity-70">
            Advanced encryption and fraud detection to keep your money safe
          </p>
        </div>
      </div>

      {/* Feature 2 */}
      <div className="flex gap-4">
        <div className="flex-shrink-0 text-basic">
          <ZapIcon />
        </div>
        <div>
          <h3 className="font-semibold text-secondary mb-1">
            Instant Activation
          </h3>
          <p className="text-sm text-secondary opacity-70">
            Get your virtual card immediately and start using it online
          </p>
        </div>
      </div>

      {/* Feature 3 */}
      <div className="flex gap-4">
        <div className="flex-shrink-0 text-basic">
          <EyeIcon />
        </div>
        <div>
          <h3 className="font-semibold text-secondary mb-1">Full Control</h3>
          <p className="text-sm text-secondary opacity-70">
            Manage spending limits, pause, or freeze your card anytime
          </p>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// MAIN CARDS PAGE
// ============================================================================

export function CardsPage() {
  const navigate = useNavigate();

  // Auth & User State
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [showFeatureModal, setShowFeatureModal] = useState(false);

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
        }
      } catch (err) {
        console.error("[CARDS] Load error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleRequestCard = () => {
    setShowFeatureModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!userId) return null;

  const primaryAccount = accounts && accounts.length > 0 ? accounts[0] : null;

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
            Dashboard
          </button>
          <span>/</span>
          <span className="font-semibold opacity-100">Cards</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-2">
            Virtual Bank Cards
          </h1>
          <p className="text-sm sm:text-base text-secondary opacity-70">
            Manage your digital cards and spending
          </p>
        </div>

        {/* Region Not Available Alert */}
        <div className="mb-8 p-4 sm:p-6 rounded-sm border-l-4 border-blue-500 bg-blue-50 text-blue-800">
          <div className="flex gap-3">
            <AlertIcon />
            <div>
              <p className="font-semibold mb-1">Coming Soon to Your Region</p>
              <p className="text-sm opacity-90">
                Virtual bank cards will be available in your region very soon.
                Stay tuned for updates!
              </p>
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-secondary mb-6">
            Your Cards
          </h2>

          {primaryAccount ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Primary Virtual Card */}
              <VirtualCard
                account={primaryAccount}
                profile={profile}
                onRequestCard={handleRequestCard}
              />

              {/* Card Info Panel */}
              <div className="bg-primary rounded-sm border border-secondary shadow-md p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-secondary mb-6">
                    Primary Card
                  </h3>

                  <div className="space-y-6">
                    {/* Account Info */}
                    <div>
                      <p className="text-xs text-secondary opacity-70 uppercase tracking-wider font-semibold mb-2">
                        Linked Account
                      </p>
                      <p className="text-secondary font-semibold text-base">
                        {primaryAccount.account_number}
                      </p>
                      <p className="text-xs text-secondary opacity-70 mt-1">
                        {primaryAccount.account_type === "savings"
                          ? "Savings Account"
                          : "Checking Account"}
                      </p>
                    </div>

                    {/* Currency */}
                    <div>
                      <p className="text-xs text-secondary opacity-70 uppercase tracking-wider font-semibold mb-2">
                        Currency
                      </p>
                      <p className="text-secondary font-semibold text-base">
                        {primaryAccount.currency}
                      </p>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="text-xs text-secondary opacity-70 uppercase tracking-wider font-semibold mb-2">
                        Card Status
                      </p>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800">
                        <CheckIcon />
                        <span className="text-sm font-semibold">Active</span>
                      </div>
                    </div>

                    {/* Spending Limit */}
                    <div>
                      <p className="text-xs text-secondary opacity-70 uppercase tracking-wider font-semibold mb-2">
                        Daily Spending Limit
                      </p>
                      <p className="text-secondary font-bold text-lg">
                        {primaryAccount.currency}{" "}
                        {parseFloat(
                          primaryAccount.daily_transaction_limit || 10000,
                        ).toFixed(2)}
                      </p>
                    </div>

                    {/* Request Physical Card Button */}
                    <div className="pt-4 border-t border-secondary">
                      <button
                        onClick={handleRequestCard}
                        className="w-full py-3 px-4 border border-secondary text-secondary font-semibold rounded-sm hover:bg-gray-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <PlusIcon />
                        Request Physical Card
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState onRequestCard={handleRequestCard} />
          )}
        </div>

        {/* Features Section */}
        <FeaturesSection />
      </main>

      {/* Feature Not Available Modal */}
      <FeatureNotAvailableModal
        isOpen={showFeatureModal}
        onClose={() => setShowFeatureModal(false)}
      />
    </div>
  );
}

export default CardsPage;

