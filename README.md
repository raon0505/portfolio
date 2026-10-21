# 이승환 포트폴리오

Next.js 16.4 (App Router) · React 19.3 · TypeScript · CSS Modules

## 시작하기

pnpm만 사용한다 (`packageManager`로 버전 고정).

```bash
pnpm install
cp .env.example .env.local   # 필요한 값 채우기
pnpm dev                     # http://localhost:3000
```

## 스크립트

| 명령 | 내용 |
| --- | --- |
| `pnpm dev` | 개발 서버 |
| `pnpm lint` | ESLint (경고 0) |
| `pnpm lint:css` | Stylelint (경고 0) |
| `pnpm typecheck` | 라우트 타입 생성 + `tsc --noEmit` |
| `pnpm build` / `pnpm start` | 프로덕션 빌드 / 실행 |
| `pnpm check` | lint → lint:css → typecheck → build |
| `pnpm test:e2e` | Playwright + axe 접근성 검사 (최초 1회 `pnpm exec playwright install chromium`) |

## 환경 변수

| 이름 | 설명 |
| --- | --- |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 측정 ID. 비어 있으면 GA를 로드하지 않음 |

## 구조와 규칙

- 디렉터리 구조·코딩 규칙·완료 기준: [AGENTS.md](AGENTS.md)
- 스타일링 가이드: [docs/styling.md](docs/styling.md)
- 콘텐츠(프로필·프로젝트·경력)는 `data/`에서 수정한다
