import { Fragment } from "react";

import type { LinkedPerson } from "@/lib/preview";

export function PeoplePreview({
  people,
  emptyLabel,
}: {
  people: LinkedPerson[];
  emptyLabel: string;
}) {
  if (!people.length) {
    return <span className="text-text-muted">{emptyLabel}</span>;
  }

  return (
    <>
      {people.map((person, index) => (
        <Fragment key={`${person.fullName}-${index}`}>
          {index > 0 ? ", " : null}
          {person.url ? (
            <a
              href={person.url}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent"
            >
              {person.fullName}
            </a>
          ) : (
            <span className="font-medium text-text-primary">{person.fullName}</span>
          )}
        </Fragment>
      ))}
    </>
  );
}
