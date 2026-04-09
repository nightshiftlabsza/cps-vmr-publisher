"use client";

import { cn } from "@/lib/ui";
import { useCallback, useEffect, useRef, useState } from "react";

interface InlineEditProps {
  value: string;
  onSave: (value: string) => void | Promise<void>;
  type?: "text" | "url" | "date" | "textarea";
  placeholder?: string;
  className?: string;
  displayClassName?: string;
  disabled?: boolean;
  emptyText?: string;
}

export function InlineEdit({
  value,
  onSave,
  type = "text",
  placeholder,
  className,
  displayClassName,
  disabled = false,
  emptyText = "Click to edit",
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      if (type !== "date" && inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      }
    }
  }, [editing, type]);

  const commit = useCallback(async () => {
    if (draft === value) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await onSave(draft);
    } finally {
      setSaving(false);
      setEditing(false);
    }
  }, [draft, value, onSave]);

  const cancel = useCallback(() => {
    setDraft(value);
    setEditing(false);
  }, [value]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && type !== "textarea") {
        e.preventDefault();
        commit();
      } else if (e.key === "Escape") {
        cancel();
      }
    },
    [commit, cancel, type],
  );

  if (disabled) {
    return (
      <span className={cn("text-text-muted", displayClassName)}>
        {value || emptyText}
      </span>
    );
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className={cn(
          "w-full text-left rounded-md px-2 py-1 -mx-2 -my-1 transition-colors hover:bg-surface-tertiary cursor-text",
          !value && "text-text-muted italic",
          displayClassName,
          className,
        )}
      >
        {value || emptyText}
      </button>
    );
  }

  const inputClasses =
    "w-full rounded-lg border border-accent bg-surface-secondary px-3 py-1.5 text-sm text-text-primary outline-none ring-2 ring-accent/15";

  if (type === "textarea") {
    return (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={saving}
        className={cn(inputClasses, "min-h-20 resize-y", className)}
      />
    );
  }

  return (
    <input
      ref={inputRef as React.RefObject<HTMLInputElement>}
      type={type}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={saving}
      className={cn(inputClasses, className)}
    />
  );
}
