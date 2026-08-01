import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { LocaleHtmlAttributes } from "@/components/locale-html-attributes";

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
    <NextIntlClientProvider messages={clientMessages}>
      <LocaleHtmlAttributes />
      {children}
    </NextIntlClientProvider>
  );
}
