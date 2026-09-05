import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PostCard from "@/components/PostCard";
import MockDataBadge from "@/components/MockDataBadge";
import { USE_MOCK_DATA } from "@/lib/mock/config";
import { getMockPosts } from "@/lib/mock/data";
import type { Post } from "@/lib/types";

type Tab = "latest" | "hot";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; category?: string }>;
}) {
  const { tab: tabParam, category } = await searchParams;
  const tab: Tab = tabParam === "hot" ? "hot" : "latest";

  let posts: Post[] | null = null;
  let error: { message: string } | null = null;

  if (USE_MOCK_DATA) {
    posts = getMockPosts({ tab, category });
  } else {
    const supabase = await createClient();
    let query = supabase
      .from("posts")
      .select("*, profiles!posts_author_id_fkey(id, display_name, avatar_url)");

    if (category) {
      query = query.eq("category", category);
    }

    if (tab === "hot") {
      // 조회수 + 좋아요*2 기준 hot_score 컬럼으로 정렬
      query = query.order("hot_score", { ascending: false }).limit(20);
    } else {
      query = query.order("created_at", { ascending: false }).limit(30);
    }

    const result = await query;
    posts = result.data as Post[] | null;
    error = result.error;
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "latest", label: "전체 글" },
    { key: "hot", label: "🔥 Hot Trend" },
  ];

  return (
    <div>
      {USE_MOCK_DATA && <MockDataBadge />}

      <div className="mb-6 flex gap-2 border-b border-neutral-200">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={`/?tab=${t.key}${category ? `&category=${category}` : ""}`}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition ${
              tab === t.key
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-500">
          글 목록을 불러오지 못했습니다: {error.message}
        </p>
      )}

      {!error && (!posts || posts.length === 0) && (
        <p className="py-16 text-center text-sm text-neutral-400">
          아직 작성된 글이 없어요. 첫 글을 남겨보세요!
        </p>
      )}

      <div className="flex flex-col gap-3">
        {posts?.map((post, idx) => (
          <PostCard key={post.id} post={post} rank={tab === "hot" ? idx + 1 : undefined} />
        ))}
      </div>
    </div>
  );
}
