import Footer from "@/components/sections/Footer";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Noto_Sans } from "next/font/google";
const noto = Noto_Sans({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={noto.className}>
      <Component {...pageProps} />;
      <Footer />
    </main>
  );
}
