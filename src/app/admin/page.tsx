import { getAdminSession } from "@/lib/admin/auth";
import { getAccountData } from "@/lib/account-repo";
import { LoginFlow } from "@/components/admin/login-flow";
import { AccountForm } from "@/components/admin/account-form";

export default async function AdminPage() {
  const authed = await getAdminSession();

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas-parchment px-6 py-12">
      {authed ? <AccountForm account={getAccountData()} /> : <LoginFlow />}
    </div>
  );
}
