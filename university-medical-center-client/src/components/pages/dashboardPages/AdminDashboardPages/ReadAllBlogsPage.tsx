"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import {
  BookOpen, Search, ChevronLeft, ChevronRight, Eye, Trash2, Calendar, User,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useBlogs, useDeleteBlog } from "@/hooks/queries/useBlogQueries";

export default function ReadAllBlogsPage() {
  const [search, setSearch] = useState("");
  const { data: blogs = [], isLoading } = useBlogs();
  const deleteMutation = useDeleteBlog();

  const filtered = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.content.toLowerCase().includes(search.toLowerCase()) ||
      (b.author?.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This action cannot be undone.`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Blog deleted successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete blog");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 sm:py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              All Blogs
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 ml-11">{blogs.length} blog{blogs.length !== 1 ? "s" : ""} total</p>
          </div>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <Input
            placeholder="Search by title, content or author…"
            className="pl-9 h-10 border-slate-200 dark:border-slate-700 focus-visible:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                  {["Title", "Author", "Created", "Action"].map((h, i) => (
                    <TableHead key={h} className={`text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold ${i === 0 ? "pl-6" : ""} ${i === 3 ? "pr-6 text-right" : ""}`}>{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 4 }).map((_, j) => (
                        <TableCell key={j} className={j === 0 ? "pl-6" : ""}>
                          <Skeleton className="h-4 w-full max-w-30" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
                        <BookOpen className="w-8 h-8" />
                        <p className="text-sm font-medium">No blogs found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((blog) => (
                    <TableRow key={blog.id} className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors border-b border-slate-50 dark:border-slate-800">
                      <TableCell className="pl-6">
                        <Link href={`/dashboard/read-blog/${blog.id}`} className="flex items-center gap-3 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg p-1 -m-1 transition-colors">
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                            <span className="text-xs font-bold text-white">{blog.title.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 dark:text-slate-100 text-sm hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1">{blog.title}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1">{blog.content}</p>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                          <User className="w-3 h-3" />
                          {blog.author?.name ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3 h-3" />
                          {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/dashboard/read-blog/${blog.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(blog.id, blog.title)}
                            disabled={deleteMutation.isPending}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
