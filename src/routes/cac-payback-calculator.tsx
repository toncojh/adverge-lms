import { createFileRoute } from "@tanstack/react-router";
import { CacPaybackCalculator } from "@/components/CacPaybackCalculator";

export const Route = createFileRoute("/cac-payback-calculator")({
  head: () => ({
    meta: [
      { title: "CAC Payback Period Calculator | Adverge" },
      {
        name: "description",
        content:
          "See how your CAC payback period compares to real SaaS benchmarks. Enter your CAC, ARPU, and gross margin for an instant result.",
      },
      {
        property: "og:title",
        content: "What's a Good CAC Payback Period?",
      },
      {
        property: "og:description",
        content:
          "Real SaaS benchmarks, not just the formula. Enter your numbers to see where you stand.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CacPaybackCalculatorRoute,
});

function CacPaybackCalculatorRoute() {
  return <CacPaybackCalculator />;
}
