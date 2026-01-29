import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function CTASection({
  heading,
  subtext,
  buttonText,
  buttonSlug,
  isDark,
}) {
  return (
    <section
      className={`py-16 sm:py-24 relative overflow-hidden ${
        isDark
          ? "bg-gradient-to-r from-basic to-basic/90"
          : "bg-gradient-to-r from-secondary/10 to-secondary/5"
      }`}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-basic rounded-full blur-3xl" />
      </div>

      <div
        className={`relative z-10 container mx-auto max-w-4xl px-4 text-center ${
          isDark ? "text-primary" : "text-secondary"
        }`}
      >
        <div>
          <h2
            className={`text-4xl sm:text-5xl font-black mb-6 ${
              isDark ? "text-primary" : "text-secondary"
            }`}
          >
            {heading}
          </h2>
          <p
            className={`text-xl mb-8 max-w-2xl mx-auto ${
              isDark ? "text-primary/90" : "text-secondary opacity-70"
            }`}
          >
            {subtext}
          </p>

          {buttonSlug && (
            <Link
              to={`/${buttonSlug}`}
              className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-sm font-bold hover:shadow-2xl hover:scale-105 transition-all active:scale-95 group ${
                isDark
                  ? "bg-primary text-basic hover:text-opacity-90"
                  : "bg-basic text-primary hover:bg-opacity-90"
              }`}
            >
              {buttonText}
              <ArrowRight
                size={20}
                className="group-hover:translate-x-2 transition-transform"
              />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
