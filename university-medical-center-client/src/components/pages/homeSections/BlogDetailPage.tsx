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
      <div className="max-w-3xl mx-auto px-6">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#0b5394] dark:hover:text-[#60a5fa] transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Blogs
        </Link>

        {blog.coverImage && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        )}

        <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-6">
          {blog.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
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

        <div className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {isLongContent && !readMore
            ? `${blog.content.slice(0, CONTENT_LIMIT)}...`
            : blog.content}
        </div>

        {isLongContent && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 mt-4 text-[#0b5394] dark:text-[#60a5fa] hover:bg-[#e8f4ff] dark:hover:bg-[#0b5394]/10 rounded-xl font-medium"
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
