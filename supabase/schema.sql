-- ============================================================
-- 블로그 서비스 스키마
-- Supabase 대시보드 > SQL Editor 에서 이 파일 전체를 실행하세요.
-- ============================================================

-- 1) profiles: auth.users 와 1:1로 연결되는 공개 프로필
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- 신규 유저 가입 시 profiles 자동 생성 트리거
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2) posts: 블로그 글
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  content text not null, -- Tiptap JSON 문자열 저장
  excerpt text,
  cover_image_url text,
  category text default '일반',
  view_count integer not null default 0,
  like_count integer not null default 0,
  hot_score integer generated always as (view_count + like_count * 2) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists posts_author_id_idx on public.posts (author_id);
-- Hot Trend 정렬용 (조회수 + 좋아요*2 기준)
create index if not exists posts_hot_score_idx on public.posts (hot_score desc);

-- 3) post_likes: 사용자별 좋아요 (중복 방지)
create table if not exists public.post_likes (
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

-- 4) post_views: 조회 기록 (짧은 시간 중복 조회 방지용, IP/유저 기준)
create table if not exists public.post_views (
  post_id uuid not null references public.posts (id) on delete cascade,
  viewer_key text not null, -- 로그인 user_id 또는 익명 식별자
  viewed_at timestamptz not null default now(),
  primary key (post_id, viewer_key)
);

-- ============================================================
-- 좋아요/조회수 카운트 동기화 트리거
-- ============================================================
create or replace function public.sync_like_count()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (tg_op = 'INSERT') then
    update public.posts set like_count = like_count + 1 where id = new.post_id;
  elsif (tg_op = 'DELETE') then
    update public.posts set like_count = greatest(like_count - 1, 0) where id = old.post_id;
  end if;
  return null;
end;
$$;

drop trigger if exists on_post_like_change on public.post_likes;
create trigger on_post_like_change
  after insert or delete on public.post_likes
  for each row execute procedure public.sync_like_count();

create or replace function public.sync_view_count()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.posts set view_count = view_count + 1 where id = new.post_id;
  return null;
end;
$$;

drop trigger if exists on_post_view_insert on public.post_views;
create trigger on_post_view_insert
  after insert on public.post_views
  for each row execute procedure public.sync_view_count();

-- updated_at 자동 갱신
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_posts_update on public.posts;
create trigger on_posts_update
  before update on public.posts
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_views enable row level security;

-- profiles: 모두 읽기 가능, 본인만 수정 가능
drop policy if exists "profiles are viewable by everyone" on public.profiles;
create policy "profiles are viewable by everyone" on public.profiles
  for select using (true);
drop policy if exists "users can update own profile" on public.profiles;
create policy "users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- posts: 모두 읽기 가능, 본인 글만 작성/수정/삭제 가능
drop policy if exists "posts are viewable by everyone" on public.posts;
create policy "posts are viewable by everyone" on public.posts
  for select using (true);
drop policy if exists "users can insert own posts" on public.posts;
create policy "users can insert own posts" on public.posts
  for insert with check (auth.uid() = author_id);
drop policy if exists "users can update own posts" on public.posts;
create policy "users can update own posts" on public.posts
  for update using (auth.uid() = author_id);
drop policy if exists "users can delete own posts" on public.posts;
create policy "users can delete own posts" on public.posts
  for delete using (auth.uid() = author_id);

-- post_likes: 로그인 유저는 자신의 좋아요만 추가/삭제, 조회는 전체 허용(집계용)
drop policy if exists "likes are viewable by everyone" on public.post_likes;
create policy "likes are viewable by everyone" on public.post_likes
  for select using (true);
drop policy if exists "users can like as themselves" on public.post_likes;
create policy "users can like as themselves" on public.post_likes
  for insert with check (auth.uid() = user_id);
drop policy if exists "users can unlike own like" on public.post_likes;
create policy "users can unlike own like" on public.post_likes
  for delete using (auth.uid() = user_id);

-- post_views: 누구나 조회 기록 추가 가능(익명 포함), 삭제/수정 불가
drop policy if exists "anyone can record a view" on public.post_views;
create policy "anyone can record a view" on public.post_views
  for insert with check (true);
drop policy if exists "views are viewable by everyone" on public.post_views;
create policy "views are viewable by everyone" on public.post_views
  for select using (true);
