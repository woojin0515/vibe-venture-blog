import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { generateHTML } from "@tiptap/html";
import type { JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { createClient } from "@/lib/supabase/server";
import LikeButton from "@/components/LikeButton";
import type { Post } from "@/lib/types";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

async function recordView(postId: string, viewerKey: string) {
  const supabase = await createClient();
  // 동일 조회자의 중복 조회는 primary key 충돌로 무시됨 (조회수 중복 집계 방지)
  await supabase
    .from("post_views")
    .insert({ post_id: postId, viewer_key: viewerKey });
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("*, profiles!posts_author_id_fkey(id, display_name, avatar_url)")
    .eq("id", id)
    .maybeSingle<Post>();

  if (!post) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cookieStore = await cookies();
  let anonId = cookieStore.get("anon_id")?.value;
  if (!anonId) {
    anonId = crypto.randomUUID();
  }
  const viewerKey = user?.id ?? `anon:${anonId}`;
  await recordView(id, viewerKey);

  let contentHtml = "";
  try {
    const json = JSON.parse(post.content) as JSONContent;
    contentHtml = generateHTML(json, [StarterKit, Image]);
  } catch {
    contentHtml = `<p>${post.content}</p>`;
  }

  const isOwner = user?.id === post.author_id;

  return (
    <article>
      <div className="mb-4 flex items-center gap-2 text-xs text-neutral-400">
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-medium text-neutral-600">
          {post.category}
        </span>
        <span>{formatDate(post.created_at)}</span>
        <span>·</span>
        <span>{post.profiles?.display_name ?? "익명"}</span>
      </div>
      <h1 className="mb-6 text-3xl font-bold text-neutral-900">{post.title}</h1>

      <div
        className="prose prose-neutral max-w-none prose-img:rounded-lg"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      <div className="mt-8 flex items-center justify-between border-t border-neutral-200 pt-6">
        <LikeButton postId={post.id} initialLikeCount={post.like_count} />
        <span className="text-sm text-neutral-400">조회 {post.view_count}</span>
      </div>

      {isOwner && (
        <div className="mt-4 flex gap-2">
          <a
            href={`/write?id=${post.id}`}
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50"
          >
            수정하기
          </a>
        </div>
      )}
    </article>
  );
}
