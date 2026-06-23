"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  ArrowLeft, Calendar, User, Trash2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useDeleteBlog } from "@/hooks/queries/useBlogQueries";
import type { Blog } from "@/types";

export default function ReadAllBlogsDetailsPage({ blog }: { blog: Blog }) {
  const router = useRouter();
  const deleteMutation = useDeleteBlog();

  const handleDelete = async () => {
    if (!confirm("Delete this blog? This action cannot be undone.")) return;
    try {
      await deleteMutation.mutateAsync(blog.id);
      toast.success("Blog deleted successfully");
      router.push("/dashboard/read-blog");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete blog");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 sm:py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/dashboard/read-blog" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blogs
        </Link>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          {blog.coverImage && (
            <div className="relative h-56 w-full">
              <Image src={blog.coverImage} alt={blog.title} fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
            </div>
          )}
          <CardContent className="p-6 space-y-5">
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{blog.title}</h1>
              <div className="flex items-center gap-4 flex-wrap text-xs text-slate-400 dark:text-slate-500">
                {blog.author?.name && (
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {blog.author.name}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <Separator className="dark:bg-slate-800" />

            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {blog.content}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800 border-l-4 border-l-red-500">
          <CardContent className="py-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Delete Blog</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Permanently remove this blog post</p>
              </div>
              <Button variant="destructive" className="gap-2" onClick={handleDelete} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
