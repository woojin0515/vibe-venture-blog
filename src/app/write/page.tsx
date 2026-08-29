"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/types";
import type { User } from "@supabase/supabase-js";

const TiptapEditor = dynamic(() => import("@/components/TiptapEditor"), {
  ssr: false,
});

function WritePageInner() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [contentJson, setContentJson] = useState<object | null>(null);
  const [contentText, setContentText] = useState("");
  const [initialContent, setInitialContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setCheckingAuth(false);
      if (!data.user) {
        router.replace("/login");
      }
    });
  }, [supabase, router]);

  useEffect(() => {
    if (!editId) return;
    supabase
      .from("posts")
      .select("*")
      .eq("id", editId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setTitle(data.title);
          setCategory(data.category);
          setInitialContent(data.content);
        }
      });
  }, [editId, supabase]);

  const handleSave = async () => {
    if (!user) return;
    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    if (!contentText.trim() && !editId) {
      setError("내용을 입력해주세요.");
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      title: title.trim(),
      content: JSON.stringify(contentJson ?? safeParse(initialContent)),
      excerpt: contentText.trim().slice(0, 140) || null,
      category,
    };

    if (editId) {
      const { error } = await supabase
        .from("posts")
        .update(payload)
        .eq("id", editId);
      setSaving(false);
      if (error) return setError(error.message);
      router.push(`/posts/${editId}`);
    } else {
      const { data, error } = await supabase
        .from("posts")
        .insert({ ...payload, author_id: user.id })
        .select("id")
        .single();
      setSaving(false);
      if (error) return setError(error.message);
      router.push(`/posts/${data.id}`);
    }
  };

  if (checkingAuth) {
    return <p className="py-16 text-center text-sm text-neutral-400">확인 중...</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{editId ? "글 수정" : "새 글 작성"}</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
        className="rounded-lg border border-neutral-300 px-4 py-3 text-lg font-semibold focus:border-neutral-500 focus:outline-none"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-fit rounded-lg border border-neutral-300 px-3 py-2 text-sm"
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <TiptapEditor
        content={initialContent}
        onChange={(json, text) => {
          setContentJson(json);
          setContentText(text);
        }}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50"
        >
          {saving ? "저장 중..." : editId ? "수정 완료" : "발행하기"}
        </button>
      </div>
    </div>
  );
}

function safeParse(content: string) {
  try {
    return JSON.parse(content);
  } catch {
    return {};
  }
}

export default function WritePage() {
  return (
    <Suspense fallback={null}>
      <WritePageInner />
    </Suspense>
  );
}
