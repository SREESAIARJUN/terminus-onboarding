# Project Terminus — The Master Guide

Welcome to the **Project Terminus** technical playbook. This guide is your definitive source for understanding how to build, test, and submit tasks for the Terminus platform.

---

## 1. Executive Summary & Core Philosophy

**Project Terminus** is an autonomy-first agent benchmarking platform. We evaluate how well frontier AI coding agents (like Claude Code and OpenHands) solve practical, real-world software engineering problems in isolated environments.

We don't test syntax memorization or toy puzzles. We test complex debugging, dependency management, and multi-step system administration.

### The Golden Rules of Task Creation
1. **Human Solvability vs. AI Challenge:** Tasks must be confidently solvable by an expert human engineer but cause frontier AI agents to struggle. We are not building impossible traps; we are exposing genuine reasoning limitations.
2. **Difficulty Calibration:** Tasks must be either **Medium** (20–60% AI pass rate) or **Hard** (≤20% pass rate). Tasks where agents achieve >60% are rejected.
3. **Python Rule:** Any task using Python as its primary language **must** be calibrated to Hard difficulty.
4. **Milestone Preference:** Multi-step workflows (milestone tasks) are highly preferred over single-step tasks.
5. **Absolute Reproducibility:** Every environment must be containerized, securely pinned, and fully offline-capable.

---

## 2. Platform Architecture & Isolation

Terminus uses the **Harbor** orchestration framework to spawn and monitor secure Docker sandboxes.

### The Sandbox Lifecycle
1. **Build Phase:** Harbor builds the environment strictly from your `Dockerfile`. All dependencies must be pre-installed. Runtime downloads are blocked.
2. **Launch Phase:** The container boots with bounded CPU/Memory limits, zero host filesystem mounts, and no internet access (`allow_internet = false`).
3. **Agent Runtime:** The AI agent initializes inside the container with terminal access. The agent *never* sees the verifier tests or the oracle solution.
4. **Verifier Runtime:** After the agent finishes, Harbor runs your validation tests to grade the workspace.
5. **Scoring:** Harbor reads the test output to determine if the agent succeeded or failed.

---

## 3. Directory Structures

You will primarily build **Milestone Tasks** (multi-step sequential workflows). 

### The Milestone Skeleton
A milestone task groups instructions, tests, and solutions sequentially.

\`\`\`text
my-task-name/
├── task.toml              # High-level configurations
├── environment/
│   └── Dockerfile         # Base Docker image shared across all steps
└── steps/
    ├── milestone_1/
    │   ├── instruction.md # What the agent needs to do for Step 1
    │   ├── solution/
    │   │   └── solve1.sh  # Your reference script to solve Step 1
    │   └── tests/
    │       ├── test.sh    # Test runner for Step 1
    │       └── test_m1.py # Pytest verifier for Step 1
    └── milestone_2/
        ├── instruction.md 
        ├── solution/
        │   └── solve2.sh  
        └── tests/
            ├── test.sh    
            └── test_m2.py 
\`\`\`

---

## 4. Configuration (task.toml)

The `task.toml` file controls runtime constraints and scoring.

### Standard Template
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

Strict validation gates apply to all Dockerfiles. 

1. **Immutable Base Images:** You must pin the exact image digest (`@sha256:...`). Floating tags like `ubuntu:latest` are strictly forbidden.
2. **Mandatory CLI Tools:** You must install `tmux` and `asciinema`. Without these, the platform cannot record the agent's terminal session.
3. **100% Offline:** The container must not require `npm install` or `pip install` during agent execution. Bake everything into the image at build time.
4. **No Test Leaks:** Never copy your `solution/` or `tests/` directories into the Docker image. 

---

## 6. Authoring Instructions (instruction.md)

Instructions should read like a real Slack message or Jira ticket from a coworker. 

* **Focus on Outcomes:** Describe the observable problem, not how to fix it. 
* **Use Absolute Paths:** Always say `/app/src/api.js`, never just `api.js`.
* **No Hints:** Do not leak file names or exact line numbers if the agent should reasonably search for them.

**Bad Example:** "Open `/app/api.py` and change the regex on line 42 to fix the bug."
**Good Example:** "The API is failing integration tests when malformed JSON is sent. Investigate the routing logic and ensure it returns an HTTP 400."

---

## 7. The Oracle Solution (solve.sh)

The Oracle is your reference answer key. It must programmatically solve the task.

* It must achieve a perfect score every time it runs.
* It must fix the issue dynamically (using `sed`, `patch`, or python scripts).
* It cannot simply hardcode the expected outputs or mock the system.

---

## 8. Verifiers & Testing (test.sh)

The verifier checks if the agent actually fixed the system.

1. **Behavioral Testing:** Test that the system works (e.g., the server returns a 200 OK). Do not write tests that just check if the agent used a specific function name.
2. **The Exit Code Rule:** The `test.sh` script must write `1.0` or `0.0` to `/logs/verifier/reward.txt`. **Never put `exit 0` at the bottom of test.sh.**

**Standard test.sh Template:**
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
\`\`\`

---

## 9. Anti-Cheating

If an AI agent can cheat your task, the task is invalid. 

* **Spoofing:** Agents might try to write `1.0` directly to the reward file. 
* **Hardcoding:** Agents might echo hardcoded text just to satisfy your pytest assertions.
* **Defense:** Use random parameters in your tests, check actual database state, and ensure your verifier logic cannot be modified by the agent.

---

## 10. Local Debugging & Submission

Always test locally before submitting.

### CLI Workflow
\`\`\`bash
# 1. Initialize a new task scaffold
stb init my-task-name -p <project_id> -t milestone

# 2. Launch your container interactively to build it
stb harbor tasks start-env -p ./my-task-name -i

# 3. Run your Oracle to prove it is solvable
stb harbor run -a oracle -p ./my-task-name
\`\`\`

### Creating the ZIP for Submission
When you are ready to submit, do **NOT** zip the parent folder. Open your task folder, select all the files (`task.toml`, `steps/`, etc.), and compress those directly into a ZIP file. 

Upload the ZIP to the platform, verify your rubric, and hit **Submit**!
