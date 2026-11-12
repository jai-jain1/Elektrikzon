import Image from "next/image";
import type { Shot } from "@/data/shots";

interface Props {
  shot: Shot;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/** A rendered image from public/shots, filling its (relative) parent. */
export function ShotImage({ shot, sizes, priority, className = "" }: Props) {
  return <Image src={shot.src} alt={shot.alt} fill sizes={sizes} priority={priority} quality={82} className={`object-cover ${className}`} />;
}
