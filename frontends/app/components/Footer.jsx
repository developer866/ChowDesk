import Link from "next/link";
import { UtensilsCrossed, MapPin, Phone, Mail, } from "lucide-react";
import { FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
const navLinks = [
  { label: "Home",   href: "/" },
  { label: "Foods",  href: "/foodspage" },
  { label: "Drinks", href: "/foodspage?category=Drinks" },
  { label: "Orders", href: "/orders" },
  { label: "About",  href: "/about" },
];

const socialLinks = [
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaTwitter,   href: "#", label: "Twitter" },
  { icon: FaFacebook,  href: "#", label: "Facebook" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 mt-auto">
      <div className="max-w-6xl mx-auto px-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-(--color-primary) rounded-lg flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4 text-white" />
              </div>
              <span className="font-(family-name:--font-headline) text-sm font-extrabold tracking-widest uppercase">
                Chow<span className="text-(--color-primary)">Desk</span>
              </span>
            </div>
            <p className="font-(family-name:--font-body) text-sm text-gray-400 leading-relaxed mb-4 max-w-xs">
              Fresh meals, refreshing drinks, and fast delivery — at your fingertips, every day.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-(--color-primary) flex items-center justify-center transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="font-(family-name:--font-headline) text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Quick Links
            </p>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-(family-name:--font-body) text-sm text-gray-400 hover:text-(--color-primary) transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <p className="font-(family-name:--font-headline) text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Opening Hours
            </p>
            <div className="flex flex-col gap-2">
              {[
                { day: "Mon – Fri", time: "9:00 AM – 10:00 PM" },
                { day: "Saturday",  time: "8:00 AM – 11:00 PM" },
                { day: "Sunday",    time: "10:00 AM – 9:00 PM" },
              ].map(({ day, time }) => (
                <div key={day} className="flex justify-between gap-1 font-(family-name:--font-body) text-sm">
                  <span className="text-gray-400">{day}</span>
                  <span className="text-gray-300 font-medium">{time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="font-(family-name:--font-headline) text-sm font-bold text-white mb-4 uppercase tracking-wider">
              Contact
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-(--color-primary) flex-shrink-0 mt-0.5" />
                <p className="font-(family-name:--font-body) text-sm text-gray-400">
                  12 Admiralty Way, Lekki Phase 1, Lagos
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-(--color-primary) flex-shrink-0" />
                <p className="font-(family-name:--font-body) text-sm text-gray-400">
                  +234 903 338 3479
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-(--color-primary) flex-shrink-0" />
                <p className="font-(family-name:--font-body) text-sm text-gray-400">
                  hello@chowdesk.com
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-(family-name:--font-body) text-xs text-gray-500">
            © {new Date().getFullYear()} ChowDesk. All rights reserved.
          </p>
          <p className="font-(family-name:--font-body) text-xs text-gray-500">
            Built by{" "}
            <a
              href="https://portfolio-nu-six-65.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--color-primary) hover:underline"
            >
              Ayeni Opeyemi
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}