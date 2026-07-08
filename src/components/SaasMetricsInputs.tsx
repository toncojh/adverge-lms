import { Info } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function InfoTooltip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-brand-navy/50 outline-none transition hover:text-primary focus-visible:text-primary"
          aria-label="More info"
        >
          <Info className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-[240px] text-left" side="top">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

export function FieldLabel({
  htmlFor,
  children,
  tooltip,
}: {
  htmlFor: string;
  children: React.ReactNode;
  tooltip: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-start gap-1.5 text-sm font-semibold text-brand-navy"
    >
      <span>{children}</span>
      <InfoTooltip text={tooltip} />
    </label>
  );
}

export type SaasMetricsValues = {
  cac: string;
  arpu: string;
  grossMargin: string;
};

export const EMPTY_SAAS_METRICS_VALUES: SaasMetricsValues = {
  cac: "",
  arpu: "",
  grossMargin: "",
};

/**
 * Shared CAC / ARPU / gross margin inputs used by every SaaS unit-economics
 * calculator. Renders bare fields (no wrapping Card) so callers can compose
 * them alongside their own tool-specific inputs inside a single form card.
 */
export function SaasMetricsInputs({
  values,
  onChange,
}: {
  values: SaasMetricsValues;
  onChange: (patch: Partial<SaasMetricsValues>) => void;
}) {
  return (
    <>
      <div className="grid gap-2">
        <FieldLabel
          htmlFor="cac-input"
          tooltip="Total sales and marketing spend divided by the number of new customers you won, over the same period."
        >
          What does it cost you to acquire one customer?
        </FieldLabel>
        <div className="relative">
          <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-sm font-light text-brand-navy/60">
            €
          </span>
          <input
            id="cac-input"
            type="number"
            inputMode="decimal"
            min={0}
            placeholder="1500"
            autoComplete="off"
            value={values.cac}
            onChange={(e) => onChange({ cac: e.target.value })}
            className="w-full rounded-full border-2 border-[#f5f5f5] bg-white py-3 pl-9 pr-5 text-sm font-light outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <FieldLabel
          htmlFor="arpu-input"
          tooltip="The average amount a single customer pays you per month, across your whole customer base."
        >
          What's your average monthly revenue per customer?
        </FieldLabel>
        <div className="relative">
          <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-sm font-light text-brand-navy/60">
            €/mo
          </span>
          <input
            id="arpu-input"
            type="number"
            inputMode="decimal"
            min={0}
            placeholder="150"
            autoComplete="off"
            value={values.arpu}
            onChange={(e) => onChange({ arpu: e.target.value })}
            className="w-full rounded-full border-2 border-[#f5f5f5] bg-white py-3 pl-16 pr-5 text-sm font-light outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <FieldLabel
          htmlFor="margin-input"
          tooltip="Revenue minus direct costs like hosting and support, shown as a percentage. 80% is a common SaaS baseline."
        >
          What's your gross margin?
        </FieldLabel>
        <div className="relative">
          <input
            id="margin-input"
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            placeholder="80"
            autoComplete="off"
            value={values.grossMargin}
            onChange={(e) => onChange({ grossMargin: e.target.value })}
            className="w-full rounded-full border-2 border-[#f5f5f5] bg-white py-3 pl-5 pr-9 text-sm font-light outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-sm font-light text-brand-navy/60">
            %
          </span>
        </div>
      </div>
    </>
  );
}
