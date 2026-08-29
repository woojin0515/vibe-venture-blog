# 내 블로그

Next.js(App Router) + Supabase 기반 개인 블로그 서비스.

## 기능
- 구글 로그인/회원가입 (Supabase Auth OAuth)
- 메인 피드: 전체 글 목록 / 🔥 Hot Trend (조회수+좋아요 자동 집계) 탭
- 글 상세: Tiptap 리치 에디터 콘텐츠 렌더링, 조회수 자동 집계, 좋아요
- 글쓰기/수정: Tiptap 에디터 (굵게/기울임/제목/목록/인용/링크/이미지)
- 마이페이지: 내가 쓴 글만 목록, 수정/삭제

## 시작하기

### 1. Supabase 프로젝트 생성
1. https://supabase.com 에서 새 프로젝트 생성
2. `supabase/schema.sql` 파일 전체를 Supabase 대시보드 > SQL Editor 에서 실행
3. Authentication > Providers > Google 활성화
   - Google Cloud Console에서 OAuth 클라이언트 ID 생성 (승인된 리디렉션 URI에
     Supabase가 안내하는 `https://<project-ref>.supabase.co/auth/v1/callback` 등록)
   - 발급받은 Client ID/Secret을 Supabase Google Provider 설정에 입력
4. Authentication > URL Configuration 에서 Site URL 및 Redirect URLs에
   `http://localhost:3000/auth/callback` 추가

### 2. 환경 변수 설정
`.env.local.example` 을 복사해 `.env.local` 생성 후 Supabase 프로젝트의
API URL / anon key 값을 채워주세요.

```bash
cp .env.local.example .env.local
```

### 3. 개발 서버 실행
```bash
npm install
npm run dev
```
http://localhost:3000 접속

## 폴더 구조
- `src/app` — 라우트 (메인, 로그인, 글쓰기, 상세, 마이페이지)
- `src/components` — Header, PostCard, LikeButton, TiptapEditor
- `src/lib/supabase` — 브라우저/서버/미들웨어 Supabase 클라이언트
- `supabase/schema.sql` — DB 스키마, RLS 정책, 트리거 (조회수/좋아요 자동 집계)

## 참고
- 글 내용은 Tiptap의 JSON 문서를 문자열로 저장하고, 상세 페이지에서 서버사이드로
  HTML로 변환해 렌더링합니다.
- Hot Trend는 `posts.hot_score` (조회수 + 좋아요×2) generated column 기준으로 정렬됩니다.
- 배포는 추후 Vercel 등으로 진행 예정입니다.
