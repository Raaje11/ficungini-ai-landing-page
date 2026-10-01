"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

const faqs = [
  {
    q: "What is Ficungini?",
    a: "Ficungini is a tender intelligence workspace that helps you decide whether to bid, surface compliance requirements, and organize the evidence needed to build a stronger response.",
  },
  {
    q: "How is pricing calculated?",
    a: "The Individual plan is a fixed monthly subscription with the full platform and monthly usage limits. Business plans are quoted around your team size, workspace needs, and deployment scope.",
  },
  {
    q: "Is my tender data secure?",
    a: "Ficungini applies encryption, access controls, and security monitoring to protect tender information. Your documents and analyses remain scoped to your organization's workspace.",
  },
  {
    q: "Can multiple people collaborate on a bid?",
    a: "Yes. Business workspaces give consultants, reviewers, and sign-off leads a shared source of truth for tender documents, findings, and bid decisions.",
  },
  {
    q: "Does it work for private and public tenders?",
    a: "Yes. Ficungini is designed for RFPs, RFQs, corrigenda, and technical specifications across public procurement and private EPC or OEM bids.",
  },
  {
    q: "What happens after my daily free analysis?",
    a: "You can wait for the next day's complimentary analysis or choose a paid plan to continue reviewing tenders beyond the daily free credit.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section>
      <SectionHeader label="FAQ" index={7} total={7} />

      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink-900 font-sans-title">
            Frequently asked questions.
          </h2>
        </Reveal>

        <div className="mt-10 divide-y divide-ink-200 border-y border-ink-200">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center gap-4 py-6 text-left"
                >
                  <span className="font-mono-code text-sm text-ink-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-lg font-medium text-ink-900 font-sans-title">{f.q}</span>
                  <Plus
                    className={`h-4 w-4 shrink-0 text-ink-500 transition-transform duration-300 ease-in-out ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                  />
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 pl-9 pr-8 text-sm text-ink-600">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-between text-sm">
          <span className="text-ink-500">Still something on your mind?</span>
          <div className="flex items-center gap-6">
            <Link href="/documentation" className="font-medium text-ink-900 hover:text-pantone">
              Read the docs
            </Link>
            <a href="#" className="flex items-center gap-1.5 font-medium text-pantone">
              Talk to sales
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
