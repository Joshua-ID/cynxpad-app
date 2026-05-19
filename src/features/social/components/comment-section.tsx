"use client";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Send, MessageSquare } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user_profile?: { username: string; avatar_url: string };
}

export function CommentsSection({
  postId,
  currentUserId,
}: {
  postId: string;
  currentUserId?: string;
}) {
  const supabase = createClient();
  const formRef = useRef<HTMLFormElement>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // 1. Initial Load + Set up Realtime listener
  useEffect(() => {
    async function fetchInitialComments() {
      const { data } = await supabase
        .from("comments")
        .select(
          `
          id, content, created_at, user_id,
          user_profile:profiles(username, avatar_url)
        `,
        )
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (data) setComments(data as unknown as Comment[]);
    }

    fetchInitialComments();

    // Listen to live database insertions on the comments table
    const channel = supabase
      .channel(`public:comments:post_id=eq.${postId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${postId}`,
        },
        async (payload) => {
          // Fetch the sender's profile details to attach to the new comment bubble
          const { data: profile } = await supabase
            .from("profiles")
            .select("username, avatar_url")
            .eq("id", payload.new.user_id)
            .single();

          const newComment: Comment = {
            id: payload.new.id,
            content: payload.new.content,
            created_at: payload.new.created_at,
            user_id: payload.new.user_id,
            user_profile: profile || { username: "writer", avatar_url: "" },
          };

          setComments((prev) => [...prev, newComment]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, supabase]);

  // 2. Submit Handle Action
  async function handleCommentSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!currentUserId)
      return alert("Please log in to add to the conversation.");

    const formData = new FormData(e.currentTarget);
    const content = formData.get("commentText") as string;
    if (!content.trim()) return;

    setSubmitting(true);
    formRef.current?.reset();

    const { error } = await supabase
      .from("comments")
      .insert({ post_id: postId, user_id: currentUserId, content });

    if (error) {
      alert("Could not post comment. Try again.");
      console.error(error);
    }
    setSubmitting(false);
  }

  return (
    <div className="mt-12 border-t border-zinc-100 pt-10 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6 text-zinc-900 font-bold">
        <MessageSquare className="h-5 w-5 text-zinc-400" />
        <h3>Discussion ({comments.length})</h3>
      </div>

      {/* INPUT CONTEXT BOX */}
      {currentUserId ? (
        <form
          ref={formRef}
          onSubmit={handleCommentSubmit}
          className="flex gap-3 mb-8"
        >
          <div className="h-8 w-8 rounded-full bg-zinc-100 flex-shrink-0" />
          <div className="flex-1 relative">
            <input
              name="commentText"
              placeholder="What are your thoughts?"
              disabled={submitting}
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50/30 px-4 py-3 pr-12 text-sm focus:border-brand-orange focus:bg-white focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={submitting}
              className="absolute right-3 top-2.5 p-1 text-zinc-400 hover:text-brand-orange disabled:opacity-40 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl bg-zinc-50 p-4 text-center text-sm text-zinc-500 mb-8 border border-zinc-100">
          Want to share your thoughts? Please sign in or register to join the
          discussion.
        </div>
      )}

      {/* COMMENTS LIST BUBBLES */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex gap-3 text-sm animation-fade-in"
          >
            <div className="h-8 w-8 rounded-full bg-zinc-200 flex-shrink-0" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-zinc-900">
                  @{comment.user_profile?.username || "writer"}
                </span>
                <span className="text-[10px] text-zinc-400">
                  {new Date(comment.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-zinc-600 leading-relaxed font-sans">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-zinc-400 italic text-center py-4">
            No comments on this masterpiece yet. Be the first to drop some ink.
          </p>
        )}
      </div>
    </div>
  );
}
