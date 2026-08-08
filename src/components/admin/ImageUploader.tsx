"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Trash2, Replace } from "lucide-react";
import { useToast } from "@/components/admin/ToastProvider";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import type { UploadCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

type ImageUploaderProps = {
  label?: string;
  value?: string | null;
  alt?: string;
  category: UploadCategory;
  onChange: (url: string | null) => void;
  className?: string;
};

export function ImageUploader({
  label = "Image",
  value,
  alt,
  category,
  onChange,
  className,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [removing, setRemoving] = useState(false);

  async function upload(file: File) {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("category", category);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
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
      const res = await fetch("/api/admin/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value, force: false }),
      });
      const data = await res.json();
      if (res.status === 409) {
        toast({
          title: "Image still referenced",
          description: (data.references || []).join(", "),
          tone: "error",
        });
        onChange(null);
        setConfirmOpen(false);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Delete failed");
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
        accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
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
            unoptimized={value.startsWith("/uploads/")}
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
        description="This clears the field and attempts to delete the file if it is not referenced elsewhere."
        confirmLabel="Remove"
        tone="danger"
        loading={removing}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={remove}
      />
    </div>
  );
}
