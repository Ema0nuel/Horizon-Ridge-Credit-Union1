import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

export default function NotFoundPage() {
  return (
    <>
      <div className="min-h-screen bg-primary flex flex-col">
        <Navbar />

        {/* 404 Content */}
        <div className="flex-1 flex items-center justify-center py-12 sm:py-20 px-4">
          <div className="w-full max-w-2xl">
            {/* 404 Visual */}
            <div className="text-center mb-12">
              <div className="relative mb-8 inline-block">
                {/* Large 404 */}
                <div className="text-[120px] sm:text-[180px] font-bold text-basic/20 leading-none">
                  404
                </div>
              </div>

              {/* Error Message */}
              <h1 className="text-4xl sm:text-5xl font-bold text-secondary mb-4 mt-8">
                Page Not Found
              </h1>
              <p className="text-lg sm:text-xl text-secondary opacity-70 mb-8 max-w-md mx-auto">
                Sorry, the page you're looking for doesn't exist. It might have
                been moved or deleted.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-basic text-primary font-semibold rounded-xs hover:opacity-90 transition-opacity active:scale-95"
                >
                  <Home size={18} />
                  Back to Home
                </Link>
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 border-2 border-basic text-basic font-semibold rounded-xs hover:bg-basic/10 transition-colors"
                >
                  <ArrowLeft size={18} />
                  Go Back
                </button>
              </div>
            </div>

            {/* Helpful Links */}
            <div className="bg-gray-50 rounded-xs border border-secondary p-8 mt-16">
              <h2 className="text-lg font-semibold text-secondary mb-6">
                Here are some helpful links:
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Services", href: "/services" },
                  { label: "About Us", href: "/about" },
                  { label: "Contact Support", href: "/contact" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-basic hover:text-basic/80 font-medium transition-colors flex items-center gap-2"
                  >
                    <span>→</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
