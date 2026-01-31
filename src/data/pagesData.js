// ============================================================================
// IMAGE IMPORTS
// ============================================================================
import HeroImage from "../assets/images/ABN_AMRO_DEF_juni_2025__Hannie_Verhoeven_Fotograaf013_hero-9351547348dd.jpg";
import PersonalBanking from "../assets/images/Banking_for_better_for_generation.jpg";
import BusinessSolutions from "../assets/images/01_AA-PageHero__1920x1000px.jpg";
import InvestmentTools from "../assets/images/image3.png";
import SecurityFeatures from "../assets/images/IMG_6786.jpg";
import MobileApp from "../assets/images/H_ABN_Amro_BB_View_7_-_Vanaf_entree_strategiepagina.png";
import CustomerService from "../assets/images/Infographic_Tikkie2025_med.jpg";
import BlogFinance from "../assets/images/Judith_doorloop_1.jpg";
import BlogTechnology from "../assets/images/Portrait_MÃ_lanie_Guerrato2.jpg";
import BlogGuide from "../assets/images/testimonial-6.jpeg";
import Testimonial1 from "../assets/images/testimonial-1.jpg";
import Testimonial2 from "../assets/images/testimonial-2.jpg";
import Testimonial3 from "../assets/images/testimonial-3.jpeg";
import Testimonial4 from "../assets/images/testimonial-4.jpg";
import Testimonial5 from "../assets/images/testimonial-5.jpeg";
import Testimonial6 from "../assets/images/testimonial-6.jpeg";

// ============================================================================
// PAGES DATA - COMPREHENSIVE & ROBUST
// ============================================================================

export const pagesData = [
    {
        slug: "services",
        title: "Our Services",
        seo: {
            title: "Comprehensive Financial Services | Summit Ridge Credit Union",
            description: "Explore Summit Ridge Credit Union's full range of banking, investment, and business solutions tailored to your needs.",
            keywords: "banking services, investments, personal banking, business solutions, digital banking",
        },
        settings: {
            requiresAuth: false,
            layout: "default",
            showBreadcrumb: true,
        },
        sections: [
            {
                type: "hero",
                props: {
                    heading: "Comprehensive Financial Services",
                    subtext: "Tailored solutions for every stage of your financial journey. From personal banking to enterprise solutions.",
                    image: BusinessSolutions,
                },
            },
            {
                type: "text",
                props: {
                    content: `At Summit Ridge Credit Union, we offer a complete ecosystem of financial services designed to support individuals, businesses, and institutions. 
          With over 150 years of experience, we've refined our offerings to deliver cutting-edge technology, security, and personalized service.
          Whether you're starting your financial journey or managing complex portfolios, we have the expertise and tools to help you succeed.`,
                    alignment: "center",
                },
            },
            {
                type: "features",
                props: {
                    title: "What We Offer",
                    features: [
                        {
                            icon: "CreditCard",
                            title: "Personal Banking",
                            description: "User-friendly accounts, savings plans, and investment solutions designed for your personal goals.",
                            link: "/personal-banking",
                        },
                        {
                            icon: "TrendingUp",
                            title: "Investment Services",
                            description: "Professional investment management and access to 500+ global funds, stocks, and securities.",
                            link: "/investment-service",
                        },
                        {
                            icon: "Smartphone",
                            title: "Digital Banking",
                            description: "Access your accounts anytime, anywhere with our award-winning mobile and web platforms.",
                            link: "/digital-banking",
                        },
                        {
                            icon: "Briefcase",
                            title: "Business Solutions",
                            description: "Customized financial solutions including lending, trade finance, and cash management for SMEs.",
                            link: "/business-solution",
                        },
                        {
                            icon: "Shield",
                            title: "Security First",
                            description: "Bank-level encryption, multi-factor authentication, and 24/7 fraud monitoring.",
                            link: "/security",
                        },
                        {
                            icon: "Globe",
                            title: "International Transfers",
                            description: "Send money to 150+ countries with competitive rates and fast processing.",
                            link: "/international-transfers",
                        },
                        {
                            icon: "Heart",
                            title: "Wealth Management",
                            description: "Dedicated advisors for personalized wealth planning and portfolio optimization.",
                            link: "/wealth-management",
                        },
                        {
                            icon: "Lock",
                            title: "Private Banking",
                            description: "Exclusive services for high-net-worth individuals with premium concierge support.",
                            link: "/private-banking",
                        },
                        {
                            icon: "Users",
                            title: "Corporate Banking",
                            description: "Enterprise-grade solutions for large organizations and financial institutions.",
                            link: "/corporate-banking",
                        },
                    ],
                },
            },
            {
                type: "cta",
                props: {
                    heading: "Ready to Explore Our Services?",
                    subtext: "Open your account today and discover the Summit Ridge Credit Union difference.",
                    buttonText: "Get Started",
                    buttonSlug: "signup",
                    isDark: false,
                },
            },
        ],
    },

    {
        slug: "about",
        title: "About Summit Ridge Credit Union",
        seo: {
            title: "About Summit Ridge Credit Union | 150+ Years of Banking Excellence",
            description: "Learn about Summit Ridge Credit Union's history, mission, values, and commitment to sustainable banking.",
            keywords: "about Summit Ridge Credit Union, banking history, company values, sustainability, ESG",
        },
        settings: {
            requiresAuth: false,
            layout: "default",
            showBreadcrumb: true,
        },
        sections: [
            {
                type: "hero",
                props: {
                    heading: "About Summit Ridge Credit Union, Why our customers trust us?",
                    subtext: "Over 150 years of trust, innovation, and financial excellence serving millions worldwide.",
                    image: HeroImage,
                },
            },
            {
                type: "text",
                props: {
                    content: `Summit Ridge Credit Union Bank was founded in 1824 and has grown to become one of Europe's leading financial institutions. 
          With operations in 50+ countries and serving over 8 million customers, we combine deep local expertise with global capabilities.
          Our mission is to empower individuals and businesses to achieve their financial aspirations through innovative solutions,
          trusted advice, and unwavering commitment to security and integrity.`,
                    alignment: "center",
                },
            },
            {
                type: "features",
                props: {
                    title: "Our Core Values",
                    features: [
                        {
                            icon: "Heart",
                            title: "Customer First",
                            description: "We prioritize your needs and deliver solutions tailored to your unique circumstances and goals.",
                        },
                        {
                            icon: "Shield",
                            title: "Trust & Security",
                            description: "Your financial security is our paramount concern. Industry-leading protection and regulatory compliance.",
                        },
                        {
                            icon: "Zap",
                            title: "Innovation",
                            description: "We continuously evolve to serve you better with cutting-edge fintech and digital transformation.",
                        },
                        {
                            icon: "Globe",
                            title: "Sustainability",
                            description: "Committed to responsible banking, environmental stewardship, and positive social impact.",
                        },
                        {
                            icon: "Users",
                            title: "Diversity & Inclusion",
                            description: "We celebrate diversity and foster an inclusive workplace where all voices are valued.",
                        },
                        {
                            icon: "TrendingUp",
                            title: "Integrity & Excellence",
                            description: "Transparent operations, ethical practices, and a commitment to exceeding expectations.",
                        },
                    ],
                },
            },
            {
                type: "faq",
                props: {
                    title: "Frequently Asked About Us",
                    faqs: [
                        {
                            q: "When was Summit Ridge Credit Union founded?",
                            a: "Summit Ridge Credit Union was established in 1824, making us one of Europe's oldest and most trusted financial institutions.",
                        },
                        {
                            q: "How many customers do you serve?",
                            a: "We serve over 8 million customers across 50+ countries, managing â‚¬2.3 trillion in assets.",
                        },
                        {
                            q: "Is Summit Ridge Credit Union regulated?",
                            a: "Yes, we are regulated by the European Central Bank and the Dutch Financial Authority, ensuring the highest standards of oversight.",
                        },
                        {
                            q: "What is your commitment to sustainability?",
                            a: "We are committed to carbon-neutral operations by 2030 and actively support renewable energy and sustainable finance initiatives.",
                        },
                        {
                            q: "How do you protect customer data?",
                            a: "We use bank-level encryption, multi-factor authentication, and continuous security monitoring to protect your data.",
                        },
                        {
                            q: "Can I work at Summit Ridge Credit Union?",
                            a: "Yes! We hire talented professionals worldwide. Visit our careers page to explore current openings.",
                        },
                    ],
                },
            },
            {
                type: "cta",
                props: {
                    heading: "Join Our Community",
                    subtext: "Become part of millions of satisfied customers and discover the Summit Ridge Credit Union advantage.",
                    buttonText: "Open an Account",
                    buttonSlug: "signup",
                    isDark: true,
                },
            },
        ],
    },

    {
        slug: "faq",
        title: "Frequently Asked Questions",
        seo: {
            title: "FAQ | Summit Ridge Credit Union - Answers to Your Banking Questions",
            description: "Find answers to common questions about accounts, security, fees, and our services.",
            keywords: "FAQ, frequently asked questions, banking questions, account help, customer support",
        },
        settings: {
            requiresAuth: false,
            layout: "faq",
            showBreadcrumb: true,
        },
        sections: [
            {
                type: "hero",
                props: {
                    heading: "We're Here to Help",
                    subtext: "Find answers to your most common questions about banking, accounts, and our services.",
                    image: null,
                },
            },
            {
                type: "faq",
                props: {
                    title: "Account & Opening",
                    faqs: [
                        {
                            q: "How do I open an account?",
                            a: "Visit our website, click 'Get Started', provide your personal information, and complete identity verification. Your account will be ready in minutes with no paperwork required.",
                        },
                        {
                            q: "What documents do I need to open an account?",
                            a: "You'll need a valid government-issued ID and proof of address. We accept passports, driver's licenses, and residence permits.",
                        },
                        {
                            q: "Is there a minimum balance requirement?",
                            a: "No, our basic accounts have no minimum balance. Some premium products may have specific requirements listed upfront.",
                        },
                        {
                            q: "Can I open an account online?",
                            a: "Yes, our entire account opening process is available online and mobile. You can complete it in 5-10 minutes from home.",
                        },
                        {
                            q: "What is the age requirement?",
                            a: "You must be at least 18 years old to open a personal account. Youth accounts are available for ages 10-17 with parental consent.",
                        },
                    ],
                },
            },
            {
                type: "faq",
                props: {
                    title: "Security & Safety",
                    faqs: [
                        {
                            q: "Is my money safe?",
                            a: "Yes. We use bank-level encryption, are regulated by the ECB and AFM, and deposits are protected by the DGS up to â‚¬100,000 per person per bank.",
                        },
                        {
                            q: "How do you protect against fraud?",
                            a: "We employ 24/7 fraud monitoring, AI-powered detection systems, and multi-factor authentication to prevent unauthorized access.",
                        },
                        {
                            q: "What should I do if I suspect fraud?",
                            a: "Contact us immediately via our app, website, or phone (+31 20 104 6000). We can freeze accounts and investigate within 24 hours.",
                        },
                        {
                            q: "Is the mobile app secure?",
                            a: "Yes, our app uses bank-grade encryption, biometric authentication, and advanced security protocols.",
                        },
                        {
                            q: "Can I use Summit Ridge Credit Union abroad?",
                            a: "Yes, our debit and credit cards work worldwide. Notify us of travel plans to ensure seamless access.",
                        },
                    ],
                },
            },
            {
                type: "faq",
                props: {
                    title: "Fees & Charges",
                    faqs: [
                        {
                            q: "What are the fees?",
                            a: "Most personal accounts have zero monthly fees. Investment products and international transfers have transparent, competitive rates displayed upfront. No hidden charges.",
                        },
                        {
                            q: "Are there ATM fees?",
                            a: "ATM withdrawals are free at all Summit Ridge Credit Union ATMs. Third-party ATM fees vary by network; check before withdrawing.",
                        },
                        {
                            q: "How much do international transfers cost?",
                            a: "Competitive rates starting from â‚¬2.50 per transfer. Rates depend on destination and amount; check our pricing page.",
                        },
                        {
                            q: "Is there an overdraft fee?",
                            a: "Overdraft fees apply if you exceed your account limits. We offer optional overdraft protection to prevent fees.",
                        },
                        {
                            q: "Do you charge inactivity fees?",
                            a: "No inactivity fees. Your account remains active indefinitely as long as you maintain the required minimum balance.",
                        },
                    ],
                },
            },
            {
                type: "faq",
                props: {
                    title: "Digital Banking & Apps",
                    faqs: [
                        {
                            q: "Can I use the mobile app?",
                            a: "Yes. Download our app from iOS or Android and access your account anytime with full functionality, offline features, and push notifications.",
                        },
                        {
                            q: "What can I do in the mobile app?",
                            a: "View balances, transfer money, pay bills, deposit checks (mobile), apply for loans, manage investments, and contact supportâ€”all from one place.",
                        },
                        {
                            q: "How do I reset my login password?",
                            a: "Click 'Forgot Password' on the login screen, verify your identity, and set a new password. You can also call support for assistance.",
                        },
                        {
                            q: "Is the web banking platform secure?",
                            a: "Yes, we use HTTPS encryption, SSL certificates, and multi-factor authentication. Always use official Summit Ridge Credit Union domains.",
                        },
                        {
                            q: "Can I set up automatic bill payments?",
                            a: "Yes, you can schedule recurring payments and one-time transfers in the app or web platform.",
                        },
                    ],
                },
            },
            {
                type: "cta",
                props: {
                    heading: "Still Have Questions?",
                    subtext: "Our 24/7 support team is ready to help. Contact us anytime.",
                    buttonText: "Contact Support",
                    buttonSlug: "support",
                    isDark: false,
                },
            },
        ],
    },

    {
        slug: "support",
        title: "Customer Support",
        seo: {
            title: "Customer Support | Summit Ridge Credit Union - 24/7 Assistance",
            description: "Get help from our 24/7 customer support team via chat, email, phone, or knowledge base.",
            keywords: "customer support, help, contact, chat support, customer service",
        },
        settings: {
            requiresAuth: false,
            layout: "default",
            showBreadcrumb: true,
        },
        sections: [
            {
                type: "hero",
                props: {
                    heading: "We're Here for You",
                    subtext: "24/7 support via multiple channels to help you succeed.",
                    image: null,
                },
            },
            {
                type: "text",
                props: {
                    content: `Our dedicated support team is available around the clock to assist you with any questions, technical issues, 
          or concerns. Whether you're a new customer or longtime client, we're committed to providing fast, friendly, and professional service.`,
                    alignment: "center",
                },
            },
            {
                type: "features",
                props: {
                    title: "Support Channels",
                    features: [
                        {
                            icon: "MessageCircle",
                            title: "Live Chat",
                            description: "Get instant help from our support team. Available 24/7 for urgent issues and general questions.",
                        },
                        {
                            icon: "Mail",
                            title: "Email Support",
                            description: "Send your questions to support@summitridgecreditunion.cc. We respond within 4 business hours.",
                        },
                        {
                            icon: "Phone",
                            title: "Phone Support",
                            description: "Call us at +31 20 104 6000 for immediate assistance. Available Monday-Friday, 8 AM - 8 PM CET.",
                        },
                        {
                            icon: "FileText",
                            title: "Knowledge Base",
                            description: "Browse our comprehensive guides, tutorials, and FAQs for self-service help.",
                        },
                        {
                            icon: "Users",
                            title: "Community Forum",
                            description: "Connect with other customers, share tips, ask questions, and get peer support.",
                        },
                        {
                            icon: "CheckCircle",
                            title: "Status Updates",
                            description: "Check real-time system status, maintenance schedules, and service updates.",
                        },
                    ],
                },
            },
            {
                type: "faq",
                props: {
                    title: "Support FAQs",
                    faqs: [
                        {
                            q: "What are your support hours?",
                            a: "We offer 24/7 live chat and app support. Phone support is available Monday-Friday 8 AM - 8 PM CET, Saturday 10 AM - 4 PM CET.",
                        },
                        {
                            q: "How long does it take to resolve issues?",
                            a: "Most issues are resolved within 24 hours. Critical security issues are addressed within 2 hours.",
                        },
                        {
                            q: "Can I schedule a callback?",
                            a: "Yes, you can request a callback in the app or website. We'll contact you at your preferred time.",
                        },
                        {
                            q: "How do I report a security issue?",
                            a: "Contact us immediately via phone or email. Do NOT reply to suspicious emails or click unknown links.",
                        },
                        {
                            q: "Is support available in other languages?",
                            a: "Yes, we provide support in English, Dutch, Spanish, German, and French.",
                        },
                    ],
                },
            },
            {
                type: "cta",
                props: {
                    heading: "Need Help Right Now?",
                    subtext: "Start a live chat session with our support team or call us directly.",
                    buttonText: "Start Live Chat",
                    buttonSlug: null,
                    isDark: false,
                },
            },
        ],
    },

    {
        slug: "careers",
        title: "Join Our Team",
        seo: {
            title: "Careers at Summit Ridge Credit Union | Join Our Team",
            description: "Explore career opportunities at Summit Ridge Credit Union. Competitive pay, professional development, and inclusive culture.",
            keywords: "careers, jobs, employment, Summit Ridge Credit Union careers, financial careers",
        },
        settings: {
            requiresAuth: false,
            layout: "default",
            showBreadcrumb: true,
        },
        sections: [
            {
                type: "hero",
                props: {
                    heading: "Careers at Summit Ridge Credit Union",
                    subtext: "Build your future with a trusted global financial leader.",
                    image: BlogTechnology,
                },
            },
            {
                type: "text",
                props: {
                    content: `At Summit Ridge Credit Union, we believe our people are our greatest asset. We offer competitive compensation, professional development, 
          and a collaborative culture where innovation thrives. Join us and make a difference in the world of finance.`,
                    alignment: "center",
                },
            },
            {
                type: "features",
                props: {
                    title: "Why Work With Us?",
                    features: [
                        {
                            icon: "TrendingUp",
                            title: "Career Growth",
                            description: "Clear paths to advancement with mentorship, training programs, and leadership development.",
                        },
                        {
                            icon: "Heart",
                            title: "Work-Life Balance",
                            description: "Flexible schedules, remote options, 25+ days annual leave, and generous wellness benefits.",
                        },
                        {
                            icon: "Globe",
                            title: "Global Opportunities",
                            description: "Work across 50+ countries with diverse teams and international project exposure.",
                        },
                        {
                            icon: "Zap",
                            title: "Innovation Culture",
                            description: "Be part of cutting-edge fintech initiatives and digital transformation projects.",
                        },
                        {
                            icon: "Shield",
                            title: "Security & Benefits",
                            description: "Competitive salary, comprehensive health insurance, pension, and employee stock options.",
                        },
                        {
                            icon: "Users",
                            title: "Diversity & Inclusion",
                            description: "We celebrate differences and foster an inclusive workplace for all backgrounds.",
                        },
                    ],
                },
            },
            {
                type: "faq",
                props: {
                    title: "Career FAQs",
                    faqs: [
                        {
                            q: "What positions are currently open?",
                            a: "We're hiring for roles in technology, risk management, client relations, and more. Check our careers portal for current openings.",
                        },
                        {
                            q: "Do you offer internships?",
                            a: "Yes, we offer competitive internship programs for students. Applications open twice yearly.",
                        },
                        {
                            q: "What is the application process?",
                            a: "Apply online via our careers portal. We review applications within 2 weeks and conduct interviews for selected candidates.",
                        },
                        {
                            q: "Do you sponsor visa applications?",
                            a: "Yes, we support visa sponsorship for qualified international candidates in specific roles.",
                        },
                        {
                            q: "What is the company culture like?",
                            a: "We value collaboration, innovation, and integrity. Our culture emphasizes continuous learning and diversity.",
                        },
                    ],
                },
            },
            {
                type: "cta",
                props: {
                    heading: "Ready to Join Us?",
                    subtext: "Explore open positions and submit your application today.",
                    buttonText: "View Open Positions",
                    buttonSlug: null,
                    isDark: true,
                },
            },
        ],
    },

    {
        slug: "sustainability",
        title: "Sustainability & ESG",
        seo: {
            title: "Sustainability & ESG | Summit Ridge Credit Union - Banking for Better",
            description: "Learn about Summit Ridge Credit Union's environmental, social, and governance commitments.",
            keywords: "sustainability, ESG, environmental, social responsibility, green banking",
        },
        settings: {
            requiresAuth: false,
            layout: "default",
            showBreadcrumb: true,
        },
        sections: [
            {
                type: "hero",
                props: {
                    heading: "Banking for a Better Future",
                    subtext: "Committed to responsible finance and environmental stewardship.",
                    image: InvestmentTools,
                },
            },
            {
                type: "text",
                props: {
                    content: `Summit Ridge Credit Union is committed to sustainable banking practices. We integrate environmental, social, and governance (ESG) 
          principles into all our operations. From reducing carbon emissions to supporting ethical business practices, 
          we're dedicated to creating positive impact for society and the planet.`,
                    alignment: "center",
                },
            },
            {
                type: "features",
                props: {
                    title: "Our ESG Initiatives",
                    features: [
                        {
                            icon: "Leaf",
                            title: "Environmental Impact",
                            description: "Carbon-neutral operations by 2030. Green financing for renewable energy and climate projects.",
                        },
                        {
                            icon: "Users",
                            title: "Social Responsibility",
                            description: "Community support programs, financial education, and inclusive banking for underserved populations.",
                        },
                        {
                            icon: "Shield",
                            title: "Governance Excellence",
                            description: "Transparent reporting, ethical standards, robust compliance, and anti-corruption measures.",
                        },
                        {
                            icon: "Globe",
                            title: "Global Standards",
                            description: "Alignment with UN Sustainable Development Goals and international best practices.",
                        },
                        {
                            icon: "Zap",
                            title: "Green Technology",
                            description: "Investment in sustainable tech, renewable energy infrastructure, and paperless operations.",
                        },
                        {
                            icon: "Heart",
                            title: "Community Impact",
                            description: "Supporting nonprofits, social enterprises, and volunteering in local communities.",
                        },
                    ],
                },
            },
            {
                type: "faq",
                props: {
                    title: "Sustainability FAQs",
                    faqs: [
                        {
                            q: "What is your carbon neutrality target?",
                            a: "We aim to achieve carbon-neutral operations across our business by 2030.",
                        },
                        {
                            q: "How do you measure ESG impact?",
                            a: "We use established frameworks including SASB, TCFD, and GRI standards for transparent reporting.",
                        },
                        {
                            q: "Do you finance fossil fuels?",
                            a: "We are phasing out coal financing and have strict environmental criteria for new energy projects.",
                        },
                        {
                            q: "How do you support renewable energy?",
                            a: "We provide dedicated green financing packages for wind, solar, and hydroelectric projects.",
                        },
                        {
                            q: "Can customers invest in ESG funds?",
                            a: "Yes, we offer a range of ESG-focused investment funds and impact investing options.",
                        },
                    ],
                },
            },
            {
                type: "cta",
                props: {
                    heading: "Learn More About Our Impact",
                    subtext: "Read our latest sustainability report and ESG disclosures.",
                    buttonText: "Download Report",
                    buttonSlug: null,
                    isDark: false,
                },
            },
        ],
    },

    {
        slug: "private-banking",
        title: "Private Banking",
        seo: {
            title: "Private Banking | Summit Ridge Credit Union - Wealth Management for HNWIs",
            description: "Premium banking services for high-net-worth individuals. Wealth management, personalized advisory, and exclusive benefits.",
            keywords: "private banking, wealth management, high-net-worth, investment advisory, personal banker",
        },
        settings: {
            requiresAuth: false,
            layout: "default",
            showBreadcrumb: true,
        },
        sections: [
            {
                type: "hero",
                props: {
                    heading: "Premium Banking for High-Net-Worth Individuals",
                    subtext: "Exclusive wealth management and bespoke financial solutions tailored to you.",
                    image: SecurityFeatures,
                },
            },
            {
                type: "text",
                props: {
                    content: `Our private banking service offers personalized wealth management, investment advisory, and comprehensive financial planning 
          tailored to your unique needs. Benefit from dedicated relationship managers available 24/7, priority service, and exclusive investment 
          opportunities not available to the general public.`,
                    alignment: "center",
                },
            },
            {
                type: "features",
                props: {
                    title: "Exclusive Services",
                    features: [
                        {
                            icon: "User",
                            title: "Dedicated Relationship Manager",
                            description: "Personal advisor available 24/7 to manage your wealth and guide your financial decisions.",
                        },
                        {
                            icon: "TrendingUp",
                            title: "Investment Management",
                            description: "Access to exclusive investment funds, real estate opportunities, and alternative assets.",
                        },
                        {
                            icon: "FileText",
                            title: "Financial Planning",
                            description: "Comprehensive wealth planning, tax optimization, estate planning, and succession strategies.",
                        },
                        {
                            icon: "CreditCard",
                            title: "Premium Card Benefits",
                            description: "Exclusive Visa Infinite cards with airport lounges, concierge services, and premium insurance.",
                        },
                        {
                            icon: "Globe",
                            title: "International Services",
                            description: "Seamless multi-currency management, international relocation support, and cross-border services.",
                        },
                        {
                            icon: "Lock",
                            title: "Enhanced Security",
                            description: "Advanced security protocols, white-glove custody solutions, and dedicated compliance team.",
                        },
                    ],
                },
            },
            {
                type: "faq",
                props: {
                    title: "Private Banking FAQs",
                    faqs: [
                        {
                            q: "What is the minimum investment for private banking?",
                            a: "Our private banking services are available for clients with assets of â‚¬500,000 or more.",
                        },
                        {
                            q: "How is my portfolio managed?",
                            a: "Your dedicated advisor creates a customized strategy aligned with your goals, risk tolerance, and time Summit.",
                        },
                        {
                            q: "What investment options are available?",
                            a: "Access to stocks, bonds, real estate, alternative investments, managed funds, and bespoke vehicles.",
                        },
                        {
                            q: "How much does private banking cost?",
                            a: "Fees are transparent and based on assets under management, typically 0.5-1.5% annually depending on service level.",
                        },
                        {
                            q: "Can I access my funds quickly?",
                            a: "Yes, we ensure liquidity while maintaining your long-term strategy. Most redemptions process within 2-3 business days.",
                        },
                    ],
                },
            },
            {
                type: "cta",
                props: {
                    heading: "Discover Private Banking Excellence",
                    subtext: "Schedule a consultation with our private banking specialists.",
                    buttonText: "Request Consultation",
                    buttonSlug: "support",
                    isDark: true,
                },
            },
        ],
    },

    {
        slug: "business-solution",
        title: "Business Solutions",
        seo: {
            title: "Business Solutions | Summit Ridge Credit Union - Banking for SMEs & Enterprises",
            description: "Comprehensive business banking solutions. Lending, trade finance, cash management, and tailored services for growth.",
            keywords: "business banking, SME banking, corporate banking, lending, trade finance, business solutions",
        },
        settings: {
            requiresAuth: false,
            layout: "default",
            showBreadcrumb: true,
        },
        sections: [
            {
                type: "hero",
                props: {
                    heading: "Solutions Built for Business Growth",
                    subtext: "Comprehensive financial services for SMEs and enterprises.",
                    image: BusinessSolutions,
                },
            },
            {
                type: "text",
                props: {
                    content: `Summit Ridge Credit Union provides tailored business banking solutions designed to accelerate growth. From working capital solutions 
          to supply chain financing, we support your business at every stage. Our expert team understands the challenges of growing businesses 
          and provides personalized guidance and tools to help you succeed.`,
                    alignment: "center",
                },
            },
            {
                type: "features",
                props: {
                    title: "Business Services",
                    features: [
                        {
                            icon: "Briefcase",
                            title: "Corporate Accounts",
                            description: "Multi-currency accounts with competitive rates, unlimited transactions, and advanced controls.",
                        },
                        {
                            icon: "TrendingUp",
                            title: "Lending Solutions",
                            description: "Term loans, overdrafts, revolving credit lines, and growth financing for expansion.",
                        },
                        {
                            icon: "FileText",
                            title: "Trade Finance",
                            description: "Letters of credit, guarantees, export financing, and supply chain solutions.",
                        },
                        {
                            icon: "Smartphone",
                            title: "Digital Tools",
                            description: "Business mobile app, API integration, automated payroll, and treasury management.",
                        },
                        {
                            icon: "Users",
                            title: "Dedicated Support",
                            description: "Business relationship manager and dedicated support team available for your needs.",
                        },
                        {
                            icon: "Lock",
                            title: "Cash Management",
                            description: "Liquidity management, working capital optimization, and financial forecasting tools.",
                        },
                    ],
                },
            },
            {
                type: "faq",
                props: {
                    title: "Business Banking FAQs",
                    faqs: [
                        {
                            q: "What types of businesses can open an account?",
                            a: "We serve sole proprietors, partnerships, startups, SMEs, and large corporations across all industries.",
                        },
                        {
                            q: "How quickly can I get a business loan?",
                            a: "Application processing takes 5-10 business days. We can provide pre-approval in 24 hours for qualified applicants.",
                        },
                        {
                            q: "What are the lending requirements?",
                            a: "Requirements vary by business size and type. We review business plan, financial statements, and collateral options.",
                        },
                        {
                            q: "Do you offer payroll services?",
                            a: "Yes, we provide integrated payroll processing, tax withholding, and employee payment solutions.",
                        },
                        {
                            q: "Can I get a dedicated accountant?",
                            a: "Large corporate clients receive a dedicated relationship manager and access to advisory services.",
                        },
                    ],
                },
            },
            {
                type: "cta",
                props: {
                    heading: "Grow Your Business With Us",
                    subtext: "Talk to our business banking team about your growth plans.",
                    buttonText: "Contact Business Team",
                    buttonSlug: "support",
                    isDark: false,
                },
            },
        ],
    },

    {
        slug: "investment-service",
        title: "Investment Services",
        seo: {
            title: "Investment Services | Summit Ridge Credit Union - Grow Your Wealth",
            description: "Professional investment management and access to 500+ global funds, stocks, and securities.",
            keywords: "investment services, portfolio management, stocks, bonds, mutual funds, wealth building",
        },
        settings: {
            requiresAuth: false,
            layout: "default",
            showBreadcrumb: true,
        },
        sections: [
            {
                type: "hero",
                props: {
                    heading: "Invest for Your Future",
                    subtext: "Professional investment management and expert financial guidance.",
                    image: InvestmentTools,
                },
            },
            {
                type: "text",
                props: {
                    content: `Build and grow your wealth with Summit Ridge Credit Union's investment services. Our expert advisors help you create a diversified 
          portfolio aligned with your goals, risk profile, and time Summit. Whether you're a beginner investor or experienced trader, 
          we have the tools, knowledge, and support to help you succeed.`,
                    alignment: "center",
                },
            },
            {
                type: "features",
                props: {
                    title: "Investment Options",
                    features: [
                        {
                            icon: "TrendingUp",
                            title: "Wealth Management",
                            description: "Customized portfolio management from certified financial experts.",
                        },
                        {
                            icon: "Globe",
                            title: "Global Funds",
                            description: "Access to 500+ mutual funds, ETFs, and bonds across global markets.",
                        },
                        {
                            icon: "CreditCard",
                            title: "Stocks & Securities",
                            description: "Direct stock trading, IPO access, and securities custody with competitive commissions.",
                        },
                        {
                            icon: "Smartphone",
                            title: "Investment Platform",
                            description: "Real-time market data, advanced charting, research tools, and mobile trading.",
                        },
                        {
                            icon: "FileText",
                            title: "Advisory Services",
                            description: "Expert analysis, market insights, and personalized investment recommendations.",
                        },
                        {
                            icon: "Shield",
                            title: "Risk Management",
                            description: "Portfolio rebalancing, tax-loss harvesting, insurance products, and estate planning.",
                        },
                    ],
                },
            },
            {
                type: "faq",
                props: {
                    title: "Investment FAQs",
                    faqs: [
                        {
                            q: "What is the minimum investment amount?",
                            a: "You can start investing with as little as â‚¬100 in most mutual funds and ETFs.",
                        },
                        {
                            q: "What are your advisory fees?",
                            a: "Advisory fees range from 0.25%-1.5% depending on your portfolio size and service level.",
                        },
                        {
                            q: "How often should I review my portfolio?",
                            a: "We recommend quarterly reviews, though we monitor your portfolio continuously for rebalancing needs.",
                        },
                        {
                            q: "Can I trade stocks directly?",
                            a: "Yes, you can trade stocks on major exchanges with commissions starting at â‚¬2.95 per trade.",
                        },
                        {
                            q: "What is your investment philosophy?",
                            a: "We focus on long-term wealth building through diversified, low-cost investments aligned with your goals.",
                        },
                    ],
                },
            },
            {
                type: "cta",
                props: {
                    heading: "Start Investing Today",
                    subtext: "Schedule a free consultation with our investment advisors.",
                    buttonText: "Get Started",
                    buttonSlug: "signup",
                    isDark: true,
                },
            },
        ],
    },

    {
        slug: "privacy",
        title: "Privacy Policy",
        seo: {
            title: "Privacy Policy | Summit Ridge Credit Union - Your Data, Protected",
            description: "Learn how Summit Ridge Credit Union protects your personal data and respects your privacy.",
            keywords: "privacy policy, data protection, GDPR, personal data",
        },
        settings: {
            requiresAuth: false,
            layout: "legal",
            showBreadcrumb: true,
        },
        sections: [
            {
                type: "legal",
                props: {
                    title: "Privacy Policy",
                    lastUpdated: "January 7, 2025",
                    content: `
1. Introduction
At Summit Ridge Credit Union, we are committed to protecting your privacy and ensuring you have a positive experience on our website and when using our services. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our digital platforms and use our services.

Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our services.

2. Information We Collect
We may collect information about you in a variety of ways. The information we may collect on the site includes:

Personal Data: Name, email address, phone number, postal address, date of birth, account number, and other identifiers you provide directly.
Account Information: Login credentials, account balances, transaction history, and communication preferences.
Device Information: IP address, browser type, operating system, and device identifiers.
Usage Data: Pages visited, time spent on pages, clicks, searches, and interactions with our services.
Location Data: With your consent, GPS location and mobile device information.

3. How We Use Your Information
Summit Ridge Credit Union uses the collected information for various purposes:

Providing and maintaining our services
Processing transactions and sending related information
Responding to your inquiries and providing customer support
Monitoring and analyzing trends, usage, and activities for service improvement
Detecting, preventing, and addressing fraud, security issues, and technical problems
Complying with legal and regulatory obligations
Sending promotional communications (with your consent)
Personalizing your experience and delivering targeted content

4. Data Sharing and Disclosure
We do not sell, trade, or rent your personal information to third parties. However, we may share your information in the following circumstances:

With service providers who assist us in operating our website and services (payment processors, hosting providers, analytics services)
With financial regulators and government authorities as required by law
With law enforcement when legally required
With other financial institutions when necessary for payment processing
With your explicit consent for specific purposes

5. Data Security
Summit Ridge Credit Union implements industry-standard security measures to protect your personal information, including:

Bank-level encryption (TLS/SSL) for data in transit
Advanced firewalls and intrusion detection systems
Regular security audits and penetration testing
Multi-factor authentication for account access
Limited access to personal data based on need-to-know basis
Secure disposal of data when no longer needed

Despite our security measures, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security of your information.

6. Your Rights
Under the General Data Protection Regulation (GDPR) and other applicable laws, you have the right to:

Access your personal data
Correct inaccurate or incomplete data
Delete your data (right to be forgotten)
Restrict processing of your data
Receive your data in a portable format
Object to processing
Withdraw consent at any time
Lodge a complaint with your local data protection authority

To exercise these rights, contact our Data Protection Officer at privacy@abnAmro.com.

7. Cookies and Tracking
Our website uses cookies to enhance your experience. Cookies are small data files stored on your device that help us remember your preferences and analyze site usage.

We use:
Essential cookies (required for website functionality)
Performance cookies (analytics, error tracking)
Functional cookies (user preferences)
Marketing cookies (targeted advertising)

You can control cookie preferences through your browser settings. However, disabling certain cookies may affect website functionality.

8. Data Retention
We retain your personal data for as long as necessary to provide our services and comply with legal obligations. Retention periods vary based on the purpose:

Account information: Duration of account plus 7 years (regulatory requirement)
Transaction records: 7 years
Marketing preferences: Until withdrawn
Cookies: Varies (essential cookies until deleted; others up to 2 years)

9. Third-Party Links
Our website may contain links to third-party websites. We are not responsible for the privacy practices of external sites. Please review their privacy policies before providing any information.

10. Children's Privacy
Our services are not intended for individuals under 18 years old. We do not knowingly collect personal information from children. If we discover we have collected information from a child, we will delete it promptly.

11. Changes to This Policy
Summit Ridge Credit Union may update this Privacy Policy from time to time. We will notify you of significant changes via email or by posting a notice on our website. Your continued use of our services after changes constitutes acceptance of the updated policy.

12. Contact Us
If you have questions about this Privacy Policy or our privacy practices, please contact:

Summit Ridge Credit Union Bank NV
Data Protection Officer
Email: privacy@abnAmro.com
Phone: +31 20 104 6000
Address: Amsterdam, Netherlands

Last Updated: January 7, 2025
        `,
                },
            },
        ],
    },

    {
        slug: "terms",
        title: "Terms of Service",
        seo: {
            title: "Terms of Service | Summit Ridge Credit Union - Legal Terms",
            description: "Review Summit Ridge Credit Union's terms and conditions for using our services and platforms.",
            keywords: "terms of service, terms and conditions, legal terms, user agreement",
        },
        settings: {
            requiresAuth: false,
            layout: "legal",
            showBreadcrumb: true,
        },
        sections: [
            {
                type: "legal",
                props: {
                    title: "Terms of Service",
                    lastUpdated: "January 7, 2025",
                    content: `
1. Acceptance of Terms
By accessing and using Summit Ridge Credit Union's website, mobile application, and services, you agree to be bound by these Terms of Service. If you do not agree to abide by the above, please do not use this service.

2. Use License
Permission is granted to temporarily download one copy of the materials (information or software) on Summit Ridge Credit Union's platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:

Modifying or copying the materials
Using the materials for any commercial purpose or for any public display
Attempting to decompile or reverse engineer any software contained on Summit Ridge Credit Union
Removing any copyright or other proprietary notations from the materials
Transferring the materials to another person or "mirroring" the materials on any other server
Attempting to gain unauthorized access to the platform or systems

3. Disclaimer of Warranties
The materials on Summit Ridge Credit Union's platform are provided on an 'as is' basis. Summit Ridge Credit Union makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

Further, Summit Ridge Credit Union does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its platform or otherwise relating to such materials or on any sites linked to this platform.

4. Limitations of Liability
In no event shall Summit Ridge Credit Union or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Summit Ridge Credit Union's platform, even if Summit Ridge Credit Union or an authorized representative has been notified orally or in writing of the possibility of such damage.

5. Accuracy of Materials
The materials appearing on Summit Ridge Credit Union's platform could include technical, typographical, or photographic errors. Summit Ridge Credit Union does not warrant that any of the materials on its platform are accurate, complete, or current. Summit Ridge Credit Union may make changes to the materials contained on its platform at any time without notice.

6. Materials and Content
Summit Ridge Credit Union does not review all materials posted to its platform, but Summit Ridge Credit Union and its designees have the right (but not the obligation) to refuse or remove any material that is available via the platform. Summit Ridge Credit Union further reserves the right to refuse service to anyone for any reason at any time.

7. Limitations on Use
You agree not to access or use the platform for any purpose other than that for which we make the platform available. The platform may not be used in connection with any commercial endeavors except those specifically endorsed or approved by Summit Ridge Credit Union.

Prohibited behavior includes:
Harassing or causing distress or inconvenience to any person
Transmitting obscene or offensive content
Disrupting the normal flow of dialogue
Attempting to gain unauthorized access
Collecting or tracking personal information of others

8. Account Responsibilities
If you create an account on our platform, you are responsible for maintaining the confidentiality of your account information and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.

You must notify us immediately of any unauthorized use of your account. Summit Ridge Credit Union will not be liable for any loss or damage arising from your failure to maintain secure account information.

9. Third-Party Links
Summit Ridge Credit Union has not reviewed all of the sites linked to its platform and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Summit Ridge Credit Union of the site. Use of any such linked website is at the user's own risk.

10. Modifications to Terms
Summit Ridge Credit Union may revise these Terms of Service for its platform at any time without notice. By using this platform, you are agreeing to be bound by the then current version of these Terms of Service.

11. Governing Law
These terms and conditions are governed by and construed in accordance with the laws of the Netherlands, and you irrevocably submit to the exclusive jurisdiction of the courts in Amsterdam.

12. Dispute Resolution
Any dispute or claim arising out of or in connection with these Terms shall be resolved through binding arbitration in accordance with the rules of the Amsterdam Arbitration Institute, or through mutual agreement.

13. Severability
If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.

14. Contact Information
If you have any questions about these Terms of Service, please contact:

Summit Ridge Credit Union Bank NV
Legal Department
Email: legal@abnAmro.com
Phone: +31 20 104 6000
Address: Amsterdam, Netherlands

Last Updated: January 7, 2025
        `,
                },
            },
        ],
    },

    {
        slug: "cookie",
        title: "Cookie Policy",
        seo: {
            title: "Cookie Policy | Summit Ridge Credit Union - Cookie Settings",
            description: "Learn about how Summit Ridge Credit Union uses cookies and how to manage your cookie preferences.",
            keywords: "cookies, cookie policy, cookie settings, tracking, analytics",
        },
        settings: {
            requiresAuth: false,
            layout: "legal",
            showBreadcrumb: true,
        },
        sections: [
            {
                type: "legal",
                props: {
                    title: "Cookie Policy",
                    lastUpdated: "January 7, 2025",
                    content: `
1. What Are Cookies?
Cookies are small text files that are placed on your device (computer, tablet, or mobile phone) when you browse our website. They help us recognize your device and remember information about your visit, such as your language preferences and login information.

Cookies can be either "persistent" (they remain on your device until you delete them) or "session-based" (they are deleted when you close your browser).

2. Types of Cookies We Use
We use the following categories of cookies:

Essential Cookies
These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website. Without these cookies, the website cannot function correctly.

Examples: User authentication, security tokens, session management

Performance Cookies
These cookies collect information about how you use our website, such as which pages you visit, how long you spend on them, and whether you encounter any errors. This information helps us understand user behavior and improve our services.

Examples: Google Analytics, error tracking, page performance metrics

Functional Cookies
These cookies remember your preferences and settings, allowing us to provide a customized experience on subsequent visits.

Examples: Language preferences, font size, dark mode toggle, saved items

Marketing and Targeting Cookies
These cookies are used to track your browsing activity across websites to deliver personalized advertisements and marketing content. They may also measure the effectiveness of marketing campaigns.

Examples: Facebook Pixel, Google Ads, retargeting pixels

3. Third-Party Cookies
Some cookies are set by third-party services embedded in our website, including:

Google Analytics - for website usage analytics
Google Ads - for advertising and conversion tracking
Facebook - for social media integration and advertising
Payment Processors - for secure transaction processing
Intercom - for customer support and messaging

These third parties have their own privacy policies governing their use of cookies.

4. How Long Do Cookies Last?
Session Cookies: Deleted when you close your browser
Persistent Cookies: Vary in duration:
  - Essential cookies: Duration of account/session
  - Performance cookies: Up to 2 years
  - Functional cookies: Up to 2 years
  - Marketing cookies: Up to 12 months

5. Your Cookie Preferences
You have the right to accept or reject non-essential cookies. When you first visit our website, you will be presented with a cookie consent banner. You can:

Accept all cookies
Reject non-essential cookies
Customize your preferences

To modify your preferences at any time, look for the "Cookie Settings" link in the footer of our website.

6. Managing Cookies in Your Browser
You can control cookies through your browser settings:

Chrome: Settings > Privacy and Security > Cookies and other site data
Firefox: Settings > Privacy & Security > Cookies and Site Data
Safari: Preferences > Privacy > Manage Website Data
Edge: Settings > Privacy, search, and services > Clear browsing data

Please note that disabling essential cookies may affect the functionality of our website.

7. Do Not Track (DNT)
Some browsers include a Do Not Track feature. Currently, there is no universally accepted standard for how websites should respond to DNT signals. Summit Ridge Credit Union honors DNT requests by not setting marketing cookies for users with DNT enabled.

8. Local Storage and Similar Technologies
In addition to cookies, we may use other technologies such as:

Local Storage: Stores data on your device similar to cookies but with larger capacity
Web Beacons: Tiny images used to track page views and conversions
Flash Cookies: Persistent identifiers used by some plugins

9. Cross-Site Tracking
We may use cookies to track your behavior across different websites to show you relevant advertisements. This is called cross-site tracking or "retargeting." You can opt out of retargeting by adjusting your privacy settings in your browser or on individual advertiser websites.

10. International Data Transfers
Some of our third-party cookie providers may transfer data outside the European Union. We ensure that such transfers comply with GDPR requirements through Standard Contractual Clauses or other approved mechanisms.

11. Updates to This Policy
We may update this Cookie Policy from time to time to reflect changes in our cookie practices or applicable laws. We will notify you of significant changes by updating the "Last Updated" date and posting the updated policy on our website.

12. Contact Us
If you have questions about our use of cookies, please contact:

Summit Ridge Credit Union Bank NV
Privacy Team
Email: privacy@abnAmro.com
Phone: +31 20 104 6000
Address: Amsterdam, Netherlands

You can also access your cookie preferences at any time via our Cookie Settings tool.

Last Updated: January 7, 2025
        `,
                },
            },
        ],
    },

    {
        slug: "disclaimer",
        title: "Disclaimer",
        seo: {
            title: "Disclaimer | Summit Ridge Credit Union - Legal Disclaimer",
            description: "Review Summit Ridge Credit Union's legal disclaimers and liability limitations.",
            keywords: "disclaimer, liability, legal disclaimer, user responsibility",
        },
        settings: {
            requiresAuth: false,
            layout: "legal",
            showBreadcrumb: true,
        },
        sections: [
            {
                type: "legal",
                props: {
                    title: "Disclaimer",
                    lastUpdated: "January 7, 2025",
                    content: `
1. General Disclaimer
This website and all materials contained herein are provided by Summit Ridge Credit Union Bank NV ("Summit Ridge Credit Union," "we," "us," or "our") on an "as-is" basis without warranties of any kind, either express or implied. We make no representations or warranties regarding the accuracy, completeness, timeliness, or reliability of any content on this website.

Use of this website and any information contained herein is at your own risk. Summit Ridge Credit Union shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the website or services.

2. Financial Information Disclaimer
The information provided on this website, including investment advice, market analysis, and financial projections, is for informational purposes only and should not be construed as financial advice. Past performance is not indicative of future results.

Before making any financial decisions, you should:
Consult with a qualified financial advisor
Conduct your own research and due diligence
Review all relevant documentation and terms
Understand the risks associated with any investment or financial product

Summit Ridge Credit Union does not guarantee any specific returns or outcomes. Market conditions, interest rates, and economic factors can change unexpectedly and affect the performance of financial products.

3. Investment Risks
All investments carry risk, including the potential loss of principal. The value of investments may fluctuate and past performance does not guarantee future results. Certain investment products are subject to regulatory limitations and may not be suitable for all investors.

Before investing, please:
Assess your risk tolerance
Review the investment prospectus and risk disclosure documents
Consider your investment timeline and financial goals
Diversify your investments across multiple asset classes

4. Currency and Exchange Rate Risk
If you conduct transactions in currencies other than your home currency, you are subject to exchange rate fluctuations. The exchange rate between currencies can change rapidly and unpredictably, potentially affecting the value of your investments and transactions.

5. Technical Limitations
Summit Ridge Credit Union does not warrant that:
The website will be available at all times without interruption
The website will be free from errors, viruses, or malicious code
Information or services will be delivered without delay
Third-party services integrated into the website will function reliably

We will make reasonable efforts to maintain website availability and security, but we cannot guarantee uninterrupted service.

6. Third-Party Content and Links
This website may contain links to third-party websites and services. Summit Ridge Credit Union is not responsible for:
The accuracy, completeness, or reliability of third-party content
The privacy practices of third-party websites
Any transactions or interactions with third parties
Any damages arising from use of third-party services

Your interaction with third parties is governed by their terms and conditions, not ours.

3. Regulatory Compliance Disclaimer
While Summit Ridge Credit Union is regulated by the European Central Bank (ECB) and the Dutch Financial Authority (AFM), the information on this website does not constitute financial advice or recommendations subject to regulatory oversight. Certain services may only be available in specific jurisdictions due to regulatory restrictions.

8. Limitation of Liability
To the maximum extent permitted by applicable law, Summit Ridge Credit Union and its officers, directors, employees, and agents shall not be liable for any of the following, even if we have been advised of the possibility of such damages:

Loss of revenue or profits
Loss of business opportunity
Loss of data or information
Interruption of service
Consequential, incidental, special, or punitive damages

9. No Warranty of Legality
Summit Ridge Credit Union does not warrant that the use of this website or services complies with all applicable laws and regulations in your jurisdiction. Users are responsible for ensuring that their use complies with local, state, and federal laws.

10. Tax Implications
The tax implications of any financial product or transaction can be complex and vary based on individual circumstances. Summit Ridge Credit Union does not provide tax advice. You should consult with a qualified tax professional before engaging in any transaction with potential tax consequences.

11. User Responsibility
By using this website, you acknowledge that:
You understand the risks associated with financial transactions
You have the knowledge and experience to evaluate financial products
You will not rely solely on information provided on this website for financial decisions
You will conduct your own due diligence before making any commitment
You accept full responsibility for your financial decisions and their outcomes

12. Changes to Disclaimer
Summit Ridge Credit Union may update this disclaimer at any time without notice. Your continued use of the website after changes constitutes acceptance of the updated disclaimer.

13. Entire Agreement
This disclaimer, together with our Privacy Policy, Terms of Service, and Cookie Policy, constitutes the entire agreement between you and Summit Ridge Credit Union regarding the use of this website and our services. If any provision is found to be invalid or unenforceable, the remaining provisions shall remain in effect.

14. Contact and Complaints
If you have complaints about our services or the information on this website, you may contact:

Summit Ridge Credit Union Bank NV
Complaints Department
Email: complaints@abnAmro.com
Phone: +31 20 104 6000
Address: Amsterdam, Netherlands

For financial complaints in the Netherlands, you may also file a complaint with the Financial Ombudsman (Kifid).

15. Governing Law
This disclaimer is governed by the laws of the Netherlands. Any legal actions or proceedings arising from your use of this website shall be brought exclusively in the courts of Amsterdam, Netherlands.

IMPORTANT: By using this website, you acknowledge that you have read, understood, and agree to be bound by this disclaimer. If you do not agree with any provision of this disclaimer, please discontinue use of the website immediately.

Last Updated: January 7, 2025
        `,
                },
            },
        ],
    },
];

