import {
  CreditCard,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Smartphone,
  Heart,
  Globe,
  Briefcase,
  Mail,
  Phone,
  FileText,
  MessageCircle,
  CheckCircle,
  Lock,
  User,
  Leaf,
} from "lucide-react";

const iconMap = {
  CreditCard,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Smartphone,
  Heart,
  Globe,
  Briefcase,
  Mail,
  Phone,
  FileText,
  MessageCircle,
  CheckCircle,
  Lock,
  User,
  Leaf,
};

export function FeaturesSection({ title, features }) {
  return (
    <section className="py-16 sm:py-24 bg-primary">
      <div className="container mx-auto max-w-6xl px-4">
        {title && (
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-secondary mb-4">
              {title}
            </h2>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = iconMap[feature.icon];
            return (
              <div
                key={idx}
                className="group bg-primary rounded-sm border border-secondary p-6 sm:p-8 hover:shadow-lg hover:border-basic transition-all hover:-translate-y-2"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-basic to-basic/80 rounded-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {Icon && <Icon size={28} className="text-primary" />}
                </div>
                <h3 className="text-lg font-bold text-secondary mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-secondary opacity-70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
