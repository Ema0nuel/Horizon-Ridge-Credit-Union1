import React, { useState } from "react";
import { sendEmailAPI } from "../Services/api";
import {
  DEFAULT_WELCOME_EMAIL,
  KYC_VERIFICATION_EMAIL,
  TRANSACTION_CONFIRMATION_EMAIL,
} from "../utils/emailTemplates";

/**
 * EmailButton Component
 * Uses: text-secondary (dark text on white), text-primary (white text on dark),
 * bg-secondary (dark background), bg-basic (orange accents)
 * Border radius: 2-3px (rounded-xs, rounded-sm)
 */
export function EmailButton() {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, message: "" });
  const [selectedTemplate, setSelectedTemplate] = useState("welcome");

  const templates = {
    welcome: DEFAULT_WELCOME_EMAIL,
    kyc: KYC_VERIFICATION_EMAIL,
    transaction: TRANSACTION_CONFIRMATION_EMAIL,
  };

  const handleSendEmail = async (templateKey) => {
    setLoading(true);
    setFeedback({ type: null, message: "" });

    try {
      const template = templates[templateKey];

      if (!template) {
        throw new Error("Invalid template selected");
      }

      console.log("Sending email with template:", templateKey);
      const result = await sendEmailAPI(template);

      setFeedback({
        type: "success",
        message: `✓ Email sent successfully! Message ID: ${result.messageId}`,
      });

      console.log("Email sent:", result);

      setTimeout(() => {
        setFeedback({ type: null, message: "" });
      }, 5000);
    } catch (err) {
      console.error("Send email failed:", err);
      setFeedback({
        type: "error",
        message: `✗ Failed: ${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-primary rounded-sm shadow-lg border border-secondary">
      <h2 className="text-2xl font-bold text-secondary mb-4">
        Test Email Service
      </h2>

      {/* Feedback Message */}
      {feedback.message && (
        <div
          className={`mb-4 p-4 rounded-xs font-medium text-sm ${
            feedback.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
          role="alert"
        >
          {feedback.message}
        </div>
      )}

      {/* Template Selector */}
      <div className="mb-6">
        <label
          htmlFor="template"
          className="block text-sm font-medium text-secondary mb-2"
        >
          Select Email Template:
        </label>
        <select
          id="template"
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-2 border border-secondary rounded-xs text-secondary bg-primary focus:outline-none focus:ring-2 focus:ring-basic focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="welcome">Welcome Email</option>
          <option value="kyc">KYC Verification Email</option>
          <option value="transaction">Transaction Confirmation Email</option>
        </select>
      </div>

      {/* Send Button */}
      <button
        onClick={() => handleSendEmail(selectedTemplate)}
        disabled={loading}
        className={`w-full py-3 px-4 rounded-sm font-semibold text-primary transition-all duration-200 ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-basic hover:bg-opacity-90 active:scale-95 shadow-md"
        }`}
        aria-busy={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Sending...
          </span>
        ) : (
          "Send Email to emas08177@gmail.com"
        )}
      </button>

      {/* Info Section */}
      <div className="mt-6 p-4 bg-basic bg-opacity-5 border border-basic rounded-xs">
        <p className="text-sm text-secondary">
          <strong>Note:</strong> This will send a{" "}
          <span className="text-basic font-semibold">{selectedTemplate}</span>{" "}
          email to <strong>emas08177@gmail.com</strong>
        </p>
        <p className="text-xs text-secondary mt-2 opacity-70">
          Backend server must be running on{" "}
          <code className="bg-secondary bg-opacity-5 px-2 py-1 rounded-xs text-basic font-mono">
            http://localhost:3001
          </code>
        </p>
      </div>
    </div>
  );
}

export default EmailButton;
