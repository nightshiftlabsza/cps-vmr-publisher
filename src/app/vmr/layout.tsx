import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "CPS Virtual Morning Report",
  description: "Virtual Morning Report — The Clinical Problem Solvers",
};

function CpsHeader() {
  return (
    <header className="border-b border-border-default bg-surface-secondary">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/vmr" className="flex items-center gap-3 transition hover:opacity-80">
          <Image
            src="/cps-logo.svg"
            alt="The Clinical Problem Solvers"
            width={40}
            height={40}
            className="rounded-lg"
            priority
          />
          <span className="text-sm font-semibold text-text-primary sm:text-base">
            The Clinical Problem Solvers
          </span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}

function CpsFooter() {
  return (
    <footer className="border-t border-border-default bg-surface-secondary mt-12">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-3 px-4 py-8 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <Image
            src="/cps-logo.svg"
            alt="The Clinical Problem Solvers"
            width={24}
            height={24}
            className="rounded-md"
          />
          <span className="text-sm text-text-muted">The Clinical Problem Solvers</span>
        </div>
        <a
          href="https://clinicalproblemsolving.com"
          target="_blank"
          rel="noreferrer"
          className="text-sm text-text-muted transition hover:text-text-primary"
        >
          clinicalproblemsolving.com
        </a>
      </div>
    </footer>
  );
}

export default function PublicVmrLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-primary">
      <CpsHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
        {children}
      </main>
      <CpsFooter />
    </div>
  );
}
