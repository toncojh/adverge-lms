import { useMemo, useState } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import {
  EMPTY_SAAS_METRICS_VALUES,
  SaasMetricsInputs,
  type SaasMetricsValues,
} from "@/components/SaasMetricsInputs";
import { CalculatorPageShell } from "@/components/CalculatorPageShell";

type TierKey = "excellent" | "healthy" | "watch" | "concerning";

type Tier = {
  key: TierKey;
  label: string;
  badgeClass: string;
  body: string;
};

const MAX_SCALE_MONTHS = 30; // benchmark bar caps its fill at this many months

function tierFor(months: number): Tier {
  if (months < 12) {
    return {
      key: "excellent",
      label: "Excellent",
      badgeClass: "bg-[#31937c] text-white",
      body: "You're recovering acquisition costs fast, which means more cash is free to reinvest in growth sooner.",
    };
  }
  if (months <= 18) {
    return {
      key: "healthy",
      label: "Healthy",
      badgeClass: "bg-[#31937c]/15 text-[#1f6152]",
      body: "This is within the range most efficient SaaS companies land in. Solid footing, not much to worry about here.",
    };
  }
  if (months <= 24) {
    return {
      key: "watch",
      label: "Watch Closely",
      badgeClass: "bg-amber-500/15 text-amber-700",
      body: "You're on the edge of what's considered sustainable. Keep an eye on whether CAC creeps up further or margin erodes.",
    };
  }
  return {
    key: "concerning",
    label: "Concerning",
    badgeClass: "bg-[#cc3366] text-white",
    body: "This is on the long end. Most efficient SaaS companies recover acquisition costs within 12-18 months. Worth digging into whether it's a CAC problem, a pricing problem, or a margin problem.",
  };
}

export function CacPaybackCalculator() {
  const [values, setValues] = useState<SaasMetricsValues>(EMPTY_SAAS_METRICS_VALUES);

  function updateValues(patch: Partial<SaasMetricsValues>) {
    setValues((prev) => ({ ...prev, ...patch }));
  }

  const months = useMemo(() => {
    const { cac, arpu, grossMargin } = values;
    const cacNum = Number(cac);
    const arpuNum = Number(arpu);
    const marginNum = Number(grossMargin);

    if (!cac || !arpu || !grossMargin || arpuNum <= 0 || marginNum <= 0) {
      return null;
    }

    const result = cacNum / (arpuNum * (marginNum / 100));
    if (!Number.isFinite(result)) return null;
    return Math.round(result * 10) / 10;
  }, [values]);

  const tier = months !== null ? tierFor(months) : null;
  const markerPercent =
    months !== null ? Math.min((months / MAX_SCALE_MONTHS) * 100, 100) : 0;

  return (
    <TooltipProvider delayDuration={150}>
      <CalculatorPageShell
        title="What's a Good CAC Payback Period? Real SaaS Benchmarks (Not Just the Formula)"
        subtitle="Enter your numbers below to see where you stand."
        ctaHeadingSuffix={<span className="text-brand-teal">CAC payback?</span>}
        form={
          <div className="grid gap-6">
            <SaasMetricsInputs values={values} onChange={updateValues} />
          </div>
        }
        result={
          months !== null && tier !== null ? (
            <div className="animate-in fade-in duration-300">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-navy/70">
                Your CAC payback period
              </p>
              <div className="mt-3 flex flex-wrap items-end gap-3">
                <span className="text-5xl font-extrabold tracking-tight tabular-nums text-brand-navy sm:text-6xl">
                  {months.toFixed(1)}
                </span>
                <span className="pb-1.5 text-lg font-light">months</span>
              </div>
              <span
                className={
                  "mt-4 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold " +
                  tier.badgeClass
                }
              >
                {tier.label}
              </span>
              <p className="mt-4 max-w-xl text-balance text-sm font-light">
                {tier.body}
              </p>

              {/* Benchmark bar */}
              <div className="mt-8">
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div className="absolute inset-0 flex">
                    <div
                      className="h-full bg-[#31937c]"
                      style={{ width: `${(12 / MAX_SCALE_MONTHS) * 100}%` }}
                    />
                    <div
                      className="h-full bg-[#31937c]/40"
                      style={{ width: `${(6 / MAX_SCALE_MONTHS) * 100}%` }}
                    />
                    <div
                      className="h-full bg-amber-500/60"
                      style={{ width: `${(6 / MAX_SCALE_MONTHS) * 100}%` }}
                    />
                    <div className="h-full flex-1 bg-[#cc3366]/60" />
                  </div>
                  <div
                    className="absolute top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white bg-brand-navy shadow transition-[left] duration-300"
                    style={{ left: `${markerPercent}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[11px] font-light text-brand-navy/60">
                  <span>0</span>
                  <span>12</span>
                  <span>18</span>
                  <span>24</span>
                  <span>24+</span>
                </div>
              </div>
            </div>
          ) : null
        }
      />
    </TooltipProvider>
  );
}
