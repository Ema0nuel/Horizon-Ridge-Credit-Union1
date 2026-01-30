import React, { useState, useEffect } from "react";
import { adminLogout } from "../../pages/admin/auth/adminAuth";
import { useNavigate } from "react-router-dom";
import LOGO from "../../assets/images/Logo-abn.png";
import ConsoleGuard from "../../utils/consoleGuard";
import ConsoleWarning from "../../utils/consoleWarning";
import SecurityMonitor from "../../utils/securityMonitor";

const Header = ({ adminEmail, onMenuToggle }) => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good Morning");
      else if (hour < 18) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");
      setTime(new Date());
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);

    // Dev mode only: Show security warnings
    if (ConsoleGuard.isDevMode) {
      ConsoleWarning.warn(
        "⚠️ ADMIN ACCESS DETECTED",
        "You are accessing a restricted administrative interface.",
        "danger",
        {
          emoji: "🔐",
          metadata: {
            panel: "Admin Dashboard",
            accessTime: new Date().toISOString(),
          },
        },
      );
    } else {
      // Production: Silent logging
      SecurityMonitor.auditAdminAction(
        "dashboard_accessed",
        "admin_panel",
        "success",
      );
    }

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    adminLogout();
    navigate("/user/admin/auth/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 bg-primary border-b border-secondary shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Left: Menu Toggle + Logo + Greeting */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-sm hover:bg-secondary hover:bg-opacity-10 transition-colors"
            aria-label="Toggle menu"
            title="Toggle navigation menu"
          >
            <svg
              className="w-6 h-6 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo + Admin Panel Text */}
          <div className="flex items-center gap-3">
            <img
              src={LOGO}
              alt="Horizon Ridge Credit Union"
              className="h-8 sm:h-10"
            />
            <div className="hidden sm:block border-l border-secondary pl-3">
              <p className="text-xs font-semibold text-secondary uppercase tracking-wider opacity-80">
                Admin Panel
              </p>
              <p className="text-xs text-secondary opacity-60">Management</p>
            </div>
          </div>

          {/* Greeting (Desktop) */}
          <div className="hidden md:block border-l border-secondary pl-4">
            <h1 className="text-lg font-bold text-secondary">{greeting}</h1>
            <p className="text-xs text-secondary opacity-60">{adminEmail}</p>
          </div>

          {/* Greeting (Mobile) */}
          <div className="md:hidden border-l border-secondary pl-3">
            <p className="text-sm font-semibold text-secondary">{greeting}</p>
            <p className="text-xs text-secondary opacity-60">
              {time.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Right: Logout */}
        <button
          onClick={handleLogout}
          className="px-3 sm:px-4 py-2 rounded-sm bg-red-600 text-white font-semibold text-xs sm:text-sm hover:bg-red-700 transition-colors active:scale-95"
          aria-label="Logout"
          title="Sign out from admin panel"
        >
          <span className="hidden sm:inline">Logout</span>
          <span className="sm:hidden">
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
