import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Adverge Tools" },
      {
        name: "description",
        content: "Free diagnostic tools for founders and marketing directors.",
      },
    ],
  }),
  component: ToolsIndex,
});

function ToolsIndex() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-12 sm:px-6 sm:py-20">
        <h1 className="text-balance text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
          Adverge Tools
        </h1>
        <p className="mt-3 text-balance text-base font-light">
          Free diagnostic tools for founders and marketing directors.
        </p>

        <div className="mt-10 grid gap-4">
          <Card variant="brand">
            <CardHeader className="p-0">
              <CardTitle className="text-lg text-brand-navy">Is Your Agency Failing You?</CardTitle>
              <CardDescription className="mt-2 font-light">
                10 questions. 2 minutes. Find out if it's time for an honest conversation with your
                agency.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Button asChild variant="brand" size="brand" className="mt-6 text-sm">
                <Link to="/red-flags-quiz">
                  Take the quiz
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card variant="brand">
            <CardHeader className="p-0">
              <CardTitle className="text-lg text-brand-navy">
                What's a Good CAC Payback Period?
              </CardTitle>
              <CardDescription className="mt-2 font-light">
                Enter your CAC, ARPU, and gross margin to see how you stack up against real SaaS
                benchmarks.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Button asChild variant="brand" size="brand" className="mt-6 text-sm">
                <Link to="/cac-payback-calculator">
                  Open the calculator
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card variant="brand">
            <CardHeader className="p-0">
              <CardTitle className="text-lg text-brand-navy">
                Is Your LTV:CAC Ratio Actually Healthy?
              </CardTitle>
              <CardDescription className="mt-2 font-light">
                Enter your CAC, ARPU, gross margin, and churn rate to see how your unit economics
                compare to real SaaS benchmarks.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Button asChild variant="brand" size="brand" className="mt-6 text-sm">
                <Link to="/ltv-cac-calculator">
                  Open the calculator
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
