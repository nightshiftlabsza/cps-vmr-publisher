import Link from "next/link";
import { notFound } from "next/navigation";

import { SubmissionEditor } from "@/components/submission-editor";
import { StatusBadge } from "@/components/status-badge";
import { buildSubmissionPublicUrl } from "@/lib/public-pages";
import { prisma } from "@/lib/prisma";
import { toFormState } from "@/lib/submission";

type SubmissionDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SubmissionDetailPage({
  params,
}: SubmissionDetailPageProps) {
  const { id } = await params;
  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      people: true,
    },
  });

  if (!submission) {
    notFound();
  }

  const uploadUrl = `/uploads/${submission.id}/original`;
  const previewImageUrl = submission.previewImagePath
    ? `/uploads/${submission.id}/preview`
    : null;

  return (
    <div className="space-y-5">
      {/* Breadcrumb + status header */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link href="/admin" className="hover:text-text-primary transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-text-secondary truncate max-w-xs">{submission.title}</span>
        <span className="ml-auto">
          <StatusBadge status={submission.status} />
        </span>
      </div>

      <SubmissionEditor
        mode="edit"
        initialState={toFormState(submission)}
        submissionId={submission.id}
        uploadUrl={uploadUrl}
        previewImageUrl={previewImageUrl}
        publicUrl={submission.slug ? buildSubmissionPublicUrl(submission.slug) : null}
      />
    </div>
  );
}
