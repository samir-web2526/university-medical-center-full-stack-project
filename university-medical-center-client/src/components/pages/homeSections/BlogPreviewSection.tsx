"use client";

import { Clock, Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BlogPost {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}

const latestBlogs: BlogPost[] = [
  {
    id: 1,
    title: "Importance of Regular Health Checkups",
    description:
      "Regular health checkups help detect potential health issues early, allowing timely treatment and preventing serious complications.",
    category: "Preventive Care",
    author: "Dr. Fatima Khan",
    date: "Jan 15, 2026",
    readTime: "3 min read",
    image: "from-[#0b5394] to-[#2196f3]",
  },
  {
    id: 2,
    title: "Understanding Diabetes and Its Prevention",
    description:
      "Diabetes is a chronic condition affecting millions. Learn about types, symptoms, and lifestyle changes to prevent or manage it effectively.",
    category: "Chronic Disease",
    author: "Dr. Fatima Khan",
    date: "Jan 10, 2026",
    readTime: "4 min read",
    image: "from-[#1a7a5c] to-[#34d399]",
  },
  {
    id: 3,
    title: "Dengue Prevention During Monsoon Season",
    description:
      "Monsoon brings dengue risk. Discover practical steps to protect yourself and your family from mosquito-borne diseases.",
    category: "Seasonal Health",
    author: "Dr. Fatima Khan",
    date: "Jan 5, 2026",
    readTime: "3 min read",
    image: "from-[#d97706] to-[#fbbf24]",
  },
];

export default function BlogPreviewSection() {
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
          {latestBlogs.map((blog) => (
            <div
              key={blog.id}
              className="group border border-border rounded-2xl overflow-hidden bg-card hover:shadow-lg hover:border-[#0b5394]/20 dark:hover:border-[#2196f3]/20 transition-all duration-300"
            >
              {/* Featured Image */}
              <div
                className={`relative h-44 bg-gradient-to-br ${blog.image} overflow-hidden`}
              >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                <div className="absolute top-3 left-3">
                  <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-white bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                    {blog.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <h3 className="text-base font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-[#0b5394] dark:group-hover:text-[#60a5fa] transition-colors duration-300">
                  {blog.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {blog.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    {blog.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {blog.date}
                  </span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock size={12} />
                    {blog.readTime}
                  </span>
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

        {/* View All Button */}
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
      </div>
    </section>
  );
}
