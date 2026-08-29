"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Post } from "@/lib/types";
import type { User } from "@supabase/supabase-js";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default function MyPage() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace("/login");
        return;
      }
      setUser(data.user);
      const { data: myPosts } = await supabase
        .from("posts")
        .select("*")
        .eq("author_id", data.user.id)
        .order("created_at", { ascending: false });
      setPosts((myPosts as Post[]) ?? []);
      setLoading(false);
    });
  }, [supabase, router]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("정말 이 글을 삭제하시겠습니까?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (!error) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  if (loading) {
    return <p className="py-16 text-center text-sm text-neutral-400">불러오는 중...</p>;
  }

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">마이페이지</h1>
      <p className="mb-6 text-sm text-neutral-500">
        {user?.email} 님이 작성한 글 {posts.length}개
      </p>

      {posts.length === 0 ? (
        <p className="py-16 text-center text-sm text-neutral-400">
          아직 작성한 글이 없어요.{" "}
          <Link href="/write" className="underline">
            첫 글 쓰러 가기
          </Link>
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4"
            >
              <Link href={`/posts/${post.id}`} className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2 text-xs text-neutral-400">
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-medium text-neutral-600">
                    {post.category}
                  </span>
                  <span>{formatDate(post.created_at)}</span>
                </div>
                <h2 className="truncate font-semibold text-neutral-900">
                  {post.title}
                </h2>
                <div className="mt-1 flex gap-3 text-xs text-neutral-400">
                  <span>조회 {post.view_count}</span>
                  <span>좋아요 {post.like_count}</span>
                </div>
              </Link>
              <div className="ml-4 flex shrink-0 gap-2 text-sm">
                <Link
                  href={`/write?id=${post.id}`}
                  className="rounded-lg border border-neutral-300 px-3 py-1.5 text-neutral-600 hover:bg-neutral-50"
                >
                  수정
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-red-500 hover:bg-red-50"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
