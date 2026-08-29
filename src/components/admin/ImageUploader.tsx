"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Trash2, Replace } from "lucide-react";
import { useToast } from "@/components/admin/ToastProvider";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import type { UploadFolder } from "@/lib/types";
import { isStoredUploadUrl, shouldUnoptimizeImage } from "@/lib/upload-url";
import { cn } from "@/lib/utils";

type ImageUploaderProps = {
  label?: string;
  value?: string | null;
  alt?: string;
  folder: UploadFolder;
  /** @deprecated Use folder */
  category?: UploadFolder;
  onChange: (url: string | null) => void;
  className?: string;
};

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

function usesUnoptimizedImage(url: string) {
  return shouldUnoptimizeImage(url);
}

async function deleteStoredUrl(url: string, force = false) {
  const res = await fetch("/api/upload", {
    method: "DELETE",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, force }),
  });
  const data = await res.json();
  if (res.status === 409) {
    return { ok: false, references: data.references as string[] | undefined };
  }
  if (!res.ok) {
    throw new Error(data.error || "Delete failed");
  }
  return { ok: true as const };
}

export function ImageUploader({
  label = "Image",
  value,
  alt,
  folder,
  category,
  onChange,
  className,
}: ImageUploaderProps) {
  const uploadFolder = folder || category;
  if (!uploadFolder) {
    throw new Error("ImageUploader requires a folder prop");
  }

  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [removing, setRemoving] = useState(false);

  async function upload(file: File) {
    setUploading(true);
    const previous = value;
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", uploadFolder);
      const res = await fetch("/api/upload", {
        method: "POST",
        credentials: "same-origin",
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      onChange(data.url);

      if (previous && isStoredUploadUrl(previous) && previous !== data.url) {
        try {
          await deleteStoredUrl(previous, true);
        } catch {
          // Replacement succeeded; stale blob cleanup is best-effort.
        }
      }

      toast({ title: "Image uploaded", tone: "success" });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : undefined,
        tone: "error",
      });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove() {
    if (!value) {
      onChange(null);
      setConfirmOpen(false);
      return;
    }
    setRemoving(true);
    try {
      if (isStoredUploadUrl(value)) {
        const result = await deleteStoredUrl(value, false);
        if (!result.ok) {
          toast({
            title: "Image still referenced",
            description: (result.references || []).join(", "),
            tone: "error",
          });
          onChange(null);
          setConfirmOpen(false);
          return;
        }
      }
      onChange(null);
      toast({ title: "Image removed", tone: "success" });
      setConfirmOpen(false);
    } catch (error) {
      toast({
        title: "Could not remove image",
        description: error instanceof Error ? error.message : undefined,
        tone: "error",
      });
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-label uppercase tracking-[0.14em] text-charcoal/60">
          {label}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/15 px-3 py-1.5 text-[11px] font-label uppercase tracking-[0.12em] text-aubergine hover:border-lavender disabled:opacity-50"
          >
            {value ? <Replace className="h-3.5 w-3.5" /> : <ImagePlus className="h-3.5 w-3.5" />}
            {uploading ? "Uploading…" : value ? "Replace" : "Upload"}
          </button>
          {value ? (
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-burgundy/30 px-3 py-1.5 text-[11px] font-label uppercase tracking-[0.12em] text-burgundy hover:bg-burgundy/5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          ) : null}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
        }}
      />
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-dashed border-charcoal/15 bg-white/60">
        {value ? (
          <Image
            src={value}
            alt={alt || label}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 480px"
            unoptimized={usesUnoptimizedImage(value)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-charcoal/45">
            No image selected
          </div>
        )}
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Remove image?"
        description="This clears the field and deletes the stored file when it is not referenced elsewhere."
        confirmLabel="Remove"
        tone="danger"
        loading={removing}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={remove}
      />
    </div>
  );
}

/** Alias for CMS/admin image fields backed by MongoDB stored uploads. */
export const LocalImageField = ImageUploader;
