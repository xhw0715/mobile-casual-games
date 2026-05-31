import type { Metadata } from "next";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Discover Games",
  description:
    "Browse our curated collection of casual mobile games. Filter by genre — puzzle, simulation, racing, arcade, and more. Find your next favorite casual game.",
  openGraph: {
    title: "Discover Games",
    description:
      "Browse our curated collection of casual mobile games. Filter by genre — puzzle, simulation, racing, arcade, and more.",
    url: `${SITE.url}/discover`,
  },
  alternates: {
    canonical: `${SITE.url}/discover`,
  },
};

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
