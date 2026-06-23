"use client";

import { useState } from "react";
import { ArrowLeft, Calendar, User, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Blog } from "@/types";

interface BlogDetailPageProps {
  blog: Blog;
}

export default function BlogDetailPage({ blog }: BlogDetailPageProps) {
  const [readMore, setReadMore] = useState(false);
  const CONTENT_LIMIT = 300;
  const isLongContent = blog.content.length > CONTENT_LIMIT;

  return (
    <section className="py-20 bg-background">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .blog-fade { animation: fadeUp 0.6s ease-out both; }
        .blog-fade-d1 { animation-delay: 0.1s; }
        .blog-fade-d2 { animation-delay: 0.2s; }
        .blog-fade-d3 { animation-delay: 0.3s; }
        .blog-fade-d4 { animation-delay: 0.4s; }
      `}</style>

      <div className="max-w-3xl mx-auto px-6">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#0b5394] dark:hover:text-[#60a5fa] transition-colors mb-8 blog-fade"
        >
          <ArrowLeft size={16} />
          Back to Blogs
        </Link>

        {blog.coverImage && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 blog-fade blog-fade-d1">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        )}

        <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-6 blog-fade blog-fade-d2">
          {blog.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border blog-fade blog-fade-d2">
          {blog.author?.name && (
            <span className="flex items-center gap-1.5">
              <User size={14} />
              {blog.author.name}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap blog-fade blog-fade-d3">
          {isLongContent && !readMore
            ? `${blog.content.slice(0, CONTENT_LIMIT)}...`
            : blog.content}
        </div>

        {isLongContent && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 mt-4 text-[#0b5394] dark:text-[#60a5fa] hover:bg-[#e8f4ff] dark:hover:bg-[#0b5394]/10 rounded-xl font-medium blog-fade blog-fade-d4"
            onClick={() => setReadMore(!readMore)}
          >
            {readMore ? (
              <>
                <ChevronUp size={16} />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                Read More
              </>
            )}
          </Button>
        )}
      </div>
    </section>
  );
}
