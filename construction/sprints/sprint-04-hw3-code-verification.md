# Sprint 04: HW3 Code Verification

**Sprint Goal:** Demonstrate second-order convergence of the FD beam solver via grid convergence study, observed order of accuracy, MMS, and publication-ready plots.
**Start Date:** 2026-02-27
**Status:** Not Started

**Prerequisites:**
- HW2 complete: FD beam solver implemented and submitted as `VVSC_Cusati_Chuang_HW2.pdf`
- Solver source: `construction-ai/backend/app/core/structural/beam_solver.py`
- Design doc: `construction/design/hw3-code-verification.md`

---

## Tasks

### Task 1: Verification Harness Setup

- [ ] Import (or replicate in script) the HW2 FD beam solver
- [ ] Implement closed-form deflection function for simply-supported uniform load:
      `w_exact(x) = q/(24EI) * x * (L^3 - 2Lx^2 + x^3)`
- [ ] Implement L2 norm helper: `sqrt( mean( (w_h - w_exact)^2 ) )`
- [ ] Implement Linf norm helper: `max( abs(w_h - w_exact) )`
- [ ] Run single sanity-check solve at N=10, confirm deflection sign and magnitude

**Acceptance Criteria:**
- Script runs without errors at N=10
- Max deflection matches closed-form within 5% at N=10

---

### Task 2: Grid Convergence Study (N = 10, 20, 40, 80, 160)

- [ ] Loop over N in [10, 20, 40, 80, 160]
- [ ] For each N, solve and record e_L2 and e_Linf
- [ ] Compute observed order of accuracy for each consecutive pair:
      `p_hat = log( e_h / e_{h/2} ) / log(2)`
- [ ] Print convergence table with columns: N, h, e_L2, e_Linf, p_hat_L2, p_hat_Linf

**Acceptance Criteria:**
- All p_hat values in [1.9, 2.1]
- e_L2 on N=160 < 1e-6 (normalized by max deflection)
- e_Linf on N=160 < 1e-5
- Table prints cleanly to stdout

---

### Task 3: Method of Manufactured Solutions (MMS)

- [ ] Choose manufactured solution: `w_mms(x) = sin(pi*x/L)`
      (satisfies w(0)=0, w(L)=0; second derivatives w''(0)=w''(L)=0 for SS BCs)
- [ ] Compute forcing analytically: `q_mms(x) = EI * (pi/L)^4 * sin(pi*x/L)`
- [ ] Run grid sweep with q_mms forcing on N in [10, 20, 40, 80, 160]
- [ ] Compute and print MMS convergence table (same format as Task 2)
- [ ] Confirm p_hat ~ 2 for all pairs

**Acceptance Criteria:**
- MMS p_hat values in [1.9, 2.1] for all consecutive pairs
- Error field decays as expected (largest near midspan)

---

### Task 4: Log-Log Convergence Plot

- [ ] Plot h vs. e_L2 and e_Linf on log-log axes (both norm series)
- [ ] Add reference line with slope 2 for visual confirmation
- [ ] Label axes: "Grid Spacing h" and "Error Norm"
- [ ] Add legend: L2 error, Linf error, Slope-2 reference
- [ ] Save as `hw3_figures/convergence_loglog.png` (300 dpi)

**Acceptance Criteria:**
- Both error curves visually parallel to slope-2 reference
- Figure readable at single-column IEEE width (~3.5 inches)

---

### Task 5: Error Field Plot

- [ ] On finest grid (N=160), compute pointwise error `|w_h[i] - w_exact[i]|`
- [ ] Plot error vs. x position along beam
- [ ] Label axes: "Position x (m)" and "Pointwise Error (m)"
- [ ] Save as `hw3_figures/error_field_N160.png` (300 dpi)

**Acceptance Criteria:**
- Error field is smooth and symmetric (simply-supported uniform load)
- Max error consistent with Linf norm from Task 2 table

---

### Task 6: Deflection Comparison Plot

- [ ] On finest grid (N=160), overlay w_h (dashed) and w_exact (solid)
- [ ] Label axes: "Position x (m)" and "Deflection w (m)"
- [ ] Add legend: "FD Solution (N=160)" and "Analytical"
- [ ] Save as `hw3_figures/deflection_comparison_N160.png` (300 dpi)

**Acceptance Criteria:**
- Lines visually indistinguishable at figure scale (confirms < 1e-6 relative error)
- Curves satisfy w(0) = w(L) = 0

---

### Task 7: Self-Contained Script and Deliverable

- [ ] Consolidate all code into `hw3_verification.py`
- [ ] Script generates all tables and figures on single run: `python hw3_verification.py`
- [ ] Add top-level docstring with: course, authors, date, description
- [ ] Verify no external dependencies beyond numpy and matplotlib
- [ ] Compile report PDF: `VVSC_Cusati_Chuang_HW3.pdf`
- [ ] Submit deliverable

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
| p_hat outside [1.9, 2.1] | Check boundary condition implementation; one-sided differences at endpoints may introduce O(h) error — switch to O(h^2) one-sided stencil | Open |
| MMS BCs not satisfied exactly | Verify w_mms''(0) = 0 and w_mms''(L) = 0 analytically before running | Open |
| matplotlib version incompatibility | Pin to matplotlib >= 3.5; use `fig.savefig()` not `plt.savefig()` | Open |
| Deadline | Script phases can be submitted incrementally; Task 2 alone satisfies core convergence requirement | Open |

---

## Progress Tracking

**Status:** Not Started
**Started:** -
**Completed:** -

**Commits:**
- (pending)

---

## References

- Design doc: `construction/design/hw3-code-verification.md`
- HW2 deliverable: `VVSC_Cusati_Chuang_HW2.pdf` (submitted)
- Solver source: `construction-ai/backend/app/core/structural/beam_solver.py`
- VVUQ integration plan: `construction/design/vvuq-integration-plan.md`
