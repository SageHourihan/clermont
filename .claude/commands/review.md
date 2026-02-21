Review the code changes made in this session using the review subagent.

Use the Task tool to invoke the `review` subagent. Pass it the instruction: "Review all changes since the last commit. Run git diff HEAD to get the diff, then read each changed file and produce a full review report."

After the review agent returns its report, display the full report to the user. If the verdict is BLOCKED, summarize the required fixes clearly and ask the user how they'd like to proceed.
