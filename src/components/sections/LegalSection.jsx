/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

export function LegalSection({ title, lastUpdated, content }) {
  // Split content into paragraphs for better readability
  const paragraphs = content.split("\n\n").filter((p) => p.trim().length > 0);

  return (
    <section className="py-12 sm:py-20 bg-primary">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-secondary mb-4">
            {title}
          </h1>
          {lastUpdated && (
            <p className="text-sm text-secondary opacity-60">
              Last updated: {lastUpdated}
            </p>
          )}
          <div className="h-1 w-16 bg-basic rounded-xs mt-6" />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-sm sm:prose-base prose-headings:text-secondary prose-headings:font-bold prose-p:text-secondary prose-p:opacity-80 prose-p:leading-relaxed prose-li:text-secondary prose-li:opacity-80 prose-strong:text-secondary prose-strong:font-semibold max-w-none"
        >
          {paragraphs.map((paragraph, idx) => {
            // Check if paragraph starts with a number and period (for section headers)
            const isHeader = /^\d+\./.test(paragraph.trim());

            if (isHeader) {
              // Split header from content
              const [headerLine, ...contentLines] = paragraph
                .split("\n")
                .filter((l) => l.trim());

              return (
                <div key={idx} className="mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-secondary mb-4 mt-6">
                    {headerLine}
                  </h2>
                  {contentLines.length > 0 && (
                    <div className="text-secondary opacity-80 leading-relaxed space-y-3">
                      {contentLines
                        .join("\n")
                        .split("\n")
                        .map((line, lineIdx) => {
                          // Handle list items
                          if (line.trim().startsWith("-")) {
                            return (
                              <li
                                key={lineIdx}
                                className="ml-6 text-secondary opacity-80"
                              >
                                {line.replace(/^-\s*/, "")}
                              </li>
                            );
                          }
                          // Regular text
                          return line.trim() ? (
                            <p key={lineIdx}>{line}</p>
                          ) : null;
                        })}
                    </div>
                  )}
                </div>
              );
            }

            // Regular paragraph
            return (
              <div
                key={idx}
                className="mb-6 text-secondary opacity-80 leading-relaxed space-y-3"
              >
                {paragraph
                  .split("\n")
                  .filter((l) => l.trim())
                  .map((line, lineIdx) => {
                    // Handle list items
                    if (line.trim().startsWith("-")) {
                      return (
                        <li
                          key={lineIdx}
                          className="ml-6 text-secondary opacity-80"
                        >
                          {line.replace(/^-\s*/, "")}
                        </li>
                      );
                    }
                    // Regular text with proper formatting
                    return line.trim() ? <p key={lineIdx}>{line}</p> : null;
                  })}
              </div>
            );
          })}
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 pt-8 border-t border-secondary"
        >
          <div className="bg-gray-50 rounded-sm p-6 border border-secondary">
            <h3 className="font-bold text-secondary mb-3">Questions?</h3>
            <p className="text-sm text-secondary opacity-70 mb-4">
              If you have questions about this policy or our practices, please
              contact us:
            </p>
            <div className="space-y-2 text-sm text-secondary opacity-70">
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:legal@abnAmro.com"
                  className="text-basic hover:underline"
                >
                  legal@abnAmro.com
                </a>
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                <a
                  href="tel:+31201046000"
                  className="text-basic hover:underline"
                >
                  +31 20 104 6000
                </a>
              </p>
              <p>
                <strong>Address:</strong> Amsterdam, Netherlands
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
