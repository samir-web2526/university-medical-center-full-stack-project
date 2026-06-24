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

  if (isError || displayBlogs.length === 0) {
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
          </div>

          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 rounded-full bg-[#e8f4ff] dark:bg-[#0b5394]/20 flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#0b5394] dark:text-[#60a5fa]"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                <path d="m15 5 3 3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Blogs Yet
            </h3>
            <p className="text-muted-foreground max-w-sm">
              We haven&apos;t published any health articles yet. Check back soon
              for updates, tips, and wellness advice from our medical team.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes btnFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .blog-fade { animation: fadeUp 0.6s ease-out both; }
        .blog-card {
          animation: fadeUp 0.6s ease-out forwards;
        }
        .blog-card-inner {
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
          border: 1px solid var(--border);
          border-radius: 1rem;
          overflow: hidden;
          background: var(--card);
        }
        .blog-card-inner:hover {
          animation: floatUp 2s ease-in-out infinite;
          box-shadow: 0 8px 25px rgba(11, 83, 148, 0.12);
          border-color: rgba(11, 83, 148, 0.2);
        }
        .btn-float {
          position: relative;
          overflow: hidden;
          animation: btnFloat 2s ease-in-out infinite;
          transition: box-shadow 0.3s ease;
          box-shadow: 0 4px 15px rgba(11, 83, 148, 0.15);
          z-index: 1;
        }
        .btn-float::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #0b5394, #0891b2, #2196f3);
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
          z-index: -1;
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .btn-float:hover::before {
          transform: scaleX(1);
        }
        .btn-float:hover {
          color: white;
          box-shadow: 0 10px 35px rgba(11, 83, 148, 0.5);
        }
        .btn-float:active {
          transform: translateY(0);
          animation: none;
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-4 mb-14 blog-fade">
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
              className="blog-card group cursor-default"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="blog-card-inner h-full flex flex-col">
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
                <div className="p-5 space-y-3 flex-1 flex flex-col">
                  <h3 className="text-base font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-[#0b5394] dark:group-hover:text-[#60a5fa] transition-colors duration-300">
                    {blog.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
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
            </div>
          ))}
        </div>

        {showViewAll && (
          <div className="flex justify-center mt-10 blog-fade" style={{ animationDelay: "0.4s" }}>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="btn-float gap-2 border-[#0b5394]/30 dark:border-[#2196f3]/30 text-[#0b5394] dark:text-[#60a5fa] hover:bg-[#e8f4ff] dark:hover:bg-[#0b5394]/10 font-semibold rounded-xl px-8"
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
