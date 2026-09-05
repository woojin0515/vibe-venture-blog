import type { Post, Profile } from "@/lib/types";

/**
 * 개발 환경 전용 목업 데이터.
 * USE_MOCK_DATA=true 일 때만 사용되며, 실제 Supabase DB에는 절대 저장되지 않습니다.
 * (자세한 사용법은 README.md 참고)
 */

const mockAuthors: Profile[] = [
  { id: "mock-author-1", display_name: "김민준", avatar_url: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "mock-author-2", display_name: "이서연", avatar_url: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "mock-author-3", display_name: "박도윤", avatar_url: null, created_at: "2024-01-01T00:00:00Z" },
  { id: "mock-author-4", display_name: "최지우", avatar_url: null, created_at: "2024-01-01T00:00:00Z" },
];

// 간단한 문단 배열을 Tiptap JSON 문서 문자열로 변환 (실제 에디터가 저장하는 포맷과 동일)
function buildContent(paragraphs: string[]): string {
  return JSON.stringify({
    type: "doc",
    content: paragraphs.map((text) => ({
      type: "paragraph",
      content: [{ type: "text", text }],
    })),
  });
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

type MockPostSeed = {
  id: string;
  title: string;
  category: Post["category"];
  author: Profile;
  createdDaysAgo: number;
  viewCount: number;
  likeCount: number;
  paragraphs: string[];
};

const seeds: MockPostSeed[] = [
  {
    id: "mock-1",
    title: "Next.js 15에서 달라진 것들 정리",
    category: "개발",
    author: mockAuthors[0],
    createdDaysAgo: 1,
    viewCount: 812,
    likeCount: 64,
    paragraphs: [
      "Next.js 15로 마이그레이션하면서 겪은 변화들을 정리해봤습니다.",
      "App Router의 캐싱 기본값이 바뀌면서 예상치 못한 이슈가 몇 가지 있었어요.",
      "특히 fetch 캐싱 전략을 명시적으로 지정해야 하는 부분이 인상적이었습니다.",
    ],
  },
  {
    id: "mock-2",
    title: "제주도 3박 4일 반려견 동반 여행기",
    category: "여행",
    author: mockAuthors[1],
    createdDaysAgo: 2,
    viewCount: 1523,
    likeCount: 201,
    paragraphs: [
      "강아지와 함께하는 제주 여행, 생각보다 준비할 게 많았어요.",
      "반려동물 동반 가능한 숙소와 카페 위주로 코스를 짰습니다.",
      "협재 해수욕장에서 뛰어노는 모습이 아직도 눈에 선하네요.",
    ],
  },
  {
    id: "mock-3",
    title: "혼자 사는 사람의 미니멀 라이프 정착기",
    category: "일상",
    author: mockAuthors[2],
    createdDaysAgo: 4,
    viewCount: 430,
    likeCount: 38,
    paragraphs: [
      "물건을 하나씩 줄여가면서 느낀 점들을 기록합니다.",
      "필요 없는 물건을 정리하니 마음도 한결 가벼워졌어요.",
    ],
  },
  {
    id: "mock-4",
    title: "가성비 무선 이어폰 3종 비교 리뷰",
    category: "리뷰",
    author: mockAuthors[3],
    createdDaysAgo: 5,
    viewCount: 2210,
    likeCount: 305,
    paragraphs: [
      "10만원대 무선 이어폰 세 가지를 직접 써보고 비교했습니다.",
      "음질, 착용감, 배터리 지속시간을 기준으로 점수를 매겨봤어요.",
      "가성비로는 단연 B 제품이 앞섰습니다.",
    ],
  },
  {
    id: "mock-5",
    title: "TypeScript 5.x의 satisfies 연산자 활용법",
    category: "개발",
    author: mockAuthors[0],
    createdDaysAgo: 6,
    viewCount: 980,
    likeCount: 122,
    paragraphs: [
      "satisfies 키워드를 실무에 적용하면서 타입 추론이 훨씬 정교해졌습니다.",
      "특히 설정 객체를 다룰 때 유용했던 케이스를 공유합니다.",
    ],
  },
  {
    id: "mock-6",
    title: "퇴근 후 30분 홈트, 6개월 후기",
    category: "일상",
    author: mockAuthors[1],
    createdDaysAgo: 7,
    viewCount: 671,
    likeCount: 89,
    paragraphs: [
      "매일 퇴근 후 30분씩 운동한 지 6개월이 지났습니다.",
      "체중보다는 체력과 수면의 질이 눈에 띄게 좋아졌어요.",
    ],
  },
  {
    id: "mock-7",
    title: "교토 벚꽃 명소 베스트 5",
    category: "여행",
    author: mockAuthors[2],
    createdDaysAgo: 8,
    viewCount: 1890,
    likeCount: 244,
    paragraphs: [
      "봄철 교토 여행이라면 놓치면 안 되는 벚꽃 명소들을 소개합니다.",
      "사람이 몰리는 시간대를 피하는 팁도 함께 정리했어요.",
    ],
  },
  {
    id: "mock-8",
    title: "PostgreSQL 인덱스 튜닝으로 쿼리 10배 빨라진 이야기",
    category: "개발",
    author: mockAuthors[3],
    createdDaysAgo: 9,
    viewCount: 1340,
    likeCount: 178,
    paragraphs: [
      "느려진 쿼리 하나 때문에 며칠을 씨름했던 경험을 공유합니다.",
      "EXPLAIN ANALYZE로 원인을 찾고 복합 인덱스를 추가한 과정입니다.",
    ],
  },
  {
    id: "mock-9",
    title: "1인 가구를 위한 자취 요리 루틴",
    category: "일상",
    author: mockAuthors[0],
    createdDaysAgo: 10,
    viewCount: 512,
    likeCount: 47,
    paragraphs: [
      "혼자 살면서도 삼시세끼를 잘 챙겨 먹기 위한 저만의 루틴입니다.",
      "일요일 저녁에 한 주 식재료를 미리 손질해두는 게 핵심이에요.",
    ],
  },
  {
    id: "mock-10",
    title: "커피 머신 vs 핸드드립, 6개월 사용 비교",
    category: "리뷰",
    author: mockAuthors[1],
    createdDaysAgo: 11,
    viewCount: 764,
    likeCount: 91,
    paragraphs: [
      "커피 머신을 사기 전 핸드드립과 6개월간 비교해봤습니다.",
      "맛의 차이보다 시간과 정성의 차이가 더 크게 느껴졌어요.",
    ],
  },
  {
    id: "mock-11",
    title: "React Server Components 제대로 이해하기",
    category: "개발",
    author: mockAuthors[2],
    createdDaysAgo: 12,
    viewCount: 2530,
    likeCount: 340,
    paragraphs: [
      "RSC 개념이 헷갈려서 직접 정리하며 공부한 내용을 남깁니다.",
      "서버 컴포넌트와 클라이언트 컴포넌트의 경계를 어떻게 나눌지 고민한 기록이에요.",
    ],
  },
  {
    id: "mock-12",
    title: "부산 2박 3일 로컬 맛집 코스",
    category: "여행",
    author: mockAuthors[3],
    createdDaysAgo: 13,
    viewCount: 1120,
    likeCount: 156,
    paragraphs: [
      "관광지보다 현지인이 자주 가는 맛집 위주로 다녀왔습니다.",
      "돼지국밥부터 씨앗호떡까지, 부산의 맛을 제대로 느낀 여행이었어요.",
    ],
  },
  {
    id: "mock-13",
    title: "독서 습관 만들기: 1년에 50권 읽은 방법",
    category: "일상",
    author: mockAuthors[0],
    createdDaysAgo: 14,
    viewCount: 890,
    likeCount: 113,
    paragraphs: [
      "책 읽는 습관을 만들기 위해 시도했던 여러 방법들을 소개합니다.",
      "매일 정해진 시간에 15분만 읽는 것부터 시작했어요.",
    ],
  },
  {
    id: "mock-14",
    title: "기계식 키보드 입문자를 위한 스위치 가이드",
    category: "리뷰",
    author: mockAuthors[1],
    createdDaysAgo: 15,
    viewCount: 640,
    likeCount: 72,
    paragraphs: [
      "적축, 청축, 갈축... 처음 입문할 때 헷갈렸던 스위치 종류를 정리했습니다.",
      "타건감과 소음 수준을 기준으로 비교해봤어요.",
    ],
  },
  {
    id: "mock-15",
    title: "Docker Compose로 로컬 개발 환경 통일하기",
    category: "개발",
    author: mockAuthors[2],
    createdDaysAgo: 16,
    viewCount: 1050,
    likeCount: 134,
    paragraphs: [
      "팀원마다 로컬 환경이 달라서 생기던 문제를 Docker Compose로 해결했습니다.",
      "DB, 캐시 서버까지 한 번에 띄우는 설정 파일을 공유해요.",
    ],
  },
  {
    id: "mock-16",
    title: "새벽 기상 습관, 100일 실천 후기",
    category: "일상",
    author: mockAuthors[3],
    createdDaysAgo: 17,
    viewCount: 355,
    likeCount: 41,
    paragraphs: [
      "새벽 5시 기상을 100일간 실천하며 느낀 변화를 기록합니다.",
      "가장 큰 변화는 오전 시간을 온전히 제 것으로 쓸 수 있다는 점이었어요.",
    ],
  },
  {
    id: "mock-17",
    title: "북유럽 3개국 배낭여행 준비물 체크리스트",
    category: "여행",
    author: mockAuthors[0],
    createdDaysAgo: 18,
    viewCount: 1780,
    likeCount: 229,
    paragraphs: [
      "핀란드, 스웨덴, 노르웨이를 도는 배낭여행을 준비하며 만든 체크리스트입니다.",
      "날씨 변화가 심해서 레이어드 룩이 필수였어요.",
    ],
  },
  {
    id: "mock-18",
    title: "회의 없는 하루, 생산성이 이렇게 달라집니다",
    category: "일상",
    author: mockAuthors[1],
    createdDaysAgo: 19,
    viewCount: 505,
    likeCount: 58,
    paragraphs: [
      "일주일에 하루는 회의를 잡지 않는 팀 문화를 실험해봤습니다.",
      "집중 업무 시간이 확보되니 팀 전체 생산성이 눈에 띄게 올랐어요.",
    ],
  },
  {
    id: "mock-19",
    title: "노션 vs 옵시디언, 개인 지식 관리 도구 비교",
    category: "리뷰",
    author: mockAuthors[2],
    createdDaysAgo: 20,
    viewCount: 1410,
    likeCount: 187,
    paragraphs: [
      "두 도구를 각각 3개월씩 써보고 장단점을 비교했습니다.",
      "협업이 중요하면 노션, 로컬 저장과 커스터마이징이 중요하면 옵시디언을 추천해요.",
    ],
  },
  {
    id: "mock-20",
    title: "사이드 프로젝트를 끝까지 완주하는 법",
    category: "기타",
    author: mockAuthors[3],
    createdDaysAgo: 21,
    viewCount: 2075,
    likeCount: 298,
    paragraphs: [
      "여러 번 사이드 프로젝트를 중도 포기하다가 이번엔 끝까지 완주했습니다.",
      "범위를 작게 잡고, 매주 결과물을 공개한 게 큰 도움이 됐어요.",
    ],
  },
];

export const MOCK_POSTS: Post[] = seeds.map((seed) => ({
  id: seed.id,
  author_id: seed.author.id,
  title: seed.title,
  content: buildContent(seed.paragraphs),
  excerpt: seed.paragraphs[0],
  cover_image_url: null,
  category: seed.category,
  view_count: seed.viewCount,
  like_count: seed.likeCount,
  hot_score: seed.viewCount + seed.likeCount * 2,
  created_at: daysAgo(seed.createdDaysAgo),
  updated_at: daysAgo(seed.createdDaysAgo),
  profiles: seed.author,
}));

export function getMockPosts({
  tab,
  category,
}: {
  tab: "latest" | "hot";
  category?: string;
}): Post[] {
  let posts = category
    ? MOCK_POSTS.filter((p) => p.category === category)
    : MOCK_POSTS;

  posts = [...posts];
  if (tab === "hot") {
    posts.sort((a, b) => b.hot_score - a.hot_score);
  } else {
    posts.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }
  return posts;
}

export function getMockPostById(id: string): Post | undefined {
  return MOCK_POSTS.find((p) => p.id === id);
}
