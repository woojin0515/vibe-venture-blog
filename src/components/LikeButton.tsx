"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function LikeButton({
  postId,
  initialLikeCount,
}: {
  postId: string;
  initialLikeCount: number;
}) {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      if (data.user) {
        supabase
          .from("post_likes")
          .select("post_id")
          .eq("post_id", postId)
          .eq("user_id", data.user.id)
          .maybeSingle()
          .then(({ data: likeRow }) => setLiked(!!likeRow));
      }
    });
  }, [supabase, postId]);

  const toggleLike = async () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setLoading(true);
    if (liked) {
      const { error } = await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
      if (!error) {
        setLiked(false);
        setCount((c) => c - 1);
      }
    } else {
      const { error } = await supabase
        .from("post_likes")
        .insert({ post_id: postId, user_id: user.id });
      if (!error) {
        setLiked(true);
        setCount((c) => c + 1);
      }
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition ${
        liked
          ? "border-red-300 bg-red-50 text-red-500"
          : "border-neutral-300 text-neutral-600 hover:bg-neutral-50"
      }`}
    >
      <span>{liked ? "❤️" : "🤍"}</span>
      <span>좋아요 {count}</span>
    </button>
  );
}
