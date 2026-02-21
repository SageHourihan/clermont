#!/usr/bin/env bash
# post-edit-review.sh
# Fires after Edit or Write tool use. Injects a one-time review reminder
# into the Claude conversation so it runs the review agent when done.
#
# Uses a per-session flag file (keyed on claude's PID) to inject only once —
# not after every individual file edit.

set -euo pipefail

INPUT=$(cat)

TOOL_NAME=$(echo "$INPUT" | python3 -c "
import json, sys
try:
    d = json.load(sys.stdin)
    print(d.get('tool_name', ''))
except Exception:
    print('')
" 2>/dev/null || echo "")

# Only act on file-editing tools
if [[ "$TOOL_NAME" != "Edit" && "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "MultiEdit" ]]; then
    exit 0
fi

# Use parent PID (the claude process) as session key
SESSION_FLAG="/tmp/clermont-review-${PPID}.flag"

if [ -f "$SESSION_FLAG" ]; then
    # Already reminded this session — stay silent
    exit 0
fi

# Mark reminder as sent for this session
touch "$SESSION_FLAG"

# Exit code 2 + stdout injects this message into Claude's context
echo "Code files have been modified. When you have finished all edits for this task, use the Task tool to invoke the 'review' subagent to check the changes before considering the work done."
exit 2
