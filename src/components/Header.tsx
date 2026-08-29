"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Header() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-neutral-900">
          내 블로그
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link
                href="/write"
                className="rounded-lg bg-neutral-900 px-3 py-1.5 font-medium text-white transition hover:bg-neutral-700"
              >
                글쓰기
              </Link>
              <Link href="/mypage" className="text-neutral-600 hover:text-neutral-900">
                마이페이지
              </Link>
              <button
                onClick={handleLogout}
                className="text-neutral-500 hover:text-neutral-900"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-neutral-900 px-3 py-1.5 font-medium text-white transition hover:bg-neutral-700"
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
