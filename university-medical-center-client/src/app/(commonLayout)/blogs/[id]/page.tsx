import type { Metadata } from "next";
import { getBlogById } from "@/services";
import BlogDetailPage from "@/components/pages/homeSections/BlogDetailPage";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await getBlogById(id);
  return {
    title: result.data
      ? `${result.data.title} | UMC, JSTU`
      : "Blog | UMC, JSTU",
  };
}

export default async function BlogDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getBlogById(id);

  if (!result.data) {
    return notFound();
  }

  return <BlogDetailPage blog={result.data} />;
}
