/**
 * Rule-based small talk. No model involved: each pattern maps to a fixed reply,
 * so the assistant can hold a basic conversation and then steer back to the task.
 */

interface Rule {
  test: RegExp;
  replies: string[];
  /** A factual question: matched at any point in the chat, and allowed to be longer. */
  faq?: boolean;
}

/**
 * Topics the website does not document. A question that touches one is never
 * answered here, even if it also matches a documented topic, so nothing is implied.
 */
const UNDOCUMENTED =
  /\b(sso|saml|soc ?2|iso ?27001|hipaa|on prem\w*|self host\w*|mobile app|android|ios|iphone|slack|whatsapp|zapier|refund|discount|trial|sla|uptime|win rate|guarantee\w*)\b/;

/** Chit-chat is not something Fico is here for. */
const OFF_TOPIC = [
  "Sorry, I'm constrained to work topics, so I can't chat about that. I can help with Ficungini, tender analysis, pricing, security and booking a demo. What would you like to look at?",
  "Sorry, I can only help with work here: how Ficungini works, pricing, data handling and demos. What can I look into for you?",
  "I'm sorry, I'm limited to Ficungini topics, so I can't chat about other things. Tell me what you'd like to know about the platform and I'll help.",
];

const RULES: Rule[] = [
  {
    faq: true,
    test: /^(how much (does|do|would|will) (it|this|that|ficungini|the platform) cost|how much is it|what (does|do) (it|this|you|ficungini) cost|what (is|s) (the )?(price|cost)( of (it|this))?|what are (your|the) prices|what is your pricing|pricing|prices?|costs?|plans?|pricing plans?|price list|how expensive (is it|are you)|how much)$/,
    replies: [
      "The Individual plan is **₹9,999 a month** plus applicable GST, with the complete platform and monthly usage limits. Business plans for consultancies and multi-seat teams are quoted, and you can book a demo to get one.\n\nMore: [Pricing](/#pricing)",
    ],
  },
  {
    faq: true,
    test: /^((i want to|i d like to|id like to|i would like to|how do i|how can i|can i) )?(buy|purchase|subscribe( to)?|sign up( for)?|get started( with)?)( the| an?)?( individual| business)?( plan| subscription| ficungini)?$/,
    replies: [
      "You can start the Individual plan with **Get Started** in the pricing section. Business plans are quoted, so say \"book a demo\" and I'll take your details.\n\nMore: [Pricing](/#pricing)",
    ],
  },
  {
    test: /^(hi|hii+|hello|hey|hiya|howdy|yo|greetings|good (morning|afternoon|evening))( there| fico| everyone| again)?$/,
    replies: [
      "Hi there! I'm Fico. Ask me about Ficungini, or tell me what you'd like to do and I'll point you in the right direction.",
      "Hello! Good to see you. What can I help you with today?",
    ],
  },
  {
    test: /^(how are you|how are you doing|how do you do|hows it going|how is it going|whats up|sup|how are things)( today| fico)?$/,
    replies: [
      "I'm doing well, thanks. Sorry, I'm constrained to work topics, so I can't chat much beyond that. What would you like to know about Ficungini?",
      "All good, thanks. I'm limited to Ficungini topics, though, so I can't chat about much else. What can I help with?",
    ],
  },
  {
    test: /^(thanks|thank you|thank u|thx|ty|cheers|many thanks|thanks a lot|thank you so much|appreciate it|much appreciated)( fico| a lot| so much)?$/,
    replies: ["You're welcome! Anything else I can help with?", "Happy to help. Let me know if there's more."],
  },
  {
    test: /^(bye|goodbye|good bye|see you|see ya|cya|good night|talk later|take care|thats all|that is all|nothing else|im done|i am done)( fico| for now)?$/,
    replies: ["Goodbye! I'm here whenever you need me.", "Take care! Come back any time."],
  },
  {
    test: /^(who|what) are you( fico)?\??$|^(what is |whats )?your name\??$|^who is fico\??$|^what is fico\??$|^introduce yourself$|^tell me about yourself$/,
    replies: ["I'm Fico, a digital aide for the Ficungini platform. I answer from what is published on this website, and I can pass you to the team."],
  },
  {
    test: /are you (a |an )?(real|human|person|bot|robot|ai|machine|chatbot|live|actual)|am i (talking|speaking|chatting) (to|with) (a |an )?(human|person|bot|robot|ai|machine)|is this (a |an )?(bot|human|robot|ai|real person)/,
    replies: ["I'm Fico, a digital aide for the Ficungini platform, not a person. I answer from what is published on this website, and I can pass you to the team if you'd like to talk to someone."],
  },
  {
    test: /what can you (do|help)|how can you help|what do you do|what are your (features|abilities|skills)|how does this work|how do you work|^help$|^help me$|^menu$|^options$/,
    replies: [
      "I can answer questions about Ficungini (the platform, solutions, pricing, security and data handling, the Privacy Policy and Terms), take you to any page or section of the site and point out what it says, book a demo with the team, or pass a question on to a person.\nShortcuts: **@navigate** to go to a page, **@seek** to look something up, **@contact** to send your message to the team.",
    ],
  },
  {
    test: /what (is|does) ficungini( do)?|about ficungini|tell me about (ficungini|your company|the company)|what do you (sell|offer|make)|who (is|are) ficungini/,
    replies: [
      "Ficungini is a tender intelligence workspace. It helps you decide whether to bid, surface compliance requirements, and organize the evidence needed to build a stronger response.",
    ],
  },
  {
    test: /^(good|great|nice|awesome|cool|amazing|excellent|perfect|brilliant|wonderful|well done|love it|nice one|good job|great job|good bot)( job| work| bot| answer| one)?$/,
    replies: ["Glad that helps! Is there anything else I can look into?"],
  },
  {
    test: /^(sorry|my bad|oops|apologies|excuse me)$/,
    replies: ["No problem at all. Carry on whenever you're ready."],
  },
  {
    test: /^(ok|okay|k|alright|sure|got it|fine|i see|understood|right|yep|yeah|yes|hmm+|hm+)$/,
    replies: ["Great. Pick an option below or tell me more in your own words."],
  },
  {
    test: /^(what|huh|why|i dont (understand|get it)|confused|im confused|not sure|i dont know|idk|dunno|no idea)$/,
    replies: [
      "No worries. Ask me anything about Ficungini in plain words, like “is my tender data secure?”, or pick an option below.",
    ],
  },
  {
    test: /\b(jokes?|funny|laugh|poem|story|sing|song|music|dance|movies?|weather|news|football|cricket|politics|election|religion|god|recipes?|stock price|bitcoin|crypto|homework|math|translate)\b|how old are you|where are you from|where do you live|do you (sleep|eat|have feelings|like)|are you (alive|sentient|single|married)|girlfriend|boyfriend|dating|love you|marry me|favou?rite|meaning of life|i am bored|im bored|let s chat|lets chat|just (want to )?(chat|talk)|chat with me|talk to me about|what (is|s) the capital|who won|write (me )?(a |an )?(code|essay|poem|song)/,
    replies: OFF_TOPIC,
  },
  {
    test: /^(you are|youre) (useless|stupid|dumb|bad|terrible|wrong)|this is (useless|stupid|terrible)|not helpful/,
    replies: [
      "Sorry about that. I can bring in a person from the Ficungini team if you'd rather talk to them. Just say “talk to a person”.",
    ],
  },
];

function clean(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** A fixed reply for casual conversation, or null if the text isn't small talk. `seed` rotates variants. */
export function smallTalk(text: string, seed = 0): string | null {
  const t = clean(text);
  if (!t || t.length > 140) return null;
  const undocumented = UNDOCUMENTED.test(t);
  for (const rule of RULES) {
    if (rule.faq && undocumented) continue;
    if (!rule.faq && t.length > 80) continue;
    if (rule.test.test(t)) return rule.replies[seed % rule.replies.length];
  }
  return null;
}

/** True for something phrased as a question ("how long does it take", "does it support X?"). */
export function isQuestion(text: string): boolean {
  const t = text.trim();
  if (t.length < 4) return false;
  if (/\?\s*$/.test(t)) return true;
  return /^(what|whats|what's|how|why|when|where|which|who|can|could|do|does|did|is|are|will|would|should|have|has|am)\b/i.test(t);
}

/** The reply for chit-chat, varied by turn. */
export function offTopicReply(seed = 0): string {
  return OFF_TOPIC[seed % OFF_TOPIC.length];
}

const WORK_WORDS =
  /\b(ficungini|fico|tender\w*|rfp\w*|rfq\w*|bid\w*|eoi|procure\w*|epc|oem|consultan\w*|compliance|complian\w*|eligib\w*|qualif\w*|clause\w*|corrigend\w*|amendment\w*|annexure\w*|go|no go|conditional|discover\w*|opportunit\w*|lead\w*|market|pricing|price\w*|cost\w*|plan\w*|subscri\w*|gst|quote\w*|demo\w*|book\w*|workspace\w*|platform|studio|archive|repository|integrat\w*|erp|api|secur\w*|privacy|data|encrypt\w*|delet\w*|retention|totp|authenticat\w*|terms|policy|policies|legal|team|person|human|agent|support|sales|contact|email|call|solution\w*|feature\w*|help|need|problem\w*|issue\w*|evidence|traceab\w*|analy\w*|report\w*|document\w*|blog\w*|docs|case stud\w*|benchmark\w*|whitepaper|company|founder|uptime|downtime|sla|login|log in|account|password|about|your (product|software|company|service)s?|do you|does it|can it|can i|will it|is it|are you|do they|does the|is there)\b/;

/** True for a real sentence that has nothing to do with the work Fico does. */
export function isOffTopic(text: string): boolean {
  const t = clean(text);
  const words = t.split(" ").filter((w) => /^[a-z']+$/.test(w));
  if (words.length < 2) return false;
  return !WORK_WORDS.test(t);
}

/* ---------------------------------------------------------- boundaries ---- */

/**
 * Flirting, personal questions and sexual remarks. Fico stays polite and
 * professional, does not play along, and goes firmer if it continues. It does
 * not pretend to be a person: "are you real" is answered honestly elsewhere.
 */
const SEXUAL =
  /\b(sex|sexy|sexual|nude|nudes|naked|horny|kiss me|hook ?up|one night|sleep with|bed with|make love|boobs|breasts|hot body|strip|dirty talk|sext)\b/;

const FLIRT =
  /\b(are you single|date me|go on a date|go out with me|marry me|be my (girlfriend|wife|gf|partner|valentine)|i love you|love you|i like you|i miss you|you (are|re|look) (so |very |really )?(beautiful|pretty|gorgeous|hot|cute|sexy|lovely|stunning|attractive)|how (pretty|beautiful|hot) you|hey (beautiful|gorgeous|cutie|sweetheart|baby|darling|honey|babe)|sweetheart|darling|baby girl|babe|cutie|come to dinner|have dinner with me|have coffee with me|coffee with me|what are you wearing|send (me )?(a )?(pic|photo|picture|selfie)|show me your (face|photo|pic)|your (whatsapp|instagram|insta|snapchat|facebook)|are you (a )?(girl|woman|lady|female|male|boy|man)|do you have a (boyfriend|husband|partner)|are you married)\b/;

const WARNINGS_FIRST = [
  "Thank you, but I keep things professional here. I'm here for Ficungini questions, so tell me what you'd like to know and I'll help.",
  "That's kind of you, but I'll keep this to work. What would you like to know about Ficungini?",
  "I appreciate it, but I only handle Ficungini questions. What would you like to look at?",
];
const WARNINGS_SECOND = [
  "I'm here only for work questions about Ficungini. If there's something about the platform I can help with, please tell me. Otherwise I'd rather not continue this.",
  "I'll have to keep this strictly professional. I can help with the platform, pricing, security and demos, or you can ask to talk to a person on the team.",
];
const WARNINGS_FINAL = [
  "I can't continue with messages like this. If you need help with Ficungini, say \"talk to a person\" and the team will get back to you, or ask me about the platform and I'll carry on from there.",
];

/** A professional reply to flirting or an inappropriate remark, firmer each time it repeats. Null for anything else. */
export function boundaryReply(text: string, previous = 0): string | null {
  const t = clean(text);
  if (!t || t.length > 160) return null;
  const sexual = SEXUAL.test(t);
  if (!sexual && !FLIRT.test(t)) return null;
  // First time: polite. Second: firmer. From the third: a clear stop. Sexual remarks start at firm.
  const level = sexual ? Math.max(previous, 1) : previous;
  const pool = level >= 2 ? WARNINGS_FINAL : level === 1 ? WARNINGS_SECOND : WARNINGS_FIRST;
  return pool[previous % pool.length];
}
