"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, localeLabels, type Locale } from "@/i18n/config";
import { Dropdown } from "@/components/ui/dropdown";

export default function LocaleSwitcher() {
  const t = useTranslations("language");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function handleChange(next: string) {
    router.replace(pathname, { locale: next as Locale });
  }

  return (
    <Dropdown
      ariaLabel={t("switch")}
      value={locale}
      onChange={handleChange}
      options={locales.map((code) => ({ value: code, label: localeLabels[code] }))}
    />
  );
}
