#!/usr/bin/env bash
# PreToolUse hook (Bash): blocks a blanket `git add`/`git commit` from
# sweeping up known-local-only secret files. This project's own blog post
# (posts/rebuilding-this-site.md) describes exactly this happening once
# already, caught only by GitGuardian after the push. Deliberate,
# explicitly-named adds of a specific file still go through — only blanket
# adds (-A, -a, ., --all) are blocked when a sensitive file is present.
set -euo pipefail

input=$(cat)
command=$(printf '%s' "$input" | python3 -c "import json,sys; print(json.load(sys.stdin).get('tool_input',{}).get('command',''))" 2>/dev/null || true)

if ! printf '%s' "$command" | grep -qE '\bgit[[:space:]]+(add|commit)\b'; then
  exit 0
fi

if ! printf '%s' "$command" | grep -qE -- '(-A\b|--all\b|-a\b|git[[:space:]]+add[[:space:]]+\.([[:space:]]|$)|git[[:space:]]+add[[:space:]]+-u\b)'; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}"

sensitive_pattern='(^|/)local\.settings\.json$|(^|/)appsettings\.[^./]+\.json$|(^|/)credentials\.[^./]+\.json$|\.secret\.json$'
exception_pattern='appsettings\.Template\.json$|example\.secret\.json$'

found=$(git status --porcelain 2>/dev/null | awk '{print $2}' | grep -E "$sensitive_pattern" | grep -vE "$exception_pattern" || true)

if [ -n "$found" ]; then
  {
    echo "Blocked: this git command would stage/commit files that look like local secrets:"
    echo "$found"
    echo ""
    echo "These should stay gitignored. If one of these is genuinely a safe template (no real secret values), add it explicitly by filename instead of via a blanket add."
  } >&2
  exit 2
fi

exit 0
