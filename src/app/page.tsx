import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: `${SITE.name} — Free Casual Mobile Games`,
  description:
    "Discover and play the best free casual mobile games. Browse our curated collection of puzzle, simulation, racing, arcade, and adventure games. Watch gameplay videos and find your next favorite game.",
  alternates: {
    canonical: SITE.url,
  },
};

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
    </div>
  );
}
