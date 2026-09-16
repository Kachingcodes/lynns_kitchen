import {
  Manrope,
  Cormorant_Garamond,
  Geist_Mono,
  Great_Vibes,
} from "next/font/google";

import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { OrderProvider } from "./context/OrderContext";


const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});


const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const greatVibes = Great_Vibes({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});


export const metadata = {
  title: "Lynn's Kitchen",
  description:
    "Discover a modern fusion dining experience at Lynn's Kitchen.",
};


export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${cormorant.variable} ${geistMono.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <OrderProvider>
          {children}
        </OrderProvider>

        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}