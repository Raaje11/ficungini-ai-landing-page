"use client";

import { useState } from "react";
import { CheckoutModal } from "./Modals";
import { Toast } from "./Toast";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { WhyFicungini } from "./WhyFicungini";
import { Challenges } from "./Challenges";
import { Benchmarks } from "./Benchmarks";
import { Pricing } from "./Pricing";
import { Testimonials } from "./Testimonials";
import { VideoReviews } from "./VideoReviews";
import { Faq } from "./Faq";
import { FinalCta } from "./FinalCta";
import { Footer } from "./Footer";

type ModalState = { tier: string; price: string } | null;

export function Landing() {
  const [checkout, setCheckout] = useState<ModalState>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const openCheckout = (tier: string, price: string) => setCheckout({ tier, price });
  const closeCheckout = () => setCheckout(null);

  const handleCheckoutSubmit = (tier: string) => {
    closeCheckout();
    setToastMessage(`Redirecting to secure gateway for ${tier}...`);
  };

  return (
    <div className="antialiased selection:bg-pantone selection:text-alabaster">
      <Navbar />

      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-1/2 z-50 hidden w-full max-w-6xl -translate-x-1/2 sm:block"
        >
          <div className="absolute inset-y-0 left-0 w-px bg-ink-200" />
          <div className="absolute inset-y-0 right-0 w-px bg-ink-200" />
        </div>

        <main className="flex-1">
          <Hero />

          <WhyFicungini />

          <Challenges />

          <Benchmarks />

          <Testimonials />

          <VideoReviews />

          <Pricing onGetStarted={() => openCheckout("Individual", "₹9,999/mo + GST")} />

          <Faq />

          <FinalCta />
        </main>
      </div>

      <Footer />

      {checkout && (
        <CheckoutModal
          tier={checkout.tier}
          price={checkout.price}
          onClose={closeCheckout}
          onSubmit={() => handleCheckoutSubmit(checkout.tier)}
        />
      )}
      {toastMessage && <Toast message={toastMessage} onDone={() => setToastMessage(null)} />}
    </div>
  );
}
