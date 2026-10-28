"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { onFicoReplied, onVisitorSpoke } from "@/lib/chat/bridge";

/**
 * Fico as a 3D cat that behaves like one (react-three-fiber, no model files: every part is a primitive).
 *
 * A cat takes no notice of a customer until they speak to it, so she does not follow the pointer, and nothing about
 * the page changes what she does. She has her own day: she sits and breathes, her tail lazes and now and then flicks at
 * its tip, her ears swivel at things nobody else can hear, she blinks slowly, glances off at nothing, yawns, and washes
 * a paw (left one time, right the next).
 *
 * Once the visitor speaks to Fico she stops what she was doing and turns to face them, ears forward, eyes wide, tail
 * up, and gives a slow blink. When Fico's reply lands she meows (the mouth, no sound). A while after the last message she
 * loses interest and goes back to her own business.
 *
 * She wears the site's palette and no other colour: Electric Coral, Alabaster and Matte Black, with every shade a mix of
 * them (read from the page's own CSS variables). `inverted` is the version for a coral background: Alabaster, with the
 * dark outline carrying her. Shapes are toon-outlined (a slightly larger copy drawn inside out behind each part).
 * The canvas is transparent and takes the size of whatever box it is put in.
 */

type Act = "rest" | "groom" | "yawn" | "glance";

/** How long she stays interested after the visitor's last message, in seconds. */
const ATTENTION = 20;

const sphere = new THREE.SphereGeometry(1, 32, 24);
const cone = new THREE.ConeGeometry(1, 1, 20);
const capsule = new THREE.CapsuleGeometry(1, 1, 8, 16);

interface Palette {
  fur: THREE.Material;
  dark: THREE.Material;
  light: THREE.Material;
  ink: THREE.Material;
  inkFlat: THREE.Material;
  eyeWhite: THREE.Material;
  pupil: THREE.Material;
  mouth: THREE.Material;
  tongue: THREE.Material;
}

const PaletteContext = createContext<Palette | null>(null);

/** The page's own colours, from its CSS variables, and the shades of them the cat needs. */
function paletteFor(inverted: boolean): Palette {
  const css = typeof document !== "undefined" ? getComputedStyle(document.documentElement) : null;
  const read = (name: string, fallback: string) => new THREE.Color(css?.getPropertyValue(name).trim() || fallback);
  const coral = read("--pantone", "#ff5c49");
  const alabaster = read("--alabaster", "#faf9f5");
  const black = read("--matte-black", "#17140f");
  const mix = (a: THREE.Color, b: THREE.Color, t: number) => a.clone().lerp(b, t);

  const body = inverted ? alabaster : coral;
  const dark = inverted ? mix(alabaster, coral, 0.3) : mix(coral, black, 0.3);
  const light = inverted ? alabaster : mix(coral, alabaster, 0.8);
  const std = (c: THREE.Color) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.85 });
  return {
    fur: std(body),
    dark: std(dark),
    light: std(light),
    ink: new THREE.MeshBasicMaterial({ color: black, side: THREE.BackSide }),
    inkFlat: new THREE.MeshBasicMaterial({ color: black }),
    eyeWhite: new THREE.MeshBasicMaterial({ color: alabaster }),
    pupil: new THREE.MeshBasicMaterial({ color: mix(black, coral, 0.04) }),
    mouth: new THREE.MeshBasicMaterial({ color: mix(black, coral, 0.2) }),
    tongue: new THREE.MeshBasicMaterial({ color: mix(coral, alabaster, 0.15) }),
  };
}

type V3 = [number, number, number];
type Tone = "fur" | "dark" | "light";

/** A part with its outline: the same shape a little larger, drawn from the inside, behind it. */
function Part({
  geo = sphere,
  tone = "fur",
  position,
  scale,
  rotation,
  outline = 0.06,
  children,
}: {
  geo?: THREE.BufferGeometry;
  tone?: Tone;
  position?: V3;
  scale: V3;
  rotation?: V3;
  outline?: number;
  children?: React.ReactNode;
}) {
  const p = useContext(PaletteContext) as Palette;
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geo} material={p[tone]} scale={scale} />
      {outline > 0 && <mesh geometry={geo} material={p.ink} scale={[scale[0] + outline, scale[1] + outline, scale[2] + outline]} />}
      {children}
    </group>
  );
}

/** One eye: dark ring, white, a pupil that can shift, and the cross of light in it. */
function Eye({ side, pupil, lid }: { side: -1 | 1; pupil: React.RefObject<THREE.Group | null>; lid: React.RefObject<THREE.Group | null> }) {
  const p = useContext(PaletteContext) as Palette;
  return (
    <group position={[side * 0.3, 0.1, 0.55]} ref={lid}>
      <mesh geometry={sphere} material={p.inkFlat} scale={[0.215, 0.235, 0.09]} />
      <mesh geometry={sphere} material={p.eyeWhite} scale={[0.19, 0.21, 0.06]} position={[0, 0, 0.03]} />
      <group ref={pupil} position={[0, 0, 0.1]}>
        <mesh geometry={sphere} material={p.pupil} scale={[0.1, 0.12, 0.05]} />
        <mesh position={[0, 0, 0.055]} rotation={[0, 0, Math.PI / 4]} scale={[0.1, 0.018, 0.01]} material={p.eyeWhite}>
          <boxGeometry />
        </mesh>
        <mesh position={[0, 0, 0.055]} rotation={[0, 0, -Math.PI / 4]} scale={[0.1, 0.018, 0.01]} material={p.eyeWhite}>
          <boxGeometry />
        </mesh>
      </group>
    </group>
  );
}

const TAIL_JOINTS = 9;

/** The tail: a chain of joints, each a child of the one before, so a wave can run down it. */
function Tail({ joints }: { joints: React.RefObject<(THREE.Group | null)[]> }) {
  const build = (i: number): React.ReactNode => {
    const r = 0.13 - i * 0.007;
    return (
      <group
        key={i}
        ref={(g) => {
          joints.current[i] = g;
        }}
      >
        <Part geo={capsule} position={[0, 0.17, 0]} scale={[r, 0.12, r]} outline={0.045} tone={i > TAIL_JOINTS - 3 ? "dark" : "fur"} />
        <group position={[0, 0.3, 0]}>{i < TAIL_JOINTS - 1 ? build(i + 1) : null}</group>
      </group>
    );
  };
  return <group position={[0.78, 0.3, -0.3]}>{build(0)}</group>;
}

/** A front leg: an upper arm and a forearm with a paw, so the paw can be folded up to the face. */
function Leg({
  side,
  shoulder,
  elbow,
}: {
  side: -1 | 1;
  shoulder: React.RefObject<THREE.Group | null>;
  elbow: React.RefObject<THREE.Group | null>;
}) {
  return (
    <group ref={shoulder} position={[side * 0.4, 1.28, 0.5]}>
      <Part geo={capsule} position={[0, -0.28, 0]} scale={[0.17, 0.2, 0.17]} />
      <group ref={elbow} position={[0, -0.56, 0]}>
        <Part geo={capsule} position={[0, -0.24, 0]} scale={[0.155, 0.18, 0.155]} />
        <Part position={[0, -0.5, 0.05]} scale={[0.19, 0.14, 0.24]} tone="light" />
      </group>
    </group>
  );
}

const ease = (cur: number, to: number, dt: number, rate = 4) => cur + (to - cur) * (1 - Math.exp(-rate * dt));
const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Everything she is in the middle of: kept in a ref and stepped every frame, never in React state. */
interface Life {
  act: Act;
  actStart: number;
  actDur: number;
  nextAct: number;
  side: -1 | 1;
  /** where she glances when she glances, as a turn of the head */
  glance: { x: number; y: number };
  /** seconds on the clock until which the visitor has her attention */
  attentionUntil: number;
  /** a meow is under way from this time, for 1.15 s (0 = none) */
  meowAt: number;
  /** the slow blink she gives someone she has decided to trust */
  slowBlinkAt: number;
  /** eased 0..1: how much she is attending to the visitor */
  attend: number;
  nextBlink: number;
  blinkEnd: number;
  nextEarFlick: number;
  earFlickEnd: number;
  earFlickSide: -1 | 1;
  nextTailFlick: number;
  tailFlickEnd: number;
}

const MEOW_S = 1.15;

function Cat({ still, force }: { still: boolean; force?: Act | "attend" | "meow" }) {
  const root = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const earL = useRef<THREE.Group>(null);
  const earR = useRef<THREE.Group>(null);
  const pupilL = useRef<THREE.Group>(null);
  const pupilR = useRef<THREE.Group>(null);
  const lidL = useRef<THREE.Group>(null);
  const lidR = useRef<THREE.Group>(null);
  const browL = useRef<THREE.Group>(null);
  const browR = useRef<THREE.Group>(null);
  const shoulderL = useRef<THREE.Group>(null);
  const shoulderR = useRef<THREE.Group>(null);
  const elbowL = useRef<THREE.Group>(null);
  const elbowR = useRef<THREE.Group>(null);
  const mouthOpen = useRef<THREE.Group>(null);
  const smile = useRef<THREE.Group>(null);
  const tail = useRef<(THREE.Group | null)[]>([]);
  const p = useContext(PaletteContext) as Palette;
  const invalidate = useThree((s) => s.invalidate);
  const clock = useThree((s) => s.clock);

  const life = useRef<Life>({
    act: "rest",
    actStart: 0,
    actDur: 0,
    nextAct: 4,
    side: 1,
    glance: { x: 0, y: 0 },
    attentionUntil: 0,
    meowAt: 0,
    slowBlinkAt: 0,
    attend: 0,
    nextBlink: 1.5,
    blinkEnd: 0,
    nextEarFlick: 2.5,
    earFlickEnd: 0,
    earFlickSide: 1,
    nextTailFlick: 3,
    tailFlickEnd: 0,
  });

  // She takes notice of the visitor only when they speak to her, and meows when Fico answers.
  useEffect(() => {
    if (still) {
      invalidate();
      return;
    }
    const stopSpoke = onVisitorSpoke(() => {
      const l = life.current;
      const wasAway = clock.elapsedTime > l.attentionUntil;
      l.attentionUntil = clock.elapsedTime + ATTENTION;
      if (wasAway) l.slowBlinkAt = clock.elapsedTime + 1.2;
    });
    const stopReplied = onFicoReplied(() => {
      const l = life.current;
      l.attentionUntil = Math.max(l.attentionUntil, clock.elapsedTime + ATTENTION);
      l.meowAt = clock.elapsedTime + 0.15;
    });
    return () => {
      stopSpoke();
      stopReplied();
    };
  }, [clock, invalidate, still]);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const t = state.clock.elapsedTime;
    const l = life.current;

    // For looking at one thing at a time (a preview page): hold her in it.
    if (force === "attend") l.attentionUntil = Infinity;
    if (force === "meow" && t > l.meowAt + MEOW_S + 0.8) l.meowAt = t;
    if (force && force !== "attend" && force !== "meow" && l.act !== force) {
      l.act = force;
      l.actStart = t;
      l.actDur = Infinity;
    }

    const attending = !still && t < l.attentionUntil;
    l.attend = ease(l.attend, attending ? 1 : 0, dt, 3.5);
    const e = l.attend;

    // Her own day: after a while of sitting she does something. Never while the visitor has her attention.
    if (!still && !force && !attending) {
      if (l.act === "rest" && t > l.nextAct) {
        const roll = Math.random();
        l.act = roll < 0.4 ? "groom" : roll < 0.65 ? "yawn" : "glance";
        l.actStart = t;
        l.actDur = l.act === "groom" ? 4.6 + Math.random() * 1.6 : l.act === "yawn" ? 3 : 2 + Math.random();
        if (l.act === "groom") l.side = (l.side === 1 ? -1 : 1) as -1 | 1;
        if (l.act === "glance") l.glance = { x: (Math.random() < 0.5 ? -1 : 1) * (0.35 + Math.random() * 0.4), y: Math.random() * 0.4 - 0.1 };
      } else if (l.act !== "rest" && t > l.actStart + l.actDur) {
        l.act = "rest";
        l.nextAct = t + 6 + Math.random() * 7;
      }
    } else if (attending && l.act !== "rest" && !force) {
      l.act = "rest";
      l.nextAct = t + ATTENTION + 4;
    }

    // How far into the current thing she is, 0..1.
    const p01 = Number.isFinite(l.actDur) ? clamp01((t - l.actStart) / l.actDur) : 0.5;
    const hold = (a: Act) => (l.act === a ? 1 : 0);
    const bell = (x: number) => Math.sin(Math.PI * clamp01(x)); // 0 -> 1 -> 0
    const raise = smooth(clamp01(Math.min(p01 / 0.15, (1 - p01) / 0.15, 1)));
    const groom = Number.isFinite(l.actDur) ? hold("groom") * raise : hold("groom");
    const yawnP = hold("yawn") ? (Number.isFinite(l.actDur) ? p01 : ((t - l.actStart) % 3.2) / 3.2) : 0;
    const yawn = hold("yawn") ? Math.pow(bell(yawnP), 0.55) : 0;
    const glance = hold("glance") ? smooth(bell(p01 * 1.15)) : 0;

    // Meow: the mouth opens and closes twice, head lifts.
    const meowT = t - l.meowAt;
    const meowing = l.meowAt > 0 && meowT >= 0 && meowT < MEOW_S;
    const meow = meowing ? Math.max(0, Math.sin((meowT / MEOW_S) * Math.PI * 2)) * Math.sin((meowT / MEOW_S) * Math.PI) ** 0.4 : 0;

    // Body: faces the visitor when she attends, 3/4 view otherwise.
    if (root.current) root.current.rotation.y = 0.28 * (1 - e) + 0.04 * e;
    const breath = still ? 0 : Math.sin(t * 1.7) * 0.014;
    if (torso.current) torso.current.scale.set(1 + breath * 0.5 + yawn * 0.03, 1 + breath + yawn * 0.04, 1 + breath * 0.5);

    // Head.
    const lick = Math.sin(t * 9.5) * 0.045 * groom;
    if (head.current) {
      head.current.rotation.y = glance * l.glance.x - 0.28 * e + l.side * 0.3 * groom;
      head.current.rotation.x = glance * -l.glance.y * 0.4 + 0.6 * groom + lick - 0.4 * yawn - 0.18 * meow - 0.04 * e;
      head.current.rotation.z = -l.side * 0.08 * groom + glance * l.glance.x * 0.12;
      head.current.position.y = 2.02 - 0.18 * groom - 0.04 * yawn;
      head.current.position.z = 0.15 + 0.15 * groom;
    }

    // Eyes: slow blinks and blinks; wide when she attends, shut in a yawn, narrowed while washing.
    if (!still && t > l.nextBlink) {
      l.blinkEnd = t + 0.14;
      l.nextBlink = t + 2.6 + Math.random() * 4;
    }
    const slowT = t - l.slowBlinkAt;
    const slow = l.slowBlinkAt > 0 && slowT >= 0 && slowT < 0.9 ? Math.sin((slowT / 0.9) * Math.PI) : 0;
    const blinking = t < l.blinkEnd;
    const lid = Math.max(0.06, (blinking ? 0.08 : 1 + 0.1 * e) - 0.55 * groom - 0.92 * yawn - 0.94 * slow);
    for (const x of [lidL.current, lidR.current]) x?.scale.set(1, lid, 1);
    const gx = glance * l.glance.x * 0.5;
    for (const x of [pupilL.current, pupilR.current]) x?.position.set(gx * 0.07, glance * l.glance.y * 0.05, 0.1);

    // Brows: up when she attends, relaxed in a wash.
    const brow = 0.05 * e - 0.03 * groom + 0.03 * yawn;
    if (browL.current) browL.current.position.y = 0.36 + brow;
    if (browR.current) browR.current.position.y = 0.36 + brow;

    // Mouth: open in a yawn and in a meow; the smile goes while it is open.
    const open = Math.max(yawn, meow * 0.75);
    if (mouthOpen.current) {
      mouthOpen.current.scale.set(1 + open * 0.3, Math.max(0.001, open), 1);
      mouthOpen.current.visible = open > 0.02;
    }
    if (smile.current) smile.current.visible = open <= 0.02;

    // Ears: she swivels one at a sound nobody else heard; both go forward when she attends and back in a yawn.
    if (!still && !attending && t > l.nextEarFlick) {
      l.earFlickEnd = t + 0.34;
      l.earFlickSide = Math.random() < 0.5 ? -1 : 1;
      l.nextEarFlick = t + 3 + Math.random() * 6;
    }
    const tw = t < l.earFlickEnd ? Math.sin(((l.earFlickEnd - t) / 0.34) * Math.PI * 3) * 0.3 : 0;
    const earBack = 0.14 * yawn + 0.1 * groom;
    if (earL.current) {
      earL.current.rotation.z = 0.38 - 0.1 * e + (l.earFlickSide === -1 ? tw : 0) - earBack;
      earL.current.rotation.x = 0.18 * e;
    }
    if (earR.current) {
      earR.current.rotation.z = -0.38 + 0.1 * e + (l.earFlickSide === 1 ? tw : 0) + earBack;
      earR.current.rotation.x = 0.18 * e;
    }

    // Legs: the paw she washes with comes up, folds at the elbow to her mouth, and rubs a little.
    const rub = Math.sin(t * 9.5) * 0.1 * groom;
    const legs: [THREE.Group | null, THREE.Group | null, -1 | 1][] = [
      [shoulderL.current, elbowL.current, -1],
      [shoulderR.current, elbowR.current, 1],
    ];
    for (const [shoulder, elbow, side] of legs) {
      if (!shoulder || !elbow) continue;
      const up = side === l.side ? groom : 0;
      shoulder.rotation.x = -1.0 * up;
      shoulder.rotation.z = -side * 0.4 * up;
      elbow.rotation.x = -2.15 * up + rub * (up > 0 ? 1 : 0);
    }

    // Tail: lazy while she sits, a quick flick at its tip now and then, and up when she attends.
    if (!still && t > l.nextTailFlick) {
      l.tailFlickEnd = t + 0.7;
      l.nextTailFlick = t + 4 + Math.random() * 6;
    }
    const flick = t < l.tailFlickEnd ? Math.sin(((l.tailFlickEnd - t) / 0.7) * Math.PI * 4) * 0.5 * bell((l.tailFlickEnd - t) / 0.7) : 0;
    const calm = 1 - 0.7 * groom - 0.7 * yawn;
    const speed = 1.1 + 1.2 * e;
    const amp = (0.09 + 0.07 * e) * calm;
    tail.current.forEach((joint, i) => {
      if (!joint) return;
      const wave = still ? 0 : Math.sin(t * speed - i * 0.5) * amp * (0.45 + i * 0.12);
      const tip = i >= TAIL_JOINTS - 4 ? flick * ((i - (TAIL_JOINTS - 5)) / 4) : 0;
      // Curled up and out to one side; raised straighter when she attends.
      joint.rotation.z = (i === 0 ? -1.2 + 0.6 * e : 0.27 - 0.08 * e) + wave + tip;
      joint.rotation.x = 0;
    });
  });

  return (
    <group ref={root} position={[0, -1.15, 0]}>
      {/* haunches and hind paws */}
      <Part position={[-0.62, 0.45, -0.05]} scale={[0.44, 0.5, 0.62]} />
      <Part position={[0.62, 0.45, -0.05]} scale={[0.44, 0.5, 0.62]} />
      <Part position={[-0.62, 0.1, 0.48]} scale={[0.3, 0.14, 0.42]} tone="light" />
      <Part position={[0.62, 0.1, 0.48]} scale={[0.3, 0.14, 0.42]} tone="light" />

      {/* body and belly */}
      <group ref={torso} position={[0, 0.95, 0]}>
        <Part scale={[0.88, 0.98, 0.82]} />
        <Part position={[0, -0.05, 0.62]} scale={[0.5, 0.62, 0.3]} tone="light" outline={0} />
      </group>

      <Tail joints={tail} />

      <Leg side={-1} shoulder={shoulderL} elbow={elbowL} />
      <Leg side={1} shoulder={shoulderR} elbow={elbowR} />

      {/* head */}
      <group ref={head} position={[0, 2.02, 0.15]}>
        <Part scale={[0.8, 0.69, 0.72]} />
        <Part position={[-0.74, -0.12, 0.1]} scale={[0.2, 0.14, 0.2]} rotation={[0, 0, 0.5]} />
        <Part position={[0.74, -0.12, 0.1]} scale={[0.2, 0.14, 0.2]} rotation={[0, 0, -0.5]} />
        {/* ears */}
        <group ref={earL} position={[-0.5, 0.55, 0]} rotation={[0, 0, 0.38]}>
          <Part geo={cone} position={[0, 0.22, 0]} scale={[0.32, 0.6, 0.2]} />
          <mesh geometry={cone} material={p.light} position={[0, 0.2, 0.06]} scale={[0.19, 0.4, 0.1]} />
        </group>
        <group ref={earR} position={[0.5, 0.55, 0]} rotation={[0, 0, -0.38]}>
          <Part geo={cone} position={[0, 0.22, 0]} scale={[0.32, 0.6, 0.2]} />
          <mesh geometry={cone} material={p.light} position={[0, 0.2, 0.06]} scale={[0.19, 0.4, 0.1]} />
        </group>
        {/* face */}
        <Eye side={-1} pupil={pupilL} lid={lidL} />
        <Eye side={1} pupil={pupilR} lid={lidR} />
        <group ref={browL} position={[-0.3, 0.36, 0.5]} rotation={[0, 0, -0.28]}>
          <mesh geometry={sphere} material={p.inkFlat} scale={[0.19, 0.04, 0.05]} />
        </group>
        <group ref={browR} position={[0.3, 0.36, 0.5]} rotation={[0, 0, 0.28]}>
          <mesh geometry={sphere} material={p.inkFlat} scale={[0.19, 0.04, 0.05]} />
        </group>
        <mesh geometry={sphere} material={p.inkFlat} position={[0, -0.1, 0.66]} scale={[0.07, 0.05, 0.05]} />
        <group ref={smile}>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.065, -0.2, 0.64]} rotation={[0, 0, Math.PI]} material={p.inkFlat}>
              <torusGeometry args={[0.065, 0.014, 8, 20, Math.PI]} />
            </mesh>
          ))}
        </group>
        {/* the open mouth, for a yawn or a meow: dark, with a tongue */}
        <group ref={mouthOpen} position={[0, -0.27, 0.6]} visible={false}>
          <mesh geometry={sphere} material={p.mouth} scale={[0.12, 0.12, 0.07]} />
          <mesh geometry={sphere} material={p.tongue} position={[0, -0.05, 0.02]} scale={[0.075, 0.05, 0.05]} />
        </group>
        {/* whiskers */}
        {[-1, 1].flatMap((s) =>
          [0.06, -0.02, -0.1].map((y, i) => (
            <mesh key={`${s}${i}`} position={[s * 0.78, y - 0.05, 0.42]} rotation={[0, 0, s * (Math.PI / 2 + (i - 1) * 0.16)]} material={p.inkFlat}>
              <cylinderGeometry args={[0.008, 0.008, 0.46, 6]} />
            </mesh>
          )),
        )}
      </group>
    </group>
  );
}

/**
 * The cat in a transparent canvas. `inverted` is the version for a coral background, `still` freezes her (reduced
 * motion, or a tiny avatar). She stops drawing while she is off screen or the tab is hidden. `force` holds her in one
 * thing (for a preview).
 */
export default function FicoCat3D({
  inverted = false,
  still = false,
  force,
  className = "h-full w-full",
}: {
  inverted?: boolean;
  still?: boolean;
  force?: Act | "attend" | "meow";
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [reduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const palette = useMemo(() => paletteFor(inverted), [inverted]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let onScreen = true;
    const apply = () => setVisible(onScreen && !document.hidden);
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      apply();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", apply);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", apply);
    };
  }, []);

  const frozen = still || reduced;
  return (
    <div ref={box} className={className} aria-hidden style={{ pointerEvents: "none" }}>
      <Canvas
        dpr={[1, 2]}
        frameloop={!visible ? "never" : frozen ? "demand" : "always"}
        camera={{ position: [0, 0.9, 9.8], fov: 27, near: 0.1, far: 50 }}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ camera }) => camera.lookAt(0, 0.8, 0)}
        style={{ background: "transparent" }}
      >
        <hemisphereLight args={["#ffffff", "#ffd9d3", 1.35]} />
        <directionalLight position={[2.5, 4, 5]} intensity={1.6} />
        <directionalLight position={[-3, 1.5, -2]} intensity={0.5} color="#ffd9d3" />
        <PaletteContext.Provider value={palette}>
          <Cat still={frozen} force={force} />
        </PaletteContext.Provider>
      </Canvas>
    </div>
  );
}
