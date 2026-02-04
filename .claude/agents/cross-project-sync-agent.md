# Cross-Project Sync Agent

## Purpose

Synchronize documentation between the **construction-ai** (implementation) and **construction-ai-proposal** (research) repositories to maintain consistency.

## Repositories

| Repository | Path | Purpose |
| ---------- | ---- | ------- |
| construction-ai | `/Users/djjay0131/code/construction-ai` | Implementation code |
| construction-ai-proposal | `/Users/djjay0131/code/construction-ai-proposal` | Research proposal |

## Sync Scope

### Files to Sync (Proposal → Implementation)

Architecture and design decisions flow from proposal to implementation:

- `construction/design/*.md` - Design documents
- `memory-bank/architecturalDecisions.md` - ADRs
- `memory-bank/systemPatterns.md` - Architecture patterns
- `memory-bank/techContext.md` - Technical stack

### Files to Sync (Implementation → Proposal)

Implementation progress flows back to proposal:

- `memory-bank/progress.md` - Task completion (implementation sections)
- `construction/sprints/*-implementation-*.md` - Implementation sprints

### Files NOT Synced (Repo-Specific)

- `memory-bank/activeContext.md` - Different focus per repo
- `memory-bank/projectbrief.md` - Different scope per repo
- `construction/README.md` - Different context per repo
- `CLAUDE.md` - Different session info per repo

## Commands

### sync-from-proposal

Pull latest design documents from proposal repo to implementation repo:

```bash
# Design documents
cp ../construction-ai-proposal/construction/design/*.md construction/design/

# Architecture decisions
cp ../construction-ai-proposal/memory-bank/architecturalDecisions.md memory-bank/
cp ../construction-ai-proposal/memory-bank/systemPatterns.md memory-bank/
cp ../construction-ai-proposal/memory-bank/techContext.md memory-bank/
```

### sync-to-proposal

Push implementation progress to proposal repo:

```bash
# Implementation progress sections
# (Manual merge required - don't overwrite proposal-specific content)
```

### check-sync-status

Compare files between repos to identify drift:

```bash
diff -q construction/design/ ../construction-ai-proposal/construction/design/
diff -q memory-bank/architecturalDecisions.md ../construction-ai-proposal/memory-bank/architecturalDecisions.md
```

## Workflow

### After Proposal Updates

1. Check proposal repo for new commits
2. Run `sync-from-proposal` command
3. Update implementation activeContext.md with new decisions
4. Create implementation tasks based on new architecture

### After Implementation Progress

1. Update implementation progress.md
2. If architectural insights discovered, update proposal ADRs
3. Run `sync-to-proposal` for relevant files
4. Commit changes in both repos

## Sync Triggers

Sync should be performed when:

1. **Proposal architecture changes** - New ADRs, updated system patterns
2. **Implementation milestones** - Major features completed
3. **Session start** - Check for drift before beginning work
4. **Before commits** - Ensure consistency

## Agent Instructions

When invoked, the sync agent should:

1. **Check current directory** to determine which repo is active
2. **Compare timestamps** of syncable files
3. **Report differences** before making changes
4. **Perform sync** only with user confirmation
5. **Update activeContext.md** in the target repo with sync notes

## Example Usage

```
User: Sync documentation from proposal
Agent:
1. Checking proposal repo for updates...
2. Found 3 modified files:
   - construction/design/vvuq-integration-plan.md (modified 2026-01-24)
   - memory-bank/architecturalDecisions.md (modified 2026-02-03)
   - memory-bank/systemPatterns.md (no changes)
3. Copying updated files to implementation repo...
4. Updating activeContext.md with sync notes...
5. Sync complete. 2 files updated.
```

## Notes

- Always preserve repo-specific content (activeContext, projectbrief, README)
- When in doubt, report differences rather than auto-sync
- Keep both repos' git history clean with clear sync commits
- Reference the source repo in commit messages
