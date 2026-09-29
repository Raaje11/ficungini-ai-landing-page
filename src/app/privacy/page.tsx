import type { Metadata } from "next";
import { StaticPageShell } from "@/components/landing/StaticPageShell";
import { PageHero } from "@/components/landing/PageHero";
import { LegalDocument, type LegalSection } from "@/components/landing/LegalDocument";

export const metadata: Metadata = {
  title: "Privacy Policy | Ficungini",
  description: "How Ficungini collects, uses, and protects your data.",
};

// Placeholder copy: replace with the reviewed policy text before launch.
const placeholder = (topic: string) => (
  <p>Placeholder text. The policy on {topic} will be provided here once it has been reviewed.</p>
);

const sections: LegalSection[] = [
  { id: "introduction", title: "Introduction", body: placeholder("who we are and the scope of this policy") },
  {
    id: "data-we-collect",
    title: "Data we collect",
    body: (
      <>
        <p>Placeholder text. The categories of data we collect will be listed here, for example:</p>
        <ul>
          <li>Account and contact details</li>
          <li>Tender documents you upload</li>
          <li>Usage and device information</li>
        </ul>
      </>
    ),
  },
  { id: "how-we-use-data", title: "How we use your data", body: placeholder("purposes of processing") },
  { id: "legal-bases", title: "Legal bases", body: placeholder("legal bases for processing") },
  { id: "sharing", title: "Sharing and subprocessors", body: placeholder("sharing and subprocessors") },
  { id: "retention", title: "Retention", body: placeholder("data retention") },
  { id: "security", title: "Security", body: placeholder("security measures") },
  { id: "international-transfers", title: "International transfers", body: placeholder("international transfers") },
  { id: "your-rights", title: "Your rights", body: placeholder("your rights and how to exercise them") },
  { id: "cookies", title: "Cookies", body: placeholder("cookies and similar technologies") },
  { id: "changes", title: "Changes to this policy", body: placeholder("how updates are communicated") },
  { id: "contact", title: "Contact us", body: placeholder("how to contact us") },
];

export default function PrivacyPage() {
  return (
    <StaticPageShell>
      <PageHero
        kicker="LEGAL"
        title="Privacy Policy"
        description="How Ficungini collects, uses, and protects your data."
      />
      <div aria-hidden className="mx-auto h-px max-w-6xl bg-ink-200" />
      <LegalDocument
        effectiveDate="TBD"
        readTime="Placeholder"
        organization={{ name: "Ficungini", lines: ["Registered address to be added"], email: "privacy@ficungini.ai" }}
        sections={sections}
      />
    </StaticPageShell>
  );
}
