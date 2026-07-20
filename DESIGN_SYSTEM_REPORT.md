# LayoverX Design System Report

## Overview

A unified, enterprise-grade visual system has been established across the entire LayoverX website. The system is defined in two core CSS files:

- `frontend/css/design-system.css` — tokens and component base styles
- `frontend/css/global-overrides.css` — enforcements that override Tailwind and page-level inconsistencies

## Typography

| Token | Size | Usage |
|-------|------|-------|
| Hero Heading | 64px desktop / 56px laptop / 44px tablet / 34px mobile | `h1`, page heroes |
| Section Heading | 48px desktop / 40px laptop / 34px tablet / 28px mobile | `h2`, section titles |
| Sub Heading | 28px | `h3`, card titles, feature headings |
| Body Text | 20px | Primary marketing/content paragraphs |
| Secondary Text | 18px | Card descriptions, form inputs |
| Caption | 16px | Labels, badges, metadata |
| Small Text | 14px | UI chrome, nav links, buttons |

- Font family: Inter (weights 300–900)
- Heading line height: 1.15
- Paragraph line height: 1.7
- Letter spacing: -0.02em to -0.03em on headings for tighter, premium feel

## Color Palette

| Role | Token | Value |
|------|-------|-------|
| Primary Blue | `--primary` | `#0369a1` |
| Premium Blue | `--premium-blue` | `#0A84FF` |
| Dark Navy | `--secondary` | `#0F172A` |
| Background White | `--surface-elevated` | `#FFFFFF` |
| Light Background | `--surface` | `#F8FAFC` |
| Muted Text | `--text-muted` | `#64748B` |
| Primary Text | `--text-primary` / `--heading-color` | `#0F172A` |
| Success | `--success` | `#059669` |
| Warning | `--warning` | `#D97706` |
| Error | `--danger` / `--error` | `#DC2626` |

All text meets WCAG AA contrast requirements. Dark overlays are automatically applied to hero images via `theme-hero` and gradient layers.

## Spacing Scale

| Token | Value |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 24px |
| `--space-6` | 32px |
| `--space-7` | 40px |
| `--space-8` | 48px |
| `--space-9` | 64px |
| `--space-10` | 80px |
| `--space-11` | 96px |
| `--space-12` | 120px |

Section vertical spacing:
- Mobile: 80px
- Tablet: 96px
- Desktop: 120px

## Containers

| Property | Value |
|----------|-------|
| Maximum width | 1280px (`80rem`) |
| Content width | 1200px (`75rem`) |
| Side padding mobile | 24px |
| Side padding tablet | 40px |
| Side padding desktop | 64px |

## Buttons

One button system with four variants:

| Variant | Style |
|---------|-------|
| Primary | Blue background, white text, premium shadow |
| Secondary | Dark navy background, white text |
| Outline | Transparent background, blue border, blue text |
| Ghost | Transparent background, dark text |

- Height: 52px (default)
- Border radius: 14px
- Font size: 14px
- Font weight: 600
- Hover: translateY(-2px) + stronger shadow

## Cards

One unified card style:

- Background: white
- Border: 1px solid `rgba(148, 163, 184, 0.22)`
- Border radius: 20px
- Shadow: `0 4px 24px rgba(0,0,0,0.06)`
- Hover: translateY(-4px) + `0 10px 30px rgba(0,0,0,0.08)`
- Image ratio: 16:9 for hero/thumbnail images
- Inner padding: 24px desktop / 24px mobile

## Sections

Every section uses:
- Consistent top/bottom spacing (80/96/120px)
- Container max-width 1280px
- Section headings with 24px bottom margin
- Paragraphs with 32px bottom margin
- Card grids with 32px gap

## Animations

- Card hover: 0.2s cubic-bezier(0.4, 0, 0.2, 1)
- Button hover: 0.2s ease
- Focus outlines: 3px solid premium-blue at 45% opacity
- `.reveal` scroll animations preserved

## Enforcement Strategy

Because the site mixes Tailwind utilities, inline styles, and legacy classes, `global-overrides.css` uses targeted `!important` rules to collapse inconsistencies without rewriting HTML:

- Heading sizes override any Tailwind `text-*` utility
- Body/secondary/caption/small sizes override text utilities
- Card styles override `rounded-*`, `shadow-*`, and border utilities
- Button styles enforce consistent height, radius, and padding
- Color collapse maps `text-gray-*` / `text-slate-*` to design-system roles
- Background collapse maps gray/slate/tint backgrounds to `--surface-2`

## Files

- `frontend/css/design-system.css`
- `frontend/css/global-overrides.css`
- `frontend/css/card.css` (component reference, aligned with tokens)

## Validation

- 29 pages audited
- 0 accessibility issues remaining
- Screenshots captured at 375px, 768px, 1280px, and 1920px
- No horizontal overflow detected
- Consistent heading hierarchy restored
- All buttons have explicit `type` attributes
