export const dynamic = "force-dynamic";

import Link from "next/link";

import { AdminTable } from "@/components/admin-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SUBMISSION_STATUS_OPTIONS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const [submissions, groupedStatuses] = await Promise.all([
    prisma.submission.findMany({
      orderBy: [{ updatedAt: "desc" }],
    }),
    prisma.submission.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
    }),
  ]);

  const totalSubmissions = groupedStatuses.reduce(
    (total, group) => total + group._count._all,
    0,
  );
  const counts: Record<string, number> = {};
  for (const group of groupedStatuses) {
    counts[group.status] = group._count._all;
  }

  const stats = [
    { label: "Total", value: totalSubmissions, filter: undefined, color: "text-text-primary" },
    { label: "Awaiting YouTube", value: counts["awaiting_youtube"] ?? 0, filter: "awaiting_youtube", color: "text-status-warning" },
    { label: "Ready", value: counts["ready_to_publish"] ?? 0, filter: "ready_to_publish", color: "text-status-success" },
    { label: "Published", value: counts["published"] ?? 0, filter: "published", color: "text-status-published" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text-primary">Dashboard</h1>
        <Link href="/submit">
          <Button size="md">New submission</Button>
        </Link>
      </div>

      {/* Stats bar */}
      <Card className="flex items-center divide-x divide-border-default overflow-x-auto p-0">
        {stats.map((stat) => (
          <div key={stat.label} className="flex-1 min-w-[120px] px-5 py-4">
            <p className="text-xs font-medium text-text-muted">{stat.label}</p>
            <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </Card>

      {/* Table with client-side filtering/sorting */}
      <AdminTable
        submissions={submissions.map((s) => ({
          id: s.id,
          title: s.title,
          templateType: s.templateType,
          sessionDate: s.sessionDate.toISOString(),
          createdAt: s.createdAt.toISOString(),
          status: s.status,
          slug: s.slug,
        }))}
      />
    </div>
  );
}
