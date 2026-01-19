# Architectural Decisions

This file tracks significant architectural and technical decisions made throughout the project lifecycle.

## Decision Format

Each decision should include:
- **Date:** When the decision was made
- **Status:** Proposed | Accepted | Deprecated | Superseded
- **Context:** What prompted this decision
- **Decision:** What was decided
- **Consequences:** Impact and trade-offs
- **Alternatives Considered:** Other options evaluated

---

## ADR-001: Memory Bank Documentation Structure

**Date:** 2026-01-14
**Status:** Accepted

**Context:**
Need a systematic documentation approach that maintains context across sessions and supports complex proposal development.

**Decision:**
Adopt the memory-bank documentation structure from the agentic-kg project, adapted for the Construction AI Proposal:
- 8 core documentation files covering all aspects of project state
- Archive structure for historical content
- Clear file purposes and update frequencies

**Consequences:**
- Pros: Proven structure, comprehensive coverage, easy context recovery
- Cons: Requires discipline to maintain, initial setup overhead
- Impact: Better organization, consistent documentation, improved productivity

**Alternatives Considered:**
- Simple README + notes: Rejected, insufficient for complex proposal
- Wiki-based approach: Rejected, want all docs in repository
- Custom structure: Rejected, existing structure is well-designed

---

## ADR-002: Proposal Focus Areas

**Date:** 2026-01-14
**Status:** Proposed

**Context:**
Construction AI is a broad field; need to focus the proposal on specific, high-impact areas.

**Decision:**
Focus on five primary AI application areas:
1. **Safety AI** - PPE detection, hazard identification, incident prediction
2. **Cost AI** - Estimation, variance analysis, optimization
3. **Schedule AI** - Delay prediction, resource optimization, progress tracking
4. **Quality AI** - Visual inspection, defect detection, compliance
5. **Document AI** - Processing, search, compliance checking

**Consequences:**
- Pros: Comprehensive yet focused, addresses major pain points
- Cons: May not cover all possible AI applications
- Impact: Clear scope, manageable proposal size, strong value proposition

**Alternatives Considered:**
- Single focus area: Rejected, too narrow for comprehensive proposal
- All possible applications: Rejected, would dilute impact and be overwhelming
- Different focus areas: Considered, but selected areas have highest ROI potential

---

## ADR-003: Layered Architecture Approach

**Date:** 2026-01-14
**Status:** Accepted

**Context:**
Need to present a technical architecture that is understandable, scalable, and implementable.

**Decision:**
Present a four-layer architecture:
1. **Presentation Layer** - Dashboards, portals, mobile apps
2. **Application Layer** - AI service modules, API gateway
3. **AI/ML Services Layer** - Model serving, computer vision, NLP, analytics
4. **Data Layer** - Integration hub, data sources

**Consequences:**
- Pros: Clear separation of concerns, industry-standard approach, scalable
- Cons: More complex than monolithic alternative
- Impact: Professional presentation, easier to understand, demonstrates technical competence

**Alternatives Considered:**
- Monolithic architecture: Rejected, doesn't scale well
- Three-layer (no separate AI layer): Rejected, AI deserves distinct treatment
- Microservices-only: Considered, but layers provide better conceptual clarity

---

## ADR-004: Human-in-the-Loop Design Principle

**Date:** 2026-01-14
**Status:** Accepted

**Context:**
AI in construction involves high-stakes decisions. Need to address trust and control concerns.

**Decision:**
Design all AI systems with human-in-the-loop as a core principle:
- AI provides recommendations, humans make decisions
- Clear escalation paths for uncertain situations
- Feedback loops for continuous improvement
- Transparency in AI reasoning and confidence levels

**Consequences:**
- Pros: Builds trust, reduces risk, regulatory compliance, better adoption
- Cons: Slower than fully autonomous, requires user engagement
- Impact: Higher acceptance rate, safer implementation, sustainable adoption

**Alternatives Considered:**
- Full autonomy: Rejected, too risky for construction industry
- Notification-only: Rejected, insufficient control for stakeholders
- Human-only with AI suggestions: This is essentially what we chose

---

## ADR-005: Sprint 01 Academic Polish Strategy

**Date:** 2026-01-18
**Status:** Accepted

**Context:**
Initial 6-page proposal document lacked academic rigor and comprehensive literature review. Needed to establish research contributions and theoretical grounding for conference paper submission.

**Decision:**
Execute comprehensive polishing sprint with focus on:
1. Expanding Related Work with 5 literature survey categories
2. Adding theoretical foundations to all technical sections
3. Articulating Research Questions (RQ1-RQ4) derived from literature gaps
4. Adding success criteria and risk mitigation to implementation plan
5. Honestly documenting implementation gaps

**Consequences:**
- Pros: Strong academic foundation, clear research contributions, 34 citations, competitive with conference standards
- Cons: Document grew from 6 to 9 pages (within IEEE conference limits)
- Impact: Proposal ready for academic submission, research questions clearly articulated

**Results:**
- 5 commits over 2 days (dd9bf69, 46cc380, fd7bb96, 342152e)
- Document grew from 6 to 9 pages
- Citations increased from ~8 to 34 in Related Work
- All technical sections now theoretically grounded
- Research questions RQ1-RQ4 clearly stated
- Success criteria defined for all 4 implementation phases

**Alternatives Considered:**
- Minimal polish: Rejected, insufficient for academic submission
- Complete rewrite: Rejected, existing content was strong foundation
- Incremental sprint approach: Chosen, allows systematic improvement

---

## Template for Future Decisions

```markdown
## ADR-XXX: [Decision Title]

**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Deprecated | Superseded

**Context:**
[What is the issue that we're seeing that is motivating this decision or change?]

**Decision:**
[What is the change that we're actually proposing or doing?]

**Consequences:**
- Pros: [Positive outcomes]
- Cons: [Negative outcomes or trade-offs]
- Impact: [Overall impact on the project]

**Alternatives Considered:**
- [Alternative 1]: [Why rejected]
- [Alternative 2]: [Why rejected]
```

---

## Notes

- Update this file when making significant technical or architectural decisions
- Reference ADR numbers when discussing decisions elsewhere
- Mark decisions as Deprecated or Superseded when they change, don't delete them
- Keep historical context even when decisions change
