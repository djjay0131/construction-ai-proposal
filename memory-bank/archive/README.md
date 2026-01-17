# Memory Bank Archive

This folder contains archived content from the memory-bank that is no longer immediately relevant but should be preserved for historical reference.

## Structure

```
archive/
├── progress/      # Archived milestone completions
├── decisions/     # Historical context and decisions
└── sessions/      # Session summaries (optional)
```

## Archive Policy

### progress/
Contains completed milestone documentation archived from `progress.md`.
- Archive when: Phase completes or section grows large
- Naming: `phase-{N}-{name}-{YYYY}-{MM}.md` or `progress-{YYYY}-{MM}.md`
- Content: Completed work sections with original dates and verification notes

### decisions/
Contains historical decisions archived from `activeContext.md`.
- Archive when: Decisions are superseded or > 30 days old
- Naming: `decisions-{YYYY}-{MM}.md`
- Content: Recent Decisions sections with rationale preserved

### sessions/
Contains session summaries for long-running work.
- Archive when: End of significant work sessions (optional)
- Naming: `session-{YYYY}-{MM}-{DD}.md`
- Content: What was accomplished, decisions made, next steps

## Retrieval

When resuming work or investigating historical decisions:
1. Check the relevant archive folder
2. Use dates/phase names to locate relevant content
3. Reference archived content in current docs if needed

## Naming Conventions

- Use ISO date format (YYYY-MM-DD)
- Include phase numbers where applicable
- Keep names descriptive but concise
