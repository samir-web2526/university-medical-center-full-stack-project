"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Trash2,
  PenLine,
  BookOpen,
  Image as ImageIcon,
  Upload,
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { updateBlog, deleteBlog } from "@/services/blog.service";
import { uploadImage, isValidImageType, formatFileSize } from "@/lib/upload";
import type { Blog } from "@/types";

interface BlogDetailsPageProps {
  blog: Blog;
}

export default function BlogDetailsPage({ blog }: BlogDetailsPageProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    blog.coverImage ?? null
  );
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
    blog.coverImage ?? null
  );
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [readMore, setReadMore] = useState(false);

  const CONTENT_LIMIT = 300;
  const isLongContent = blog.content.length > CONTENT_LIMIT;

  const hasChanges =
    title.trim() !== blog.title ||
    content.trim() !== blog.content ||
    uploadedImageUrl !== (blog.coverImage ?? null);

  const cancelEdit = () => {
    setIsEditing(false);
    setTitle(blog.title);
    setContent(blog.content);
    setImageFile(null);
    setImagePreview(blog.coverImage ?? null);
    setUploadedImageUrl(blog.coverImage ?? null);
    setUploading(false);
    setDragActive(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageSelect = async (file: File) => {
    if (!isValidImageType(file)) {
      toast.error("Only JPEG, PNG, GIF, WebP images are allowed");
      return;
    }
    if (file.size > 32 * 1024 * 1024) {
      toast.error("Image must be smaller than 32MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const result = await uploadImage(file, `blog-${Date.now()}`);
      setUploadedImageUrl(result.url);
      toast.success("Cover image uploaded successfully");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to upload image"
      );
      setImageFile(null);
      setImagePreview(blog.coverImage ?? null);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setUploadedImageUrl(null);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!title.trim()) return toast.error("Title is required");
    if (!content.trim()) return toast.error("Content is required");

    setSaving(true);
    try {
      const payload: { title: string; content: string; coverImage?: string } = {
        title: title.trim(),
        content: content.trim(),
      };

      if (uploadedImageUrl !== (blog.coverImage ?? null)) {
        payload.coverImage = uploadedImageUrl ?? undefined;
      }

      const { error } = await updateBlog(blog.id, payload);

      if (error) {
        toast.error(error);
        return;
      }

      toast.success("Blog updated successfully!");
      setIsEditing(false);
      router.refresh();
    } catch {
      toast.error("Failed to update blog");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await deleteBlog(blog.id);
    setDeleting(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Blog deleted successfully");
    router.push("/dashboard/my-blogs");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 transition-colors">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/dashboard/my-blogs"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Blogs
        </Link>

        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-emerald-900 p-6 shadow-xl">
          {blog.coverImage && (
            <div className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={blog.coverImage}
                alt=""
                className="w-full h-full object-cover opacity-15"
              />
              <div className="absolute inset-0 bg-linear-to-r from-slate-900/95 via-slate-900/80 to-emerald-900/90" />
            </div>
          )}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tNC00aDJ2MmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-60" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 backdrop-blur-sm">
                <BookOpen className="h-5 w-5 text-emerald-400" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                Blog Post
              </span>
            </div>
            {!isEditing && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/10 gap-1.5 rounded-xl h-9"
                  onClick={() => setIsEditing(true)}
                >
                  <PenLine className="w-3.5 h-3.5" />
                  Edit
                </Button>
              </div>
            )}
          </div>
        </div>

        <Card className="border-0 shadow-lg dark:bg-slate-900 dark:border dark:border-slate-800 rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            {isEditing ? (
              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Title *
                  </Label>
                  <Input
                    placeholder="Blog title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-11 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus-visible:ring-emerald-500 rounded-xl text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Content *
                  </Label>
                  <Textarea
                    placeholder="Write your blog content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="resize-none border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus-visible:ring-emerald-500 min-h-72 rounded-xl leading-relaxed"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Cover Image
                    <span className="text-slate-400 font-normal ml-1">(optional)</span>
                  </Label>
                  {!imagePreview ? (
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative flex flex-col items-center justify-center gap-3 p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                        dragActive
                          ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30"
                          : "border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                      <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center">
                        <Upload className="w-7 h-7 text-emerald-500 dark:text-emerald-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {dragActive
                            ? "Drop image here"
                            : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          JPEG, PNG, GIF, WebP (max 32MB)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imagePreview}
                          alt="Cover preview"
                          className="w-full max-h-80 object-contain bg-slate-100 dark:bg-slate-800"
                        />
                        {uploading && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-xl px-4 py-2 shadow-lg">
                              <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Uploading...
                              </span>
                            </div>
                          </div>
                        )}
                        {uploadedImageUrl && !uploading && (
                          <div className="absolute top-3 right-3">
                            <div className="bg-emerald-500 text-white text-xs font-medium px-2.5 py-1 rounded-lg shadow-md">
                              Uploaded
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>{imageFile?.name}</span>
                          <span className="text-slate-300 dark:text-slate-600">·</span>
                          <span>{imageFile ? formatFileSize(imageFile.size) : ""}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removeImage}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 gap-1.5 h-8 rounded-xl"
                        >
                          <X className="w-3.5 h-3.5" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                {blog.coverImage && (
                  <div className="aspect-video w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-8 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 leading-tight">
                      {blog.title}
                    </h2>
                  </div>
                  <div className="text-[15px] text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {isLongContent && !readMore
                      ? `${blog.content.slice(0, CONTENT_LIMIT)}...`
                      : blog.content}
                  </div>
                  {isLongContent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl font-medium"
                      onClick={() => setReadMore(!readMore)}
                    >
                      {readMore ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Read More
                        </>
                      )}
                    </Button>
                  )}
                  {blog.author && (
                    <div className="flex items-center gap-3 pt-5 border-t border-slate-100 dark:border-slate-800">
                      <div className="h-10 w-10 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-white">
                          {blog.author.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {blog.author.name}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          Published{" "}
                          {new Date(blog.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {isEditing && (
          <div className="flex gap-3 pb-10">
            <Button
              variant="outline"
              className="flex-1 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
              onClick={cancelEdit}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white gap-2 rounded-xl shadow-md hover:shadow-lg transition-all"
              onClick={handleSave}
              disabled={saving || uploading || !hasChanges}
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}

        {!isEditing && (
          <Card className="border-0 shadow-md dark:bg-slate-900 dark:border-slate-800 border-l-4 border-l-red-500">
            <CardContent className="py-5 px-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Delete Blog</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Permanently remove this blog post</p>
                </div>
                {!showDeleteConfirm ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="border-slate-200 dark:border-slate-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleDelete}
                      disabled={deleting}
                      className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" /> {deleting ? "Deleting..." : "Confirm Delete"}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
