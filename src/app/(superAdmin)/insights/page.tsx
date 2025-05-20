import type { Metadata } from "next";
import InsightsDashboardClient from "./client-page";

export const metadata: Metadata = {
  title: "Bizcotap Insights Dashboard",
  description: "Analyze your digital business card performance and lead generation",
};

export default function InsightsDashboard() {
  return <InsightsDashboardClient />;
}