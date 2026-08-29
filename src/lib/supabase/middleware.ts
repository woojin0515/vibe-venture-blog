import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // 익명 방문자 식별용 쿠키 (조회수 중복 집계 방지)
  if (!request.cookies.get("anon_id")) {
    const anonId = crypto.randomUUID();
    request.cookies.set("anon_id", anonId);
    supabaseResponse.cookies.set("anon_id", anonId, {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: false,
    });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 세션 갱신을 위해 반드시 호출 (반환값 사용 안 해도 무방)
  await supabase.auth.getUser();

  return supabaseResponse;
}
