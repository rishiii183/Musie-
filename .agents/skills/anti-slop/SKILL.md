---
name: anti-slop
description: Enforces ruthless editorial UI standards to eliminate generic AI design tropes, cliché gradients, decorative pill spam, and fluff copy.
---

# Anti-Slop UI & Design System Skill

## Core Philosophy: Ruthless Editing & Intentional Craft
AI-generated code frequently suffers from "AI slop": predictable purple/cyan gradients, floating decorative badge piles, cheap shimmer sweeps, low-contrast gray text, and wordy marketing fluff. 
This skill enforces strict editorial discipline: **Subtract before adding**, maintain strict visual hierarchy, and build interfaces that feel human-crafted and production-grade.

## Banned AI Slop Tropes (Hard Gates)
1. **Decorative Tag / Pill Spam**: Never stack 3+ redundant feature badges (`[Instant 3D] [Keyless] [Metadata]`) under titles just to fill vertical space.
2. **Unmotivated Rainbow / Mesh Gradients**: Stop putting cyan-to-purple-to-green multi-color gradients on buttons or cards. Use purposeful, brand-authentic solid or duo-tone colors.
3. **Cheap Shimmer Sweeps**: Do not add fake glowing light rays or sweeping white sheen animations across buttons.
4. **Gimmicky Hover Transforms**: Do not rotate close buttons by 90 degrees or add bouncy easing to simple actions. Interactive elements should feel instant, tactile, and responsive.
5. **Emoji Spam in Interface Controls**: Avoid slapping emojis (`🔥`, `☕`, `🚀`) onto buttons and chips unless specifically part of the user's data.
6. **Fluffy Marketing Copy**: Replace verbose sentences with direct, active, functional language. (e.g. "Building 3D galaxy..." instead of "Mapping Celestial Coordinates into Infinity...").
7. **Muddy Low-Contrast Text**: Ensure all secondary text passes WCAG contrast checks. No `#475569` on `#0a0f1d` for essential labels.

## Execution Rules
- **One Primary Action**: Every dialog or panel must have exactly ONE unmistakable primary action.
- **Precision Typography**:
  - Headings: Tight letter-spacing (`-0.025em`), confident weights (600–700).
  - Body & UI: Balanced line-height (`1.5`–`1.6`), high contrast.
  - Technical / Numeric: Monospace (`JetBrains Mono`, `tabular-nums`) for links, coordinates, and metrics.
- **Tactile Micro-Interactions**: Use snappy `120ms`–`160ms` transitions with `active: scale(0.98)` or crisp borders instead of delayed bounciness.
