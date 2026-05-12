/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { fetchFeedPosts } from "../services/feed-service";
import { PostCard } from "./post-card";
import { Loader2 } from "lucide-react";

export default function InfiniteFeed() {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["feed"],
      queryFn: ({ pageParam }) => fetchFeedPosts({ pageParam }),
      initialPageParam: undefined,
      getNextPageParam: (lastPage: any) =>
        lastPage?.length === 10
          ? lastPage[lastPage.length - 1].created_at
          : undefined,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (status === "pending")
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-brand-orange" />
      </div>
    );

  return (
    <div className="flex flex-col">
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page?.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ))}

      {/* Trigger element for Infinite Scroll */}
      <div ref={ref} className="flex justify-center py-10">
        {isFetchingNextPage ? (
          <Loader2 className="h-6 w-6 animate-spin text-brand-orange" />
        ) : hasNextPage ? (
          <span className="text-xs text-zinc-400">Loading more stories...</span>
        ) : (
          <span className="text-xs text-zinc-400 font-serif italic">
            You've reached the end of the ink.
          </span>
        )}
      </div>
    </div>
  );
}
