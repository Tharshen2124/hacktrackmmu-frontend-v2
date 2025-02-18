import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Hanken_Grotesk,  } from "next/font/google";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <main className={hankenGrotesk.className}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
