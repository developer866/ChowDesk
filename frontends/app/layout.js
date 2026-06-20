import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";
import Footer from "./components/Footer";
import Script from "next/script";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-headline",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata = {
  metadataBase: new URL("https://chow-desk.vercel.app"),
  title: {
    default: "ChowDesk – Order Food Online | Fresh, Fast Delivery in Lagos",
    template: "%s | ChowDesk",
  },
  description:
    "Order fresh meals and drinks online with ChowDesk. Browse Starters, Mains, Drinks & Desserts, then order via WhatsApp — 30min delivery in Lekki, Lagos.",
  openGraph: {
    title: "ChowDesk – Order Food Online",
    description:
      "Fresh meals, refreshing drinks, fast delivery — order via WhatsApp in seconds.",
    url: "https://chow-desk.vercel.app",
    siteName: "ChowDesk",
    images: [
      {
        url: "https://chow-desk.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ChowDesk – Order Food Online",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChowDesk – Order Food Online",
    description:
      "Fresh meals, refreshing drinks, fast delivery — order via WhatsApp in seconds.",
    images: ["https://chow-desk.vercel.app/og-image.jpg"],
  },
};
export default function RootLayout({ children }) {
  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "ChowDesk",
    image: "https://chow-desk.vercel.app/og-image.jpg",
    url: "https://chow-desk.vercel.app",
    telephone: "+234-903-338-3479",
    email: "hello@chowdesk.com",
    servesCuisine: "Nigerian",
    priceRange: "₦1,500 - ₦6,500",
    address: {
      "@type": "PostalAddress",
      streetAddress: "12 Admiralty Way",
      addressLocality: "Lekki Phase 1",
      addressRegion: "Lagos",
      addressCountry: "NG",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "22:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "23:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "10:00",
        closes: "21:00",
      },
    ],
    hasMenu: "https://chow-desk.vercel.app/foodspage",
    acceptsReservations: "False",
    menu: "https://chow-desk.vercel.app/foodspage",
  };
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4DRXWQ57S1"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4DRXWQ57S1');
          `}
        </Script>
      </head>

      <body className={`${montserrat.variable} ${inter.variable} antialiased`}>
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
