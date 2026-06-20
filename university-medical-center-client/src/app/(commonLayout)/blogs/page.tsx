import type { Metadata } from "next";
import BlogPreviewSection from "@/components/pages/homeSections/BlogPreviewSection";

export const metadata: Metadata = {
  title: "Blogs | UMC, JSTU",
  description:
    "Read the latest health articles and updates from UMC, JSTU.",
};

export default function Blogs() {
  return <BlogPreviewSection limit={100} showViewAll={false} />;
}
