export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type Post = {
  id: string;
  author_id: string;
  title: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  category: string;
  view_count: number;
  like_count: number;
  hot_score: number;
  created_at: string;
  updated_at: string;
  profiles?: Profile | null;
};

export const CATEGORIES = ["일반", "개발", "일상", "여행", "리뷰", "기타"] as const;
