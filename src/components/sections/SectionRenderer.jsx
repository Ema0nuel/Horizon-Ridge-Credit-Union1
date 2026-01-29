import { HeroSection } from "./HeroSection";
import { TextSection } from "./TextSection";
import { FeaturesSection } from "./FeaturesSection";
import { FAQSection } from "./FAQSection";
import { CTASection } from "./CTASection";
import { LegalSection } from "./LegalSection";

export function SectionRenderer({ section }) {
  switch (section.type) {
    case "hero":
      return <HeroSection {...section.props} />;
    case "text":
      return <TextSection {...section.props} />;
    case "features":
      return <FeaturesSection {...section.props} />;
    case "faq":
      return <FAQSection {...section.props} />;
    case "cta":
      return <CTASection {...section.props} />;
    case "legal":
      return <LegalSection {...section.props} />;
    default:
      return null;
  }
}
