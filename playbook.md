# Snorkel Terminal-Bench (Harbor) — Project Terminus Comprehensive Technical Manual
**Version 3.0 (May 2026)**
*Audience: Benchmark, QA, Reviewers, Harbor & Infra Engineers, and Expert Contributors*
*Developed in collaboration with Stanford University & Laude Institute Researchers* [30, 47, 63]

---

## 1. Executive Summary & Benchmark Philosophy

**Project Terminus** is an autonomy-first agent benchmarking platform designed to evaluate and benchmark the practical, real-world software engineering capabilities of frontier AI coding agents (such as Aider, Claude Code, and OpenHands) in isolated, containerised environments [30, 47, 50]. 

Unlike traditional evaluation platforms that focus on syntax memorisation, toy algorithm puzzles, or trivia, Terminus tests practical, long-horizon engineering workflows including [64, 65]:
* Complex codebase debugging
* System interaction and environment reasoning
* Dependency management and dependency conflict resolution
* Infrastructure troubleshooting
* Database schema migrations and query optimization
* Stateful, multi-step system administration tasks

### The Golden Rules of Task Creation
1. **Human Solvability vs. AI Challenge (The Core Philosophy):** A valid task must be solvable confidently by an expert human engineer but cause frontier AI agents (e.g., GPT-5.5, Claude Opus 4.8) to struggle meaningfully [30, 31, 65]. The objective is not to create impossible AI traps, but to build realistic engineering environments that expose the genuine reasoning limitations of modern models [100].
2. **Strict Difficulty Targets:** Tasks must be calibrated to either **Medium** (20–60% agent pass rate) or **Hard** (≤20% agent pass rate) difficulty [31]. "Easy" tasks (which achieve a >60% pass rate against real frontier agents) are automatically blocked and rejected [31, 41]. Tasks where agents achieve a >80% pass rate are ineligible for payment [56].
3. **Language-Specific Difficulties:** If your task uses **Python** as its primary language, it **must** be calibrated to **Hard** difficulty (≤20% pass rate) [31, 33].
4. **Milestone Preference:** Multi-step (milestone-structured) tasks are highly preferred, as they provide a better assessment of long-horizon execution and pay a higher financial reward to contributors [31, 33].
5. **Environment Reproducibility:** Every execution environment must be fully reproducible, digest-pinned, and completely offline-capable [31].

---

## 2. Platform Runtime Architecture & Container Isolation

### 2.1 The Harbor Orchestration Framework
**Harbor** is the core runtime execution, evaluation, and orchestration engine of the Terminus platform [48, 66]. It performs several critical functions in the ecosystem:
* **Container Lifecycle Management:** Spawns, monitors, and tears down Docker sandboxes [66].
* **Execution & Telemetry:** Executes the AI coding agents, runs the verifiers, and captures terminal transcripts [66].
* **Replay & Captures:** Records agent actions via `tmux` and `asciinema` to generate precise, textual logs for debugging and review [58, 66, 82].
* **AI Model Registry:** Serves as a secure registry to store, version, and share machine learning models across multi-cloud environments, ensuring reproducible benchmarks across diverse setups [49].

### 2.2 Container Lifecycle & Sandbox Isolation
Terminus operates on an **autonomy-first, isolated sandbox architecture** [47]:
1. **Environment Build Phase:** Harbor builds the environment from the task's Dockerfile [67]. All dependencies must be pre-installed inside the image; runtime package downloads are strictly blocked [67, 69].
2. **Container Launch Phase:** Sandboxes are launched as lightweight microVMs or Docker containers with strict resource and isolation guardrails [50, 67]:
   * Bounded CPU allocations, memory limits, and storage bounds [67].
   * Non-privileged execution (prohibits privileged mode and host filesystem mounts) [67, 69].
   * Strict offline execution (`allow_internet = false`) [69].
3. **Agent Runtime Phase:** The AI agent is initialized inside the container (e.g., via `devcontainer exec`) and granted terminal access, a workspace-scoped directory, and file manipulation capabilities [50, 51, 68]. The agent does **not** have access to the oracle solution, hidden verifier tests, or reviewer assets [68].
4. **Verifier Runtime Phase:** Harbor runs the validation tests on the modified workspace to assess correctness [68].
5. **Reward Evaluation Phase:** Harbor parses the verifier's score and generates a binary success/failure token [68].

---

## 3. Directory Structures & Sample Tasks

When creating a Terminus task, contributors must choose from one of three task skeletons: **Regular Task Skeleton** (non-UI and single-step tasks), **UI Task Skeleton** (user interface building tasks), or the **Milestone Task Skeleton** (multi-step workflow challenges) [54].

### 3.1 Regular Task Skeleton
For single-step tasks, the folder structure is flat and organized as follows [70]:
```text
my-task-name/
├── instruction.md         # The customer request or engineering ticket
├── task.toml              # Task metadata, resources, and scoring config
├── environment/
│   └── Dockerfile         # Docker recipe for the isolated environment
├── solution/
│   └── solve.sh           # Script that programmatically solves the task
└── tests/
    ├── test.sh            # The test runner script (calls pytest)
    └── test_outputs.py    # Pytest code asserting behavioral correctness
```

### 3.2 Milestone Task Skeleton (Preferred)
Milestone tasks have **no** root `instruction.md`, `tests/`, or `solution/` folders [34]. Instead, all task elements are nested sequentially under distinct steps [34]:
```text
my-task-name/
├── task.toml              # High-level configurations and milestone count
├── environment/
│   └── Dockerfile         # Base Docker image shared across all milestones
└── steps/
    ├── milestone_1/
    │   ├── instruction.md # Instructions for Milestone 1
    │   ├── solution/
    │   │   └── solve1.sh  # Script to solve Milestone 1
    │   └── tests/
    │       ├── test.sh    # Test runner for Milestone 1
    │       └── test_m1.py # Pytest verification for Milestone 1
    └── milestone_2/
        ├── instruction.md # Instructions for Milestone 2
        ├── solution/
        │   └── solve2.sh  # Script to solve Milestone 2
        └── tests/
            ├── test.sh    # Test runner for Milestone 2
            └── test_m2.py # Pytest verification for Milestone 2
```

### 3.3 Sample Directory Trees & File Lists (from `SampleTasks.md`)
The platform includes concrete structural examples of these files across three standard sample tasks [1, 4, 12]:

#### Sample Task 1: Basic Structure [1, 2, 3]
* `Task Creation Sample 1/.gitignore`
* `Task Creation Sample 1/README.md`
* `Task Creation Sample 1/instruction.md`
* `Task Creation Sample 1/task.toml`
* `Task Creation Sample 1/environment.dockerignore`
* `Task Creation Sample 1/environment/Dockerfile`
* `Task Creation Sample 1/solution/solve.sh`
* `Task Creation Sample 1/tests/test.sh`
* `Task Creation Sample 1/tests/test_outputs.py`

#### Sample Task 2: Advanced Datalog Implementation (`stratdl`) [4, 5, 6, 8, 9, 10, 11, 12]
This task evaluates Datalog rule stratifiability and query resolution:
* `Task creation sample 2/.../.DS_Store`
* `Task creation sample 2/.../instruction.md`
* `Task creation sample 2/.../task.toml`
* `Task creation sample 2/.../environment.DS_Store`
* `Task creation sample 2/.../environment.dockerignore`
* `Task creation sample 2/.../environment/Dockerfile`
* `Task creation sample 2/.../environment/app/datalog.md` (Explaining datalog syntax and error formats) [6, 7]
* `Task creation sample 2/.../environment/app/stratdl` (Executable engine) [8]
* `Task creation sample 2/.../environment/app/examples/` (`reach.dl`, `recall.dl`, `strata.dl`, `tc.dl`) [8, 9]
* `Task creation sample 2/.../environment/app/src/stratdl.pl` [10]
* `Task creation sample 2/.../solution/oracle.pl` [10]
* `Task creation sample 2/.../solution/solve.sh` [11]
* `Task creation sample 2/.../tests/ref_stratdl.py` [11]
* `Task creation sample 2/.../tests/test.sh` [11]
* `Task creation sample 2/.../tests/test_outputs.py` [12]

#### Sample Task 3: Node.js Suppressions CLI [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]
An exhaustive JS application for suppression management:
* `Task Creation Sample 3/.../instruction.md`
* `Task Creation Sample 3/.../task.toml`
* `Task Creation Sample 3/.../environment.dockerignore`
* `Task Creation Sample 3/.../environment/Dockerfile`
* `Task Creation Sample 3/.../environment/package.json`
* `Task Creation Sample 3/.../environment/bin/suppression-cli.js`
* `Task Creation Sample 3/.../environment/config/` (`defaults.json`, `lists.json`)
* `Task Creation Sample 3/.../environment/data/sample-events.jsonl`
* `Task Creation Sample 3/.../environment/docs/` (`event-types.md`, `operational-notes.md`, `suppression-contract.md`, `warnings.md`)
* `Task Creation Sample 3/.../environment/fixtures/README.md`
* `Task Creation Sample 3/.../environment/fixtures/basic.jsonl`
* `Task Creation Sample 3/.../environment/scripts/smoke-check.js`
* `Task Creation Sample 3/.../environment/src/` (`cliArgs.js`, `collections.js`, `constants.js`, `email.js`, `errors.js`, `evaluate.js`, `files.js`, `index.js`, `logger.js`, `normalize.js`, `path-utils.js`, `report.js`, `schema.js`, `serializers.js`, `state.js`, `time.js`, `validate.js`)
* `Task Creation Sample 3/.../solution/solve.sh`
* `Task Creation Sample 3/.../solution/fixed/src/` (`evaluate.js`, `files.js`, `normalize.js`, `state.js`, `time.js`)
* `Task Creation Sample 3/.../tests/test.sh`
* `Task Creation Sample 3/.../tests/test_outputs.py`

---

## 4. Configuration Engineering Specification (`task.toml`)

The configuration file `task.toml` provides the authoritative settings read by Harbor to control the runtime constraints, scoring algorithms, and environment settings of the task [100].

### 4.1 Schema Fields (Required vs. Optional) [101, 102]

| Field Name | Type | Required | Purpose / Definition |
| :--- | :--- | :--- | :--- |
| `version` | String / Int | **Yes** | Version of the task specification format. |
| `metadata.difficulty` | String | **Yes** | Calibrated difficulty. Values: `"easy"`, `"medium"`, `"hard"`, or `"unknown"`. |
| `metadata.category` | String | **Yes** | Taxonomic category of the engineering task. |
| `metadata.subcategories` | List[String]| No | Optional fine-grained tags for additional filtering. |
| `metadata.tags` | List[String]| No | Optional search terms and keyword metadata. |
| `metadata.languages` | List[String]| No | List of programming languages declared in the challenge. |
| `agent.timeout_sec` | Integer | **Yes** | Hard maximum duration for agent execution (e.g., `600` seconds). |
| `verifier.timeout_sec` | Integer | **Yes** | Hard maximum duration for verifier tests execution. |
| `environment.allow_internet` | Boolean | **Yes** | Must be set to `false` to maintain offline compliance. |
| `environment.os` | String | **Yes** | Operating system target. **Must be a string** (e.g. `"linux"`), not a list. |
| `environment.workdir` | String | **Yes** | Default active container directory for the agent execution (e.g., `"/app"`). |
| `number_of_milestones` | Integer | No | Explicit count of sequential steps for milestone tasks. |

### 4.2 Allowed Enumerations & Taxonomies [71, 72]
* **Difficulty Values:** `easy`, `medium`, `hard`, `unknown`
* **Category Taxonomy:**
  * `software-engineering`
  * `debugging`
  * `system-administration`
  * `machine-learning`
  * `data-processing`
  * `security`
  * `scientific-computing`
  * `build-and-dependency-management`
  * `games`
* **Subcategory Taxonomy:**
  * `long_context`
  * `tool_specific`
  * `api_integration`
  * `db_interaction`
  * `ui_building`

### 4.3 Default task.toml Template [35, 36]
```toml
[metadata]
name = "my-task-name"
difficulty = "hard"
language = "python"
milestone_count = 2
category = "software-engineering"
subcategories = ["api_integration"]

[resources]
timeout_seconds = 600
cpu_limit = 2
memory_limit_mb = 2048

[environment]
os = "linux"                                      # WARNING: Must be a string (e.g. "linux"), NOT ["linux"]
dockerfile = "environment/Dockerfile"
allow_internet = false
workdir = "/app"

[scoring]
points_total = 100
allow_partial_credit = true
```

---

## 5. Docker Engineering Standards

All Terminus environments are constructed via Docker to guarantee identical execution spaces across different machines [126]. Strict validation gates apply to Dockerfile engineering [36, 73]:

### 5.1 Mandatory Dockerfile Rules [36]
1. **Immutable Base Image (Digest Pinning):** Every `FROM` directive **must** specify an exact image digest using `@sha256:<digest>`. Floating tags (like `FROM python:3.11` or `FROM ubuntu:latest`) will immediately trigger a CI failure [45, 73].
2. **Sanctioned Base Registry:** Canonical registries must be used (e.g., `public.ecr.aws/docker/library/python:3.13-slim-bookworm@sha256:...`) [36].
3. **Mandatory Runtime Packages:** Dockerfiles **must** install `tmux` and `asciinema`. If these are omitted, parallel agent orchestration and terminal recording will fail silently, leading to zero-output runs [36, 45].
4. **Offline Capability:** The task container must build completely without requiring runtime downloads (`pip`, `apt-get`, `npm install` are forbidden during agent execution) [67, 69, 73].
5. **No File Leaks:** **Never** copy the `solution/` or `tests/` directories into the image at build time (e.g. `COPY solution/ /app/solution` is forbidden) [36].

### 5.2 Gold Standard Dockerfile Template [37]
```dockerfile
FROM public.ecr.aws/docker/library/python:3.13-slim-bookworm@sha256:d314a42823023e98b1e846062a40b3c2bc16db97aa60cd6e4566cd3f7a1f5924

# Install essential CLI tools and agent runtime prerequisites
RUN apt-get update && apt-get install -y --no-install-recommends     tmux     asciinema     sqlite3     git     curl     && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Pin and install task dependencies safely
COPY environment/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

CMD ["/bin/bash"]
```

---

## 6. Instruction Authoring SOP (`instruction.md`)

Instructions should read like authentic communication between real engineers collaborating on Slack or Jira [38, 74]. Avoid over-structured, synthetic, or academic styling [38, 74].

### 6.1 Core Guidelines
* **concise and outcomes-focused:** Describe the observable problem clearly [74]. Do not include excessive hints or hand-holding [74].
* **Absolute Paths:** Always use absolute filesystem paths (e.g., `/app/data/config.json`) to refer to targets [38, 74, 164].
* **Explicit Schema Constraints:** If outputting files, specify exact JSON/CSV structures and exact filenames [38].
* **Evaluate Reasoning, Not Instruction-Following:** Say *what* needs to be achieved, **never** explain *how* to achieve it [161].

### 6.2 Instruction Contrast [75, 115, 137]

* **Bad Instruction (Avoid):**
  > "You are an expert AI agent. Open `/app/api/app.py` and modify line 42 to replace the validation function with a regex pattern. Then run `pytest tests/test_outputs.py` and restart the flask server." [137, 163]
  * *Why it's bad:* It leaks the exact file, exact line, exact solution method, and reads like a tutorial instead of an engineering ticket [75, 137, 165].

* **Good Instruction (Recommended):**
  > "The Flask API validation workflow is currently failing integration tests. Investigate the runtime environment and repair the request validation system so that malformed payloads correctly return HTTP 400 responses, while valid requests continue to function normally. Do not modify the verifier logic." [115]
  * *Why it's good:* It specifies the problematic system behavior and the expected success state while leaving the debugging path and implementation strategy to the agent [115, 137, 162].

---

## 7. Oracle Solution Development (`solve.sh`)

The **Oracle Solution** (`solution/solve.sh`) is the reference answer key. It programmatically fixes the environment issues to prove that the task is fully solvable by a human engineer [140, 148, 158].

### 7.1 Key Oracle Guidelines [75]
1. **Solves the Task Reliably:** The oracle must achieve a perfect 1.0 reward on every run [158].
2. **Determinism:** The execution sequence must yield the exact same environment and file outputs every time [38, 75].
3. **No Hardcoded Outputs:** The oracle must resolve the bug dynamically by applying genuine edits, rather than echoing static mock responses into the output paths [75].
4. **Sequential Verification:** It should emulate the human engineering workflow (e.g., run test, see it fail, apply patch, run test, see it pass) [116].
5. **No random timeouts:** Avoid sleep commands or arbitrary wait cycles that introduce flakiness [76, 93].

---

## 8. Verifier Architecture & Testing SOP

The verifier executes tests to evaluate the agent's work. It must test observable system behavior, not implementation details [38, 76].

### 8.1 The Test Runner (`test.sh`) Contract [38, 76]
The `test.sh` script is the bridge between Python testing and Harbor reward logging. It must execute the tests and write a single decimal string to `/logs/verifier/reward.txt` (`1.0` for success, `0.0` for failure) [38, 76].

#### Crucial Gotcha: Exit Code Suppression [44]
**Do NOT append `exit 0` or `exit $?` at the very end of `test.sh`.** The final block must be the `if/else` wrapper writing to `/logs/verifier/reward.txt` [39, 44]. Adding trailing exit commands breaks the platform's test-runner validator and triggers an automatic CI rejection [44].

#### Gold Standard `test.sh` [39]
```bash
#!/bin/bash
set -e
cd /app

# Run python pytest and redirect execution logs cleanly
pytest tests/test_outputs.py -v --tb=short > /logs/verifier/pytest_output.log 2>&1

# Parse exit code to determine the reward output
if [ $? -eq 0 ]; then
    echo "1.0" > /logs/verifier/reward.txt
else
    echo "0.0" > /logs/verifier/reward.txt
fi
# WARNING: Do NOT put `exit $?` or `exit 0` below this line!
```

### 8.2 The Pytest File (`test_outputs.py`)
* **Behavior-Based Audits:** Test that the database contains the correct entries or that the endpoint returns the correct status code. Do **not** parse the agent's source code string to assert that specific function names were used [39, 76, 77].
* **Docstrings:** Pytest test cases **must** have descriptive, informative docstrings explaining what is being tested. LLMaJ checks will fail if docstrings are absent [39, 40].
* **Anti-Cheating:** Implement assertions targeting potential shortcuts, hardcoded results, and fake mocks [39, 77].

---

## 9. Anti-Cheating and Exploit Prevention

A benchmark task is considered invalid if an agent can bypass the intended engineering work to score points [77].

### 9.1 Common Exploit Vectors [77, 92]
* **Reward Spoofing:** Writing "1.0" directly to `/logs/verifier/reward.txt` [92].
* **Test Monkeypatching:** Modifying Python tests dynamically at runtime to force test suites to return a pass [92].
* **Bypassing Verifiers:** Modifying `/app/tests/test.sh` or deleting pytest validation files [92].
* **Hardcoding Outputs:** Spoofing responses based on exact test assertion patterns [92].
* **Filesystem and Service Manipulation:** Creating symlinks or spoofing downstream network servers [92].

### 9.2 Enforcement & Defense Mechanisms [78, 92]
1. **Verifier Asset Isolation:** Keep the test validation suite and test runner hidden or read-only inside the sandbox runtime [78, 92].
2. **Hidden Tests:** Evaluate the agent's work against an isolated, secondary test suite that is completely inaccessible during execution [78].
3. **Dynamic Validation payloads:** Use random parameters, varying payload entries, and changing system inputs to prevent hardcoded outputs [78, 92].
4. **State Checks:** Ensure actual state change occurs (e.g. check database tables, assert filesystem state) rather than just looking at terminal outputs [78].

---

## 10. Stateful, Milestone, and Long-Context Tasks

### 10.1 Milestone Sequential Logic
* **State Persistence:** Task steps execute sequentially on a shared filesystem [78].
* **The No-Leak Rule:** Milestone 2 must be engineered so that it cannot pass if Milestone 1 fails [45].
* **State Resetting:** Milestone 2's verification tests must explicitly handle or reset leftover artifacts generated during Milestone 1 [45].

### 10.2 Long-Context Task Design (>50k Tokens) [79, 97]
For tasks evaluating an agent's ability to reason over massive corpora:
* **Semantic Distractors:** Include irrelevant documents, outdated specs, or noisy logs to challenge retrieval models [97].
* **Conflicting Information:** Introduce contradictory details in different files, requiring chronological reconstruction [97].
* **Synthesis Chains:** Ensure clues are scattered across multiple sources so that simple keyword matches fail, forcing multi-document analysis [97].

---

## 11. Local Development and Debugging Loop

Contributors must validate tasks locally before submitting them to the Snorkel platform [104].

```text
+-------------------+      +-------------------+      +-------------------+      +-------------------+
|  Initialize Task  | ---> | Build Docker Env  | ---> |   Run Oracle L1   | ---> |  Verify Test Run  |
| (stb projects/init)|      |  (start-env -i)   |      |  (stb harbor run) |      | (pytest execution)|
+-------------------+      +-------------------+      +-------------------+      +-------------------+
                                                                                               |
                                                                                               v
+-------------------+      +-------------------+      +-------------------+      +-------------------+
| Platform Submission| <--- | Real Agent Eval   | <--- | Run LLMaJ Checks  | <--- | Exploit & Hardening|
| (Create ZIP file) |      |  (GPT-5.5/Claude) |      | (stb tasks check) |      | (Verify security) |
+-------------------+      +-------------------+      +-------------------+      +-------------------+
```

### 11.1 Standard CLI Tool commands [32, 34, 40, 44]

1. **Prerequisites & Setup:**
   ```bash
   # Install uv package manager
   curl -LsSf https://astral.sh/uv/install.sh | sh
   # Install Snorkel CLI
   uv tool install stb-cli
   # Authenticate with the Snorkel Expert Platform
   stb auth login
   # Set provider API keys
   stb keys set anthropic
   stb keys set openai
   ```
2. **Scaffolding and Starting:**
   ```bash
   # List active project IDs
   stb projects list
   # Initialize a Milestone task scaffold
   stb init my-task-name -p <project_id> -t milestone
   # Launch container for interactive debugging
   stb harbor tasks start-env -p ./my-task-name -i
   ```
3. **Validating & Evaluating:**
   ```bash
   # Run the local Oracle Agent to prove human solvability (Runs solve.sh 3x)
   stb harbor run -a oracle -p ./my-task-name
   # Execute Static CI and LLMaJ checks locally
   stb harbor tasks check ./my-task-name -m openai/@openai/gpt-5.5
   # Test against real frontier models for pass rate calibration
   stb harbor run -m @openai/gpt-5.5 -p ./my-task-name
   stb harbor run -m @anthropic/claude-opus-4.8 -p ./my-task-name
   ```

---

## 12. Submission & Platform Iteration Workflow

### 12.1 Packaging the Task (The ZIP "Gotcha") [41, 45]
* **Rule:** Do **NOT** zip the task folder itself. Open the task directory, select all the files inside (e.g., `task.toml`, `environment/`, `steps/`), and compress the files directly [41]. 
* *Why:* Zipping the parent folder nests the files, causing the platform CI to fail because it cannot find `task.toml` at the root of the archive [45].

### 12.2 Platform Steps [42, 43]
1. **Initial Upload:** Upload the ZIP to the Snorkel Expert Platform. Check **"Generate Rubric"**, but uncheck **"Send to reviewer"** [42].
2. **Review Feedback:** Check your email for CI and LLMaJ feedback, click **"Revise"** on the platform, and inspect failing checks [42].
3. **Rubric Customization:** Edit the synthetic rubric generated by the platform [42].
   * Allocate **10–40 points** per milestone [43].
   * Set at least **three negative reward criteria** (e.g., `-1` or `-10` points) to penalize cheating or constraint bypass [43].
4. **Final Submission:** Once CI is 100% green and the rubric matches perfectly, click **"Revise"**, check **"Send to Reviewer"**, and submit for human peer review [43].

---

## 13. Reviewer Rubric, Scoring, and Rejections

Submissions are evaluated across six core dimensions [94, 113]:

### 13.1 Scoring Matrix Weights [113]

| Evaluation Category | Weight | Focus Areas |
| :--- | :--- | :--- |
| **Realism** | 20% | Authenticity of the scenario; resembles real production issues. |
| **Determinism** | 20% | Execution consistency; reproducible verifiers with zero flakiness. |
| **Difficulty Quality** | 20% | Calibrated challenge; frontier AI models fail meaningfully. |
| **Exploit Resistance** | 15% | Robustness against shortcutting, reward spoofing, and test-bypassing. |
| **Environment Stability**| 10% | Clean, fast Docker builds with exact version pinning. |
| **Verifier Quality** | 10% | Behavior-focused assertions with complete docstrings. |
| **Instruction Quality** | 5% | Clean Slack-like prompts with no answer leakage or hints. |

* **Acceptance Thresholds:** `90–100` points (Strong Acceptance Candidate); `75–89` (Revision Required); `60–74` (Major Revision Required); `<60` (Rejection) [113].

### 13.2 Severity Levels for Issues [94, 95]
* **Critical:** Immediate task rejection (e.g., broken environment, major security holes, trivial pass rate) [94, 114].
* **Major:** Requires formal revisions and a new upload before review continues [94].
* **Minor:** Improvement recommended but not strictly blocking [94].
* **Informational:** Observations or tips provided by the reviewer [95].

---

## 14. Task Design Archetypes & AI Failure Modes

### 14.1 Recommended Design Archetypes [88]

1. **Dependency Drift Debugging:** A library update introduces subtle, unlogged API incompatibilities or transitive library conflicts. Agents struggle by trying to patch symptoms instead of fixing version drift [88].
2. **Race Condition Diagnosis:** Intermittent concurrency failures involving parallel execution, multiprocessing deadlocks, or async queue races [88].
3. **Stateful Migration Failures:** Database schema changes or upgrades that partially execute and corrupt state across system boundaries [88].
4. **Multi-Service Orchestration Bugs:** Misrouting in gateways, cache synchronization errors, or auth token propagation leaks between coupled services [88].
5. **Silent Data Corruption:** System remains healthy (no crash) but writes corrupted, incorrectly encoded, or float-drifted data to files [88].
6. **Broken CI/CD Infrastructure:** Path resolution issues, missing OS build dependencies, or test-order instabilities in a pipeline [88].
7. **Legacy Compatibility Regressions:** Runtime updates that break backwards-compatible configuration patterns [88].
8. **Observability & Logging Misconfigurations:** Masked telemetry, incorrect log levels, or broken tracers, forcing the agent to rely on logs to locate bugs [88].
9. **Incremental Debugging Chains:** Multi-step issues where patching the first bug exposes a secondary, deeper failure [89].

### 14.2 Known Frontier-Agent Failure Modes [89]
Design your tasks around these common AI blind spots:
* **Premature Assumptions:** Agents jump to conclusions based on the first error trace, applying hasty patches without thorough root-cause analysis [89].
* **Local Fixes Breaking Global Behavior:** Agents patch a local test while breaking downstream functions [89].
* **Overfitting to Visible Tests:** Agents write logic that satisfies pytest assertions without actually fixing the system's logic [89].
* **Dependency Hallucinations:** Agents invent nonexistent APIs or suggest invalid library packages [89].
* **Weak State Tracking:** Failure to maintain execution context across complex debugging chains [89].

---

## 15. Operational Resource Limits & Governance

To maintain evaluation scalability, tasks must operate within bounded limits [110]:

* **CPUs:** 1–4 Cores [110]
* **Memory Limit:** 2–8 GB [110]
* **Storage Limit:** 5–20 GB [111]
* **Agent Execution Timeout:** 10–30 Minutes [111]
* **Verifier Execution Timeout:** 2–10 Minutes [111]

*Note on Out-of-Memory (OOM):* Always test memory-intensive operations (like large-context documents parser runs) locally. If containers crash due to OOM, it usually indicates oversized corpora, memory leaks in the verifier, or unbounded process assumptions [111].

---

## 16. Troubleshooting Common Task Failures

| Observed Problem | Likely Root Cause | Corrective Action / Fix |
| :--- | :--- | :--- |
| `reward.txt` is missing [83] | Verifier crashed or directory paths do not exist [83] | Verify `/logs/verifier/` exists and check `test.sh` logic [83]. |
| AI passes the task instantly [83] | Task is too easy or contains an obvious stack trace [83] | Increase task complexity, obscure file names, or add multi-step state [83]. |
| Docker build fails [83] | Floating tags or broken upstream mirror [83] | Pin dependency versions and base images exactly [83]. |
| Local CI fails [83] | `task.toml` has invalid schema [83] | Run schema validation; verify `environment.os` is a plain string [36, 83]. |
| Pytest execution times out [83] | Infinite loop in verifier or inefficient lookup loops [83] | Optimize test assertions and implement execution caps [83]. |

---

## 17. VS Code Extensions for Productive Authoring

While optional, the following extensions are recommended for the best development experience [128, 129]:
* **Docker Extension:** For direct container management and runtime terminal access.
* **Python Extension:** Enables linting, pytest debugging, and dynamic code checking.
* **Markdown Support:** Simplifies formatting and editing for `instruction.md` files.
* **TOML Extension:** Validates task configurations in `task.toml` to prevent syntax bugs.
* **GitLens:** Helps track local revisions and git state during complex debugging chains.

---

## 18. Complete Submission Readiness Checklist [84]

Ensure all criteria are met before uploading your task to the Snorkel platform:

### Docker & Environment [84]
- [ ] Docker image builds completely without errors [84].
- [ ] All dependencies are pinned with exact versions [84].
- [ ] Network internet access is disabled (`allow_internet = false`) [84].
- [ ] Privileged mode and host mounts are omitted [84].
- [ ] Base image uses a canonical registry with `@sha256` digest pinning [36].
- [ ] `tmux` and `asciinema` are installed inside the Docker image [36].

### Instructions (`instruction.md`) [84]
- [ ] Hand-written, natural Slack/Jira-style tone [74, 84].
- [ ] Concise with no implementation hints or code snippets [74, 84].
- [ ] Every directory reference uses absolute filesystem paths [74, 84].

### Oracle Solution (`solve.sh`) [84]
- [ ] Deterministic, reliable, and runs successfully in a clean container [84].
- [ ] Solves the task dynamically without hardcoding values [84].

### Tests & Verification [84]
- [ ] Tests are deterministic and do not depend on sleep timeouts [84].
- [ ] Verifier writes a clean `1.0` or `0.0` output directly to `/logs/verifier/reward.txt` [76, 84].
- [ ] Pytest test cases are behavior-focused and contain complete docstrings [39].
- [ ] `test.sh` does **not** have `exit 0` or `exit $?` at the end [44].

### Calibration & Submission [84]
- [ ] Tested against frontier models (Claude/GPT-5) with pass rates within guidelines [84].
- [ ] The generated task rubric has been customized with negative reward constraints [42, 43].
- [ ] ZIP archive contains task files compressed directly (no parent folder) [41, 45].
- [ ] Task files and logic are treated as strictly confidential and not posted online [85].
