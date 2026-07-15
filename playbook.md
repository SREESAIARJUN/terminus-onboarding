# Snorkel Terminal-Bench (Harbor) — Project Terminus Technical Manual

This guide outlines the critical engineering standards for authoring valid tasks on the Terminus platform. 

---

## 1. Benchmark Philosophy & Golden Rules

Project Terminus evaluates frontier AI coding agents (Claude, GPT-5) on practical, long-horizon software engineering workflows in isolated containers.

- **Human Solvability vs. AI Challenge:** Tasks must be solvable confidently by an expert engineer, but cause frontier agents to struggle meaningfully.
- **Strict Difficulty Targets:** Tasks must be calibrated to **Medium** (20–60% pass rate) or **Hard** (≤20% pass rate). Python tasks **MUST** be Hard.
- **Milestone Preference:** Multi-step sequential workflows are highly preferred over single-step algorithms.
- **Environment Reproducibility:** Every execution environment must be fully reproducible, offline-capable, and digest-pinned.

---

## 2. Platform Architecture & Isolation

**Harbor** orchestrates the execution lifecycle:
1. **Build Phase:** Compiles the environment from your `Dockerfile` entirely offline. 
2. **Launch Phase:** Boots the container with strict CPU/memory limits, non-privileged execution, and no internet access (`allow_internet = false`).
3. **Agent Runtime:** The AI agent initializes with terminal access. It never sees the tests or oracle solutions.
4. **Verifier Runtime:** Harbor runs your hidden tests to grade the workspace.

---

## 3. Directory Structures (The Milestone Skeleton)

Milestone tasks group instructions, solutions, and verifiers into sequential steps. This is the required layout for multi-step tasks:

\`\`\`text
my-task-name/
├── task.toml              # Task configuration
├── environment/
│   └── Dockerfile         # Base Docker image shared across all steps
└── steps/
    ├── milestone_1/
    │   ├── instruction.md # What the agent needs to do for Step 1
    │   ├── solution/
    │   │   └── solve1.sh  # Script to programmatically solve Step 1
    │   └── tests/
    │       ├── test.sh    # Test runner for Step 1
    │       └── test_m1.py # Pytest verifier for Step 1
    └── milestone_2/
        ...
\`\`\`

---

## 4. Configuration (task.toml)

The `task.toml` file provides settings read by Harbor to control the runtime constraints and scoring.

**Required Fields:**
* `metadata.difficulty`: "easy", "medium", "hard", or "unknown".
* `metadata.category`: e.g. "software-engineering", "debugging".
* `agent.timeout_sec`: Hard max duration for the agent (e.g., 600).
* `environment.allow_internet`: **Must be false.**
* `environment.os`: The OS target (e.g., "linux").
* `environment.workdir`: Default active container directory (e.g., "/app").

**Default Template:**
\`\`\`toml
[metadata]
name = "my-task-name"
difficulty = "hard"
language = "python"
milestone_count = 2
category = "software-engineering"

[resources]
timeout_seconds = 600
cpu_limit = 2
memory_limit_mb = 2048

[environment]
os = "linux"
dockerfile = "environment/Dockerfile"
allow_internet = false
workdir = "/app"

[scoring]
points_total = 100
allow_partial_credit = true
\`\`\`

---

## 5. Docker Engineering Standards

Strict validation gates apply to Dockerfile engineering:

1. **Immutable Base Images:** Every `FROM` directive **must** specify an exact image digest (`@sha256:...`). Floating tags (like `ubuntu:latest`) are strictly forbidden.
2. **Mandatory Tools:** You **must** install `tmux` and `asciinema` in the image so the platform can record agent actions.
3. **100% Offline Capability:** The task container must build completely without requiring runtime downloads (`pip` or `npm install` are forbidden during agent execution).
4. **No File Leaks:** Never copy your `solution/` or `tests/` directories into the Docker image at build time.

---

## 6. Authoring Instructions (instruction.md)

Instructions should read like authentic communication from a coworker on Slack or Jira.

* **Focus on Outcomes:** Say *what* needs to be achieved, never *how* to achieve it.
* **Use Absolute Paths:** Always refer to targets using absolute paths (e.g., `/app/data/config.json`).
* **Avoid Handholding:** Do not leak exact line numbers, exact solution methods, or exact file names if the agent can reasonably search for them.

---

## 7. The Oracle Solution (solve.sh)

The Oracle Solution is the reference answer key. 
* It must achieve a perfect 1.0 reward deterministically on every run.
* It must resolve the bug dynamically (using `sed`, `patch`, or scripts) rather than echoing static mock responses into the output paths.

---

## 8. Verifier Architecture (test.sh)

The verifier executes tests to evaluate the agent's work. It must test observable system behavior, not string-match the agent's code.

**Crucial Gotcha: Exit Code Suppression**
Do **NOT** append `exit 0` or `exit $?` at the very end of `test.sh`. The final block must be the `if/else` wrapper writing to `/logs/verifier/reward.txt`.

**Gold Standard test.sh:**
\`\`\`bash
#!/bin/bash
set -e
cd /app

pytest tests/test_outputs.py -v --tb=short > /logs/verifier/pytest_output.log 2>&1

if [ $? -eq 0 ]; then
    echo "1.0" > /logs/verifier/reward.txt
else
    echo "0.0" > /logs/verifier/reward.txt
fi
# WARNING: Do NOT put exit $? or exit 0 below this line!
\`\`\`

---

## 9. Anti-Cheating and Exploit Prevention

A task is invalid if an agent can bypass the intended engineering work to score points. Prevent cheating by:
1. Keeping the test validation suite hidden/read-only during agent runtime.
2. Using randomized parameters or varying payloads in your tests so agents cannot hardcode outputs.
3. Checking actual filesystem or database state changes rather than just terminal stdout.

---

## 10. Local Debugging & Submission

**Standard CLI Commands:**
\`\`\`bash
# 1. Initialize a Milestone task scaffold
stb init my-task-name -p <project_id> -t milestone

# 2. Launch container for interactive debugging
stb harbor tasks start-env -p ./my-task-name -i

# 3. Run the Oracle locally to prove human solvability
stb harbor run -a oracle -p ./my-task-name
\`\`\`

**The ZIP Gotcha:**
When packaging your task for submission, do **NOT** zip the parent task folder itself. Open the task directory, select all the files inside (`task.toml`, `environment/`, `steps/`), and compress the files directly.

**Rubric Acceptance Thresholds:**
* `90–100` points: Strong Acceptance Candidate
* `75–89`: Revision Required
* `<74`: Major Revision / Rejection
*(Scoring is weighted heavily on Realism, Determinism, Difficulty Calibration, and Exploit Resistance).*
