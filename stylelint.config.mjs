/** 스타일 규칙(AGENTS.md · docs/styling.md)을 강제한다. */
const config = {
  extends: ["stylelint-config-standard"],
  rules: {
    // CSS Modules 클래스는 camelCase (styles.cardTitle)
    "selector-class-pattern": [
      "^[a-z][a-zA-Z0-9]*$",
      { message: "클래스명은 camelCase로 작성한다 (예: .projectCard)" },
    ],
    // 컴포넌트당 루트 클래스 1개 + & nesting. 내부는 요소·속성 선택자로
    "selector-max-class": [
      1,
      { message: "한 선택자에 클래스는 1개만. 내부 요소는 & > h3, 상태는 &[data-*]로 선택한다" },
    ],
    // nesting 내부에는 클래스를 쓰지 않는다 (selector-max-class는 & nesting을 해석하지 않아서 별도 규칙)
    "selector-nested-pattern": [
      "^[^.]*$|:global\\(",
      { message: "nesting 안에서는 클래스 대신 요소(& > h3)·속성(&[data-*]) 선택자를 쓴다" },
    ],
    "max-nesting-depth": [3, { ignore: ["pseudo-classes"] }],
    // Sass식 문자열 결합(&__title, &-active)은 표준 CSS nesting에서 동작하지 않는다
    "selector-disallowed-list": [
      ["/&[-_]/"],
      { message: "Sass식 &-x / &__x 결합은 표준 CSS nesting에서 동작하지 않는다" },
    ],
    // 색은 globals.css 토큰(var(--color-*))만 사용
    "color-no-hex": [true, { message: "색은 var(--color-*) 토큰을 사용한다" }],
    "color-named": ["never", { message: "색은 var(--color-*) 토큰을 사용한다" }],
    "function-disallowed-list": [
      ["rgb", "rgba", "hsl", "hsla", "oklch", "oklab", "lab", "lch"],
      { message: "색은 var(--color-*) 토큰을 사용한다" },
    ],
    // 토큰을 의미 단위로 묶어 빈 줄로 구분한다
    "custom-property-empty-line-before": null,
    // CSS Modules 함수형 :global(...)만 허용
    "selector-pseudo-class-no-unknown": [true, { ignorePseudoClasses: ["global"] }],
  },
  overrides: [
    {
      // 토큰을 정의하는 곳이므로 색 값 규칙을 해제한다
      files: ["app/globals.css"],
      rules: {
        "color-no-hex": null,
        "color-named": null,
        "function-disallowed-list": null,
        // Safari는 아직 접두사가 필요하다
        "property-no-vendor-prefix": [true, { ignoreProperties: ["/text-size-adjust$/"] }],
      },
    },
  ],
  ignoreFiles: [".next/**", "node_modules/**", "out/**", "build/**", "playwright-report/**", "test-results/**"],
};

export default config;
