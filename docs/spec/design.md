# Design System Strategy: The Methodical Architect

## 1. Overview & Creative North Star

The "Methodical Architect" is a design system built for the high-stakes world of Product Management career navigation. Moving beyond the "generic SaaS" look, this system adopts an **Editorial Precision** aesthetic. It is inspired by the clarity of Notion and the high-performance utility of Linear, but refined through a lens of senior-level authority.

**The Creative North Star: "Quiet Authority."**

This system rejects the "loud" patterns of gamification. It treats the user’s career as a serious, architectural undertaking. We break the "template" look by using **expansive white space**, **intentional asymmetry** in dashboard layouts, and **tonal layering** instead of structural lines. Every element must feel like it was placed with a Product Manager’s sense of priority: essential, high-impact, and devoid of noise.

---

## 2. Colors

Our palette is anchored in intellectual depth. The deep indigo provides a sense of stable legacy, while the warm amber acts as a surgical tool for attention—used only for critical milestones and primary calls to action.

### The "No-Line" Rule

Standard 1px borders are strictly prohibited for sectioning. We define boundaries through **Background Color Shifts**. To separate a sidebar from a main feed, transition from `surface` (#f8f9fa) to `surface-container-low` (#f3f4f5). This creates a sophisticated "wash" of color that feels more premium than a rigid line.

### Surface Hierarchy & Nesting

Treat the UI as a series of stacked, fine-paper sheets.

- **Base Layer:** `surface` (#f8f9fa)

- **Content Sections:** `surface-container-low` (#f3f4f5)

- **Interactive Cards:** `surface-container-lowest` (#ffffff)

This "recessed" nesting (placing a bright white card inside a slightly darker off-white container) creates natural depth without visual clutter.

### The "Glass & Elevation" Rule

For floating elements like dropdowns or navigation bars, utilize **Glassmorphism**. Use `surface-container-lowest` at 80% opacity with a `20px` backdrop-blur. This allows the primary indigo and secondary amber accents to softly bleed through, making the interface feel integrated and fluid.

---

## 3. Typography: The Inter Hierarchy

We use a single typeface—**Inter**—but we utilize its full variable weight range to create an editorial feel.

- **Display (Editorial Impact):** Use `display-md` (2.75rem) for hero moments. Set it to a Tight tracking (-0.02em) to give it a "custom-type" look.

- **Headlines (The Roadmap):** `headline-sm` (1.5rem) should be Medium weight. This is the PM’s "North Star" for each page.

- **Titles (The Tasks):** `title-md` (1.125rem) in Semibold provides a clear anchor for card content.

- **Body (The Detail):** `body-md` (0.875rem) is our workhorse. Use a generous line-height (1.6) to ensure long-form career strategy is readable.

- **Labels (The Metadata):** `label-md` (0.75rem) in Medium weight, All-Caps with +0.05em tracking for a "utility-chic" look in tags and chips.

---

## 4. Elevation & Depth

We eschew traditional drop shadows for **Tonal Layering**.

- **The Layering Principle:** Place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` (#f3f4f5) background. The contrast in hex values provides the "lift" naturally.

- **Ambient Shadows:** For high-priority floating elements (e.g., a Career Roadmap Modal), use an extra-diffused shadow: `0 20px 40px rgba(70, 69, 85, 0.06)`. This uses the `on-surface-variant` color as a tint, mimicking natural light rather than a "black" shadow.

- **The Ghost Border:** If a form field needs a container, use the `outline-variant` token at **15% opacity**. This "Ghost Border" provides a hint of structure without breaking the minimalist aesthetic.

---

## 5. Components

### Buttons

- **Primary:** Fully rounded (`full`). Background: `primary` (#3525cd). Text: `on-primary` (#ffffff). Use for the "Main Career Objective."

- **Secondary:** Fully rounded (`full`). Background: `secondary-fixed` (#ffddb8). Text: `on-secondary-fixed` (#2a1700). For supportive actions.

- **Tertiary:** Text-only with a 4px bottom-border on hover using `primary-fixed`.

### Cards & Lists

- **Standard Card:** `12px` (default) border radius. Background: `surface-container-lowest`. No borders.

- **The No-Divider Rule:** Forbid 1px horizontal lines between list items. Use **Spacing Scale 4 (1rem)** of vertical white space or a subtle hover state shift to `surface-container` (#edeeef) to define rows.

### Input Fields

- **State:** Default uses the "Ghost Border" (15% `outline-variant`).

- **Focus:** Transition to a 2px `primary` bottom-border. This mimics the "minimalist editor" feel of Notion.

### Career Roadmap Timeline (Custom Component)

Instead of a heavy line, use a series of `primary` dots connected by `outline-variant` dashes at 30% opacity. This feels light, technical, and precise.

---

## 6. Do’s and Don’ts

### Do:

- **Use Asymmetry:** Place your primary navigation on the left with a wide, generous right-side gutter for "Focus Mode."

- **Embrace White Space:** If you think a section needs more breathing room, double the spacing token. PMs value clarity above all else.

- **Subtle Interaction:** Animate state changes (hover, focus) with a 200ms "Ease-Out" to maintain a premium, responsive feel.

### Don’t:

- **No Opaque Borders:** Never use a 100% opaque border to separate content. It creates "visual noise" that contradicts the premium aesthetic.

- **No Pure Black:** Always use `on-surface` (#191c1d) for text. Pure black (#000000) is too harsh for an editorial experience.

- **No Gamification:** Avoid progress bars with bright gradients or "level-up" badges. Use the `secondary` amber for data-driven milestones only.
