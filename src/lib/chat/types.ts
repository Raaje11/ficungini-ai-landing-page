export type Answer = string | string[] | number;

export type StepType = "select" | "multi_select" | "number" | "text" | "review" | "form";

/** One input in a form step. */
export interface FormField {
  id: string;
  label: string;
  format?: "email" | "phone";
  required?: boolean;
}

export interface Step {
  id: string;
  question: string;
  type: StepType;
  required?: boolean;
  options?: string[];
  min?: number;
  max?: number;
  default?: number;
  unit?: string;
  format?: "email";
  /** Form steps: the details to take in one go. */
  fields?: FormField[];
  /** Number steps only: label for an extra "I'm not sure" answer, stored as "unsure". */
  unsure_label?: string;
}

export interface FlowDef {
  purpose?: string;
  steps: Step[];
  intro_message?: string;
  /** Alternative openings; one is chosen per conversation. */
  intro_variants?: string[];
  submit_action?: string;
  pending_message?: string;
  next_actions?: string[];
}

export interface RouteDef {
  id: string;
  label: string;
  phrases: string[];
}

export interface LegalTopic {
  id: string;
  policy: "privacy" | "terms";
  /** Section of the published document this summarises, or "-" for the chat itself. */
  section: string;
  keywords: string[];
  /** Can answer a question that does not name the policies. */
  standalone: boolean;
  answer: string;
}

export interface KnowledgeTopic {
  id: string;
  /** The page of the website this summarises. */
  source: { label: string; path: string };
  keywords: string[];
  answer: string;
  /** A broad overview: loses to a more specific topic that also matches. */
  generic?: boolean;
}

/** A page, or a section of one, that Fico can take a visitor to. */
export interface SiteDestination {
  id: string;
  /** How Fico names it in a sentence. */
  label: string;
  path: string;
  /** The section on that page, as "#id". */
  hash?: string;
  /** Text to find on that page and point at, for something the site says that has no section of its own. */
  find?: string;
  /** What a visitor might call it. */
  keywords: string[];
}

/** One stop of the guided tour of the company: where to go, and what Fico says there. */
export interface TourStep {
  label: string;
  path: string;
  hash?: string;
  text: string;
}

export interface TourSpec {
  /** Company questions answered before the tour is offered. */
  after_asks: number;
  /** The documented topics that count as asking about the company. */
  topics: string[];
  offers: string[];
  yes: string;
  no: string;
  accepted: string[];
  declined: string[];
  steps: TourStep[];
}

export interface ChatSpec {
  locale: string;
  ui: {
    welcome_message: string;
    /** The assistant's character card: every line is shown on the card, and each move is something it really does. */
    card: {
      name: string;
      subtitle: string;
      bio: string;
      ask_label: string;
      team_label: string;
      sections: { title: string; negative: boolean; items: string[] }[];
    };
    /** What the assistant says it is doing while it works, by situation. */
    thinking: Record<"default" | "unanswered" | "submit", string[]>;
    composer_placeholder: string;
    safety_notice: string;
  };
  engine: {
    tie_breaker: string;
    unknown_intent_response: string;
    /** Said, never improvised, when a question has no documented answer. */
    unanswered_responses: string[];
    /** Offered when someone does not know how to answer a question. */
    unsure_hint: string;
  };
  route_catalog: RouteDef[];
  /** Pages and sections Fico can take a visitor to. */
  site_map: SiteDestination[];
  site_replies: {
    /** "{label}" is replaced with where the visitor is being taken. */
    go: string[];
    /** "{options}" and "{first}" are replaced with the places that fit. */
    choose: string;
  };
  tour: TourSpec;
  flows: {
    start: {
      entry_message: string;
      entry_variants?: string[];
      question: { id: string; type: "select"; options: { label: string; value: string }[] };
    };
  } & Record<string, unknown>;
  knowledge: { topics: KnowledgeTopic[] };
  semantic: {
    /** Different words for one idea, so "cost", "price" and "how much" match each other. */
    concepts: Record<string, string[]>;
    thresholds: {
      /** Below this share of the best possible score, nothing is answered. */
      min_coverage: number;
      /** A winner must lead the runner-up by this share, or the assistant asks which was meant. */
      min_margin: number;
      /** Above this, the match is clear whatever the runner-up. */
      certain: number;
      /** A candidate must match at least this many distinct words or ideas of the question. */
      min_matches: number;
    };
  };
  legal: {
    disclaimer: string;
    general: string;
    sources: Record<"privacy" | "terms", { label: string; path: string }>;
    topics: LegalTopic[];
  };
  submission_and_handoff: {
    submission_states: string[];
    consent_required_before_submission: boolean;
  };
}
