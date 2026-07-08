import { createFileRoute } from "@tanstack/react-router";
import { LtvCacCalculator } from "@/components/LtvCacCalculator";

export const Route = createFileRoute("/ltv-cac-calculator")({
  head: () => ({
    meta: [
      { title: "LTV:CAC Ratio Calculator | Adverge" },
      {
        name: "description",
        content:
          "See if your LTV:CAC ratio is actually healthy. Enter your CAC, ARPU, gross margin, and churn rate for an instant benchmark.",
      },
      {
        property: "og:title",
        content: "Is Your LTV:CAC Ratio Actually Healthy?",
      },
      {
        property: "og:description",
        content:
          "Benchmarks by growth stage, not just the formula. Enter your numbers to see where you stand.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LtvCacCalculatorRoute,
});

function LtvCacCalculatorRoute() {
  return <LtvCacCalculator />;
}
