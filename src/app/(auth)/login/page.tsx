"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // TODO: Google OAuth 설정 완료 후 아래 함수와 버튼의 주석을 해제하세요.
  // const handleGoogleLogin = async () => {
  //   await supabase.auth.signInWithOAuth({
  //     provider: "google",
  //     options: {
  //       redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/auth/callback`,
  //     },
  //   });
  // };

  const validate = () => {
    if (!email.trim() || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return false;
    }
    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 해요.");
      return false;
    }
    if (mode === "signup" && password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않아요.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError(null);
    setNotice(null);
    if (!validate()) return;
    setLoading(true);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/auth/callback`,
        },
      });
      setLoading(false);
      if (error) return setError(error.message);
      if (data.session) {
        // 이메일 확인이 꺼져있는 경우 즉시 로그인됨
        router.push("/");
        router.refresh();
      } else {
        setNotice(
          "가입 확인 메일을 보냈어요. 메일함에서 링크를 눌러 인증을 완료해주세요."
        );
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      setLoading(false);
      if (error) return setError(error.message);
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-bold text-neutral-900">
          내 블로그
        </h1>
        <p className="mb-6 text-center text-sm text-neutral-500">
          이메일로 로그인하고 나만의 이야기를 시작해보세요.
        </p>

        <div className="mb-6 flex rounded-lg bg-neutral-100 p-1 text-sm">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setError(null);
              setNotice(null);
            }}
            className={`flex-1 rounded-md py-2 font-medium transition ${
              mode === "signin"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500"
            }`}
          >
            로그인
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError(null);
              setNotice(null);
            }}
            className={`flex-1 rounded-md py-2 font-medium transition ${
              mode === "signup"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500"
            }`}
          >
            회원가입
          </button>
        </div>

        {/*
          구글 로그인 버튼 (임시 비활성화 - Google OAuth 설정 전까지 주석 처리)
          위 handleGoogleLogin 주석 해제 후, 아래 버튼도 함께 해제하세요.

          <button
            onClick={handleGoogleLogin}
            className="mb-6 flex w-full items-center justify-center gap-3 rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.56 2.7-3.86 2.7-6.62z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z" />
              <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.68 9c0-.59.1-1.16.27-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z" />
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
            </svg>
            Google로 계속하기
          </button>
        */}

        <div className="flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 주소"
            className="rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-500 focus:outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 (6자 이상)"
            className="rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-500 focus:outline-none"
          />
          {mode === "signup" && (
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="비밀번호 확인"
              className="rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-500 focus:outline-none"
            />
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
          {notice && <p className="text-sm text-green-600">{notice}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50"
          >
            {loading ? "처리 중..." : mode === "signup" ? "회원가입" : "로그인"}
          </button>
        </div>
      </div>
    </div>
  );
}
