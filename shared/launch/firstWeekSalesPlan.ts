export type FirstWeekSalesDay = {
  day: number;
  title: string;
  goal: string;
  actions: string[];
  proofToSave: string[];
};

export const firstWeekSalesPlan: FirstWeekSalesDay[] = [
  {
    day: 1,
    title: "Prepare the warm list",
    goal: "Create a small, realistic list before sending any sales messages.",
    actions: [
      "Pick 5 individual learners and 5 practice buyers who might honestly benefit.",
      "Label each lead as individual, practice, or Spindel pilot.",
      "Run pnpm launch:first-sales and pnpm launch:sales-tracker.",
      "Send preview or overview links only if paid launch readiness is not complete.",
    ],
    proofToSave: [
      "First 10 tracker filled with non-private lead names or safe placeholders.",
      "Current paid-launch readiness result.",
    ],
  },
  {
    day: 2,
    title: "Start individual learner outreach",
    goal: "Test whether career changers, medical assistants, and new techs understand the offer.",
    actions: [
      "Send the individual learner message to 3 warm leads.",
      "Use the free preview link first when someone needs to see the teaching style.",
      "Ask one simple question: what would make starting in eye care feel less overwhelming?",
    ],
    proofToSave: [
      "Outreach date for each learner.",
      "Non-private themes from replies.",
    ],
  },
  {
    day: 3,
    title: "Start practice buyer outreach",
    goal: "Test whether managers understand the practice-pack value.",
    actions: [
      "Send the practice buyer message to 3 managers, supervisors, owners, or training leads.",
      "Lead with onboarding consistency, shared vocabulary, and supervisor time savings.",
      "Ask what confuses new hires most in the first 30 days.",
    ],
    proofToSave: [
      "Outreach date for each practice.",
      "Questions practice buyers ask before trusting the course.",
    ],
  },
  {
    day: 4,
    title: "Fix the first confusing thing",
    goal: "Improve one buyer-facing page based on real feedback.",
    actions: [
      "Review replies and write down the most common confusion.",
      "Improve the checkout, preview, buyer guide, or practice-pack wording if needed.",
      "Do not change medical claims without clinical review.",
    ],
    proofToSave: [
      "The buyer question that caused the change.",
      "The page or document updated.",
    ],
  },
  {
    day: 5,
    title: "Follow up without pressure",
    goal: "Give interested people a clear next step without pushing too hard.",
    actions: [
      "Follow up with anyone who replied or opened a conversation.",
      "Send the buyer decision guide when someone is unsure which path fits.",
      "Send paid checkout links only after production readiness, smoke test, and internal live purchase are proven.",
    ],
    proofToSave: ["Follow-up date.", "Next step for each interested buyer."],
  },
  {
    day: 6,
    title: "Run the first purchase carefully",
    goal: "Prove one controlled buyer can pay and get access before broad outreach.",
    actions: [
      "Run pnpm launch:live-purchase-test before inviting a real paid buyer.",
      "Use one low-risk internal or friendly buyer first.",
      "Confirm payment, webhook fulfillment, sign-in email, learner access, and support path.",
    ],
    proofToSave: [
      "Purchase tracker row with safe business details only.",
      "Whether access worked without a manual fix.",
    ],
  },
  {
    day: 7,
    title: "Choose next week's focus",
    goal: "Decide whether individuals or practices are the better next sales lane.",
    actions: [
      "Count leads, replies, interested buyers, sales, and support issues.",
      "Pick one focus for next week: individual learners, practice buyers, or Spindel pilot onboarding.",
      "Improve one page, script, or FAQ based on what buyers actually asked.",
    ],
    proofToSave: [
      "Weekly business review CSV updated.",
      "One clear next-week experiment.",
    ],
  },
];

const neverPromiseClaims = [
  "certification",
  "employment",
  "promotion",
  "exam success",
  "income",
  "clinical competency",
  "replacement of hands-on supervision",
];

export function renderFirstWeekSalesPlan(): string {
  return [
    "# OptiTech Academy First Week Sales Plan",
    "",
    "Use this after the app is deployed or nearly deployed and you are ready for controlled first-buyer conversations.",
    "",
    "Simple translation: this is the day-by-day recipe for finding the first real buyers without blasting checkout links too early.",
    "",
    "## Before You Send Paid Checkout Links",
    "",
    "- `/api/launch/readiness` must say paid launch readiness is complete.",
    "- `pnpm launch:smoke` must pass against the production site without `LAUNCH_SMOKE_ALLOW_NOT_READY=true`.",
    "- One internal live purchase must work end to end.",
    "- Stripe live checkout, webhook fulfillment, email sign-in, production database, and clinical review must be proven.",
    "",
    "If any of those are not ready, send the course overview, free preview, buyer guide, or practice inquiry path instead.",
    "",
    "## Seven-Day Plan",
    "",
    ...firstWeekSalesPlan.flatMap(day => [
      `### Day ${day.day}: ${day.title}`,
      "",
      `Goal: ${day.goal}`,
      "",
      "Actions:",
      "",
      ...day.actions.map(action => `- ${action}`),
      "",
      "Proof to save:",
      "",
      ...day.proofToSave.map(item => `- ${item}`),
      "",
    ]),
    "## Safe Claims",
    "",
    "Say: foundational learning, onboarding support, shared language, knowledge checks, supervised practice preparation, and help getting less overwhelmed at the start.",
    "",
    `Do not promise: ${neverPromiseClaims.join(", ")}.`,
    "",
    "Do not save `.env` files, Stripe keys, webhook secrets, email API keys, database passwords, raw sign-in links, session cookies, card numbers, patient information, protected health information, private learner details, or private employer details in outreach notes.",
    "",
    "Related commands:",
    "",
    "```bash",
    "pnpm launch:first-sales",
    "pnpm launch:first-10-customers",
    "pnpm launch:sales-tracker",
    "pnpm launch:live-purchase-test",
    "```",
    "",
  ].join("\n");
}
