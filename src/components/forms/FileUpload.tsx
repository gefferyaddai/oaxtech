"use client";

import { useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  UPLOAD_ACCEPTED_LABEL,
  UPLOAD_MAX_FILES,
  validateUploadFile,
} from "@/lib/validation/schemas";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label?: string;
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Client-side upload picker.
 *
 * Type and size are validated here for fast feedback, and again on the server
 * using the same shared rules — the browser check is a convenience, not the
 * security boundary. Selected files are held in memory only; nothing is
 * uploaded until a storage provider is configured.
 */
export function FileUpload({ label = "Upload Supporting Files", files, onChange, disabled }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputId = useId();
  const errorId = `${inputId}-errors`;

  function accept(incoming: FileList | null) {
    if (!incoming) return;
    const nextErrors: string[] = [];
    const accepted: File[] = [];

    for (const file of Array.from(incoming)) {
      if (files.length + accepted.length >= UPLOAD_MAX_FILES) {
        nextErrors.push(`You can attach up to ${UPLOAD_MAX_FILES} files.`);
        break;
      }
      const problem = validateUploadFile(file);
      if (problem) nextErrors.push(problem);
      else accepted.push(file);
    }

    setErrors(nextErrors);
    if (accepted.length) onChange([...files, ...accepted]);
  }

  function remove(index: number) {
    onChange(files.filter((_, i) => i !== index));
    setErrors([]);
  }

  return (
    <div>
      <p className="field-label">{label}</p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (!disabled) accept(e.dataTransfer.files);
        }}
        className={cn(
          "border-rule border-dashed p-6 text-center transition-colors",
          isDragging ? "border-revision bg-revision-soft" : "border-graphite bg-sheet-sunk",
          disabled && "opacity-60",
        )}
      >
        <span className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center border-rule border-graphite bg-revision text-white">
          <Icon name="Upload" className="h-5 w-5" />
        </span>
        <p className="font-display text-sm font-medium text-ink">
          <button
            type="button"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className="text-cobalt underline underline-offset-2"
          >
            Choose files
          </button>{" "}
          or drag them here
        </p>
        <p className="mt-1.5 text-xs text-slate">
          Share briefs, designs, screenshots or reference documents.
        </p>
        <p className="mt-1 text-xs text-muted">{UPLOAD_ACCEPTED_LABEL}</p>

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          multiple
          disabled={disabled}
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
          aria-describedby={errors.length ? errorId : undefined}
          onChange={(e) => {
            accept(e.target.files);
            e.target.value = "";
          }}
          className="sr-only"
        />
      </div>

      {errors.length > 0 && (
        <ul id={errorId} className="mt-2 space-y-1" role="alert">
          {errors.map((error) => (
            <li key={error} className="flex items-start gap-1.5 text-xs text-danger">
              <Icon name="AlertCircle" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {error}
            </li>
          ))}
        </ul>
      )}

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 rounded-md border border-line bg-paper px-3 py-2"
            >
              <Icon name="Paperclip" className="h-4 w-4 shrink-0 text-muted" />
              <span className="min-w-0 flex-1 truncate text-sm text-charcoal">{file.name}</span>
              <span className="shrink-0 text-xs tabular-nums text-muted">{formatBytes(file.size)}</span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="shrink-0 rounded p-1 text-muted transition-colors hover:text-danger"
              >
                <Icon name="X" className="h-4 w-4" label={`Remove ${file.name}`} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
