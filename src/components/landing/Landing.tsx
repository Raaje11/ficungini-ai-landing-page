"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import DrawSVGPlugin from "gsap/DrawSVGPlugin";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { BrainLogo } from "./BrainLogo";
import { CheckIcon, PopIcon } from "./Icons";
import { CheckoutModal, DemoModal } from "./Modals";
import { Reveal } from "./Reveal";
import { TextRevealHeading, TextRevealParagraph } from "./TextReveal";
import { Toast } from "./Toast";

gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin);

type ModalState = { type: "demo" } | { type: "checkout"; tier: string; price: string } | null;

export function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useGSAP(
    () => {
      const logoStrokes = gsap.utils.toArray<SVGElement>(".brain-logo path, .brain-logo circle");
      gsap.set(logoStrokes, { drawSVG: "0%" });
      gsap.to(logoStrokes, {
        drawSVG: "100%",
        duration: 1.8,
        stagger: 0.02,
        ease: "power2.out",
      });

      ScrollTrigger.create({
        trigger: document.body,
        start: "8px top",
        toggleClass: { targets: headerRef.current, className: "is-scrolled" },
      });
    },
    { scope: containerRef },
  );

  const openDemoModal = () => setModal({ type: "demo" });
  const openCheckout = (tier: string, price: string) => setModal({ type: "checkout", tier, price });
  const closeModal = () => setModal(null);

  const handleDemoSubmit = () => {
    closeModal();
    setToastMessage("Demo request booked successfully!");
  };

  const handleCheckoutSubmit = (tier: string) => {
    closeModal();
    setToastMessage(`Redirecting to secure gateway for ${tier}...`);
  };

  return (
    <div ref={containerRef} className="antialiased selection:bg-pantone selection:text-alabaster">
      <header
        ref={headerRef}
        className="site-header sticky top-0 z-50 bg-alabaster/90 backdrop-blur-md border-b border-ink-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center space-x-2.5 text-ink-900 group">
            <BrainLogo className="w-7 h-7 text-pantone" />
            <span className="font-semibold text-xl tracking-tight text-ink-900 font-fira-code">
              ficungini<span className="text-pantone">.ai</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-ink-600">
            <a href="#platform" className="hover:text-pantone transition-colors">Platform</a>
            <a href="#company" className="hover:text-pantone transition-colors">Company</a>
            <a href="#documentation" className="hover:text-pantone transition-colors">Documentation</a>
            <a href="#pricing" className="hover:text-pantone transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center space-x-4">
            <a
              href="https://app.ficungini.ai"
              className="hidden sm:inline-flex text-sm font-medium text-ink-700 hover:text-pantone px-3 py-2"
            >
              Sign In
            </a>
            <a
              href="https://app.ficungini.ai"
              className="claude-bg claude-bg-hover text-alabaster text-sm font-medium px-4 py-2.5 custom-rounded shadow-sm transition-all shadow-pantone/20 active:scale-95"
            >
              Analyze a Tender Free
            </a>
          </div>
        </div>
      </header>

      <section className="relative hero-gradient pt-20 pb-28 overflow-hidden border-b border-ink-200/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <TextRevealHeading className="text-4xl sm:text-6xl font-extrabold text-ink-900 tracking-tight max-w-4xl mx-auto leading-[1.15] font-sans-title">
            Every tender deserves{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pantone-500 to-pantone-800">
              better decisions.
            </span>
          </TextRevealHeading>

          <TextRevealParagraph className="mt-6 text-xl sm:text-2xl text-ink-700 max-w-3xl mx-auto font-normal leading-relaxed">
            Built for the professionals who analyze, validate, and craft complex bids.
          </TextRevealParagraph>

          <Reveal delayMs={200}>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href="https://app.ficungini.ai"
                className="w-full sm:w-auto claude-bg claude-bg-hover text-alabaster font-medium px-8 py-3.5 custom-rounded shadow-lg shadow-pantone/20 transition-all transform hover:-translate-y-0.5"
              >
                Analyze a Tender Free
              </a>
              <button
                onClick={openDemoModal}
                className="w-full sm:w-auto bg-white hover:bg-ink-50 text-ink-700 border border-ink-200 font-medium px-8 py-3.5 custom-rounded shadow-sm transition-all"
              >
                Book a Demo
              </button>
            </div>
          </Reveal>

          <Reveal delayMs={300}>
            <div className="mt-6 max-w-lg mx-auto flex items-center justify-center space-x-2 text-xs text-ink-500">
              <CheckIcon className="w-4 h-4 text-pantone flex-shrink-0" delay={0.2} />
              <span>
                Analyze one tender free every day. Create a free account and subscribe to Ficungini Insights to receive
                one complimentary Go/No-Go analysis.
              </span>
            </div>
          </Reveal>

          <Reveal delayMs={400} scale>
            <div className="mt-14 max-w-5xl mx-auto bg-white custom-rounded shadow-2xl border border-ink-200/90 overflow-hidden text-left">
              <div className="bg-ink-100/80 px-4 py-3 border-b border-ink-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 custom-rounded bg-ink-300" />
                  <div className="w-3 h-3 custom-rounded bg-pantone-400" />
                  <div className="w-3 h-3 custom-rounded bg-pantone-600" />
                </div>
                <div className="text-xs font-mono-code text-ink-600 bg-white px-3 py-1 custom-rounded border border-ink-200 shadow-inner">
                  tender-analysis-workspace.pdf
                </div>
                <div className="text-xs font-semibold text-iris bg-iris-100 px-2.5 py-1 custom-rounded border border-iris/25">
                  Go Decision: 88% Match
                </div>
              </div>
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-ink-50/40">
                <div className="super-card p-5 custom-rounded shadow-sm">
                  <div className="text-xs font-bold uppercase tracking-wider text-pantone mb-2 font-mono-code">
                    Recommendation
                  </div>
                  <h4 className="font-bold text-ink-900 text-lg font-sans-title">Go / No-Go</h4>
                  <p className="text-xs text-ink-500 mt-1">
                    High eligibility match. Past expressway experience satisfies Clause 4.2.
                  </p>
                </div>
                <div className="super-card p-5 custom-rounded shadow-sm">
                  <div className="text-xs font-bold uppercase tracking-wider text-pantone-700 mb-2 font-mono-code">
                    Verification Needed
                  </div>
                  <h4 className="font-bold text-ink-900 text-lg font-sans-title">3 Clauses Flagged</h4>
                  <p className="text-xs text-ink-500 mt-1">
                    JV turnover ratios in Section 7 require expert sign-off.
                  </p>
                </div>
                <div className="super-card p-5 custom-rounded shadow-sm">
                  <div className="text-xs font-bold uppercase tracking-wider text-pantone-800 mb-2 font-mono-code">
                    Market Intelligence
                  </div>
                  <h4 className="font-bold text-ink-900 text-lg font-sans-title">Competitor Trend</h4>
                  <p className="text-xs text-ink-500 mt-1">
                    Average bidding margin in regional tenders is 12.4% below estimate.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="platform" className="py-20 bg-alabaster">
        <Reveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs font-bold uppercase tracking-widest text-pantone mb-3 font-mono-code">Why Ficungini</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-ink-900 tracking-tight font-sans-title mb-6">
            Winning starts long before the proposal is written.
          </h3>
          <p className="text-lg text-ink-600 leading-relaxed font-normal">
            The quality of a bid depends on the decisions behind it: eligibility, compliance, clarifications,
            commercial strategy, and market context. Ficungini brings them together in one place.
          </p>
        </Reveal>
      </section>

      <section className="py-20 bg-white border-t border-ink-200/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-pantone mb-3 font-mono-code">Workflow</h2>
            <h3 className="text-3xl font-extrabold text-ink-900 tracking-tight font-sans-title">
              How Ficungini fits into your workflow
            </h3>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                n: "01",
                title: "Upload tender documents",
                body: "Securely ingest RFPs, corrigenda, and technical specs.",
              },
              {
                n: "02",
                title: "Review Go/No-Go",
                body: "Instant eligibility breakdown and strategic match score.",
              },
              {
                n: "03",
                title: "Validate flagged requirements",
                body: "Examine critical clauses and compliance checklists.",
              },
              {
                n: "04",
                title: "Analyze or craft the bid",
                body: "Draft responses and refine proposals with expert precision.",
              },
            ].map((step, i) => (
              <Reveal key={step.n} delayMs={100 * (i + 1)} className="super-card p-6 custom-rounded shadow-sm">
                <div className="text-pantone font-mono-code font-bold text-lg mb-2">{step.n}</div>
                <h4 className="font-bold text-ink-900 text-base mb-2 font-sans-title">{step.title}</h4>
                <p className="text-xs text-ink-600">{step.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-alabaster border-t border-ink-200/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-pantone mb-3 font-mono-code">Capabilities</h2>
            <h3 className="text-3xl font-extrabold text-ink-900 tracking-tight font-sans-title">
              What your team knows before writing a bid
            </h3>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                n: "01",
                bg: "bg-pantone-100",
                text: "text-pantone-700",
                title: "Go / No-Go recommendation",
                body: "Know whether the opportunity is worth pursuing before investing hours in drafting.",
              },
              {
                n: "02",
                bg: "bg-pantone-50",
                text: "text-pantone-700",
                title: "Requirements that require verification",
                body: "Identify exact clauses and compliance items that need expert review and sign-off.",
              },
              {
                n: "03",
                bg: "bg-pantone-50",
                text: "text-pantone-800",
                title: "Clauses that require clarification",
                body: "Detect conflicting conditions, ambiguities, and corrigenda that require formal pre-bid queries.",
              },
              {
                n: "04",
                bg: "bg-ink-100",
                text: "text-ink-800",
                title: "Critical eligibility observations",
                body: "Uncover decisive eligibility nuances and market context before submission.",
              },
            ].map((cap, i) => (
              <Reveal key={cap.n} delayMs={100 * (i + 1)} className="super-card p-8 custom-rounded shadow-sm">
                <div
                  className={`w-12 h-12 custom-rounded ${cap.bg} ${cap.text} flex items-center justify-center font-bold text-xl mb-6 font-sans-title`}
                >
                  {cap.n}
                </div>
                <h4 className="font-bold text-ink-900 text-xl mb-3 font-sans-title">{cap.title}</h4>
                <p className="text-sm text-ink-600 leading-relaxed">{cap.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-t border-ink-200/85">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-pantone mb-3 font-mono-code">Advantages</h2>
            <h3 className="text-3xl font-extrabold text-ink-900 tracking-tight font-sans-title">Why teams choose us</h3>
          </Reveal>

          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              "Every conclusion is reviewable against the tender.",
              "Market intelligence is based on real procurement data.",
              "Strategy and bid development happen in the same workspace.",
              "Completed tenders become reusable organizational knowledge.",
            ].map((text, i) => (
              <Reveal
                key={text}
                delayMs={100 * (i + 1)}
                className="super-card p-6 custom-rounded flex items-start space-x-4 shadow-sm"
              >
                <div className="w-6 h-6 custom-rounded bg-pantone-100 text-pantone-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckIcon className="w-4 h-4" delay={0.1 * (i + 1)} />
                </div>
                <p className="text-ink-800 font-medium text-base">{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-alabaster border-t border-ink-200/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-pantone mb-3 font-mono-code">Audience</h2>
            <h3 className="text-3xl font-extrabold text-ink-900 tracking-tight font-sans-title">Built for professionals</h3>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Tender Consultancies",
                body: "Scale proposal output across multidisciplinary teams with structured document repositories and collaborative workspaces.",
              },
              {
                title: "Independent Consultants",
                body: "Handle multi-chapter RFPs single-handedly with rapid clause analysis and instant go/no-go intelligence.",
              },
              {
                title: "EPC & OEM Teams",
                body: "Cross-reference complex technical specifications and compliance tables against past project submissions in seconds.",
              },
            ].map((aud, i) => (
              <Reveal key={aud.title} delayMs={100 * (i + 1)} className="super-card p-8 custom-rounded shadow-sm">
                <h4 className="font-bold text-ink-900 text-xl mb-3 font-sans-title">{aud.title}</h4>
                <p className="text-sm text-ink-600 leading-relaxed">{aud.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 bg-white border-t border-ink-200/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-pantone mb-3 font-mono-code">Pricing</h2>
            <h3 className="text-3xl font-extrabold text-ink-900 tracking-tight font-sans-title">Simple, transparent pricing</h3>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
            <Reveal delayMs={100} scale className="super-card custom-rounded p-8 shadow-sm flex flex-col justify-between relative">
              <div>
                <h4 className="font-bold text-2xl text-ink-900 font-sans-title mb-2">Individual</h4>
                <div className="mb-4">
                  <span className="text-4xl font-extrabold text-ink-900 font-sans-title">₹9,999</span>
                  <span className="text-ink-500 text-sm font-medium"> / month</span>
                  <div className="text-xs text-ink-500 font-mono-code mt-1">+ applicable % GST</div>
                </div>
                <p className="text-sm text-ink-600 mb-6">Complete platform access with monthly usage limits.</p>
                <ul className="text-xs text-ink-600 space-y-2 mb-8 font-medium">
                  <li className="flex items-center space-x-2">
                    <span className="text-pantone font-bold">✓</span>
                    <span>Tender Intelligence</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-pantone font-bold">✓</span>
                    <span>Tender Repository</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-pantone font-bold">✓</span>
                    <span>Bid Studio & Archive</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => openCheckout("Individual", "₹9,999/mo + GST")}
                className="w-full bg-ink-900 hover:bg-pantone text-alabaster font-medium py-3 custom-rounded transition-colors shadow-sm font-sans-title"
              >
                Get Started
              </button>
            </Reveal>

            <Reveal
              delayMs={200}
              scale
              className="bg-ink-900 text-alabaster custom-rounded p-8 shadow-xl flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-pantone-700/35 custom-rounded blur-2xl opacity-50" />
              <div className="relative z-10">
                <h4 className="font-bold text-2xl text-alabaster font-sans-title mb-2">Business</h4>
                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-alabaster font-sans-title">Request a Quote</span>
                </div>
                <p className="text-sm text-ink-300 mb-6">For consultancy firms and organizations.</p>
              </div>
              <button
                onClick={openDemoModal}
                className="relative z-10 w-full bg-white hover:bg-ink-100 text-ink-900 font-medium py-3 custom-rounded transition-colors shadow-sm font-sans-title"
              >
                Book a Demo
              </button>
            </Reveal>
          </div>

          <Reveal className="text-center text-xs text-ink-500 font-mono-code max-w-xl mx-auto">
            Every capability is included in both plans. Individual licenses include a monthly usage allowance.
            Business licenses add collaborative workspaces and organizational deployment.
          </Reveal>
        </div>
      </section>

      <section className="py-20 bg-alabaster border-t border-ink-200/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-pantone mb-3 font-mono-code">Testimonials</h2>
            <h3 className="text-3xl font-extrabold text-ink-900 tracking-tight font-sans-title">
              Designed with consultancy teams in mind.
            </h3>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                quote:
                  "The biggest improvement wasn't automation. It was finally reviewing decisions instead of searching documents.",
                role: "Director",
                org: "Infrastructure Consultancy",
              },
              {
                quote: "Our review meetings became shorter because everyone could verify the exact clause immediately.",
                role: "Senior Bid Consultant",
                org: "Multidisciplinary Practice",
              },
              {
                quote: "We catch compliance flags on day one that used to slip past during high-pressure crunch weeks.",
                role: "Procurement Advisory Partner",
                org: "EPC Advisory Group",
              },
            ].map((t, i) => (
              <Reveal key={t.role} delayMs={100 * (i + 1)} scale className="super-card p-6 custom-rounded shadow-sm">
                <p className="text-sm text-ink-700 italic mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div className="text-xs font-bold text-ink-900 font-sans-title">{t.role}</div>
                <div className="text-xs text-ink-500 font-mono-code">{t.org}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="documentation" className="py-20 bg-white border-t border-ink-200/85">
        <Reveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs font-bold uppercase tracking-widest text-pantone mb-3 font-mono-code">Documentation</h2>
          <h3 className="text-3xl font-extrabold text-ink-900 tracking-tight font-sans-title mb-4">
            Everything you need to master Ficungini
          </h3>
          <p className="text-ink-600 text-base mb-8">
            Explore guides, API references for enterprise deployment, and best practices for tender analysis workflows.
          </p>
          <button
            onClick={openDemoModal}
            className="inline-block bg-ink-100 hover:bg-ink-200 text-ink-800 font-medium px-6 py-3 custom-rounded transition-colors text-sm font-sans-title"
          >
            Browse Documentation Hub
          </button>
        </Reveal>
      </section>

      <section id="company" className="py-20 bg-alabaster border-t border-ink-200/85">
        <Reveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs font-bold uppercase tracking-widest text-pantone mb-3 font-mono-code">Company</h2>
          <h3 className="text-3xl font-extrabold text-ink-900 tracking-tight font-sans-title mb-4">
            Built by tender experts, for tender experts
          </h3>
          <p className="text-ink-600 text-base max-w-2xl mx-auto">
            We are headquartered with a mission to bring clarity and rigorous precision to public and private
            procurement worldwide.
          </p>
        </Reveal>
      </section>

      <section className="py-24 claude-bg text-alabaster text-center relative overflow-hidden">
        <Reveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold font-sans-title mb-4 tracking-tight">
            Start with your next tender.
          </h2>
          <p className="text-lg text-alabaster/80 mb-8 max-w-xl mx-auto font-sans">
            Make better procurement decisions before submission.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href="https://app.ficungini.ai"
              className="w-full sm:w-auto bg-alabaster hover:bg-ink-100 text-pantone-800 font-medium px-8 py-3.5 custom-rounded shadow-lg transition-all font-sans-title"
            >
              Analyze a Tender Free
            </a>
            <button
              onClick={openDemoModal}
              className="w-full sm:w-auto bg-pantone-900/60 hover:bg-pantone-900 text-alabaster border border-pantone-400/60 font-medium px-8 py-3.5 custom-rounded shadow-sm transition-all font-sans-title"
            >
              Book a Demo
            </button>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-ink-200 bg-alabaster pt-6 pb-10 text-[13px] leading-relaxed text-ink-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="flex items-center gap-2">
              <BrainLogo className="w-4 h-4 text-pantone" />
              <span className="font-fira-code font-medium text-ink-700">
                ficungini<span className="text-pantone">.ai</span>
              </span>
              <span>© 2026</span>
            </span>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <a href="#platform" className="footer-link">Platform</a>
                <a href="#company" className="footer-link">Company</a>
                <a href="#documentation" className="footer-link">Documentation</a>
                <a href="#pricing" className="footer-link">Pricing</a>
              </nav>
              <div className="flex items-center gap-3.5 border-l border-ink-200 pl-5">
                <a
                  href="https://x.com/ficungini"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  title="X"
                  className="footer-link inline-flex"
                >
                  <PopIcon>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </PopIcon>
                </a>
                <a
                  href="https://linkedin.com/company/ficungini"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                  className="footer-link inline-flex"
                >
                  <PopIcon delay={0.08}>
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </PopIcon>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">Security</a>
            <span className="ml-auto">Worldwide</span>
          </div>
        </div>
      </footer>

      {modal?.type === "demo" && <DemoModal onClose={closeModal} onSubmit={handleDemoSubmit} />}
      {modal?.type === "checkout" && (
        <CheckoutModal
          tier={modal.tier}
          price={modal.price}
          onClose={closeModal}
          onSubmit={() => handleCheckoutSubmit(modal.tier)}
        />
      )}
      {toastMessage && <Toast message={toastMessage} onDone={() => setToastMessage(null)} />}
    </div>
  );
}
