import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function FAQSection({ faqs }) {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section className="py-16 sm:py-24 bg-primary">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-primary rounded-sm border border-secondary p-6 hover:border-basic transition-colors group cursor-pointer"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-bold text-secondary group-hover:text-basic transition-colors">
                  {faq.q}
                </h3>
                <div>
                  <ChevronDown
                    size={20}
                    className="text-secondary flex-shrink-0"
                  />
                </div>
              </div>

              <div className="overflow-hidden">
                <p className="text-secondary opacity-70 mt-3 text-sm leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
