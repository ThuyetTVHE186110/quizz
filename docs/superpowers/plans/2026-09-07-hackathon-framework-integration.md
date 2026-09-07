# Hackathon Framework Integration Implementation Plan (Superseded)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Historical framework-only plan. The approved implementation task list is now `specs/001-quiz-mvp/tasks.md`.

**Architecture:** Preserve the framework's discovery paths under `.github/` and `spec/`. Keep the event README as `HACKATHON-GUIDE.md`, while a concise root README identifies the new project and points readers to the imported references.

**Tech Stack:** Markdown, VS Code custom agents and skills, Git, GitHub CLI

---

### Task 1: Import The Framework

**Files:**
- Create: `.github/agents/caveman.agent.md`
- Create: `.github/agents/documenter.agent.md`
- Create: `.github/agents/review.agent.md`
- Create: `.github/agents/tdd-green.agent.md`
- Create: `.github/agents/tdd-red.agent.md`
- Create: `.github/skills/architecture-slide/SKILL.md`
- Create: `spec/activity-log.md`
- Create: `SPEC-DRIVEN-DEVELOPMENT.md`
- Create: `HACKATHON-GUIDE.md`
- Create: `README.md`

- [ ] **Step 1: Copy framework files without source Git history**

Copy `.github/`, `spec/`, and `SPEC-DRIVEN-DEVELOPMENT.md` from the sibling `hackathon-fpt` directory. Copy its `README.md` as `HACKATHON-GUIDE.md`.

- [ ] **Step 2: Add the project README**

Create `README.md` with the project name, a short statement that the repository contains the imported hackathon workflow, and links to `HACKATHON-GUIDE.md`, `SPEC-DRIVEN-DEVELOPMENT.md`, and `spec/activity-log.md`.

- [ ] **Step 3: Validate expected files**

Run a PowerShell assertion over all ten expected imported files and `README.md`.

Expected: `Framework file inventory validation passed`.

- [ ] **Step 4: Commit**

```bash
git add .github spec README.md HACKATHON-GUIDE.md SPEC-DRIVEN-DEVELOPMENT.md
git commit -m "chore: integrate FPT hackathon framework"
```

### Task 2: Verify The Import

**Files:**
- Verify: `.github/agents/*.agent.md`
- Verify: `.github/skills/architecture-slide/SKILL.md`
- Verify: `spec/activity-log.md`
- Verify: `SPEC-DRIVEN-DEVELOPMENT.md`
- Verify: `HACKATHON-GUIDE.md`

- [ ] **Step 1: Compare imported content hashes**

Compare SHA-256 hashes for every imported file against its corresponding source. Compare `HACKATHON-GUIDE.md` against the source `README.md`.

Expected: every source/destination pair has an identical hash.

- [ ] **Step 2: Verify repository state**

```bash
git status --short
git log --oneline -2
```

Expected: an empty status and two commits: the design commit followed by the framework integration commit.

### Task 3: Publish The Repository

**Files:**
- Modify: `.git/config`

- [ ] **Step 1: Check GitHub authentication and repository availability**

Confirm the GitHub CLI has an authenticated account and that the account does not already own a repository named `quizz`.

Expected: authenticated account available and repository name unused. If the name exists, inspect it and stop before changing its content.

- [ ] **Step 2: Create and push the public repository**

```bash
gh repo create quizz --public --source=. --remote=origin --push
```

Expected: GitHub creates the public repository, adds `origin`, and pushes `main` with upstream tracking.

- [ ] **Step 3: Verify publication**

```bash
git remote -v
git status --short --branch
gh repo view --json name,visibility,url,defaultBranchRef
```

Expected: `origin` points to the new repository, visibility is `PUBLIC`, default branch is `main`, and the working tree is clean.