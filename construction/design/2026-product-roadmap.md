# 2026 Product Roadmap — Build / Test / Deploy Plan

**Status:** APPROVED 2026-06-06
**Author:** Jason Cusati (with AI assistance)
**Repos covered:** `construction-ai-proposal` (paper + Pages) and `construction-ai` (product code)
**Source spec:** Section 8 of `proposal/main.tex` ("Phased Development Plan")
**Feature backlog:** `construction-ai/llm/features/BACKLOG.md`

This document is the operational plan for closing out the IEEE proposal paper and
implementing the proposal's Phase 1 (KG Foundation + Enhanced Takeoff). Six discrete
sprints, each self-contained with explicit pre-conditions, build, test, deploy, and
done criteria. Designed for a burst / opportunistic cadence — start any sprint when
its pre-conditions are met.

---

## 1. Sprint Sequence

| # | Sprint | Repo | Size | Spec |
|---|---|---|---|---|
| 0 | Memory-bank refresh (both repos) | both | XS (1–2 hr) | this doc |
| 1 | VVUQ Phase 3 closeout: 4 slides + 10–15 citations + final review | proposal | S (3–5 hr) | `construction/design/vvuq-integration-plan.md` |
| 2 | Neo4j Setup on GCP + lumber/IRC seed + provenance + CI/CD bootstrap | code | M (8–12 hr) | `llm/features/neo4j-setup.md` (SPECIFIED) |
| 3 | Raster/Scanned Drawing Support | code | M (6–10 hr) | `llm/features/raster-scanned-drawing-support.md` (SPECIFIED) |
| 4 | OCR Dimension Extraction & Object Catalog | code | M (6–10 hr) | `llm/features/ocr-dimension-extraction.md` (SPECIFIED) |
| 5 | Phase 1 integration smoke test against 2–3 plan sets | code | M-L (8–12 hr) | this doc + proposal §8 success criteria |

**Ordering rule:** Sprint N must be done before Sprint N+1, with one exception —
Sprints 3 and 4 are independent and can run in either order; default is 3 → 4 to
match the construction-ai memory bank's existing "Immediate Next Steps".

---

## 2. Cross-cutting Infrastructure Decisions

These hold across every sprint. Locked 2026-06-06.

**Neo4j hosting:** ~~AuraDB Free tier~~ **Self-hosted Neo4j Community Edition on
Compute Engine** (pivot 2026-06-14 — see `construction-ai/infra/README.md`).
Originally specified as AuraDB Free; switched to GCE so the entire stack
lives in `vt-gcp-00042` with no third-party SaaS dependency, no manual Aura
signup, and no 30-day idle pause. Cost ≈ $25/mo (was estimated <$10/mo with
Aura Free; VPC connector + always-on VM are the deltas). `e2-small` VM in
`us-east4`, reserved internal IP, Cloud Run reaches it via a Serverless VPC
Access connector. For CI tests, the existing testcontainers approach still
works locally; the deployed CD smoke-test exercises the live VM.

**Backend hosting:** Cloud Run. Container built in GitHub Actions, pushed to Artifact
Registry, deployed via Terraform. Scales to zero.

**Frontend hosting:** Cloud Storage + Cloud CDN (static site). Unchanged.

**Tests in CI:** GitHub Actions runs pytest on every PR. Integration tests spin up an
ephemeral Neo4j container inside the runner (keeps CI hermetic, no Aura quota burn).

**Secrets:** GCP Secret Manager for Cloud Run (`NEO4J_URI`, `NEO4J_USER`,
`NEO4J_PASSWORD`). GitHub Actions secrets for CI.

**Infra-as-code:** Extend existing `construction-ai/infra/main.tf`. Reuse GCP project
`vt-gcp-00042`. Add Cloud Run service, Artifact Registry repo, Secret Manager secrets.

**Branch + PR model:** Feature branch per spec (e.g. `feature/neo4j-setup`) → PR →
master. CI green required. Memory bank may be updated via direct push to master.

**Constellize workflow:** SPECIFIED specs go through `constellize:feature:implement`
then `constellize:feature:verify`. Unspecified backlog items (Cut List Opt, Header
Sizing, etc.) get `constellize:feature:specify` first.

**Local dev:** No local Docker stack. Memory-constrained machine. Backend can run via
`uv run uvicorn` locally for fast inner-loop work, pointing at Aura prod or a local
Neo4j Aura-emulator if available. Tests run in CI for the full stack.

**Est. monthly cloud cost:** <$10 (Cloud Run + CDN + Artifact Registry + Secret
Manager). $0 for Neo4j.

---

## 3. Per-Sprint Detail

### Sprint 0 — Memory-bank refresh (both repos)

**Pre-conditions**
- Both repos clean on master (verified 2026-06-06).
- This roadmap doc exists.

**Build**
- `construction-ai-proposal/memory-bank/activeContext.md`: rewrite "Current Work
  Phase" to "Pivot from CS6444 (done) to product implementation". Mark VVUQ Phase 2
  fully merged. Mark VVUQ Phase 3 as in-progress (this sprint sequence).
- `construction-ai-proposal/memory-bank/progress.md`: add entries for HW3 final
  review PR#9, HW4, HW5, Final Project at tag `final-project-submitted-2026-05-11`.
- `construction-ai-proposal/memory-bank/phases.md`: register Phase 9 (CS6444 Final
  Project — Complete), Phase 10 (Product Roadmap — In Progress).
- `construction-ai/memory-bank/activeContext.md`: rewrite "Current Work Focus" to
  "Returning to product roadmap after CS6444 Final Project submission". Add link to
  this roadmap doc.
- Both repos' `activeContext.md` end with a "2026-06-06" entry naming Sprint 1 as
  the next sprint.

**Test**
- Read-pass through each updated file. No broken cross-references.

**Deploy**
- Direct commits to master in each repo.

**Done criteria**
- Both `activeContext.md` files contain a 2026-06-06 entry.
- Both `phases.md` files reflect current phase state.
- This roadmap is referenced from both memory banks.

---

### Sprint 1 — VVUQ Phase 3 closeout

**Pre-conditions**
- Sprint 0 done.
- `proposal/main.pdf` and `proposal/presentation.pdf` compile clean on current master.

**Build**
- Add 4 slides to `proposal/presentation.tex`:
  1. Structural Challenge (problem framing)
  2. Hypothesis Generation (multi-load-path enumeration)
  3. PDE Evaluation (Euler-Bernoulli beam solver)
  4. V&V (verification + validation framework)
- Add 10–15 structural-mechanics citations to `proposal/references.bib`. Candidates:
  Timoshenko & Goodier, Reddy (Energy Principles), ASME V&V 10 / V&V 20, Roy &
  Oberkampf, Bathe (FEM), Oden, Roache, Babuška/Strouboulis, Logan (FEM intro).
- Cite the new refs at appropriate places in
  `proposal/sections/05a-verification-validation.tex`.
- Phase 4 final review: full xref check, page count check.

**Test**
- `cd proposal && make all` — compile clean.
- `main.pdf` page count ≤ 14.
- `presentation.pdf` slide count = 25 (21 + 4).
- No undefined references in compile log.
- All new `\cite{}` keys resolve.

**Deploy**
- Push to master → GitHub Actions → GitHub Pages.
- `curl -sI` Pages URLs with cache-bust query, verify `Last-Modified` advanced.

**Done criteria**
- `presentation.pdf` published with 25 slides.
- `main.pdf` still ≤ 14 pages.
- Both PDFs live on Pages at the canonical URLs.
- Memory bank reflects Sprint 1 done.

---

### Sprint 2 — Neo4j Setup on GCP (proposal Phase 1 core)

**Pre-conditions**
- Sprint 1 done.
- AuraDB Free instance provisioned manually (prod + ci-test). Credentials stored in
  GCP Secret Manager and GitHub Actions secrets.
- `llm/features/neo4j-setup.md` re-read; if any AC is stale, update spec first
  (status: SPECIFIED → keep at SPECIFIED but bump date).

**Build**
- Run `constellize:feature:implement neo4j-setup` from `construction-ai/`.
- Creates `backend/app/core/kg/{client,provenance,seed,loader}.py`; refactors
  `lumber_calculator.py` to receive a dict (no hardcoded `LUMBER_SPECS`); adds
  `NEO4J_*` to `config.py` and `.env.example`; adds `neo4j` to `requirements.txt`.
- **Folded in:** CI bootstrap (item 11.3 in `BACKLOG.md`). Add
  `construction-ai/.github/workflows/ci.yml` that runs pytest with an ephemeral
  Neo4j 5.x container. Add `cd.yml` that on master push builds container, pushes to
  AR, deploys to Cloud Run.
- **Folded in:** Terraform extensions in `infra/main.tf`: Cloud Run service,
  Artifact Registry repo, Secret Manager entries for `NEO4J_*`.

**Test**
- pytest ≥ 80% coverage on `backend/app/core/kg/`.
- All 10 ACs from `neo4j-setup.md` green.
- `constellize:feature:verify` all four gates pass (test integrity, health check,
  deployment readiness, maintainability).

**Deploy**
- Terraform `apply` to `vt-gcp-00042`.
- GitHub Actions `cd.yml` builds + deploys backend to Cloud Run.
- Cloud Run URL serves `/api/takeoff/process/{drawing_id}` against Aura prod.
- Smoke test: POST a known DXF, get expected BOM with rule citations.

**Done criteria**
- Spec status: SPECIFIED → IMPLEMENTED → VERIFIED.
- PR merged to master.
- Cloud Run URL alive, healthchecks green.
- Memory banks reflect done.

---

### Sprint 3 — Raster/Scanned Drawing Support

**Pre-conditions**
- Sprint 2 done.
- `llm/features/raster-scanned-drawing-support.md` re-read; bump date if any AC stale.

**Build**
- Run `constellize:feature:implement raster-scanned-drawing-support` from
  `construction-ai/`.

**Test**
- pytest passes per spec ACs.
- `constellize:feature:verify` all four gates pass.
- Smoke test against one scanned PDF returns expected wall list.

**Deploy**
- Merge to master → CI/CD redeploys backend container to Cloud Run.

**Done criteria**
- Spec status → VERIFIED.
- PR merged to master.
- Cloud Run can process a scanned PDF.

---

### Sprint 4 — OCR Dimension Extraction & Object Catalog

**Pre-conditions**
- Sprint 3 done.
- `llm/features/ocr-dimension-extraction.md` re-read; bump date if any AC stale.

**Build**
- Run `constellize:feature:implement ocr-dimension-extraction` from `construction-ai/`.

**Test**
- pytest passes per spec ACs.
- `constellize:feature:verify` all four gates pass.
- Smoke test: OCR dimensions validate (don't override) geometry on a test plan.

**Deploy**
- Merge to master → CI/CD redeploys.

**Done criteria**
- Spec status → VERIFIED.
- PR merged to master.

---

### Sprint 5 — Phase 1 integration smoke test

**Pre-conditions**
- Sprints 2, 3, 4 all done.

**Build**
- End-to-end harness at `backend/tests/integration/test_phase1_e2e.py`.
- Three test plan sets covering all three input paths: one DXF, one vector PDF, one
  scanned PDF.
- Validation report doc at `construction/design/phase1-validation-report.md`
  capturing BOM accuracy, KG query latency, and rule-citation completeness.

**Test**
- pytest e2e suite passes.
- Manual smoke test against Cloud Run URL.

**Map to proposal Section 8 Phase 1 success criteria**
- [ ] BOM accuracy > 90% on validation set
- [ ] All BOM items link to plan facts and rules (provenance complete)
- [ ] KG query latency < 100ms

**Deploy**
- No new infra. Verifies prior deploys.

**Done criteria**
- All three Section 8 success criteria met and documented in the validation report.
- Validation report committed and linked from both memory banks.
- Roadmap status flips to "Phase 1 Complete; pick next sprint from BACKLOG.md".

---

## 4. After Phase 1 — What's Next

Once Sprint 5 closes, return to `BACKLOG.md` and pick from the unspecified backlog.
Top candidates per construction-ai memory bank's "Immediate Next Steps":

- **3.2 Header Sizing** — wire existing `beam_solver.py` into takeoff pipeline.
  Lowest effort; uses code already verified through CS6444. Needs spec first.
- **4.1 Cut List Optimization (OR-Tools)** — headline business value of the
  proposal (waste <8% target). Needs spec first.
- **5.2 Seed Data: Lumber & Fasteners extended** — expand KG seed beyond Sprint 2.
- **5.3 Seed Data: IRC Building Codes** — expand IRC rules beyond Sprint 2 (R602.3
  is the only one seeded initially).
- **8.1 IRC Compliance Engine** — depends on 5.3.
- **6.x Agent Framework** — depends on Neo4j (done in Sprint 2). The proposal's
  Phase 2.

Each future sprint follows the same pattern: spec → implement (constellize) → verify
→ deploy → memory-bank update.

---

## 5. Memory-bank Sync Reminder

After each sprint completes, update **both** memory banks:
1. `construction-ai-proposal/memory-bank/activeContext.md` + `progress.md` + `phases.md`
2. `construction-ai/memory-bank/activeContext.md` + `progress.md`

This is non-negotiable per the project's CLAUDE.md instructions. The personal memory
bank (at `~/.claude/projects/...`) also gets touched if the sprint surprises us.

---

## 6. Open Questions

- Are there real plan sets for the Sprint 5 validation pool? If not, we'll need to
  source 2–3 (one DXF, one vector PDF, one scanned PDF) before Sprint 5 starts.
- Aura Free tier 30-day idle-pause behavior — do we need a keep-alive ping to
  prevent the prod instance from being paused between bursty work sessions? Decide
  during Sprint 2.
- CI-tier Aura instance vs in-runner Neo4j container: this doc commits to in-runner
  container, but verify behavior is identical to Aura before merging Sprint 2.

---

## Appendix A: File References

| Path | Repo | Purpose |
|------|------|---------|
| `proposal/main.tex` §8 | proposal | Source of Phase 1 success criteria |
| `proposal/presentation.tex` | proposal | Slides to extend in Sprint 1 |
| `proposal/references.bib` | proposal | Bib to extend in Sprint 1 |
| `proposal/sections/05a-verification-validation.tex` | proposal | Cite new refs here |
| `construction/design/vvuq-integration-plan.md` | proposal | VVUQ Phase 3 source |
| `llm/features/BACKLOG.md` | code | Full feature inventory |
| `llm/features/neo4j-setup.md` | code | Sprint 2 spec |
| `llm/features/raster-scanned-drawing-support.md` | code | Sprint 3 spec |
| `llm/features/ocr-dimension-extraction.md` | code | Sprint 4 spec |
| `backend/app/core/structural/beam_solver.py` | code | CS6444-verified solver, ready for Header Sizing post-Phase-1 |
| `infra/main.tf` | code | Terraform for Sprint 2 GCP extensions |
| `memory-bank/activeContext.md` | both | Sprint sync target |

## Appendix B: Sprint Status Tracker

| Sprint | Status | Started | Done | Commit / PR |
|---|---|---|---|---|
| 0 | DONE | 2026-06-06 | 2026-06-07 | proposal `0f58f50`, code `aa1f761` |
| 1 | DONE | 2026-06-08 | 2026-06-08 | 1a proposal `77961e6` code `375847c`; 1b proposal `dbbb24f` code `b314006`; 1c follows |
| 2 | DONE | 2026-06-09 | 2026-06-14 | 2a code 9d9ac60+929330f; 2b infra 2db7a63+9614030; 2c smoke-test 012e748+7258e3d; self-host pivot 4ea076c; CD green at 27512255933; live https://construction-ai-backend-542888988741.us-east4.run.app |
| 3 | PENDING | — | — | — |
| 4 | PENDING | — | — | — |
| 5 | PENDING | — | — | — |

Sprint 1 detail: split into 1a (citations), 1b (presentation slides), 1c
(final review + 5→6 fix). All three VERIFIED. Final review record at
`construction/design/vvuq-phase3-final-review.md`.

Update this table at the end of each sprint.
