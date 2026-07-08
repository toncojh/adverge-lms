import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  EMPTY_SAAS_METRICS_VALUES,
  FieldLabel,
  SaasMetricsInputs,
  type SaasMetricsValues,
} from "@/components/SaasMetricsInputs";

type TierKey = "losing" | "belowHealthy" | "healthy" | "underinvesting";

type Tier = {
  key: TierKey;
  label: string;
  badgeClass: string;
  body: string;
};

const MAX_SCALE_RATIO = 8; // benchmark bar caps its fill at this ratio

function tierFor(ratio: number): Tier {
  if (ratio < 1) {
    return {
      key: "losing",
      label: "Losing Money",
      badgeClass: "bg-[#cc3366] text-white",
      body: "You're spending more to acquire a customer than they're worth. Worth digging into CAC first, unless retention is the real issue.",
    };
  }
  if (ratio < 3) {
    return {
      key: "belowHealthy",
      label: "Below Healthy",
      badgeClass: "bg-amber-500/15 text-amber-700",
      body: "Below the 3:1 benchmark most efficient SaaS companies hit. Could be a CAC, pricing, or retention problem.",
    };
  }
  if (ratio <= 5) {
    return {
      key: "healthy",
      label: "Healthy",
      badgeClass: "bg-[#31937c] text-white",
      body: "This is the benchmark range most efficient SaaS companies land in. Solid unit economics.",
    };
  }
  return {
    key: "underinvesting",
    label: "Possibly Underinvesting",
    badgeClass: "bg-amber-500/15 text-amber-700",
    body: "A very high ratio often means there's room to invest more in acquisition without hurting unit economics, not that everything's perfect.",
  };
}

export function LtvCacCalculator() {
  const [values, setValues] = useState<SaasMetricsValues>(EMPTY_SAAS_METRICS_VALUES);
  const [churn, setChurn] = useState("");

  function updateValues(patch: Partial<SaasMetricsValues>) {
    setValues((prev) => ({ ...prev, ...patch }));
  }

  const ratio = useMemo(() => {
    const { cac, arpu, grossMargin } = values;
    const cacNum = Number(cac);
    const arpuNum = Number(arpu);
    const marginNum = Number(grossMargin);
    const churnNum = Number(churn);

    if (
      !cac ||
      !arpu ||
      !grossMargin ||
      !churn ||
      cacNum <= 0 ||
      arpuNum <= 0 ||
      marginNum <= 0 ||
      churnNum <= 0
    ) {
      return null;
    }

    const ltv = (arpuNum * (marginNum / 100)) / (churnNum / 100);
    const result = ltv / cacNum;
    if (!Number.isFinite(result)) return null;
    return Math.round(result * 10) / 10;
  }, [values, churn]);

  const tier = ratio !== null ? tierFor(ratio) : null;
  const markerPercent =
    ratio !== null ? Math.min((ratio / MAX_SCALE_RATIO) * 100, 100) : 0;

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-12 sm:px-6 sm:py-20">
          <main className="flex-1">
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-brand-navy">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Free calculator
              </div>
              <h1 className="text-balance text-4xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
                Is Your LTV:CAC Ratio Actually Healthy? Benchmarks by Growth
                Stage
              </h1>
              <p className="mt-6 max-w-xl text-balance text-base font-light sm:text-lg">
                Enter your numbers below to see where you stand.
              </p>
            </div>

            {/* Inputs */}
            <Card variant="brand" className="mt-10">
              <div className="grid gap-6">
                <SaasMetricsInputs values={values} onChange={updateValues} />

                <div className="grid gap-2">
                  <FieldLabel
                    htmlFor="churn-input"
                    tooltip="If you don't track this precisely, use 100 divided by your average customer lifespan in months as a rough estimate."
                  >
                    What percentage of customers do you lose each month?
                  </FieldLabel>
                  <div className="relative">
                    <input
                      id="churn-input"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      max={100}
                      placeholder="3"
                      value={churn}
                      onChange={(e) => setChurn(e.target.value)}
                      className="w-full rounded-full border-2 border-[#f5f5f5] bg-white py-3 pl-5 pr-9 text-sm font-light outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-sm font-light text-brand-navy/60">
                      %
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Results */}
            {ratio !== null && tier !== null && (
              <Card variant="brand" className="mt-8">
                <div className="animate-in fade-in duration-300">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-navy/70">
                    Your LTV:CAC ratio
                  </p>
                  <div className="mt-3 flex flex-wrap items-end gap-3">
                    <span className="text-5xl font-extrabold tracking-tight tabular-nums text-brand-navy sm:text-6xl">
                      {ratio.toFixed(1)} : 1
                    </span>
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
                          className="h-full bg-[#cc3366]/60"
                          style={{ width: `${(1 / MAX_SCALE_RATIO) * 100}%` }}
                        />
                        <div
                          className="h-full bg-amber-500/60"
                          style={{ width: `${(2 / MAX_SCALE_RATIO) * 100}%` }}
                        />
                        <div
                          className="h-full bg-[#31937c]"
                          style={{ width: `${(2 / MAX_SCALE_RATIO) * 100}%` }}
                        />
                        <div className="h-full flex-1 bg-amber-500/60" />
                      </div>
                      <div
                        className="absolute top-1/2 h-4 w-4 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white bg-brand-navy shadow transition-[left] duration-300"
                        style={{ left: `${markerPercent}%` }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between text-[11px] font-light text-brand-navy/60">
                      <span>0</span>
                      <span>1</span>
                      <span>3</span>
                      <span>5</span>
                      <span>5+</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* CTA */}
            {ratio !== null && tier !== null && (
              <div className="mt-10 rounded-xl bg-brand-navy p-6 text-brand-offwhite sm:p-8">
                <h3 className="text-balance text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                  Want help improving your{" "}
                  <span className="text-brand-teal">unit economics?</span>
                </h3>
                <p className="mt-3 text-sm font-light text-brand-offwhite/85">
                  A 30-minute scan of what's working, what's not, and where the
                  leaks are. No pitch, no commitment.
                </p>
                <div className="mt-6">
                  <Button asChild variant="brand" size="brand" className="text-sm">
                    <a
                      href="https://adverge.com/performance-audit/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Your Free Pipeline Scan
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
