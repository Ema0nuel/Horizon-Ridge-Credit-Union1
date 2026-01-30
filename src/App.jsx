import React, { Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import TranslateWidget from "./utils/TranslateWidget";
import { LoadingSpinner } from "./components/Spinner";
import ConsoleGuard from "./utils/consoleGuard";
import ConsoleWarning from "./utils/consoleWarning";

// Portal pages (loaded immediately)
import { HomePage } from "./pages/main/portal/Home";
import { InnerPage } from "./pages/main/portal/InnerPage";
import { ContactPage } from "./pages/main/portal/Contact";

// Lazy-loaded Auth pages
const LoginPage = React.lazy(() =>
  import("./pages/main/auth/Login").then((m) => ({ default: m.LoginPage })),
);
const SignupPage = React.lazy(() =>
  import("./pages/main/auth/Signup").then((m) => ({ default: m.SignupPage })),
);
const ForgotPasswordPage = React.lazy(() =>
  import("./pages/main/auth/Forgot").then((m) => ({
    default: m.ForgotPasswordPage,
  })),
);
const ResetPasswordPage = React.lazy(() =>
  import("./pages/main/auth/Reset").then((m) => ({
    default: m.ResetPasswordPage,
  })),
);

// Lazy-loaded User pages
const DashboardPage = React.lazy(() =>
  import("./pages/main/user/Dashboard").then((m) => ({
    default: m.DashboardPage,
  })),
);
const TransferPage = React.lazy(() =>
  import("./pages/main/user/Transfer").then((m) => ({
    default: m.TransferPage,
  })),
);
const StatementPage = React.lazy(() =>
  import("./pages/main/user/Statement").then((m) => ({
    default: m.StatementPage,
  })),
);
const AddMoneyPage = React.lazy(() =>
  import("./pages/main/user/AddMoney").then((m) => ({
    default: m.AddMoneyPage,
  })),
);
const BuyAirtimePage = React.lazy(() =>
  import("./pages/main/user/BuyAirtime").then((m) => ({
    default: m.BuyAirtimePage,
  })),
);
const UserDetailsPage = React.lazy(() =>
  import("./pages/main/user/UserDetails").then((m) => ({
    default: m.UserDetailsPage,
  })),
);
const LoanPage = React.lazy(() =>
  import("./pages/main/user/Loan").then((m) => ({
    default: m.LoanPage,
  })),
);
const CardsPage = React.lazy(() =>
  import("./pages/main/user/Cards").then((m) => ({
    default: m.CardsPage,
  })),
);
const TaxRefundPage = React.lazy(() =>
  import("./pages/main/user/TaxRefund").then((m) => ({
    default: m.TaxRefundPage,
  })),
);
const KYCPage = React.lazy(() =>
  import("./pages/main/user/Kyc").then((m) => ({
    default: m.KYCPage,
  })),
);

// Lazy-loaded Admin pages
const AdminLoginPage = React.lazy(() =>
  import("./pages/admin/auth/Login").then((m) => ({
    default: m.AdminLoginPage,
  })),
);
const Dashboard = React.lazy(() => import("./pages/admin/main/Dashboard"));
const UsersPage = React.lazy(() => import("./pages/admin/main/User"));
const TransactionsPage = React.lazy(
  () => import("./pages/admin/main/Transactions"),
);
const UserDetailPage = React.lazy(
  () => import("./pages/admin/main/UserDetail"),
);
const LoansPage = React.lazy(() => import("./pages/admin/main/Loan"));
const CodesPage = React.lazy(() => import("./pages/admin/main/Codes"));
const EmailsPage = React.lazy(() => import("./pages/admin/main/Emails"));
const NotFoundPage = React.lazy(() => import("./pages/admin/main/NotFound"));

const App = () => {
  useEffect(() => {
    // Initialize console guard on app load
    ConsoleGuard.init();

    // Dev mode: Show welcome banner
    if (ConsoleGuard.isDevMode) {
      ConsoleWarning.banner("ðŸ”’ Summit RIDGE CREDIT UNION - DEV MODE", "info");
    }
  }, []);
  return (
    <>
      <TranslateWidget />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Portal Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/:slug" element={<InnerPage />} />

          {/* Auth Routes */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/signup" element={<SignupPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/auth/forgot-password"
            element={<ForgotPasswordPage />}
          />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

          {/* User Routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transfer" element={<TransferPage />} />
          <Route path="/statements" element={<StatementPage />} />
          <Route path="/add-money" element={<AddMoneyPage />} />
          <Route path="/buy-airtime" element={<BuyAirtimePage />} />
          <Route path="/account-details" element={<UserDetailsPage />} />
          <Route path="/loan" element={<LoanPage />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/tax-refund" element={<TaxRefundPage />} />
          <Route path="/dashboard/kyc" element={<KYCPage />} />

          {/* Admin Routes */}
          <Route path="/user/admin/auth/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/user/:id" element={<UserDetailPage />} />
          <Route path="/admin/transactions" element={<TransactionsPage />} />
          <Route path="/admin/loans" element={<LoansPage />} />
          <Route path="/admin/codes" element={<CodesPage />} />
          <Route path="/admin/emails" element={<EmailsPage />} />

          {/* 404 */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;

