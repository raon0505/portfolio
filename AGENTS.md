<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Portfolio — Agent Guide

이승환의 개인 포트폴리오 사이트. 한국어 전용, 단일 페이지(섹션 앵커) 중심이며 프로젝트 상세는 `/projects/[slug]`로 확장 예정.
이 파일은 에이전트가 **매 세션 처음 읽는 지도**다. 짧게 유지하고, 상세 내용은 아래 링크된 문서로 넘긴다.

## Stack (버전 고정 — 학습 데이터 기준으로 추측하지 말 것)

- Next.js **16.4** App Router · React **19.3** · TypeScript strict
- 스타일: **CSS Modules + 전역 CSS 변수**, 표준 CSS nesting(`&`). Tailwind·CSS-in-JS·Sass·UI 라이브러리 사용 금지
- `next.config.ts`: `cacheComponents: true`, `partialPrefetching: true` → 데이터/캐싱 코드 작성 전 아래 문서 필수 확인
- pnpm 11 (`packageManager` 고정). npm/npx/yarn/bun 사용 금지
- 검증 도구: ESLint · Stylelint · Playwright + axe

## Commands

```bash
pnpm dev              # 개발 서버 (AGENTS.md 상단 managed block을 재생성함)
pnpm lint             # ESLint, 경고 0
pnpm lint:css         # Stylelint, 경고 0 (스타일 규칙 강제)
pnpm typecheck        # next typegen + tsc --noEmit
pnpm build            # cacheComponents 관련 오류는 여기서 드러남
pnpm check            # lint → lint:css → typecheck → build 한 번에
pnpm test:e2e         # 프로덕션 빌드로 접근성·랜드마크 검사 (light/dark/mobile)
```

## Definition of Done

작업을 끝냈다고 보고하기 전에 순서대로 통과시킨다. 실패하면 고치고 다시 돌린다.

1. `pnpm check` 통과 (라우트를 추가·이동했다면 typecheck가 typegen을 포함함)
2. UI·라우트·마크업 변경이면 `pnpm test:e2e` 통과
3. 보고 시 실행한 명령과 결과를 함께 적는다. 돌리지 않은 검증을 통과했다고 쓰지 않는다

## Harness (규칙을 기계가 강제하는 곳)

| 규칙 | 강제 장치 |
| --- | --- |
| npm/npx/yarn/bun 금지, lockfile 수동 편집 금지, `.env` 읽기 금지 | `.claude/settings.json` permissions.deny |
| 수정한 파일 즉시 lint | `.claude/hooks/lint-file.sh` (PostToolUse) |
| managed block 수정 금지 | `.claude/hooks/guard-managed-block.sh` (PreToolUse) |
| 종료 전 lint · lint:css · typecheck | `.claude/hooks/verify-on-stop.sh` (Stop) |
| `../` import 금지, 컴포넌트 named export 금지, Tailwind/CSS-in-JS import 금지 | `eslint.config.mjs` |
| 스타일 규칙 (아래 Styling) | `stylelint.config.mjs` |
| 랜드마크 · h1 1개 · 섹션 제목 · skip link · WCAG AA | `e2e/a11y.spec.ts` |
| 위 전부 + build | `.github/workflows/ci.yml` |

- hook·lint가 막으면 우회하지 말고 원인을 고친다. 규칙 자체가 틀렸다고 판단되면 사용자에게 먼저 묻는다

## Directory Map

```
app/globals.css           디자인 토큰(CSS 변수) · 리셋 · 기본 타이포그래피만
app/layout.tsx            루트 레이아웃 (<html lang="ko-KR">, Header/Footer, GA)
app/page.tsx              메인 페이지 (<main id="main"> + 섹션 조합)
app/**/_components/       해당 라우트 전용 컴포넌트 (_ 접두사 = 라우팅 제외) — (예정)
components/layout/        Header(skip link + 주 메뉴), Footer — layout.tsx에서만 사용
components/sections/      Hero, About, Projects, Experience, Contact — page.tsx의 <main> 안
components/ui/            재사용 단위 (Section …)
data/                     profile · projects · experience · navigation (타입 포함)
lib/                      유틸 — (예정)
e2e/                      Playwright 테스트
docs/                     상세 규칙 (styling.md)
.claude/                  Claude Code 권한·hook
public/                   정적 자산
```

- import는 `@/` 별칭 사용 (`@/*` → 루트). 상대경로 `../` 금지 (같은 폴더의 `./X.module.css`는 예외)

## Conventions

### Export & 파일
- **모든 컴포넌트는 default export** (라우트 파일과 통일). 한 파일 = 한 컴포넌트
- 파일명·컴포넌트명은 PascalCase로 일치시킨다 (`Header.tsx` → `export default function Header`)
- import 시 컴포넌트 이름을 파일명과 다르게 바꾸지 않는다 (`import SiteHeader from './Header'` 금지)
- `data/`·`lib/`는 named export (`export const projects`) + 타입 함께 export

### Server / Client
- 기본은 Server Component. 상태·이벤트·브라우저 API가 필요할 때만 `'use client'`
- `'use client'`는 가능한 한 말단(leaf) 컴포넌트에 둔다. 섹션 전체를 클라이언트로 만들지 않는다
- `cacheComponents` 환경: `Date.now()`·`Math.random()`·`crypto.randomUUID()` 같은 비결정 값은 명시적으로 처리해야 한다 (`connection()` + `<Suspense>` 또는 `'use cache'`). `08-caching.md`의 "Random values and timestamps" 참고

### Markup & 접근성
- 랜드마크: `layout.tsx`에 `header`(+`nav`)·`footer`, 페이지 본문은 `<main id="main">` 하나
- `<main>` 안은 `section`(제목 필수, `components/ui/Section` 사용) → 독립 콘텐츠(프로젝트 카드)는 `article`
- 제목 계층: 페이지당 `h1` 하나(Hero), 섹션 `h2`, 카드 `h3`. 레벨 건너뛰기 금지
- 메뉴 항목은 `data/navigation.ts`에서 관리하고 id는 `section id`와 일치시킨다
- `nav`·`aside`가 2개 이상이면 `aria-label`로 구분
- 이미지는 `next/image` + 의미 있는 `alt` (장식용은 `alt=""`)
- 색 대비 WCAG AA, 키보드 포커스 표시 제거 금지, skip link 유지

### Styling (CSS Modules) — 상세·예시는 [docs/styling.md](docs/styling.md)
- 컴포넌트 스타일은 같은 폴더의 `Component.module.css`. **컴포넌트당 루트 클래스 1개**(camelCase)
- 내부는 `&` nesting + 시맨틱 요소 선택자 (`& > h3`). nesting 안에 클래스 금지
- 변형·상태는 클래스 대신 `data-*`/`aria-*` 속성 (`&[data-featured]`, `&[aria-current="page"]`)
- 직계 결합자(`& > p`) 우선. 자식 *컴포넌트* 내부는 스타일링하지 않는다
- `&`는 항상 명시. Sass식 `&-x`/`&__x` 금지. nesting 깊이 3 이하(의사 클래스 제외)
- 미디어 쿼리는 루트 안에 중첩, 모바일 우선 `@media (width >= 768px)`. 브레이크포인트는 **768px / 1024px** 고정
- 색·폰트·간격·글자 크기는 `globals.css` 토큰(`var(--color-*)`, `--space-*`, `--text-*`)만. 하드코딩 금지 (브레이크포인트·1px/2px 선 두께 예외)
- 새 토큰은 `globals.css`의 `:root`에 추가하고 다크모드 값도 같이 정의. `globals.css`에 컴포넌트 스타일 금지
- `:global`은 함수형 `:global(...)`만. `composes`·`@import` 대상은 `.module.css`만
- 인라인 `style`은 런타임 계산 값(CSS 변수 주입 등)에만 사용

### Content
- **한국어 전용**. 내비게이션·섹션 제목·버튼 등 모든 UI 문구를 한국어로 쓴다 (`lang="ko-KR"`)
- 기술·제품명은 원문 표기 (React, Next.js, AWS). 음차 금지
- 프로젝트·경력 등 콘텐츠는 `data/`에서 가져온다. 컴포넌트에 하드코딩하지 않는다
- 경력·수치·기술스택은 사용자가 제공한 사실만 쓴다 — **지어내지 않는다**. 모르는 값은 비워 두고 `// TODO` 주석 (화면엔 "준비 중")
- 환경별 값(GA ID 등)은 `.env.local` / `.env.example`. 코드에 하드코딩하지 않는다
- 다국어(i18n) 도입은 사용자 요청이 있을 때만

## Boundaries

- ✅ 그냥 해도 됨: 컴포넌트/섹션 추가, 스타일 수정, `data/` 구조 제안, lint 수정, e2e 테스트 추가
- ⚠️ 먼저 물어볼 것: 의존성 추가·업그레이드, `next.config.ts`·`tsconfig.json`·`eslint.config.mjs`·`stylelint.config.mjs`·`playwright.config.ts`·`pnpm-workspace.yaml`·`.claude/`·`.github/` 변경, 라우트 구조 변경, 디렉터리 규칙 변경, 토큰 색상 변경(대비 재검증 필요)
- 🚫 하지 말 것: Tailwind 재도입, `.env*` 커밋(`.env.example` 제외), 상단 `nextjs-agent-rules` managed block 수정·삭제, `pnpm-lock.yaml` 수동 편집, lint/hook 규칙을 끄거나 `eslint-disable`·`stylelint-disable`로 우회, 실제 개인정보(전화번호 등)를 사용자 확인 없이 노출

## Where to Look (필요할 때만 읽기)

| 작업 | 문서 (`node_modules/next/dist/docs/01-app/`) |
| --- | --- |
| 폴더·파일 규칙 | `01-getting-started/02-project-structure.md` |
| Server/Client 경계 | `01-getting-started/05-server-and-client-components.md` |
| 데이터 패칭·캐싱 (`cacheComponents`) | `01-getting-started/06-fetching-data.md`, `08-caching.md` |
| CSS Modules · 순서 | `01-getting-started/11-css.md` |
| CSS nesting · Lightning CSS 제약 | `03-api-reference/08-turbopack.md` (CSS and styling, Unsupported features) |
| 메타데이터·OG 이미지 | `01-getting-started/14-metadata-and-og-images.md` |
| Google Analytics 등 서드파티 | `02-guides/third-party-libraries.md` |
| 환경 변수 | `02-guides/environment-variables.md` |
| Partial Prefetching | `02-guides/adopting-partial-prefetching.md` |

## Maintaining This File

- 에이전트가 같은 실수를 두 번 하면 → 가능하면 lint/hook/test로 강제하고, 안 되면 여기에 한 줄 추가
- 규칙이 길어지면 → `docs/`로 분리하고 여기엔 링크만 남김
- 실제 코드와 어긋난 규칙은 발견 즉시 고친다 (낡은 지도는 없는 지도보다 나쁘다)
