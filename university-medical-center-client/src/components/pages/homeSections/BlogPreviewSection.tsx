"use client";

import { Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useBlogs } from "@/hooks/queries/useBlogQueries";

const gradients = [
  "from-[#0b5394] to-[#2196f3]",
  "from-[#1a7a5c] to-[#34d399]",
  "from-[#7c3aed] to-[#a78bfa]",
  "from-[#dc2626] to-[#f87171]",
  "from-[#d97706] to-[#fbbf24]",
  "from-[#0891b2] to-[#67e8f9]",
];

function getGradient(index: number) {
  return gradients[index % gradients.length];
}

interface BlogPreviewSectionProps {
  limit?: number;
  showViewAll?: boolean;
}

export default function BlogPreviewSection({
  limit = 3,
  showViewAll = true,
}: BlogPreviewSectionProps) {
  const { data: blogs = [], isLoading, isError } = useBlogs();
  const displayBlogs = blogs.slice(0, limit);

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-4 mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#0b5394] bg-[#e8f4ff] dark:bg-[#0b5394]/20 dark:text-[#60a5fa] rounded-full px-4 py-1.5">
              Health Blog
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Latest Health Articles
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stay informed with expert health tips, medical insights, and
              wellness advice from our experienced doctors.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="border border-border rounded-2xl overflow-hidden bg-card animate-pulse">
                <div className="h-44 bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || displayBlogs.length === 0) return null;

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-4 mb-14">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#0b5394] bg-[#e8f4ff] dark:bg-[#0b5394]/20 dark:text-[#60a5fa] rounded-full px-4 py-1.5">
            Health Blog
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Latest Health Articles
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay informed with expert health tips, medical insights, and
            wellness advice from our experienced doctors.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayBlogs.map((blog, index) => (
            <div
              key={blog.id}
              className="group border border-border rounded-2xl overflow-hidden bg-card hover:shadow-lg hover:border-[#0b5394]/20 dark:hover:border-[#2196f3]/20 transition-all duration-300"
            >
              {/* Featured Image */}
              <div
                className={`relative h-44 bg-gradient-to-br ${getGradient(index)} overflow-hidden`}
              >
                {blog.coverImage ? (
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : null}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <h3 className="text-base font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-[#0b5394] dark:group-hover:text-[#60a5fa] transition-colors duration-300">
                  {blog.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {blog.content}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                  {blog.author?.name && (
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {blog.author.name}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end pt-3 border-t border-border">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-[#0b5394] dark:text-[#60a5fa] hover:text-[#0b5394] dark:hover:text-[#60a5fa] font-semibold text-xs h-8 px-2"
                  >
                    <Link href={`/blogs/${blog.id}`}>
                      Read More
                      <ArrowRight
                        size={12}
                        className="group-hover:translate-x-0.5 transition-transform duration-300"
                      />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showViewAll && (
          <div className="flex justify-center mt-10">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="gap-2 border-[#0b5394]/30 dark:border-[#2196f3]/30 text-[#0b5394] dark:text-[#60a5fa] hover:bg-[#e8f4ff] dark:hover:bg-[#0b5394]/10 font-semibold rounded-xl px-8"
            >
              <Link href="/blogs">
                View All Blogs
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
