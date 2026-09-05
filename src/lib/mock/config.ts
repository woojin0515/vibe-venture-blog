/**
 * 개발 환경에서만 목업 데이터를 사용하기 위한 플래그.
 * 서버 컴포넌트에서만 참조하며(NEXT_PUBLIC_ 접두사 없음), 클라이언트 번들에는 포함되지 않습니다.
 * 배포 환경(Vercel 등)에는 이 환경변수를 절대 설정하지 마세요 — 미설정 시 항상 false 입니다.
 */
export const USE_MOCK_DATA = process.env.USE_MOCK_DATA === "true";
