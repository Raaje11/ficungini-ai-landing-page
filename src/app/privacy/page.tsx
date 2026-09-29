import type { Metadata } from "next";
import { StaticPageShell } from "@/components/landing/StaticPageShell";
import { PageHero } from "@/components/landing/PageHero";
import { LegalDocument, type LegalSection } from "@/components/landing/LegalDocument";

export const metadata: Metadata = {
  title: "Privacy Policy | Ficungini",
  description: "How Ficungini collects, uses, and protects your data.",
};

const sections: LegalSection[] = [
  {
    id: "customer-workspace",
    title: "Customer Workspace",
    body: (
      <>
        <p>
          Ficungini provides customers with an encrypted workspace for storing and processing tender-related information.
        </p>
        <p>
          Workspace data is logically isolated from other platform environments. Access to the customer's workspace is
          restricted by the applicable authentication, authorization, and access-control mechanisms.
        </p>
        <p>
          Ficungini's Teaching Genie component does not have access to customer workspace data. Workspace content is not
          made available to Teaching Genie unless a specific product workflow explicitly provides such access and the
          customer has initiated or authorized that workflow.
        </p>
        <p>Customer workspace data is therefore not treated as generally accessible platform data.</p>
      </>
    ),
  },
  {
    id: "encryption-transmission",
    title: "Encryption and Data Transmission",
    body: (
      <>
        <p>
          Ficungini requires data transmissions between supported platform components and integrations to occur through
          encrypted communication channels.
        </p>
        <p>This includes, where applicable:</p>
        <ul>
          <li>User access to the Ficungini platform</li>
          <li>Transmission of customer workspace data</li>
          <li>API communications</li>
          <li>ERP integrations</li>
          <li>Communications between supported platform services</li>
          <li>Transmission of generated reports and other customer outputs</li>
        </ul>
        <p>
          Ficungini applies encryption and appropriate security controls to protect information while it is transmitted
          across networks.
        </p>
        <p>
          API integrations between Ficungini and connected ERP systems are transmitted through encrypted channels.
        </p>
      </>
    ),
  },
  {
    id: "authentication",
    title: "Authentication and Account Security",
    body: (
      <>
        <p>Ficungini requires Time-based One-Time Password (TOTP) authentication for platform access.</p>
        <p>
          A valid TOTP authentication factor is required in addition to the applicable account credentials. Without
          successful TOTP authentication, a user cannot log in to the Ficungini platform.
        </p>
        <p>
          Users are responsible for maintaining the security of their authentication credentials and TOTP device or
          authenticator.
        </p>
        <p>
          Ficungini may maintain authentication and security logs for purposes including access control, security
          monitoring, incident investigation, and abuse prevention.
        </p>
      </>
    ),
  },
  {
    id: "customer-content",
    title: "Customer Content",
    body: (
      <>
        <p>Customer Content may include:</p>
        <ul>
          <li>Tender documents</li>
          <li>Requests for proposals and invitations to tender</li>
          <li>Technical specifications</li>
          <li>Eligibility requirements</li>
          <li>Compliance requirements</li>
          <li>Commercial information</li>
          <li>Supporting evidence</li>
          <li>Citations and references</li>
          <li>Documents uploaded to a customer workspace</li>
          <li>Information generated during tender analysis</li>
          <li>User-provided instructions and other workspace information</li>
        </ul>
        <p>Customers retain their rights in Customer Content.</p>
        <p>
          Ficungini processes Customer Content only to provide the Services, perform customer-authorized processing,
          maintain and secure the platform, comply with applicable law, and perform other purposes expressly agreed with
          the customer.
        </p>
        <p>Ficungini does not sell Customer Content.</p>
      </>
    ),
  },
  {
    id: "access-customer-content",
    title: "Access to Customer Content",
    body: (
      <>
        <p>Access to Customer Content is restricted according to the security architecture and access controls applicable to the Services.</p>
        <p>Ficungini does not provide general access to customer workspace contents to unrelated platform components.</p>
        <p>In particular, Customer Content stored within an encrypted workspace is not accessible to Teaching Genie.</p>
        <p>
          Where an authorized Ficungini service, agent, integration, or workflow requires access to specific Customer
          Content to perform a requested operation, access is limited to the information required for that operation.
        </p>
      </>
    ),
  },
  {
    id: "erp-integrations",
    title: "ERP and API Integrations",
    body: (
      <>
        <p>Customers may integrate Ficungini with supported ERP or other business systems.</p>
        <p>Data exchanged through such integrations is transmitted through encrypted communication channels.</p>
        <p>
          The customer remains responsible for configuring and securing its connected third-party systems, including
          appropriate credentials, permissions, and access controls.
        </p>
        <p>
          Ficungini does not assume responsibility for security failures originating within a customer's third-party
          systems or infrastructure.
        </p>
      </>
    ),
  },
  {
    id: "tender-lifecycle",
    title: "Tender Workspace Lifecycle and Post-Tender Data Handling",
    body: (
      <>
        <p>Ficungini applies a defined lifecycle to tender workspace data.</p>
        <p>When a tender reaches its designated closing state, the workspace documents are prepared for customer delivery.</p>
        <p>
          The applicable workspace documents are packaged into a ZIP archive and transmitted to the customer's designated
          email address.
        </p>
        <p>
          Following successful preparation and transmission of the tender archive, the applicable workspace documents are
          deleted from Ficungini's active server environment in accordance with the platform's deletion process.
        </p>
        <p>
          The purpose of this lifecycle is to minimize the period for which closed-tender workspace documents remain
          stored on Ficungini's active servers.
        </p>
        <p>
          Deletion from active systems does not necessarily mean that every transient or backup copy is immediately
          destroyed. Where technical backups or disaster-recovery systems retain copies for a limited period, those copies
          remain subject to applicable security controls and are removed or overwritten according to the relevant backup
          lifecycle.
        </p>
      </>
    ),
  },
  {
    id: "data-retention",
    title: "Data Retention",
    body: (
      <>
        <p>
          Ficungini follows data-retention practices designed to retain information only for as long as necessary to
          provide the Services, satisfy contractual obligations, maintain security and operational records, comply with
          legal requirements, and complete the applicable customer data lifecycle.
        </p>
        <p>
          For tender workspaces, the post-tender lifecycle described above applies unless a different retention
          requirement has been agreed contractually or is required by applicable law.
        </p>
        <p>
          Where a customer has an applicable contractual retention or deletion requirement, the relevant contractual
          terms govern to the extent permitted by law.
        </p>
      </>
    ),
  },
  {
    id: "security-measures",
    title: "Security Measures",
    body: (
      <>
        <p>
          Ficungini maintains technical and organizational measures designed to protect Customer Content and personal
          information against unauthorized access, disclosure, alteration, destruction, and loss.
        </p>
        <p>These measures include, as applicable:</p>
        <ul>
          <li>Encrypted customer workspaces</li>
          <li>Encrypted data transmission</li>
          <li>Encrypted API and ERP communications</li>
          <li>Mandatory TOTP-based authentication</li>
          <li>Access-control mechanisms</li>
          <li>Workspace isolation</li>
          <li>Restricted service access</li>
          <li>Authentication and security logging</li>
          <li>Security monitoring</li>
          <li>Controlled data lifecycle and deletion</li>
          <li>Backup and recovery controls</li>
          <li>Incident-response procedures</li>
        </ul>
        <p>
          No internet-connected system can guarantee absolute security. Ficungini continuously evaluates and improves its
          security controls based on operational and security requirements.
        </p>
      </>
    ),
  },
  {
    id: "automated-processing",
    title: "Automated Processing",
    body: (
      <>
        <p>
          Ficungini may use automated systems and specialized processing components to analyze tender information and
          generate outputs requested by customers.
        </p>
        <p>
          Such processing may include analysis of requirements, evidence, citations, compliance information, and other
          Customer Content.
        </p>
        <p>Access to Customer Content by an automated component is controlled according to the applicable workflow and access permissions.</p>
        <p>Teaching Genie does not have access to encrypted customer workspaces.</p>
        <p>
          Automated outputs should be reviewed by the customer before being relied upon for material legal, commercial,
          financial, regulatory, or procurement decisions.
        </p>
      </>
    ),
  },
  {
    id: "third-party-providers",
    title: "Third-Party Service Providers",
    body: (
      <>
        <p>
          Ficungini may use third-party providers for infrastructure, hosting, communications, security, authentication,
          payment processing, email delivery, or other services necessary to operate the platform.
        </p>
        <p>
          Where a third-party provider processes Customer Content on Ficungini's behalf, Ficungini applies appropriate
          contractual and security controls consistent with the service provided.
        </p>
        <p>
          Where required, applicable subprocessors and their processing activities may be disclosed to customers through
          the applicable contractual documentation.
        </p>
      </>
    ),
  },
  {
    id: "data-breach",
    title: "Data Breach and Security Incidents",
    body: (
      <>
        <p>
          If Ficungini becomes aware of a security incident involving Customer Content or personal information, Ficungini
          will assess the incident and take appropriate containment, investigation, remediation, and notification measures
          in accordance with applicable law and contractual obligations.
        </p>
        <p>
          Where notification is legally or contractually required, Ficungini will provide the relevant information within
          the applicable timeframe.
        </p>
      </>
    ),
  },
  {
    id: "privacy-rights",
    title: "Privacy Rights",
    body: (
      <>
        <p>
          Depending on applicable law, individuals may have rights regarding their personal information, including rights
          to:
        </p>
        <ul>
          <li>Access personal information</li>
          <li>Correct inaccurate information</li>
          <li>Request deletion</li>
          <li>Restrict certain processing</li>
          <li>Object to certain processing</li>
          <li>Request portability</li>
          <li>Withdraw consent where applicable</li>
          <li>Lodge a complaint with a relevant supervisory or regulatory authority</li>
        </ul>
        <p>
          Where Ficungini processes information on behalf of an organization, the organization may be the relevant data
          controller and may be responsible for responding to certain requests.
        </p>
      </>
    ),
  },
  {
    id: "india-compliance",
    title: "India",
    body: (
      <>
        <p>
          Where applicable, Ficungini processes personal data in accordance with applicable Indian privacy and data-protection laws, including the Digital Personal Data Protection Act, 2023, and applicable rules and regulations.
        </p>
        <p>
          The specific allocation of controller and processor responsibilities may depend on the nature of the Services
          and the applicable customer agreement.
        </p>
      </>
    ),
  },
  {
    id: "international-transfers",
    title: "International Data Transfers",
    body: (
      <>
        <p>
          Ficungini may use infrastructure and service providers located in jurisdictions outside the country where a
          customer or user is located.
        </p>
        <p>Where personal information is transferred internationally, Ficungini will implement safeguards required by applicable law.</p>
        <p>
          Customers requiring specific data-residency or data-transfer requirements may address those requirements through
          their applicable enterprise agreement or data-processing agreement.
        </p>
      </>
    ),
  },
  {
    id: "children-privacy",
    title: "Children's Privacy",
    body: (
      <>
        <p>Ficungini is a business and enterprise-oriented service and is not directed toward children.</p>
        <p>We do not knowingly collect personal information from children where prohibited by applicable law.</p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to This Privacy Policy",
    body: (
      <>
        <p>Ficungini may update this Privacy Policy from time to time.</p>
        <p>Material changes may be communicated through the Services, email, or another appropriate mechanism.</p>
        <p>The "Last Updated" date indicates the date on which this Privacy Policy was most recently revised.</p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <>
        <p>
          If you have questions about this Privacy Policy or our privacy practices, please contact us at{" "}
          <a href="mailto:privacy@ficungini.ai" className="font-medium text-pantone hover:text-pantone-700">
            privacy@ficungini.ai
          </a>
        </p>
      </>
    ),
  },
  {
    id: "related-agreements",
    title: "Related Agreements",
    body: (
      <>
        <p>
          This Privacy Policy should be read together with Ficungini's Terms of Service, customer agreements, Data
          Processing Agreement, security documentation, and applicable enterprise contractual terms.
        </p>
        <p>
          Where an applicable customer agreement contains specific data-protection or security obligations that conflict
          with this Privacy Policy, the applicable contractual provisions will govern to the extent permitted by law.
        </p>
      </>
    ),
  },
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
        effectiveDate="29 September 2026"
        readTime="~8 min read"
        organization={{
          name: "Ficungini",
          lines: ["India"],
          email: "privacy@ficungini.ai",
        }}
        sections={sections}
      />
    </StaticPageShell>
  );
}
