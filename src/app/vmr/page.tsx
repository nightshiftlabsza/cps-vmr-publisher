export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { formatDisplayDate } from "@/lib/dates";
import { buildSubmissionPublicPath } from "@/lib/public-pages";
import { TEMPLATE_TYPE_LABELS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { getYouTubeThumbnailUrl } from "@/lib/youtube";

const TEMPLATE_COLORS: Record<string, string> = {
  standard: "from-teal-500/20 to-teal-600/5",
  raphael_medina_subspecialty: "from-violet-500/20 to-violet-600/5",
  img_vmr: "from-amber-500/20 to-amber-600/5",
  sunday_fundamentals: "from-emerald-500/20 to-emerald-600/5",
  custom: "from-slate-500/20 to-slate-600/5",
};

export default async function PublicVmrArchivePage() {
  const submissions = await prisma.submission.findMany({
    where: {
      status: "published",
      slug: { not: null },
    },
    orderBy: [{ sessionDate: "desc" }, { updatedAt: "desc" }],
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          Virtual Morning Reports
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Past cases from The Clinical Problem Solvers
        </p>
      </header>

      {submissions.length ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {submissions.map((submission) => {
            const thumbnail = submission.youtubeUrl
              ? getYouTubeThumbnailUrl(submission.youtubeUrl)
              : null;
            const hasPreview = Boolean(submission.previewImagePath);
            const gradientClass =
              TEMPLATE_COLORS[submission.templateType] ?? TEMPLATE_COLORS.custom;

            return (
              <Link
                key={submission.id}
                href={bu