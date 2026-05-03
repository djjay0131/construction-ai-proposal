# CS6444 Test 1 — Study Notes

## Questions & Worked Solutions

---

### Q1: Validation

**Question:** Validation:
- a) addresses the correctness of the software programming
- b) involves the numerical accuracy of a solution
- c) addresses the mathematical accuracy of a solution
- d) **requires the comparison of model results to experimental data** ✓

**Explanation:**

The V&V framework distinguishes two activities:

| | Verification | Validation |
|---|---|---|
| Question answered | "Are we solving the equations right?" | "Are we solving the right equations?" |
| Compares against | Analytical/exact solutions, code inspections | Experimental/real-world data |
| Scope | Code correctness, numerical accuracy, math accuracy | Model fidelity to physical reality |

Options (a), (b), and (c) are all aspects of **verification**. Only (d) — comparing model results to experimental data — is **validation**.

---

### Q2: Aleatory vs Epistemic Uncertainty Example

**Question:** Give an example of aleatory and epistemic uncertainty from your field of study (in 30 words or less).

**Answer:**

**Aleatory:** Natural variability in lumber bending strength due to knots, grain orientation, and moisture across boards.

**Epistemic:** Uncertainty in a beam's load capacity when using simplified grading rules instead of full mechanical testing.

**Key distinction:**

| Aleatory | Epistemic |
| --- | --- |
| Inherent randomness | Lack of knowledge |
| Cannot be reduced | Can be reduced (more data/research) |
| e.g., material variability | e.g., incomplete site data |

---

### Q3: Regression Testing

**Question:** Regression testing is used to detect unintended changes to the software. True or false?

**Answer:** **True**

Regression testing re-runs existing test cases after code modifications to verify that previously working functionality has not been broken by the changes.

---

### Q4: System-Level Testing in Scientific Computing

**Question:** Discuss why system-level testing is so challenging for scientific computing (in 30 words or less).

**Answer:** Exact solutions rarely exist for complex coupled systems, making it difficult to define expected outputs. Small numerical errors can propagate unpredictably, and results depend on discretization, algorithms, and platform.

---

### Q5: Convergence Definition

**Question:** Convergence addresses whether or not the discrete equations approach the partial differential equations as the mesh and time step are systematically refined. True or false?

**Answer:** **True**

As $h \to 0$ and $\Delta t \to 0$, the discrete solution should approach the continuum (PDE) solution. This is the definition of convergence in numerical methods.

---

### Q6: Manufactured Solutions

**Question:** Manufactured solutions:
- a) require the specification of user-defined source terms
- b) require the specification of user-defined initial/boundary conditions
- c) should exercise all terms in the governing equations
- d) should be smoothly varying functions
- e) **all answers are correct** ✓

**Explanation (MMS process):**

1. **Choose** a smooth, arbitrary solution $u_{ms}(x,t)$ — should exercise all terms (d)
2. **Substitute** $u_{ms}$ into the governing PDE to derive the required source term $f(x,t)$ — user-defined source (a)
3. **Evaluate** $u_{ms}$ at boundaries/initial time to get BCs and ICs — user-defined BCs/ICs (b)
4. **Smooth** functions ensure the theoretical order of accuracy is observable on practical grids (d)
5. **Run** the code with these manufactured inputs, compare numerical output to $u_{ms}$, and check that the observed convergence order matches the expected order

---

### Q7: Observed Order of Accuracy

**Question:** Fine grid solution = 2.14, coarse grid solution = 2.84, grid refinement factor $r$ = 1.54, exact solution = 1.79. Compute the observed order of accuracy.

**Given:**

| Symbol | Value |
| --- | --- |
| $f_1$ (fine) | 2.14 |
| $f_2$ (coarse) | 2.84 |
| $r$ | 1.54 |
| $f_{exact}$ | 1.79 |

**Step 1: Compute errors**

$$e_1 = |f_1 - f_{exact}| = |2.14 - 1.79| = 0.35$$

$$e_2 = |f_2 - f_{exact}| = |2.84 - 1.79| = 1.05$$

**Step 2: Apply observed order formula**

$$\hat{p} = \frac{\ln(e_2 / e_1)}{\ln(r)} = \frac{\ln(1.05 / 0.35)}{\ln(1.54)}$$

$$\hat{p} = \frac{\ln(3)}{\ln(1.54)} = \frac{1.0986}{0.4318}$$

$$\boxed{\hat{p} \approx 2.54}$$

---

### Q8: Round-off Uncertainty

**Question:** Single precision SRQ = 3.55, double precision SRQ = 4.05, factor of safety $F_s$ = 1.5. What is the magnitude of the uncertainty due to round-off error?

**Formula:**

$$U_{round} = F_s \cdot |S_{double} - S_{single}|$$

**Calculation:**

$$U_{round} = 1.5 \times |4.05 - 3.55| = 1.5 \times 0.50$$

$$\boxed{U_{round} = 0.75}$$

Note: This is the **half-interval** (magnitude). The full interval would be $2 \times 0.75 = 1.50$.

---

## 🔹 Type

👉 **Order of Accuracy (exact solution GIVEN)**

## 🔹 Use this formula (no thinking needed if exact is provided):

[
p = \frac{\ln\left(\frac{f_{coarse} - f_{exact}}{f_{fine} - f_{exact}}\right)}{\ln(r)}
]

---

## 🔹 Plug in

* (f_{fine} = 2.19)
* (f_{coarse} = 2.9)
* (f_{exact} = 1.77)
* (r = 1.48)

---

### Step 1: Differences

[
2.9 - 1.77 = 1.13
]
[
2.19 - 1.77 = 0.42
]

---

### Step 2: Ratio

[
\frac{1.13}{0.42} \approx 2.6905
]

---

### Step 3: Logs

[
p = \frac{\ln(2.6905)}{\ln(1.48)} \approx \frac{0.990}{0.392} \approx 2.53
]

---

## ✅ Final Answer:

**2.53**

---

## 🧠 Test trigger:

If you see:

* fine + coarse + exact → **this formula**
* no exact → different formula (don’t mix them up)

You’re doing this right now — just keep locking in the patterns.


This is a **straight pattern problem** — don’t overthink it.

## 🔹 Type

👉 **Round-off uncertainty**

## 🔹 Rule (always use this)

[
U = F_s \cdot |S_{double} - S_{single}|
]

---

## 🔹 Plug in

* Single = 3.53
* Double = 4.03
* Difference = ( |4.03 - 3.53| = 0.50 )

[
U = 1.5 \times 0.50 = 0.75
]

---

## ✅ Final Answer:

**0.75**

---

## 🧠 Quick reminder for test:

* Always **absolute difference**
* Always multiply by **safety factor**
* Output is **half-interval (magnitude)**

You see “single vs double precision” → you should immediately think:
👉 *difference × safety factor → done*


Use the small-sample Monte Carlo confidence interval formula:

[
U_{95}=t_{0.975,;N-1}\frac{S}{\sqrt{N}}
]

With (N=3), use (t_{0.975,2}=4.303).

First compute the sample statistics for (7.4,\ 6.6,\ 6.2):

[
M=\frac{7.4+6.6+6.2}{3}=6.7333
]

[
S^2=\frac{(7.4-6.7333)^2+(6.6-6.7333)^2+(6.2-6.7333)^2}{2}=0.3733
]

[
S=\sqrt{0.3733}=0.6110
]

Then:

[
U_{95}=4.303\cdot \frac{0.6110}{\sqrt{3}} \approx 1.518
]

**Answer to enter:** **1.518**

Use the same small-sample formula:

[
U_{95}=t_{0.975,,N-1}\frac{S}{\sqrt{N}}
]

Since (N=3), use (t_{0.975,2}=4.303).

## Step 1: Mean

[
M=\frac{6.8+8.6+6.2}{3}=\frac{21.6}{3}=7.2
]

## Step 2: Unbiased variance

[
S^2=\frac{(6.8-7.2)^2+(8.6-7.2)^2+(6.2-7.2)^2}{3-1}
]

[
S^2=\frac{(-0.4)^2+(1.4)^2+(-1.0)^2}{2}
=\frac{0.16+1.96+1.00}{2}
=\frac{3.12}{2}=1.56
]

So

[
S=\sqrt{1.56}\approx 1.249
]

## Step 3: Confidence interval magnitude

[
U_{95}=4.303\cdot \frac{1.249}{\sqrt{3}}
\approx 4.303\cdot 0.7211
\approx 3.103
]

## Final answer to enter:

**3.103**

## 🔹 Type

👉 **Order of Accuracy (exact solution GIVEN)**

## 🔹 Use this every time in this case:

[
p = \frac{\ln\left(\frac{f_{coarse} - f_{exact}}{f_{fine} - f_{exact}}\right)}{\ln(r)}
]

---

## 🔹 Plug in

* (f_{fine} = 2.14)
* (f_{coarse} = 2.84)
* (f_{exact} = 1.79)
* (r = 1.54)

---

### Step 1: Differences

[
2.84 - 1.79 = 1.05
]
[
2.14 - 1.79 = 0.35
]

---

### Step 2: Ratio

[
\frac{1.05}{0.35} = 3.0
]

---

### Step 3: Logs

[
p = \frac{\ln(3.0)}{\ln(1.54)} \approx \frac{1.0986}{0.4318} \approx 2.54
]

---

## ✅ Final Answer:

**2.54**

---

## 🧠 Pattern reminder:

* exact solution present → this formula
* ratio comes out clean (like 3) → expect a nice (p) near 2–3

You’re doing exactly what you need to be doing right now — repetition + pattern locking.
