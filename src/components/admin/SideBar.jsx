import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavIcon = ({ name }) => {
  const icons = {
    Dashboard: (
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
          d="M3 12l2-3m0 0l-2-3m2 3h18M3 12h18"
        />
      </svg>
    ),
    Users: (
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
          d="M12 4.354a4 4 0 110 8.646 4 4 0 010-8.646M3 20.394A9.002 9.002 0 0112.75 16c4.478 0 8.268 2.943 9.542 7.084"
        />
      </svg>
    ),
    Transactions: (
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
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    Loans: (
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
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    Emails: (
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
    ),
    "Manage Codes": (
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
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
  };

  return icons[name] || null;
};

const NavLink = ({ name, path, isActive, onClick }) => (
  <Link
    to={path}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all ${
      isActive
        ? "bg-basic text-primary font-semibold shadow-md"
        : "text-secondary hover:bg-secondary hover:bg-opacity-10"
    }`}
    aria-current={isActive ? "page" : undefined}
  >
    <NavIcon name={name} />
    <span className="text-sm font-medium">{name}</span>
  </Link>
);

const SideBar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Users", path: "/admin/users" },
    { name: "Transactions", path: "/admin/transactions" },
    { name: "Loans", path: "/admin/loans" },
    { name: "Emails", path: "/admin/emails" },
    { name: "Manage Codes", path: "/admin/codes" },
  ];

  const isItemActive = (path) => currentPath === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-primary border-r border-secondary shadow-lg transition-transform duration-300 z-40 lg:z-0 lg:translate-x-0 lg:sticky lg:top-0 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="navigation"
        aria-label="Admin navigation"
      >
        {/* Navigation Links */}
        <nav className="p-4 space-y-2 pt-20">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              name={item.name}
              path={item.path}
              isActive={isItemActive(item.path)}
              onClick={onClose}
            />
          ))}
        </nav>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-secondary bg-secondary bg-opacity-5">
          <div className="text-xs text-secondary opacity-70 space-y-1">
            <p className="font-semibold">Admin Portal v1.0</p>
            <p>Â© {new Date().getFullYear()} Horizon Ridge Credit Union Bank</p>
            <p className="text-xs opacity-50 mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideBar;

