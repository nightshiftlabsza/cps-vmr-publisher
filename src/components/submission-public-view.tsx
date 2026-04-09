import Image from "next/image";
import type { TemplateType } from "@prisma/client";

import { PeoplePreview } from "@/components/people-preview";
import { Card } from "@/components/ui/card";
import type { LinkedPerson } from "@/lib/preview";
import { isStandardPreview } from "@/lib/preview";
import { extractYouTubeId } from "@/lib/youtube";
import { cn } from "@/lib/ui";

function YouTubeEmbed({ url, title }: { url: string; title: string }) {
  const videoId = extractYouTubeId(url);
  if (!videoId) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-lg border border-border-default px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-surface-tertiary"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/></svg>
        Watch on YouTube
      </a>
    );
  }
  return (
    <div className="w-full overflow-hidden rounded-xl bg-black aspect-video shadow-sm">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

function renderNoteParagraphs(notes?: string | null) {
  const paragraphs = notes
    ?.split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (!paragraphs?.length) return null;
  return paragraphs.map((p, i) => (
    <p key={`${p.slice(0, 20)}-${i}`} className="text-text-secondary leading-7">
      {p}
    </p>
  ));
}

export function SubmissionPublicView({
  templateType,
  title,
  sessionDateLabel,
  chiefComplaint,
  presenters,
  discussants,
  fileUrl,
  previewImageUrl,
  notes,
  youtubeUrl,
  className,
}: {
  templateType: TemplateType;
  title: string;
  sessionDateLabel?: string | null;
  chiefComplaint?: string | null;
  presenters: LinkedPerson[];
  discussants: LinkedPerson[];
  fileUrl?: string | null;
  previewImageUrl?: string | null;
  notes?: string | null;
  youtubeUrl?: string | null;
  className?: string;
}) {
  const noteParagraphs = renderNoteParagraphs(notes);

  return (
    <article className={cn("space-y-6", className)}>
      {/* Title */}
      <header className="border-b border-border-default pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          {title}
        </h1>
        {sessionDateLabel && (
          <p className="mt-2 text-sm text-text-muted">{sessionDateLabel}</p>
        )}
        {chiefComplaint?.trim() && (
          <p className="mt-3 text-base text-text-secondary">
            <span className="font-semibold text-text-primary">Chief Concern:</span>{" "}
            {chiefComplaint.trim()}
          </p>
        )}
      </header>

      {/* ── Standard / Raphael / IMG ── */}
      {isStandardPreview(templateType) && (
        <div className="space-y-6">
          {/* Video hero */}
          {youtubeUrl && <YouTubeEmbed url={youtubeUrl} title={title} />}

          {/* Whiteboard link */}
          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border-default px-4 py-2 text-sm font-medium text-text-secondary transition hover:bg-surface-tertiary hover:text-text-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              View Whiteboard (PDF)
            </a>
          )}

          {/* Two-column details */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left: Case details */}
            <div className="space-y-4">
              {noteParagraphs && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-text-primary">
                    Case Summary &amp; Teaching Points
                  </h3>
                  <div className="space-y-3 text-sm">{noteParagraphs}</div>
                </div>
              )}
            </div>

            {/* Right: People */}
            <div className="space-y-4">
              {presenters.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">
                    Case Presenter{presenters.length > 1 ? "s" : ""}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    <PeoplePreview people={presenters} emptyLabel="" />
                  </p>
                </div>
              )}
              {discussants.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">
                    Case Discussants
                  </h3>
                  <p className="text-sm text-text-secondary">
                    <PeoplePreview people={discussants} emptyLabel="" />
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Sunday Fundamentals ── */}
      {templateType === "sunday_fundamentals" && (
        <div className="space-y-6">
          {previewImageUrl ? (
            <Image
              src={previewImageUrl}
              alt={`${title} whiteboard`}
              width={1200}
              height={900}
              className="w-full rounded-xl border border-border-default object-cover"
              unoptimized
            />
          ) : (
            <div className="rounded-xl border-2 border-dashed border-border-default bg-surface-tertiary px-4 py-12 text-center text-sm text-text-muted">
              Whiteboard image will appear here.
            </div>
          )}
          {noteParagraphs && (
            <div className="space-y-3 text-sm">{noteParagraphs}</div>
          )}
        </div>
      )}

      {/* ── Custom ── */}
      {templateType === "custom" && (
        <div className="space-y-5">
          {youtubeUrl && <YouTubeEmbed url={youtubeUrl} title={title} />}
          {noteParagraphs && (
            <div className="space-y-3 text-sm">{noteParagraphs}</div>
          )}
          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
            >
              Open uploaded file
            </a>
          )}
        </div>
      )}
    </article>
  );
}
