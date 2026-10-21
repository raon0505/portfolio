#!/usr/bin/env bash
# PostToolUse(Edit|Write): 방금 수정한 파일 하나만 eslint/stylelint로 검사한다.
# 실패하면 exit 2 → 에러 내용이 Claude에게 전달되어 바로 고치게 된다.
set -u

file=$(jq -r '.tool_input.file_path // .tool_response.filePath // empty')
[ -z "$file" ] && exit 0

root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
case "$file" in
  "$root"/node_modules/* | "$root"/.next/*) exit 0 ;;
  "$root"/*) ;;
  *) exit 0 ;;
esac
[ -f "$file" ] || exit 0
cd "$root" || exit 0

case "$file" in
  *.ts | *.tsx | *.mjs | *.js) out=$(pnpm exec eslint --max-warnings 0 "$file" 2>&1); status=$? ;;
  *.css) out=$(pnpm exec stylelint --max-warnings 0 "$file" 2>&1); status=$? ;;
  *) exit 0 ;;
esac

if [ "$status" -ne 0 ]; then
  echo "lint 실패: ${file#"$root"/}" >&2
  echo "$out" >&2
  exit 2
fi
exit 0
