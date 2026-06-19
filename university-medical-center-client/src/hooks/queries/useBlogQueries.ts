"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBlogs,
  getBlogById,
  getMyBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "@/services/blog.service";
import type { Blog, CreateBlogRequest, UpdateBlogRequest } from "@/types";

// Query Keys
export const blogKeys = {
  all: ["blogs"] as const,
  list: () => [...blogKeys.all, "list"] as const,
  myBlogs: () => [...blogKeys.all, "myBlogs"] as const,
  detail: (id: string) => [...blogKeys.all, "detail", id] as const,
};

// Queries
export function useBlogs() {
  return useQuery({
    queryKey: blogKeys.list(),
    queryFn: async () => {
      const result = await getBlogs();
      if (result.error) throw new Error(result.error);
      return result.data as Blog[];
    },
  });
}

export function useBlogDetail(id: string) {
  return useQuery({
    queryKey: blogKeys.detail(id),
    queryFn: async () => {
      const result = await getBlogById(id);
      if (result.error) throw new Error(result.error);
      return result.data as Blog;
    },
  });
}

export function useMyBlogs() {
  return useQuery({
    queryKey: blogKeys.myBlogs(),
    queryFn: async () => {
      const result = await getMyBlogs();
      if (result.error) throw new Error(result.error);
      return result.data as Blog[];
    },
  });
}

// Mutations
export function useCreateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBlogRequest) => createBlog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}

export function useUpdateBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: UpdateBlogRequest & { id: string }) =>
      updateBlog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}

export function useDeleteBlog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
    },
  });
}
