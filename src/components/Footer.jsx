import { Link } from "react-router-dom";
import {
  Facebook,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import LOGO from "../assets/images/Logo-abn.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Customers: [
      { label: "Private Banking", href: "/private-banking" },
      { label: "Business Solutions", href: "/business-solution" },
      { label: "Investment Services", href: "/investment-service" },
    ],
    Service: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/faq" },
      { label: "Support", href: "/support" },
    ],
    Company: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Sustainability", href: "/sustainability" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
    { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  ];

  return (
    <footer className="bg-secondary text-primary">
      {/* Main Footer Content */}
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Branding */}
          <div className="flex flex-col gap-4">
            <img
              src={LOGO}
              alt="Summit Ridge Credit Union"
              className="w-8 h-auto"
            />
            <p className="text-sm opacity-80">
              Leading financial services for generations.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="hover:text-basic transition-colors"
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-semibold text-primary mb-4 text-sm uppercase tracking-wide">
                {section}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm opacity-80 hover:text-basic hover:opacity-100 transition-all"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-primary mb-4 text-sm uppercase tracking-wide">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-1 flex-shrink-0 text-basic" />
                <a
                  href="tel:+31201046000"
                  className="text-sm opacity-80 hover:text-basic hover:opacity-100 transition-all"
                >
                  +31 20 104 6000
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-1 flex-shrink-0 text-basic" />
                <a
                  href="mailto:support@Summitridgecreditunion.com"
                  className="text-sm opacity-80 hover:text-basic hover:opacity-100 transition-all"
                >
                  support@Summitridgecreditunion.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 flex-shrink-0 text-basic" />
                <span className="text-sm opacity-80">
                  Amsterdam, Netherlands
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary opacity-20 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs opacity-60">
            ©{currentYear} Summit Ridge Credit Union Bank. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs">
            <a
              href="/privacy"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              Privacy Policy
            </a>
            <a
              href="/cookie"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              Cookie Settings
            </a>
            <a
              href="/terms"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              Terms of Service
            </a>
            <a
              href="/disclaimer"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              Disclaimer
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

