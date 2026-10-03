export type BlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BlogSource = {
  label: string;
  href: string;
  note: string;
};

export type BlogPost = {
  slug: string;
  number: string;
  concept: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  sections: BlogSection[];
  closing: string;
  sources: BlogSource[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "tender-summary-is-not-tender-intelligence",
    number: "01",
    concept: "Tender Intelligence",
    title: "A Tender Summary Is Not Tender Intelligence",
    excerpt:
      "A 500-page tender can now be reduced to a few screens in seconds. That is useful. It is also not tender intelligence.",
    publishedAt: "01 October 2026",
    readTime: "14 min read",
    sections: [
      {
        heading: "The distinction",
        paragraphs: [
          "A 500-page tender can now be reduced to a few screens in seconds.",
          "That is useful.",
          "It is also not tender intelligence.",
          "Modern tender-AI products increasingly advertise eligibility checks, document analysis, fit scores, risk scores, bid recommendations and winning probabilities. Public product pages currently include claims such as 3.2× higher win rate, 68% benchmark win rate, and displayed tender-level win probabilities such as 62%. These are commercial claims made by the respective products; they are not equivalent to independently established procurement outcomes. (TenderKosh)",
          "The distinction matters because a tender is not merely a document.",
          "A tender establishes requirements, conditions, evidence, evaluation criteria, timelines and contractual obligations. The bidder’s decision depends on the relationship between those provisions and the bidder’s actual capability, documentary evidence, commercial position and the conditions of the procurement.",
          "A summary compresses information.",
          "Tender intelligence has to support a decision without losing the conditions under which that decision is valid.",
        ],
      },
      {
        heading: "500 Pages",
        paragraphs: [
          "Long tender documents create a genuine technical problem.",
          "Meaning is distributed across the document. An eligibility requirement may appear in one section, its documentary requirement elsewhere, an exception in another clause, and a later corrigendum may alter the operative condition.",
          "Recent ACL research specifically examining long-document summarisation found that factual consistency remains difficult to evaluate. A 2025 study across four long-document datasets found that evaluation performance depends on dataset characteristics and that even advanced systems can struggle with false positives and fine-grained factual errors. (ACL Anthology)",
          "The problem has become more explicit in 2026 research. A study covering legal, scientific and science-fiction documents found that existing factuality metrics produced inconsistent scores for semantically equivalent summaries and became less reliable for information-dense claims. No tested metric consistently maintained factual alignment under long-context conditions. (ACL Anthology)",
          "A tender contains exactly the kind of information that makes this difficult: conditions, exceptions, cross-references, tables, dates, qualifications, thresholds and amendments.",
          "A shorter answer is therefore not automatically a safer answer.",
        ],
      },
      {
        heading: "Evidence",
        paragraphs: [
          "Indian procurement rules make the distinction between information and qualification explicit.",
          "The Department of Expenditure’s 2025 Manual for Procurement of Works states that the Procuring Entity determines whether bidders satisfy the eligibility criteria prescribed in the Tender Document. Tenders that do not meet the prescribed eligibility criteria are rejected as unresponsive. It further states that only substantively responsive bids are evaluated and that qualification, technical and commercial conformity is determined against the conditions in the bid document using the data and details submitted by the bidder. (Department of Expenditure)",
          "That creates a fundamental difference between two statements:",
          "“The tender requires three similar works.”",
          "and",
          "“The bidder satisfies the similar-work requirement.”",
          "The first is extraction.",
          "The second is an assessment about a particular bidder.",
          "The second requires evidence.",
          "A useful tender system therefore cannot stop at identifying a clause. The relevant record is the clause, its condition, the bidder’s corresponding evidence, the applicable tender version and the resulting procurement consequence.",
          "A statement without its supporting evidence is not a compliance determination.",
        ],
      },
      {
        heading: "Corrigendum",
        paragraphs: [
          "A tender is also not necessarily static.",
          "The Government of India’s procurement system publishes tender enquiries, corrigenda and contract-award information. The Department of Expenditure’s procurement framework itself continues to receive amendments and advisories; in 2026, the Department published an amendment to the 2025 Works Manual and new guidance concerning qualification and evaluation criteria for consultancy procurement. (Department of Expenditure)",
          "This matters directly to tender-AI systems.",
          "A perfectly extracted requirement from an obsolete tender version can produce a perfectly wrong conclusion.",
          "The issue is not grammatical accuracy.",
          "It is temporal accuracy.",
          "The applicable requirement is the requirement operative at the relevant point in the procurement process.",
          "A system that reports a clause without establishing its current status can produce precise information with the wrong legal or commercial consequence.",
        ],
      },
      {
        heading: "Confidently Wrong",
        paragraphs: [
          "The most dangerous tender-AI error is not an obviously absurd answer.",
          "It is a plausible answer that crosses the boundary between evidence and inference.",
          "Consider a similar-work requirement.",
          "The tender may require a bidder to have completed a specified number of contracts of a particular nature, value and period.",
          "A company's records may contain projects with similar words.",
          "That does not establish qualification.",
          "The projects may differ in scope.",
          "The completion period may fall outside the prescribed period.",
          "The contract value may not meet the threshold.",
          "The required completion certificate may be absent.",
          "The Procuring Entity may define the qualifying work more narrowly than the ordinary meaning of the project description.",
          "The extracted text can be correct at every stage while the final conclusion is wrong.",
          "NIST's AI Risk Management Framework treats this distinction as a basic requirement of reliable AI. It calls for objective evidence supporting validation, representative testing conditions, documented limitations and demonstrated validity and reliability. NIST also explicitly distinguishes performance on a fixed benchmark from performance generalised to a wider population of cases. (NIST AI Resource Center)",
          "This is why confidence is not evidence.",
          "A fluent sentence does not establish qualification.",
          "A numerical score does not establish qualification.",
          "An AI-generated eligible label does not establish qualification.",
          "The bidder remains responsible for the procurement decision.",
        ],
      },
      {
        heading: "Precise Nonsense",
        paragraphs: [
          "The same problem becomes more serious when tender-AI products move from document analysis to prediction.",
          "A public tender-AI product currently displays a 62% win probability alongside different recommended bid prices. Another publicly presents a 68% benchmark win rate and describes its platform as measuring tender outcomes. A separate tender platform advertises 3.2x higher win rate as a product outcome. (GemEdge)",
          "The numbers themselves are not evidence of error.",
          "The evidentiary problem is the meaning attached to the numbers.",
          "A probability is not merely a percentage placed beside a tender.",
          "A probability requires a defined population, outcome, observation period, prediction procedure and calibration. A 62% model score is not automatically a 62% probability of winning.",
          "NIST's 2026 work on AI evaluation makes the same statistical distinction at the benchmark level: measured performance on a fixed benchmark and performance expected across a broader population are different quantities, and uncertainty must be accounted for when extending evaluation results beyond the observed data. (NIST)",
          "The distinction becomes critical in procurement.",
          "The historical success of a set of bids does not determine the result of the next bid.",
          "The bidder's technical capability may match the requirement.",
          "The bidder may possess the required similar work.",
          "The financial capacity may be sufficient.",
          "The geographical requirement may be satisfied.",
          "The documentary evidence may be complete.",
          "The quoted price may be competitive.",
          "The tender can still have an uncertain outcome.",
          "The competitive field is not completely observable. Competitor pricing is not known at the time of bidding. Competitor eligibility, bid strategy, deviations, evaluation circumstances and subsequent procurement events are not all controlled by the bidder or the prediction system.",
          "The AI output can therefore be correct as a statistical estimate and still be wrong for the individual bidder.",
          "That is not a contradiction.",
          "It is the difference between a population-level estimate and an individual procurement outcome.",
        ],
      },
      {
        heading: "Statistical Theatre",
        paragraphs: [
          "A win-rate percentage becomes meaningful only when its underlying measurement is defined.",
          "A 68% win rate does not, by itself, establish:",
        ],
        bullets: [
          "the number of bids in the denominator;",
          "the period over which the rate was measured;",
          "the definition of a win;",
          "whether withdrawn, cancelled or disqualified tenders were included;",
          "whether the calculation covers all bids or selected bids;",
          "whether customers using the system are compared with comparable customers who did not;",
          "whether the result is historical or predicted;",
          "whether the percentage is calibrated;",
          "or whether the product caused the observed improvement.",
        ],
      },
      {
        heading: "Selection changes the number",
        paragraphs: [
          "These are not semantic details.",
          "They determine what the number means.",
          "A product can legitimately report the historical win rate of a particular population while the same number remains unsuitable as a prediction for an individual bidder.",
          "Selection also matters.",
          "If a system is used primarily on tenders that users have already selected as attractive, its observed win rate does not automatically represent the win rate of all tenders encountered by the bidder.",
          "If unsuccessful bids are abandoned before submission, the resulting dataset changes again.",
          "If customers select only tenders recommended by the system, the observed performance is no longer a simple comparison between AI-assisted and non-AI-assisted bidding.",
          "A percentage without its population is incomplete evidence.",
        ],
      },
      {
        heading: "Your 70%",
        paragraphs: [
          "Suppose a tender system produces a 70% probability.",
          "The bidder has the required technical capability.",
          "The qualifying projects are present.",
          "The financial capacity is sufficient.",
          "The geographical conditions are satisfied.",
          "The documentary evidence is complete.",
          "The price position is competitive.",
          "The 70% does not become 100%.",
          "The remaining uncertainty is not necessarily a defect in the model.",
          "It represents information that is not fully available at prediction time.",
          "The number of serious competitors is not completely known.",
          "Their prices are not known.",
          "Their compliance positions are not fully known.",
          "Their technical responses are not known.",
          "The Procuring Entity's evaluation process has not yet reached its conclusion.",
          "Clarifications, amendments, withdrawals, disqualifications, procurement decisions and other events can alter the path between submission and award.",
          "Tender outcome is therefore an event with external variables.",
          "An AI system can estimate it.",
          "It cannot convert an uncertain external event into a certain event merely by assigning a more precise number.",
          "That is why a responsible prediction must preserve uncertainty rather than hide it behind numerical precision.",
        ],
      },
      {
        heading: "Expensive Guess",
        paragraphs: [
          "The economic value of tender AI is also separate from the sophistication of the underlying model.",
          "A bidder does not purchase a model.",
          "The bidder purchases a decision aid.",
          "Its value comes from measurable procurement consequences: identifying an unsuitable tender before substantial bid preparation, locating a material eligibility problem, reducing review time, identifying missing documentary evidence, detecting an operative amendment, or improving the quality of a bid decision.",
          "A fast summary has value when it reduces manual reading.",
          "An eligibility assessment has value when its evidence is correct.",
          "A risk indicator has value when it identifies a material procurement risk.",
          "A win probability has value only to the extent that its statistical meaning is established and its limitations are understood.",
          "The price of the software does not establish any of these outcomes.",
          "The number of tokens used to generate an answer does not establish them either.",
          "The relevant measurement is decision value.",
        ],
      },
      {
        heading: "The Difference",
        paragraphs: [
          "A tender summary answers: What does this document say?",
          "Tender intelligence must go further: What does it mean for this bidder, based on the applicable tender provisions and the bidder's evidence?",
          "The distinction can be stated plainly.",
          "Extraction identifies information.",
          "Assessment applies requirements to evidence.",
          "Prediction estimates an uncertain future event.",
          "Probability quantifies uncertainty under defined assumptions.",
          "Correlation identifies association.",
          "Causation establishes an effect.",
          "These are different analytical tasks.",
          "Treating them as interchangeable is how a document summary becomes a compliance conclusion, a compliance conclusion becomes a score, and a score becomes a supposed probability of winning.",
          "The underlying tender has not changed.",
          "The bidder's evidence has not changed.",
          "The competitive field has not become observable.",
          "Only the number on the screen has changed.",
          "NIST's position is straightforward: AI systems need to be demonstrated as valid and reliable for their intended use, their limitations must be documented, and their performance must be evaluated under conditions representative of deployment. (NIST AI Resource Center)",
          "ACL research reaches the corresponding technical conclusion from long-document evaluation: factual consistency becomes harder to establish as documents become longer and more information becomes distributed and dense. (ACL Anthology)",
          "Indian procurement rules provide the operational consequence: eligibility and qualification are determined against the tender conditions and the bidder's submitted evidence. (Department of Expenditure)",
          "That leaves a simple distinction.",
          "A tender summary makes a large document smaller.",
          "Tender intelligence makes the procurement decision clearer, evidence-backed and accountable to the bidder.",
        ],
      },
    ],
    closing:
      "A tender summary makes a large document smaller. Tender intelligence makes the procurement decision clearer, evidence-backed and accountable to the bidder.",
    sources: [
      {
        label: "TenderKosh",
        href: "https://tenderkosh.com/",
        note: "Public tender-intelligence product claims referenced in the article.",
      },
      {
        label: "GemEdge",
        href: "https://gemedge.dev/",
        note: "Public tender-AI win-probability and bid-recommendation claims referenced in the article.",
      },
      {
        label: "ACL Anthology",
        href: "https://aclanthology.org/",
        note: "Research on factual consistency and long-document summarisation.",
      },
      {
        label: "Department of Expenditure",
        href: "https://doe.gov.in/",
        note: "Government of India procurement manuals, amendments, and advisories.",
      },
      {
        label: "NIST AI Resource Center",
        href: "https://airc.nist.gov/",
        note: "AI risk management and evaluation guidance on validity, reliability, and generalisation.",
      },
    ],
  },
  {
    slug: "verified-requirements-confident-bids",
    number: "02",
    concept: "Tender Discovery",
    title: "Needle in a Haystack",
    excerpt:
      "The best tender discovery system does more than find related keywords. It surfaces the opportunities that matter to a particular bidder while they are still actionable.",
    publishedAt: "01 October 2026",
    readTime: "15 min read",
    sections: [
      {
        heading: "The haystack",
        paragraphs: [
          "A tender discovery system begins with a simple problem. There are too many tenders, distributed across too many Government procurement sources, published in too many forms, for a bidder to inspect them manually.",
          "That is the haystack. The needle is the tender opportunity that belongs in front of a particular bidder.",
          "A tender can be relevant to a company’s industry and still be a poor discovery result for that bidder. It can contain the right product, geography and contract category while remaining outside the bidder’s practical opportunity set.",
          "Tender discovery therefore has two separate problems: finding tenders and identifying which deserve the bidder’s attention.",
        ],
      },
      {
        heading: "The Tender Corpus",
        paragraphs: [
          "A discovery system cannot retrieve what is not present in its tender corpus. Indian public procurement is distributed across central and state departments, PSUs, authorities and sector-specific procurement sources, so source coverage and freshness come first.",
          "But portal count is not procurement coverage. A Notice Inviting Tender may be indexed while its BOQ, technical specification, Eligibility Criteria, annexure or Corrigendum is absent or delayed. Tender coverage is not Tender Document completeness.",
          "Research into procurement search found that terminology varies between buyers and suppliers and that procurement-product entities plus semantic search improved search precision by approximately 25% in tested datasets. (ScienceDirect)",
        ],
        bullets: [
          "Source clause identified before requirement interpretation",
          "Evidence checked against the bidder profile and tender pack",
          "Open questions routed into clarification or review",
          "Drafting starts with confirmed inputs and visible reasoning",
        ],
      },
      {
        heading: "The Requirement and the Bidder",
        paragraphs: [
          "A Tender Document is not a single piece of text. Requirements are distributed across the NIT, ITB or AITB, Eligibility Criteria, Qualification Criteria, scope, technical specifications, BOQ, schedules, annexures and subsequent Corrigenda, Addenda, Clarifications or Amendments.",
          "The relevant unit is often the requirement-bearing extract: product, Similar Work, project location, contract value, Financial Capacity, certification or registration. Another requirement may exist only inside the BOQ or be introduced through a Corrigendum. Semantic retrieval is useful, but retrieving the requirement is only the beginning. (ResearchGate)",
          "Every bidder has a different procurement profile: products and services, Technical Qualification, Similar Work, Financial Capacity, geography, certifications, project scale, historical participation and Documentary Evidence. Two bidders can therefore receive different discovery value from the same tender.",
          "Bid India publicly describes profile-based opportunity evaluation and a 0–100 compatibility score covering sector fit, capacity, track record and EMD headroom. (Bid India)",
        ],
      },
      {
        heading: "The Match, Ranking and Score",
        paragraphs: [
          "A useful match requires the tender to be found, its documents captured, its requirement-bearing extracts retrieved, equivalent terminology connected, and the tender evaluated against the bidder profile. A useful abstraction is: source coverage × Tender Document completeness × requirement retrieval × bidder profile × ranking × time.",
          "Ranking matters because a bidder does not have unlimited attention. Returning 2,000 potentially relevant tenders transfers the ranking problem to the bidder. A compatibility score is a ranking signal, not automatically discovery Accuracy, suitability, Win Probability or recall.",
          "Precision measures how much of the retrieved set is relevant. Recall measures how much of the relevant set was retrieved. NIST’s TREC programme evaluates retrieval against judged relevant documents rather than simply counting returned documents. (TREC)",
          "A False Positive is visible; a False Negative never reaches the bidder. Opportunity recall asks: of the genuinely relevant opportunities, how many were surfaced? Without a reference set, discovery-completeness claims remain difficult to establish.",
          "Profiles can become stale, historical behaviour can narrow future discovery, and terminology can differ between an engineering requirement, commercial product name, abbreviation and BOQ. Semantic matching is necessary but must still be meaningful for this bidder and supported by Documentary Evidence.",
          "Thresholds create the precision–recall trade-off. Corrigendum linkage is part of maintaining the Operative Tender, and freshness is the latency from publication → observation → indexing → bidder notification.",
          "The measurable objective is opportunity recall at useful precision: how much of the bidder’s genuine opportunity set reached its attention while it was still actionable.",
        ],
      },
    ],
    closing:
      "Not the tender. Not the keyword. Not the score. The opportunity.",
    sources: [
      {
        label: "ScienceDirect",
        href: "https://www.sciencedirect.com/",
        note: "Research on procurement-specific entity extraction and semantic tender search.",
      },
      {
        label: "ResearchGate",
        href: "https://www.researchgate.net/",
        note: "Research on AI-based public-procurement decision support.",
      },
      {
        label: "Bid India Discover",
        href: "https://www.bidindia.co.in/products/discover",
        note: "Public descriptions of compatibility scoring, ranking, monitoring and Corrigendum alerts.",
      },
      {
        label: "TREC",
        href: "https://trec.nist.gov/",
        note: "Retrieval evaluation methodology using judged relevant documents, precision and recall.",
      },
    ],
  },
  {
    slug: "catch-the-blocker-before-the-calendar",
    number: "03",
    concept: "Tender Market Intelligence",
    title: "Fragmented Worldview",
    excerpt:
      "Tender platforms now expose competitor histories, win rates, pricing patterns, Procuring Entity behaviour, market share, sector trends, geography, BOQ prices and predictions. The problem is no longer the absence of procurement data. It is what that data can legitimately establish.",
    publishedAt: "01 October 2026",
    readTime: "18 min read",
    sections: [
      {
        heading: "The Number and the Population",
        paragraphs: [
          "A competitor’s 65 wins in 100 comparable Tenders is a legitimate statistic when its population, participation records and Awards are correctly defined. It is not yet much intelligence. Performance may differ by Procuring Entity, value, geography, category, evaluation method, competition level and price position.",
          "Bid India exposes distinctions such as Won, L1-but-not-awarded and Rejected Technical. TenderGuruji exposes L1, L2 and later ranks with bid prices and Award information where available. These are more useful than a single win-rate number. (Bid India)",
          "A procurement database observes published events and recorded participation, not necessarily every firm that could have competed. Research using more than 17,000 Finnish invitations linked actual bidders with firm-registration data to study potential bidders, entry and contract design. (ScienceDirect)",
          "The observed competitor set is a record of participation, not a complete representation of competitive capability. Historical participation establishes observed competition; it does not automatically establish the current competitive universe.",
        ],
      },
      {
        heading: "Identity, Denominator and Comparison",
        paragraphs: [
          "Market Intelligence depends on identity resolution. A Bidder may appear under different legal names, abbreviations, subsidiaries, branches or consortium arrangements. Incorrect linkage changes win rate, market share, Tender count, pricing history, buyer concentration and apparent market position.",
          "Large procurement datasets require reconstruction before they become analytical datasets. The Global Public Procurement Dataset harmonised more than 72 million contracts from 42 countries, including failed and cancelled events and records where Tender and Award information cannot always be linked cleanly. (ScienceDirect)",
          "Every percentage also needs a denominator: Tender count, Award value, L1 Awards, category, geography, Procuring Entity, financial year or rolling period. A company can hold 28% of Tender count and 11% of Award value; both can be correct. TenderGuruji publicly presents market share through L1 bids won and amount won. (TenderGuruji)",
          "A Tender with the same product name is not necessarily comparable. Value, quantity, specifications, BOQ, delivery, geography, duration, qualification, evaluation method and competition can all differ. Similarity is not comparability.",
        ],
        bullets: [
          "Experience certificates tested against the precise similar-work definition",
          "Turnover checked against the tender's required financial years",
          "Completion certificates reviewed for the issuing authority the clause names",
          "EMD form, amount, and validity checked as separate requirements",
          "JV structure and conflict conditions mapped to the bidder's position",
          "Corrigenda connected to the working tender package and review history",
        ],
      },
      {
        heading: "The Price, Missing Bid and Pattern",
        paragraphs: [
          "An awarded price is an observation, not a complete explanation of price formation. It does not reveal bidder count, losing bids, quantity, specification, capacity, changed requirements or unusual commercial conditions. Research on procurement cartels achieved strong results on unseen data but identified missing variables, including losing-bid prices, as limitations. (ScienceDirect)",
          "A Bidder’s absence may mean it declined, registered but did not submit, failed an internal screen, lacked capacity, disliked the geography or chose another opportunity. Most Tender databases cannot observe this non-participation. A market built only from submitted bids can overstate visible competitors and understate latent competition.",
          "Historical data can reveal price patterns, Buyer behaviour, Seller behaviour, concentration, Tender cycles and recurring competitor relationships. But association is not causation. A competitor’s presence may correlate with a loss without causing it; a buyer’s lower Awards may have several explanations.",
          "Historical relevance is temporal. Capacity, strategy, geography, prices, specifications, competitors and procurement practice change. More history is not automatically more current intelligence.",
        ],
      },
      {
        heading: "The Prediction and the Current Tender",
        paragraphs: [
          "The methodological jump occurs when a platform predicts the future. ‘Company A won 65 of 100 observed Tenders’ is historical measurement. ‘Company A has a 65% probability of winning this Tender’ is prediction and requires a defined target, population, horizon and out-of-sample test.",
          "TenderGuruji displays AI-predicted competitors; Bid India advertises 72% next-move prediction accuracy; TenderDekho describes probable bidders from historical patterns. Public claims without the target, baseline, test population and out-of-sample procedure are not independently reproducible evidence. (TenderGuruji, Bid India)",
          "Historical competition and current competition overlap but are not interchangeable. A recent entrant may have little history but substantial current capability. The current Tender Document remains authoritative: historical market strength cannot replace Eligibility Criteria, Qualification Criteria or Documentary Evidence.",
          "Market Intelligence describes the external environment. Qualification establishes whether a Bidder can enter it. Evaluation Intelligence depends on L1, QCBS or the Tender’s actual methodology. Current contractual risk—payment terms, completion periods, damages, warranties, scope and BOQ anomalies—belongs to the current Tender, not the historical dashboard.",
          "Decision-grade intelligence should preserve an evidence chain: source, population, identity, comparability, outcome, condition, current relevance, uncertainty and validation. The correct response to imperfect data is not to abandon intelligence, but to expose the limits of the inference.",
        ],
      },
    ],
    closing:
      "The observable market is not necessarily the whole market. Intelligence is only as strong as the evidence connecting what it observed yesterday to the decision being made today.",
    sources: [
      {
        label: "Bid India Competitor Analytics",
        href: "https://www.bidindia.co.in/products/competitor-analytics",
        note: "Public descriptions of competitor history, win-loss analysis, pricing and prediction capabilities.",
      },
      {
        label: "TenderGuruji",
        href: "https://tenderguruji.com/",
        note: "Public descriptions of market share, historical pricing, competitor analytics and predicted competitors.",
      },
      {
        label: "TenderDekho",
        href: "https://tenderdekho.com/",
        note: "Public descriptions of probable bidders and historical procurement patterns.",
      },
      {
        label: "ScienceDirect",
        href: "https://www.sciencedirect.com/",
        note: "Research on potential bidders, procurement competition, harmonised datasets and prediction limits.",
      },
    ],
  },
  {
    slug: "measure-the-work-your-team-controls",
    number: "04",
    concept: "Metrics That Belong to Your Process",
    title: "Measure the Work Your Team Can Improve",
    excerpt:
      "Win-rate language describes the final scoreboard. Process metrics show the moves your team can practice, improve, and repeat before the verdict arrives.",
    publishedAt: "01 October 2026",
    readTime: "7 min read",
    sections: [
      {
        heading: "The market already counts attention and outcomes",
        paragraphs: [
          "Bid India uses compatibility scoring to help teams prioritize opportunities. TenderKosh presents competitor intelligence and market momentum alongside fit, risk, and document signals. TenderGenie includes competitor intelligence and historical enterprise memory. ContraVault speaks to speed, risk reduction, ROI, and win-rate improvement across its tender workflow.",
          "Those signals answer useful commercial questions. Ficungini adds a different measurement frame: how faithfully the team followed the evidence, how well it resolved complications, and how clearly each decision connects to the tender. The final award remains an external verdict, as indifferent as any old stone cemetery.",
        ],
      },
      {
        heading: "Compliance Fidelity",
        paragraphs: [
          "Compliance Fidelity measures the quality of the connection between a tender requirement, the team's interpretation, and the evidence used in the response. It turns a broad idea like compliance into a reviewable process rather than a ceremonial word placed on a slide.",
          "Teams can improve this measure by strengthening source mapping, checking document versions, separating requirements into precise tests, and giving reviewers a clear route through the evidence. Precision is not glamorous. Neither is poison control, yet both prevent avoidable endings.",
        ],
      },
      {
        heading: "Complication Resolution",
        paragraphs: [
          "Complication Resolution measures how effectively the team turns a difficult clause into a workable decision. The measure rewards a clear source, a defined impact, a practical path, and an owner for the next step.",
          "It gives bid leaders a useful view of analytical quality before the final award enters the picture. Teams can examine which complications recur, where evidence arrives late, and which review habits produce cleaner decisions. A recurring problem is not mysterious; it is simply an uninvited guest no one has bothered to remove.",
        ],
      },
      {
        heading: "Evidence-based decision integrity",
        paragraphs: [
          "Decision integrity measures whether the recommendation still makes sense when a reviewer retraces the evidence. It connects Go/No-Go judgment with the record that supports it and keeps human review central to the workflow.",
          "That metric belongs to the team. The evaluation committee owns the award outcome. The bid team owns the quality of its source work, its reasoning, and its response process. The distinction is grim, useful, and entirely survivable.",
        ],
        bullets: [
          "Measure the source coverage behind key decisions",
          "Track how quickly the team resolves recurring complications",
          "Review evidence quality before drafting reaches final review",
          "Improve the process with patterns the team can control",
        ],
      },
    ],
    closing:
      "A strong process produces better decisions before it produces a scoreboard. Ficungini helps teams measure the work they can improve and build a sharper bid practice over time.",
    sources: [
      {
        label: "Bid India Discover",
        href: "https://www.bidindia.co.in/products/discover",
        note: "Compatibility scoring and adaptive opportunity prioritization.",
      },
      {
        label: "ContraVault AI",
        href: "https://www.contravault.com/in",
        note: "Risk, contradiction, bid intelligence, and outcome-oriented positioning.",
      },
      {
        label: "TenderKosh",
        href: "https://tenderkosh.com/",
        note: "Competitor intelligence, market momentum, and tender workflow signals.",
      },
      {
        label: "TenderGenie",
        href: "https://www.tendergenie.ai/",
        note: "Competitor intelligence and enterprise memory.",
      },
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
