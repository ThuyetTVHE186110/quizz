# Copilot Instructions

## Project context

- This repository contains the `quizz` project and its FPT hackathon workflow.
- Follow the documentation in `SPEC-DRIVEN-DEVELOPMENT.md` when it is present.
- Keep the activity log in `spec/activity-log.md` up to date for meaningful work.
- Treat files under `docs/superpowers/` as project planning and design references.

## Working rules

- Inspect the relevant existing files before making changes.
- Prefer small, focused changes that preserve existing behavior.
- Reuse established patterns and helpers instead of introducing duplicate logic.
- Do not modify unrelated files or discard existing user changes.
- Keep documentation and implementation consistent whenever behavior changes.
- Surface errors clearly; do not hide failures with broad catches or silent fallbacks.

## Validation

- Validate every change with the smallest relevant existing check.
- For documentation-only changes, verify links, paths, and Markdown structure.
- Before finishing, review the diff and confirm that no secrets or generated artifacts were added.

## GitHub workflow

- Use clear, conventional commit messages.
- Pull requests should explain the change, mention validation performed, and call out any remaining limitations.
- Do not commit credentials, tokens, or other sensitive data.
