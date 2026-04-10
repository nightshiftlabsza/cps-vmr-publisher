import { Sidebar, MobileHeader } from "@/components/sidebar";
import { getSessionRole } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getSessionRole();
  const isAdmin = role === "admin";

  return (
    <div className="min-h-screen">
      <Sidebar isAdmin={isAdmin} />
      <MobileHeader isAdmin={isAdmin} />
      <main className="md:pl-60">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
