# LayoverX Index Page Implementation Plan

This plan outlines the visual redesign of `index.html` following the **Horizon Design System** defined in `LAYOUT_DESIGN_SYSTEM.md`.

## Core Design Principles
- **Strict 8px Baseline**: All margins, paddings, and spacing are multiples of 8.
- **High Contrast Typography**: Bold headings with `tracking-tighter` and clean, muted body text.
- **Depth & Dimension**: Transition from "flat" designs to a system of subtle shadows (`depth-1`, `depth-2`, `depth-3`).
- **Precision Geometry**: Consistent use of `rounded-lg` (6px), `rounded-xl` (12px), and `rounded-3xl` (24px).

---

## Section-by-Section Breakdown

### 1. Navigation (Navbar)
- **Current Problems**: Variable heights, inconsistent padding, generic rounded corners, lack of structural depth.
- **Target Design**: A floating "glass" island navigation. Semi-transparent white background with a thin `slate-200` border and `depth-1` shadow.
- **Files to edit**: `frontend/index.html`
- **CSS classes to modify**: `nav`, `#navbar`, `#nav-container`, `.nav-link`, `.plan-my-layover-btn`
- **Estimated changes**: 
    - Update container to floating pill shape.
    - Refine typography for links (UI Small, SemiBold).
    - Standardize button radius to `rounded-lg`.

### 2. Hero Section
- **Current Problems**: Overly heavy gradients, dated "reveal" animations, mismatched text weights, generic button styles.
- **Target Design**: High-impact cinematic section. Use a refined `slate-900` to `transparent` gradient overlay. Typography follows "Display H1" (64px) for the main headline with extreme `tracking-tighter`.
- **Files to edit**: `frontend/index.html`
- **CSS classes to modify**: `#hero-section`, `h1`, `p` (hero), `.reveal`
- **Estimated changes**: 
    - Rewrite H1 to use the a a two-tone color approach (Slate-900/Sky-600).
    - Redesign "Stat Badges" to be minimal, border-based pills rather than heavy glass boxes.
    - Shift CTA buttons to follow the Primary/Secondary hierarchy (Solid Sky-600 / Outline White).

### 3. Quick Search
- **Current Problems**: Clunky input boxes, inconsistent spacing, "template" feel, lack of focus states.
- **Target Design**: A precision-engineered search "module". Use `rounded-3xl` for the main container with `depth-2` shadow. Inputs use `surface-neutral` backgrounds with a a 1px `border-light` that glows Sky-600 on focus.
- **Files to edit**: `frontend/index.html`
 la
- **CSS classes to modify**: `#search`, `#search-tabs`, `#search-fields`, `input`, `select`, `#search-btn`
- **Estimated changes**: 
    - Redesign tab navigation to use an "active indicator" (bottom bar) rather than just background changes.
    - Implement a strict 8px grid for the search grid.
    - Update the "Calculated Layover" badge to look like a professional status indicator.

### 4. Popular Categories Carousel
- **Current Problems**: Generic card layout, inconsistent image aspect ratios, poor typography hierarchy in cards.
- **Target Design**: Editorial-style grid. Cards use `rounded-2xl`, white backgrounds, and a a very subtle `border-slate-100`. Images use a consistent 3:2 aspect ratio with a clean transition on hover.
- **Files to edit**: `frontend/index.html`
- **CSS classes to modify**: `#categories`, `.carousel-item`, `.card`, `h3` (category)
- **Estimated changes**: 
    - Replace generic "Explore" links with a minimalist arrow-icon link (`UI Small`).
    - Align typography to "Component H3" (20px SemiBold).
    - Clean up carousel navigation buttons to be minimal white circles with `depth-1`.

### 5. Featured Experiences
- **Current Problems**: Mixed styles between category cards and experience cards, cluttered badges (Inside T2, etc.), poor price display.
- **Target Design**: High-trust product cards. Focus on a a "Clean Product" look. Badges use a a muted `slate-100` background with `slate-600` text for non-essential info, and `emerald-50` for ratings.
- **Files to edit**: `frontend/index.html`
- **CSS classes to modify**: `#experiences`, `.carousel-item`, `.card`, `.price-tag`
- **Estimated changes**: 
    - Standardize the rating pill (SaaS style: small, clean, high-contrast).
    - Align price text to "UI Small" (Bold) for clarity.
    - Improve the "Book" button to be a high-contrast `rounded-lg` primary action.

### 6. How It Works
- **Current Problems**: Clunky numeric circles, generic layout, lacks "process" flow visual cues.
- **Target Design**: Linear process flow. Replace heavy numbers with a a refined "Step Indicator" system. Use a a light `slate-50` background to separate the section.
- **Files to edit**: `frontend/index.html`
- **CSS classes to modify**: `#how-it-works`, `.step-number`, `h3` (step)
- **Estimated changes**: 
    - Implement a a a thin connecting line between steps (Desktop).
    - Update step numbers to use `brand-navy` with a a subtle `sky-50` glow.
    - Align text to "Body" (16px) for maximum readability.

### 7. Testimonials
- **Current Problems**: Generic card layout, inconsistent avatar styles, lacks a a "social proof" feel.
- **Target Design**: A a a "Wall of Love" grid. Use `depth-1` white cards with a a a very generous padding (32px). Avatars are standardized circles with a a a thin white border.
- **Files to edit**: `frontend/index.html`
- **CSS classes to modify**: `#testimonials`, `.card`, `.testimonial-avatar`
- **Estimated changes**: 
    - Typography for quotes uses a a slightly lighter weight for a a modern, airy feel.
    - Standardize the 5-star rating to use a a a consistent gold color (`#FBBF24`).

### 8. Call to Action (CTA)
- **Current Problems**: Generic gradient, lacks a a focal point, feels disconnected from the rest of the page.
- **Target Design**: A a "Command Center" footer CTA. Use a a a solid `brand-navy` background with a a subtle `sky-500` accent glow. Text is high-contrast white.
- **Files to edit**: `frontend/index.html`
- **CSS classes to modify**: `section.cta`, `h2` (cta)
- **Estimated changes**: 
    - Replace the generic gradient with a a structured dark-theme block.
    - Update buttons to Primary (White) and Secondary (Ghost) for clear hierarchy.
    - Add a a a minimalist "footer" line with copyright and links below it.
