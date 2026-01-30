/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../../Services/supabase/supabaseClient";
import { LoadingSpinner } from "../../../components/Spinner";
import UserHeader from "../../../components/UserHeader";

// Quick Links Icon Components
const QuickLinkIcon = ({ name }) => {
  const iconMap = {
    "Send Money": (
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
          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-4-2m4 2l4-2"
        />
      </svg>
    ),
    "Add Money": (
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
          d="M12 4v16m8-8H4"
        />
      </svg>
    ),
    "Buy Airtime": (
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
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    "Bank Details": (
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
    "Bank Statement": (
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
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    "Tax Refund": (
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
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    Loan: (
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
    Cards: (
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
          d="M3 10h18M7 15h4m4 0h4M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
  };
  return iconMap[name] || null;
};

const QuickLinkCard = ({ title, route, onClick }) => (
  <Link
    to={route}
    onClick={onClick}
    className="flex flex-col items-center gap-3 p-4 sm:p-6 rounded-sm border border-secondary bg-primary hover:bg-gray-50 hover:shadow-md transition-all active:scale-95 group"
    aria-label={title}
  >
    <div className="text-basic group-hover:text-secondary transition-colors">
      <QuickLinkIcon name={title} />
    </div>
    <p className="text-xs sm:text-sm font-semibold text-secondary text-center">
      {title}
    </p>
  </Link>
);

export function DashboardPage() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch profile & accounts directly from Supabase and subscribe to changes
  useEffect(() => {
    let mounted = true;
    let channel = null;
    let authSubscription = null;

    async function loadDataForUser(id) {
      try {
        setLoading(true);
        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", id)
          .eq("is_deleted", false)
          .maybeSingle();

        if (profileError)
          console.error("[DASHBOARD] profile fetch error:", profileError);

        const { data: accountsData, error: accountsError } = await supabase
          .from("accounts")
          .select("*")
          .eq("user_id", id)
          .eq("is_deleted", false)
          .order("created_at", { ascending: false });

        if (accountsError)
          console.error("[DASHBOARD] accounts fetch error:", accountsError);

        if (!mounted) return;
        setProfile(profileData || null);
        setAccounts(accountsData || []);
      } catch (err) {
        console.error("[DASHBOARD] loadDataForUser error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    (async () => {
      try {
        const { data: { session } = {} } = await supabase.auth.getSession();
        const id = session?.user?.id || null;
        setUserId(id);

        if (id) {
          await loadDataForUser(id);

          // Subscribe using Supabase v2 realtime channel API
          channel = supabase
            .channel(`accounts:${id}`)
            .on(
              "postgres_changes",
              {
                event: "*",
                schema: "public",
                table: "accounts",
                filter: `user_id=eq.${id}`,
              },
              (payload) => {
                // Refetch or update local state based on payload
                loadDataForUser(id);
              },
            )
            .subscribe();
        } else {
          setLoading(false);
        }

        // Listen for auth changes to react to sign-in/out
        authSubscription = supabase.auth.onAuthStateChange((event, session) => {
          const newId = session?.user?.id || null;
          setUserId(newId);
          if (newId) {
            loadDataForUser(newId);
          } else {
            // cleared session
            setProfile(null);
            setAccounts([]);
          }
        });
      } catch (err) {
        console.error("[DASHBOARD] initial load error:", err);
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      try {
        if (channel) {
          // unsubscribe the realtime channel
          channel.unsubscribe?.();
          // remove channel if helper exists
          supabase.removeChannel?.(channel);
        }
        if (authSubscription?.subscription?.unsubscribe) {
          authSubscription.subscription.unsubscribe();
        } else if (authSubscription?.unsubscribe) {
          authSubscription.unsubscribe();
        }
      } catch (e) {
        // ignore
      }
    };
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("[DASHBOARD] signOut error:", error);
      }
      // clear local state and navigate to login
      setProfile(null);
      setAccounts([]);
      navigate("/auth/login", { replace: true });
    } catch (err) {
      console.error("[DASHBOARD] signOut exception:", err);
    }
  };

  // Show spinner while checking auth/data state
  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If no user/session, redirect to login
  if (!userId) {
    navigate("/auth/login", { replace: true });
    return null;
  }

  const primaryAccount = accounts && accounts.length > 0 ? accounts[0] : null;
  const quickLinks = [
    { title: "Send Money", route: "/transfer" },
    { title: "Add Money", route: "/add-money" },
    { title: "Buy Airtime", route: "/buy-airtime" },
    { title: "Bank Details", route: "/account-details" },
    { title: "Bank Statement", route: "/statements" },
    { title: "Tax Refund", route: "/tax-refund" },
    { title: "Loan", route: "/loan" },
    { title: "Cards", route: "/cards" },
  ];

  return (
    <div className="min-h-screen bg-primary">
      {/* Header - Mobile Optimized */}
      <UserHeader handleSignOut={handleSignOut} profile={profile} />

      <main className="container mx-auto max-w-6xl px-4 py-6 sm:py-8">
        {/* KYC Verification Alert */}
        {profile?.kyc_status !== "verified" && (
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-sm shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2 text-base sm:text-lg">
                  ⚠️ Complete KYC Verification
                </h3>
                <p className="text-xs sm:text-sm text-yellow-800 opacity-90">
                  To unlock full functionality including transfers and higher
                  limits, please complete your Know Your Customer (KYC)
                  verification.
                </p>
              </div>
              <Link
                to="/dashboard/kyc"
                className="mt-2 sm:mt-0 py-2 px-6 bg-yellow-600 text-white font-semibold rounded-sm text-sm hover:bg-yellow-700 transition-all whitespace-nowrap active:scale-95"
              >
                Start KYC
              </Link>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {primaryAccount && (
          <div className="mt-6 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-primary rounded-sm border border-secondary p-4 sm:p-6 text-center">
              <p className="text-xs sm:text-sm text-secondary opacity-70 mb-2">
                Total Accounts
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-basic">
                {accounts.length}
              </p>
            </div>
            <div className="bg-primary rounded-sm border border-secondary p-4 sm:p-6 text-center">
              <p className="text-xs sm:text-sm text-secondary opacity-70 mb-2">
                Balance
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-basic">
                $
                {accounts
                  .reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="bg-primary rounded-sm border border-secondary p-4 sm:p-6 text-center">
              <p className="text-xs sm:text-sm text-secondary opacity-70 mb-2">
                KYC Status
              </p>
              <p
                className={`text-base sm:text-lg font-semibold capitalize ${
                  profile?.kyc_status === "verified"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {profile?.kyc_status || "Pending"}
              </p>
            </div>
          </div>
        )}

        {/* Account Card + Quick Links Grid */}
        <div className="mt-8 sm:mt-12">
          <h2 className="text-lg sm:text-xl font-semibold text-secondary mb-6">
            Your Accounts & Quick Links
          </h2>

          {primaryAccount ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Account Card - Takes 1 Column on Mobile, 1 on Desktop */}
              <div className="lg:col-span-1 bg-primary rounded-sm border border-secondary shadow-lg hover:shadow-xl transition-shadow p-6">
                {/* Account Header */}
                <div className="mb-6 pb-6 border-b border-secondary">
                  <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                    Account Number
                  </p>
                  <p className="text-2xl font-bold text-secondary font-mono mt-2">
                    {primaryAccount.account_number}
                  </p>
                </div>

                {/* Account Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                      Type
                    </p>
                    <p className="font-semibold text-secondary capitalize mt-1 text-sm">
                      {primaryAccount.account_type === "savings"
                        ? "Savings"
                        : "Checking"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                      Currency
                    </p>
                    <p className="font-semibold text-secondary mt-1 text-sm">
                      {primaryAccount.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                      Status
                    </p>
                    <p
                      className={`${primaryAccount.status === "active" ? "text-green-600" : "text-red-500"} font-semibold mt-1 capitalize text-sm`}
                    >
                      {primaryAccount.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                      Created
                    </p>
                    <p className="font-semibold text-secondary mt-1 text-xs">
                      {new Date(primaryAccount.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Balance Display */}
                <div className="mb-6 pb-6 border-t border-secondary pt-6">
                  <p className="text-xs text-secondary opacity-60 uppercase tracking-wider">
                    Available Balance
                  </p>
                  <p className="text-3xl font-bold text-basic mt-2">
                    {primaryAccount.currency}{" "}
                    {parseFloat(
                      primaryAccount.available_balance ||
                        primaryAccount.balance ||
                        0,
                    ).toFixed(2)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <Link
                    to="/transfer"
                    className="w-full py-2 px-4 bg-basic text-primary font-semibold rounded-sm text-sm hover:bg-opacity-90 transition-all active:scale-95 text-center"
                    aria-label={`Transfer from account ${primaryAccount.account_number}`}
                  >
                    Transfer
                  </Link>
                  <Link
                    to="/account-details"
                    className="w-full py-2 px-4 border border-secondary text-secondary font-semibold rounded-sm text-sm hover:bg-gray-50 transition-all active:scale-95 text-center"
                    aria-label={`View details for account ${primaryAccount.account_number}`}
                  >
                    Details
                  </Link>
                </div>
              </div>

              {/* Quick Links Grid - Takes 2 Columns on Desktop */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {quickLinks.map((link) => (
                    <QuickLinkCard
                      key={link.title}
                      title={link.title}
                      route={link.route}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-sm border border-secondary">
              <p className="text-lg text-secondary opacity-70 mb-4">
                No accounts found
              </p>
              <p className="text-sm text-secondary opacity-50">
                Contact support to create your first account
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
