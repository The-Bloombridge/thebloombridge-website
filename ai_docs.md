# AI Developer Prompt & System Instructions for The Bloombridge

You are an expert AI software engineer (such as Gemini CLI, Claude Code, or ChatGPT) tasked with maintaining, modifying, or upgrading the codebase of **The Bloombridge** web presence.

To prevent bugs, preserve the premium light-pastel brand aesthetic, and maintain search optimizations, you must adhere strictly to these core rules:

---

## 1. Project Directory Mapping

The project enforces a flat-by-design structure to minimize deep token-consuming directory crawling:

```text
thebloombridge/
├── assets/
│   ├── css/
│   │   ├── variables.css       # central design tokens (colors, fonts, sizes)
│   │   └── style.css           # layout, premium visual panels, custom components
│   ├── js/
│   │   ├── main.js             # header state, scroll-spying links, carousels
│   │   ├── scheduler.js        # contact tab-toggles, mock booking slot actions
│   │   └── animation.js        # IntersectionObserver scroll-reveals
│   └── img/                    # optimized vectors & logo components
├── ai_docs.md                  # [THIS FILE] system directions for AI agents
├── index.html                  # master HTML5 semantic template & JSON-LD metadata
├── llms.txt                    # factual synthesizable Markdown for AI crawler bots
└── robots.txt                  # custom robot rules optimized for AI crawlers
```

---

## 2. Core Development Directives

### 2.1 Preserving the Visual Theme & Accessibility
- **Use CSS Variables:** All colors, font weights, transition cubic-beziers, and spacing sizes MUST be referenced from `assets/css/variables.css` using `var(--token-name)`.
- **DO NOT Hardcode HEX/RGB Colors:** Never hardcode color definitions inside standard class selectors. If a new color is required, define it in `variables.css` first.
- **Ensure Contrast (WCAG AA):** The theme leverages high-contrast editorial charcoal (`--text-header: #1F2D25`) for headings and dark slate-sage (`--text-body: #4A5950`) for body copy over light pearl/white backgrounds. Always verify text remains highly legible.

### 2.2 Navigation and Routing Integrity
- **Single-Page Hash Routing:** Navigation depends on standard HTML section anchor hashes (`#hero`, `#services`, `#methodology`, `#testimonials`, `#contact`). 
- **Underline Tracker Tracking:** Do not modify these section IDs without also updating `assets/js/main.js` which houses the scroll observer link-spying logic.
- **Dynamic Indicators:** Ensure the sticky header underline `indicatorBar` calculation remains performant and doesn't trigger layout thrashing.

### 2.3 Double Intake Contact Integration
- The `#contact` section runs a two-tab double intake setup (Option A: Calendly strategy booking; Option B: Inquiry message).
- **Tab Toggles:** Javascript handles this in `assets/js/scheduler.js` by toggling visibility classes. When adding fields, update the validation `inputs` object inside `scheduler.js` to ensure the form validations align.
- **Calendly Embed:** If the user supplies their actual Calendly inline widget URL, replace the `#calendly-widget-wrapper` placeholder content directly with their official iframe integration.

### 2.4 SEO & AIO (AI Optimizations) Sync
- **JSON-LD Schema Integration:** Any modification to services, values, or company metadata inside `index.html` MUST be accompanied by a corresponding update inside the `<script type="application/ld-json">` structured data node in the HTML `<head>`.
- **LLM Crawlers Sync:** Ensure any major strategic business change is immediately summarized inside `/llms.txt` so AI search crawlers index the correct offerings.

---

## 3. Safe Edit Example

If you are asked to **add a new testimonial**, do not rewrite the entire file. Locate the `#testimonials` grid or `.carousel-container` container in `index.html`, add the new `blockquote` block, assign it a matching class, and ensure its dot navigator inside `.carousel-dots` maps correctly to `data-slide-index`. Update the Schema.org or `llms.txt` testimonial summaries if requested!
