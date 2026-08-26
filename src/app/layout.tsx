import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "@/styles/style.scss";

export const metadata: Metadata = {
  title: "Studio Fulchero",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
