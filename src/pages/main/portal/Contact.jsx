/* eslint-disable no-useless-escape */
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../Services/supabase/supabaseClient";
import { LoadingSpinner } from "../../../components/Spinner";
import LOGO from "../../../assets/images/Logo-abn.png";
import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar";

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export function ContactPage() {
  const navigate = useNavigate();
  const formRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    category: "general",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [globalError, setGlobalError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Insert into Supabase contacts table
      const { data, error } = await supabase
        .from("contact_submissions")
        .insert([
          {
            full_name: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            subject: formData.subject.trim(),
            category: formData.category,
            message: formData.message.trim(),
            ip_address: await getClientIP(),
            user_agent: navigator.userAgent,
            submitted_at: new Date().toISOString(),
            status: "new",
          },
        ]);

      if (error) {
        console.error("[CONTACT] Submission error:", error);
        throw new Error(error.message || "Failed to submit contact form");
      }

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        category: "general",
        message: "",
      });
      setErrors({});
      setSubmitted(true);
      setSuccessMessage(
        "Thank you for contacting us! We'll get back to you within 24-48 hours.",
      );

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
        setSuccessMessage("");
      }, 5000);

      // Scroll to top to show success message
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("[CONTACT] Error:", err);
      setGlobalError(
        err.message || "Something went wrong. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-primary py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <img
                src={LOGO}
                alt="Summit Ridge Credit Union"
                className="h-10 sm:h-12"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-secondary mb-3">
              Get in Touch
            </h1>
            <p className="text-sm sm:text-base text-secondary opacity-70 mb-2">
              We're here to help. Send us a message and we'll respond as soon as
              possible.
            </p>
            <div className="h-1 w-12 bg-basic mx-auto rounded-xs" />
          </div>

          {/* Contact Form Card */}
          <div
            ref={formRef}
            className="w-full bg-primary rounded-sm border border-secondary shadow-lg p-8"
          >
            {/* Success Message */}
            {submitted && (
              <div
                className="mb-6 p-4 bg-green-50 border border-green-300 text-green-800 rounded-sm text-sm flex items-start gap-3"
                role="alert"
                aria-live="polite"
              >
                <svg
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}

            {/* Global Error Message */}
            {globalError && (
              <div
                className="mb-6 p-4 bg-red-50 border border-red-300 text-red-800 rounded-sm text-sm flex items-start gap-3"
                role="alert"
                aria-live="polite"
              >
                <svg
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{globalError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Full Name Field */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-secondary mb-2"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 border rounded-xs text-secondary bg-primary focus:outline-none focus:ring-2 focus:ring-basic focus:border-transparent transition-all ${
                    errors.fullName ? "border-red-500" : "border-secondary"
                  }`}
                  disabled={loading}
                  aria-invalid={!!errors.fullName}
                  aria-describedby={
                    errors.fullName ? "fullName-error" : undefined
                  }
                />
                {errors.fullName && (
                  <p
                    id="fullName-error"
                    className="mt-2 text-xs text-red-600 flex items-center gap-1"
                  >
                    <span>âš </span> {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-secondary mb-2"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className={`w-full px-4 py-3 border rounded-xs text-secondary bg-primary focus:outline-none focus:ring-2 focus:ring-basic focus:border-transparent transition-all ${
                    errors.email ? "border-red-500" : "border-secondary"
                  }`}
                  disabled={loading}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    className="mt-2 text-xs text-red-600 flex items-center gap-1"
                  >
                    <span>âš </span> {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-secondary mb-2"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className={`w-full px-4 py-3 border rounded-xs text-secondary bg-primary focus:outline-none focus:ring-2 focus:ring-basic focus:border-transparent transition-all ${
                    errors.phone ? "border-red-500" : "border-secondary"
                  }`}
                  disabled={loading}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                {errors.phone && (
                  <p
                    id="phone-error"
                    className="mt-2 text-xs text-red-600 flex items-center gap-1"
                  >
                    <span>âš </span> {errors.phone}
                  </p>
                )}
              </div>

              {/* Category Dropdown */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-secondary mb-2"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-secondary rounded-xs text-secondary bg-primary focus:outline-none focus:ring-2 focus:ring-basic focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={loading}
                  aria-label="Category"
                >
                  <option value="general">General Inquiry</option>
                  <option value="account">Account Related</option>
                  <option value="technical">Technical Issue</option>
                  <option value="complaint">Complaint</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Subject Field */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-secondary mb-2"
                >
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Brief subject of your message"
                  maxLength="100"
                  className={`w-full px-4 py-3 border rounded-xs text-secondary bg-primary focus:outline-none focus:ring-2 focus:ring-basic focus:border-transparent transition-all ${
                    errors.subject ? "border-red-500" : "border-secondary"
                  }`}
                  disabled={loading}
                  aria-invalid={!!errors.subject}
                  aria-describedby={
                    errors.subject ? "subject-error" : undefined
                  }
                />
                <div className="mt-1 flex justify-between items-center">
                  {errors.subject && (
                    <p
                      id="subject-error"
                      className="text-xs text-red-600 flex items-center gap-1"
                    >
                      <span>âš </span> {errors.subject}
                    </p>
                  )}
                  <span className="text-xs text-secondary opacity-50 ml-auto">
                    {formData.subject.length}/100
                  </span>
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-secondary mb-2"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Please provide detailed information about your inquiry..."
                  rows="6"
                  maxLength="1000"
                  className={`w-full px-4 py-3 border rounded-xs text-secondary bg-primary focus:outline-none focus:ring-2 focus:ring-basic focus:border-transparent transition-all resize-none ${
                    errors.message ? "border-red-500" : "border-secondary"
                  }`}
                  disabled={loading}
                  aria-invalid={!!errors.message}
                  aria-describedby={
                    errors.message ? "message-error" : undefined
                  }
                />
                <div className="mt-1 flex justify-between items-center">
                  {errors.message && (
                    <p
                      id="message-error"
                      className="text-xs text-red-600 flex items-center gap-1"
                    >
                      <span>âš </span> {errors.message}
                    </p>
                  )}
                  <span className="text-xs text-secondary opacity-50 ml-auto">
                    {formData.message.length}/1000
                  </span>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="p-4 bg-gray-50 rounded-sm border border-secondary">
                <p className="text-xs text-secondary opacity-70 leading-relaxed">
                  By submitting this form, you agree to our privacy policy.
                  We'll use your information solely to respond to your inquiry
                  and will not share it with third parties without your consent.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-basic text-primary font-semibold rounded-sm hover:bg-opacity-90 active:scale-95 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" /> Sending...
                  </>
                ) : (
                  <>
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
                    Send Message
                  </>
                )}
              </button>
            </form>

            {/* Support Info */}
            <div className="mt-8 pt-8 border-t border-secondary">
              <p className="text-center text-sm text-secondary opacity-70 mb-6">
                Prefer to reach us directly?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-basic font-bold mb-2">Email</div>
                  <a
                    href="mailto:support@Summitridgecreditunion.com"
                    className="text-sm text-secondary hover:text-basic transition-colors"
                  >
                    support@Summitridgecreditunion.com
                  </a>
                </div>
                <div className="text-center">
                  <div className="text-basic font-bold mb-2">Phone</div>
                  <a
                    href="tel:+1234567890"
                    className="text-sm text-secondary hover:text-basic transition-colors"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
                <div className="text-center">
                  <div className="text-basic font-bold mb-2">Hours</div>
                  <p className="text-sm text-secondary">
                    Mon-Fri: 9AM - 6PM <br /> EST
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-basic font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-basic rounded-xs px-2 py-1"
            >
              &lt; Back to Home
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

// Helper function to get client IP (optional, for rate limiting)
async function getClientIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch {
    return null;
  }
}

