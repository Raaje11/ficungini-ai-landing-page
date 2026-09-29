import type { Metadata } from "next";
import type { ReactNode } from "react";
import { StaticPageShell } from "@/components/landing/StaticPageShell";
import { PageHero } from "@/components/landing/PageHero";
import { LegalDocument, type LegalSection } from "@/components/landing/LegalDocument";

export const metadata: Metadata = {
  title: "Privacy Policy | Ficungini",
  description: "How Ficungini collects, uses, and protects your data.",
};

const H3 = ({ children }: { children: ReactNode }) => (
  <h3 className="pt-2 text-base font-bold text-ink-900 font-sans-title">{children}</h3>
);

const List = ({ items }: { items: string[] }) => (
  <ul>
    {items.map((i) => (
      <li key={i}>{i}</li>
    ))}
  </ul>
);

const sections: LegalSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    body: (
      <>
        <p>
          This Privacy Policy explains how <strong>Rith</strong>, operating the Ficungini platform (&quot;Ficungini&quot;,
          &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), collects, uses, stores, protects, and deletes information in
          connection with our websites, applications, APIs, workspaces, discovery services, and other products and services
          (collectively, the &quot;Services&quot;).
        </p>
        <p>
          This Privacy Policy applies to information processed through Ficungini unless a separate written agreement with a
          customer expressly provides otherwise.
        </p>
      </>
    ),
  },
  {
    id: "our-approach",
    title: "Our Approach to Customer Data",
    body: (
      <>
        <p>
          Ficungini is designed for professional and enterprise procurement workflows. Customer information may include
          confidential tender documents, commercial information, technical information, eligibility requirements, business
          capabilities, and other information that customers reasonably expect to be protected.
        </p>
        <p>Our approach is based on the following principles:</p>
        <List
          items={[
            "Customer workspaces are encrypted.",
            "Data transmitted to or from Ficungini is transmitted through encrypted communication channels.",
            "API and ERP integrations use encrypted communication channels.",
            "Platform access requires TOTP authentication.",
            "Paid-customer data is not used to train general-purpose models.",
            "Customer workspace data is not retained indefinitely after a tender has closed.",
            "Profile-specific discovery is provided only when the customer authorizes the corresponding processing.",
            "Customers can withdraw authorization for profile-specific discovery, after which the profile-specific discovery service will no longer be available to that customer.",
          ]}
        />
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    body: (
      <>
        <p>We collect information necessary to provide, secure, operate, and improve the Services.</p>
        <H3>Account Information</H3>
        <p>Depending on how the Services are configured, we may collect:</p>
        <List
          items={[
            "Name",
            "Work email address",
            "Phone number",
            "Organization or company name",
            "Job title or role",
            "Account identifiers",
            "Authentication information",
            "TOTP authentication configuration",
            "Workspace and organization information",
            "Subscription and billing information",
          ]}
        />
        <H3>Tender and Workspace Content</H3>
        <p>Customers may submit information to an encrypted Ficungini workspace, including:</p>
        <List
          items={[
            "Tender documents",
            "Requests for proposals",
            "Invitations to tender",
            "Technical specifications",
            "Eligibility requirements",
            "Qualification requirements",
            "Compliance requirements",
            "Commercial requirements",
            "Pricing information",
            "Supporting documents",
            "Evidence",
            "Citations and references",
            "Customer instructions",
            "Analysis results",
            "Reports",
            "Other information supplied by the customer for tender analysis",
          ]}
        />
        <p>
          This information is collectively referred to as <strong>&quot;Customer Content.&quot;</strong>
        </p>
        <H3>Customer Business Profile Information</H3>
        <p>
          Customers may voluntarily provide information for Ficungini&apos;s <strong>Profile-Specific Discovery Engine</strong>.
          This information may include:
        </p>
        <List
          items={[
            "Eligibility criteria",
            "Business strengths",
            "Business weaknesses",
            "Technical capabilities",
            "Financial capabilities",
            "Product and service capabilities",
            "Geographic capabilities",
            "Certifications and qualifications",
            "Experience and past performance",
            "Organizational capabilities",
            "Procurement preferences",
            "Relevant business sectors",
            "Other information the customer chooses to provide for profile-specific discovery",
          ]}
        />
        <p>
          This information is referred to as <strong>&quot;Profile Information.&quot;</strong> The amount and quality of
          Profile Information supplied by the customer may affect the relevance and accuracy of profile-specific discovery
          results.
        </p>
      </>
    ),
  },
  {
    id: "profile-specific-discovery",
    title: "Profile-Specific Discovery",
    body: (
      <>
        <p>
          Ficungini does not provide profile-specific discovery by silently building a profile from customer information.
          Profile-specific discovery requires customer authorization.
        </p>
        <p>
          When a customer enables this feature, Ficungini may retain and process the Profile Information provided by that
          customer for the specific purpose of identifying and presenting procurement opportunities, tenders, or other
          discovery results that are relevant to that customer&apos;s stated profile and capabilities.
        </p>
        <p>
          The purpose of this processing is to provide <strong>customer-specific discovery rather than generic discovery</strong>.
          For example, where authorized by the customer, Ficungini may use information concerning the customer&apos;s
          eligibility, technical capabilities, financial capabilities, strengths, weaknesses, qualifications, and other
          business characteristics to determine whether discovered opportunities are relevant to that customer.
        </p>
        <H3>Customer Control</H3>
        <p>
          Customers may choose not to authorize Profile-Specific Discovery. A customer may also withdraw that authorization,
          subject to applicable legal and contractual requirements. If the customer withdraws authorization:
        </p>
        <List
          items={[
            "Ficungini will stop using the applicable Profile Information for the Profile-Specific Discovery Engine, subject to any processing required by law or contractual obligations.",
            "The customer will no longer be able to use the Profile-Specific Discovery Engine while the required authorization is disabled.",
            "Other Ficungini Services that do not require Profile-Specific Discovery may continue to be available, subject to the customer's subscription and applicable terms.",
          ]}
        />
        <p>
          Because Ficungini&apos;s discovery product is specifically designed around customer profiles rather than generic
          discovery, Profile-Specific Discovery cannot operate without the information and authorization required to perform
          that service.
        </p>
        <H3>Accuracy of Profile Information</H3>
        <p>
          Profile-specific discovery depends materially on the information provided by the customer. A more complete and
          accurate business profile may enable Ficungini to identify opportunities more relevant to the customer&apos;s
          stated capabilities and requirements.
        </p>
        <p>Customers are responsible for keeping Profile Information reasonably accurate and up to date.</p>
        <p>
          Ficungini does not guarantee that every discovered opportunity will be suitable, eligible, commercially viable, or
          ultimately winnable by the customer.
        </p>
      </>
    ),
  },
  {
    id: "workspace-security",
    title: "Customer Workspace Security",
    body: (
      <>
        <p>Ficungini provides encrypted workspaces for Customer Content.</p>
        <p>
          Workspace access is controlled through authentication and authorization mechanisms designed to prevent
          unauthorized access. Customer workspace data is logically isolated from unrelated customer environments.
        </p>
        <p>Ficungini does not provide unrestricted internal access to customer workspaces.</p>
        <p>
          Access to Customer Content by Ficungini systems is limited to authorized processing required to provide the
          Services, maintain security, operate the platform, or perform a customer-authorized workflow.
        </p>
      </>
    ),
  },
  {
    id: "authentication",
    title: "Authentication",
    body: (
      <>
        <p>
          Ficungini requires <strong>Time-based One-Time Password (TOTP)</strong> authentication for platform access. A valid
          TOTP authentication factor is required to complete authentication. Without successful TOTP authentication, a user
          cannot access the Ficungini platform.
        </p>
        <p>
          Customers are responsible for protecting their account credentials and the device or authenticator used to
          generate TOTP codes.
        </p>
        <p>
          Ficungini may retain authentication and security logs for purposes including security monitoring, access control,
          fraud prevention, abuse detection, troubleshooting, and investigation of security incidents.
        </p>
      </>
    ),
  },
  {
    id: "encryption",
    title: "Encryption and Data Transmission",
    body: (
      <>
        <p>
          Ficungini uses encrypted communication channels for data transmitted between users, Ficungini systems, and
          supported integrations. This includes, where applicable:
        </p>
        <List
          items={[
            "User access to the Ficungini platform",
            "API communications",
            "ERP integrations",
            "Data exchanged between supported Ficungini services",
            "Transmission of customer outputs",
            "Other supported data transfers",
          ]}
        />
        <p>Ficungini applies appropriate encryption and security controls to protect information during transmission.</p>
      </>
    ),
  },
  {
    id: "erp-api",
    title: "ERP and API Integrations",
    body: (
      <>
        <p>Ficungini may provide integrations with customer ERP systems and other business systems.</p>
        <p>Information exchanged through supported integrations is transmitted through encrypted communication channels.</p>
        <p>
          Customers remain responsible for the security of their own connected systems, credentials, permissions, and
          infrastructure. Ficungini is not responsible for unauthorized access or security incidents originating solely from
          a customer&apos;s systems or configurations.
        </p>
      </>
    ),
  },
  {
    id: "use-of-data",
    title: "Use of Customer Data",
    body: (
      <>
        <p>Ficungini may process Customer Content and other information for the following purposes:</p>
        <List
          items={[
            "Providing the Services requested by the customer",
            "Processing and analyzing tender documents",
            "Producing evidence, findings, reports, and other requested outputs",
            "Performing authorized profile-specific discovery",
            "Maintaining customer accounts and workspaces",
            "Authentication and access control",
            "Security monitoring",
            "Fraud and abuse prevention",
            "Troubleshooting and service reliability",
            "Customer support",
            "Billing and subscription administration",
            "Compliance with legal obligations",
            "Enforcing contractual rights",
            "Protecting Ficungini, its customers, users, and other persons",
          ]}
        />
      </>
    ),
  },
  {
    id: "no-model-training",
    title: "Customer Data Is Not Used for Model Training",
    body: (
      <>
        <p>
          <strong>
            Ficungini does not use data belonging to paid customers to train, fine-tune, or improve general-purpose
            artificial intelligence or machine-learning models.
          </strong>
        </p>
        <p>
          Paid-customer Customer Content and Profile Information are not incorporated into general-purpose model-training
          datasets. This includes information such as:
        </p>
        <List
          items={[
            "Tender documents",
            "Customer workspace content",
            "Evidence",
            "Citations",
            "Requirements",
            "Customer business profiles",
            "Eligibility criteria",
            "Technical capabilities",
            "Financial capabilities",
            "Strengths and weaknesses",
            "Customer-specific discovery information",
          ]}
        />
        <p>
          Ficungini may process such information through computational or model-based systems when necessary to provide a
          Service requested or authorized by the customer. Such processing is for providing the Service and does not
          constitute using the customer&apos;s information to train a general-purpose model.
        </p>
      </>
    ),
  },
  {
    id: "automated-processing",
    title: "Automated Processing",
    body: (
      <>
        <p>Certain Ficungini Services use automated computational and machine-learning systems. These systems may process information provided by customers to perform functions such as:</p>
        <List
          items={[
            "Requirement analysis",
            "Evidence analysis",
            "Compliance analysis",
            "Document processing",
            "Tender matching",
            "Profile-specific discovery",
            "Report generation",
            "Other customer-requested processing",
          ]}
        />
        <p>Automated processing does not change the customer&apos;s ownership or rights in Customer Content.</p>
        <p>
          Automated outputs may contain errors or may require customer review. Customers remain responsible for reviewing
          outputs before relying on them for material legal, commercial, financial, regulatory, procurement, or other
          business decisions.
        </p>
      </>
    ),
  },
  {
    id: "third-party-providers",
    title: "Third-Party Providers",
    body: (
      <>
        <p>Ficungini may use third-party providers for services necessary to operate the platform, including:</p>
        <List
          items={[
            "Cloud infrastructure",
            "Storage",
            "Security",
            "Authentication",
            "Email delivery",
            "Communications",
            "Payment processing",
            "Monitoring",
            "Computational services",
            "Model or AI infrastructure",
          ]}
        />
        <p>
          Where a third party processes Customer Content on behalf of Ficungini, Ficungini applies appropriate contractual
          and technical controls consistent with the service being provided.
        </p>
        <p>Ficungini does not authorize third parties to use paid-customer data for general-purpose model training on Ficungini&apos;s behalf.</p>
      </>
    ),
  },
  {
    id: "tender-lifecycle",
    title: "Tender Workspace Lifecycle",
    body: (
      <>
        <p>Ficungini applies a defined lifecycle to tender workspace documents.</p>
        <p>
          After a tender reaches its designated closing state, the applicable workspace documents are packaged into a ZIP
          archive. The ZIP archive is made available for delivery through the customer&apos;s authorized administrator.
        </p>
        <p>
          The administrator may designate the email address to which the archive should be sent. The destination is not
          required to be a fixed email address operated by Ficungini.
        </p>
        <p>
          After the applicable export and delivery process has been completed, the corresponding tender workspace documents
          are deleted from Ficungini&apos;s active server environment.
        </p>
        <p>
          This process is designed to minimize the amount of closed-tender Customer Content retained on Ficungini&apos;s
          active infrastructure.
        </p>
      </>
    ),
  },
  {
    id: "backup",
    title: "Backup and Disaster Recovery",
    body: (
      <>
        <p>
          Deletion from active production systems does not necessarily mean that every transient or backup copy is destroyed
          simultaneously.
        </p>
        <p>
          Where backups or disaster-recovery systems retain copies for a limited period, those copies remain subject to
          appropriate security controls and are removed or overwritten according to the applicable backup lifecycle.
        </p>
        <p>Ficungini does not intentionally retain closed-tender Customer Content indefinitely in active production systems.</p>
      </>
    ),
  },
  {
    id: "retention",
    title: "Data Retention",
    body: (
      <>
        <p>
          Ficungini retains information only for as long as reasonably necessary for the purposes for which it was collected,
          to provide the Services, satisfy contractual obligations, maintain security and operational records, comply with
          legal requirements, resolve disputes, prevent abuse, and enforce agreements. Different categories of information
          may therefore have different retention periods.
        </p>
        <p>Tender workspace documents are subject to the post-tender export and deletion process described in this Privacy Policy.</p>
        <p>
          Profile Information authorized for Profile-Specific Discovery may be retained for as long as necessary to provide
          that feature, subject to customer settings, applicable contractual terms, withdrawal of authorization, and
          applicable legal requirements.
        </p>
      </>
    ),
  },
  {
    id: "withdrawal",
    title: "Withdrawal of Profile-Specific Discovery Authorization",
    body: (
      <>
        <p>A customer may withdraw authorization for Profile-Specific Discovery.</p>
        <p>Following withdrawal, Ficungini will cease the use of the applicable Profile Information for that discovery purpose, subject to:</p>
        <List
          items={[
            "Processing required by applicable law",
            "Processing required to establish, exercise, or defend legal claims",
            "Security and fraud-prevention requirements",
            "Contractual obligations",
            "Limited technical retention necessary to complete deletion or disablement processes",
          ]}
        />
        <p>Withdrawal of authorization does not retroactively invalidate processing that was lawfully performed before withdrawal.</p>
        <p>
          Because Profile-Specific Discovery depends on customer profile processing, disabling the required authorization
          means the customer cannot use that specific discovery functionality.
        </p>
      </>
    ),
  },
  {
    id: "data-sharing",
    title: "Data Sharing",
    body: (
      <>
        <p>Ficungini does not sell Customer Content or Profile Information. We may disclose information to:</p>
        <List
          items={[
            "Service providers acting on our behalf",
            "Infrastructure and technology providers",
            "Payment and billing providers",
            "Security and fraud-prevention providers",
            "Email and communications providers",
            "Legal, regulatory, or governmental authorities where legally required",
            "Professional advisers where reasonably necessary",
            "Parties involved in a merger, acquisition, financing, restructuring, or sale of assets, subject to applicable law",
          ]}
        />
        <p>We disclose information only where reasonably necessary for the applicable purpose.</p>
      </>
    ),
  },
  {
    id: "legal-requirements",
    title: "Legal Requirements",
    body: (
      <>
        <p>Ficungini may access, retain, or disclose information where reasonably necessary to:</p>
        <List
          items={[
            "Comply with applicable law",
            "Respond to lawful government or regulatory requests",
            "Protect the rights, safety, and property of Ficungini or others",
            "Investigate fraud, abuse, or security incidents",
            "Enforce contractual terms",
            "Establish, exercise, or defend legal claims",
          ]}
        />
      </>
    ),
  },
  {
    id: "security-measures",
    title: "Security Measures",
    body: (
      <>
        <p>
          Ficungini maintains technical and organizational measures designed to protect information against unauthorized
          access, alteration, disclosure, destruction, and loss. Depending on the applicable Service, these measures include:
        </p>
        <List
          items={[
            "Encrypted customer workspaces",
            "Encrypted data transmission",
            "Encrypted API and ERP communications",
            "Mandatory TOTP authentication",
            "Workspace isolation",
            "Access controls",
            "Restricted service access",
            "Authentication and security logging",
            "Security monitoring",
            "Controlled data retention",
            "Controlled deletion",
            "Backup and recovery procedures",
            "Incident-response procedures",
          ]}
        />
        <p>
          No internet-connected system can guarantee absolute security. Ficungini continuously evaluates and improves its
          security controls.
        </p>
      </>
    ),
  },
  {
    id: "security-incidents",
    title: "Security Incidents",
    body: (
      <>
        <p>
          If Ficungini becomes aware of a security incident involving Customer Content or personal information, we will
          assess and respond to the incident using our applicable incident-response procedures.
        </p>
        <p>
          Where notification is required by applicable law or contract, Ficungini will provide notification in accordance
          with the applicable requirements.
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
          Depending on applicable law and the individual&apos;s circumstances, individuals may have rights concerning their
          personal information, including rights to:
        </p>
        <List
          items={[
            "Request access to personal information",
            "Request correction of inaccurate information",
            "Request deletion",
            "Request restriction of processing",
            "Object to certain processing",
            "Request portability where applicable",
            "Withdraw consent where processing is based on consent",
            "Lodge a complaint with the relevant authority",
          ]}
        />
        <p>
          Where Ficungini processes information on behalf of an organization, the organization may determine the purposes and
          means of processing and may be responsible for responding to certain requests.
        </p>
      </>
    ),
  },
  {
    id: "india-data-protection",
    title: "India Data Protection",
    body: (
      <>
        <p>Ficungini is intended to operate in accordance with applicable Indian data-protection requirements.</p>
        <p>
          Where applicable, Ficungini will process personal data in accordance with the Digital Personal Data Protection Act,
          2023 and applicable rules and regulations.
        </p>
        <p>
          The Digital Personal Data Protection Rules, 2025 were notified by the Ministry of Electronics and Information
          Technology on 13 November 2025 and provide requirements concerning matters including notices, consent, security
          safeguards, and data-principal rights. Their provisions have a phased commencement schedule.
        </p>
        <p>
          The specific allocation of responsibilities between Ficungini and an enterprise customer may depend on whether
          Ficungini is acting as a data fiduciary or processing personal data on behalf of the customer under the applicable
          commercial arrangement.
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
          Ficungini may use infrastructure or service providers located outside the country in which a customer or user is
          located.
        </p>
        <p>Where personal information is transferred internationally, Ficungini will implement safeguards required by applicable law.</p>
        <p>
          Customers requiring specific data-residency or cross-border transfer arrangements may address those requirements
          through their applicable enterprise agreement or Data Processing Agreement.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children's Privacy",
    body: (
      <>
        <p>Ficungini is a business and enterprise-oriented service and is not directed toward children.</p>
        <p>We do not knowingly collect personal information from children where prohibited by applicable law.</p>
      </>
    ),
  },
  {
    id: "third-party-sites",
    title: "Third-Party Websites and Services",
    body: (
      <>
        <p>The Services may contain links or integrations to third-party websites, applications, or services.</p>
        <p>Ficungini is not responsible for the privacy practices of third parties that operate independently from Ficungini.</p>
        <p>Customers should review the applicable third party&apos;s privacy policy before providing information directly to that third party.</p>
      </>
    ),
  },
  {
    id: "marketing",
    title: "Marketing Communications",
    body: (
      <>
        <p>Ficungini may send communications necessary to operate accounts and provide the Services.</p>
        <p>
          Where permitted by applicable law, Ficungini may also send product announcements, service updates, or marketing
          communications. Users may opt out of non-essential marketing communications.
        </p>
        <p>Transactional, security, account, and service-related communications may continue where necessary.</p>
      </>
    ),
  },
  {
    id: "enterprise-customers",
    title: "Enterprise Customers",
    body: (
      <>
        <p>Enterprise customers may have additional contractual protections through agreements such as:</p>
        <List
          items={[
            "Master Services Agreements",
            "Data Processing Agreements",
            "Security Addenda",
            "Enterprise Order Forms",
            "Data-residency agreements",
            "Other written security or privacy agreements",
          ]}
        />
        <p>
          Where an applicable contractual provision specifically addresses the same subject matter and conflicts with this
          Privacy Policy, the applicable contractual provision will govern to the extent permitted by law.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to This Privacy Policy",
    body: (
      <>
        <p>Ficungini may update this Privacy Policy from time to time.</p>
        <p>If material changes are made, Ficungini may provide notice through the Services, email, or another appropriate mechanism.</p>
        <p>The effective date at the beginning of this Privacy Policy indicates when it was most recently revised.</p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact Us",
    body: (
      <>
        <p>
          <strong>Rith</strong>
          <br />
          Operating Ficungini
          <br />
          Registered address to be added
          <br />
          India
        </p>
        <p>
          <strong>Privacy Contact:</strong>{" "}
          <a href="mailto:privacy@ficungini.ai" className="font-medium text-pantone hover:text-pantone-700">
            privacy@ficungini.ai
          </a>
        </p>
      </>
    ),
  },
  {
    id: "related-terms",
    title: "Relationship With Other Terms",
    body: (
      <>
        <p>
          This Privacy Policy should be read together with Ficungini&apos;s Terms of Service, customer agreements, Data
          Processing Agreement, security documentation, and other applicable contractual terms.
        </p>
        <p>Nothing in this Privacy Policy limits any rights or protections that cannot legally be limited under applicable law.</p>
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
        readTime="~12 min read"
        organization={{
          name: "Rith (operating Ficungini)",
          lines: ["Registered address to be added", "India"],
          email: "privacy@ficungini.ai",
        }}
        sections={sections}
      />
    </StaticPageShell>
  );
}
