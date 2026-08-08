"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactSchema,
  type ContactFormValues,
} from "@/lib/validations";
import {
  ACQUISITION_TYPES,
  BC_REGIONS,
  BUDGET_RANGES,
  CONTACT_METHODS,
  CURRENT_STAGES,
  REASON_OPTIONS,
  TIMEFRAME_OPTIONS,
} from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ContactFormProps = {
  defaultAcquisitionType?: string;
};

export function ContactForm({ defaultAcquisitionType = "" }: ContactFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      reason: undefined,
      timeframe: undefined,
      preferredRegion: "",
      acquisitionType: defaultAcquisitionType || "",
      budgetRange: "",
      currentStage: "",
      preferredContactMethod: "",
      details: "",
      consent: undefined,
      website: "",
      companyWebsite: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
      };

      if (!res.ok) {
        setServerError(
          data.error ||
            "We could not save your inquiry. Please try again or call us directly.",
        );
        return;
      }

      setSuccess(true);
      reset();
    } catch {
      setServerError(
        "A network error occurred. Please try again or call us directly.",
      );
    }
  };

  if (success) {
    return (
      <div
        className="border border-lavender/40 bg-lavender-soft/30 px-8 py-12 text-center"
        role="status"
      >
        <p className="font-label text-[0.7rem] tracking-[0.22em] text-burgundy">
          Inquiry received
        </p>
        <h3 className="font-serif mt-4 text-3xl text-aubergine">
          Thank you for reaching out
        </h3>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-charcoal/75">
          Your inquiry has been saved. We will review your details and respond
          using your preferred contact method when available.
        </p>
        <Button
          type="button"
          className="mt-8"
          variant="secondary"
          onClick={() => setSuccess(false)}
        >
          Submit another inquiry
        </Button>
      </div>
    );
  }

  const fieldClass =
    "mt-2 w-full border border-aubergine/15 bg-ivory/80 px-4 py-3 text-sm text-charcoal outline-none transition focus:border-lavender";
  const labelClass =
    "font-label text-[0.65rem] tracking-[0.18em] text-aubergine/70";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative space-y-6"
      noValidate
    >
      {/* Honeypot */}
      <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
        <label htmlFor="companyWebsite">Company website</label>
        <input
          id="companyWebsite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("companyWebsite")}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field
          label="Full name *"
          error={errors.fullName?.message}
          labelClass={labelClass}
        >
          <input
            className={fieldClass}
            autoComplete="name"
            {...register("fullName")}
          />
        </Field>
        <Field
          label="Phone *"
          error={errors.phone?.message}
          labelClass={labelClass}
        >
          <input
            className={fieldClass}
            type="tel"
            autoComplete="tel"
            {...register("phone")}
          />
        </Field>
      </div>

      <Field
        label="Email *"
        error={errors.email?.message}
        labelClass={labelClass}
      >
        <input
          className={fieldClass}
          type="email"
          autoComplete="email"
          {...register("email")}
        />
      </Field>

      <div className="grid gap-6 md:grid-cols-2">
        <Field
          label="Reason for inquiry *"
          error={errors.reason?.message}
          labelClass={labelClass}
        >
          <select className={fieldClass} {...register("reason")} defaultValue="">
            <option value="" disabled>
              Select a reason
            </option>
            {REASON_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Timeframe to acquisition *"
          error={errors.timeframe?.message}
          labelClass={labelClass}
        >
          <select
            className={fieldClass}
            {...register("timeframe")}
            defaultValue=""
          >
            <option value="" disabled>
              Select a timeframe
            </option>
            {TIMEFRAME_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Preferred BC region" labelClass={labelClass}>
          <select className={fieldClass} {...register("preferredRegion")}>
            <option value="">Optional</option>
            {BC_REGIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Acquisition type" labelClass={labelClass}>
          <select className={fieldClass} {...register("acquisitionType")}>
            <option value="">Optional</option>
            {ACQUISITION_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Approximate budget range" labelClass={labelClass}>
          <select className={fieldClass} {...register("budgetRange")}>
            <option value="">Optional</option>
            {BUDGET_RANGES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Current stage" labelClass={labelClass}>
          <select className={fieldClass} {...register("currentStage")}>
            <option value="">Optional</option>
            {CURRENT_STAGES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Preferred contact method" labelClass={labelClass}>
        <select className={fieldClass} {...register("preferredContactMethod")}>
          <option value="">Optional</option>
          {CONTACT_METHODS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Additional details" labelClass={labelClass}>
        <textarea
          className={cn(fieldClass, "min-h-32 resize-y")}
          rows={5}
          {...register("details")}
        />
      </Field>

      <label className="flex items-start gap-3 text-sm leading-relaxed text-charcoal/80">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-aubergine"
          {...register("consent")}
        />
        <span>
          I consent to being contacted about my inquiry and understand this is
          not legal, tax, brokerage, or appraisal advice. *
        </span>
      </label>
      {errors.consent?.message ? (
        <p className="text-sm text-berry" role="alert">
          {errors.consent.message}
        </p>
      ) : null}

      {serverError ? (
        <p
          className="border border-berry/30 bg-berry/5 px-4 py-3 text-sm text-cabernet"
          role="alert"
        >
          {serverError}
        </p>
      ) : null}

      <Button type="submit" variant="magnetic" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Saving inquiry…" : "Submit inquiry"}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  labelClass,
  children,
}: {
  label: string;
  error?: string;
  labelClass: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block text-sm text-berry" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}
