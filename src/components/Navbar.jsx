/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, LogIn } from "lucide-react";
import LOGO from "../assets/images/Logo-abn.png";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-primary border-b border-secondary">
      {/* Top Bar */}
      <div className="border-b border-secondary">
        <div className="container mx-auto max-w-6xl px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={LOGO}
              alt="Horizon Ridge Credit Union"
              className="w-auto h-10"
            />
            Horizon Ridge Credit Union
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-secondary hover:text-basic transition-colors font-medium text-sm"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <button
              aria-label="Search"
              className="p-2 hover:bg-gray-100 rounded-xs transition-colors"
            >
              <Search size={20} className="text-secondary" />
            </button>

            <Link
              to="/auth/login"
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-basic text-primary rounded-xs font-semibold text-sm hover:opacity-90 transition-opacity"
              aria-label="Login"
            >
              <LogIn size={16} />
              Login
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              className="lg:hidden p-2 hover:bg-gray-100 rounded-xs transition-colors"
            >
              {isMenuOpen ? (
                <X size={24} className="text-secondary" />
              ) : (
                <Menu size={24} className="text-secondary" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-secondary bg-primary">
          <div className="container mx-auto max-w-6xl px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-secondary hover:text-basic transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/auth/login"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-basic text-primary rounded-xs font-semibold hover:opacity-90 transition-opacity mt-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <LogIn size={16} />
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
