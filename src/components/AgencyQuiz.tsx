import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Lock, ShieldAlert } from "lucide-react";


type Answer = { label: string; points: 0 | 1 | 2 };
type Question = {
  id: number;
  theme: string;
  prompt: string;
  answers: [Answer, Answer, Answer];
  healthy: string;
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    theme: "Results",
    prompt:
      "In the last 3 months, has your agency delivered results you can point to: leads, demos, or revenue?",
    answers: [
      { label: "Yes, clearly", points: 0 },
      { label: "Some, but hard to tell what's working", points: 1 },
      { label: "Honestly, no", points: 2 },
    ],
    healthy:
      "A healthy agency ties every month back to concrete business outcomes, not just deliverables.",
  },
  {
    id: 2,
    theme: "Overpromising",
    prompt: "Did what actually happened match what they promised when you signed?",
    answers: [
      { label: "Matched or exceeded it", points: 0 },
      { label: "Fell short but they tried", points: 1 },
      { label: "Nowhere close", points: 2 },
    ],
    healthy:
      "Good partners under-promise and over-deliver. Sales-pitch claims should hold up 90 days in.",
  },
  {
    id: 3,
    theme: "Going quiet",
    prompt:
      "How does their communication now compare to during the pitch/sales process?",
    answers: [
      { label: "Just as proactive", points: 0 },
      { label: "Noticeably quieter", points: 1 },
      { label: "They basically disappeared after signing", points: 2 },
    ],
    healthy:
      "Post-signature communication should intensify, not decay. The best partners lead the cadence.",
  },
  {
    id: 4,
    theme: "Don't know your business",
    prompt:
      "Does your point of contact actually understand your business model and sales cycle, or just the ad platforms?",
    answers: [
      { label: "Genuinely gets it", points: 0 },
      { label: "Knows the basics", points: 1 },
      { label: "Feels like they're guessing", points: 2 },
    ],
    healthy:
      "Platform expertise is table stakes. Understanding your economics, buyer, and sales cycle is where the value is.",
  },
  {
    id: 5,
    theme: "Activity without impact",
    prompt:
      "Do your reports show real business impact (pipeline, revenue), or mostly activity (impressions, posts, 'optimizations')?",
    answers: [
      { label: "Real impact, clearly", points: 0 },
      { label: "A mix", points: 1 },
      { label: "Mostly activity, no impact", points: 2 },
    ],
    healthy:
      "Reporting should start with pipeline and revenue. Activity metrics are supporting evidence, not the headline.",
  },
  {
    id: 6,
    theme: "Upselling",
    prompt: "When results are weak, does the fix usually involve you spending more?",
    answers: [
      { label: "Never happened", points: 0 },
      { label: "Sometimes", points: 1 },
      { label: "Every single time", points: 2 },
    ],
    healthy:
      "The first response to weak results should be strategy and craft, not a bigger budget.",
  },
  {
    id: 7,
    theme: "Blame deflection",
    prompt:
      "When something underperforms, do they own it or point elsewhere (your landing page, your product, 'the market')?",
    answers: [
      { label: "They own it", points: 0 },
      { label: "Bit of both", points: 1 },
      { label: "Always someone else's fault", points: 2 },
    ],
    healthy:
      "A real partner takes ownership first, then investigates. External factors are context, not excuses.",
  },
  {
    id: 8,
    theme: "Time wasting",
    prompt: "Do meetings involve re-explaining goals you already set?",
    answers: [
      { label: "Rarely", points: 0 },
      { label: "Occasionally", points: 1 },
      { label: "Constantly", points: 2 },
    ],
    healthy:
      "Your goals should live in their heads. Meetings should move things forward, not reset context.",
  },
  {
    id: 9,
    theme: "Complexity masking strategy",
    prompt:
      "Can they explain their strategy in plain language, or does it feel deliberately complicated?",
    answers: [
      { label: "Plain and clear", points: 0 },
      { label: "A bit jargon-heavy", points: 1 },
      { label: "Impossible to follow", points: 2 },
    ],
    healthy:
      "If a smart non-marketer can't follow the plan, the plan usually isn't the problem: the strategy is.",
  },
  {
    id: 10,
    theme: "Skin in the game",
    prompt: "Does any part of their fee depend on your actual results?",
    answers: [
      { label: "Yes, meaningfully", points: 0 },
      { label: "A little", points: 1 },
      { label: "No, flat fee no matter what", points: 2 },
    ],
    healthy:
      "Aligned incentives change behavior. Some portion of compensation should track your outcomes.",
  },
];

type Stage = "intro" | "quiz" | "teaser" | "results";

type Tier = {
  key: "solid" | "warning" | "high";
  label: string;
  short: string;
  headline: string;
  body: (weak: string[]) => string;
};

function tierFor(score: number): Tier {
  if (score <= 6) {
    return {
      key: "solid",
      label: "Solid partnership",
      short: "Fundamentals look healthy.",
      headline: "Your agency is doing the fundamentals right.",
      body: () =>
        "Nothing in your answers points to the patterns we usually see before a relationship breaks down. Worth a periodic check-in. The best partnerships get audited on purpose, not by accident.",
    };
  }
  if (score <= 13) {
    return {
      key: "warning",
      label: "Warning signs",
      short: "Patterns worth taking seriously.",
      headline: "You're not imagining it.",
      body: (weak) =>
        `These are the exact patterns that come up right before people leave an agency${
          weak.length ? ` especially around ${joinList(weak)}` : ""
        }. Worth a second opinion before it gets worse.`,
    };
  }
  return {
    key: "high",
    label: "High risk",
    short: "This is the pattern founders describe right before switching.",
    headline: "This is the same pattern we hear from almost every founder who eventually switches agencies.",
    body: (weak) =>
      `You flagged ${
        weak.length ? joinList(weak) : "multiple structural issues"
      }. You're not stuck. There's a better way to do this, and it starts with an honest look at what you're actually paying for.`,
  };
}

function joinList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return `"${items[0]}"`;
  if (items.length === 2) return `"${items[0]}" and "${items[1]}"`;
  return `"${items[0]}", "${items[1]}", and "${items[2]}"`;
}

export function AgencyQuiz() {
  const [stage, setStage] = useState<Stage>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(0 | 1 | 2 | null)[]>(
    () => Array(QUESTIONS.length).fill(null),
  );
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const score = useMemo(
    () => answers.reduce<number>((sum, a) => sum + (a ?? 0), 0),
    [answers],
  );

  const weakThemes = useMemo(
    () =>
      QUESTIONS.filter((q, i) => (answers[i] ?? 0) === 2)
        .map((q) => q.theme.toLowerCase())
        .slice(0, 3),
    [answers],
  );

  const tier = useMemo(() => tierFor(score), [score]);

  useEffect(() => {
    if (stage === "results") {
      const t = setTimeout(() => setRevealed(true), 60);
      return () => clearTimeout(t);
    }
    setRevealed(false);
  }, [stage]);

  const progress =
    stage === "quiz"
      ? (current / QUESTIONS.length) * 100
      : stage === "intro"
        ? 0
        : 100;

  function selectAnswer(points: 0 | 1 | 2) {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = points;
      return next;
    });
    // small delay for perceived feedback
    window.setTimeout(() => {
      if (current < QUESTIONS.length - 1) {
        setCurrent((c) => c + 1);
      } else {
        setStage("teaser");
      }
    }, 180);
  }

  function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!valid) {
      setEmailError("Please enter a valid work email.");
      return;
    }
    setEmailError(null);
    // Placeholder capture — CRM wiring happens after embed.
    // eslint-disable-next-line no-console
    console.log("[AgencyQuiz] lead captured", {
      email: trimmed,
      score,
      tier: tier.key,
      answers: QUESTIONS.map((q, i) => ({
        theme: q.theme,
        points: answers[i],
      })),
    });
    setStage("results");
  }

  function restart() {
    setStage("intro");
    setCurrent(0);
    setAnswers(Array(QUESTIONS.length).fill(null));
    setEmail("");
    setEmailError(null);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-8 sm:px-6 sm:py-12">
        {/* Progress bar */}
        <div className="mb-8 h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <main className="flex-1">
          {stage === "intro" && <Intro onStart={() => setStage("quiz")} />}
          {stage === "quiz" && (
            <QuestionCard
              key={current}
              question={QUESTIONS[current]}
              selected={answers[current]}
              onSelect={selectAnswer}
              onBack={current > 0 ? () => setCurrent((c) => c - 1) : undefined}
            />
          )}
          {stage === "teaser" && (
            <Teaser
              score={score}
              tier={tier}
              email={email}
              setEmail={setEmail}
              emailError={emailError}
              onSubmit={submitEmail}
              onBack={() => {
                setStage("quiz");
                setCurrent(QUESTIONS.length - 1);
              }}
            />
          )}
          {stage === "results" && (
            <Results
              score={score}
              tier={tier}
              answers={answers}
              weakThemes={weakThemes}
              revealed={revealed}
              onRestart={restart}
            />
          )}
        </main>

      </div>
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-brand-navy">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        Honest self-assessment
      </div>
      <h1 className="text-balance text-4xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
        Is Your Agency Failing You?
      </h1>
      <p className="mt-4 max-w-xl text-balance text-base font-light sm:text-lg">
        10 questions. 2 minutes. Find out if it's time for an honest conversation.
      </p>

      <button onClick={onStart} className="btn-brand mt-8 text-sm">
        Start the assessment
        <ArrowRight className="h-4 w-4" />
      </button>

      <ul className="mt-10 grid gap-3 text-sm font-light sm:grid-cols-3">
        {[
          "Built for €1M–€10M businesses",
          "No sales calls to take the quiz",
          "Same patterns we see every week",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function QuestionCard({
  question,
  selected,
  onSelect,
  onBack,
}: {
  question: Question;
  selected: 0 | 1 | 2 | null;
  onSelect: (points: 0 | 1 | 2) => void;
  onBack?: () => void;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-right-2 duration-300">
      <div className="card-brand">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">
          {question.theme}
        </p>
        <h2 className="mt-2 text-balance text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">
          {question.prompt}
        </h2>

        <div className="mt-6 grid gap-3">
          {question.answers.map((a) => {
            const isSelected = selected === a.points;
            return (
              <button
                key={a.label}
                onClick={() => onSelect(a.points)}
                className={
                  "group flex w-full items-center justify-between gap-4 rounded-full border-2 px-5 py-3 text-left text-sm font-light transition sm:text-base " +
                  (isSelected
                    ? "border-primary text-brand-navy"
                    : "border-[#f5f5f5] bg-white text-brand-body hover:border-primary/40")
                }
              >
                <span>{a.label}</span>
                <span
                  className={
                    "grid h-5 w-5 shrink-0 place-items-center rounded-full transition " +
                    (isSelected
                      ? "text-primary"
                      : "text-transparent group-hover:text-primary/40")
                  }
                >
                  <Check className="h-4 w-4" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {onBack && (
        <button
          onClick={onBack}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-light text-brand-navy/70 transition hover:text-brand-navy"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </button>
      )}
    </div>
  );
}

function Teaser({
  score,
  tier,
  email,
  setEmail,
  emailError,
  onSubmit,
  onBack,
}: {
  score: number;
  tier: Tier;
  email: string;
  setEmail: (v: string) => void;
  emailError: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}) {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <p className="text-xs font-bold uppercase tracking-wider text-brand-navy/70">
        Your preliminary score
      </p>
      <div className="mt-3 flex items-end gap-3">
        <span className="text-6xl font-extrabold tracking-tight tabular-nums text-brand-navy sm:text-7xl">
          {score}
        </span>
        <span className="pb-2 text-lg font-light">/ 20</span>
      </div>
      <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm font-semibold text-brand-navy">
        <TierDot tier={tier.key} />
        {tier.label}
      </div>

      <div className="card-brand mt-8">
        <div className="flex items-center gap-2 text-sm font-bold text-brand-navy">
          <Lock className="h-4 w-4 text-primary" />
          Unlock your full breakdown
        </div>
        <p className="mt-2 text-sm font-light">
          See exactly which answers drove your score, and what a healthy agency
          relationship looks like on each one.
        </p>
        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full rounded-full border-2 border-[#f5f5f5] bg-white px-5 py-3 text-sm font-light outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {emailError && (
            <p className="text-xs font-light text-destructive">{emailError}</p>
          )}
          <button type="submit" className="btn-brand w-full text-sm sm:w-auto">
            Unlock my results
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
        <p className="mt-3 text-xs font-light text-brand-navy/60">
          No newsletter spam. Used only to send your breakdown and, if you want, one follow-up.
        </p>
      </div>

      <button
        onClick={onBack}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-light text-brand-navy/70 transition hover:text-brand-navy"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Change my last answer
      </button>
    </div>
  );
}

function Results({
  score,
  tier,
  answers,
  weakThemes,
  revealed,
  onRestart,
}: {
  score: number;
  tier: Tier;
  answers: (0 | 1 | 2 | null)[];
  weakThemes: string[];
  revealed: boolean;
  onRestart: () => void;
}) {
  return (
    <div className="animate-in fade-in duration-500">
      <div
        className={
          "transition-all duration-700 " +
          (revealed ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0")
        }
      >
        <p className="text-xs font-bold uppercase tracking-wider text-brand-navy/70">
          Your result
        </p>
        <div className="mt-3 flex items-end gap-3">
          <span className="text-6xl font-extrabold tracking-tight tabular-nums text-brand-navy sm:text-7xl">
            {score}
          </span>
          <span className="pb-2 text-lg font-light">/ 20</span>
        </div>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm font-semibold text-brand-navy">
          <TierDot tier={tier.key} />
          {tier.label}
        </div>

        <h2 className="mt-6 text-balance text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
          {tier.headline}
        </h2>
        <p className="mt-3 text-balance text-base font-light">
          {tier.body(weakThemes)}
        </p>
      </div>

      <div
        className={
          "mt-10 transition-all delay-150 duration-700 " +
          (revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")
        }
      >
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-navy">
          <ShieldAlert className="h-4 w-4 text-primary" />
          Full breakdown
        </h3>
        <div className="mt-4 rounded-xl bg-brand-mint p-4 sm:p-5">
          <ul className="divide-y divide-[#f5f5f5] overflow-hidden rounded-xl border-2 border-[#f5f5f5] bg-white">
            {QUESTIONS.map((q, i) => {
              const pts = answers[i] ?? 0;
              const chosen = q.answers.find((a) => a.points === pts)!;
              return (
                <li key={q.id} className="grid gap-2 p-5 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        {q.theme}
                      </span>
                      <ScorePill points={pts} />
                    </div>
                    <p className="mt-1 text-sm font-light text-brand-navy">
                      {q.prompt}
                    </p>
                    <p className="mt-2 text-sm font-light">
                      <span className="font-semibold text-brand-navy">Your answer:</span> {chosen.label}
                    </p>
                    <p className="mt-2 text-sm font-light">
                      <span className="font-semibold text-brand-navy">What healthy looks like:</span>{" "}
                      {q.healthy}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div
        className={
          "mt-10 rounded-xl p-6 transition-all delay-300 duration-700 sm:p-8 " +
          "bg-brand-navy text-brand-offwhite " +
          (revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")
        }
      >
        <h3 className="text-balance text-xl font-extrabold tracking-tight text-white sm:text-2xl">
          Want a second pair of eyes on your{" "}
          <span className="text-brand-teal">pipeline?</span>
        </h3>
        <p className="mt-2 text-sm font-light text-brand-offwhite/85">
          A 30-minute scan of what's working, what's not, and where the leaks are.
          No pitch, no commitment.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="#" className="btn-brand text-sm">
            Get your free pipeline scan
            <ArrowRight className="h-4 w-4" />
          </a>
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 rounded-full border-2 border-brand-offwhite/30 bg-transparent px-5 py-2.5 text-sm font-semibold text-brand-offwhite transition hover:bg-brand-offwhite/10"
          >
            Retake the quiz
          </button>
        </div>
      </div>
    </div>
  );
}

function TierDot({ tier }: { tier: Tier["key"] }) {
  const color =
    tier === "solid"
      ? "bg-emerald-500"
      : tier === "warning"
        ? "bg-amber-500"
        : "bg-destructive";
  return <span className={"h-2 w-2 rounded-full " + color} />;
}

function ScorePill({ points }: { points: 0 | 1 | 2 }) {
  const map = {
    0: { label: "Healthy", cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
    1: { label: "Watch", cls: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
    2: { label: "Risk", cls: "bg-destructive/10 text-destructive" },
  } as const;
  const { label, cls } = map[points];
  return (
    <span className={"rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider " + cls}>
      {label}
    </span>
  );
}
