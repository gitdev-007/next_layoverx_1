# LAYOVERX UI Standard Document

This document serves as the single source of truth for the LayoverX design language. It is derived from the existing production codebase (`design-system.css` and `global-overrides.css`) and the computed styles of the live deployment.

---

## 1. Layout & Containers

### 1.1 Containers
- **Max Width:** `80rem` (1280px)
- **Alignment:** Centered (`margin-left: auto`, `margin-right: auto`)
- **Horizontal Padding:**
  - **Mobile (< 640px):** `var(--space-4)` (16px)
  - **Tablet (640px - 1023px):** `var(--space-5)` (24px)
  - **Desktop (≥ 1024px):** `var(--space-6)` (32px)

### 1.2 Section Spacing
All main content sections use the `.section` class to maintain vertical rhythm.
- **Vertical Padding (Symmetric):**
  - **Mobile:** `var(--section-y-sm)` (72px)
  - **Tablet (≥ 768px):** `var(--section-y-md)` (88px)
  - **Desktop (≥ 1024px):** `var(--section-y-lg)` (104px)

### 1.3 Grid & Spacing
- **Base Grid:** 8px / 4px increments.
- **Common Gaps:**
  - `gap-2`: 0.5rem (8px)
  - `gap-3`: 0.75rem (12px)
  - `gap-4`: 1rem (16px)
  - `gap-6`: 1.5rem (24px)
  - `gap-8`: 2.25rem (36px)
- **Stacking:** `space-y-X` used for vertical content flow.

---

## 2. Typography

### 2.1 Type Scale
All headings use `font-family: var(--font-primary)` ("Inter").

| Role | Size (px) | REM / Clamp | Weight | Line Height |
|---|---|---|---|---|
| **H1 (Display)** | 40px | `clamp(2rem, 4.5vw, 2.5rem)` | 800 | 1.12 |
| **H2 (Section)** | 32px | `clamp(1.625rem, 3.2vw, 2rem)` | 800 | 1.25 |
| **H3 (Card/Sub)** | 22px | `1.375rem` | 700 | 1.35 |
| **H4 (Label)** | 18px | `1.125rem` | 700 | 1.4 |
| **Body** | 17px | `1.0625rem` | 400 | 1.7 |
| **Small / UI** | 15px | `0.9375rem` | 400 | 1.55 |
| **Caption** | 13px | `0.8125rem` | 500 | 1.45 |

### 2.2 Color Mapping
- **Headings:** `var(--heading-color)` (#0f172a)
- **Body Copy:** `var(--body-color)` (#334155)
- **Muted Text:** `var(--text-muted)` (#475569)
- **On-Dark Text:** `var(--text-on-dark)` (#f8fafc)

---

## 3. Components

### 3.1 Buttons
All buttons must adhere to the tap-target minimum height of 40px.

| Size | Min-Height | Padding (Y X) | Font Size |
|---|---|---|---|
| **Small (`.btn-sm`)** | 2.5rem (40px) | 0.625rem 1.125rem | 13px |
| **Medium (`.btn`)** | 3rem (48px) | 0.875rem 1.75rem | 15px |
| **Large (`.btn-lg`)** | 3.25rem (52px) | 1rem 2rem | 17px |

- **Border Radius:** `var(--btn-radius)` (12px)
- **Primary Style:** `background: var(--primary)`, `color: #fff`, `shadow-md`
- **Secondary Style:** `background: #fff`, `border: 2px solid var(--primary)`, `color: var(--primary)`
- **Ghost Style:** `background: transparent`, `color: var(--text)`

### 3.2 Cards
- **Border Radius:** `1.25rem` (20px)
- **Background:** `var(--surface-elevated)` (#ffffff)
- **Border:** `1px solid var(--border)` (#e2e8f0)
- **Shadow:** `var(--shadow-sm)` (base) $\to$ `var(--shadow-lg)` (hover)
- **Internal Padding:** `1.5rem` (mobile) $\to$ `1.75rem` (tablet/desktop)

### 3.3 Forms
- **Input Height:** Min-height `2.75rem` (44px)
- **Border Radius:** `0.75rem` (12px)
- **Border Color:** `var(--border)` (#e2e8f0)
- **Focus State:** `outline: 3px solid rgba(3, 105, 161, 0.45)`
- **Label Spacing:** `margin-bottom: 1.5rem` (token based)

---

## 4. Visual Identity

### 4.1 Colors
| Token | Value | Usage |
|---|---|---|
| `--primary` | `#0369a1` | Brand primary, buttons, active links |
| `--primary-dark` | `#075985` | Hover states, deep accents |
| `--primary-light` | `#7dd3fc` | Accent highlights, borders |
| `--secondary` | `#0f172a` | Dark accents, deep backgrounds |
| `--surface` | `#f8fafc` | Main page background (Slate-50) |
| `--surface-2` | `#f1f5f9` | Secondary surfaces, card bg alternatives |
| `--surface-elevated`| `#ffffff` | Pure white, card backgrounds |
| `--border` | `#e2e8f0` | Dividers, input borders, card borders |
| `--text-primary` | `#0f172a` | Headings, high-emphasis text |
| `--body-color` | `#334155` | Long-form paragraphs, descriptions |
| `--text-muted` | `#475569` | Captions, labels, placeholder text |

### 4.2 Elevation (Shadows)
- **Sm:** `0 1px 2px rgba(0, 0, 0, 0.06)` (Subtle borders/dividers)
- **Md:** `0 4px 6px -1px rgba(0, 0, 0, 0.1)` (Standard cards)
- **Lg:** `0 10px 15px -3px rgba(0, 0, 0, 0.1)` (Hover states/floating elements)
- **Xl:** `0 20px 25px -5px rgba(0, 0, 0, 0.1)` (Modals, hero CTAs)

---

## 5. Interaction & Motion

### 5.1 Transitions
- **Standard:** `all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`
- **Hover Effects:** `translateY(-2px)` or `translateY(-4px)` for lift
- **Modals:** `scale-95` $\to$ `scale-100` with `opacity-0` $\to$ `opacity-100`

### 5.2 States
- **Hover:** Change background to `--primary-dark` or increase shadow elevation.
- **Focus:** High-contrast outline (3px sky-blue) for keyboard accessibility.
- **Loading:** `shimmer` animation (linear-gradient 90deg) for skeleton images.

---

## 6. Responsive Breakpoints

| Level | Breakpoint | Application |
|---|---|---|
| **Mobile** | $< 640\text{px}$ | Single column layouts, hamburger menu, 16px container padding |
| **Tablet** | $640\text{px} - 1023\text{px}$ | 2-column grids, expanded nav items, 24px container padding |
| **Desktop** | $\ge 1024\text{px}$ | Multi-column layouts (3+), full navigation, 32px container padding |

---

## 7. Implementation Checklist for Future Fixes
- [ ] Does the element use a `var(--font-size-*)` or `var(--space-*)` token?
- [ ] Is the tap target $\ge 40\text{px}$ height?
- [ ] Does the color map to one of the 5 defined brand colors?
- [ la ] Is the border-radius consistent (12px for buttons/small cards, 20px for main cards)?
- [ ] Does it snap to the 8-px grid (divisible by 4, preferably 8)?
- [ ] Is the typography using the `main` scope overrides for headings?
