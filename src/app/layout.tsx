import type { Viewport } from "next";
import Script from "next/script";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import { getLocale } from "next-intl/server";
import { localeDirections, type Locale } from "@/i18n/config";
import { THEME_COOKIE } from "@/lib/theme-cookie";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Fallback for the very first visit only (no theme cookie yet, so the server
 * couldn't set data-theme in the SSR HTML). Computes the theme from
 * localStorage/system preference and persists it as a cookie so every
 * subsequent request renders the correct theme server-side with zero
 * client-side involvement — see the `cookies()` read below.
 *
 * Lives in this root layout (outside the [locale] segment) specifically so it
 * only ever mounts once per real page load. A [locale]-scoped layout remounts
 * on every client-side locale switch, which would make React try to "render"
 * this <script> again during a normal client update instead of hydration —
 * script tags inserted that way never execute, and React 19 warns about it.
 */
const themeInitScript = `
(function () {
  try {
    if (document.documentElement.hasAttribute("data-theme")) return;
    var stored = localStorage.getItem("theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    document.cookie = "theme=" + theme + "; path=/; max-age=31536000; samesite=lax";
  } catch (e) {}
})();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await getLocale()) as Locale;
  const dir = localeDirections[locale];

  const cookieStore = await cookies();
  const themeCookie = cookieStore.get(THEME_COOKIE)?.value;
  const initialTheme = themeCookie === "dark" || themeCookie === "light" ? themeCookie : undefined;

  return (
    <html
      lang={locale}
      dir={dir}
      data-theme={initialTheme}
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
