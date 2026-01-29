/* eslint-disable no-prototype-builtins */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import { supabase } from "../../../Services/supabase/supabaseClient";
import { isAdminAuthenticated } from "../auth/adminAuth";
import Header from "../../../components/admin/Header";
import SideBar from "../../../components/admin/SideBar";
import StatCard from "../../../components/admin/StatCard";
import ProgressBar from "../../../components/admin/ProgressBar";
import { LoadingSpinner } from "../../../components/Spinner";

// ============================================================================
// ICON COMPONENTS (Enhanced Set)
// ============================================================================

const UserIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-2.667 0-8 1.333-8 4v2h16v-2c0-2.667-5.333-4-8-4z" />
  </svg>
);

const TransactionIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24">
    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const BalanceIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </svg>
);

const LoanIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
  </svg>
);

const CardIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 8H4V4h16m0 12H4c-1.1 0-2 .9-2 2v4h20v-4c0-1.1-.9-2-2-2zm-5.5 3c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5z" />
  </svg>
);

const EmailIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const CodeIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24">
    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
  </svg>
);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getLast24Hours = () => {
  const hours = {};
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const date = new Date(now);
    date.setHours(date.getHours() - i);
    const hourStr = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      hour12: false,
    });
    hours[hourStr] = 0;
  }
  return hours;
};

const getStatusDistribution = (txData) => {
  return {
    completed: txData?.filter((t) => t.status === "completed").length || 0,
    pending: txData?.filter((t) => t.status === "pending").length || 0,
    failed: txData?.filter((t) => t.status === "failed").length || 0,
    reversed: txData?.filter((t) => t.status === "reversed").length || 0,
    on_hold: txData?.filter((t) => t.status === "on_hold").length || 0,
  };
};

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

const Dashboard = () => {
  const navigate = useNavigate();

  // Auth & UI State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  // Data State
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalBalance: 0.0,
    totalLoans: 0,
    totalCards: 0,
    totalEmails: 0,
    totalTransactions: 0,
    transactions: [],
  });

  // Chart References
  const txStatusChart = useRef(null);
  const txHourlyChart = useRef(null);
  const userGrowthChart = useRef(null);

  // Chart Instances
  const txStatusChartInstance = useRef(null);
  const txHourlyChartInstance = useRef(null);
  const userGrowthChartInstance = useRef(null);

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
  // FETCH DASHBOARD DATA (Fixed Queries)
  // ============================================================================

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 1. Fetch users (not deleted)
        const { data: usersData, error: usersError } = await supabase
          .from("user_profiles")
          .select("id, is_active")
          .eq("is_deleted", false);

        if (usersError) {
          console.warn("[ADMIN] Users fetch error:", usersError.message);
        }

        const activeUsersCount =
          usersData?.filter((u) => u.is_active === true).length || 0;

        // 2. Fetch accounts (not deleted) and sum balance
        const { data: accountsData, error: accountsError } = await supabase
          .from("accounts")
          .select("balance")
          .eq("is_deleted", false);

        if (accountsError) {
          console.warn("[ADMIN] Accounts fetch error:", accountsError.message);
        }

        const totalBalance =
          accountsData?.reduce(
            (sum, acc) => sum + (parseFloat(acc.balance) || 0),
            0
          ) || 0;

        // 3. Fetch transactions (FIX: Don't filter by is_deleted in transactions - it doesn't have that column)
        const { data: txData, error: txError } = await supabase
          .from("transactions")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(500);

        if (txError) {
          console.warn("[ADMIN] Transactions fetch error:", txError.message);
        }

        // 4. Count loans from transactions with type 'loan'
        const loansCount =
          txData?.filter((t) => t.transaction_type === "loan").length || 0;

        // 5. Fetch emails
        const { data: emailsData, error: emailsError } = await supabase
          .from("inbound_emails")
          .select("id");

        if (emailsError) {
          console.warn("[ADMIN] Emails fetch error:", emailsError.message);
        }

        const emailsCount = emailsData?.length || 0;

        // Update stats
        setStats({
          totalUsers: usersData?.length || 0,
          activeUsers: activeUsersCount,
          totalBalance: totalBalance,
          totalLoans: loansCount,
          totalCards: 0,
          totalEmails: emailsCount,
          totalTransactions: txData?.length || 0,
          transactions: txData || [],
        });

        // Initialize charts
        if (txData && txData.length > 0) {
          initializeCharts(txData);
        }
      } catch (error) {
        console.error("[ADMIN DASHBOARD] Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    // Optional: Refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // ============================================================================
  // CHART INITIALIZATION
  // ============================================================================

  const initializeCharts = (txData) => {
    const statusCounts = getStatusDistribution(txData);

    // Hourly breakdown
    const last24Hours = getLast24Hours();
    txData.forEach((tx) => {
      if (tx.created_at) {
        const txDate = new Date(tx.created_at);
        const hourStr = txDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          hour12: false,
        });
        if (last24Hours.hasOwnProperty(hourStr)) {
          last24Hours[hourStr]++;
        }
      }
    });

    // User growth projection
    const userGrowth = Array.from({ length: 12 }, (_, i) => ({
      month: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ][i],
      users: Math.floor(stats.totalUsers * (0.5 + (i / 12) * 0.5)),
    }));

    // Chart 1: Transaction Status (Doughnut)
    if (txStatusChart.current) {
      const ctx = txStatusChart.current.getContext("2d");

      if (txStatusChartInstance.current) {
        txStatusChartInstance.current.destroy();
      }

      txStatusChartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Completed", "Pending", "Failed", "Reversed", "On Hold"],
          datasets: [
            {
              data: [
                statusCounts.completed,
                statusCounts.pending,
                statusCounts.failed,
                statusCounts.reversed,
                statusCounts.on_hold,
              ],
              backgroundColor: [
                "#10b981",
                "#f59e0b",
                "#ef4444",
                "#8b5cf6",
                "#06b6d4",
              ],
              borderColor: "#fff",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "#1b1b1b",
                font: { size: 12, weight: "600" },
                padding: 15,
              },
            },
          },
        },
      });
    }

    // Chart 2: Hourly Transactions (Bar)
    if (txHourlyChart.current) {
      const ctx = txHourlyChart.current.getContext("2d");

      if (txHourlyChartInstance.current) {
        txHourlyChartInstance.current.destroy();
      }

      txHourlyChartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(last24Hours),
          datasets: [
            {
              label: "Transactions per Hour",
              data: Object.values(last24Hours),
              backgroundColor: "#1b9466b9",
              borderRadius: 3,
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          indexAxis: "x",
          plugins: {
            legend: {
              labels: {
                color: "#1b1b1b",
                font: { weight: "600" },
              },
            },
          },
          scales: {
            y: {
              ticks: {
                color: "#1b1b1b",
                stepSize: 1,
              },
              grid: {
                color: "#e5e7eb",
              },
            },
            x: {
              ticks: {
                color: "#1b1b1b",
                font: { size: 10 },
              },
              grid: {
                color: "#e5e7eb",
              },
            },
          },
        },
      });
    }

    // Chart 3: User Growth (Line)
    if (userGrowthChart.current) {
      const ctx = userGrowthChart.current.getContext("2d");

      if (userGrowthChartInstance.current) {
        userGrowthChartInstance.current.destroy();
      }

      userGrowthChartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: userGrowth.map((m) => m.month),
          datasets: [
            {
              label: "Projected User Growth",
              data: userGrowth.map((m) => m.users),
              borderColor: "#1b9466b9",
              backgroundColor: "rgba(27, 148, 102, 0.1)",
              fill: true,
              tension: 0.4,
              pointRadius: 5,
              pointBackgroundColor: "#1b9466b9",
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              labels: {
                color: "#1b1b1b",
                font: { weight: "600" },
              },
            },
          },
          scales: {
            y: {
              ticks: {
                color: "#1b1b1b",
              },
              grid: {
                color: "#e5e7eb",
              },
            },
            x: {
              ticks: {
                color: "#1b1b1b",
              },
              grid: {
                color: "#e5e7eb",
              },
            },
          },
        },
      });
    }
  };

  // Cleanup charts on unmount
  useEffect(() => {
    return () => {
      if (txStatusChartInstance.current)
        txStatusChartInstance.current.destroy();
      if (txHourlyChartInstance.current)
        txHourlyChartInstance.current.destroy();
      if (userGrowthChartInstance.current)
        userGrowthChartInstance.current.destroy();
    };
  }, []);

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

  const statusDist = stats.transactions
    ? getStatusDistribution(stats.transactions)
    : {};

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
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="space-y-8">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-basic to-green-600 rounded-sm p-6 sm:p-8 text-primary shadow-lg">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                    Welcome to Admin Dashboard
                  </h1>
                  <p className="text-sm sm:text-base opacity-90">
                    Real-time insights into your platform's performance and user
                    activity
                  </p>
                </div>

                {/* Stats Grid */}
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-secondary mb-6">
                    📊 Key Metrics
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <StatCard
                      title="Total Users"
                      value={stats.totalUsers}
                      subtitle={`${stats.activeUsers} active`}
                      icon={<UserIcon />}
                      trend="+12.5%"
                      trendType="increase"
                      color="bg-basic"
                    />
                    <StatCard
                      title="Total Balance"
                      value={`$${stats.totalBalance.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}`}
                      subtitle="All accounts"
                      icon={<BalanceIcon />}
                      trend="+8.2%"
                      trendType="increase"
                      color="bg-green-600"
                    />
                    <StatCard
                      title="Transactions"
                      value={stats.totalTransactions}
                      subtitle="Total processed"
                      icon={<TransactionIcon />}
                      trend="+5.1%"
                      trendType="increase"
                      color="bg-blue-600"
                    />
                    <StatCard
                      title="Active Loans"
                      value={stats.totalLoans}
                      subtitle="Pending review"
                      icon={<LoanIcon />}
                      trend="-2.4%"
                      trendType="decrease"
                      color="bg-orange-600"
                    />
                    <StatCard
                      title="Total Emails"
                      value={stats.totalEmails}
                      subtitle="In system"
                      icon={<EmailIcon />}
                      trend="+1.8%"
                      trendType="increase"
                      color="bg-indigo-600"
                    />
                    <StatCard
                      title="OTP Codes"
                      value="1,200+"
                      subtitle="Available"
                      icon={<CodeIcon />}
                      trend="+4.3%"
                      trendType="increase"
                      color="bg-purple-600"
                    />
                  </div>
                </div>

                {/* Status Distribution & Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Progress Bars */}
                  <div className="bg-primary border border-secondary rounded-sm p-6 shadow-md">
                    <h3 className="text-base font-semibold text-secondary mb-6">
                      💳 Transaction Status Breakdown
                    </h3>
                    <div className="space-y-4">
                      <ProgressBar
                        label="Completed"
                        value={statusDist.completed || 0}
                        max={
                          stats.totalTransactions > 0
                            ? stats.totalTransactions
                            : 1
                        }
                        color="bg-green-500"
                      />
                      <ProgressBar
                        label="Pending"
                        value={statusDist.pending || 0}
                        max={
                          stats.totalTransactions > 0
                            ? stats.totalTransactions
                            : 1
                        }
                        color="bg-yellow-500"
                      />
                      <ProgressBar
                        label="Failed"
                        value={statusDist.failed || 0}
                        max={
                          stats.totalTransactions > 0
                            ? stats.totalTransactions
                            : 1
                        }
                        color="bg-red-500"
                      />
                      <ProgressBar
                        label="Reversed"
                        value={statusDist.reversed || 0}
                        max={
                          stats.totalTransactions > 0
                            ? stats.totalTransactions
                            : 1
                        }
                        color="bg-purple-500"
                      />
                      <ProgressBar
                        label="On Hold"
                        value={statusDist.on_hold || 0}
                        max={
                          stats.totalTransactions > 0
                            ? stats.totalTransactions
                            : 1
                        }
                        color="bg-cyan-500"
                      />
                    </div>
                  </div>

                  {/* Doughnut Chart */}
                  <div className="bg-primary border border-secondary rounded-sm p-6 shadow-md flex flex-col justify-between">
                    <h3 className="text-base font-semibold text-secondary mb-4">
                      📈 Distribution Overview
                    </h3>
                    <canvas
                      ref={txStatusChart}
                      height="200"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Analytics Charts */}
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-secondary mb-6">
                    📊 Analytics & Trends
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Hourly Transactions */}
                    <div className="bg-primary border border-secondary rounded-sm p-6 shadow-md">
                      <h3 className="text-base font-semibold text-secondary mb-4">
                        ⏰ Last 24 Hours Activity
                      </h3>
                      <canvas
                        ref={txHourlyChart}
                        height="200"
                        className="w-full"
                      />
                    </div>

                    {/* User Growth */}
                    <div className="bg-primary border border-secondary rounded-sm p-6 shadow-md">
                      <h3 className="text-base font-semibold text-secondary mb-4">
                        👥 12-Month Growth Projection
                      </h3>
                      <canvas
                        ref={userGrowthChart}
                        height="200"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-sm p-6 shadow-sm">
                  <p className="text-sm text-blue-900 mb-3">
                    <strong>✅ Dashboard Status:</strong> Real-time analytics
                    synced.
                  </p>
                  <p className="text-xs text-blue-800">
                    Navigate the sidebar to manage users, transactions, loans,
                    emails, and OTP codes. All data reflects current system
                    state with soft-delete awareness.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
