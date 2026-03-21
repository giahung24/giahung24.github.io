# Design System Document

## 1. Overview & Creative North Star
The **Creative North Star** for this design system is **"The Modern Concierge."** It aims to bridge the gap between historic European elegance and contemporary digital precision. Rather than a standard hospitality template, the experience is built on the philosophy of *Intentional Asymmetry and Tonal Depth*.

We move away from the rigid, boxed-in web of the past. By utilizing overlapping imagery, high-contrast editorial typography, and layers of light, the design system creates a digital space that feels as curated as a boutique hotel lobby. The interface is not just a tool for booking; it is the first touchpoint of a premium guest experience.

---

## 2. Colors
Our palette is rooted in a "Warm Luxury" aesthetic, balancing the weight of deep burgundy with the breathability of warm whites and charcoal.

* **Primary (#5c0d09 / #7b241c):** Our signature Burgundy. Use `primary` for high-intent actions and `primary_container` for hero accents. It represents the heritage and "soul" of the brand.
* **Secondary (#7d5627 / #fdc88e):** A refined gold/bronze. Use this for subtle accents that guide the eye without overwhelming the primary brand color.
* **Neutral/Surface:** A sophisticated range of warm whites and greys (`surface` to `surface_container_highest`).

### The "No-Line" Rule
To maintain a high-end feel, **do not use 1px solid borders** for sectioning. Boundaries must be defined solely through background color shifts. For example, a "Room Amenities" section should sit on `surface_container_low` to distinguish itself from the `surface` background, creating a seamless, architectural flow.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the `surface_container` tiers to create depth. A card (using `surface_container_lowest`) should sit atop a section (using `surface_container_low`). This "nested" depth mimics fine stationery or architectural marble slabs.

### The "Glass & Gradient" Rule
For floating navigation bars or booking modals, utilize **Glassmorphism**. Apply semi-transparent versions of `surface` with a 12px-20px `backdrop-blur`. Main CTAs should use a subtle linear gradient from `primary` to `primary_container` (top-to-bottom at 15°) to provide a tactile, "polished silk" finish.

---

## 3. Typography
The typography is the voice of the hotel: authoritative yet welcoming.

* **Display & Headlines (Noto Serif):** This sophisticated serif carries the weight of the brand. Use `display-lg` for hero titles with generous tracking (-0.02em) to create a bespoke, editorial look.
* **Body (Inter):** A clean, modern sans-serif chosen for maximum legibility. Use `body-lg` for introductory paragraphs to maintain an upscale feel.
* **Labels (Work Sans):** Used for navigation and small caps descriptors (e.g., "WHAT WE DO"). Always use 0.05em letter spacing for labels to evoke a sense of precision.

---

## 4. Elevation & Depth
In this design system, depth is felt, not seen. We avoid heavy, artificial shadows in favor of **Tonal Layering**.

* **The Layering Principle:** Place `surface_container_highest` elements behind `surface_container_low` elements to create a natural, receding perspective.
* **Ambient Shadows:** If a card must "float" (e.g., a booking summary), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(18, 29, 36, 0.06)`. Note the shadow color is a tinted version of `on_surface`, not pure black.
* **The "Ghost Border" Fallback:** If accessibility requires a stroke, use a "Ghost Border": `outline_variant` at 15% opacity. High-contrast, opaque borders are strictly forbidden.
* **Glassmorphism:** Use `surface_variant` at 70% opacity with a blur for hover states on cards, allowing the photography beneath to subtly bleed through.

---

## 5. Components

### Buttons
* **Primary:** Solid `primary` background, `on_primary` text. Use `xl` (0.75rem) roundedness.
* **Secondary:** `outline` ghost border (reduced opacity) with `primary` text.
* **Tertiary:** Text-only, using the `label-md` style with a 1px `primary` underline that expands on hover.

### Cards (The "Editorial" Card)
Forbid divider lines. Separate a room’s title from its price using a `12` (4rem) vertical spacing block or a subtle change from `surface_container_lowest` to `surface_container_low`. Images in cards should have a `md` (0.375rem) corner radius.

### Input Fields
* **Text Inputs:** Use `surface_container_low` for the background. Labels should sit above the field in `label-sm`. The focus state should be a 2px bottom-border of `secondary`, never a full outline.

### Thin-Lined Icons
All icons must be stroke-based (1px or 1.5px weight) using `on_surface_variant`. Avoid filled shapes unless they represent an active "toggle" state.

### Specialized Hospitality Components
* **Availability Calendar:** A minimalist grid using `surface_container` levels to denote booked (low contrast) vs. available (high contrast) dates.
* **Room Feature Chips:** Small, pill-shaped `secondary_container` chips with `on_secondary_container` text using `label-sm`.

---

## 6. Do's and Don'ts

### Do:
* **DO** use whitespace as a luxury material. Give high-quality photography room to breathe by using `20` (7rem) or `24` (8.5rem) spacing between major sections.
* **DO** use intentional asymmetry. Overlap a `surface` card slightly over a hero image to create a sense of bespoke layout.
* **DO** ensure all text on images has a subtle `surface_dim` gradient overlay for readability.

### Don't:
* **DON'T** use 100% black (#000000). Use `tertiary` (#232e36) or `on_surface` for high-contrast text.
* **DON'T** use standard "Drop Shadows." Stick to the Ambient Shadow values provided to avoid a "cheap" digital feel.
* **DON'T** crowd the navigation. Keep the header minimalist, pushing secondary links (Legal, Careers) to a deep-tone footer (`surface_container_highest`).