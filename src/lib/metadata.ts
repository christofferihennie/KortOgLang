import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kort og Lang",
  description:
    "Hold oversikt, se statistikk, og kjemp om å være den med de beste kortene!",
  applicationName: "Kort og Lang",
  creator: "Christoffer Hennie",
  robots: {
    index: false,
    follow: false,
    nocache: false,
  },
  appleWebApp: {
    title: "Kort og Lang",
    statusBarStyle: "black-translucent",
    capable: true,
  },

  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};
