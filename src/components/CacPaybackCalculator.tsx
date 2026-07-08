import { useMemo, useState } from "react";
import { ArrowRight, Info } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

function InfoTooltip({ text }: { text: string }) {
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

function FieldLabel({
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

export function CacPaybackCalculator() {
  const [cac, setCac] = useState("");
  const [arpu, setArpu] = useState("");
  const [grossMargin, setGrossMargin] = useState("");

  const months = useMemo(() => {
    const cacNum = Number(cac);
    const arpuNum = Number(arpu);
    const marginNum = Number(grossMargin);

    if (!cac || !arpu || !grossMargin || arpuNum <= 0 || marginNum <= 0) {
      return null;
    }

    const result = cacNum / (arpuNum * (marginNum / 100));
    if (!Number.isFinite(result)) return null;
    return Math.round(result * 10) / 10;
  }, [cac, arpu, grossMargin]);

  const tier = months !== null ? tierFor(months) : null;
  const markerPercent =
    months !== null ? Math.min((months / MAX_SCALE_MONTHS) * 100, 100) : 0;

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
                What's a Good CAC Payback Period? Real SaaS Benchmarks (Not
                Just the Formula)
              </h1>
              <p className="mt-6 max-w-xl text-balance text-base font-light sm:text-lg">
                Enter your numbers below to see where you stand.
              </p>
            </div>

            {/* Inputs */}
            <Card variant="brand" className="mt-10">
              <div className="grid gap-6">
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
                      value={cac}
                      onChange={(e) => setCac(e.target.value)}
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
                      value={arpu}
                      onChange={(e) => setArpu(e.target.value)}
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
                      value={grossMargin}
                      onChange={(e) => setGrossMargin(e.target.value)}
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
            {months !== null && tier !== null && (
              <Card variant="brand" className="mt-8">
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
              </Card>
            )}

            {/* CTA */}
            {months !== null && tier !== null && (
              <div className="mt-10 rounded-xl bg-brand-navy p-6 text-brand-offwhite sm:p-8">
                <h3 className="text-balance text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                  Want help improving your{" "}
                  <span className="text-brand-teal">CAC payback?</span>
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
