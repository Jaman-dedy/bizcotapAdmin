import { Metadata } from "next";

type MetaOptions = {
  title: string;
  description: string;
  noIndex?: boolean; // Optional parameter for private pages
};

export const generateMetadata = ({
  title,
  description,
  noIndex = false,
}: MetaOptions): Metadata => ({
  title: `${title} | Bizcotap Dashboard`,
  description,
  robots: noIndex ? "noindex, nofollow" : "index, follow",
});