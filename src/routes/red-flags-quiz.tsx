import { createFileRoute } from "@tanstack/react-router";
import { AgencyQuiz } from "@/components/AgencyQuiz";

export const Route = createFileRoute("/red-flags-quiz")({
  head: () => ({
    meta: [
      { title: "Is Your Agency Failing You? | Adverge" },
      {
        name: "description",
        content:
          "A 2-minute diagnostic for founders and marketing directors. 10 honest questions to find out if your marketing agency is actually delivering.",
      },
      { property: "og:title", content: "Is Your Agency Failing You?" },
      {
        property: "og:description",
        content:
          "10 questions. 2 minutes. Find out if it's time for an honest conversation about your agency.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RedFlagsQuiz,
});

function RedFlagsQuiz() {
  return <AgencyQuiz />;
}
