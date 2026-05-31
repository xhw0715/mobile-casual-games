export const SITE = {
  name: "Casual Games",
  url: "https://mobilecasualgames.com",
  description:
    "Discover new casual games, meet friendly players, and share your best gaming moments in a cozy environment.",
  ogImage: "/og-image.png",
  locale: "en_US",
} as const;

export function siteTitle(pageTitle?: string): string {
  return pageTitle ? `${pageTitle} | ${SITE.name}` : SITE.name;
}
