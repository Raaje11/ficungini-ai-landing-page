"use client";

import { CloseIcon } from "./Icons";

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Close"
      className="absolute top-5 right-5 text-ink-400 hover:text-ink-600"
    >
      <CloseIcon className="w-6 h-6" />
    </button>
  );
}

export function DemoModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white custom-rounded max-w-md w-full p-6 sm:p-8 relative shadow-2xl border border-ink-200">
        <CloseButton onClick={onClose} />
        <h3 className="text-2xl font-bold text-ink-900 mb-2 font-sans-title">Book a Live Demo</h3>
        <p className="text-sm text-ink-500 mb-6">See how Ficungini handles your complex RFP repositories.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-ink-700 mb-1 font-mono-code">Full Name</label>
            <input
              type="text"
              required
              className="w-full bg-alabaster border border-ink-200 custom-rounded px-3.5 py-2.5 text-sm focus:outline-none focus:border-pantone"
              placeholder="Rahul Mehta"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-700 mb-1 font-mono-code">Work Email</label>
            <input
              type="email"
              required
              className="w-full bg-alabaster border border-ink-200 custom-rounded px-3.5 py-2.5 text-sm focus:outline-none focus:border-pantone"
              placeholder="rahul@consultancy.com"
            />
          </div>
          <button
            type="submit"
            className="w-full claude-bg claude-bg-hover text-alabaster font-medium py-3 custom-rounded transition-colors shadow-md shadow-pantone/20 font-sans-title"
          >
            Confirm Demo Request
          </button>
        </form>
      </div>
    </div>
  );
}

export function CheckoutModal({
  tier,
  price,
  onClose,
  onSubmit,
}: {
  tier: string;
  price: string;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white custom-rounded max-w-md w-full p-6 sm:p-8 relative shadow-2xl border border-ink-200">
        <CloseButton onClick={onClose} />
        <h3 className="text-2xl font-bold text-ink-900 mb-1 font-sans-title">Subscribe to {tier}</h3>
        <p className="text-sm text-ink-500 mb-6">
          Immediate access at <span className="font-semibold text-pantone">{price}</span>.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs font-semibold text-ink-700 mb-1 font-mono-code">Professional Email</label>
            <input
              type="email"
              required
              className="w-full bg-alabaster border border-ink-200 custom-rounded px-3.5 py-2.5 text-sm focus:outline-none focus:border-pantone"
              placeholder="consultant@practice.com"
            />
          </div>
          <button
            type="submit"
            className="w-full claude-bg claude-bg-hover text-alabaster font-medium py-3 custom-rounded transition-colors shadow-md shadow-pantone/20 font-sans-title"
          >
            Proceed to Checkout
          </button>
        </form>
      </div>
    </div>
  );
}
