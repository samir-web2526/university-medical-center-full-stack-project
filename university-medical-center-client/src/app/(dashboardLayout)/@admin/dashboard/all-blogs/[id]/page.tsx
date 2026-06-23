import type { Metadata } from "next";
import ReadAllBlogsDetailsPage from "@/components/pages/dashboardPages/AdminDashboardPages/ReadAllBlogsDetailsPage";
import { getBlogById } from "@/services";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog Details | UMC, JSTU",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getBlogById(id);

  if (!result.data) {
    return notFound();
  }

  return (
    <div>
      <ReadAllBlogsDetailsPage blog={result.data} />
    </div>
  );
}
