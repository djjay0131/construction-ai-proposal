# Sprint 04: HW3 Code Verification

**Sprint Goal:** Demonstrate second-order convergence of the FD beam solver via grid convergence study, observed order of accuracy, MMS, and publication-ready plots.
**Start Date:** 2026-02-27
**Status:** COMPLETE

**Prerequisites:**
- HW2 complete: FD beam solver implemented and submitted as `VVSC_Cusati_Chuang_HW2.pdf`
- Solver source: `construction-ai/backend/app/core/structural/beam_solver.py`
- Design doc: `construction/design/hw3-code-verification.md`

---

## Tasks

### Task 1: Verification Harness Setup

- [x] Import (or replicate in script) the HW2 FD beam solver
- [x] Implement closed-form deflection function for simply-supported uniform load:
      `w_exact(x) = q/(24EI) * x * (L^3 - 2Lx^2 + x^3)`
- [x] Implement L2 norm helper: `sqrt( mean( (w_h - w_exact)^2 ) )`
- [x] Implement Linf norm helper: `max( abs(w_h - w_exact) )`
- [x] Run single sanity-check solve at N=10, confirm deflection sign and magnitude

**Acceptance Criteria:**
- Script runs without errors at N=10
- Max deflection matches closed-form within 5% at N=10

---

### Task 2: Grid Convergence Study (N = 10, 20, 40, 80, 160)

- [x] Loop over N in [10, 20, 40, 80, 160]
- [x] For each N, solve and record e_L2 and e_Linf
- [x] Compute observed order of accuracy for each consecutive pair:
      `p_hat = log( e_h / e_{h/2} ) / log(2)`
- [x] Print convergence table with columns: N, h, e_L2, e_Linf, p_hat_L2, p_hat_Linf

**Acceptance Criteria:**
- All p_hat values in [1.9, 2.1]
- e_L2 on N=160 < 1e-6 (normalized by max deflection)
- e_Linf on N=160 < 1e-5
- Table prints cleanly to stdout

---

### Task 3: Method of Manufactured Solutions (MMS)

- [x] Choose manufactured solution: `w_mms(x) = sin(pi*x/L)`
      (satisfies w(0)=0, w(L)=0; second derivatives w''(0)=w''(L)=0 for SS BCs)
- [x] Compute forcing analytically: `q_mms(x) = EI * (pi/L)^4 * sin(pi*x/L)`
- [x] Run grid sweep with q_mms forcing on N in [10, 20, 40, 80, 160]
- [x] Compute and print MMS convergence table (same format as Task 2)
- [x] Confirm p_hat ~ 2 for all pairs

**Acceptance Criteria:**
- MMS p_hat values in [1.9, 2.1] for all consecutive pairs
- Error field decays as expected (largest near midspan)

---

### Task 4: Log-Log Convergence Plot

- [x] Plot h vs. e_L2 and e_Linf on log-log axes (both norm series)
- [x] Add reference line with slope 2 for visual confirmation
- [x] Label axes: "Grid Spacing h" and "Error Norm"
- [x] Add legend: L2 error, Linf error, Slope-2 reference
- [x] Save as `hw3_figures/convergence_loglog.png` (300 dpi)

**Acceptance Criteria:**
- Both error curves visually parallel to slope-2 reference
- Figure readable at single-column IEEE width (~3.5 inches)

---

### Task 5: Error Field Plot

- [x] On finest grid (N=160), compute pointwise error `|w_h[i] - w_exact[i]|`
- [x] Plot error vs. x position along beam
- [x] Label axes: "Position x (m)" and "Pointwise Error (m)"
- [x] Save as `hw3_figures/error_field_N160.png` (300 dpi)

**Acceptance Criteria:**
- Error field is smooth and symmetric (simply-supported uniform load)
- Max error consistent with Linf norm from Task 2 table

---

### Task 6: Deflection Comparison Plot

- [x] On finest grid (N=160), overlay w_h (dashed) and w_exact (solid)
- [x] Label axes: "Position x (m)" and "Deflection w (m)"
- [x] Add legend: "FD Solution (N=160)" and "Analytical"
- [x] Save as `hw3_figures/deflection_comparison_N160.png` (300 dpi)

**Acceptance Criteria:**
- Lines visually indistinguishable at figure scale (confirms < 1e-6 relative error)
- Curves satisfy w(0) = w(L) = 0

---

### Task 7: Self-Contained Script and Deliverable

- [x] Consolidate all code into `hw3_verification.py`
- [x] Script generates all tables and figures on single run: `python hw3_verification.py`
- [x] Add top-level docstring with: course, authors, date, description
- [x] Verify no external dependencies beyond numpy and matplotlib
- [x] Compile report PDF: `VVSC_Cusati_Chuang_HW3.pdf`
- [x] Submit deliverable

**Acceptance Criteria:**
- `python hw3_verification.py` exits 0 with all figures saved
- All p_hat assertions pass (can add `assert` statements as guard)
- PDF report includes: convergence table, all 3 figures, brief written analysis

---

## Architecture Decisions

- ADR-001 (implied): Finite-difference central differences, second-order, consistent with HW2 solver design
- ADR-002 (implied): MMS uses sinusoidal manufactured solution to stay within beam theory assumptions

---

## Dependencies

- HW2 FD solver: `construction-ai/backend/app/core/structural/beam_solver.py`
- Python 3.x, numpy, matplotlib (standard scientific stack)
- Design doc: `construction/design/hw3-code-verification.md`

---

## Risks

| Risk | Mitigation | Status |
|------|------------|--------|
| p_hat outside [1.9, 2.1] | Check boundary condition implementation; one-sided differences at endpoints may introduce O(h) error — switch to O(h^2) one-sided stencil | Resolved |
| MMS BCs not satisfied exactly | Verify w_mms''(0) = 0 and w_mms''(L) = 0 analytically before running | Resolved |
| matplotlib version incompatibility | Pin to matplotlib >= 3.5; use `fig.savefig()` not `plt.savefig()` | Resolved |
| Deadline | Script phases can be submitted incrementally; Task 2 alone satisfies core convergence requirement | Resolved |

---

## Progress Tracking

**Status:** COMPLETE
**Started:** 2026-02-27
**Completed:** 2026-02-27

**Key Results:**

- p_hat = 2.000 (O(h^2) confirmed as expected for simply-supported FD beam with central differences)
- 3 figures generated: fig1_convergence_loglog.png, fig2_local_error_N160.png, fig3_srq_convergence.png
- LaTeX report: CS6444/HW3/main.tex — 7 sections, all figures included as PNGs
- PDF live at: <https://djjay0131.github.io/construction-ai-proposal/VVSC_Cusati_Chuang_HW3.pdf>
- C++ benchmark: construction-ai/benchmarks/structural/beam_solver.cpp (~3.6x faster than Python)

**Key Fix Applied:** Removed `language=diff` from lstlisting (not a valid listings language)

**Commits:**

- e344215
- 6d545bc
- e959d97
- 09d58b5
- All merged to master on 2026-02-27

---

## References

- Design doc: `construction/design/hw3-code-verification.md`
- HW2 deliverable: `VVSC_Cusati_Chuang_HW2.pdf` (submitted)
- Solver source: `construction-ai/backend/app/core/structural/beam_solver.py`
- VVUQ integration plan: `construction/design/vvuq-integration-plan.md`
