# LayoverX Design System (Product Redesign v1)

This document serves as the absolute source of truth for the visual redesign of `index.html`. The goal is a professional, high-end "SaaS-like" aesthetic (Stripe/Linear/Vercel) focusing on precision, whitespace, and high-contrast typography.

## 1. Visual DNA
- **Core Philosophy**: Minimalist, high-precision, depth-based.
- **Vibe**: Trustworthy, efficient, premium.
- **Grid**: Strict 8px baseline. All margins and paddings are multiples of 8px (e.g., 8, 16, 24, 32, 48, 64, 80, 96).

## 2. Color Palette
| Token | Hex | Usage |
|---|---|---|
| `--brand-primary` | `#0284C7` | Primary CTAs, active states, accents (Vivid Sky Blue) |
| `--brand-navy` | `#0F172A` | Headings, Dark Mode backgrounds, High-contrast text |
| `--surface-base` | `#FFFFFF` | Main page background |
| `--surface-alt` | `#F9FAFB` | Section alternates, subtle backgrounds (Gray-50) |
| `--surface-neutral` | `#F3F4F6` | Input backgrounds, hover states (Gray-100) |
| `--border-light` | `#E5E7EB` | Thin dividers, input borders (Gray-200) |
| `--text-main` | `#111827` | Primary body and heading text (Gray-900) |
| `--text-muted` | `#6B7280` | Secondary text, captions (Gray-500) |
| `--text-on-primary`| `#FFFFFF` | Text on primary buttons |

## 3. Typography (Inter System)
*All headings use `tracking-tighter` (-0.04em) for a premium look.*

| Role | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| **Display H1** | `4rem` (64px) | Bold (700) | 1.1 | Hero main headline |
| **Section H2** | `2.25rem` (36px) | Bold (700) | 1.2 | Section titles |
| **Component H3**| `1.25rem` (20px) | SemiBold (600) | 1.3 | Card titles, subsection headers |
| **Body** | `1rem` (16px) | Regular (400) | 1.6 | Paragraphs, lists |
| **UI Small** | `0.875rem` (14px) | Medium (500) | 1.5 | Tab labels, small UI text |
| **Caption** | `0.75rem` (12px) | SemiBold (600) | 1.4 | Uppercase labels, badges |

## 4. Geometry & Depth
### Border Radius
- **Small**: `6px` (Inputs, small tags)
- **Medium**: `12px` (Buttons, small cards)
- **Large**: `24px` (Main sections, large cards, search bar)

### Shadows (The Depth System)
- `depth-1` (Flat): `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- `depth-2` (Elevated): `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`
- `depth-3` (Floating): `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`

## 5. Component Hierarchy
### Buttons
- **Primary**: Solid `--brand-primary`, white text, `depth-2` shadow.
- **Secondary**: White background, `--brand-primary` border (1px), `--brand-primary` text.
- **Ghost**: Transparent background, `--text-muted` text, hover: `--surface-neutral`.

### Containers
- **Max Width**: `1280px`
- **Horizontal Padding**: `24px` (Mobile) $\to$ `48px` (Desktop)
- **Section Vertical Padding**: `96px` (Desktop) $\to$ `64px` (Mobile)
