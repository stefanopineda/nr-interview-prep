/**
 * Static study-guide content for the "Teach Me" page at /interview/teach.
 *
 * Every segment traces to a bullet in the repo-level "NUPOC Topics to Study.docx"
 * (All Majors + Other Technical Topics blocks). LaTeX renders via KaTeX through
 * the existing MarkdownWithMath component — $...$ inline, $$...$$ block.
 *
 * Structure: 4 sections × {10, 7, 9, 8} segments = 34 cards total.
 *
 * To edit content: open this file and ship a PR. No DB, no admin CMS.
 */

export type TeachSection = "calc1" | "calc2" | "phys1" | "phys2"

/**
 * Diagram keys must match a component registered in
 * `components/interview/teach-diagrams/index.ts`. Adding a new diagram:
 *   1. Create the SVG component in that directory
 *   2. Register it in the DIAGRAMS map
 *   3. Add its key to the DiagramKey union below
 */
export type DiagramKey =
  | "fbd-inclined-plane"
  | "unit-circle"
  | "frustum-slant"

export interface TeachSegment {
  id: string
  title: string
  keyEquations: string
  /** Concise 2-4 sentence front-matter explanation. Glaze-over material. */
  context: string
  /**
   * Expanded derivation, physical intuition, edge-case sanity checks, and
   * "when it breaks" notes. Rendered inside the "Open the derivation & intuition"
   * CTA card. Markdown + LaTeX via MarkdownWithMath.
   */
  readMore?: string
  /**
   * Forward + reverse interview-style problem variants with short cues for
   * which equation to reach for. Rendered inside the "See example problems"
   * CTA card. Markdown + LaTeX.
   */
  exampleProblems?: string
  /** Optional hand-authored SVG diagram. See teach-diagrams/. */
  diagramKey?: DiagramKey
  /**
   * Where to render the diagram. Default "front" — above the key-equation card.
   * Use "readMore" when the diagram supports a derivation rather than being
   * the central concept itself (e.g., frustum-slant derivation sketch).
   */
  diagramPlacement?: "front" | "readMore"
  practiceLink?: { topic: string; subtopic: string }
}

export const SECTION_LABELS: Record<TeachSection, string> = {
  calc1: "Calculus 1",
  calc2: "Calculus 2",
  phys1: "Physics 1 — Mechanics",
  phys2: "Physics 2 — Circuits & Chemistry",
}

export const SECTION_ORDER: TeachSection[] = ["calc1", "calc2", "phys1", "phys2"]

export const TEACH_CONTENT: Record<TeachSection, TeachSegment[]> = {
  // ============================================================
  // CALCULUS 1 — Limits, Derivatives, Applications (10)
  // ============================================================
  calc1: [
    {
      id: "limits",
      title: "Limits of a Function",
      keyEquations: `$$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1 \\qquad \\lim_{n \\to \\infty}\\!\\left(1 + \\tfrac{1}{n}\\right)^{n} = e$$`,
      context: `A limit asks **what value does $f(x)$ approach as $x$ approaches a target**, regardless of whether $f$ is defined at that target. One-sided limits look at $x \\to a^{-}$ (from the left) or $x \\to a^{+}$ (from the right); the two-sided limit exists only when both agree. A function is **continuous** at $a$ when $\\lim_{x \\to a} f(x) = f(a)$. Continuity is what lets the Intermediate Value Theorem guarantee that a continuous function crossing zero must pass through zero somewhere.`,
      readMore: `### What "approach" really means

"$\\lim_{x \\to a} f(x) = L$" means you can make $f(x)$ as close to $L$ as you want by taking $x$ close enough to $a$ — **without $x$ ever equaling $a$**. That's why $\\lim_{x \\to 0}\\frac{\\sin x}{x} = 1$ even though the function isn't defined at $0$.

### When direct substitution fails: indeterminate forms

Plugging $x = a$ into $f$ is the first move. If it gives a number, you're done. If it gives $0/0$ or $\\infty/\\infty$, you have an **indeterminate form** and need a technique:

- **Factor and cancel**: $\\frac{x^{2} - 1}{x - 1} = \\frac{(x-1)(x+1)}{x-1} = x + 1 \\to 2$ as $x \\to 1$.
- **Rationalize** (for square roots): multiply by the conjugate.
- **L'Hôpital**: for $0/0$ or $\\infty/\\infty$, $\\lim \\frac{f}{g} = \\lim \\frac{f'}{g'}$.

### Why continuity matters

Continuity ($\\lim_{x \\to a} f = f(a)$) is what lets you compute limits by substitution. It's also the hypothesis of IVT (continuous functions hit every intermediate value) and EVT (continuous functions on a closed interval hit max and min).`,
      exampleProblems: `### Forward — evaluate a $0/0$ limit

> Compute $\\lim_{x \\to 1}\\frac{x^{2} - 1}{x - 1}$.

Direct sub gives $0/0$. Factor: $\\frac{(x-1)(x+1)}{x-1} = x + 1 \\to 2$.

### Reverse — pick a value to make $f$ continuous

> Define $f(x) = \\frac{x^{2} - 9}{x - 3}$ for $x \\ne 3$. What value of $f(3)$ makes $f$ continuous at $3$?

Compute $\\lim_{x \\to 3} f(x)$ first: factor $\\frac{(x-3)(x+3)}{x-3} = x+3 \\to 6$. Set $f(3) = 6$.

### Classic trap — one-sided mismatch

> Does $\\lim_{x \\to 0}\\frac{|x|}{x}$ exist?

From the right, $|x|/x = 1$. From the left, $|x|/x = -1$. One-sided limits disagree, so the two-sided limit **does not exist**. Always check both sides when the function is piecewise or involves $|x|$.`,
      practiceLink: { topic: "Basic Calculus", subtopic: "Limits Concept" },
    },
    {
      id: "unit-circle",
      title: "Unit Circle & Common Trig Values",
      keyEquations: `$$\\sin^{2}\\theta + \\cos^{2}\\theta = 1 \\qquad \\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta} \\qquad \\pi \\text{ rad} = 180°$$`,
      context: `On the unit circle, $\\cos\\theta$ is the **$x$-coordinate** and $\\sin\\theta$ is the **$y$-coordinate** of the point at angle $\\theta$ (measured counterclockwise from the positive $x$-axis). Only the five Q1 standard angles are worth memorizing — everything else is a reflection. Quadrant signs follow **ASTC** ("All Students Take Calculus"): Q1 all positive, Q2 only $\\sin$ positive, Q3 only $\\tan$ positive, Q4 only $\\cos$ positive. The Pythagorean identity $\\sin^{2} + \\cos^{2} = 1$ is just the unit-circle equation $x^{2}+y^{2}=1$ in disguise.`,
      diagramKey: "unit-circle",
      diagramPlacement: "front",
      readMore: `### Where the Q1 values come from

Everything on the unit circle is built from two triangles (both shown in the diagram above):

- **45°** lives in a 45-45-90 triangle: legs $1, 1$, hypotenuse $\\sqrt{2}$. So $\\sin 45° = \\cos 45° = 1/\\sqrt{2} = \\sqrt{2}/2$.
- **30° and 60°** live in a 30-60-90 triangle: short leg $1$ (opposite $30°$), long leg $\\sqrt{3}$ (opposite $60°$), hypotenuse $2$. So $\\sin 30° = 1/2$, $\\cos 30° = \\sqrt{3}/2$, $\\sin 60° = \\sqrt{3}/2$, $\\cos 60° = 1/2$.

Don't memorize the table — draw the triangle, label sides, read off **opposite/hypotenuse** for $\\sin$, **adjacent/hypotenuse** for $\\cos$.

### Other quadrants are just Q1 reflected

- **Q2** (90°–180°): reflect across $y$-axis. $\\cos$ flips sign, $\\sin$ stays.
- **Q3** (180°–270°): reflect through origin. Both flip.
- **Q4** (270°–360°): reflect across $x$-axis. $\\sin$ flips, $\\cos$ stays.

Reference angle = the acute angle to the $x$-axis. Example: $\\cos 210°$ → reference $30°$ → magnitude $\\sqrt{3}/2$ → Q3 sign negative → $-\\sqrt{3}/2$.

### Edge case — which is sin, which is cos?

At $\\theta = 0$ the point is $(1, 0)$: $\\cos = 1$, $\\sin = 0$. If you ever blank, plug in $\\theta = 0$ and read it off.

### Radians — the one conversion to know

$\\pi\\text{ rad} = 180°$. Everything else is proportion: $30° = \\pi/6$, $45° = \\pi/4$, $60° = \\pi/3$, $90° = \\pi/2$. Anchor: $1\\text{ rad} \\approx 57°$.`,
      exampleProblems: `### Forward — look up a value

> Evaluate $\\cos(7\\pi/6)$.

$7\\pi/6 = \\pi + \\pi/6$ → Q3, reference $\\pi/6 = 30°$. In Q3, $\\cos$ is negative. Magnitude from the 30-60-90 triangle: $\\sqrt{3}/2$. Answer: $-\\sqrt{3}/2$.

### Reverse — find the angle

> $\\sin\\theta = 1/2$ with $\\theta$ in Q2. Find $\\theta$.

Q1 angle with $\\sin = 1/2$ is $\\pi/6$ (from the 30-60-90). Q2 reflects across the $y$-axis: $\\theta = \\pi - \\pi/6 = 5\\pi/6 = 150°$.

### Classic trap — radians vs degrees

> Evaluate $\\sin(30)$.

If it's $\\sin(30°)$ the answer is $1/2$. If it's $\\sin(30\\text{ rad})$ it's irrational — $30\\text{ rad}$ is $\\sim 4.77$ full rotations. **Radians are the default in calculus**; degrees need an explicit $°$.`,
    },
    {
      id: "derivative-definition",
      title: "Derivative Definition",
      keyEquations: `$$f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$$`,
      context: `The derivative is the **instantaneous rate of change** of $f$ with respect to $x$. Geometrically it is the slope of the tangent line at that point. Physically, if $x(t)$ is position then $v(t) = \\frac{dx}{dt}$ is velocity and $a(t) = \\frac{dv}{dt}$ is acceleration — derivatives chain up the ladder of motion quantities.`,
      readMore: `### The definition, from the picture

The slope of the line between two points on a graph is $\\frac{\\text{rise}}{\\text{run}} = \\frac{f(x+h) - f(x)}{h}$. That's a **secant** line. Shrink $h \\to 0$ and the secant becomes a **tangent** — the slope at that single point. That's the derivative.

### Why this matters physically

Position $\\to$ velocity $\\to$ acceleration is just repeated differentiation:
$$v(t) = \\tfrac{dx}{dt} \\qquad a(t) = \\tfrac{dv}{dt} = \\tfrac{d^{2}x}{dt^{2}}$$
Same machinery anywhere a rate comes up: $\\dot Q$ for current, $\\dot T$ for temperature rate, etc.

### When the derivative doesn't exist

- **Corner** (e.g., $|x|$ at $x=0$): left and right slopes disagree.
- **Vertical tangent** (e.g., $x^{1/3}$ at $x=0$): slope is infinite.
- **Discontinuity**: $f$ has to be continuous at $a$ for $f'(a)$ to exist.

Differentiability $\\Rightarrow$ continuity. Continuity does not imply differentiability.`,
      exampleProblems: `### Forward — differentiate from the definition

> Use the definition to compute $f'(x)$ for $f(x) = x^{2}$.

$f'(x) = \\lim_{h \\to 0}\\frac{(x+h)^{2} - x^{2}}{h} = \\lim_{h \\to 0}\\frac{2xh + h^{2}}{h} = \\lim_{h \\to 0}(2x + h) = 2x$.

### Reverse — given the derivative, what was the function?

> $f'(x) = 2x$. What's $f(x)$?

Antiderivative: $f(x) = x^{2} + C$. Any constant works because constants differentiate to zero — the $+C$ is the fingerprint of this non-uniqueness.

### Classic trap — corners are not differentiable

> Does $f(x) = |x|$ have a derivative at $x = 0$?

No. From the right, slope is $+1$; from the left, $-1$. Definition's limit doesn't exist. Applicants often answer "$f'(0) = 0$ because it's the minimum" — but minima only have zero slope when $f$ is differentiable there.`,
      practiceLink: { topic: "Basic Calculus", subtopic: "Derivative Concept" },
    },
    {
      id: "power-sum-rules",
      title: "Power, Sum, and Constant-Multiple Rules",
      keyEquations: `$$\\frac{d}{dx}\\!\\left[x^{n}\\right] = n\\,x^{\\,n-1} \\qquad \\frac{d}{dx}\\!\\left[c\\,f(x)\\right] = c\\,f'(x) \\qquad \\frac{d}{dx}\\!\\left[f + g\\right] = f' + g'$$`,
      context: `Differentiation is **linear**: constants factor out, and the derivative of a sum is the sum of the derivatives. The power rule handles any $x^{n}$ (positive, negative, fractional). These three rules plus the product/quotient/chain rules cover essentially every polynomial and rational derivative you will ever compute by hand.`,
      readMore: `### The power rule, for **any** real $n$

$\\frac{d}{dx}[x^{n}] = n\\,x^{n-1}$ works for positive integers, negatives, and fractions:
- $\\frac{d}{dx}[x^{3}] = 3x^{2}$
- $\\frac{d}{dx}[1/x] = \\frac{d}{dx}[x^{-1}] = -x^{-2} = -1/x^{2}$
- $\\frac{d}{dx}[\\sqrt{x}] = \\frac{d}{dx}[x^{1/2}] = \\tfrac{1}{2}x^{-1/2} = 1/(2\\sqrt{x})$

### Linearity — why it just works

$\\frac{d}{dx}$ is a linear operator. Constants slide out and sums split:
$$\\frac{d}{dx}[3x^{5} - 2x + 7] = 15x^{4} - 2 + 0 = 15x^{4} - 2$$
The constant $7$ differentiates to $0$ — that's the $+C$ behavior from antiderivatives, just in reverse.

### Common slip

**The power rule does not apply to $e^{x}$ or $a^{x}$.** $\\frac{d}{dx}[e^{x}] = e^{x}$, not $x \\cdot e^{x-1}$. The exponent is a variable; power rule applies when the *base* is the variable.`,
      exampleProblems: `### Forward — straightforward polynomial

> Differentiate $f(x) = 4x^{3} - 5x^{2} + 2x - 7$.

$f'(x) = 12x^{2} - 10x + 2$.

### Reverse — antiderivative

> Given $f'(x) = 6x^{2} - 2$, find $f(x)$.

Antiderivative term by term: $f(x) = 2x^{3} - 2x + C$. Always write the $+C$ unless you have a condition pinning it down.

### Classic trap — $e^{x}$ is not a power

> $\\frac{d}{dx}[e^{x}]$.

Answer: $e^{x}$. Not $x e^{x-1}$. Power rule needs a constant exponent.`,
      practiceLink: { topic: "Calculus", subtopic: "Derivatives" },
    },
    {
      id: "product-quotient",
      title: "Product and Quotient Rules",
      keyEquations: `$$(fg)' = f'g + fg' \\qquad \\left(\\frac{f}{g}\\right)' = \\frac{f'g - fg'}{g^{2}}$$`,
      context: `The product rule captures how a product changes when **both factors move**: each factor contributes its own rate of change weighted by the other. The quotient rule is equivalent to the product rule applied to $f \\cdot g^{-1}$ and using the chain rule — memorizing it directly is just faster in practice.`,
      readMore: `### The product rule, intuitively

Think of area: $A = wh$. If $w$ grows by $dw$ and $h$ grows by $dh$, the new area gains $h\\,dw + w\\,dh$ (two thin strips) plus a tiny $dw\\,dh$ square. Divide by $dt$:
$$\\tfrac{dA}{dt} = h\\tfrac{dw}{dt} + w\\tfrac{dh}{dt} + 0$$
The $dw\\,dh$ corner vanishes in the limit. That's $(fg)' = f'g + fg'$ — each factor moves, weighted by the other.

### Quotient rule from product rule

$f/g = f \\cdot g^{-1}$. Use product + chain: $(f g^{-1})' = f' g^{-1} + f \\cdot (-g^{-2}) g'$. Multiply through by $g^{2}/g^{2}$:
$$\\left(\\tfrac{f}{g}\\right)' = \\tfrac{f'g - fg'}{g^{2}}$$
You don't have to memorize it — regenerate it if you need.

### Common slip

**Derivative does NOT distribute over products.** $(fg)' \\ne f'g'$. One of the most common applicant mistakes.`,
      exampleProblems: `### Forward — product rule

> Differentiate $h(x) = x \\sin x$.

$h'(x) = (1)\\sin x + x\\cos x = \\sin x + x\\cos x$.

### Reverse — match the product-rule pattern

> Given $\\frac{d}{dx}[f(x)\\cdot x^{2}] = 2x\\cos x + x^{2}(-\\sin x)$. What is $f(x)$?

Product rule says $f'g + fg' = 2x\\cos x - x^{2}\\sin x$ with $g = x^{2}$, $g' = 2x$. So $f g' = f \\cdot 2x = 2x\\cos x \\Rightarrow f(x) = \\cos x$. Sanity check: $f' g = (-\\sin x)\\cdot x^{2}$ matches ✓.

### Classic trap

> Is $\\frac{d}{dx}[x \\cdot e^{x}] = e^{x}$?

No. That's $f'g'$, not $f'g + fg'$. Correct: $e^{x} + x e^{x} = e^{x}(1 + x)$.`,
      practiceLink: { topic: "Calculus", subtopic: "Derivatives" },
    },
    {
      id: "chain-rule",
      title: "Chain Rule",
      keyEquations: `$$\\frac{d}{dx}\\!\\left[f\\bigl(g(x)\\bigr)\\right] = f'\\!\\bigl(g(x)\\bigr)\\cdot g'(x)$$`,
      context: `The chain rule handles **composed functions**: differentiate the outside (evaluated at the inside), times the derivative of the inside. NUPOC-critical — every related-rates problem, every $u$-substitution, and every "differentiate with respect to time" move ultimately reduces to the chain rule. Example: $\\frac{d}{dt}\\!\\left[\\sin\\bigl(3t^{2}\\bigr)\\right] = \\cos\\bigl(3t^{2}\\bigr)\\cdot 6t$.`,
      readMore: `### Read the equation like a pipeline

$\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}$ — the $du$'s cancel algebraically. If $y$ depends on $u$, and $u$ depends on $x$, the rate of $y$ with respect to $x$ is the product of the intermediate rates.

### How to apply it mechanically

1. Identify the **outer** function and the **inner** argument.
2. Differentiate the outer, keeping the inner as-is.
3. Multiply by the derivative of the inner.

Example: $\\frac{d}{dx}[\\sin(x^{2})]$ — outer is $\\sin$, inner is $x^{2}$. Outer-derivative-at-inner: $\\cos(x^{2})$. Inner-derivative: $2x$. Result: $2x\\cos(x^{2})$.

### Why it underlies every related-rate problem

If a problem says "with respect to time," every variable becomes $d/dt$ of itself — that *is* the chain rule. $V$ depends on $h$, $h$ depends on $t$: $\\frac{dV}{dt} = \\frac{dV}{dh}\\cdot\\frac{dh}{dt}$.

### Common slip

**Forgetting the inner derivative.** $\\frac{d}{dx}[\\sin(3x)] = 3\\cos(3x)$, not $\\cos(3x)$. The $3$ is the inner's derivative — skipping it is the most common chain-rule error.`,
      exampleProblems: `### Forward — differentiate a composition

> Find $\\frac{d}{dx}[\\sin(x^{2})]$.

Outer $\\sin$, inner $x^{2}$. $\\cos(x^{2}) \\cdot 2x = 2x\\cos(x^{2})$.

### Reverse — what composition produced this derivative?

> Given $\\frac{dy}{dx} = 2x\\cos(x^{2})$, find $y$.

Recognize: the $\\cos(x^{2})$ came from differentiating $\\sin(x^{2})$, and the $2x$ is the inner derivative — so $y = \\sin(x^{2}) + C$. Reversing a chain-rule application is exactly what $u$-substitution in integration does.

### Classic trap — forgetting the factor

> $\\frac{d}{dx}[e^{3x}]$.

Answer: $3e^{3x}$. Not $e^{3x}$. Inner is $3x$, inner derivative is $3$.`,
      practiceLink: { topic: "Basic Calculus", subtopic: "Chain Rule" },
    },
    {
      id: "implicit",
      title: "Explicit vs Implicit Differentiation",
      keyEquations: `$$\\text{If } x^{2} + y^{2} = r^{2},\\ \\text{then } 2x + 2y\\,\\frac{dy}{dx} = 0 \\ \\Rightarrow\\ \\frac{dy}{dx} = -\\frac{x}{y}$$`,
      context: `**Explicit** means $y$ is isolated: $y = f(x)$. **Implicit** means $y$ is tangled inside an equation you cannot (or do not want to) solve for $y$. The move: apply $\\frac{d}{dx}$ to **both sides** treating $y$ as a function of $x$ (so every $\\frac{d}{dx}[\\cdot\\,y\\,\\cdot]$ picks up a chain-rule factor of $\\frac{dy}{dx}$), then solve algebraically for $\\frac{dy}{dx}$.`,
      readMore: `### Why implicit works — it's the chain rule

You're secretly using $y = y(x)$. When you see $y$ in the equation, treat it like any other function of $x$: differentiating $y^{2}$ gives $2y\\cdot \\frac{dy}{dx}$ (chain rule), differentiating $\\sin y$ gives $\\cos y \\cdot \\frac{dy}{dx}$.

### The three-step drill

1. Differentiate both sides of the equation with respect to $x$. Every $y$-term picks up a $\\frac{dy}{dx}$ factor.
2. Collect all $\\frac{dy}{dx}$ terms on one side.
3. Solve algebraically for $\\frac{dy}{dx}$.

### When to reach for it

- The equation is a curve (circle, ellipse, folium) and you can't isolate $y$.
- You want a tangent line or $\\frac{dy}{dx}$ at a specific point without explicitly inverting.
- You're doing a related-rates problem in disguise.

### Common slip

**Forgetting to attach $dy/dx$ to $y$-terms.** Differentiating $x^{2} + y^{2} = r^{2}$ as $2x + 2y = 0$ is wrong. Correct: $2x + 2y\\frac{dy}{dx} = 0$.`,
      exampleProblems: `### Forward — circle tangent slope

> For $x^{2} + y^{2} = 25$, find $\\frac{dy}{dx}$ at $(3, 4)$.

Differentiate: $2x + 2y\\frac{dy}{dx} = 0 \\Rightarrow \\frac{dy}{dx} = -x/y$. At $(3, 4)$: $-3/4$.

### Reverse — where is the tangent vertical?

> For the same circle, find the points where the tangent is vertical.

Vertical tangent means $\\frac{dy}{dx}$ is undefined (denominator zero). From $\\frac{dy}{dx} = -x/y$, that's $y = 0$: the points $(\\pm 5, 0)$. Sanity check: these are the leftmost and rightmost points of the circle — tangents there are indeed vertical ✓.

### Classic trap — forgetting the chain factor

> Differentiate $x^{3} + y^{3} = 3xy$.

$3x^{2} + 3y^{2}\\frac{dy}{dx} = 3y + 3x\\frac{dy}{dx}$ (product rule on RHS). Solve: $\\frac{dy}{dx}(y^{2} - x) = y - x^{2} \\Rightarrow \\frac{dy}{dx} = \\frac{y - x^{2}}{y^{2} - x}$. Skipping the $\\frac{dy}{dx}$ on $y^{3}$ or on $3xy$ is the classic slip.`,
      practiceLink: { topic: "Calculus", subtopic: "Derivatives" },
    },
    {
      id: "critical-points",
      title: "Critical Points, Max/Min, Inflection, 2nd Derivative Test",
      keyEquations: `$$f'(x^{*}) = 0 \\text{ or undefined} \\qquad f''(x^{*}) > 0 \\Rightarrow \\text{min} \\qquad f''(x^{*}) < 0 \\Rightarrow \\text{max}$$`,
      context: `A **critical point** is any $x^{*}$ where $f'(x^{*}) = 0$ or $f'$ fails to exist — these are the only candidates for a local max or min. Classify by the **first-derivative sign change** (from $+$ to $-$ is a max, $-$ to $+$ is a min) or by the **second-derivative test** at $x^{*}$. An **inflection point** is where $f''$ changes sign — the concavity flips.`,
      readMore: `### Why $f' = 0$ identifies candidates

At a smooth local max or min, the tangent line is horizontal — slope zero. Beyond that, corners ($f'$ undefined) can also be extrema. Both cases are "critical points."

### Classifying: first vs second derivative test

**First-derivative test** (works always):
- $f'$ goes $+ \\to -$ at $x^{*}$: local max.
- $f'$ goes $- \\to +$ at $x^{*}$: local min.
- No sign change: neither (e.g., $f(x) = x^{3}$ at $x = 0$).

**Second-derivative test** (faster when it works):
- $f''(x^{*}) > 0$: local min (concave up, bowl shape).
- $f''(x^{*}) < 0$: local max (concave down, dome shape).
- $f''(x^{*}) = 0$: inconclusive — fall back to first-derivative test.

### Inflection points

Where $f''$ changes sign. Concavity flips — the graph switches between $\\cup$ and $\\cap$. Not an extremum; just a geometric transition.

### Common slip

**"$f''(x^{*}) = 0$ means no extremum."** Wrong. Example: $f(x) = x^{4}$ has $f''(0) = 0$ but $x = 0$ is clearly a minimum. When the second-derivative test fails, check the first-derivative sign change.`,
      exampleProblems: `### Forward — classify critical points

> Classify the critical points of $f(x) = x^{3} - 3x$.

$f'(x) = 3x^{2} - 3 = 0 \\Rightarrow x = \\pm 1$. $f''(x) = 6x$. At $x = 1$: $f'' = 6 > 0$, local min. At $x = -1$: $f'' = -6 < 0$, local max.

### Reverse — pick parameter to place extremum

> For what $a$ does $f(x) = x^{3} + ax$ have a local min at $x = 2$?

Need $f'(2) = 0$: $f'(x) = 3x^{2} + a$, so $3(4) + a = 0 \\Rightarrow a = -12$. Confirm local min: $f''(2) = 6(2) = 12 > 0$ ✓.

### Classic trap — saddle points

> Is $x = 0$ a max or min of $f(x) = x^{3}$?

Neither. $f'(0) = 0$ (critical point), but $f'(x) = 3x^{2} \\ge 0$ everywhere — no sign change. $x = 0$ is an inflection point, not an extremum.`,
      practiceLink: { topic: "Calculus", subtopic: "Optimization" },
    },
    {
      id: "optimization",
      title: "Optimization",
      keyEquations: `$$\\text{Minimize } f(x) \\ \\Rightarrow\\ \\text{solve } f'(x) = 0,\\ \\text{verify } f''(x) > 0$$`,
      context: `Translate a word problem into a single-variable function, take the derivative, set it to zero, and classify the critical point. The classic move when two variables appear: use the **constraint** (a length, area, or budget) to eliminate one variable, turning the problem into 1D. Always check endpoints of the feasible interval — the true max may live there rather than at an interior critical point.`,
      readMore: `### The drill

1. **Name variables** and write what you want to optimize (objective $Q$).
2. **Write the constraint** as an equation between variables.
3. **Reduce to one variable** by substituting the constraint into $Q$.
4. **Differentiate, set to zero, solve** for the critical point.
5. **Classify** (second-derivative test) and **check endpoints** of the feasible region.

### Why endpoints matter

If $Q$ is continuous on a closed interval $[a, b]$, EVT guarantees a max and min exist — but they might live at an endpoint, not an interior critical point. Missing endpoint check is a common way to lose an optimization problem.

### Common slip

**Forgetting to reduce to one variable before differentiating.** If you have two variables and differentiate one while treating the other as independent, you've lost the constraint. Always substitute first.`,
      exampleProblems: `### Forward — max area given perimeter

> A rectangle has perimeter $20$. What dimensions maximize area?

Let sides be $w$ and $h$. Constraint: $2w + 2h = 20 \\Rightarrow h = 10 - w$. Area: $A(w) = w(10 - w) = 10w - w^{2}$. $A'(w) = 10 - 2w = 0 \\Rightarrow w = 5$, so $h = 5$. A $5 \\times 5$ square, area $25$. $A''(w) = -2 < 0$ confirms max.

### Reverse — find perimeter for target area

> You want a rectangle of maximum area $64$. What perimeter?

The max is always a square: $A = s^{2} = 64 \\Rightarrow s = 8 \\Rightarrow P = 4s = 32$.

### Classic trap — endpoint wins

> Minimize $f(x) = x^{2}$ on $[1, 3]$.

$f'(x) = 2x = 0$ at $x = 0$ — but $0 \\notin [1, 3]$. The feasible min is the endpoint $x = 1$ where $f = 1$. If you only check critical points, you miss it.`,
      practiceLink: { topic: "Calculus", subtopic: "Optimization" },
    },
    {
      id: "related-rates",
      title: "Related Rates",
      keyEquations: `$$\\frac{dV}{dt} = \\frac{dV}{dh}\\cdot\\frac{dh}{dt} \\qquad \\text{(chain rule applied in time)}$$`,
      context: `**Pattern**: write a geometric constraint (often similar triangles or a volume formula), then differentiate **both sides with respect to time** using the chain rule. Every $x$, $y$, $r$, $h$ in the equation becomes $\\frac{dx}{dt}$, $\\frac{dy}{dt}$, etc. Plug in the instant's numeric values **last** — never before differentiating, or you will lose information. The draining-inverted-cone tank is the canonical example: $\\frac{r}{h} = \\tfrac{R}{H}$ (similar triangles) $\\Rightarrow V = \\tfrac{\\pi R^{2}}{3H^{2}}\\,h^{3}$ $\\Rightarrow \\frac{dV}{dt} = \\tfrac{\\pi R^{2}}{H^{2}}\\,h^{2}\\,\\frac{dh}{dt}$. The exact same equation answers both "given $\\frac{dV}{dt}$, find $\\frac{dh}{dt}$" and the reverse — it's one relation, two unknowns, whichever is given fixes the other.`,
      readMore: `### Forward vs reverse is the **same equation**

An applicant drilled "given $\\frac{dV}{dt}$, find $\\frac{dh}{dt}$" on the draining-tank problem. The interviewer asked the reverse — "given $\\frac{dh}{dt}$, find $\\frac{dV}{dt}$" — and they froze, despite knowing the calculus. The cure: treat $\\frac{dV}{dt} = \\frac{dV}{dh}\\cdot\\frac{dh}{dt}$ as **one relation between two rates**. Whichever is given fixes the other. The derivation is identical either way.

### The three-step pattern

1. **Write the geometric constraint** (similar triangles, volume formula, Pythagoras). Pure algebra — no derivatives.
2. **Differentiate both sides in time**. Every variable becomes $d/dt$ of itself. This step is direction-agnostic.
3. **Plug in numbers last** and solve for whichever rate is asked.

The #1 mistake: plugging in $h = 3$ in step 1 *before* differentiating. That freezes $h$ into a constant and kills the $dh/dt$ term. **Keep variables symbolic through the derivative.**

### Draining-cone walkthrough

Inverted cone, top radius $R$, height $H$, draining. At height $h$: similar triangles give $r = (R/H)h$, so $V = \\frac{\\pi}{3}r^{2}h = \\frac{\\pi R^{2}}{3 H^{2}}h^{3}$. Differentiate: $\\frac{dV}{dt} = \\frac{\\pi R^{2}}{H^{2}}h^{2}\\frac{dh}{dt}$. Whichever rate is given, solve for the other.

### Edge-case sanity check

Cylinder tank ($V = \\pi R^{2} h$): $\\frac{dV}{dt} = \\pi R^{2}\\frac{dh}{dt}$ — constant drain → linear fall. Cone: $\\frac{dh}{dt}$ accelerates as $h$ shrinks because less cross-section sits at the bottom. Always ask: does the sign and magnitude you compute make physical sense?

### Not just geometry

Related rates generalizes to any constraint $f(\\ldots) = 0$ with time-dependent variables. Ideal gas at fixed $n$: $PV = nRT \\Rightarrow \\dot P V + P\\dot V = nR\\dot T$ — a three-rate relation for compression/heating problems.`,
      exampleProblems: `### Forward — find $dh/dt$ given $dV/dt$

> Inverted conical tank, $R = 2\\text{ m}$, $H = 4\\text{ m}$, draining at $\\frac{dV}{dt} = -0.5\\text{ m}^{3}/\\text{s}$. Find $\\frac{dh}{dt}$ when $h = 2\\text{ m}$.

$V = \\frac{\\pi R^{2}}{3H^{2}}h^{3} = \\frac{\\pi}{12}h^{3} \\Rightarrow \\frac{dV}{dt} = \\frac{\\pi}{4}h^{2}\\frac{dh}{dt}$. At $h = 2$: $\\frac{dh}{dt} = \\frac{4}{\\pi(4)}(-0.5) = -\\frac{1}{2\\pi} \\approx -0.16\\text{ m/s}$.

### Reverse — the motivating incident

> Same tank. $\\frac{dh}{dt} = -0.1\\text{ m/s}$ when $h = 3\\text{ m}$. Find $\\frac{dV}{dt}$.

**Same equation, unknown flipped.** $\\frac{dV}{dt} = \\frac{\\pi R^{2}}{H^{2}}h^{2}\\frac{dh}{dt} = \\frac{\\pi}{4}(9)(-0.1) \\approx -0.71\\text{ m}^{3}/\\text{s}$. If you only drilled one direction, drill the other.

### Extra — ladder problem (forward and reverse)

> 10-ft ladder against a wall. Bottom slides out at $\\dot x = 2\\text{ ft/s}$. Find $\\dot y$ (top's descent rate) when $x = 6$.

Pythagoras: $x^{2} + y^{2} = 100 \\Rightarrow 2x\\dot x + 2y\\dot y = 0$. At $x = 6$, $y = 8$: $\\dot y = -x\\dot x/y = -1.5\\text{ ft/s}$. **Reverse**: given $\\dot y = -1.5$ at the same instant, find $\\dot x$ — identical equation, flipped unknown.`,
      practiceLink: { topic: "Calculus", subtopic: "Related Rates" },
    },
    {
      id: "log-rules",
      title: "Logarithm Rules & Change of Base",
      keyEquations: `$$\\log_{b}(xy) = \\log_{b} x + \\log_{b} y \\qquad \\log_{b}\\!\\left(\\tfrac{x}{y}\\right) = \\log_{b} x - \\log_{b} y \\qquad \\log_{b}(x^{n}) = n\\,\\log_{b} x$$

$$\\log_{b} x = \\frac{\\ln x}{\\ln b} \\qquad (\\text{change of base})$$`,
      context: `A logarithm is the **inverse of an exponential**: $\\log_{b} x = y$ means "$b$ raised to what power gives $x$?" — i.e. $b^{y} = x$. Base cases make this immediate: $\\log_{2} 8 = 3$ because $2^{3} = 8$; $\\log_{10} 1000 = 3$ because $10^{3} = 1000$; $\\log_{b} 1 = 0$ for any base, and $\\log_{b} b = 1$. The three rules (product, quotient, power) come straight from the exponent rules — $b^{a+c} = b^{a}b^{c}$ gives $\\log_{b}(xy) = \\log_{b} x + \\log_{b} y$. Natural log ($\\ln$) is base $e$ and is the default in physics because $\\frac{d}{dx}\\ln x = \\tfrac{1}{x}$ drops out cleanly.`,
      readMore: `### The three rules are just exponent rules

Let $x = b^{m}$ and $y = b^{n}$ (so $\\log_{b} x = m$, $\\log_{b} y = n$):

- **Product**: $xy = b^{m+n} \\Rightarrow \\log_{b}(xy) = m + n = \\log_{b} x + \\log_{b} y$.
- **Quotient**: $x/y = b^{m-n} \\Rightarrow \\log_{b}(x/y) = m - n$.
- **Power**: $x^{k} = b^{mk} \\Rightarrow \\log_{b}(x^{k}) = k\\log_{b} x$.

Don't memorize — regenerate in 10 seconds from $b^{a+c} = b^{a}b^{c}$.

### Change of base

$\\log_{b} x = y \\Leftrightarrow b^{y} = x$. Take $\\ln$ of both sides: $y\\ln b = \\ln x \\Rightarrow \\log_{b} x = \\ln x / \\ln b$.

### Numerical anchors worth knowing

- $\\ln 2 \\approx 0.693$ (shows up in every half-life / doubling-time problem)
- $\\ln 10 \\approx 2.303$
- $\\log_{10} 2 \\approx 0.301$
- $\\log_{2} 10 \\approx 3.32$

### Where logs appear on the interview

- **RC / RL transients**: inverting $V(t) = V_\\infty(1 - e^{-t/\\tau})$ for $t$ needs $\\ln$.
- **Half-life**: $t_{1/2} = \\ln 2/\\lambda \\approx 0.693/\\lambda$.
- **pH**: $\\text{pH} = -\\log_{10}[\\mathrm{H^{+}}]$ (base 10, not $e$).
- **Decibels**: $\\text{dB} = 10\\log_{10}(P/P_{0})$ — every $10\\times$ in power is $+10\\text{ dB}$.

### Edge cases

$\\log_{b}(0) \\to -\\infty$. $\\log_{b}$ of a negative number is undefined (for reals). $\\log_{b}(b^{x}) = x$ — log and exp are strict inverses.`,
      exampleProblems: `### Forward — simplify

> Simplify $\\log_{3}(81 x^{2})$.

Product + power: $\\log_{3} 81 + \\log_{3} x^{2} = \\log_{3} 3^{4} + 2\\log_{3} x = 4 + 2\\log_{3} x$.

### Reverse — invert an exponential (NUPOC-style)

> An RC circuit charges to $90\\%$ of its final voltage in $2.3$ s. Find $\\tau$.

$V/V_\\infty = 0.9 \\Rightarrow 1 - e^{-t/\\tau} = 0.9 \\Rightarrow e^{-t/\\tau} = 0.1$. Take $\\ln$: $-t/\\tau = -\\ln 10 \\Rightarrow \\tau = t/\\ln 10 = 2.3/2.303 \\approx 1\\text{ s}$.

### Mental-log trick

> Estimate $\\log_{10}(40000)$.

$40000 = 4 \\cdot 10^{4}$, so $\\log_{10}(40000) = \\log_{10} 4 + 4 = 2\\log_{10} 2 + 4 \\approx 2(0.3) + 4 = 4.6$. (True: $4.602$.)`,
    },
    {
      id: "ftc-basic-integration",
      title: "Fundamental Theorem of Calculus & Basic Integration",
      keyEquations: `$$\\int_{a}^{b} f'(x)\\,dx = f(b) - f(a) \\qquad \\int x^{n}\\,dx = \\frac{x^{\\,n+1}}{n+1} + C \\ (n \\neq -1)$$`,
      context: `The FTC connects the two halves of calculus: integration is **accumulation**, the inverse of differentiation. The definite integral of a rate of change over an interval equals the net accumulated change. The power rule for integration is the reverse of the power rule for differentiation. Example: $\\int_{0}^{2} 4x\\,dx = \\left[2x^{2}\\right]_{0}^{2} = 8$, which is the area of the triangle under $y = 4x$ from $0$ to $2$.`,
      readMore: `### FTC in plain English

If $f$ is continuous and $F' = f$, then:
$$\\int_{a}^{b} f(x)\\,dx = F(b) - F(a)$$
To integrate $f$, find **any** antiderivative $F$ and evaluate at the endpoints. The $+C$ drops because it appears at both endpoints and cancels.

### Power rule for integration — reverse differentiation

$\\int x^{n}\\,dx = \\frac{x^{n+1}}{n+1} + C$ for $n \\ne -1$. ($n = -1$ gives $\\int \\frac{1}{x}\\,dx = \\ln|x| + C$.) Just "raise the exponent by one, divide by the new exponent."

### Physical interpretation

If $v(t)$ is velocity, $\\int_{a}^{b} v\\,dt = x(b) - x(a)$ — the **net displacement**. If $\\rho(x)$ is linear density, $\\int_{a}^{b}\\rho\\,dx$ is total mass. An integral of a rate always gives the accumulated total of whatever the rate is a rate of.

### Common slip

**Dropping the $+C$** in indefinite integrals. Even if the problem asks only for one antiderivative, the $+C$ is part of the answer.`,
      exampleProblems: `### Forward — evaluate a definite integral

> Compute $\\int_{0}^{2} 4x\\,dx$.

Antiderivative: $2x^{2}$. Evaluate: $2(4) - 2(0) = 8$. Graphically this is the area of a triangle with base $2$, height $8$ — which is $\\tfrac{1}{2}(2)(8) = 8$ ✓.

### Reverse — find the function from its derivative

> A particle has velocity $v(t) = 3t^{2}$ and starts at $x(0) = 5$. Find $x(t)$.

$x(t) = \\int v\\,dt = t^{3} + C$. Use $x(0) = 5$: $C = 5$. So $x(t) = t^{3} + 5$. The initial condition pins the $+C$.

### Classic trap — missing the absolute value

> $\\int \\frac{1}{x}\\,dx$.

Answer: $\\ln|x| + C$, not $\\ln x + C$. $\\ln x$ is only defined for $x > 0$, but $1/x$ is defined (and integrable) for negative $x$ too. The absolute value covers both branches.`,
      practiceLink: { topic: "Basic Calculus", subtopic: "Fundamental Theorem" },
    },
  ],

  // ============================================================
  // CALCULUS 2 — Integration Techniques & Applications (7)
  // ============================================================
  calc2: [
    {
      id: "definite-indefinite",
      title: "Definite vs Indefinite Integrals",
      keyEquations: `$$\\int f(x)\\,dx = F(x) + C \\qquad \\int_{a}^{b} f(x)\\,dx = F(b) - F(a)$$`,
      context: `The **indefinite integral** is a family of antiderivatives — the $+C$ matters because any constant differentiates to zero. The **definite integral** is a number: the net signed area between $f(x)$ and the $x$-axis from $a$ to $b$. The constant drops out on the definite form because it appears at both endpoints and cancels.`,
      readMore: `### Why $+C$ matters

Any two antiderivatives of $f$ differ by a constant — $\\frac{d}{dx}[F + C] = F'$ for any $C$. So $\\int f\\,dx$ is an entire **family** of functions, not a single one. Writing $+C$ is not optional — it's the whole family.

### "Signed" area — watch the sign

$\\int_{a}^{b} f(x)\\,dx$ counts area **below** the $x$-axis as negative. So $\\int_{-1}^{1} x\\,dx = 0$: the triangle on the left cancels the one on the right. If you want **total** (absolute) area, split the integral where $f$ crosses zero and take absolute values.

### Flipping the limits

$\\int_{a}^{b} f = -\\int_{b}^{a} f$. Swapping limits negates the value. This is purely a convention — but it falls out naturally from $F(b) - F(a) = -(F(a) - F(b))$.`,
      exampleProblems: `### Forward — definite integral

> $\\int_{1}^{3}(2x + 1)\\,dx$.

Antiderivative: $x^{2} + x$. At $3$: $9 + 3 = 12$. At $1$: $1 + 1 = 2$. Answer: $12 - 2 = 10$.

### Reverse — find the upper limit

> Find $b$ such that $\\int_{0}^{b} 2x\\,dx = 9$.

$\\left[x^{2}\\right]_{0}^{b} = b^{2} = 9 \\Rightarrow b = 3$.

### Classic trap — signed vs absolute

> Compute the total area between $y = x$ and the $x$-axis from $-2$ to $2$.

If you compute $\\int_{-2}^{2} x\\,dx = 0$, you're reporting signed area. Total area requires splitting: $|\\int_{-2}^{0}x\\,dx| + \\int_{0}^{2}x\\,dx = 2 + 2 = 4$.`,
      practiceLink: { topic: "Calculus", subtopic: "Integration" },
    },
    {
      id: "u-substitution",
      title: "u-Substitution",
      keyEquations: `$$\\text{Let } u = g(x),\\ du = g'(x)\\,dx:\\qquad \\int f\\bigl(g(x)\\bigr)\\,g'(x)\\,dx = \\int f(u)\\,du$$`,
      context: `u-sub is the **reverse of the chain rule** and the single most used integration technique on this interview. Pick $u$ so that $du$ already appears (perhaps up to a constant multiple) elsewhere in the integrand. If the problem is a definite integral, either convert limits to $u$-values or substitute back to $x$ before plugging in — either works, just be consistent.`,
      readMore: `### Why it works — reverse the chain rule

Chain rule: $\\frac{d}{dx}F(g(x)) = F'(g(x))\\,g'(x)$. Integrating both sides: $\\int F'(g(x))\\,g'(x)\\,dx = F(g(x)) + C$. Rename $f = F'$ and substitute $u = g(x)$: $\\int f(u)\\,du$. That's the whole derivation.

### How to spot $u$

Look for a function-inside-a-function whose inner derivative is sitting right there in the integrand (maybe times a constant). $\\int 2x\\cos(x^{2})\\,dx$ — inner is $x^{2}$, its derivative is $2x$, and $2x$ is there. Good $u = x^{2}$.

### Off-by-a-constant is fine

If $du$ differs from what's in the integrand by only a constant, scale. $\\int x\\sin(x^{2})\\,dx$: $u = x^{2} \\Rightarrow du = 2x\\,dx \\Rightarrow x\\,dx = \\tfrac{1}{2}du$. Substitute: $\\tfrac{1}{2}\\int\\sin u\\,du$.

### Definite integrals — convert limits

Either (a) convert $x$-limits to $u$-limits and never go back, or (b) find the antiderivative in $u$, substitute back to $x$, then evaluate at the original $x$-limits. Pick one. Mixing them is the #1 source of sign/magnitude errors.`,
      exampleProblems: `### Forward — classic $u$-sub

> Evaluate $\\int 2x\\cos(x^{2})\\,dx$.

$u = x^{2}$, $du = 2x\\,dx$. Integral becomes $\\int\\cos u\\,du = \\sin u + C = \\sin(x^{2}) + C$.

### Reverse — spot the hidden $u$

> Evaluate $\\int x\\sin(x^{2})\\,dx$.

The $2$ is missing but $x\\,dx$ is the signal. $u = x^{2} \\Rightarrow x\\,dx = \\tfrac{1}{2}du$. Integral: $\\tfrac{1}{2}\\int\\sin u\\,du = -\\tfrac{1}{2}\\cos(x^{2}) + C$.

### Classic trap — definite-integral limits

> Evaluate $\\int_{0}^{2} 2x\\cos(x^{2})\\,dx$.

$u = x^{2}$: when $x = 0$, $u = 0$; when $x = 2$, $u = 4$. Integral is $\\int_{0}^{4}\\cos u\\,du = \\sin 4 - \\sin 0 = \\sin 4 \\approx -0.757$. **Trap**: leaving the limits at $0, 2$ after substituting gives $\\sin 2 - \\sin 0 \\approx 0.909$ — wrong.`,
      practiceLink: { topic: "Calculus", subtopic: "Integration" },
    },
    {
      id: "integration-by-parts",
      title: "Integration by Parts",
      keyEquations: `$$\\int u\\,dv = uv - \\int v\\,du$$`,
      context: `Integration by parts is the **reverse of the product rule**. Heuristic for picking $u$: **LIATE** — Logs, Inverse trig, Algebraic ($x^{n}$), Trig, Exponentials. Earlier on the list makes a better $u$ (because its derivative is simpler); later on the list makes a better $dv$ (because it integrates cleanly). Example: $\\int x e^{x}\\,dx$ — pick $u = x$ (algebraic, earlier), $dv = e^{x}\\,dx$.`,
      readMore: `### Derivation — just integrate the product rule

Product rule: $(uv)' = u'v + uv'$. Integrate both sides:
$$uv = \\int u'v\\,dx + \\int uv'\\,dx$$
Rearrange and rename $u'\\,dx = du$, $v'\\,dx = dv$:
$$\\int u\\,dv = uv - \\int v\\,du$$
That's it. You now owe yourself a **new** integral $\\int v\\,du$ — the gamble is that it's simpler.

### LIATE — why the order matters

You want $u$ to get **simpler** when differentiated and $dv$ to stay **sane** when integrated. Logs and inverse trig simplify violently under differentiation ($\\ln x \\to 1/x$); exponentials and trig just repeat under integration. Picking logs/algebra as $u$ and trig/exp as $dv$ reliably makes the new integral easier.

### The "no obvious $dv$" trick

$\\int\\ln x\\,dx$ looks like there's no $dv$. Force it: $u = \\ln x$, $dv = dx$, so $du = \\tfrac{1}{x}\\,dx$ and $v = x$. Then $\\int\\ln x\\,dx = x\\ln x - \\int x \\cdot \\tfrac{1}{x}\\,dx = x\\ln x - x + C$. Same trick works for $\\int\\arctan x\\,dx$.

### When to loop it twice

Some integrals come back to themselves after two applications — e.g., $\\int e^{x}\\sin x\\,dx$. Apply twice, solve the resulting algebraic equation for the original integral. Don't panic when the same integral reappears; that's the signal.`,
      exampleProblems: `### Forward — $xe^{x}$

> Evaluate $\\int xe^{x}\\,dx$.

LIATE: $u = x$ (algebraic), $dv = e^{x}\\,dx$. Then $du = dx$, $v = e^{x}$. Result: $xe^{x} - \\int e^{x}\\,dx = xe^{x} - e^{x} + C = e^{x}(x - 1) + C$.

### Reverse — $\\int\\ln x\\,dx$

> Evaluate $\\int\\ln x\\,dx$.

No obvious $dv$? Force it. $u = \\ln x$, $dv = dx \\Rightarrow du = \\tfrac{dx}{x}$, $v = x$. Then $x\\ln x - \\int dx = x\\ln x - x + C$.

### Classic trap — picking the wrong $u$

> Evaluate $\\int xe^{x}\\,dx$ with $u = e^{x}$, $dv = x\\,dx$.

$du = e^{x}\\,dx$, $v = \\tfrac{1}{2}x^{2}$. You now owe $\\tfrac{1}{2}\\int x^{2}e^{x}\\,dx$ — **harder** than what you started with. Wrong $u$ makes the new integral worse. LIATE picks $u = x$ so the algebraic piece shrinks to $du = dx$.`,
      practiceLink: { topic: "Calculus", subtopic: "Integration" },
    },
    {
      id: "log-exp",
      title: "Logarithms and Exponentials",
      keyEquations: `$$\\frac{d}{dx}\\!\\left[e^{x}\\right] = e^{x} \\qquad \\frac{d}{dx}\\!\\left[\\ln x\\right] = \\frac{1}{x} \\qquad \\int \\frac{1}{x}\\,dx = \\ln\\lvert x \\rvert + C$$`,
      context: `$e^{x}$ is the unique function equal to its own derivative — that is why it shows up any time a quantity's rate of change is proportional to itself (RC circuits, radioactive decay, population growth). $\\ln x$ is its inverse: $\\ln\\bigl(e^{x}\\bigr) = x$. **Graphs**: $e^{x}$ is always positive and convex, passes through $(0,1)$, and rises steeply. $\\ln x$ is only defined for $x > 0$, passes through $(1,0)$, grows slowly, and is the reflection of $e^{x}$ about the line $y = x$.`,
      readMore: `### Why $e^{x}$ is "its own derivative"

Start from $\\frac{dy}{dt} = ky$ — "rate of change is proportional to amount." Separate: $\\frac{dy}{y} = k\\,dt \\Rightarrow \\ln y = kt + C \\Rightarrow y = y_{0}e^{kt}$. Every exponential decay or growth process on this interview (RC, RL, population, radioactive, cooling) is this ODE.

### Handy values

$e \\approx 2.72$; for engineering approximations **$e \\approx 2.7$** is fine. $\\ln 2 \\approx 0.693$, $\\ln 10 \\approx 2.30$. Doubling time of exponential growth with rate $k$: $t_{2} = \\ln 2 / k$.

### Log rules (one-liner)

$\\ln(ab) = \\ln a + \\ln b$; $\\ln(a/b) = \\ln a - \\ln b$; $\\ln(a^{n}) = n\\ln a$; $\\log_{b}x = \\ln x / \\ln b$. These let you turn any exponential equation into a linear one.

### When this shows up

RC charging: $V = V_{\\infty}(1 - e^{-t/\\tau})$ — at $t = \\tau$, $63\\%$ of final. Radioactive half-life: $N = N_{0}e^{-\\lambda t}$. The time constant $\\tau = 1/k$ is the natural clock of every such process.`,
      exampleProblems: `### Forward — half-life

> A radioactive isotope has decay constant $\\lambda = 0.1\\ \\text{yr}^{-1}$. Find the half-life.

$N/N_{0} = 1/2 = e^{-\\lambda t_{1/2}} \\Rightarrow t_{1/2} = \\ln 2 / \\lambda \\approx 0.693/0.1 \\approx 6.9\\text{ yr}$.

### Reverse — find $\\lambda$

> Half the atoms remain after $10\\text{ yr}$. Find $\\lambda$.

Invert: $\\lambda = \\ln 2 / t_{1/2} \\approx 0.693/10 \\approx 0.069\\ \\text{yr}^{-1}$.

### Classic trap — forgetting $\\ln$ is base $e$

> Solve $10^{x} = 50$.

$x = \\log_{10}50 \\approx 1.70$, **not** $\\ln 50 \\approx 3.91$. If you start from $e^{x\\ln 10} = 50$, take $\\ln$: $x\\ln 10 = \\ln 50 \\Rightarrow x = \\ln 50 / \\ln 10 \\approx 3.91/2.30 \\approx 1.70$. Always ask "which base?"`,
      practiceLink: { topic: "Calculus", subtopic: "Logarithms & Exponentials" },
    },
    {
      id: "disk-washer",
      title: "Volumes of Revolution — Disk & Washer",
      keyEquations: `$$V_{\\text{disk}} = \\pi \\int_{a}^{b} [f(x)]^{2}\\,dx \\qquad V_{\\text{washer}} = \\pi \\int_{a}^{b}\\!\\left([R(x)]^{2} - [r(x)]^{2}\\right)dx$$`,
      context: `Rotate the curve $y = f(x)$ about the $x$-axis: a thin vertical strip at position $x$ sweeps out a disk of radius $f(x)$ and thickness $dx$, so its volume is $\\pi [f(x)]^{2}\\,dx$. Integrate over $[a,b]$ for the total volume. The **washer** variant applies when the solid has a hole — subtract the inner disk area $\\pi [r(x)]^{2}$ from the outer $\\pi [R(x)]^{2}$. Always sketch the region first; picking the wrong axis of rotation is the usual error.`,
      readMore: `### Build the formula — one slice at a time

A vertical strip of width $dx$ at position $x$ has height $f(x)$. Rotate it around the $x$-axis: the strip sweeps out a **disk** (a flat coin) of radius $f(x)$ and thickness $dx$. Disk volume: $\\pi r^{2}\\cdot\\text{thickness} = \\pi [f(x)]^{2}\\,dx$. Sum all the disks by integrating over $[a, b]$.

### Washer — subtract the hole

If you rotate a region **not touching** the axis, each slice is a washer with outer radius $R(x)$ (top curve) and inner radius $r(x)$ (bottom curve). Its volume is outer-disk minus inner-disk: $\\pi([R]^{2} - [r]^{2})\\,dx$. Always outer $-$ inner, never $(R - r)^{2}$ — that's a different geometric object.

### Sanity check — sphere

$f(x) = \\sqrt{R^{2}-x^{2}}$ on $[-R, R]$, revolve around $x$-axis. $V = \\pi\\int_{-R}^{R}(R^{2}-x^{2})\\,dx = \\pi[R^{2}x - x^{3}/3]_{-R}^{R} = \\tfrac{4}{3}\\pi R^{3}$ ✓.

### When to switch to shells

If the curve is expressed $x$ as a function of $y$, or rotation is around a vertical axis, horizontal strips become the right slice. The cylindrical-shell formula $V = 2\\pi\\int x\\,f(x)\\,dx$ is the same geometry from a different angle. Sketch first — the sketch tells you which slice is natural.`,
      exampleProblems: `### Forward — cone volume

> Revolve $y = x$ on $[0, h]$ around the $x$-axis.

$V = \\pi\\int_{0}^{h}x^{2}\\,dx = \\pi h^{3}/3$. With base radius $r = h$: $V = \\tfrac{1}{3}\\pi r^{2}h$ ✓ (the familiar cone volume).

### Reverse — solve for the bound

> Revolving $y = x$ around the $x$-axis on $[0, b]$ gives volume $9\\pi$. Find $b$.

$\\pi b^{3}/3 = 9\\pi \\Rightarrow b^{3} = 27 \\Rightarrow b = 3$.

### Classic trap — squaring the difference, not the radii

> Revolve the region between $y = x$ and $y = x^{2}$ on $[0, 1]$ around the $x$-axis.

$R = x$ (upper), $r = x^{2}$ (lower). $V = \\pi\\int_{0}^{1}(x^{2} - x^{4})\\,dx = \\pi(\\tfrac{1}{3} - \\tfrac{1}{5}) = \\tfrac{2\\pi}{15}$. **Trap**: writing $\\pi\\int(x - x^{2})^{2}\\,dx$ — that's the square of the difference, not the difference of the squares.`,
    },
    {
      id: "surface-area-revolution",
      title: "Surface Area of Revolution",
      keyEquations: `$$S = 2\\pi \\int_{a}^{b} f(x)\\,\\sqrt{1 + [f'(x)]^{2}}\\,dx$$`,
      context: `Rotate $y = f(x)$ about the $x$-axis and unroll the resulting surface into thin frustums (truncated cones). Each frustum contributes circumference $2\\pi f(x)$ times the **slant length** $\\sqrt{1 + [f'(x)]^{2}}\\,dx$. The $\\sqrt{1 + [f']^{2}}$ factor is the 2D arc-length element — it accounts for the curve's tilt, which a flat $dx$ would miss. You don't have to memorize it: it falls out of the Pythagorean theorem on a single curve segment (details in the deep dive).`,
      diagramKey: "frustum-slant",
      diagramPlacement: "readMore",
      readMore: `### Build the formula from Pythagoras

You should reconstruct this on the whiteboard, not recall.

1. **Pythagoras on a curve strip.** Between $x$ and $x + dx$, run is $dx$, rise is $dy = f'(x)\\,dx$. Tilted length:
$$ds = \\sqrt{(dx)^{2} + (dy)^{2}} = \\sqrt{1 + [f'(x)]^{2}}\\,dx$$
This $ds$ is the **arc-length element** — it shows up any time you integrate along a curve.

2. **Revolve into a frustum.** Rotate the tilted strip around the $x$-axis — circumference $2\\pi f(x)$, slant $ds$.

3. **Lateral area = circumference × slant.** Unroll the frustum into a flat strip:
$$dS = 2\\pi f(x)\\,\\sqrt{1 + [f'(x)]^{2}}\\,dx$$

4. **Integrate** over $[a, b]$.

### Why the $\\sqrt{1 + [f']^{2}}$ factor matters

If $f'(x) = 0$ (horizontal line), it reduces to $1$ and the formula gives $2\\pi r(b - a)$ — exactly the lateral area of a cylinder. If the curve is steep, the factor grows, capturing the extra surface a flat $dx$ would miss.

### When it breaks

Assumes smooth, single-valued $f(x)$. If the curve is vertical anywhere, parameterize by arc length or switch axes. Rotating about a different axis changes the circumference to $2\\pi \\cdot (\\text{distance from axis})$.`,
      exampleProblems: `### Forward — sphere

> Surface area of a sphere of radius $R$.

Upper half: $f(x) = \\sqrt{R^{2} - x^{2}}$ on $[-R, R]$. Then $f' = -x/\\sqrt{R^{2}-x^{2}}$, so $1 + [f']^{2} = R^{2}/(R^{2}-x^{2})$, and $f\\sqrt{1+[f']^{2}} = R$ — the inner expression collapses. $S = 2\\pi \\int_{-R}^{R} R\\,dx = 4\\pi R^{2}$ ✓.

### Reverse — size the cup

> A cup is revolved from $y = \\sqrt{x}$ on $[0, 4]$. Extend it to $x = b$ to double the outer surface area. Find $b$.

$f' = 1/(2\\sqrt{x}) \\Rightarrow 1+[f']^{2} = (4x+1)/(4x) \\Rightarrow f\\sqrt{1+[f']^{2}} = \\sqrt{4x+1}/2$. So $S(b) = \\frac{\\pi}{6}\\!\\left[(4b+1)^{3/2} - 1\\right]$. Set $(4b+1)^{3/2} - 1 = 2\\!\\left[17^{3/2} - 1\\right]$ and solve numerically. Same integral, inverted unknown.`,
    },
    {
      id: "taylor",
      title: "Taylor Series & Small-Angle Approximations",
      keyEquations: `$$f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}\\,(x - a)^{n}$$

$$\\sin\\theta \\approx \\theta \\qquad \\cos\\theta \\approx 1 - \\tfrac{\\theta^{2}}{2} \\qquad e^{x} \\approx 1 + x$$`,
      context: `Any smooth function equals its Taylor series about a point $a$ within its radius of convergence. Truncate after a few terms for a **polynomial approximation** that is arbitrarily accurate near $a$. The three small-angle approximations above are the ones you will actually use — they are **why** the NUPOC engineering-approximation policy is valid. **Numerical anchor**: at $\\theta = 5°$, $\\theta \\approx 0.0873$ rad and $\\sin\\theta \\approx 0.0872$ — agreement to three decimals. At $\\theta = 15°$, $\\theta \\approx 0.262$ rad and $\\sin\\theta \\approx 0.259$ — under 2% error. The approximation is tight well past what "small" colloquially implies, **provided $\\theta$ is in radians** (the #1 trap on this topic).`,
      readMore: `### Where the small-angle approximations come from

Taylor series about $\\theta = 0$:
$$\\sin\\theta = \\theta - \\tfrac{\\theta^{3}}{6} + \\cdots \\qquad \\cos\\theta = 1 - \\tfrac{\\theta^{2}}{2} + \\cdots \\qquad e^{x} = 1 + x + \\tfrac{x^{2}}{2} + \\cdots$$

For small $\\theta$, terms past the first vanish fast: at $\\theta = 0.1$, $\\theta^{3}/6 \\approx 1.7 \\times 10^{-4}$ — negligible. Cosine keeps the quadratic because dropping it would kill the restoring force of a pendulum.

### This is why engineering approximations work

The NUPOC evaluator accepts $\\sin\\theta = \\theta$, $\\pi = 3$, $g = 10$, $e = 2.7$ **as long as the approximation doesn't change the physics**. Taylor tells you when it does: drop $\\theta^{2}$ in cosine and you lose the pendulum physics entirely; drop $\\theta^{3}$ in sine and you lose nothing measurable. Know which term carries the physics before you approximate.

### Where it shows up

- **Pendulum**: linearize $\\sin\\theta$ to get SHM with $T = 2\\pi\\sqrt{L/g}$.
- **RC at small $t$**: $V = V_\\infty(1 - e^{-t/\\tau}) \\approx V_\\infty\\,t/\\tau$ — linear ramp early on.
- **Binomial**: $(1+x)^{n} \\approx 1 + nx$ for $|x| \\ll 1$.

### Edge-case check

Exact at $\\theta = 0$. Fails catastrophically near $\\pi/2$: $\\sin 90° = 1$, but $\\pi/2 \\approx 1.57$. Breakdown is gradual, not sudden.`,
      exampleProblems: `### Forward — pendulum period

> $L = 1\\text{ m}$ pendulum, released from $10°$. Find the period.

$10° \\approx 0.175\\text{ rad}$ is small. Linearize: $\\ddot\\theta = -(g/L)\\sin\\theta \\approx -(g/L)\\theta$ — SHM with $\\omega = \\sqrt{g/L}$. $T = 2\\pi\\sqrt{L/g} \\approx 2\\pi\\sqrt{1/10} \\approx 2\\text{ s}$ (using $\\pi^{2} \\approx 10$).

### Reverse — find the length

> Pendulum has period $T = 2\\text{ s}$. Find $L$.

Invert: $L = g(T/2\\pi)^{2} = gT^{2}/(4\\pi^{2}) \\approx 10 \\cdot 4/40 = 1\\text{ m}$.

### Classic trap — radians vs degrees

> Estimate $\\sin 5°$.

**Never** plug "$5$" into $\\sin\\theta \\approx \\theta$ — that gives $5$, absurd. Convert first: $5° = 5\\pi/180 \\approx 0.087\\text{ rad}$, so $\\sin 5° \\approx 0.087$ (true: $0.0872$). Degrees-in directly gives an answer $57\\times$ too big.`,
    },
  ],

  // ============================================================
  // PHYSICS 1 — Mechanics (10)
  // ============================================================
  phys1: [
    {
      id: "free-body-friction",
      title: "Free Body Diagrams, Force Balance, and Friction",
      keyEquations: `$$\\vec{F}_{\\text{net}} = m\\vec{a} \\qquad f_{k} = \\mu_{k} N \\qquad f_{s} \\le \\mu_{s} N$$

$$\\text{On a ramp:}\\qquad N = mg\\cos\\theta \\qquad F_{\\parallel} = mg\\sin\\theta$$`,
      context: `Draw **every** external force on the body — gravity, normal, tension, friction, applied — before writing any equation. Resolve along convenient axes (often along and perpendicular to an incline). **Kinetic friction** $f_{k} = \\mu_{k} N$ acts whenever surfaces slide; **static friction** $f_{s} \\le \\mu_{s} N$ is an **inequality** — it only resists as much as needed, up to its maximum. The ramp-decomposition $N = mg\\cos\\theta,\\ F_{\\parallel} = mg\\sin\\theta$ is **derivable from an edge case**: at $\\theta \\to 0$ (flat floor) the normal must be the full $mg$, so its multiplier has to equal 1 when $\\theta = 0$ — that's $\\cos$. (Details in the deep dive.)`,
      diagramKey: "fbd-inclined-plane",
      diagramPlacement: "front",
      readMore: `### Don't memorize $\\sin$ vs $\\cos$ — derive from edge cases

**Flat floor** ($\\theta = 0$): block presses down with its full weight, nothing sideways. So $N = mg$, $F_{\\parallel} = 0$. The trig factor that equals $1$ at $\\theta = 0$ is $\\cos$; the one that equals $0$ is $\\sin$. Answer locked.

**Vertical wall** ($\\theta = 90°$): block is in free-fall, no contact. So $N = 0$, $F_{\\parallel} = mg$. Check: $\\cos 90° = 0$ ✓, $\\sin 90° = 1$ ✓.

This edge-case trick works for **any** trig decomposition. Whenever you blank on which is which, plug in $0$ or $90°$ and read off physical intuition.

### When the formula breaks

- **Accelerating ramp** (ramp on a moving cart): non-inertial frame, add pseudo-force $m\\vec{a}_{\\text{ramp}}$ before resolving.
- **Tall narrow block on a steep ramp**: point-mass fails — torque balance kicks in, normal shifts to the downhill edge.
- **Critical angle** (block just about to slide): $\\mu_{s} mg\\cos\\theta_{c} = mg\\sin\\theta_{c}$ gives $\\tan\\theta_{c} = \\mu_{s}$, independent of mass. Classic interview derivation.

### Discipline

FBD first. Axes second (along/perp-to-ramp). $\\Sigma F = ma$ per axis third. Numbers last.`,
      exampleProblems: `### Forward — find the acceleration

> A $10\\text{ kg}$ block on a $30°$ ramp slides down, $\\mu_{k} = 0.2$. Find $a$.

$F_{\\parallel} = mg\\sin 30° = 50\\text{ N}$ down-ramp. $N = mg\\cos 30° \\approx 87\\text{ N}$. Friction opposes motion: $f_{k} = \\mu_{k} N \\approx 17\\text{ N}$ up-ramp. Net: $33\\text{ N}$. $a = F/m = 3.3\\text{ m/s}^{2}$.

### Reverse — find the angle

> A block slides down at $a = 3\\text{ m/s}^{2}$, $\\mu_{k} = 0.2$. Find the angle.

Same equation, different unknown. $a = g\\sin\\theta - \\mu_{k} g\\cos\\theta \\Rightarrow 0.3 = \\sin\\theta - 0.2\\cos\\theta$. Small-angle check: $\\theta - 0.2 \\approx 0.3 \\Rightarrow \\theta \\approx 0.5\\text{ rad} \\approx 29°$ (exact: $\\theta \\approx 27°$).

### Classic trap — static friction is an inequality

> A block sits **at rest** on a $25°$ ramp, $\\mu_{s} = 0.6$. What's the friction force?

*Not* $\\mu_{s} N$. Static friction supplies only what's needed to hold the block, up to its max. Required: $mg\\sin 25° \\approx 0.42\\,mg$. Max available: $\\mu_{s} mg\\cos 25° \\approx 0.54\\,mg$. Required $<$ max, so $f_{s} = mg\\sin 25°$. Applicants who auto-write $f = \\mu N$ lose this.`,
      practiceLink: { topic: "Physics", subtopic: "Free Body Diagrams & Forces" },
    },
    {
      id: "kinematics",
      title: "Kinematics — Deriving the Equations",
      keyEquations: `$$v = v_{0} + at \\qquad x = x_{0} + v_{0}t + \\tfrac{1}{2}a t^{2} \\qquad v^{2} = v_{0}^{2} + 2a\\,\\Delta x$$`,
      context: `Start from $a = \\text{constant}$. **Integrate once**: $v(t) = \\int a\\,dt = v_{0} + at$. **Integrate again**: $x(t) = \\int v\\,dt = x_{0} + v_{0}t + \\tfrac{1}{2}at^{2}$. **Eliminate $t$** between the first two to get $v^{2} = v_{0}^{2} + 2a\\,\\Delta x$. Average velocity under constant $a$ is $\\bar v = \\tfrac{1}{2}(v_{0} + v)$, giving $\\Delta x = \\bar v\\,t$. Derive, do not memorize — then you can rederive on the whiteboard from scratch under pressure.`,
      readMore: `### Derive all three in under a minute

Given $a = \\text{const}$:
1. $v = \\int a\\,dt = at + C_{1}$; at $t = 0$, $v = v_{0}$, so $C_{1} = v_{0}$. Done: $v = v_{0} + at$.
2. $x = \\int v\\,dt = v_{0}t + \\tfrac{1}{2}at^{2} + C_{2}$; at $t = 0$, $x = x_{0}$. Done.
3. Solve (1) for $t = (v - v_{0})/a$ and substitute into (2). After algebra: $v^{2} = v_{0}^{2} + 2a\\,\\Delta x$.

The third equation is time-free — use it when the problem doesn't care about $t$.

### Projectile motion — two 1D problems

Horizontal and vertical are independent. Horizontally: $a_{x} = 0$, so $x = v_{0x}t$ (constant velocity). Vertically: $a_{y} = -g$, so all three equations apply with $a = -g$. Range on flat ground: $R = v_{0}^{2}\\sin(2\\theta)/g$, max at $\\theta = 45°$.

### Sign convention

Pick $+$ direction **once** at the start (up, right, or initial-velocity direction). Gravity then acquires a sign (often $-g$). Do not flip mid-problem.

### When it breaks

Only valid for **constant** $a$. If $a = a(t)$, integrate carefully: $v = \\int a(t)\\,dt$. If $a = a(x)$ (e.g., spring), switch to energy methods.`,
      exampleProblems: `### Forward — time of flight

> Ball dropped from $45\\text{ m}$. Time to hit the ground? (use $g = 10$)

$x = \\tfrac{1}{2}gt^{2} \\Rightarrow 45 = 5t^{2} \\Rightarrow t = 3\\text{ s}$. Speed at impact: $v = gt = 30\\text{ m/s}$.

### Reverse — find the drop height

> A ball hits the ground at $30\\text{ m/s}$. Find the drop height.

Same physics, different unknown. $v^{2} = 2g\\,\\Delta x \\Rightarrow \\Delta x = v^{2}/(2g) = 900/20 = 45\\text{ m}$.

### Classic trap — sign of gravity

> A ball thrown **up** at $20\\text{ m/s}$, max height?

Pick $+$ up. Then $a = -g = -10$. At max, $v = 0$: $0 = 20 - 10t \\Rightarrow t = 2\\text{ s}$. $x = 20(2) - \\tfrac{1}{2}(10)(4) = 20\\text{ m}$. **Trap**: writing $a = +g$ because "gravity pulls down" while still using up-positive — you'd get the wrong sign on every term.`,
      practiceLink: { topic: "Physics", subtopic: "Kinematics" },
    },
    {
      id: "impulse",
      title: "Impulse — Force × Time",
      keyEquations: `$$\\vec{J} = \\int \\vec{F}\\,dt = \\vec{F}_{\\text{avg}}\\,\\Delta t = \\Delta \\vec{p} = m\\,\\Delta \\vec{v}$$`,
      context: `**Impulse** is the time integral of force, and it equals the change in momentum — this is just Newton's 2nd law rewritten: $\\vec{F} = d\\vec{p}/dt \\Rightarrow \\int \\vec{F}\\,dt = \\Delta \\vec{p}$. If the force is constant (or you use the average), $\\vec{J} = \\vec{F}_{\\text{avg}}\\,\\Delta t$. Units are $\\text{N·s} = \\text{kg·m/s}$ (same as momentum — they must match). Graphically, impulse is the **area under the $F$-vs-$t$ curve**, the way displacement is the area under $v$-vs-$t$. Use impulse whenever the problem hands you a force acting over a time (collision, kick, thrust pulse) — it converts directly to $\\Delta v$ without needing $a$.`,
      readMore: `### Derive from $F = ma$

$\\vec{F} = m\\vec{a} = m\\,d\\vec{v}/dt = d(m\\vec{v})/dt = d\\vec{p}/dt$ (mass constant). Integrate both sides in time:
$$\\int_{t_{1}}^{t_{2}} \\vec{F}\\,dt \\;=\\; \\Delta \\vec{p} \\;=\\; m\\vec{v}_{f} - m\\vec{v}_{i}.$$
The left side is the impulse $\\vec{J}$. That's the whole theorem — it's $F = ma$ integrated over time instead of evaluated instantaneously.

### Why crumple zones and seat belts work

A collision delivers a fixed $\\Delta p$ — determined by your speed and mass, not by the car. You can't change the impulse; you can only change how it's delivered. Stretch $\\Delta t$ by a factor of 10 (crumple zone, airbag, bending knees when you land) and the **average force drops by 10×**. Same $J$, smaller $F$. This is the single most important practical consequence of impulse.

### Average vs peak force

$F_{\\text{avg}} = J/\\Delta t$ is what the **impulse-momentum theorem gives you directly**. The **peak** force during a collision can be 2–10× higher depending on the force-vs-time shape (triangular, half-sine, etc.). If the problem asks for peak, you need the curve shape; if it asks for average, $J/\\Delta t$ is enough.

### Impulse vs work — time integral vs space integral

These are the two ways to integrate $F = ma$:
- Integrate over **time** → impulse $\\int F\\,dt = \\Delta p = m\\,\\Delta v$ (changes velocity linearly).
- Integrate over **space** → work $\\int F\\,dx = \\Delta KE = \\tfrac{1}{2}m\\,\\Delta(v^{2})$ (changes kinetic energy).

Same force, two different integrals, two different conserved-ish quantities. Pick the one whose **given data matches**: time given → impulse; distance given → work-energy.

### Vector, not scalar

$\\vec{J}$ and $\\vec{p}$ are vectors. A ball hits a wall at $+v$ and bounces back at $-v$: $\\Delta p = m(-v) - m(+v) = -2mv$, **not** zero and **not** $mv$. The sign flip doubles the impulse compared to a ball that just sticks to the wall.

### When it breaks

- **Variable mass** (rockets): $F \\ne d(mv)/dt$ naïvely because $m$ changes; use the rocket equation instead.
- **Relativistic speeds**: $\\vec{p} = \\gamma m\\vec{v}$, and the clean $\\Delta p = m\\,\\Delta v$ fails.
- **Non-impulsive forces** (gravity during a 1-second bounce): usually negligible, but on long timescales you must include them in the $\\int F\\,dt$.`,
      exampleProblems: `### Forward — given force and time, find $\\Delta v$

> A $0.15\\text{ kg}$ baseball is hit by a bat that exerts an average force of $900\\text{ N}$ over $5\\text{ ms}$. Find the change in the ball's speed.

$J = F_{\\text{avg}}\\,\\Delta t = 900 \\cdot 0.005 = 4.5\\text{ N·s}$. $\\Delta v = J/m = 4.5/0.15 = 30\\text{ m/s}$. No need for acceleration — impulse jumps you straight to $\\Delta v$.

### Reverse — given $\\Delta v$ and time, find the force

> A $70\\text{ kg}$ person lands from a $1.25\\text{ m}$ drop. They hit the ground at $v = \\sqrt{2gh} = 5\\text{ m/s}$ and stop. Compare the average force on their legs if they (a) land stiff-kneed and stop in $10\\text{ ms}$ vs (b) bend their knees and stop in $200\\text{ ms}$.

Same $\\Delta p = 70 \\cdot 5 = 350\\text{ N·s}$ either way. (a) $F = 350/0.01 = 35{,}000\\text{ N}$ — broken bones. (b) $F = 350/0.2 = 1{,}750\\text{ N}$ — uncomfortable but safe. **20× reduction** from stretching $\\Delta t$ — this is why you bend your knees.

### Classic trap — bouncing ball is $2mv$, not $mv$

> A $0.5\\text{ kg}$ ball hits a wall at $10\\text{ m/s}$ and bounces back elastically at $10\\text{ m/s}$. Contact time $20\\text{ ms}$. Average force on the wall?

$\\Delta p = m(v_{f} - v_{i}) = 0.5(-10 - 10) = -10\\text{ kg·m/s}$. Magnitude $10$, **not $5$**. $F_{\\text{avg}} = 10/0.02 = 500\\text{ N}$. **Trap**: applicants write $\\Delta p = mv = 5$ because they forget the sign flip — that would apply to a ball that *sticks*, not one that bounces.`,
      practiceLink: { topic: "Physics", subtopic: "Collisions & Conservation" },
    },
    {
      id: "collisions",
      title: "Collisions & Conservation Laws",
      keyEquations: `$$\\vec{p} = m\\vec{v} \\qquad KE = \\tfrac{1}{2}m v^{2} \\qquad PE_{g} = mgh \\qquad PE_{\\text{spring}} = \\tfrac{1}{2}k x^{2}$$`,
      context: `**Momentum** $\\vec{p} = m\\vec{v}$ is conserved in every collision where no external force acts — this is how you always start. **Elastic** collisions conserve kinetic energy too (billiard balls, hard steel); **perfectly inelastic** collisions have the bodies stick together and do **not** conserve kinetic energy, only momentum. **Potential energy** comes in two forms you will see constantly: gravitational $mgh$ and spring $\\tfrac{1}{2}k x^{2}$.`,
      readMore: `### Always start with momentum

If no external horizontal force acts during the collision, horizontal momentum is conserved. Write it first, regardless of elastic/inelastic:
$$m_{1}v_{1i} + m_{2}v_{2i} = m_{1}v_{1f} + m_{2}v_{2f}$$
Then ask: is energy also conserved?

### Elastic vs inelastic — which energy equation

- **Elastic** (billiard balls, hard steel, perfectly bouncy): $KE_{i} = KE_{f}$. Two equations, two unknowns.
- **Perfectly inelastic** (bodies stick): $v_{1f} = v_{2f} = v_{f}$. One equation, one unknown. KE is **not** conserved — some went to heat/deformation.
- **In between** (a real car crash): momentum conserved, KE partially lost. Use $e = -(v_{1f} - v_{2f})/(v_{1i} - v_{2i})$ (coefficient of restitution) if given.

### Sanity check — equal-mass elastic

Two equal-mass balls, one moving at $v$, one at rest. Elastic collision: the moving ball **stops**, the target leaves at $v$. This is the Newton's-cradle behavior — worth verifying your equations reproduce it.

### When momentum is NOT conserved

If an external impulsive force acts **during** the collision (ball hits a wall, object hits the ground), momentum of the ball alone isn't conserved — but momentum of the **system** (ball + wall + Earth) still is. Choose your system to eat the external force.`,
      exampleProblems: `### Forward — perfectly inelastic

> A $2\\text{ kg}$ cart at $3\\text{ m/s}$ hits a stationary $1\\text{ kg}$ cart. They stick. Final speed?

$p_{i} = 2 \\cdot 3 + 1 \\cdot 0 = 6\\text{ kg·m/s}$. $p_{f} = (2+1)v_{f} \\Rightarrow v_{f} = 2\\text{ m/s}$. KE lost: $9 - 6 = 3\\text{ J}$ went to heat/deformation.

### Reverse — find the initial speed

> After a perfectly inelastic collision, the $3\\text{ kg}$ combined mass moves at $2\\text{ m/s}$. The $1\\text{ kg}$ target was at rest. Find the striker's initial speed.

Same equation, invert the unknown. $p_{f} = p_{i} \\Rightarrow 3 \\cdot 2 = 2 \\cdot v_{1i} + 0 \\Rightarrow v_{1i} = 3\\text{ m/s}$.

### Classic trap — assuming elastic

> A $1\\text{ kg}$ ball at $4\\text{ m/s}$ collides with a $3\\text{ kg}$ ball at rest. After, the $1\\text{ kg}$ ball moves backward at $2\\text{ m/s}$. Energy conserved?

Momentum: $4 = -2 + 3v_{2f} \\Rightarrow v_{2f} = 2\\text{ m/s}$. Check KE: initial $8\\text{ J}$, final $2 + 6 = 8\\text{ J}$ — yes, elastic. **Trap**: applicants assume elastic without checking; if the arithmetic didn't balance they'd need to invoke energy loss to heat.`,
      practiceLink: { topic: "Physics", subtopic: "Collisions & Conservation" },
    },
    {
      id: "conservation-energy",
      title: "Conservation of Energy",
      keyEquations: `$$E_{\\text{mech}} = KE + PE = \\text{constant} \\quad \\text{(conservative forces only)}$$

$$\\Delta KE + \\Delta PE = W_{\\text{nc}} \\quad \\text{(when friction or drag is present)}$$`,
      context: `When only conservative forces (gravity, springs, ideal tensions) act, total mechanical energy is conserved — a block sliding down a frictionless ramp trades $PE$ for $KE$ exactly. When **non-conservative** forces like friction or air drag are present, the deficit $W_{\\text{nc}}$ is dissipated as heat. This is the **first principle to try** on any problem that mentions heights, spring compressions, or speed changes — it sidesteps the forces entirely.`,
      readMore: `### Why energy conservation is "free"

Forces require a force diagram, axes, and integration in time. Energy is a **scalar** — you only need initial and final states. If nothing dissipates, the two states are connected by $E_{i} = E_{f}$. That's one equation with whatever unknown you want.

### What counts as conservative

A force is conservative if the work it does on a round trip is zero — equivalently, the work between two points depends only on the endpoints, not the path. Gravity, ideal springs, electrostatics: yes. Friction, air drag: no — they always oppose motion, so the round-trip work is negative.

### Work-energy theorem — the bridge to forces

Net work on a body equals its change in kinetic energy: $W_{\\text{net}} = \\Delta KE$. This is how you connect energy methods to force diagrams when needed: $W = \\int \\vec F \\cdot d\\vec r$.

### When forces beat energy

If the problem asks for **acceleration** or **tension at a specific instant**, energy won't get you there directly — forces will. Energy handles "given start, find speed at end"; forces handle "what's happening right now."`,
      exampleProblems: `### Forward — speed at the bottom

> Block slides from rest down a frictionless $5\\text{ m}$ ramp. Speed at bottom?

$mgh = \\tfrac{1}{2}mv^{2} \\Rightarrow v = \\sqrt{2gh} = \\sqrt{100} = 10\\text{ m/s}$. Mass cancels — energy conservation often does that.

### Reverse — find the height

> A block reaches the bottom of a frictionless ramp at $10\\text{ m/s}$. Find the drop height.

Same equation, invert the unknown. $h = v^{2}/(2g) = 100/20 = 5\\text{ m}$. The forward and reverse directions are literally the same one-line equation — which is the whole point of starting with energy.

### Classic trap — friction changes the answer

> Same $5\\text{ m}$ ramp, but friction dissipates $20\\text{ J}$. Mass is $1\\text{ kg}$. Speed at bottom?

$mgh - W_{\\text{f}} = \\tfrac{1}{2}mv^{2} \\Rightarrow 50 - 20 = 0.5v^{2} \\Rightarrow v \\approx 7.7\\text{ m/s}$. **Trap**: dropping $W_{\\text{f}}$ because the problem didn't explicitly say "subtract it." Any time energy is dissipated you **must** account for it.`,
      practiceLink: { topic: "Basic Physics", subtopic: "Conservation of Energy" },
    },
    {
      id: "angular",
      title: "Angular Physics — Velocity, Momentum, Centripetal vs Centrifugal",
      keyEquations: `$$\\omega = \\frac{d\\theta}{dt} \\qquad \\vec{L} = I\\vec{\\omega} \\qquad a_{c} = \\frac{v^{2}}{r} = \\omega^{2} r$$`,
      context: `**Angular velocity** $\\omega$ is how fast the angle sweeps; **angular momentum** $\\vec{L} = I\\vec{\\omega}$ is conserved when no external torque acts (a spinning skater pulling in her arms). **Centripetal acceleration** $a_{c} = v^{2}/r$ points **inward** — it is the real radial acceleration required to keep something in circular motion, supplied by tension, friction, gravity, etc. **Centrifugal force** is a fictitious outward force that appears only in the **rotating frame** of the object itself; it is what you feel pressing you against the car door in a turn, but in an inertial frame there is no such force.`,
      readMore: `### Where $a_{c} = v^{2}/r$ comes from

A particle moving in a circle at constant speed $v$ has its velocity vector rotating, even though $|v|$ is constant. Over time $dt$, the direction changes by angle $d\\theta = v\\,dt/r$, so $|dv| = v\\,d\\theta = v^{2}\\,dt/r$. Divide by $dt$: $a = v^{2}/r$, pointing toward the center (that's where the change in $\\vec v$ points).

### Centripetal force is always supplied by something real

Ball on a string: tension. Car on a flat curve: static friction. Satellite: gravity. Banked turn: component of normal force. The phrase "centripetal force" names the **role**, not a new kind of force — you still have to identify which real force is playing it.

### Centrifugal — a rotating-frame bookkeeping device

In the rotating frame of the car, you appear stationary, so Newton's 2nd demands a force balancing friction. That's the centrifugal pseudo-force. Useful for spinning-reference-frame problems (centrifuges, planetary dynamics), but never invoke it in an inertial-frame analysis.

### Angular-momentum conservation — the skater

Spinning skater pulls arms in: $I$ drops (mass closer to axis). No external torque, so $L = I\\omega$ fixed $\\Rightarrow \\omega$ rises. Kinetic energy $\\tfrac{1}{2}I\\omega^{2}$ **increases** — work done by the skater's arm muscles against the "centrifugal tendency."`,
      exampleProblems: `### Forward — tension in a string

> A $0.5\\text{ kg}$ ball on a $1\\text{ m}$ string moves in a horizontal circle at $4\\text{ m/s}$. Tension?

$T = mv^{2}/r = 0.5 \\cdot 16 / 1 = 8\\text{ N}$. Tension is the real force playing the centripetal role.

### Reverse — find the speed

> Tension in a $1\\text{ m}$ string holding a $0.5\\text{ kg}$ ball in a horizontal circle is $8\\text{ N}$. Find the speed.

Same equation. $v = \\sqrt{Tr/m} = \\sqrt{8 \\cdot 1 / 0.5} = \\sqrt{16} = 4\\text{ m/s}$.

### Classic trap — "centrifugal force" on a driver

> Why do you feel thrown outward when a car turns left sharply?

Inertial-frame truth: you **continue straight**; the car door curves into you. There is no outward force — friction/seat push you **inward** to make you also turn. Applicants who say "centrifugal force pushes me outward" in an inertial-frame problem lose points.`,
      practiceLink: { topic: "Physics", subtopic: "Angular Physics" },
    },
    {
      id: "buoyancy",
      title: "Buoyancy & Archimedes' Principle",
      keyEquations: `$$F_{b} = \\rho_{\\text{fluid}}\\,V_{\\text{disp}}\\,g$$`,
      context: `**Archimedes**: the buoyant force on any submerged body equals the **weight of the fluid it displaces**. At equilibrium, $F_{b}$ balances gravity, so an object floats when $\\rho_{\\text{object}} < \\rho_{\\text{fluid}}$ and sinks when it is denser. This is how ships float (huge displaced volume even though steel is dense), and how a submarine adjusts depth — by admitting or expelling water from its ballast tanks, changing $V_{\\text{disp}}$ to tip the balance with gravity.`,
      readMore: `### Why $F_{b} = \\rho g V_{\\text{disp}}$ — pressure integral

Fluid pressure at depth $d$ is $P = \\rho g d$ (higher pressure pushes harder). Pressure on the bottom of a submerged body is greater than on the top — the **difference** integrated over the surface points straight up and equals the weight of fluid in the body's shape. That's the buoyant force; the derivation doesn't depend on the body's shape or density.

### Floating: fraction submerged

A body of density $\\rho_{b}$ floating in fluid of density $\\rho_{f}$ has fraction $\\rho_{b}/\\rho_{f}$ submerged. Ice ($0.92$) in water ($1.00$): $92\\%$ underwater — the famous "tip of the iceberg." This is why fresh water floats on salt water in an estuary.

### Submarine depth control

A sub's hull volume is fixed. By taking on or expelling water from ballast tanks, it changes its **total mass** at (nearly) constant displaced volume. Add water → sink; blow ballast with compressed air → rise. Fine depth is trimmed by the hydroplanes (hydrodynamic lift).

### When it breaks

Assumes incompressible fluid and that the body is fully in **one** fluid. For a body straddling two fluids (oil on water) or compressible fluids (gas at high altitude), add buoyancy contributions separately.`,
      exampleProblems: `### Forward — how much is submerged

> A wooden block of density $0.6\\text{ g/cm}^{3}$ floats in water. What fraction is submerged?

$V_{\\text{sub}}/V_{\\text{total}} = \\rho_{\\text{block}}/\\rho_{\\text{water}} = 0.6$. Sixty percent underwater.

### Reverse — find the density

> A block floats with $70\\%$ submerged in water. Find its density.

$\\rho_{\\text{block}} = 0.7 \\cdot 1.00 = 0.70\\text{ g/cm}^{3}$.

### Classic trap — sub on a scale

> A rock is submerged in a pool sitting on a scale. Does the scale read more, less, or the same as before the rock was lowered in?

**More** — by the weight of the rock. Buoyancy pushes up on the rock, but by Newton's 3rd the rock pushes down on the water with the same force, which is transmitted to the scale. Same logic: a fish in a sealed aquarium on a scale adds **its full weight**, even though the fish is "weightless" in the water.`,
      practiceLink: { topic: "Physics", subtopic: "Buoyancy" },
    },
    {
      id: "gravity-escape",
      title: "Gravity & Escape Velocity",
      keyEquations: `$$F = G\\,\\frac{m_{1} m_{2}}{r^{2}} \\qquad g = \\frac{GM}{R^{2}} \\qquad v_{e} = \\sqrt{\\frac{2GM}{R}}$$`,
      context: `Newton's universal law of gravitation: every pair of masses attracts along the line between them, inverse-square in distance. Surface gravity $g$ follows from plugging Earth's radius into $GM/r^{2}$. **Escape velocity** comes from energy conservation: launch with $\\tfrac{1}{2}m v_{e}^{2}$ of kinetic energy exactly equal to the gravitational well depth $GMm/R$, and the object barely reaches infinity with zero speed — solve for $v_{e}$.`,
      readMore: `### Derive escape velocity from energy

Gravitational PE relative to $r = \\infty$: $U(r) = -GMm/r$ (negative because bound states have less energy than "infinitely far"). To escape, launch kinetic energy must fill the well exactly:
$$\\tfrac{1}{2}m v_{e}^{2} = \\frac{GMm}{R} \\Rightarrow v_{e} = \\sqrt{\\frac{2GM}{R}}$$
Earth: $v_{e} \\approx 11.2\\text{ km/s}$.

### Why $mgh$ is a small-$h$ approximation

Near the surface, $U(r) = -GMm/r$ linearizes to $U \\approx -GMm/R + (GMm/R^{2})h = \\text{const} + mgh$. The familiar $mgh$ is the **first Taylor term** of the full inverse-square PE — valid when $h \\ll R$.

### Orbital speed

Set gravity as the centripetal force: $GMm/r^{2} = mv^{2}/r \\Rightarrow v_{\\text{orb}} = \\sqrt{GM/r}$. Note $v_{e} = \\sqrt{2}\\,v_{\\text{orb}}$ — escape is $\\sqrt{2} \\approx 1.41$ times orbital. LEO: $v_{\\text{orb}} \\approx 7.9\\text{ km/s}$.

### Doesn't depend on launch direction

Escape velocity is a **speed**, not a vector. From the surface, straight-up gives the same answer as $45°$ (ignoring atmosphere) because gravitational PE is a function of $r$ only. Rockets launch near-horizontal only because it's energetically efficient to also build orbital velocity.`,
      exampleProblems: `### Forward — escape from Earth

> Given $g = 9.8\\text{ m/s}^{2}$ at $R = 6.4 \\times 10^{6}\\text{ m}$, find $v_{e}$.

Trick: $GM/R^{2} = g \\Rightarrow GM = gR^{2}$. Then $v_{e} = \\sqrt{2gR} = \\sqrt{2 \\cdot 9.8 \\cdot 6.4\\times 10^{6}} \\approx \\sqrt{1.25\\times 10^{8}} \\approx 11.2\\text{ km/s}$. Notice you never needed $G$ or $M$ separately.

### Reverse — find the planet's radius

> A planet has surface $g = 20\\text{ m/s}^{2}$ and $v_{e} = 20\\text{ km/s}$. Find $R$.

From $v_{e}^{2} = 2gR$: $R = v_{e}^{2}/(2g) = (2\\times 10^{4})^{2}/(40) = 10^{7}\\text{ m}$.

### Classic trap — "weightlessness" in orbit

> Why do astronauts float in the ISS?

**Not** because gravity is zero — $g$ at ISS altitude is ~$90\\%$ of surface gravity. They float because they and the station are both in free-fall around Earth at the same $v_{\\text{orb}}$. Trap answer: "no gravity in space."`,
      practiceLink: { topic: "Physics", subtopic: "Gravity & Escape Velocity" },
    },
    {
      id: "springs-shm",
      title: "Springs — Hooke's Law & Spring Theory",
      keyEquations: `$$F = -k x \\qquad U = \\tfrac{1}{2}k x^{2} \\qquad \\omega = \\sqrt{\\frac{k}{m}} \\qquad T = 2\\pi\\sqrt{\\frac{m}{k}}$$`,
      context: `Hooke's Law: the restoring force on a displaced spring is **linear** in displacement and **opposite** in direction — hence the minus sign. Stored energy is the work you did against the spring, $\\tfrac{1}{2}k x^{2}$. A mass on a spring obeys $\\ddot x = -\\tfrac{k}{m} x$, whose solution is a sinusoid with angular frequency $\\omega = \\sqrt{k/m}$ and period $T = 2\\pi\\sqrt{m/k}$. Energy continuously trades between kinetic and spring-potential, but the **total is constant**.`,
      readMore: `### Derive SHM from Newton's 2nd

$F = -kx$ and $F = ma = m\\ddot x$ combine to $\\ddot x = -(k/m)x$. The solution is $x(t) = A\\cos(\\omega t + \\phi)$ with $\\omega = \\sqrt{k/m}$ — check by differentiating twice. $A$ and $\\phi$ come from initial conditions.

### Derive $U = \\tfrac{1}{2}kx^{2}$

Work to stretch from $0$ to $x$: $U = \\int_{0}^{x} kx'\\,dx' = \\tfrac{1}{2}kx^{2}$. Area under the $F$-vs-$x$ line triangle.

### Energy trading

At max displacement: all energy is PE, $v = 0$. At equilibrium: all energy is KE, $x = 0$, max speed $v_{\\max} = \\omega A$. Set $\\tfrac{1}{2}kA^{2} = \\tfrac{1}{2}mv_{\\max}^{2}$ to confirm.

### Springs in series vs parallel

**Parallel** (both pull on the same mass): $k_{\\text{eq}} = k_{1} + k_{2}$ — stiffer. **Series** (end-to-end): $1/k_{\\text{eq}} = 1/k_{1} + 1/k_{2}$ — softer. Opposite of resistors, because forces add differently.

### Why period doesn't depend on amplitude

For a linear restoring force, stiffer pull at larger amplitude exactly compensates for the longer distance traveled. This is the defining feature of SHM. Nonlinear springs (real-world for large stretch) lose this property.`,
      exampleProblems: `### Forward — find the period

> A $2\\text{ kg}$ mass on a $k = 50\\text{ N/m}$ spring. Period?

$T = 2\\pi\\sqrt{m/k} = 2\\pi\\sqrt{0.04} = 2\\pi(0.2) \\approx 1.26\\text{ s}$.

### Reverse — find the spring constant

> A $2\\text{ kg}$ mass on a spring has period $T = 1\\text{ s}$. Find $k$.

Invert: $k = 4\\pi^{2}m/T^{2} \\approx 40 \\cdot 2 / 1 = 80\\text{ N/m}$ (using $\\pi^{2} \\approx 10$).

### Classic trap — amplitude doesn't affect period

> A mass-spring oscillates with amplitude $A$. If you double $A$, what happens to $T$?

**Nothing** — period is independent of amplitude for a linear spring. Max speed doubles ($v_{\\max} = \\omega A$), max force doubles, but the round trip still takes $T = 2\\pi\\sqrt{m/k}$. Trap answer: "doubles" or "quadruples" (confusion with kinematic thinking).`,
      practiceLink: { topic: "Physics", subtopic: "Springs" },
    },
    {
      id: "torque-shear-torsion",
      title: "Torque, Shear & Moment Diagrams, Torsion",
      keyEquations: `$$\\vec{\\tau} = \\vec{r}\\times\\vec{F} \\qquad \\tau_{\\text{net}} = I\\alpha \\qquad \\tau_{\\text{shear}} = \\frac{T r}{J}$$`,
      context: `**Torque** is the rotational analog of force: it is what makes something angularly accelerate. Rotational Newton's 2nd is $\\tau_{\\text{net}} = I\\alpha$. For a **beam in static equilibrium**, plot the internal shear force $V(x)$ and bending moment $M(x)$ along its length — these feed directly into stress analysis (max bending stress occurs where $|M|$ peaks). **Torsion**: a shaft twisted by an applied torque $T$ carries shear stress $\\tau_{\\text{shear}} = T r / J$, where $r$ is distance from the shaft axis and $J$ is the polar second moment of area.`,
      readMore: `### Torque magnitude — only the perpendicular arm

$|\\tau| = rF\\sin\\theta$ where $\\theta$ is the angle between $\\vec r$ and $\\vec F$. Only the component of $F$ perpendicular to $\\vec r$ generates torque — a force pushing straight toward the pivot ($\\theta = 0$) does nothing rotational.

### Static equilibrium — two balances

For a beam at rest: $\\Sigma F = 0$ (no linear acceleration) **and** $\\Sigma \\tau = 0$ about any point (no angular acceleration). Choose the pivot smartly — pick where an unknown force acts so that force drops out of the torque equation.

### Shear and moment — integrals of the load

$V(x) = -\\int w(x)\\,dx$ (shear is the running tally of vertical load); $M(x) = \\int V(x)\\,dx$ (moment is the running tally of shear). Corollary: $V = dM/dx$ — the shear diagram is the slope of the moment diagram. Max $|M|$ occurs where $V = 0$ (that's where the moment's derivative vanishes).

### Torsion — why stress peaks at the surface

For a circular shaft, shear stress $\\tau = Tr/J$ is **linear** in $r$: zero at the center, max at the outer surface. So a thin-walled tube is nearly as strong in torsion as a solid shaft of the same outer radius — the core carries little stress. That's why drive shafts are often hollow.`,
      exampleProblems: `### Forward — balance a seesaw

> A $60\\text{ kg}$ adult sits $1\\text{ m}$ from the pivot. At what distance does a $30\\text{ kg}$ child need to sit on the other side to balance?

$\\Sigma \\tau_{\\text{pivot}} = 0$: $60 \\cdot 1 = 30 \\cdot x \\Rightarrow x = 2\\text{ m}$.

### Reverse — find the adult's weight

> Child at $2\\text{ m}$ balances an adult at $1\\text{ m}$. Child is $30\\text{ kg}$. Find adult mass.

Same equation, invert. $m_{\\text{adult}} = 30 \\cdot 2 / 1 = 60\\text{ kg}$.

### Classic trap — applying force not perpendicular

> A wrench handle is $0.3\\text{ m}$ long. You push with $100\\text{ N}$ **along** the handle toward the nut. Torque?

**Zero.** The force is parallel to $\\vec r$, so the cross product is zero. You have to push perpendicular to the handle. Trap answer: $30\\text{ N·m}$ from blindly multiplying.`,
      practiceLink: { topic: "Physics", subtopic: "Torque & Moments" },
    },
  ],

  // ============================================================
  // PHYSICS 2 — Circuits, Chemistry, Gas Laws (8)
  // ============================================================
  phys2: [
    {
      id: "ohms-law",
      title: "Ohm's Law & Power",
      keyEquations: `$$V = I R \\qquad P = I V = I^{2} R = \\frac{V^{2}}{R}$$`,
      context: `**Ohm's Law** is the defining relationship for a resistor: voltage across it is proportional to current through it, with resistance as the constant. Power dissipated is current times voltage — equivalent forms $I^{2} R$ and $V^{2}/R$ follow by substitution. Intuition: **doubling the resistance at fixed voltage halves the current**, and the resistor heats up in proportion to power.`,
      readMore: `### Which power formula to use

All three are $P = IV$ with Ohm substituted. Pick based on what's fixed:
- Fixed voltage across the resistor → $P = V^{2}/R$. Decreasing $R$ **increases** dissipation.
- Fixed current through the resistor → $P = I^{2}R$. Decreasing $R$ **decreases** dissipation.

These point opposite ways; picking the wrong one is the single most common circuit error.

### Why power lines are high-voltage

To deliver $P = IV$ at lower $I$, utilities crank $V$ up. Transmission losses are $I^{2}R_{\\text{line}}$ — **quadratic** in current. Ten-times-higher voltage means ten-times-lower current, which means $100\\times$ lower dissipation in the wires.

### Ohm's law is an empirical approximation

Real metal resistors are ohmic over wide ranges, but **not** all electrical devices are. Diodes, transistors, and filament bulbs all violate $V = IR$ — their $V$-$I$ curves are not straight lines.

### Intuition — water analogy

Voltage = pressure difference. Current = flow rate. Resistance = pipe narrowness. Power = rate at which pressure does work on flow. Intuitive, but has limits — it breaks down for AC and semiconductor effects.`,
      exampleProblems: `### Forward — compute current

> A $120\\text{ V}$ source across a $40\\ \\Omega$ resistor. Find $I$ and $P$.

$I = V/R = 3\\text{ A}$. $P = IV = 360\\text{ W}$. Equivalent: $V^{2}/R = 14400/40 = 360$ ✓.

### Reverse — pick $P = I^{2}R$ vs $P = V^{2}/R$

> A $10\\ \\Omega$ resistor in series with another resistor draws $2\\text{ A}$ from a $30\\text{ V}$ source. Find the power dissipated in the $10\\ \\Omega$.

Current through it is fixed at $2\\text{ A}$. Use $P = I^{2}R = 4 \\cdot 10 = 40\\text{ W}$. **Trap**: plugging $V = 30\\text{ V}$ into $V^{2}/R = 90\\text{ W}$ — that's the total source power, not the $10\\ \\Omega$'s share.

### Classic trap — "more resistance dissipates more heat"

> Two bulbs, $100\\text{ W}$ and $60\\text{ W}$, both rated $120\\text{ V}$. Which has higher resistance?

$R = V^{2}/P \\Rightarrow$ the $60\\text{ W}$ bulb has **higher** $R$. Trap: "higher wattage = higher resistance." Actually, higher wattage bulbs are **less** resistive (they pull more current at the same voltage).`,
      practiceLink: { topic: "Basic Physics", subtopic: "Circuits" },
    },
    {
      id: "series-parallel",
      title: "Series vs Parallel Resistors",
      keyEquations: `$$R_{\\text{series}} = \\sum_{i} R_{i} \\qquad \\frac{1}{R_{\\text{parallel}}} = \\sum_{i} \\frac{1}{R_{i}}$$`,
      context: `In **series**, the same current flows through every resistor, and voltages add — equivalent resistance is the sum. In **parallel**, the same voltage sits across every resistor, and currents add — equivalent reciprocals sum. Intuition: parallel branches give the current **more paths**, so total resistance **drops**; series stacks obstructions in a row, so resistance **rises**.`,
      readMore: `### Derive series and parallel from KVL/KCL

**Series**: one path, same $I$ everywhere. KVL: $V = IR_{1} + IR_{2} = I(R_{1} + R_{2})$, so $R_{\\text{eq}} = R_{1} + R_{2}$.

**Parallel**: two paths, same $V$ across each. KCL: $I = V/R_{1} + V/R_{2} = V(1/R_{1} + 1/R_{2})$, so $1/R_{\\text{eq}} = 1/R_{1} + 1/R_{2}$.

### Two-resistor parallel — the fast formula

For **just two** in parallel: $R_{\\text{eq}} = R_{1}R_{2}/(R_{1} + R_{2})$. Memorize this — it's the most common case.

### Sanity checks

- Two equal resistors in parallel: $R_{\\text{eq}} = R/2$. Half.
- Two equal resistors in series: $R_{\\text{eq}} = 2R$. Double.
- Parallel $R_{\\text{eq}}$ is always **less than the smallest branch**. If you get more, you made an error.

### Voltage divider

Two resistors in series across $V_{s}$: $V_{R_{2}} = V_{s} \\cdot R_{2}/(R_{1} + R_{2})$. Voltage "drops proportionally." Universally useful — everywhere from sensor networks to Thevenin equivalents.`,
      exampleProblems: `### Forward — combine

> $R_{1} = 6\\ \\Omega$ in series with the parallel combination of $R_{2} = 4\\ \\Omega$ and $R_{3} = 12\\ \\Omega$. Find $R_{\\text{eq}}$.

Parallel: $4 \\cdot 12 / (4 + 12) = 48/16 = 3\\ \\Omega$. Add series: $6 + 3 = 9\\ \\Omega$.

### Reverse — find the unknown resistor

> A $6\\ \\Omega$ and an unknown $R$ in parallel give $2\\ \\Omega$ equivalent. Find $R$.

$1/2 = 1/6 + 1/R \\Rightarrow 1/R = 1/3 \\Rightarrow R = 3\\ \\Omega$.

### Classic trap — mixing series and parallel rules

> Three $6\\ \\Omega$ resistors in parallel.

$1/R_{\\text{eq}} = 1/6 + 1/6 + 1/6 = 3/6 \\Rightarrow R_{\\text{eq}} = 2\\ \\Omega$. Trap: writing $R_{1} \\parallel R_{2} \\parallel R_{3} = R_{1}R_{2}R_{3}/(R_{1}+R_{2}+R_{3}) = 216/18 = 12$ — that formula is **wrong**, it's only right for two. For three or more, stick with reciprocals.`,
      practiceLink: { topic: "Basic Physics", subtopic: "Circuits" },
    },
    {
      id: "kirchhoff",
      title: "Kirchhoff's Laws (KVL & KCL)",
      keyEquations: `$$\\text{KVL:}\\ \\sum_{\\text{loop}} V = 0 \\qquad \\text{KCL:}\\ \\sum_{\\text{in}} I = \\sum_{\\text{out}} I$$`,
      context: `These are **conservation laws**, not new rules. **KVL** (voltage law) says the sum of voltage drops around any closed loop equals zero — a charge that returns to its starting point must have zero net energy change. **KCL** (current law) says the current flowing into a node equals the current flowing out — charge is conserved and cannot pile up. Set up one KVL per loop, one KCL per independent node, and solve the linear system.`,
      readMore: `### Sign conventions — the killer

Pick a loop direction (say clockwise). Then for each element you encounter:
- **Resistor**, current **with** the loop direction: voltage drop is $-IR$ (you're going from high to low).
- **Resistor**, current **against** the loop direction: voltage drop is $+IR$.
- **Battery**, entering $-$ terminal first: $+V_{s}$ (you gain energy).
- **Battery**, entering $+$ terminal first: $-V_{s}$.

Write the sign out once per element. Sign errors are the #1 KVL mistake.

### Choose currents first, then write KCL/KVL

Label every branch current with an assumed direction and a name ($I_{1}$, $I_{2}$, …). If the algebra yields a negative, that branch flows the other way — **don't fix the diagram**, just note it.

### How many equations?

For a network with $b$ branches and $n$ nodes: you get $n - 1$ independent KCL equations and $b - (n - 1)$ independent KVL equations, for exactly $b$ total — enough for the $b$ unknown currents.

### Mesh analysis — a shortcut

Instead of branch currents, assign **loop currents** (one per independent loop). Then only KVL matters, and the count is $b - n + 1$ equations. Popular for hand analysis of multi-loop circuits.`,
      exampleProblems: `### Forward — two-loop network

> $9\\text{ V}$ battery, $3\\ \\Omega$ in loop 1, $6\\ \\Omega$ in loop 2, $2\\ \\Omega$ shared. Find loop currents.

Mesh: $I_{1}, I_{2}$ clockwise. Loop 1: $9 - 3I_{1} - 2(I_{1} - I_{2}) = 0 \\Rightarrow 5I_{1} - 2I_{2} = 9$. Loop 2: $-6I_{2} - 2(I_{2} - I_{1}) = 0 \\Rightarrow -2I_{1} + 8I_{2} = 0 \\Rightarrow I_{2} = I_{1}/4$. Substitute: $5I_{1} - I_{1}/2 = 9 \\Rightarrow I_{1} = 2\\text{ A}$, $I_{2} = 0.5\\text{ A}$.

### Reverse — find the source EMF

> In the same topology, loop 1 current is measured at $2\\text{ A}$. Find the source voltage.

Invert: from $5I_{1} - 2I_{2} = V_{s}$ and $I_{2} = I_{1}/4$: $V_{s} = 5(2) - 2(0.5) = 9\\text{ V}$.

### Classic trap — sign of the shared resistor

> Writing KVL across the middle $2\\ \\Omega$ branch when walking loop 1.

Shared current through it is $I_{1} - I_{2}$ (with $I_{1}$'s direction). Voltage drop walking with loop 1: $2(I_{1} - I_{2})$. Forgetting the $-I_{2}$ term (treating the branch as carrying only $I_{1}$) is the standard error.`,
      practiceLink: { topic: "Physics", subtopic: "Circuits" },
    },
    {
      id: "capacitance-rc",
      title: "Capacitance & RC Circuits",
      keyEquations: `$$C = \\frac{Q}{V} \\qquad V_{C}(t) = V_{\\infty}\\!\\left(1 - e^{-t/\\tau}\\right),\\ \\tau = RC \\qquad U_{C} = \\tfrac{1}{2} C V^{2}$$`,
      context: `A **capacitor** stores charge in proportion to voltage; the constant $C$ is its capacitance. In **DC steady state** a capacitor draws no current, so it behaves like an **open circuit**. During charging through a resistor, voltage rises exponentially with time constant $\\tau = RC$: $63\\%$ at $t = \\tau$, $95\\%$ at $3\\tau$, essentially full by $5\\tau$. Energy stored is $\\tfrac{1}{2} C V^{2}$. Why charging slows: as $V_{C}$ rises, the voltage across $R$ falls, current falls, and accumulation slows — a self-limiting process.`,
      readMore: `### Derive the charging curve from KVL

Battery $V_{s}$, resistor $R$, capacitor $C$ in series. KVL: $V_{s} = IR + V_{C}$, where $I = dQ/dt$ and $Q = CV_{C}$. Substitute: $V_{s} = RC\\,dV_{C}/dt + V_{C}$. First-order linear ODE, solution:
$$V_{C}(t) = V_{s}(1 - e^{-t/RC})$$
At $t = 0$, $V_{C} = 0$ (capacitor starts empty); at $t \\to \\infty$, $V_{C} = V_{s}$ (steady state).

### The three time-constant checkpoints

$t = \\tau$ → $63\\%$. $t = 3\\tau$ → $95\\%$. $t = 5\\tau$ → $99.3\\%$. Interviewers love asking "when has the capacitor essentially finished charging?" Answer: $\\sim 5\\tau$.

### Open circuit at steady state, short at $t = 0$

At DC steady state: $dV/dt = 0 \\Rightarrow I = 0 \\Rightarrow$ capacitor looks like an **open circuit** (no current through it). At $t = 0^{+}$ with an uncharged cap: $V_{C} = 0 \\Rightarrow$ it looks like a **short** (wire). These limits let you solve for initial and final values by inspection.

### Energy stored

$U = \\int V\\,dQ = \\int (Q/C)\\,dQ = Q^{2}/(2C) = \\tfrac{1}{2}CV^{2}$. Exactly half the energy the battery provided goes into the capacitor; the other half is **always** dissipated in $R$, regardless of $R$'s value — a beautiful result from the charging ODE.`,
      exampleProblems: `### Forward — find $V_{C}$ at a specific time

> $R = 10\\text{ k}\\Omega$, $C = 100\\ \\mu\\text{F}$, $V_{s} = 12\\text{ V}$. Find $V_{C}$ at $t = 2\\text{ s}$.

$\\tau = RC = 10^{4} \\cdot 10^{-4} = 1\\text{ s}$. At $t = 2\\tau$: $V_{C} = 12(1 - e^{-2}) \\approx 12 \\cdot 0.865 \\approx 10.4\\text{ V}$.

### Reverse — find $RC$ from a measurement

> A capacitor charges to $63\\%$ of final voltage in $5\\text{ s}$. Find $RC$.

By definition, $63\\% = 1 - e^{-1}$, which happens at $t = \\tau = RC$. So $RC = 5\\text{ s}$.

### Classic trap — steady-state current

> In the circuit above, how much current flows through the capacitor at $t = 10\\text{ s}$?

**Essentially zero** — $10\\text{ s} = 10\\tau$, capacitor is fully charged, $dV/dt \\to 0$. Trap answer: "$V_{s}/R = 1.2\\text{ mA}$" (that's the initial current, not steady state).`,
      practiceLink: { topic: "Physics", subtopic: "Circuits" },
    },
    {
      id: "inductance-rl",
      title: "Inductance & RL Circuits",
      keyEquations: `$$V_{L} = L\\,\\frac{di}{dt} \\qquad I(t) = I_{\\infty}\\!\\left(1 - e^{-t/\\tau}\\right),\\ \\tau = \\frac{L}{R} \\qquad U_{L} = \\tfrac{1}{2} L I^{2}$$`,
      context: `An **inductor** opposes changes in current — its voltage is proportional to the rate of change of current through it. In **DC steady state** $di/dt = 0$, so $V_{L} = 0$ and the inductor behaves like a **short circuit** (a plain wire). Current rising through an RL circuit follows the same exponential shape as RC charging, with $\\tau = L/R$. **Why opening a switch on an inductive load creates an arc**: the inductor refuses to let $I$ drop instantly, so $di/dt$ spikes enormously, and $V_{L} = L\\,di/dt$ produces a huge voltage that flashes across the opening contacts.`,
      readMore: `### Derive the current rise from KVL

Battery $V_{s}$, resistor $R$, inductor $L$ in series, switch closed at $t = 0$. KVL: $V_{s} = IR + L\\,dI/dt$. First-order linear ODE:
$$I(t) = \\frac{V_{s}}{R}\\bigl(1 - e^{-Rt/L}\\bigr)$$
Time constant $\\tau = L/R$. At $t = 0$, $I = 0$ (inductor blocks instantaneous current change); at $t \\to \\infty$, $I = V_{s}/R$ (inductor looks like a wire).

### Short at steady state, open at $t = 0$

At DC steady state: $dI/dt = 0 \\Rightarrow V_{L} = 0 \\Rightarrow$ inductor looks like a **short**. At $t = 0^{+}$ with zero prior current: it looks like an **open** (refuses to change $I$ instantly). Exactly **dual** to a capacitor — flip open ↔ short, voltage ↔ current.

### The arcing-switch problem

Open the switch on a current-carrying inductor: the circuit wants $I$ to drop from $I_{0}$ to $0$ instantly. Inductor vetoes: $V = L\\,dI/dt$, and $dI/dt \\to -\\infty$ yields huge reverse voltage — enough to ionize air and sustain current as an arc. That's why inductive loads (relays, motors) need **flyback diodes** or snubber networks.

### Energy stored

$U = \\tfrac{1}{2}LI^{2}$ — stored in the inductor's magnetic field. Dropping the current to zero suddenly releases this energy somewhere (arc, flyback diode, snubber). You can't just "stop" the current.`,
      exampleProblems: `### Forward — find $I$ at a specific time

> $V_{s} = 12\\text{ V}$, $R = 4\\ \\Omega$, $L = 2\\text{ H}$. Find $I$ at $t = 1\\text{ s}$.

$\\tau = L/R = 0.5\\text{ s}$. At $t = 2\\tau$: $I = (12/4)(1 - e^{-2}) \\approx 3 \\cdot 0.865 \\approx 2.6\\text{ A}$.

### Reverse — find $L$

> In the same RL circuit, current reaches $63\\%$ of final value at $t = 0.5\\text{ s}$, with $R = 4\\ \\Omega$. Find $L$.

$63\\%$ is at $t = \\tau = L/R = 0.5 \\Rightarrow L = 2\\text{ H}$.

### Classic trap — why a motor "kicks" when unplugged

> You unplug a running motor. A blue spark flashes at the plug. Why?

The motor windings are a big inductor carrying current $I$. Breaking the circuit forces $dI/dt$ to be huge; $V_{L} = L\\,dI/dt$ spikes to hundreds or thousands of volts, enough to arc across the separating plug contacts. Same physics as the switch arc. Not a bug — it's Faraday's law refusing to be ignored.`,
      practiceLink: { topic: "Physics", subtopic: "Circuits" },
    },
    {
      id: "rlc",
      title: "Basic RLC — Natural Frequency & Damping",
      keyEquations: `$$\\omega_{0} = \\frac{1}{\\sqrt{LC}} \\qquad \\zeta = \\frac{R}{2}\\sqrt{\\frac{C}{L}}$$`,
      context: `A series RLC circuit is a **second-order system** — the canonical linear oscillator. Its undamped natural frequency is $\\omega_{0} = 1/\\sqrt{LC}$, the frequency at which energy sloshes back and forth between the inductor (magnetic) and capacitor (electric). The **damping ratio** $\\zeta$ tells you what $R$ does to that oscillation: $\\zeta < 1$ **underdamped** (oscillates, decays), $\\zeta = 1$ **critically damped** (fastest non-oscillatory settle), $\\zeta > 1$ **overdamped** (slow monotonic approach). Physical picture: $L$ and $C$ store and exchange energy; $R$ dissipates it.`,
      readMore: `### Derive the ODE from KVL

Series RLC: $V_{L} + V_{R} + V_{C} = 0$ (no source). With $I = dQ/dt$ and $V_{C} = Q/C$:
$$L\\,\\ddot Q + R\\,\\dot Q + Q/C = 0$$
Divide by $L$: $\\ddot Q + (R/L)\\dot Q + (1/LC)Q = 0$. Matches canonical form $\\ddot x + 2\\zeta\\omega_{0}\\dot x + \\omega_{0}^{2}x = 0$ with $\\omega_{0} = 1/\\sqrt{LC}$ and $\\zeta = (R/2)\\sqrt{C/L}$.

### Analog to mass-spring-damper

$L \\leftrightarrow m$, $1/C \\leftrightarrow k$, $R \\leftrightarrow b$ (damper). Every intuition you have about mechanical oscillators (period, resonance, damping) maps directly.

### Three regimes

- $\\zeta < 1$: **underdamped**, oscillates at $\\omega_{d} = \\omega_{0}\\sqrt{1 - \\zeta^{2}}$ inside a decaying envelope.
- $\\zeta = 1$: **critical**, fastest return to zero with no overshoot.
- $\\zeta > 1$: **overdamped**, exponential decay, two time constants, slow.

Design rule: $\\zeta \\approx 0.7$ is often "best" for control systems — small overshoot, fast settle.

### Resonance

Drive a series RLC at $\\omega = \\omega_{0}$ with an AC source: $L$ and $C$ cancel, impedance collapses to $R$, current peaks. Sharpness of the peak (the "Q factor") is $Q = \\omega_{0}L/R = 1/(2\\zeta)$. Used in radios, filters, and anywhere frequency selectivity matters.`,
      exampleProblems: `### Forward — find the natural frequency

> $L = 10\\text{ mH}$, $C = 1\\ \\mu\\text{F}$. Find $\\omega_{0}$ and $f_{0}$.

$\\omega_{0} = 1/\\sqrt{LC} = 1/\\sqrt{10^{-8}} = 10^{4}\\text{ rad/s}$. $f_{0} = \\omega_{0}/(2\\pi) \\approx 1.59\\text{ kHz}$.

### Reverse — find the required inductance

> Tune an RLC circuit to $\\omega_{0} = 10^{4}\\text{ rad/s}$ with $C = 1\\ \\mu\\text{F}$. Find $L$.

Invert: $L = 1/(\\omega_{0}^{2}C) = 1/(10^{8} \\cdot 10^{-6}) = 10^{-2}\\text{ H} = 10\\text{ mH}$.

### Classic trap — over- vs underdamped

> $R = 100\\ \\Omega$, $L = 10\\text{ mH}$, $C = 1\\ \\mu\\text{F}$. Underdamped?

Critical $R$ (where $\\zeta = 1$): $R_{c} = 2\\sqrt{L/C} = 2\\sqrt{10^{4}} = 200\\ \\Omega$. Actual $R = 100 < 200$, so $\\zeta < 1$ — **underdamped**. Will oscillate. Trap: eyeballing "100 is a lot of resistance" without comparing to the critical value.`,
      practiceLink: { topic: "Physics", subtopic: "Circuits" },
    },
    {
      id: "ph",
      title: "Chemistry — pH",
      keyEquations: `$$\\mathrm{pH} = -\\log_{10}[\\mathrm{H}^{+}] \\qquad [\\mathrm{H}^{+}][\\mathrm{OH}^{-}] = 10^{-14}\\ \\text{M}^{2}\\ (25^{\\circ}\\!\\text{C})$$`,
      context: `pH is a **log scale** measuring hydrogen-ion concentration in molar units. Scale 0 to 14: $\\mathrm{pH} = 7$ is neutral, $< 7$ acidic, $> 7$ basic. Each whole-number step is a **tenfold** change in $[\\mathrm{H}^{+}]$. An **acid** donates $\\mathrm{H}^{+}$; a **base** accepts $\\mathrm{H}^{+}$ (or equivalently donates $\\mathrm{OH}^{-}$). Pure water self-ionizes into equal parts $\\mathrm{H}^{+}$ and $\\mathrm{OH}^{-}$, giving $\\mathrm{pH} = 7$.`,
      readMore: `### Why pH is a log scale

$[\\mathrm{H}^{+}]$ in real solutions spans fifteen orders of magnitude — $1\\text{ M}$ acid to $10^{-14}\\text{ M}$ lye. A linear scale would be useless. Taking $-\\log_{10}$ compresses this into $0$ to $14$.

### Pure water

$K_{w} = [\\mathrm{H}^{+}][\\mathrm{OH}^{-}] = 10^{-14}$ at $25°C$. Pure water self-ionizes so $[\\mathrm{H}^{+}] = [\\mathrm{OH}^{-}] = 10^{-7}\\text{ M} \\Rightarrow \\mathrm{pH} = 7$. Raise temperature: $K_{w}$ grows, neutral pH drops below $7$ — neutrality tracks temperature even though "neutral" still means $[\\mathrm{H}^{+}] = [\\mathrm{OH}^{-}]$.

### pOH and quick math

$\\mathrm{pOH} = -\\log[\\mathrm{OH}^{-}]$, and $\\mathrm{pH} + \\mathrm{pOH} = 14$ at $25°C$. So $\\mathrm{pH} = 10$ means $[\\mathrm{OH}^{-}] = 10^{-4}\\text{ M}$ — useful shortcut for basic solutions.

### Strong vs weak

**Strong acids** (HCl, $\\mathrm{HNO_{3}}$, $\\mathrm{H_{2}SO_{4}}$) fully dissociate: $0.01\\text{ M HCl}$ gives $\\mathrm{pH} = 2$ exactly. **Weak acids** (acetic, carbonic) dissociate partially, and $\\mathrm{pH}$ depends on the acid-dissociation constant $K_{a}$. Reactor primary coolant chemistry (NUPOC-relevant) uses boric acid, a weak acid — intentional for controllability.`,
      exampleProblems: `### Forward — pH of a dilute strong acid

> $0.001\\text{ M HCl}$. Find pH.

Strong acid fully dissociates: $[\\mathrm{H}^{+}] = 10^{-3}\\text{ M} \\Rightarrow \\mathrm{pH} = 3$.

### Reverse — find the concentration

> A solution has $\\mathrm{pH} = 5$. Find $[\\mathrm{H}^{+}]$ and $[\\mathrm{OH}^{-}]$.

$[\\mathrm{H}^{+}] = 10^{-5}\\text{ M}$. $[\\mathrm{OH}^{-}] = 10^{-14}/10^{-5} = 10^{-9}\\text{ M}$.

### Classic trap — "adding water makes it neutral"

> What's the pH of $10^{-8}\\text{ M}$ HCl?

Not $\\mathrm{pH} = 8$ — that would be basic, absurd for an acid! At such low concentration, water's own $\\mathrm{H}^{+}$ ($10^{-7}$) dominates, so $\\mathrm{pH}$ is slightly below $7$ (≈$6.98$). Diluting acid approaches neutral **from below**; it never crosses $7$.`,
    },
    {
      id: "ideal-gas",
      title: "Chemistry — Ideal Gas Law",
      keyEquations: `$$P V = n R T \\qquad R \\approx 8.314\\ \\tfrac{\\text{J}}{\\text{mol}\\cdot\\text{K}}$$

$$\\text{Isothermal: } P_{1} V_{1} = P_{2} V_{2} \\quad \\text{Isobaric: } \\frac{V_{1}}{T_{1}} = \\frac{V_{2}}{T_{2}} \\quad \\text{Isochoric: } \\frac{P_{1}}{T_{1}} = \\frac{P_{2}}{T_{2}}$$`,
      context: `The ideal gas law ties together $P$, $V$, $n$ (moles), and $T$ (in **absolute** units — always convert Celsius to Kelvin first by adding $273$). Three special cases are named: hold $T$ fixed to get **Boyle's Law**, hold $P$ fixed to get **Charles's Law**, hold $V$ fixed to get **Gay-Lussac's Law**. Real gases approach ideal behavior at low pressure and high temperature, where intermolecular forces and molecular volume are negligible.`,
      readMore: `### Always use Kelvin

$T$ in $PV = nRT$ is **absolute**. Doubling $T$ from $27°C$ to $54°C$ does **not** double the pressure — because in Kelvin that's $300 \\to 327$, an 9% rise. Forgetting to convert is the #1 error.

### Classify the process first

Before writing any equation, ask: which variable is held fixed?
- **Isothermal** ($T$ fixed): $PV$ = const, so $P_{1}V_{1} = P_{2}V_{2}$. Tire letting air out slowly.
- **Isobaric** ($P$ fixed): $V/T$ = const. Piston with a weight on top, warmed.
- **Isochoric** ($V$ fixed): $P/T$ = const. Sealed rigid tank, warmed.
- **Adiabatic** (no heat exchange): $PV^{\\gamma}$ = const. Fast compression.

### How big is a mole at STP?

At $0°C$ and $1\\text{ atm}$: $V = 22.4\\text{ L/mol}$. Handy anchor when you need a rough volume from moles.

### When ideal breaks

High pressure (molecules crowded — their own volume matters). Low temperature (intermolecular attractions start to matter, on the way to condensation). Real gases: van der Waals $[P + a(n/V)^{2}](V - nb) = nRT$.

### Relevance to reactors

Primary coolant in a PWR is liquid water — not a gas. But pressurizer steam bubble is ideal-gas-adjacent, and safety analyses for containment pressure during LOCA use gas-law arguments constantly. NUPOC interviews probe the law because it's the foundational thermodynamic identity.`,
      exampleProblems: `### Forward — sealed tank heated

> Sealed rigid tank at $27°C$, $100\\text{ kPa}$. Heat to $327°C$. Final pressure?

Isochoric. Convert: $T_{1} = 300\\text{ K}$, $T_{2} = 600\\text{ K}$. $P_{2} = P_{1} \\cdot T_{2}/T_{1} = 100 \\cdot 2 = 200\\text{ kPa}$.

### Reverse — find required heating

> Sealed tank starts at $27°C$, $100\\text{ kPa}$. You want to raise pressure to $150\\text{ kPa}$. Find the final temperature.

Invert: $T_{2} = T_{1}(P_{2}/P_{1}) = 300 \\cdot 1.5 = 450\\text{ K} = 177°C$.

### Classic trap — Celsius in the ratio

> Tank goes from $100°C$ to $200°C$ at constant volume, initial pressure $100\\text{ kPa}$. Final pressure?

Correct: $T_{1} = 373$, $T_{2} = 473$. $P_{2} = 100 \\cdot 473/373 \\approx 127\\text{ kPa}$. **Trap**: using $200/100 = 2$, giving $200\\text{ kPa}$ — that's what ratio-in-Celsius predicts, but it's **wrong by about $60\\%$**. Kelvin is non-negotiable.`,
    },
  ],
}

/**
 * Total segment count across all sections. Exported for the verification script
 * that audits coverage against NUPOC Topics to Study.docx bullets.
 */
export const TOTAL_SEGMENTS = SECTION_ORDER.reduce(
  (sum, section) => sum + TEACH_CONTENT[section].length,
  0,
)
