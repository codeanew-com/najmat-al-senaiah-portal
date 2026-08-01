import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { localeDirections, type Locale } from "@/i18n/config";
import "../globals.css";

export const dynamic = "force-static";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "app" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

/**
 * Purely client-side theme detection (no server cookie read). Reading a
 * cookie server-side to pick the initial theme would force this layout to
 * render dynamically on every request instead of prerendering to static
 * HTML — not worth it since this blocking inline script already prevents
 * any flash of the wrong theme before first paint.
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
  } catch (e) {}
})();
`;

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  // Only these namespaces are read by Client Components (CopyButton, LocaleSwitcher,
  // ThemeToggle's label is passed as a prop). Everything else renders server-side,
  // so there's no reason to ship the rest of the message catalog to the browser.
  const clientMessages = {
    common: messages.common,
    language: messages.language,
  };

  return (
    <html
      lang={locale}
      dir={localeDirections[locale as Locale]}
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <NextIntlClientProvider messages={clientMessages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
