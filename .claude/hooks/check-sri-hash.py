#!/usr/bin/env python3
"""PostToolUse hook (Edit|Write): after touching an .html file, verify any
sha384 SRI `integrity` hash on a <script> tag still matches what its `src`
actually serves. A stale/mistyped hash silently blocks the script in the
browser with no obvious error beyond a console message — this has happened
for real in this codebase (a wrong marked.js hash broke blog post rendering
site-wide until caught by a test run). CLAUDE.md documents the fix by hand;
this hook catches it automatically instead.
"""
import base64
import hashlib
import json
import re
import sys
import urllib.request

SCRIPT_TAG = re.compile(r"<script\b[^>]*>", re.IGNORECASE | re.DOTALL)
SRC_ATTR = re.compile(r'src\s*=\s*"([^"]+)"')
INTEGRITY_ATTR = re.compile(r'integrity\s*=\s*"sha384-([^"]+)"')


def main() -> int:
    data = json.load(sys.stdin)
    file_path = data.get("tool_input", {}).get("file_path", "")
    if not file_path.endswith(".html"):
        return 0

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except OSError:
        return 0

    problems = []

    for tag in SCRIPT_TAG.findall(content):
        src_match = SRC_ATTR.search(tag)
        integrity_match = INTEGRITY_ATTR.search(tag)
        if not src_match or not integrity_match:
            continue

        src = src_match.group(1)
        declared_hash = integrity_match.group(1)
        if not src.startswith("http"):
            continue

        try:
            with urllib.request.urlopen(src, timeout=10) as resp:
                body = resp.read()
        except Exception as e:
            problems.append(f"  {src}: could not fetch to verify ({e})")
            continue

        actual_hash = base64.b64encode(hashlib.sha384(body).digest()).decode()
        if actual_hash != declared_hash:
            problems.append(
                f"  {src}\n"
                f"    declared: sha384-{declared_hash}\n"
                f"    actual:   sha384-{actual_hash}\n"
                f"    recompute with: curl -sSL '{src}' | openssl dgst -sha384 -binary | openssl base64 -A"
            )

    if problems:
        print(
            f"SRI hash mismatch in {file_path} — this will silently block the script in browsers:",
            file=sys.stderr,
        )
        print("\n".join(problems), file=sys.stderr)
        return 2

    return 0


if __name__ == "__main__":
    sys.exit(main())
