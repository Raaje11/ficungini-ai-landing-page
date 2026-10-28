"use client";

import { useEffect, useRef } from "react";
import { onOrbLook } from "@/lib/chat/bridge";

/**
 * Fico as a small 3D sphere whose eyes follow the pointer. Shading is a layered radial gradient
 * with a highlight that slides the opposite way to the eyes, and the eyes sit on a plane that
 * turns with perspective, so they foreshorten as they look to the side, like they are on a ball.
 * They blink now and then, widen when the launcher is hovered, and squint when it is pressed.
 * Nothing here is a canvas or an image, and the loop only runs while something is moving.
 *
 * It fills whatever box it is put in, at any size: every length is a share of its own width
 * (container query units), so the launcher, the chat header and the small avatar beside each
 * message are the same sphere at different sizes.
 *
 * Over a coral section the sphere is Alabaster with coral eyes, the same inversion the launcher had.
 * `lively={false}` keeps the eyes following the pointer but stops the bobbing, blinking and
 * wandering, for the many small avatars in a conversation.
 */
export default function FicoOrb({ inverted = false, lively = true }: { inverted?: boolean; lively?: boolean }) {
  const root = useRef<HTMLSpanElement>(null);
  const eyes = useRef<HTMLSpanElement>(null);
  const shine = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const orb = root.current;
    const face = eyes.current;
    const glint = shine.current;
    if (!orb || !face || !glint) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = { x: 0, y: 0 };
    const now = { x: 0, y: 0 };
    let frame = 0;
    let lastMove = 0;

    const render = () => {
      frame = 0;
      now.x += (target.x - now.x) * 0.2;
      now.y += (target.y - now.y) * 0.2;
      // How far the eyes travel is a share of the sphere's size, so a small one moves a little and a large one a lot.
      const k = orb.offsetWidth / 64;
      // The eyes slide and turn toward what they look at; the highlight moves the other way, as light on a ball would.
      face.style.transform = `translate3d(${now.x * 9 * k}px, ${now.y * 8 * k}px, 0) rotateY(${now.x * 28}deg) rotateX(${-now.y * 22}deg)`;
      glint.style.transform = `translate3d(${-now.x * 4 * k}px, ${-now.y * 4 * k}px, 0)`;
      if (Math.abs(target.x - now.x) > 0.002 || Math.abs(target.y - now.y) > 0.002) frame = requestAnimationFrame(render);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const lookAt = (x: number, y: number) => {
      const r = orb.getBoundingClientRect();
      const dx = x - (r.left + r.width / 2);
      const dy = y - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      // Far away they look in that direction; close by they look at the pointer itself.
      const reach = Math.min(1, dist / 260);
      target.x = dist ? (dx / dist) * reach : 0;
      target.y = dist ? (dy / dist) * reach : 0;
      schedule();
    };

    const onMove = (e: PointerEvent) => {
      lastMove = Date.now();
      lookAt(e.clientX, e.clientY);
    };
    const onLeave = (e: MouseEvent) => {
      if (e.relatedTarget === null) {
        target.x = 0;
        target.y = 0;
        schedule();
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseout", onLeave);
    // Fico can be told where to look (at what she is pointing out) without a pointer being there.
    const stopLooking = onOrbLook((x, y) => {
      lastMove = Date.now();
      lookAt(x, y);
    });

    // Blink every few seconds, and look around a little when nobody is moving a pointer (a phone, or a still desk).
    const timers: number[] = [];
    if (lively && !reduced) {
      const blink = () => {
        face.style.setProperty("--lid", "0.08");
        timers.push(window.setTimeout(() => face.style.setProperty("--lid", "1"), 140));
        timers.push(window.setTimeout(blink, 2600 + Math.random() * 3800));
      };
      timers.push(window.setTimeout(blink, 1800));
      const wander = () => {
        if (Date.now() - lastMove > 3500) {
          target.x = (Math.random() - 0.5) * 1.1;
          target.y = (Math.random() - 0.5) * 0.8;
          schedule();
        }
        timers.push(window.setTimeout(wander, 2400 + Math.random() * 2600));
      };
      timers.push(window.setTimeout(wander, 3000));
    }

    return () => {
      stopLooking();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseout", onLeave);
      timers.forEach((t) => window.clearTimeout(t));
      if (frame) cancelAnimationFrame(frame);
    };
  }, [lively]);

  // Lengths below are in cqw: a share of the sphere's own width. 1cqw here is 1/100 of it (a 64px sphere is 0.64px per cqw).
  return (
    <span
      ref={root}
      aria-hidden
      className={`${lively ? "orb-float " : ""}relative block h-full w-full rounded-full`}
      style={{ containerType: "inline-size" }}
    >
      {/* Two spheres, so the swap to an Alabaster one over coral sections fades rather than snaps. */}
      <span
        className={`absolute inset-0 rounded-full transition-opacity duration-300 ${inverted ? "opacity-0" : "opacity-100"}`}
        style={{
          // The site's Electric Coral, lit from the top left: a lighter tint of it to the coral itself to its darker shade. No new colours.
          background:
            "radial-gradient(circle at 34% 26%, color-mix(in srgb, var(--pantone) 68%, var(--alabaster)) 0%, var(--pantone) 48%, var(--pantone-deep) 100%)",
          boxShadow:
            "0 12.5cqw 31cqw color-mix(in srgb, var(--pantone) 34%, transparent), inset -7.8cqw -10.9cqw 18.7cqw color-mix(in srgb, var(--pantone-deep) 55%, transparent), inset 4.7cqw 6.2cqw 12.5cqw color-mix(in srgb, var(--alabaster) 20%, transparent)",
        }}
      />
      <span
        className={`absolute inset-0 rounded-full transition-opacity duration-300 ${inverted ? "opacity-100" : "opacity-0"}`}
        style={{
          background: "radial-gradient(circle at 34% 26%, var(--alabaster) 0%, var(--alabaster) 40%, var(--pantone-pale) 100%)",
          boxShadow:
            "0 12.5cqw 31cqw color-mix(in srgb, var(--pantone-deep) 30%, transparent), inset -7.8cqw -10.9cqw 18.7cqw color-mix(in srgb, var(--pantone) 22%, transparent), inset 4.7cqw 6.2cqw 12.5cqw color-mix(in srgb, var(--alabaster) 90%, transparent)",
        }}
      />
      {/* The highlight. */}
      <span
        ref={shine}
        className="absolute left-[18%] top-[12%] block h-[26%] w-[34%] rounded-full bg-alabaster/45"
        style={{ willChange: "transform", filter: "blur(4.7cqw)" }}
      />
      {/* The face: a plane in front of the ball that turns toward whatever it looks at. */}
      <span className="absolute inset-0 flex items-center justify-center" style={{ perspective: "203cqw" }}>
        <span
          ref={eyes}
          className="flex items-center transition-[scale] duration-200 group-hover:scale-110 group-active:scale-y-75"
          style={{ gap: "10.9cqw", transformStyle: "preserve-3d", willChange: "transform", ["--lid" as string]: "1" }}
        >
          <Eye inverted={inverted} />
          <Eye inverted={inverted} />
        </span>
      </span>
    </span>
  );
}

function Eye({ inverted }: { inverted: boolean }) {
  return (
    <span
      className={`block rounded-full transition-[transform,background-color] duration-[120ms] ease-out ${inverted ? "bg-pantone" : "bg-alabaster"}`}
      style={{
        width: "12.5cqw",
        height: "23.4cqw",
        transform: "scaleY(var(--lid, 1))",
        boxShadow: inverted
          ? "0 0 9.4cqw color-mix(in srgb, var(--pantone) 35%, transparent)"
          : "0 0 10.9cqw color-mix(in srgb, var(--alabaster) 55%, transparent)",
      }}
    />
  );
}
