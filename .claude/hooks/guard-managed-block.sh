#!/usr/bin/env bash
# PreToolUse(Edit|Write): AGENTS.md 상단 nextjs-agent-rules managed block(next dev가 관리)의 변경을 막는다.
set -u

input=$(cat)
file=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty')
case "$file" in
  */AGENTS.md) ;;
  *) exit 0 ;;
esac
[ -f "$file" ] || exit 0

printf '%s' "$input" | python3 -c '
import json, re, sys

data = json.load(sys.stdin)
tool = data.get("tool_name")
args = data.get("tool_input", {})
path = args["file_path"]
current = open(path, encoding="utf-8").read()

if tool == "Write":
    updated = args.get("content", "")
elif tool == "Edit":
    old, new = args.get("old_string", ""), args.get("new_string", "")
    updated = current.replace(old, new) if args.get("replace_all") else current.replace(old, new, 1)
else:
    sys.exit(0)

pattern = re.compile(r"<!-- BEGIN:nextjs-agent-rules -->.*?<!-- END:nextjs-agent-rules -->", re.S)
before = pattern.search(current)
after = pattern.search(updated)
if before and (not after or before.group(0) != after.group(0)):
    print("AGENTS.md 상단 nextjs-agent-rules managed block은 next dev가 관리한다. 이 구간은 수정·삭제하지 말고 아래쪽만 편집할 것.", file=sys.stderr)
    sys.exit(2)
'
