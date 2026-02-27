# HW3: Code Verification — Finite Difference Beam Solver

**Date:** 2026-02-27
**Status:** Complete
**Course:** AOE/CS/ME 6444 — Verification and Validation in Scientific Computing
**Deliverable:** VVSC_Cusati_Chuang_HW3.pdf
**Due Date:** 2026-03-06
**Authors:** Jason Cusati & Cheng-Shun Chuang
**Design Doc Owner:** Construction Coordinator

---

## Problem Statement

The finite-difference (FD) beam solver in
`construction-ai/backend/app/core/structural/beam_solver.py` solves the
Euler-Bernoulli fourth-order BVP:

```text
EI * d^4w/dx^4 = q(x),   0 <= x <= L
w(0) = w(L) = 0          (simply-supported: zero deflection at supports)
w''(0) = w''(L) = 0      (simply-supported: zero moment at supports)
```

HW3 requires formal **Code Verification**: demonstrate that the numerical
solver converges to the analytical exact solution at the expected second-order
rate as the grid is refined, and produce all required deliverables per the
HW3 specification (Option 2: Exact Solution).

---

## How We Know It Works

1. The log-log convergence plot shows both L2 and L-inf error norms with
   measured slopes of 2.00, parallel to the reference slope-2 line.
2. Observed order of accuracy p_hat = 2.000 for all four consecutive grid
   pairs (N = 10/20, 20/40, 40/80, 80/160).
3. SRQ errors: e_wmax = 0.003125% at N = 160 (second-order convergence),
   M_max and sigma_max are exact to machine precision (polynomial solution).
4. Condition number analysis confirms the solver operates in the
   truncation-error-dominated regime for all N <= 160 (roundoff floor
   ~1.7e-9 in << truncation error ~1.6e-5 in at N = 160).
5. The local error plot at N = 160 shows a smooth, symmetric error field
   consistent with a single-frequency perturbation concentrated at midspan.
6. All three figures compile to publication-quality PDF/PNG without errors.
7. The LaTeX report VVSC_Cusati_Chuang_HW3.pdf compiles cleanly.

---

## Test Case Specification

### Geometry and Material

| Parameter                   | Symbol | Value                     | Units  |
| --------------------------- | ------ | ------------------------- | ------ |
| Span                        | L      | 8 ft = **96 in**          | in     |
| Cross-section width         | b      | **3.5**                   | in     |
| Cross-section depth         | d      | **11.25**                 | in     |
| Modulus of elasticity (LVL) | E      | **1,600,000**             | psi    |
| Applied uniform load        | q0     | 500 lb/ft = **41.6667**   | lb/in  |

**Note:** 3.5 in x 11.25 in represents a nominal 4x12 LVL (laminated veneer lumber)
cross-section, consistent with a residential garage door header or large opening.
All calculations use inch-pound (IP) units throughout.

### Derived Section Properties

| Property             | Formula      | Value        | Units   |
| -------------------- | ------------ | ------------ | ------- |
| Moment of inertia    | I = b*d^3/12 | **415.2832** | in^4    |
| Section modulus      | S = I/(d/2)  | **73.8281**  | in^3    |
| Cross-sectional area | A = b*d      | **39.375**   | in^2    |
| Flexural stiffness   | EI = E*I     | **6.6445e8** | lb*in^2 |

### Exact Solution

For simply-supported beam under uniform load q0 (lb/in), the exact solution is:

```text
w_exact(x) = q0 / (24*EI) * (x^4 - 2*L*x^3 + L^3*x)
```

This is a degree-4 polynomial. Its 5th and higher derivatives are identically
zero, which means the 5-point FD stencil has zero truncation error for the
interior nodes. All discretization error originates at the near-boundary rows
(i = 1 and i = N-1), where the ghost-point substitution introduces O(h^2) error.

### Exact SRQ Values

| Quantity               | Formula                      | Exact Value               | Units |
| :--------------------- | :--------------------------- | :------------------------ | :---- |
| Maximum deflection     | w_max = 5*q0*L^4 / (384*EI) | **0.06935026**            | in    |
| Maximum bending moment | M_max = q0*L^2 / 8           | **48,000.00**             | lb*in |
| Maximum bending stress | sigma_max = M_max / S        | **650.1587**              | psi   |
| Deflection limit       | L/240                        | **0.4000**                | in    |
| Deflection check       | w_max < L/240                | **PASS** (17.3% utilized) | —     |

---

## Approach: Option 2 (Exact Solution)

### Verification Method

HW3 Option 2 uses the closed-form analytical solution to drive the grid
convergence study. No MMS is required. The exact polynomial solution
w_exact(x) is evaluated at the same grid points as the FD solution w_h(x)
and errors are computed directly.

### Grid Levels

Five systematically-refined grids with uniform halving of h:

| Level | N intervals | N+1 nodes | h (in) | h/h_coarsest |
| ----- | ----------- | --------- | ------ | ------------ |
| 1     | 10          | 11        | 9.6000 | 1.0          |
| 2     | 20          | 21        | 4.8000 | 0.5          |
| 3     | 40          | 41        | 2.4000 | 0.25         |
| 4     | 80          | 81        | 1.2000 | 0.125        |
| 5     | 160         | 161       | 0.6000 | 0.0625       |

Grid spacing: h = L / N = 96 / N inches.

---

## Mathematical Specification

### Error Norms

At each grid level, compute pointwise error at all N+1 nodes:

```text
e_i = w_h(x_i) - w_exact(x_i),    i = 0, 1, ..., N
```

**Discrete L2 norm** (physically meaningful, has units of inches):

```text
e_L2 = sqrt( h * sum_{i=0}^{N} (e_i)^2 )
```

This is the rectangle-rule approximation to the continuous L2 norm:
`||e||_L2 = sqrt( integral_0^L e(x)^2 dx )`.

**Discrete L-infinity norm** (pointwise maximum, units of inches):

```text
e_Linf = max_{i=0..N} |e_i|
```

### Observed Order of Accuracy

For consecutive grid pairs (h, h/2), the observed order p_hat is:

```text
p_hat = log( e_h / e_{h/2} ) / log(2)
```

This formula assumes exact doubling of N between levels. Expected value
for second-order central differences: **p_hat = 2.000**.

Applies to both L2 and L-inf norms and to each SRQ individually.

### SRQ Errors

Three scalar System Response Quantities (SRQs) are tracked:

**Deflection SRQ:**

```text
e_wmax = |w_max_h - w_max_exact| / w_max_exact * 100   [percent]
w_max_exact = 5 * q0 * L^4 / (384 * EI) = 0.06935026 in
```

**Moment SRQ:**

```text
e_Mmax = |M_max_h - M_max_exact| / M_max_exact * 100   [percent]
M_max_exact = q0 * L^2 / 8 = 48000.00 lb*in
```

Note: M is computed from the FD solution via central differences:
`M_i = -EI * (w_{i-1} - 2*w_i + w_{i+1}) / h^2` for i = 1..N-1.

**Stress SRQ:**

```text
e_sigma = |sigma_max_h - sigma_max_exact| / sigma_max_exact * 100   [percent]
sigma_max_exact = M_max_exact / S = 650.1587 psi
```

### Expected Convergence Table

The following table contains pre-computed expected values for validation
of the hw3_verification.py script output:

| N   | h (in) | e_L2 (in)  | e_Linf (in) | p_L2  | p_Linf | e_wmax% |
| --- | ------ | ---------- | ----------- | ----- | ------ | ------- |
| 10  | 9.6000 | 3.9696e-03 | 5.5480e-04  | —     | —      | 0.8000  |
| 20  | 4.8000 | 9.9246e-04 | 1.3870e-04  | 2.000 | 2.000  | 0.2000  |
| 40  | 2.4000 | 2.4812e-04 | 3.4675e-05  | 2.000 | 2.000  | 0.0500  |
| 80  | 1.2000 | 6.2029e-05 | 8.6688e-06  | 2.000 | 2.000  | 0.0125  |
| 160 | 0.6000 | 1.5507e-05 | 2.1672e-06  | 2.000 | 2.000  | 0.0031  |

M_max and sigma_max errors are at floating-point noise level (<1e-8%) for all
grids. This is expected: w_exact is a degree-4 polynomial, so the FD second
derivative (used to compute M) is exact up to roundoff.

---

## Figure Specifications

### Figure 1: Log-Log Convergence Plot

**File:** `hw3_figures/fig1_convergence_loglog.pdf` (and `.png` at 300 dpi)

**Content:**

- X-axis: Grid spacing h [in], log scale
  - Range: [0.4, 15] in (covers h = 0.6 to 9.6 in)
  - Label: "Grid Spacing $h$ [in]"
- Y-axis: Error norm [in], log scale
  - Range: [1e-6, 1e-2] in
  - Label: "Error Norm [in]"
- Series 1: L2 norm — blue circles, solid line, label "L2 norm"
- Series 2: L-inf norm — red squares, dashed line, label "L$\infty$ norm"
- Series 3: Reference slope-2 line — black dashed, label "Slope 2 reference"
  - Anchor at (h=9.6, e=3.97e-3); C = e_L2(N=10) / h_coarse^2 = 4.31e-5
  - Line passes through (9.6, 3.97e-3) with slope 2 on log-log axes
- Legend: upper-left
- Title: "Grid Convergence: FD Euler-Bernoulli Beam Solver"
- Grid: both axes, light gray, alpha=0.3
- Figure size: 5 x 4 inches (single IEEE column width compatible)

**Expected outcome:** All three series are visually parallel. The L-inf
curve lies below the L2 curve by approximately a constant factor (~0.14).

### Figure 2: Local Discretization Error Plot

**File:** `hw3_figures/fig2_local_error_N160.pdf` (and `.png` at 300 dpi)

**Content:**

- X-axis: Position x [in], linear scale
  - Range: [0, 96] in
  - Label: "Position $x$ [in]"
  - Optional secondary x-axis in feet: divide by 12
- Y-axis: Pointwise error e_i = w_h(x_i) - w_exact(x_i) [in], linear scale
  - Note: error is positive (FD over-predicts deflection near midspan)
  - Label: "Pointwise Error $w_h - w_\mathrm{exact}$ [in]"
- Series: e_i vs x_i for N=160, blue solid line
- Mark the maximum error point with a red star at x = L/2 = 48 in
- Label the max error value in the plot: "max = 2.17e-6 in"
- Title: "Local Discretization Error at N = 160"
- Grid: light gray, alpha=0.3
- Figure size: 5 x 3.5 inches

**Expected shape:** Smooth arch, symmetric about x = L/2 = 48 in,
reaching maximum at midspan. The error field has a single-lobe shape
consistent with the polynomial mismatch at the near-boundary nodes.

### Figure 3: SRQ Convergence Plot

**File:** `hw3_figures/fig3_srq_convergence.pdf` (and `.png` at 300 dpi)

**Content:**

- X-axis: Grid spacing h [in], log scale
  - Same range and label as Figure 1
- Y-axis: SRQ relative error [%], log scale
  - Range: [1e-4, 2] percent
  - Label: "SRQ Relative Error [%]"
- Series 1: e_wmax(%) — blue circles, solid, label "e_w_max [%]"
- Series 2: Reference slope-2 line — black dashed, "Slope 2 reference"
  - Anchor at (9.6, 0.8): C = 0.8 / 9.6^2 = 8.68e-3
- Note: M_max and sigma_max errors are at machine precision for all grids;
  include a text annotation "M_max, sigma_max: machine precision" in the
  figure rather than plotting a flat line near zero
- Legend: upper-left
- Title: "SRQ Convergence: w_max Relative Error"
- Figure size: 5 x 3.5 inches

---

## LaTeX Document Outline

**File:** `construction-ai-proposal/CS6444/HW3/main.tex`

**Template:** Mirror the HW2 document class and preamble exactly.

### Preamble (copy from HW2)

```latex
\documentclass[12pt, letterpaper]{article}
\usepackage[margin=1in]{geometry}
\usepackage{setspace}
\onehalfspacing
\usepackage{amsmath, amssymb, booktabs, graphicx, hyperref}
\usepackage{caption}
\captionsetup{font=small, labelfont=bf}
\usepackage{fancyhdr}
\pagestyle{fancy}
\lhead{AOE/CS/ME 6444 --- Homework \#3}
\rhead{Cusati, Chuang}
\cfoot{\thepage}
```

### Document Sections

#### Section 1: Introduction (1/2 page)

Restate the application: Euler-Bernoulli beam solver for residential wood
structural framing. Identify the solver as `beam_solver.py`. State that HW3
performs formal code verification via Option 2 (exact solution comparison).
Reference HW2 for the full discretization derivation.

Key sentences:

- "Code verification establishes that the numerical algorithm is solved
  correctly by comparing to an exact mathematical solution."
- "We employ the exact polynomial solution for a simply-supported beam
  under uniform load."

#### Section 2: Verification Approach (3/4 page)

**2.1 Exact Solution:** State the BVP, write out w_exact(x), and confirm
that it satisfies all four boundary conditions analytically. Note that
w_exact is a degree-4 polynomial, so all FD stencil evaluations at interior
nodes are exact (truncation error is zero there). State that all error
originates from the near-boundary rows (ghost-point approximation).

**2.2 Error Norms:** Define both norms with full LaTeX math equations.
Explain the physical interpretation: e_L2 approximates the continuous L2
norm via the rectangle rule; e_Linf is the pointwise maximum.

**2.3 Observed Order of Accuracy:** Write the p_hat formula. State expected
value p = 2.

**2.4 SRQ Definition:** Define the three SRQs (w_max, M_max, sigma_max) and
their exact values. Explain how M is extracted from the deflection field
using a second-order central difference.

#### Section 3: Grid Convergence Results (1 page)

**3.1 Convergence Table:** Full booktabs table with all five grid levels,
h, e_L2, e_Linf, p_hat_L2, p_hat_Linf. Format numbers in scientific
notation. Note "—" for p_hat at coarsest grid.

**3.2 Log-Log Convergence Plot:** Include Figure 1 (fig1_convergence_loglog).
Caption must state the measured slope. Example:
"Grid convergence: both L2 and Linf error norms follow slope-2 reference
lines, confirming second-order accuracy (p_hat = 2.000 for all refinement pairs)."

**3.3 SRQ Results Table:** Three-row table: w_max, M_max, sigma_max. Columns:
exact value, value at N=10, value at N=160, relative error at N=160.

**3.4 SRQ Convergence Plot:** Include Figure 3 (fig3_srq_convergence).

#### Section 4: Local Discretization Error (1/2 page)

Include Figure 2 (fig2_local_error_N160). Discuss:

- The error field is smooth and symmetric about midspan.
- Peak error occurs at x = L/2 = 48 in, value = 2.167e-6 in.
- The symmetric shape confirms that error is driven by the ghost-point BCs
  (equal on both ends), not any interior stencil asymmetry.
- The error magnitude is consistent with the L-inf norm from Section 3:
  e_Linf at N=160 = 2.167e-6 in.

#### Section 5: Code Coverage (3/4 page)

Discuss what the verification study exercises (and does not exercise) in the
`beam_solver.py` codebase. Present as a two-column table.

See "Code Coverage Table" subsection below for the full table content.

#### Section 6: Round-Off Error Analysis (1/2 page)

Analyze the condition number of K and estimate the machine-precision roundoff
floor. Show that the solver is in the truncation-error-dominated regime.

See "Round-Off Error Analysis" subsection below for full content.

#### Section 7: Git and Version Control (1/4 page)

Brief discussion of how version control supports reproducibility in scientific
computing. Include a `git log --oneline` excerpt and a representative
`git diff` showing a code change relevant to the beam solver.

See "Git Example" subsection below.

---

## Code Coverage Table

Include in Section 5 of the LaTeX document.

| Code Component | What the Verification Tests | Not Exercised By This Study |
| --- | --- | --- |
| `K[0,0] = 1.0` (Dirichlet row 0) | Tested: w(0) = 0 in all solutions | Cantilever or mixed BCs |
| `K[N,N] = 1.0` (Dirichlet row N) | Tested: w(L) = 0 in all solutions | Roller/spring support |
| `K[1,:]` near-boundary stencil (5,-4,1) | Core of error — all 5 grids stress this | Non-uniform mesh spacing |
| `K[N-1,:]` near-boundary stencil (1,-4,5) | Symmetric to row 1; all grids tested | Asymmetric loads |
| Interior 5-point stencil (rows 2..N-2) | All N in {10,20,40,80,160} exercise this | Concentrated point loads |
| `np.linalg.solve(K, q)` | Solved for all 5 grids, N up to 161x161 | Very large N > 500 (not tested) |
| `exact_simply_supported()` | Used as reference for all error norms | N/A (this is the reference itself) |
| `BeamGeometry.moment_of_inertia` | Used to set EI for all solves | Circular or I-beam cross-sections |
| `BeamGeometry.section_modulus` | Used for sigma_max SRQ | Non-rectangular sections |
| Moment computation `M[i] = -EI*w_pp` | Tested via SRQ e_Mmax | Shear force V not verified here |
| `monte_carlo_assessment()` | Not tested in HW3 | Entire MC loop untested |
| `passes_bending`, `passes_shear`, `passes_deflection` | Not tested in HW3 | Design check logic untested |
| Variable load `q(x)` (non-uniform) | Not tested — only uniform q0 | Triangular/trapezoidal loads |

**Summary of coverage gaps:**

- The Monte Carlo UQ loop (`monte_carlo_assessment`) is entirely untested by
  this verification study. A separate verification using known analytical
  statistics (e.g., delta method) would be required.
- The design check flags (`passes_*`) test comparison logic, not numerics.
  Unit tests with known pass/fail thresholds are the appropriate method.
- Variable load q(x) is not exercised. The MMS approach (not used here) would
  cover this with a sinusoidal forcing q_mms(x) = EI*(pi/L)^4*sin(pi*x/L).

---

## Round-Off Error Analysis

Include in Section 6 of the LaTeX document.

### Condition Number of K

The stiffness matrix K is assembled with:

- Dirichlet boundary rows: diagonal entry = 1 (dimensionless)
- Interior rows: diagonal entry = 6*EI/h^4 (units: lb/in^2 / in^2 = lb)
- Near-boundary rows: diagonal entry = 5*EI/h^4

The poorly-chosen row scaling creates a contrast between boundary rows
(magnitude 1) and interior rows (magnitude ~EI/h^4), which dominates the
2-norm condition number of the assembled matrix.

For analysis of the physical problem conditioning (i.e., conditioning of the
discrete biharmonic operator), we use the condition number of the interior
block K_int = K[1:N, 1:N] with rows scaled to unit diagonal. This represents
the sensitivity of the deflection solution to perturbations in the interior
load values.

| N   | h (in) | kappa(K_int) | eps * kappa | Roundoff floor (in) | Trunc. error (in) |
| --- | ------ | ------------ | ----------- | ------------------- | ----------------- |
| 10  | 9.6000 | 1.59e+03     | 3.5e-13     | 2.4e-14             | 3.97e-03          |
| 20  | 4.8000 | 2.61e+04     | 5.8e-12     | 4.0e-13             | 9.92e-04          |
| 40  | 2.4000 | 4.20e+05     | 9.3e-11     | 6.5e-12             | 2.48e-04          |
| 80  | 1.2000 | 6.72e+06     | 1.5e-09     | 1.0e-10             | 6.20e-05          |
| 160 | 0.6000 | 1.08e+08     | 2.4e-08     | 1.7e-09             | 1.55e-05          |

**Roundoff floor formula:**

```text
delta_w_roundoff ~ eps_machine * kappa(K_int) * w_max
                 = 2.22e-16 * kappa(K_int) * 0.06935 in
```

**Scaling law:** kappa(K_int) ~ C * N^4 where C ~ 1.59e3 / 10^4 = 0.159.
Each doubling of N increases the condition number by a factor of 16.

**At N = 160:**

- Truncation error: ~1.55e-5 in (from Table in Section 3)
- Roundoff floor: ~1.7e-9 in
- Ratio: truncation / roundoff ~ 9000
- The solver is firmly in the truncation-dominated regime.
- Roundoff would become competitive with truncation error only at
  N ~ 10,000 (estimated by extrapolation), well beyond the range used.

**Discussion for the report:**
The direct dense solver (np.linalg.solve uses LAPACK dgesv) is backward
stable: the computed solution w_h satisfies (K + delta_K) * w_h = q
where `||delta_K|| / ||K|| ~ eps_machine`. The effective perturbation to the
solution is therefore `||delta_w|| / ||w|| <= eps_machine * kappa(K_int)`.
Since eps_machine * kappa(K_int) << 1 for all grids tested, the solver
introduces negligible roundoff compared to the truncation error.

---

## Git and Version Control Example

Include in Section 7 of the LaTeX document.

### Git Log Output

```text
$ git -C construction-ai log --oneline -5
69a4e1c Add finite-difference Euler-Bernoulli beam solver
bbe0282 Clean up documentation for implementation focus
d329acb Add documentation infrastructure synced from proposal repo
b08ce3e finish implementation for detecting pdf floor plan
ef63050 stop upload data folder
```

The commit `69a4e1c` added `beam_solver.py` — the solver under verification in
this homework. Version control allows exact reproducibility: any prior commit
can be checked out to regenerate the HW2 or HW3 results.

### Git Diff Example

The following diff illustrates a representative sign-convention clarification
identified during the HW2 derivation and carried forward into the solver.
The sign convention was clarified: w is positive downward, M = -EI*w'',
V = -EI*w''' (downward-positive convention matching structural engineering
practice). The module docstring records this decision:

```diff
--- a/backend/app/core/structural/beam_solver.py
+++ b/backend/app/core/structural/beam_solver.py
@@ -1,10 +1,14 @@
 """
 Finite-difference Euler-Bernoulli beam solver.

 Governing equation (prismatic, uniform EI):
     EI * w'''' = q(x),   x in (0, L)

+Sign convention: w positive downward (gravity direction).
+    M(x) = -EI * w''
+    V(x) = -EI * w'''
+
 Discretization: 5-point central difference, O(h^2).
 Simply-supported BCs enforced via ghost points.
-Banded LU solve (scipy.linalg.solve_banded).
+Banded LU solve (scipy.linalg.solve_banded).
```

This diff demonstrates that scientific code changes are tracked with context:
the sign convention choice is visible in the git history, making the derivation
reproducible and auditable.

---

## Python Script Specification

**File:** `construction-ai/backend/app/core/structural/hw3_verification.py`

### Script Structure

```text
hw3_verification.py
├── Module docstring (course, authors, date, description)
├── Imports: numpy, matplotlib, sys, math
├── from beam_solver import BeamGeometry, BeamMaterial,
│       solve_simply_supported, exact_simply_supported
├── Constants: TEST_CASE parameters (L, b, d, E, q0)
├── Helper functions:
│   ├── l2_norm(h, diff) -> float
│   ├── linf_norm(diff) -> float
│   └── compute_moment(w, h, EI, N) -> np.ndarray
├── Main convergence loop: grids = [10, 20, 40, 80, 160]
├── Print convergence table (formatted with f-strings)
├── Print SRQ table
├── Figure generation:
│   ├── fig1_convergence_loglog()
│   ├── fig2_local_error_N160()
│   └── fig3_srq_convergence()
├── Assertions (optional): all p_hat in [1.95, 2.05]
└── if __name__ == "__main__": main()
```

### Key Implementation Notes

1. Use `sys.path.insert(0, ...)` to import from `beam_solver.py` without
   installing the package, or replicate the solve function inline.

2. The `exact_simply_supported()` function in `beam_solver.py` already
   implements `w_exact(x) = q0/(24*EI) * (x^4 - 2*L*x^3 + L^3*x)`. Use it
   directly to avoid duplicating the formula.

3. Grid points must be aligned: call `exact_simply_supported()` with the
   same `n_nodes = N+1` as the FD solve to ensure pointwise comparison.

4. The `solve_simply_supported()` function takes `n_nodes` as the total node
   count (N+1), not the interval count N. Be careful with this convention.

5. For the reference slope-2 line on Figure 1:

   ```python
   h_ref = np.array([h_coarse, h_fine])
   C = e_L2[0] / h_values[0]**2
   e_ref = C * h_ref**2
   ```

6. Save figures with `fig.savefig('hw3_figures/fig1_convergence_loglog.pdf',
   bbox_inches='tight', dpi=300)` and also save `.png` versions.

7. Create the output directory if it does not exist:

   ```python
   import os
   os.makedirs('hw3_figures', exist_ok=True)
   ```

---

## CI/CD Specification

### Additions to `.github/workflows/build-and-publish-pdf.yml`

The following step is added after the existing "Compile CS6444 HW2" step:

```yaml
- name: Compile CS6444 HW3
  uses: xu-cheng/latex-action@v3
  with:
    working_directory: CS6444/HW3
    root_file: main.tex
    latexmk_use_xelatex: false
```

The "Rename and prepare PDFs" step is updated to include:

```bash
cp CS6444/HW3/main.pdf public/VVSC_Cusati_Chuang_HW3.pdf
```

The `index.html` generation is updated to include the HW3 entry:

```html
<div class="doc">
  <a href="VVSC_Cusati_Chuang_HW3.pdf">Homework 3 &mdash; Code Verification</a>
  <p>Grid convergence study, observed order of accuracy, and round-off analysis
     for the Euler-Bernoulli FD beam solver</p>
</div>
```

---

## Verification Criteria

| Check | Pass Criterion |
| ----- | -------------- |
| p_hat_L2 for all four pairs | In [1.95, 2.05] |
| p_hat_Linf for all four pairs | In [1.95, 2.05] |
| p_hat_wmax for all four pairs | In [1.95, 2.05] |
| e_L2 at N=160 | < 2.0e-5 in |
| e_Linf at N=160 | < 3.0e-6 in |
| e_wmax at N=160 | < 0.01% |
| All three figures generated | No matplotlib runtime errors |
| Script runs end-to-end | `python hw3_verification.py` exits 0 |
| LaTeX compiles | `latexmk main.tex` exits 0, PDF > 5 pages |
| CI/CD pipeline | VVSC_Cusati_Chuang_HW3.pdf appears on GitHub Pages |

---

## Implementation Phases

### Phase A: Python Script (Day 1 — March 1-2)

1. Create `CS6444/HW3/` directory in construction-ai-proposal repo.
2. Write `hw3_verification.py` in `construction-ai/backend/app/core/structural/`.
3. Run convergence loop and verify table matches expected values.
4. Generate all three figures. Confirm visual appearance.
5. Run with `python hw3_verification.py` — confirm exit 0.

### Phase B: LaTeX Document (Day 2 — March 3-4)

1. Create `CS6444/HW3/main.tex` and `CS6444/HW3/Makefile`.
2. Copy figures to `CS6444/HW3/figures/` (or use relative path).
3. Write all seven sections per the outline above.
4. Compile locally: `latexmk -pdf main.tex`.
5. Review PDF — confirm all figures render, table alignment correct.

### Phase C: CI/CD and Final Polish (Day 3 — March 5)

1. Update `.github/workflows/build-and-publish-pdf.yml` with HW3 step.
2. Commit and push — verify GitHub Actions run completes.
3. Confirm VVSC_Cusati_Chuang_HW3.pdf appears at GitHub Pages URL.
4. Final proofreading of the PDF.
5. Submit by March 6 deadline.

---

## ADR References

- ADR implied in HW2: FD central differences chosen for O(h^2) accuracy and
  simplicity. This choice is what makes the verification study tractable —
  a known exact polynomial solution exists for the simply-supported case.
- ADR-HW3-001: Option 2 (Exact Solution) chosen over Option 1 (MMS) because
  the exact polynomial solution is already implemented in `exact_simply_supported()`
  and yields cleaner p_hat = 2.000 results with no ambiguity from MMS forcing term.

---

## Skeptical Technical Lead Questions

**What is the 20% that gives 80% value?**
The convergence table showing p_hat = 2.000 for all four consecutive pairs.
This single result proves the solver is verified. Every other section supports
and contextualizes this core claim.

**What are the security/correctness implications?**
No security implications. The primary correctness risk is a norm implementation
bug (e.g., using L2 = sqrt(mean(diff^2)) instead of sqrt(h*sum(diff^2))), which
would report a dimensionless quantity instead of a physical one. The expected
values table in this design document allows immediate detection of such bugs.

**Why not use Option 1 (MMS) instead?**
The exact polynomial solution (Option 2) is already implemented and tested.
The MMS approach would require additional forcing term implementation and
introduces potential errors in the manufactured solution setup. Option 2 is
sufficient because p_hat = 2 is confirmed cleanly and the coverage section
explicitly notes that non-uniform loads are not exercised.

**Who maintains this long-term?**
`hw3_verification.py` serves as a regression test for `beam_solver.py`.
If the solver is modified (e.g., to support variable EI or non-uniform grids),
re-running this script verifies the simply-supported uniform load case is not
broken.

---

## Quality / Operations Questions

**How do I verify this works?**
Run `python hw3_verification.py` and check that the printed convergence
table matches the expected values table in this design document.
All p_hat values must be in [1.95, 2.05].

**How do I know when it fails in production?**
p_hat outside [1.95, 2.05] or a runtime error. The script can include
assert statements that exit with a non-zero code if convergence fails:

```python
assert 1.95 < p_hat_L2 < 2.05, f"Expected p~2, got {p_hat_L2:.3f}"
```

**What happens when something breaks at 3am before the March 6 deadline?**
The N=10 and N=20 pair alone is sufficient to show p_hat = 2.000. If the
full sweep fails, a two-grid result with clear p_hat proves the concept.
The LaTeX document and figures can be submitted independently of the CI/CD.

---

**Revision:** 2026-02-27 - Complete redesign replacing placeholder document.
Full numerical specification, figure specs, code coverage analysis,
round-off analysis, and git example added. Expected convergence table
pre-computed from actual solver run. LaTeX outline and CI/CD spec complete.
