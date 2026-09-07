# Hackathon Framework Integration Design

## Goal

Turn the empty `quizz` directory into an independent public GitHub repository that contains the reusable FPT hackathon workflow framework without carrying over the source repository's Git history.

## Scope

The repository will include:

- The five custom agents from `.github/agents/`.
- The `architecture-slide` skill from `.github/skills/`.
- The activity log specification under `spec/`.
- The specification-driven development reference.
- The hackathon instructions renamed to `HACKATHON-GUIDE.md`.
- A project-specific `README.md` that identifies the repository and links to the imported guidance.

Quiz application code and resolution of the four activity-log ambiguities are outside this integration task.

## Structure

The imported files retain their relative paths so VS Code discovers the agents and skill automatically. Renaming the source README avoids presenting the framework's event instructions as the application README while preserving the complete reference.

## Git And GitHub

`quizz` will be initialized as a new Git repository on the `main` branch. The approved design is committed first, followed by the framework integration. A public GitHub repository named `quizz` will be created for the authenticated account and the local `main` branch pushed to `origin`.

## Validation

- Compare the imported framework files with their source files by content hash.
- Verify all expected agents, skills, specifications, and documentation are present.
- Verify the working tree is clean after commits.
- Verify `origin` points to the newly created public GitHub repository and `main` is pushed.

## Failure Handling

If a GitHub repository named `quizz` already exists, inspect whether it is safe to use rather than overwriting it. If GitHub authentication is unavailable, leave the complete local repository ready and report the exact authentication blocker.