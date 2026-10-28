"use client";

import dynamic from "next/dynamic";
import FicoCatAvatar from "./FicoCatAvatar";

// three.js and the canvas load only when a mascot is on screen, and never on the server. Until then the flat cat shows.
const Cat = dynamic(() => import("./FicoCat3D"), { ssr: false, loading: () => <FicoCatAvatar /> });

/** Fico, the 3D cat, in whatever box it is put in. `inverted` is for a coral background. */
export default function FicoMascot({ inverted = false }: { inverted?: boolean }) {
  return <Cat inverted={inverted} />;
}
