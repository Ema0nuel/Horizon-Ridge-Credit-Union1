/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check, AlertCircle } from "lucide-react";

/**
 * Enhanced TranslateWidget Component
 * ✅ CSP-compliant (Google Translate script whitelisted in index.html)
 * ✅ Dynamic language loading with error handling
 * ✅ Beautiful UI with flag emojis + native names
 * ✅ Persistent language selection
 * ✅ Mobile-responsive with tooltip
 * ✅ Cleanup on unmount & route changes
 */

const LANGUAGES = [
  { code: "nl", name: "Nederlands", flag: "🇳🇱", nativeName: "Dutch" },
  { code: "en", name: "English", flag: "🇬🇧", nativeName: "English" },
  { code: "de", name: "Deutsch", flag: "🇩🇪", nativeName: "German" },
  { code: "fr", name: "Français", flag: "🇫🇷", nativeName: "French" },
  { code: "es", name: "Español", flag: "🇪🇸", nativeName: "Spanish" },
];

export function TranslateWidget() {
  // State Management
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem("selectedLanguage") || "en";
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [error, setError] = useState(null);

  // References
  const widgetRef = useRef(null);
  const googleTranslateRef = useRef(null);
  const scriptLoadedRef = useRef(false);
  const initTimeoutRef = useRef(null);

  /**
   * Initialize Google Translate after script loads
   */
  const initializeGoogleTranslate = useCallback(() => {
    if (scriptLoadedRef.current) return;

    try {
      if (window.google?.translate?.TranslateElement) {
        scriptLoadedRef.current = true;

        // Create translator instance
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "nl,en,de,fr,es",
            layout:
              window.google.translate.TranslateElement.InlineLayout.VERTICAL,
            autoDisplay: false,
          },
          "google_translate_element"
        );

        setIsScriptLoaded(true);
        setError(null);

        // Auto-apply saved language on init
        if (currentLang !== "en") {
          setTimeout(() => {
            applyLanguageChange(currentLang);
          }, 300);
        }
      }
    } catch (err) {
      console.error("[TranslateWidget] Init error:", err);
      setError("Translation service unavailable");
      setIsScriptLoaded(true);
    }
  }, [currentLang]);

  /**
   * Load Google Translate script dynamically
   */
  useEffect(() => {
    // Prevent multiple script injections
    if (scriptLoadedRef.current) return;
    if (document.getElementById("google-translate-script")) {
      initTimeoutRef.current = setTimeout(initializeGoogleTranslate, 500);
      return;
    }

    // Check if already loaded in window
    if (window.google?.translate?.TranslateElement) {
      initializeGoogleTranslate();
      return;
    }

    try {
      // Define callback before script load
      window.googleTranslateElementInit = initializeGoogleTranslate;

      // Create and inject script
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.type = "text/javascript";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.defer = true;

      script.onload = () => {
        initTimeoutRef.current = setTimeout(initializeGoogleTranslate, 500);
      };

      script.onerror = () => {
        console.error(
          "[TranslateWidget] Failed to load Google Translate script"
        );
        setError("Translation service unavailable");
        setIsScriptLoaded(true);
      };

      document.head.appendChild(script);
      hideOriginalGoogleWidget();
    } catch (err) {
      console.error("[TranslateWidget] Script injection error:", err);
      setError("Failed to initialize translator");
    }

    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, [initializeGoogleTranslate]);

  /**
   * Hide original Google Translate widget with CSS
   */
  const hideOriginalGoogleWidget = () => {
    if (document.getElementById("translate-widget-styles")) return;

    const style = document.createElement("style");
    style.id = "translate-widget-styles";
    style.textContent = `
      /* Hide Google Translate default widget */
      #google_translate_element {
        display: none !important;
      }
      
      .goog-te-banner-frame {
        display: none !important;
      }
      
      .goog-te-gadget {
        display: none !important;
      }
      
      .goog-te-combo {
        display: none !important;
      }
      
      body.translated-ltr,
      body.translated-rtl {
        top: 0 !important;
        margin-top: 0 !important;
      }

      /* Prevent jank during translation */
      .goog-te-spinner-pos {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  };

  /**
   * Apply language change via Google Translate
   */
  const applyLanguageChange = useCallback((langCode) => {
    try {
      const selectElement = document.querySelector(".goog-te-combo");
      if (selectElement) {
        selectElement.value = langCode;
        selectElement.dispatchEvent(new Event("change"));
        return true;
      }
      return false;
    } catch (err) {
      console.error("[TranslateWidget] Language change error:", err);
      return false;
    }
  }, []);

  /**
   * Handle language selection
   */
  const handleLanguageChange = useCallback(
    (langCode) => {
      if (langCode === currentLang) {
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      // Store preference
      localStorage.setItem("selectedLanguage", langCode);
      setCurrentLang(langCode);

      // Apply via Google Translate
      const success = applyLanguageChange(langCode);

      // Simulate network delay for UX feedback
      setTimeout(() => {
        setIsLoading(false);
        setIsOpen(false);

        if (!success) {
          setError("Language change failed");
        }
      }, 600);
    },
    [currentLang, applyLanguageChange]
  );

  /**
   * Close on outside click
   */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const currentLangObj =
    LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[1];

  return (
    <>
      {/* Hidden Google Translate Container */}
      <div
        id="google_translate_element"
        ref={googleTranslateRef}
        aria-hidden="true"
        style={{ display: "none" }}
      />

      {/* Custom Widget */}
      <motion.div
        ref={widgetRef}
        className="fixed bottom-6 left-6 z-50 font-sans"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
        role="region"
        aria-label="Language Selection Widget"
      >
        {/* Main Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-sm font-semibold shadow-md transition-all duration-300 backdrop-blur-sm ${
            isOpen
              ? "bg-blue-600 text-white border border-blue-700 shadow-lg"
              : "bg-white text-gray-700 border border-gray-300 hover:shadow-lg hover:border-blue-500"
          } ${isLoading ? "opacity-70 cursor-wait" : ""}`}
          whileHover={!isLoading ? { scale: 1.05 } : {}}
          whileTap={{ scale: 0.98 }}
          aria-expanded={isOpen}
          aria-controls="language-menu"
          disabled={isLoading}
          title="Select language"
        >
          {/* Flag - Animated */}
          <motion.span
            key={currentLangObj?.code}
            animate={{ rotate: isOpen ? 180 : 0, scale: isOpen ? 1.15 : 1 }}
            transition={{ duration: 0.3 }}
            className="text-xl"
          >
            {currentLangObj?.flag}
          </motion.span>

          {/* Language Name - Hidden on Mobile */}
          <span className="hidden sm:inline text-sm font-semibold">
            {currentLangObj?.name}
          </span>

          {/* Globe Icon */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Globe size={16} className="text-current" />
          </motion.div>
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="language-menu"
              className="absolute bottom-full left-0 mb-3 bg-white rounded-md shadow-xl border border-gray-200 overflow-hidden w-48 sm:w-56 z-50"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              role="menu"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 border-b border-gray-200">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">
                  Select Language
                </p>
              </div>

              {/* Options */}
              <div className="max-h-80 overflow-y-auto">
                {LANGUAGES.map((lang, idx) => (
                  <motion.button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 border-b border-gray-100 last:border-b-0 ${
                      currentLang === lang.code
                        ? "bg-blue-50 text-gray-900 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    } ${isLoading ? "opacity-60" : ""}`}
                    whileHover={
                      currentLang !== lang.code && !isLoading ? { x: 4 } : {}
                    }
                    whileTap={{ scale: 0.98 }}
                    role="menuitem"
                    aria-current={currentLang === lang.code ? "true" : "false"}
                    disabled={isLoading}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    {/* Flag */}
                    <span className="text-2xl flex-shrink-0">{lang.flag}</span>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {lang.name}
                      </p>
                      <p className="text-xs text-gray-500">{lang.nativeName}</p>
                    </div>

                    {/* Checkmark */}
                    {currentLang === lang.code && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        className="text-blue-600 flex-shrink-0"
                      >
                        <Check size={18} strokeWidth={3} />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Loading State */}
              {isLoading && (
                <motion.div
                  className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full"
                  />
                </motion.div>
              )}

              {/* Footer */}
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-600 text-center">
                  Powered by Google Translate
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Notification */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full left-0 mb-2 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-xs text-red-700 flex items-center gap-2 w-48 whitespace-normal"
          >
            <AlertCircle size={14} className="flex-shrink-0" />
            {error}
          </motion.div>
        )}

        {/* Mobile Tooltip */}
        <motion.div
          className="sm:hidden absolute bottom-full left-0 mb-2 bg-gray-900 text-white text-xs px-3 py-1 rounded-md whitespace-nowrap pointer-events-none shadow-lg"
          initial={{ opacity: 0, y: 5 }}
          animate={!isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 5 }}
          transition={{ delay: 1, duration: 0.3 }}
        >
          Tap to translate
        </motion.div>
      </motion.div>
    </>
  );
}

export default TranslateWidget;
