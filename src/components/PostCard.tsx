import Link from "next/link";
import type { Post } from "@/lib/types";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export default function PostCard({ post, rank }: { post: Post; rank?: number }) {
  return (
    <Link
      href={`/posts/${post.id}`}
      className="flex gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-300 hover:shadow-sm"
    >
      {rank !== undefined && (
        <div className="flex w-8 shrink-0 items-center justify-center text-xl font-bold text-orange-500">
          {rank}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="mb-1 flex items-center gap-2 text-xs text-neutral-400">
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-medium text-neutral-600">
            {post.category}
          </span>
          <span>{formatDate(post.created_at)}</span>
          <span>·</span>
          <span>{post.profiles?.display_name ?? "익명"}</span>
        </div>
        <h2 className="truncate text-lg font-semibold text-neutral-900">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
            {post.excerpt}
          </p>
        )}
        <div className="mt-2 flex items-center gap-3 text-xs text-neutral-400">
          <span>조회 {post.view_count}</span>
          <span>좋아요 {post.like_count}</span>
        </div>
      </div>
    </Link>
  );
}
