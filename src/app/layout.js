import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "./providers";
import WhatsAppButton from "@/components/WhatsAppButton";
import CartSessionSync from "@/components/CartSessionSync";

export const metadata = {
  title: "E-Commerce",
  description: "Premium Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="min-h-screen overflow-x-hidden bg-orange-50 text-slate-900">
        <Providers>
          <CartSessionSync />
          <div className="min-h-screen w-full bg-gradient-to-b from-orange-50 via-white to-orange-100">
            <Navbar />

            <main className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
              {children}
            </main>
            <WhatsAppButton />
          </div>
        </Providers>
      </body>
    </html>
  );
}
