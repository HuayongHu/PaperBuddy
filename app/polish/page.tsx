import type { Metadata } from "next";

import { PolishPage } from "@/components/polish/PolishPage";
import { polishPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = polishPageMetadata;

export default function Page() {
  return <PolishPage />;
}
