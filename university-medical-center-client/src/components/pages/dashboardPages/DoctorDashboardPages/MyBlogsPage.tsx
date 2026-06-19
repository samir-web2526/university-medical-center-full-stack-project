"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Eye,
  Plus,
  Calendar,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { getMyBlogs } from "@/services/blog.service";
import type { Blog } from "@/types";

export default function MyBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    getMyBlogs().then((res) => {
      if (cancelled) return;
      if (res.data) {
        setBlogs(res.data);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = blogs.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.content.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 transition-colors">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="rounded-2xl bg-linear-to-r from-emerald-600 via-teal-500 to-cyan-500 p-6 shadow-lg shadow-emerald-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">My Blogs</h1>
                <p className="text-emerald-100 text-sm">
                  {blogs.length} blog{blogs.length !== 1 ? "s" : ""} published
                </p>
              </div>
            </div>
            <Link href="/dashboard/write-blog">
              <Button className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border-0 gap-2 rounded-xl">
                <Plus className="w-4 h-4" />
                Write Blog
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-50 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <Input
              placeholder="Search blogs by title or content..."
              className="pl-9 h-11 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 focus-visible:ring-emerald-500 bg-white rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border-0 shadow-md dark:bg-slate-900 dark:border dark:border-slate-800">
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4 dark:bg-slate-800" />
                  <Skeleton className="h-4 w-full dark:bg-slate-800" />
                  <Skeleton className="h-4 w-2/3 dark:bg-slate-800" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-20 dark:bg-slate-800 rounded-lg" />
                    <Skeleton className="h-6 w-24 dark:bg-slate-800 rounded-lg" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border-0 shadow-md dark:bg-slate-900 dark:border dark:border-slate-800">
            <CardContent className="py-20 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 dark:from-emerald-500/10 dark:to-teal-500/10 flex items-center justify-center">
                  <BookOpen className="w-8 h-8 text-emerald-400 dark:text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    No blogs found
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {search ? "Try a different search term" : "Start writing your first blog"}
                  </p>
                </div>
                {!search && (
                  <Link href="/dashboard/write-blog">
                    <Button className="bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white gap-2 rounded-xl">
                      <Plus className="w-4 h-4" />
                      Write Your First Blog
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((blog) => (
              <Card
                key={blog.id}
                className="border-0 shadow-md hover:shadow-lg dark:bg-slate-900 dark:border dark:border-slate-800 transition-all group"
              >
                <CardContent className="p-5 space-y-3">
                  {blog.coverImage && (
                    <div className="rounded-xl overflow-hidden mb-3 border border-slate-100 dark:border-slate-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-40 object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">
                    {blog.content}
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <Badge
                      variant="outline"
                      className="text-xs bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 gap-1"
                    >
                      <Calendar className="w-3 h-3" />
                      Published{" "}
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1.5 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl flex-1"
                      asChild
                    >
                      <Link href={`/dashboard/my-blogs/${blog.id}`}>
                        <Eye className="w-3.5 h-3.5" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
