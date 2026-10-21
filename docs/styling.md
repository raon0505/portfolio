# 스타일링 가이드 (CSS Modules + 표준 CSS nesting)

AGENTS.md의 Styling 규칙에 대한 근거와 예시. 규칙 대부분은 `stylelint.config.mjs`가 강제한다.

## 기본 패턴: 루트 클래스 1개 + `&` nesting

```css
/* ProjectCard.module.css */
.card {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-4);

  & > h3 { font-size: var(--text-lg); }
  & > p  { color: var(--color-muted); }

  & a {
    color: var(--color-accent);

    &:hover { text-decoration: underline; }
    &:focus-visible { outline: 2px solid var(--color-focus); }
  }

  /* 변형·상태는 클래스 대신 속성으로 */
  &[data-featured] { border-color: var(--color-accent); }

  @media (width >= 768px) {
    grid-template-columns: 1fr 2fr;
  }
}
```

```tsx
<article className={styles.card} data-featured={featured || undefined}>
  <h3>{title}</h3>
  <p>{summary}</p>
</article>
```

시맨틱 마크업(`section` · `article` · `h3`)이 정확하면 클래스 없이도 선택자가 명확하다.
즉 접근성 규칙과 이 스타일 규칙은 서로를 강화한다.

## 왜 되는가 (Next.js 16.4 기준)

- Turbopack은 항상 Lightning CSS로 CSS를 처리하고, 표준 CSS nesting을 지원한다. 브라우저 타깃에 맞춰 필요하면 자동으로 펼친다 — Sass 불필요
- CSS Modules는 최상위 선택자에 로컬 클래스가 있어야 한다(pure). 루트 클래스 안에 모두 중첩하면 자동으로 충족된다
- Lightning CSS 제약: 단독 `:global`/`:local`, `@value`, `:export` 미지원. `composes`·`@import` 대상이 `.css`면 전역 취급 → 반드시 `.module.css`
- CSS 순서는 JS import 순서를 따른다. 여러 모듈이 같은 요소의 같은 속성을 덮어쓰지 않게 한다

## 주의할 점

1. **스며듦** — CSS Modules가 스코프하는 건 클래스뿐이다. `.card p`는 카드 안에 들어간 *다른 컴포넌트*의 `p`에도 걸린다.
   → 직계 결합자(`& > p`)를 우선하고, 이 컴포넌트가 직접 렌더링하는 요소만 스타일링한다.
2. **우선순위 역전** — `.card h3`(0,1,1)는 자식 컴포넌트의 `.title`(0,1,0)을 이긴다.
   → 부모는 자식 컴포넌트에 배치(margin, grid 위치)만 준다. 부득이하면 `& :where(h3)`로 우선순위를 낮춘다.
3. **Sass 습관** — `&__title`, `&-active` 같은 문자열 결합은 표준 nesting에서 동작하지 않는다 (stylelint가 차단).
4. **`&` 생략 금지** — 최신 스펙은 `h3 {}`도 허용하지만 일관성과 구형 Safari를 위해 `& > h3`로 쓴다.
5. **깊이** — 3단계를 넘으면 컴포넌트를 쪼갈 신호다.
6. **미디어 쿼리에 CSS 변수 불가** — 브레이크포인트는 768px / 1024px로 고정하고 range 문법(`width >= 768px`)을 쓴다.

## 클래스를 추가해도 되는 예외

nesting 안에는 클래스를 쓸 수 없으므로(stylelint), 필요하면 **최상위에 별도 루트 클래스**를 하나 더 만든다.

- 같은 태그가 서로 다른 역할로 반복될 때 → 우선 `data-*`로 구분 (`<p data-meta>`), 그래도 복잡하면 별도 클래스
- 의미 없는 래퍼(`div`, `span`)라 선택자로 의도가 드러나지 않을 때
- 부모가 자식 컴포넌트에 `className`을 넘겨 배치를 지정할 때

## 토큰

`app/globals.css`의 `:root`에 정의. 새 토큰은 라이트·다크 값을 함께 추가하고, 색은 본문 대비 4.5:1 이상인지 확인한다
(`pnpm test:e2e`의 axe 검사가 light/dark 모두 확인).

| 종류 | 토큰 |
| --- | --- |
| 색 | `--color-background` `--color-foreground` `--color-muted` `--color-accent` `--color-border` `--color-focus` |
| 글자 | `--font-sans` `--font-mono` · `--text-sm` `--text-base` `--text-lg` `--text-xl` `--text-2xl` |
| 간격 | `--space-1` `-2` `-3` `-4` `-6` `-8` `-12` `-16` |
| 레이아웃 | `--content-width` `--radius` |
