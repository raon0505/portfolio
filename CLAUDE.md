@AGENTS.md

## Claude Code 전용

- 큰 작업(섹션 2개 이상, 구조 변경)은 plan 모드로 계획을 먼저 보여준다
- `.claude/settings.json`의 hook이 자동으로 돈다
  - 파일 수정 직후: 해당 파일만 eslint/stylelint (실패 시 에러가 전달됨 → 바로 고친다)
  - 응답 종료 시: `pnpm lint` · `pnpm lint:css` · `pnpm typecheck`
- hook은 build · e2e를 돌리지 않는다. DoD의 `pnpm check`, `pnpm test:e2e`는 직접 실행하고 결과를 보고한다
