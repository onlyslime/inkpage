import type { Metadata } from "next";
import localFont from "next/font/local";
import {
  Geist,
  Geist_Mono,
  LXGW_WenKai_TC,
  Noto_Sans_SC,
  Noto_Serif_SC,
} from "next/font/google";
import { FloatingWidgets } from "./components/FloatingWidgets";
import { FontProvider } from "./components/FontProvider";
import { SiteHeader } from "./components/SiteHeader";
import { SiteProvider } from "./components/SiteProvider";
import { ScrollProgressBar } from "./components/ScrollProgressBar";
import { ThemeProvider } from "./components/ThemeProvider";
import { getSiteUrl } from "@/lib/siteUrl";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-noto-serif-sc",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

/** Google Fonts：与霞鹜文楷同源，繁体为主；简体多数字可正常显示 */
const lxgwWenkai = LXGW_WenKai_TC({
  variable: "--font-lxgw-wenkai",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

/** Zpix「最像素」12px 点阵体，个人/教育免费 —— SolidZORO/zpix-pixel-font */
const zpix = localFont({
  src: "./fonts/zpix.ttf",
  variable: "--font-zpix",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Your Name",
    template: "%s · Your Name",
  },
  description: "Your Name — personal site",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVars = [
    geistSans.variable,
    geistMono.variable,
    notoSansSC.variable,
    notoSerifSC.variable,
    lxgwWenkai.variable,
    zpix.variable,
  ].join(" ");

  return (
    <html
      lang="zh-CN"
      data-ui-theme="claude"
      data-site-font="wenkai"
      className={`${fontVars} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteProvider>
          <ThemeProvider>
            <FontProvider>
              <SiteHeader />
              <ScrollProgressBar />
              <main className="flex-1 pt-28">{children}</main>
              <FloatingWidgets />
            </FontProvider>
          </ThemeProvider>
        </SiteProvider>
      </body>
    </html>
  );
}
