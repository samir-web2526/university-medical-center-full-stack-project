import { getBlogById } from "@/services";
import BlogDetailPage from "@/components/pages/homeSections/BlogDetailPage";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

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
