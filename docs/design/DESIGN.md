---
version: alpha
name: ChoreChartEasy Kitchen Table Utility
description: Warm paper-first family utility with a dominant editable chart and restrained print-workbook details.
colors:
  canvas: "#F6F1E7"
  paper: "#FFFDF8"
  ink: "#17313A"
  muted: "#5B6B70"
  primary: "#1F6D62"
  primary-hover: "#17574F"
  action: "#C9432B"
  action-hover: "#B83A25"
  highlight: "#E9B949"
  border: "#C9D7D1"
  border-strong: "#8FA9A0"
  info-bg: "#E8F2EF"
  warning-bg: "#FFF4D6"
  error: "#A62F28"
  error-bg: "#FBEAE7"
  success: "#236B4B"
  success-bg: "#E4F3EA"
  white: "#FFFFFF"
typography:
  display-xl:
    fontFamily: Bricolage Grotesque
    fontSize: 4rem
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.04em"
  display-mobile:
    fontFamily: Bricolage Grotesque
    fontSize: 2.5rem
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  h2:
    fontFamily: Bricolage Grotesque
    fontSize: 2.5rem
    fontWeight: 650
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  h3:
    fontFamily: Bricolage Grotesque
    fontSize: 1.5rem
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  body-lg:
    fontFamily: Atkinson Hyperlegible
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
  body-md:
    fontFamily: Atkinson Hyperlegible
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0em"
  body-sm:
    fontFamily: Atkinson Hyperlegible
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0em"
  label:
    fontFamily: Atkinson Hyperlegible
    fontSize: 0.875rem
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0.015em"
rounded:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  pill: 999px
spacing:
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  6: 24px
  8: 32px
  12: 48px
  16: 64px
  24: 96px
layout:
  content-max: 1180px
  text-max: 720px
  gutter-desktop: 24px
  gutter-mobile: 16px
  header-height: 72px
  touch-min: 44px
  desktop-breakpoint: 1024px
  tablet-breakpoint: 768px
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: 12px
    height: 48px
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: 12px
    height: 48px
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: 12px
    height: 48px
  button-tool:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: 12px
    height: 48px
  input-default:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: 12px
    height: 48px
  callout-info:
    backgroundColor: "{colors.info-bg}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: 16px
  callout-warning:
    backgroundColor: "{colors.warning-bg}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: 16px
---

## Overview

ChoreChartEasy uses **Kitchen Table Utility**: a warm, paper-first interface that feels like a thoughtfully designed family workbook, not a SaaS dashboard or children's entertainment product. The product itself—the editable chore chart and its real Letter/A4 print output—is the hero visual.

The brand is practical, warm, clear, and adult-facing. Small print-workbook details such as registration marks, checkboxes, thin rules, paper corners, and section tabs create identity without decorative noise.

## Colors

- **Canvas (`#F6F1E7`)** creates a warm paper environment without appearing yellow or aged.
- **Paper (`#FFFDF8`)** is used for the editor, printable previews, inputs, and primary reading surfaces.
- **Ink (`#17313A`)** replaces generic black and creates strong contrast on Canvas and Paper.
- **Primary (`#1F6D62`)** is used for tool state, selected controls, links, and trust-building accents.
- **Action (`#C9432B`)** is reserved for the highest-emphasis conversion action. White text reaches WCAG AA for normal text.
- **Highlight (`#E9B949`)** marks labels, paper tabs, and active steps. Use Ink text on it.
- Color never communicates status alone; pair it with text and SVG icons.
- The print stylesheet removes nonessential backgrounds and remains usable in grayscale.

## Typography

- **Bricolage Grotesque** is the display face. Its slight irregularity feels authored and friendly while remaining adult-facing.
- **Atkinson Hyperlegible** is the body and UI face. It supports dense forms, tables, helper text, and accessible reading.
- H1 is left-aligned and limited to three lines on desktop and three lines on mobile. Do not center all headings.
- Use sentence case. Avoid all-caps except short evidence labels such as `BETA` and `PLANNED · NO CHARGE TODAY`.
- Load only the weights actually used. Prefer self-hosting or Google Fonts with documented licenses and a system-font fallback.

## Layout

- Maximum content width is `1180px`; long-form text stays within `720px`.
- Desktop hero uses an asymmetric 48/52 split: message left, real product preview right.
- The maker begins in or directly below the first viewport. Marketing sections never push the editor below several screens.
- Use the 4px spacing base with 24–32px component spacing and 64–96px major section spacing.
- Desktop: 12-column grid. Tablet: 8 columns. Mobile: one primary column.
- The weekly chart may scroll horizontally on mobile, but the page itself must not.
- Mobile sticky action may show `Preview and print` only when the editor is active; it must not cover content or browser controls.

## Elevation & Depth

- Prefer borders, offset paper layers, and section color changes over shadows.
- Default surfaces use no shadow.
- A real paper preview may use one restrained shadow: `0 12px 30px rgba(23,49,58,.10)`.
- Focused or dragged paper may use `0 16px 40px rgba(23,49,58,.14)`.
- Never use glowing buttons, glass panels, blurred gradients, or stacked shadow cards.

## Shapes

- Controls use 8px radius; panels use 12–16px.
- Pills are reserved for compact status labels and age selection, not every feature.
- Logo mark: a geometric paper square with one folded corner and a single check stroke. It must remain recognizable at 16px.
- Icons are 1.75px or 2px custom SVG strokes with round joins. No emoji, 3D icon set, or mixed icon libraries.

## Components

### Header

Compact 72px height. Wordmark left, four text links, one Action CTA. Hide marketing links behind a mobile menu while retaining the CTA. Do not include Pricing, Sign in, account, avatar, or Pro.

### Hero

Product message and CTAs are left aligned. A realistic chore-chart sheet is the only large visual. Proof labels are short text with check/rule motifs, not a row of heavy pills.

### Maker controls

Age and Starter controls use segmented buttons with visible labels and `aria-pressed`. Inputs retain persistent labels. Optional nickname guidance and adult-review copy remain adjacent to the relevant control.

### Editor

The editor is the dominant surface. The chart table uses visible row and column boundaries, 44px checkbox hit areas, horizontal overflow affordance on mobile, and clear focused-input state. `Preview and print` has the highest emphasis inside the tool.

### Paper previews

Use actual product HTML/rendered output. Label each example with paper size and color mode. Do not place conceptual mockups or temporary CDN images in production.

### Accordions

FAQ rows use 1px rules, 12–16px vertical padding, a visible SVG disclosure icon, and native or fully accessible disclosure semantics.

### Consent banner

Bottom sheet/banner with equal visual prominence for `Accept analytics` and `Reject non-essential`; `Cookie settings` remains accessible. It cannot block the free tool after rejection.

### States

- **Loading:** preserve layout dimensions; show short text such as `Creating your starting chart…`; avoid infinite decorative loaders.
- **Empty:** show Blank starter and one clear next action.
- **Error:** inline Error text plus recovery CTA; do not clear the current chart.
- **Offline/storage unavailable:** keep editor usable and explain that the draft may not return.
- **Print validation:** show Letter/A4 preview and overflow warning before browser print controls.
- **Planned paid state:** secondary bordered section with `PLANNED · NO CHARGE TODAY`; never style as a live checkout.
- **Permission/auth:** not present in P0.

## Do's and Don'ts

### Do

- Show the editor and real paper output as proof.
- Use asymmetric composition and editorial rhythm.
- Keep all frozen SEO, FAQ, safety, privacy, and legal copy in semantic HTML.
- Test 1440px, 1024px, 768px, 390px, and 320px widths.
- Test Letter/A4, color, grayscale, browser print, keyboard flow, and reduced motion.
- Keep source, license, generation method, and review status for every visual asset.

### Don't

- Do not use Inter, Roboto, Arial, generic system-only typography, or purple-blue gradients.
- Do not use centered hero plus three identical cards as the page language.
- Do not use stock photos of children or families.
- Do not invent testimonials, ratings, expert badges, user counts, or behavior outcomes.
- Do not use emoji as interface icons.
- Do not hide the editor behind sign-up, pricing, or a long marketing preamble.
- Do not remove copy to make the screen cleaner; change the composition instead.
- Do not ship Stitch temporary image URLs or generated text without review.
