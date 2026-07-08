import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * Shared page layout for every SaaS calculator tool: header, a two-column
 * form/results split, and the pipeline-scan CTA. The results column shows a
 * placeholder card until `result` is provided, then swaps in the real
 * content and reveals the CTA beneath it.
 */
export function CalculatorPageShell({
  eyebrow = "Free calculator",
  title,
  subtitle,
  form,
  result,
  ctaHeadingSuffix,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle: string;
  form: ReactNode;
  result: ReactNode | null;
  ctaHeadingSuffix: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-12 sm:px-6 sm:py-20">
        <main className="flex-1">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-brand-navy">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {eyebrow}
            </div>
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
              {title}
            </h1>
            <p className="mt-6 max-w-xl text-balance text-base font-light sm:text-lg">
              {subtitle}
            </p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2 md:items-start">
            {/* Form */}
            <Card variant="brand">{form}</Card>

            {/* Results */}
            <div className="grid gap-8">
              <Card variant="brand">
                {result ?? (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-navy/70">
                      Your results
                    </p>
                    <p className="mt-3 text-sm font-light text-brand-navy/60">
                      Fill out the form to see where you stand.
                    </p>
                  </div>
                )}
              </Card>

              {result && (
                <div className="animate-in fade-in duration-300 rounded-xl bg-brand-navy p-6 text-brand-offwhite sm:p-8">
                  <h3 className="text-balance text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                    Want help improving your {ctaHeadingSuffix}
                  </h3>
                  <p className="mt-3 text-sm font-light text-brand-offwhite/85">
                    A 30-minute scan of what's working, what's not, and where
                    the leaks are. No pitch, no commitment.
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
