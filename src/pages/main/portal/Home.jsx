/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  CreditCard,
  TrendingUp,
  Shield,
  Zap,
  Users,
  CheckCircle,
  ChevronDown,
  MessageCircle,
  Star,
  Lock,
  Smartphone,
  Globe,
  Briefcase,
  Heart,
  AlertCircle,
} from "lucide-react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

// Import all images from assets folder
import HeroImage from "../../../assets/images/skyscrapers-from-low-angle-view.jpg";
import HeroImage2 from "../../../assets/images/ABN_AMRO_DEF_juni_2025__Hannie_Verhoeven_Fotograaf013_hero-9351547348dd.jpg";
import PersonalBanking from "../../../assets/images/Banking_for_better_for_generation.jpg";
import BusinessSolutions from "../../../assets/images/01_AA-PageHero__1920x1000px.jpg";
import InvestmentTools from "../../../assets/images/image3.png";
import SecurityFeatures from "../../../assets/images/IMG_6786.jpg";
import MobileApp from "../../../assets/images/H_ABN_Amro_BB_View_7_-_Vanaf_entree_strategiepagina.png";
import CustomerService from "../../../assets/images/Infographic_Tikkie2025_med.jpg";
import BlogFinance from "../../../assets/images/Judith_doorloop_1.jpg";
import BlogTechnology from "../../../assets/images/Portrait_MÃ_lanie_Guerrato2.jpg";
import BlogGuide from "../../../assets/images/testimonial-6.jpeg";
import Testimonial1 from "../../../assets/images/testimonial-1.jpg";
import Testimonial2 from "../../../assets/images/testimonial-2.jpg";
import Testimonial3 from "../../../assets/images/testimonial-3.jpeg";
import Testimonial4 from "../../../assets/images/testimonial-4.jpg";
import Testimonial5 from "../../../assets/images/testimonial-5.jpeg";
import Testimonial6 from "../../../assets/images/testimonial-6.jpeg";

// ============================================================================
// SVG & ICON COMPONENTS
// ============================================================================

const ArrowDownIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 14l-7 7m0 0l-7-7m7 7V3"
    />
  </svg>
);

const Checkmark = () => (
  <svg
    className="w-5 h-5 text-green-500"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

// ============================================================================
// REUSABLE CARD COMPONENTS
// ============================================================================

const FeatureCard = ({ icon: Icon, title, description, index, image }) => (
  <div className="group bg-primary rounded-sm border border-secondary p-6 sm:p-8 hover:shadow-lg hover:border-basic transition-all duration-300 hover:-translate-y-2 overflow-hidden">
    {/* Image Background */}
    {image && (
      <div className="mb-4 h-40 -mx-6 -mt-8 sm:-mx-8 sm:-mt-8 overflow-hidden rounded-b-sm">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      </div>
    )}

    <div className="w-14 h-14 bg-gradient-to-br from-basic to-basic/80 rounded-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
      <Icon size={28} className="text-primary" />
    </div>
    <h3 className="text-lg font-bold text-secondary mb-3">{title}</h3>
    <p className="text-sm text-secondary opacity-70 leading-relaxed">
      {description}
    </p>
    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <ArrowRight size={16} className="text-basic inline" />
    </div>
  </div>
);

const StatCard = ({ number, label, delay }) => (
  <div className="text-center">
    <p className="text-4xl sm:text-5xl font-bold text-basic mb-2 font-mono">
      {number}
    </p>
    <p className="text-sm sm:text-base text-primary opacity-80 font-semibold">
      {label}
    </p>
  </div>
);

const TestimonialCard = ({ name, role, text, image, index }) => (
  <div className="bg-primary rounded-sm border border-secondary p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow">
    {/* Stars */}
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
      ))}
    </div>

    {/* Quote */}
    <p className="text-sm text-secondary opacity-80 mb-6 italic leading-relaxed">
      "{text}"
    </p>

    {/* Author */}
    <div className="flex items-center gap-3 pt-4 border-t border-secondary">
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-10 h-10 rounded-full object-cover border-2 border-basic"
          loading="lazy"
        />
      ) : (
        <div className="w-10 h-10 bg-basic rounded-full flex items-center justify-center text-primary font-bold text-xs">
          {name.charAt(0)}
        </div>
      )}
      <div>
        <p className="font-semibold text-secondary text-sm">{name}</p>
        <p className="text-xs text-secondary opacity-60">{role}</p>
      </div>
    </div>
  </div>
);

const PricingTier = ({ name, price, features, highlighted, index }) => (
  <div
    className={`rounded-sm border p-8 transition-all ${
      highlighted
        ? "bg-gradient-to-br from-basic to-basic/90 border-basic shadow-2xl scale-105 text-primary"
        : "bg-primary border-secondary shadow-md hover:shadow-lg hover:border-basic"
    }`}
  >
    {highlighted && (
      <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-4 text-primary">
        MOST POPULAR
      </div>
    )}

    <h3
      className={`text-2xl font-bold mb-2 ${
        highlighted ? "text-primary" : "text-secondary"
      }`}
    >
      {name}
    </h3>

    <div className="mb-6">
      <span
        className={`text-5xl font-bold ${
          highlighted ? "text-primary" : "text-basic"
        }`}
      >
        {price}
      </span>
      <span className={highlighted ? "text-primary/80" : "text-secondary/70"}>
        /month
      </span>
    </div>

    <button
      className={`w-full py-3 px-4 rounded-sm font-bold mb-8 transition-all ${
        highlighted
          ? "bg-primary text-basic hover:bg-opacity-90"
          : "border border-current text-secondary hover:bg-secondary hover:bg-opacity-10"
      }`}
    >
      Get Started
    </button>

    <div className="space-y-4">
      {features.map((feature, i) => (
        <div key={i} className="flex items-center gap-3">
          <Checkmark />
          <span className={highlighted ? "text-primary" : "text-secondary"}>
            {feature}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const BlogCard = ({ title, excerpt, date, category, image, index }) => (
  <div className="bg-primary rounded-sm border border-secondary overflow-hidden shadow-md hover:shadow-xl hover:border-basic transition-all group cursor-pointer">
    {/* Image */}
    <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-basic/20 to-basic/10">
      {image ? (
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <MessageCircle size={48} className="text-basic opacity-20" />
        </div>
      )}
      <div className="absolute top-4 right-4 bg-basic text-primary px-3 py-1 rounded-full text-xs font-bold">
        {category}
      </div>
    </div>

    {/* Content */}
    <div className="p-6">
      <p className="text-xs text-secondary opacity-60 mb-3 font-semibold">
        {date}
      </p>
      <h3 className="text-lg font-bold text-secondary mb-3 line-clamp-2 group-hover:text-basic transition-colors">
        {title}
      </h3>
      <p className="text-sm text-secondary opacity-70 line-clamp-2 mb-4">
        {excerpt}
      </p>
      <div className="flex items-center gap-2 text-basic font-semibold text-sm group-hover:gap-3 transition-all">
        Read More <ArrowRight size={16} />
      </div>
    </div>
  </div>
);

// ============================================================================
// MAIN HOME PAGE
// ============================================================================

export function HomePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  return (
    <>
      <div className="min-h-screen bg-primary flex flex-col">
        <Navbar />

        {/* ===== HERO SECTION ===== */}
        <section className="relative min-h-screen overflow-hidden">
          {/* Background Image with Gradient Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${HeroImage})`,
            }}
            aria-hidden="true"
          />

          {/* Gradient Overlay: Light Left of Dark Right */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(11, 36, 71, 0.3), rgba(11, 36, 71, 0.85))",
            }}
            aria-hidden="true"
          />

          {/* Floating Shapes */}
          <div
            className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 container mx-auto max-w-7xl px-4 h-screen flex flex-col justify-between py-20">
            {/* Main Hero Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center flex-1">
              {/* Left: Text Content */}
              <div className="flex flex-col gap-6">
                <div>
                  <span className="inline-block px-4 py-2 bg-primary/30 text-primary rounded-xs text-sm font-bold mb-4 backdrop-blur-sm border border-primary/50">
                    Welcome to Banking Excellence
                  </span>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-primary leading-tight">
                  Banking for Better,{" "}
                  <span className="text-primary italic">for Generations</span>
                </h1>

                <p className="text-lg sm:text-xl text-primary/90 opacity-95 max-w-md leading-relaxed">
                  Experience secure, innovative financial solutions tailored to
                  your needs. From personal banking to enterprise solutions.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link
                    to="/auth/signup"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-basic font-bold rounded-sm hover:shadow-lg hover:scale-105 transition-all active:scale-95 group"
                  >
                    Get Started
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-2 transition-transform"
                    />
                  </Link>
                  <Link
                    to="/auth/login"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-primary text-primary font-bold rounded-sm hover:bg-primary/10 transition-all active:scale-95"
                  >
                    Sign In
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center gap-6 pt-4 text-primary text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-primary" />
                    Secure & Encrypted
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={18} className="text-primary" />
                    Regulated Bank
                  </div>
                </div>
              </div>

              {/* Right: Hero Image */}
              <div className="hidden lg:flex relative justify-center items-center">
                <div className="relative w-full max-w-md rounded-lg overflow-hidden shadow-2xl">
                  <img
                    src={HeroImage2}
                    alt="Banking Services"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Scroll Indicator - WITHOUT BOUNCE */}
            <div className="flex flex-col items-center gap-2 text-primary mx-auto">
              <p className="text-sm font-semibold opacity-70">
                Scroll to explore
              </p>
              <ArrowDownIcon />
            </div>
          </div>
        </section>

        {/* ===== STATS SECTION ===== */}
        <section className="py-16 sm:py-24 bg-gradient-to-r from-secondary via-secondary to-secondary/90 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-basic rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-basic rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 container mx-auto max-w-6xl px-4">
            <div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-black text-primary mb-4">
                Trusted by Millions
              </h2>
              <p className="text-lg text-primary/80 max-w-2xl mx-auto">
                Join the growing community of satisfied customers worldwide
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard number="150+" label="Years of Trust" delay={0} />
              <StatCard number="8M+" label="Happy Customers" delay={0.1} />
              <StatCard number="50+" label="Countries Served" delay={0.2} />
              <StatCard
                number="$2.3B"
                label="Assets Under Management"
                delay={0.3}
              />
            </div>
          </div>
        </section>

        {/* ===== SERVICES SECTION ===== */}
        <section className="py-16 sm:py-24 bg-primary">
          <div className="container mx-auto max-w-6xl px-4">
            <div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 bg-basic/20 text-basic rounded-full text-sm font-bold mb-4">
                COMPREHENSIVE SOLUTIONS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-secondary mb-4">
                Our Services
              </h2>
              <p className="text-lg text-secondary opacity-70 max-w-2xl mx-auto">
                Explore our full range of financial products and services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                index={0}
                icon={CreditCard}
                title="Personal Banking"
                description="Manage your finances with user-friendly accounts, savings, and investment solutions designed for you."
                image={PersonalBanking}
              />
              <FeatureCard
                index={1}
                icon={TrendingUp}
                title="Investments"
                description="Grow your wealth with expert investment advice and portfolio management services."
                image={InvestmentTools}
              />
              <FeatureCard
                index={2}
                icon={Shield}
                title="Security First"
                description="Industry-leading security with multi-layer encryption and fraud protection."
                image={SecurityFeatures}
              />
              <FeatureCard
                index={3}
                icon={Smartphone}
                title="Digital Banking"
                description="Access your accounts anytime, anywhere with our mobile and web platforms."
                image={MobileApp}
              />
              <FeatureCard
                index={4}
                icon={Briefcase}
                title="Business Solutions"
                description="Customized financial solutions for SMEs and corporate clients."
                image={BusinessSolutions}
              />
              <FeatureCard
                index={5}
                icon={Globe}
                title="Customer Service"
                description="Send money globally with competitive rates and fast transfers."
                image={CustomerService}
              />
            </div>
          </div>
        </section>

        {/* ===== FEATURES BREAKDOWN ===== */}
        <section className="py-16 sm:py-24 bg-secondary/5">
          <div className="container mx-auto max-w-6xl px-4">
            {/* Tabs */}
            <div className="flex gap-4 mb-12 border-b border-secondary">
              {["personal", "business", "premium"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-bold text-sm sm:text-base transition-all border-b-2 capitalize ${
                    activeTab === tab
                      ? "text-basic border-basic"
                      : "text-secondary opacity-60 border-transparent hover:opacity-100"
                  }`}
                >
                  {tab} Banking
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div
              key={activeTab}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
            >
              {/* Left: Benefits List */}
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-secondary mb-6">
                  {activeTab === "personal" && "Everything You Need"}
                  {activeTab === "business" && "Grow Your Business"}
                  {activeTab === "premium" && "Premium Experience"}
                </h3>

                <div className="space-y-4">
                  {[
                    "Competitive interest rates",
                    "Zero monthly maintenance fees",
                    "24/7 customer support",
                    "Advanced mobile app",
                    "Multi-currency accounts",
                    "Investment tools included",
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle
                        size={20}
                        className="text-basic flex-shrink-0"
                      />
                      <span className="text-secondary font-semibold">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>

                <button className="mt-8 px-6 py-3 bg-basic text-primary font-bold rounded-sm hover:shadow-lg hover:scale-105 transition-all active:scale-95">
                  Learn More
                </button>
              </div>

              {/* Right: Image/Icon */}
              <div className="relative h-96 bg-gradient-to-br from-basic/20 to-basic/5 rounded-sm border border-basic/30 overflow-hidden">
                {activeTab === "personal" && (
                  <img
                    src={PersonalBanking}
                    alt="Personal Banking"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
                {activeTab === "business" && (
                  <img
                    src={BusinessSolutions}
                    alt="Business Solutions"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
                {activeTab === "premium" && (
                  <img
                    src={InvestmentTools}
                    alt="Premium Services"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ===== TESTIMONIALS SECTION ===== */}
        <section className="py-16 sm:py-24 bg-primary">
          <div className="container mx-auto max-w-6xl px-4">
            <div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block px-4 py-2 bg-basic/20 text-basic rounded-full text-sm font-bold mb-4">
                CLIENT STORIES
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-secondary mb-4">
                What Our Customers Say
              </h2>
              <p className="text-lg text-secondary opacity-70 max-w-2xl mx-auto">
                Real feedback from our satisfied customers worldwide
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TestimonialCard
                index={0}
                name="Sarah Johnson"
                role="Business Owner"
                text="Summit Ridge Credit Union has transformed the way I manage my business finances. The mobile app is intuitive and support is always available."
                image={Testimonial1}
              />
              <TestimonialCard
                index={1}
                name="Marcus Chen"
                role="Investor"
                text="Excellent investment tools and competitive rates. I've grown my portfolio significantly with their expert guidance."
                image={Testimonial2}
              />
              <TestimonialCard
                index={2}
                name="Elena Rodriguez"
                role="Entrepreneur"
                text="The best banking experience I've had. International transfers are seamless and fees are transparent."
                image={Testimonial3}
              />
              <TestimonialCard
                index={3}
                name="James Wilson"
                role="Financial Manager"
                text="Professional service, reliable platform, and competitive rates. Highly recommended for corporate accounts."
                image={Testimonial4}
              />
              <TestimonialCard
                index={4}
                name="Priya Patel"
                role="Tech Founder"
                text="Amazing customer support and innovative features. They understand what modern businesses need."
                image={Testimonial5}
              />
              <TestimonialCard
                index={5}
                name="David O'Brien"
                role="Consultant"
                text="Switched to Summit Ridge Credit Union and never looked back. Security, speed, and service excellence."
                image={Testimonial6}
              />
            </div>
          </div>
        </section>

        {/* ===== PRICING SECTION ===== */}
        <section className="py-16 sm:py-24 bg-secondary/5">
          <div className="container mx-auto max-w-6xl px-4">
            <div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-black text-secondary mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-secondary opacity-70 max-w-2xl mx-auto">
                Choose the plan that fits your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PricingTier
                index={0}
                name="Starter"
                price="Free"
                highlighted={false}
                features={[
                  "Unlimited transactions",
                  "Mobile banking app",
                  "24/7 support",
                  "Security features",
                ]}
              />
              <PricingTier
                index={1}
                name="Professional"
                price="$9.99"
                highlighted={true}
                features={[
                  "Everything in Starter",
                  "Investment tools",
                  "Multi-currency",
                  "Priority support",
                  "Advanced analytics",
                ]}
              />
              <PricingTier
                index={2}
                name="Enterprise"
                price="Custom"
                highlighted={false}
                features={[
                  "Everything in Professional",
                  "Dedicated account manager",
                  "Custom solutions",
                  "API access",
                  "White-label options",
                ]}
              />
            </div>
          </div>
        </section>

        {/* ===== BLOG SECTION ===== */}
        <section className="py-16 sm:py-24 bg-primary">
          <div className="container mx-auto max-w-6xl px-4">
            <div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-16 flex-col sm:flex-row gap-4"
            >
              <div>
                <span className="inline-block px-4 py-2 bg-basic/20 text-basic rounded-full text-sm font-bold mb-4">
                  LATEST INSIGHTS
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-secondary">
                  Financial Tips & Updates
                </h2>
              </div>
              <Link
                to="/blog"
                className="flex items-center gap-2 text-basic font-bold hover:gap-3 transition-all"
              >
                View All <ArrowRight size={20} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <BlogCard
                index={0}
                title="5 Smart Money Management Tips for 2026"
                excerpt="Learn how to maximize your savings and investments with these practical strategies."
                date="Jan 15, 2026"
                category="Finance"
                image={BlogFinance}
              />
              <BlogCard
                index={1}
                title="The Future of Digital Banking"
                excerpt="Discover how technology is reshaping the banking industry and what it means for you."
                date="Jan 12, 2026"
                category="Technology"
                image={BlogTechnology}
              />
              <BlogCard
                index={2}
                title="International Transfer Guide"
                excerpt="Complete guide to sending money abroad with Summit Ridge Credit Union - fast, secure, and transparent."
                date="Jan 10, 2026"
                category="Guide"
                image={BlogGuide}
              />
            </div>
          </div>
        </section>

        {/* ===== FAQ SECTION ===== */}
        <section className="py-16 sm:py-24 bg-secondary/5">
          <div className="container mx-auto max-w-3xl px-4">
            <div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-black text-secondary mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-secondary opacity-70">
                Find answers to common questions
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "How do I open an account?",
                  a: "Click 'Get Started', fill in your information, and verify your identity. Your account will be ready in minutes.",
                },
                {
                  q: "Is my money safe?",
                  a: "Yes. We use bank-level encryption and are regulated by financial authorities. Your deposits are insured.",
                },
                {
                  q: "What are the fees?",
                  a: "Most accounts have zero monthly fees. Investment products and international transfers have transparent, competitive rates.",
                },
                {
                  q: "Can I access my account on mobile?",
                  a: "Yes. Download our app from iOS or Android and access your account 24/7 with full functionality.",
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="bg-primary rounded-sm border border-secondary p-6 hover:border-basic transition-colors group cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-bold text-secondary group-hover:text-basic transition-colors">
                      {faq.q}
                    </h3>
                    <ChevronDown
                      size={20}
                      className="text-secondary flex-shrink-0"
                    />
                  </div>
                  <p className="text-secondary opacity-70 mt-3 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA SECTION ===== */}
        <section className="py-16 sm:py-24 bg-gradient-to-r from-basic to-basic/90 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 container mx-auto max-w-4xl px-4 text-center">
            <div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-black text-primary mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-primary/90 mb-8 max-w-2xl mx-auto">
                Join millions of customers who trust Summit Ridge Credit Union.
                Open your account in minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/auth/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-basic font-bold rounded-sm hover:shadow-2xl hover:scale-105 transition-all active:scale-95 group"
                >
                  Open Account Now
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                </Link>
                <button className="px-8 py-4 border-2 border-primary text-primary font-bold rounded-sm hover:bg-primary/20 transition-all">
                  Banking Panel
                </button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

