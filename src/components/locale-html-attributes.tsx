"use client";

import { useLayoutEffect } from "react";
import { useLocale } from "next-intl";
import { localeDirections, type Locale } from "@/i18n/config";

/**
 * The <html lang>/<html dir> attributes are set server-side in the root
 * layout, which lives outside the [locale] segment and therefore doesn't
 * re-render on a client-side locale switch (only the [locale] segment does).
 * Without this, switching languages via LocaleSwitcher leaves the page stuck
 * in the previous direction until a full page reload.
 */
export function LocaleHtmlAttributes() {
  const locale = useLocale() as Locale;

  useLayoutEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeDirections[locale];
  }, [locale]);

  return null;
}
