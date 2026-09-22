"use client";

import { useState } from "react";
import { DemoModal } from "./Modals";
import { Toast } from "./Toast";

export function BookDemoButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      {open && (
        <DemoModal
          onClose={() => setOpen(false)}
          onSubmit={() => {
            setOpen(false);
            setToastMessage("Demo request booked successfully!");
          }}
        />
      )}
      {toastMessage && <Toast message={toastMessage} onDone={() => setToastMessage(null)} />}
    </>
  );
}
