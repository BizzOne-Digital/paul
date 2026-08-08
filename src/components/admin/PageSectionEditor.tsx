"use client";

import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  btnSecondaryClass,
  fieldClass,
  labelClass,
  panelClass,
} from "@/components/admin/admin-styles";
import { mediaAlt, mediaUrl } from "@/lib/media";
import type { PageSection } from "@/lib/types";

type Props = {
  section: PageSection;
  onChange: (patch: Partial<PageSection>) => void;
};

export function PageSectionEditor({ section, onChange }: Props) {
  return (
    <div className={`${panelClass} space-y-4`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl text-aubergine">
          Section: {section.key}
        </h2>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={section.visible !== false}
            onChange={(e) => onChange({ visible: e.target.checked })}
          />
          Visible
        </label>
      </div>
      <Field label="Section key" value={section.key} onChange={() => undefined} disabled />
      <Field
        label="Eyebrow"
        value={section.eyebrow || ""}
        onChange={(v) => onChange({ eyebrow: v })}
      />
      <Field
        label="Heading"
        value={section.heading || ""}
        onChange={(v) => onChange({ heading: v })}
      />
      <Field
        label="Subheading"
        value={section.subheading || ""}
        onChange={(v) => onChange({ subheading: v })}
      />
      <TextArea
        label="Body"
        value={section.body || ""}
        onChange={(v) => onChange({ body: v })}
      />
      <TextArea
        label="Lists (one item per line; blank line starts a new list)"
        value={(section.lists || []).map((list) => list.join("\n")).join("\n\n")}
        onChange={(v) =>
          onChange({
            lists: v
              .split(/\n\s*\n/)
              .map((block) =>
                block
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean),
              )
              .filter((list) => list.length > 0),
          })
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="CTA label"
          value={section.ctaLabel || ""}
          onChange={(v) => onChange({ ctaLabel: v })}
        />
        <Field
          label="CTA link"
          value={section.ctaHref || ""}
          onChange={(v) => onChange({ ctaHref: v })}
        />
        <Field
          label="Secondary CTA label"
          value={section.secondaryCtaLabel || ""}
          onChange={(v) => onChange({ secondaryCtaLabel: v })}
        />
        <Field
          label="Secondary CTA link"
          value={section.secondaryCtaHref || ""}
          onChange={(v) => onChange({ secondaryCtaHref: v })}
        />
        <Field
          label="Display order"
          type="number"
          value={String(section.order ?? 0)}
          onChange={(v) => onChange({ order: Number(v) || 0 })}
        />
      </div>
      <ImageUploader
        label="Primary image"
        category="pages"
        value={mediaUrl(section.primaryImage)}
        onChange={(url) =>
          onChange({
            primaryImage: url
              ? { url, alt: mediaAlt(section.primaryImage) }
              : undefined,
          })
        }
      />
      <ImageUploader
        label="Secondary image"
        category="pages"
        value={mediaUrl(section.secondaryImage)}
        onChange={(url) =>
          onChange({
            secondaryImage: url
              ? { url, alt: mediaAlt(section.secondaryImage) }
              : undefined,
          })
        }
      />
      <ImageUploader
        label="Background image"
        category="pages"
        value={mediaUrl(section.backgroundImage)}
        onChange={(url) =>
          onChange({
            backgroundImage: url
              ? { url, alt: mediaAlt(section.backgroundImage) }
              : undefined,
          })
        }
      />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className={`${labelClass} mb-0`}>Cards</p>
          <button
            type="button"
            className={btnSecondaryClass}
            onClick={() =>
              onChange({
                cards: [
                  ...(section.cards || []),
                  {
                    key: `card-${Date.now()}`,
                    title: "New card",
                    body: "",
                  },
                ],
              })
            }
          >
            Add card
          </button>
        </div>
        {(section.cards || []).map((card, index) => (
          <div
            key={card.key || index}
            className="space-y-2 rounded-xl border border-charcoal/10 p-3"
          >
            <Field
              label="Card title"
              value={card.title || ""}
              onChange={(v) => {
                const cards = [...(section.cards || [])];
                cards[index] = { ...card, title: v };
                onChange({ cards });
              }}
            />
            <TextArea
              label="Card body"
              value={card.body || ""}
              onChange={(v) => {
                const cards = [...(section.cards || [])];
                cards[index] = { ...card, body: v };
                onChange({ cards });
              }}
            />
            <button
              type="button"
              className="text-xs text-burgundy"
              onClick={() =>
                onChange({
                  cards: (section.cards || []).filter((_, i) => i !== index),
                })
              }
            >
              Remove card
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        className={fieldClass}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <textarea
        className={`${fieldClass} min-h-28`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
