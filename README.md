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

## GitHub CI (푸시/PR 자동 검증)
`.github/workflows/ci.yml`이 설정되어 있어, GitHub에 푸시하거나 PR을 열면 아래 검증이 자동 실행됩니다.

- `npm ci`
- `npm run lint`
- `npm run build`
- `npm test`

현재 기본 테스트 명령은 `node --test`로 설정되어 있습니다.  
추후 Vitest/Jest를 도입하면 `scripts.test`만 바꿔서 동일한 CI 파이프라인에서 그대로 검증할 수 있습니다.

## 목업(샘플) 데이터로 개발하기
DB에 글이 없어도 로컬에서 풍성한 콘텐츠로 UI를 확인할 수 있도록,
`src/lib/mock/data.ts`에 20개의 샘플 글(다양한 카테고리, 조회수/좋아요 값 차등)을 준비해뒀습니다.

- `.env.local`에 `USE_MOCK_DATA=true`를 설정하면 메인 피드(전체 글/Hot Trend)와
  글 상세 페이지가 실제 Supabase 대신 이 샘플 데이터를 보여줍니다.
- 샘플 데이터는 **읽기 전용**입니다. 좋아요/조회수는 실제로 증가하지 않고, 상세 페이지에
  "🧪 개발용 샘플 데이터" 배지가 표시됩니다. 실제 DB에는 어떠한 값도 저장되지 않습니다.
- `USE_MOCK_DATA`는 `NEXT_PUBLIC_` 접두사가 없는 서버 전용 환경변수이므로 클라이언트
  번들에 노출되지 않습니다.
- **배포 환경(Vercel 등)에는 이 환경변수를 절대 설정하지 마세요.** 값이 없으면 항상
  `false`로 취급되어 실제 DB 데이터만 사용합니다.

## Azure 배포 (Terraform)
`infra/` 폴더에 Azure App Service(Linux, Node.js) 인프라 코드가 있습니다.

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars   # Supabase URL/anon key 입력
terraform init
terraform plan -out=tfplan.out
terraform apply -auto-approve tfplan.out
```

인프라 생성 후 앱 코드 배포:
```bash
cd ..
zip -r -q deploy.zip . -x "node_modules/*" ".next/*" ".git/*" "infra/*" ".env*"
az webapp deploy --resource-group <resource_group_name 출력값> \
  --name <app_service_name 출력값> --src-path deploy.zip --type zip
```
- `SCM_DO_BUILD_DURING_DEPLOYMENT=true` 설정으로 Azure(Oryx)가 배포 시 자동으로
  `npm install && npm run build`를 실행합니다.
- `terraform.tfvars`, `terraform.tfstate`는 민감정보를 담고 있어 `.gitignore` 처리되어
  있습니다. 커밋하지 마세요.
- 배포된 URL과 리소스 정보는 `terraform output`으로 확인할 수 있습니다.

## 폴더 구조
- `src/app` — 라우트 (메인, 로그인, 글쓰기, 상세, 마이페이지)
- `src/components` — Header, PostCard, LikeButton, TiptapEditor, MockDataBadge
- `src/lib/supabase` — 브라우저/서버/미들웨어 Supabase 클라이언트
- `src/lib/mock` — 로컬 개발용 목업 데이터 및 `USE_MOCK_DATA` 플래그
- `supabase/schema.sql` — DB 스키마, RLS 정책, 트리거 (조회수/좋아요 자동 집계)
- `infra/` — Azure 배포용 Terraform 코드 (App Service Plan, Linux Web App)

## 참고
- 글 내용은 Tiptap의 JSON 문서를 문자열로 저장하고, 상세 페이지에서 서버사이드로
  HTML로 변환해 렌더링합니다.
- Hot Trend는 `posts.hot_score` (조회수 + 좋아요×2) generated column 기준으로 정렬됩니다.
- 배포는 추후 Vercel 등으로 진행 예정입니다.
