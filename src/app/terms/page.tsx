import type { Metadata } from "next";
import { StaticPageShell } from "@/components/landing/StaticPageShell";
import { PageHero } from "@/components/landing/PageHero";
import { LegalDocument, type LegalSection } from "@/components/landing/LegalDocument";

export const metadata: Metadata = {
  title: "Terms of Use | Ficungini",
  description: "The terms that govern your use of Ficungini.",
};

// Placeholder copy: replace with the reviewed terms before launch.
const placeholder = (topic: string) => (
  <p>Placeholder text. The terms on {topic} will be provided here once they have been reviewed.</p>
);

const sections: LegalSection[] = [
  { id: "acceptance", title: "Acceptance of terms", body: placeholder("acceptance and scope") },
  { id: "the-service", title: "The service", body: placeholder("what Ficungini provides") },
  { id: "accounts", title: "Accounts and access", body: placeholder("accounts and access") },
  { id: "acceptable-use", title: "Acceptable use", body: placeholder("acceptable use") },
  { id: "your-content", title: "Your content", body: placeholder("ownership of the tender documents you upload") },
  { id: "ai-outputs", title: "AI-generated outputs", body: placeholder("use of, and reliance on, AI-generated analysis") },
  { id: "intellectual-property", title: "Intellectual property", body: placeholder("intellectual property") },
  { id: "fees", title: "Fees and payment", body: placeholder("fees and payment") },
  { id: "warranties", title: "Disclaimers", body: placeholder("warranties and disclaimers") },
  { id: "liability", title: "Limitation of liability", body: placeholder("limitation of liability") },
  { id: "termination", title: "Termination", body: placeholder("suspension and termination") },
  { id: "governing-law", title: "Governing law", body: placeholder("governing law and disputes") },
  { id: "changes", title: "Changes to these terms", body: placeholder("how updates are communicated") },
  { id: "contact", title: "Contact us", body: placeholder("how to contact us") },
];

export default function TermsPage() {
  return (
    <StaticPageShell>
      <PageHero
        kicker="LEGAL"
        title="Terms of Use"
        description="The terms that govern your use of Ficungini."
      />
      <div aria-hidden className="mx-auto h-px max-w-6xl bg-ink-200" />
      <LegalDocument
        effectiveDate="TBD"
        readTime="Placeholder"
        organization={{ name: "Ficungini", lines: ["Registered address to be added"], email: "legal@ficungini.ai" }}
        sections={sections}
      />
    </StaticPageShell>
  );
}
