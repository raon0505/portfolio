#!/usr/bin/env bash
# Stop: 코드 변경이 있으면 lint · lint:css · typecheck를 돌린다.
# 실패하면 exit 2로 종료를 막고 Claude가 고치게 한다.
# 이미 한 번 막힌 뒤(stop_hook_active)에도 실패하면 무한 루프를 피하려고 경고만 남기고 통과시킨다.
# build · e2e는 느려서 여기서 돌리지 않는다 (AGENTS.md DoD · CI에서 확인).
set -u

active=$(jq -r '.stop_hook_active // false')
root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$root" || exit 0

changed=$(git status --porcelain -- '*.ts' '*.tsx' '*.mjs' '*.css' 2>/dev/null)
[ -z "$changed" ] && exit 0

out=$( { pnpm lint && pnpm lint:css && pnpm typecheck; } 2>&1 )
[ $? -eq 0 ] && exit 0

if [ "$active" = "true" ]; then
  jq -n --arg msg "Stop 검증 실패가 계속됨 (lint/typecheck). 직접 확인 필요." '{systemMessage: $msg}'
  exit 0
fi

echo "작업 종료 전 검증 실패 — 고친 뒤 다시 종료할 것:" >&2
printf '%s\n' "$out" | tail -40 >&2
exit 2
