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

## ADR-006: Sprint 02 Final Polish Strategy

**Date:** 2026-01-18
**Status:** Accepted

**Context:**
After Sprint 01 established academic rigor with 9-page document, Sprint 02 needed to polish remaining sections (Abstract, Data Sources, Scalability, Business Case, Conclusion) with concrete metrics and business context. Initial document had strong technical foundation but lacked quantitative claims and competitive analysis.

**Decision:**
Execute targeted sprint focusing on 5 specific sections with emphasis on:

1. Quantitative metrics and concrete performance targets
2. Competitive landscape analysis and market positioning
3. Cost projections and scalability details
4. Data quality challenges and privacy considerations
5. Clear contribution restatement and future directions

**Consequences:**

- Pros: Document grew to 11 pages with balanced academic and business rigor, all claims now quantified, competitive differentiation clear
- Cons: Page count increased by 2 pages (within IEEE conference limits)
- Impact: Proposal ready for submission with comprehensive coverage of both technical and business aspects

**Results:**

- Single commit (2abad19) completed in 20 minutes (vs 2.5 hour estimate)
- Document grew +169 lines (+19%)
- Abstract: 129 words (under IEEE 250-word limit)
- All sections enhanced with concrete metrics:
  - Data Sources: 34→74 lines (+118%)
  - Scalability: 32→89 lines (+178%)
  - Business Case: 34→90 lines (+165%)
  - Conclusion: 13→29 lines (+123%)
- Both deliverables (proposal + presentation) ready for submission

**Alternatives Considered:**

- Keep document at 9 pages: Rejected, insufficient business case and scalability detail
- Add new sections: Rejected, would exceed page limits
- Targeted expansion of weakest sections: Chosen, maximizes impact within constraints

---

## ADR-007: VVUQ Integration Strategy

**Date:** 2026-01-24
**Status:** Accepted

**Context:**
The original proposal lacked physics-based validation for structural decisions. Architectural plans often don't include structural framing details, requiring builders to infer load-bearing walls and header sizes. Adding structural mechanics and uncertainty quantification would differentiate the proposal and add scientific rigor.

**Decision:**
Integrate Verification, Validation, and Uncertainty Quantification (VVUQ) into the proposal through a phased approach:

1. **Phase 1 (Complete):** Architecture updates with Phase 3.5 (Structural Hypothesis Evaluation) and new V&V section
2. **Phase 2:** Knowledge Graph entity updates, Agentic Workflow with Structural Hypothesis Agent
3. **Phase 3:** Presentation slides and structural mechanics bibliography

Key technical additions:
- Euler-Bernoulli beam theory for header sizing
- Monte Carlo uncertainty propagation for robustness analysis
- Multi-hypothesis structural analysis with Pareto ranking
- V&V framework with verification tests and validation against IRC span tables

**Consequences:**

- Pros: Scientific rigor, physics-based validation, differentiates from competitors, enables uncertainty-aware decisions
- Cons: Adds complexity, requires additional citations, document grows by 2-3 pages
- Impact: Proposal becomes more academically credible with continuum mechanics foundation

**Results (Phase 1):**

- Architecture section updated with Phase 3.5: Structural Hypothesis Evaluation
- New V&V section created (05a-verification-validation.tex, ~100 lines)
- TikZ diagram updated with Structural Solver (PDE) module
- Document grew from 11 to 12 pages
- Commit: d7e3f58

**Alternatives Considered:**

- Skip structural mechanics: Rejected, misses opportunity for scientific differentiation
- Full FEA integration: Rejected, too complex for proposal scope
- Reduced-order PDE models (chosen): Appropriate balance of rigor and simplicity

**Reference:** construction/design/vvuq-integration-plan.md

---

## ADR-008: CI/CD Pipeline with GitHub Actions

**Date:** 2026-01-24
**Status:** Accepted

**Context:**
Manual PDF compilation required local LaTeX installation and made sharing deliverables difficult. Needed automated build pipeline and public URL for PDF access.

**Decision:**
Implement CI/CD pipeline using GitHub Actions and GitHub Pages:

1. GitHub Actions workflow for automated LaTeX compilation on push to master
2. GitHub Pages deployment for public PDF access
3. Automatic updates when source files change

**Consequences:**

- Pros: No local compilation needed, easy sharing via URL, automated build verification
- Cons: Requires GitHub repository, build time on push
- Impact: Streamlined workflow, professional delivery mechanism

**Results:**

- GitHub Actions workflow created (.github/workflows/build-pdf.yml)
- GitHub Pages enabled at djjay0131.github.io/construction-ai-proposal/
- PDFs automatically updated on push
- Commits: 7489dd0 (workflow), e95a9cf (Pages deployment)

**Alternatives Considered:**

- Manual compilation only: Rejected, cumbersome for sharing
- Overleaf: Rejected, prefer Git-based workflow
- GitHub Actions + Pages (chosen): Best integration with existing Git workflow

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
