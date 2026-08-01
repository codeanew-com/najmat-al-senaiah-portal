import { getTranslations, setRequestLocale } from "next-intl/server";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AccountDetails } from "@/components/banking/account-details";
import { FadeIn } from "@/components/fade-in";
import { demoAccount } from "@/lib/account-data";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("theme");

  return (
    <div
      className="relative flex flex-1 flex-col items-center justify-center gap-12 bg-canvas-parchment px-6 py-20"
      style={{
        paddingTop: "max(5rem, calc(env(safe-area-inset-top) + 2rem))",
        paddingInlineStart: "max(1.5rem, env(safe-area-inset-left))",
        paddingInlineEnd: "max(1.5rem, env(safe-area-inset-right))",
        paddingBottom: "max(5rem, calc(env(safe-area-inset-bottom) + 2rem))",
      }}
    >
      <div
        className="absolute top-6 end-6 flex items-center gap-2"
        style={{
          top: "max(1.5rem, calc(env(safe-area-inset-top) + 0.5rem))",
          insetInlineEnd: "max(1.5rem, env(safe-area-inset-right))",
        }}
      >
        <ThemeToggle ariaLabel={t("toggle")} />
        <LocaleSwitcher />
      </div>

      <FadeIn transitionKey={locale}>
        <AccountDetails account={demoAccount} />
      </FadeIn>
    </div>
  );
}
