# WebWoven Studios — Architecture Specification (Master Blueprint)

**Version 1.0**
**Status:** Locked governing document. Companion to `DESIGN_BIBLE.md`.
**Rule:** This document is the permanent technical constitution of WebWoven Studios. It is the single source of truth for architecture. It must never be modified without explicit approval. If a future feature appears to conflict with it, propose a revision rather than silently changing it.

This document explains **what** every architectural decision is **and why** it exists. It is written so that a future AI session or engineer can read it once and build correctly without memory of prior conversations.

---

## 0. Relationship to DESIGN_BIBLE.md

`DESIGN_BIBLE.md` defines the **design philosophy, brand, visual language, motion rules, and quality standard**. This document defines the **technical architecture** that realizes that philosophy. Together they are the two locked foundations of the project.

- The Design Bible answers: *What should it feel like?*
- This document answers: *How is it built so it feels that way and stays scalable?*

Where this document references a design rule (e.g., motion timing, accessibility, premium feel), the authoritative detail lives in `DESIGN_BIBLE.md`. The two documents must never contradict. In case of conflict, the conflict is resolved by proposal, not by silent override.

---

## 1. Overall Application Philosophy

**Principle:** WebWoven Studios is a client-side, state-driven, single-page identity design platform. It turns structured profile data into premium, responsive, exportable HTML identity assets (web cards and email signatures).

**Why this shape:**
- The product is fundamentally a *renderer*: take validated data + design selections → produce a card. A client-side SPA with a single state store is the simplest architecture that satisfies this with zero server rendering.
- No build step is currently used (native ES modules). This keeps the project approachable and lets the exported card reuse the same CSS the app uses, guaranteeing WYSIWYG.
- Export is first-class, not an afterthought. The card the user previews is the card they export.

**Non-goals (explicitly avoided):**
- No framework lock-in (React/Vue) at this stage — the native module + state-subscription pattern is sufficient and keeps the bundle minimal, which protects the premium performance standard in the Design Bible.
- No server-side rendering — the app is a builder; the *output* is static HTML.

---

## 2. Application Architecture

**Pattern:** Unidirectional data flow with a single source of truth.

```
User Input (MultiStepForm, Header buttons, File/URL inputs)
        │  writes
        ▼
   appState (StateManager, pub/sub)
        │  notifies
        ▼
   Subscribers: PreviewEngine (live DOM), MultiStepForm (UI), App (export/preview toggle)
        │
        ▼
   Export consumers: generateStandaloneHTML (web), generateEmailHTML (Gmail)
        │
        ▼
   BackendService (Google Apps Script) — save/load/upload
```

**Why:**
- A single state object prevents the classic "two sources of truth" bug where the form and the preview disagree.
- Subscribers are decoupled: the Preview Engine does not know about the form, and the form does not know about export. Each reacts to state changes independently. This is what makes the system scalable to many Collections/Themes/Templates without coupling.
- Export is a *pure function of state + DOM*: `generateStandaloneHTML(cardEl, state)`. This purity is what guarantees the exported file matches the preview.

---

## 3. Folder Structure

Current structure (verified on disk):

```
/
├── index.html                 # Application entry (renamed from Profilecard.html)
├── manifest.webmanifest       # PWA manifest
├── robots.txt
├── _headers                   # Server-enforced security headers (Netlify/Vercel compatible)
├── assets/                    # favicon, apple-touch-icon, android icons, og-image
├── css/
│   ├── main.css               # Aggregator: imports variables, layout, components, preview
│   ├── variables.css          # Design tokens (:root custom properties)
│   ├── layout.css             # App shell: header, sidebar, preview area, step indicator
│   ├── components.css         # Reusable UI: buttons, forms, option cards, notifications
│   └── preview.css            # Card rendering: sizes, orientations, themes, card elements
└── js/
    ├── main.js                # App orchestrator (header actions, export actions, image upload, step-7 logic)
    ├── config/
    │   ├── state.js           # StateManager class + exported appState singleton
    │   └── constants.js       # DEFAULT_PROFILE, SOCIAL_PLATFORMS, THEMES, SIZES, ORIENTATIONS, ALIGNMENTS
    ├── components/
    │   ├── PreviewEngine.js   # Subscribes to state; renders #previewCard
    │   └── MultiStepForm.js   # Wizard: steps, option-card selection, social link management
    ├── services/
    │   ├── backend.js         # BackendService: Google Apps Script fetch wrapper + mock fallback
    │   ├── storage.js         # Local persistence (mock)
    │   └── share.js           # Share-link generation (mock)
    └── utils/
        ├── dom.js             # $, $$, createEl, sanitizeHTML, sanitizeURL, sanitizeImageURL
        ├── export.js          # generateStandaloneHTML (web export)
        └── emailExporter.js   # generateEmailHTML (Gmail/Outlook/Universal)
```

**Recommended future structure (NOT yet implemented — planning only):** the current flat `css/` and `js/` directories scale by adding files, not by restructuring. As Collections/Themes/Templates grow, the intended evolution is:

```
css/
  base/ variables.css, reset.css
  app/ main.css, layout.css, components.css
  cards/ preview.css            # base card = Signature collection default
  collections/ editorial.css, executive.css, ...   # one file per collection
  themes/ light.css, dark.css, glass.css, ...       # variable overrides only
  templates/ business-card.css, horizontal.css, ... # structure only
  animations/ animations.css, motion-packs.css
js/
  config/ collections.js, templates.js              # NEW registries
  collections/ (optional canvas effect controllers)
  animations/ (lazy-loaded effect controllers)
```

**Why this matters:** The current flat structure already maps cleanly onto the future structure (e.g., `preview.css` *is* the Signature/default collection). No rewrite is required — only addition and optional reorganization. The architecture does not depend on a specific folder depth; it depends on the *registry + data-attribute* pattern described below.

---

## 4. State Management

**Implementation:** `js/config/state.js` exports a singleton `appState` instance of `StateManager`.

**Mechanism:**
- `state` is a plain object seeded from `DEFAULT_PROFILE` plus runtime flags `isLoading` and `error`.
- `subscribe(listener)` registers a callback, immediately invokes it with current state, and returns an unsubscribe function.
- `update(partial)` shallow-merges and `notify()`s all listeners.
- Dedicated helpers: `updateSocialLink`, `addSocialLink`, `removeSocialLink`, `reorderSocialLinks`, `setLoading`, `setError`, `reset`.

**Why:**
- Pub/sub (observer) is the minimal pattern that keeps the preview, form, and export in sync without manual re-render calls scattered through the code.
- `subscribe` firing immediately on registration means a new subscriber (e.g., PreviewEngine constructed after load) renders correct state without a forced initial call.
- Immutability via spread (`{ ...this.state, ...updates }`) means subscribers can rely on reference changes for change detection and prevents accidental shared-mutation bugs.
- Social links are stored as an array of `{ platform, url, enabled }` objects and mutated through helpers that always produce a new array — this keeps the dynamic social system consistent with the immutable-update rule.

**Data ownership rule:** The state object is the *only* source of truth. The DOM (especially `#previewCard`) is a *projection* of state, never the source. Export reads state + the projected DOM. The form writes to state, never directly to the DOM.

---

## 5. Component Hierarchy

```
App (js/main.js)
├── PreviewEngine (js/components/PreviewEngine.js)
│     └── renders #previewCard (the live card projection)
├── MultiStepForm (js/components/MultiStepForm.js)
│     └── owns steps 1–7, option-card selectors, social link editor
├── BackendService (js/services/backend.js)        [used by App for save/upload]
└── Utility modules (dom, export, emailExporter)   [used by App + engines]
```

**Why:**
- `App` is the only orchestrator. It wires DOM events (header buttons, export buttons, image upload, step-7 toggles) to state and services. Components do not wire global header buttons; they own their own DOM region.
- `PreviewEngine` and `MultiStepForm` are self-contained: each binds to its own DOM and subscribes to state. Neither imports the other. This independence is what lets new Collections/Themes be added without touching component code.
- The email preview (`#emailPreviewCard` / `#emailPreviewContent`) is a *separate* projection toggled by App when the email export format is selected; it does not replace `#previewCard`, it is shown/hidden.

---

## 6. Preview Engine Architecture

**File:** `js/components/PreviewEngine.js`

**Responsibility:** Project `appState` onto `#previewCard` in real time.

**Mechanism (verified):**
1. On construction, subscribes to `appState`.
2. On every state change, `render(state)`:
   - Sets `dataset.theme`, `dataset.size`, `dataset.orientation`, `dataset.alignment` on the container.
   - Sets inline custom property `--card-accent` from `state.accentColor`.
   - Writes text via `textContent` (Name, Title, Company) — inherently XSS-safe.
   - Sanitizes the image URL (`sanitizeImageURL`) before assigning `img.src`; falls back to a DiceBear avatar.
   - Rebuilds `#cardContact` from email/phone, each URL wrapped through `sanitizeURL` and text through `sanitizeHTML`.
   - Rebuilds `#cardSocial` from enabled social links; each `href` through `sanitizeURL`, `rel="noopener noreferrer"` added, platform name escaped.

**Why this design:**
- **Attribute-driven rendering** is the cornerstone of scalability. All visual variation (theme, size, orientation, alignment) is expressed as `data-*` attributes that CSS selectors target. Adding a Collection or Theme is adding a CSS file + a `data-collection` attribute — the engine logic does not change.
- **Inline `--card-accent`** lets a user-chosen accent color override the collection's default without a new CSS file. This is the "user customization sits above collection defaults" rule made concrete.
- **Sanitization at the render boundary** means untrusted user input is neutralized exactly once, at the point it enters the DOM, so every downstream consumer (including export, which clones this DOM) inherits safe output.

**Extension point:** To support Collections/Templates, the engine adds `dataset.collection` and `dataset.template` assignments. No other change is required because CSS does the rest.

---

## 7. Export Engine Architecture (overview)

The Export Engine is two independent pure functions selected by the user's chosen format:

- **Web/HTML export** → `generateStandaloneHTML(cardEl, state)` (`js/utils/export.js`)
- **Email export** → `generateEmailHTML(state, format)` (`js/utils/emailExporter.js`)

**Why two separate engines:**
- Web cards and email signatures have fundamentally different rendering constraints. Email clients (Gmail, Outlook) strip `<style>` in `<head>`, JavaScript, and most CSS; they require table-based, inline-styled, image-with-dimensions layouts. A web card can use modern CSS, flexbox, and `backdrop-filter`.
- Keeping them separate means each can be optimized for its target without compromising the other. They share only the *input* (state) and the *sanitization philosophy*.

**Unified contract:** Both accept the same `state` shape and both must produce output that is a faithful, safe representation of the user's design. Both must escape/sanitize all user input.

---

## 8. HTML Export Architecture (`generateStandaloneHTML`)

**File:** `js/utils/export.js`

**Current mechanism (verified):**
1. Clones `#previewCard` via `cloneNode(true)` — this captures the *already-sanitized* live DOM, so exported HTML inherits Preview Engine's XSS safety.
2. Builds a full HTML document string with an inline `<style>` block.
3. The inline `<style>` block **currently hardcodes** the card CSS (sizes, orientations, themes, card elements) and reads `state.accentColor` for `--card-accent`.
4. Injects `clone.outerHTML` into `<body>`.
5. Escapes `state.name` for the `<title>`.

**Critical architectural constraint (must be preserved in all future work):**
> The standalone export hardcodes card CSS instead of importing `preview.css` (or a collection CSS file). This means **today, collection/theme styling applied via external CSS does not survive export** — only what is re-declared in the hardcoded block appears.

**Why this must change before Collections ship:**
For the "export matches preview" promise (Design Bible §22, "bespoke not template") to hold for Collections, the export must **compose** its style block from the active Collection/Theme/Template CSS rather than duplicating a fixed block. The refactor target is: read the collection's CSS text and inject it, falling back to the current block for the default (Signature) collection so current output is reproduced exactly (regression-safe).

**Why clone-then-inline (not re-render):** Cloning the live DOM guarantees the exported card is pixel-identical to the preview, including any runtime state. Re-rendering from scratch would risk drift between preview and export.

---

## 9. Gmail Export Architecture (`generateEmailHTML`)

**File:** `js/utils/emailExporter.js`

**Mechanism (verified):**
1. Accepts `(profileData, format)` where `format` ∈ `gmail | outlook | universal`.
2. **Sanitizes all inputs at the entry point** before interpolation: HTML-escapes text fields, and runs URLs through a `safeURL` allowlist (`https:`, `mailto:`, `tel:`, `data:image/`). Unsafe URLs become `''`.
3. Builds a table-based layout (Gmail/Outlook/Universal variants) with inline styles.
4. Returns a complete HTML document string.

**Why table-based + inline styles:**
- Gmail and Outlook do not support external stylesheets or `<head>` `<style>` reliably; Outlook uses the Word rendering engine. Tables with `border-collapse` and inline styles are the only layout method that renders consistently across both.
- Images must include explicit `width`/`height` attributes (already done) because email clients ignore CSS sizing.

**Accessibility/robustness:** The generated HTML includes `role`/structural tables and alt text on images.

**Why a separate generator (not reusing preview.css):** Email clients would silently drop the modern CSS the web card relies on. A dedicated, conservative generator is the only way to guarantee the signature actually renders in inboxes.

**Animation rule for email:** Email export is **always static**. Animation CSS is never included. This is intentional and required — email clients strip or ignore animation, and the Design Bible's motion philosophy (subtle, quality-communicating) is expressed in the web card, not the signature.

---

## 10. Backend Architecture

**File:** `js/services/backend.js`

**Pattern:** `BackendService` is a static class wrapping `fetch` to a single Google Apps Script Web App URL.

**Mechanism:**
- `GAS_WEB_APP_URL` is a single constant. Until configured (`'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'`), the service returns **mock responses** after a simulated delay.
- `request(action, data)` POSTs `{ action, ...data }` as JSON with `mode: 'cors'`, `cache: 'no-cache'`.
- Methods: `saveProfile`, `loadProfile`, `deleteProfile`, `listProfiles`, `uploadImage`.
- `mockResponse` simulates latency and returns success-shaped data so the UI is fully exercisable without a backend.

**Why this abstraction:**
- A single endpoint + action-based protocol means the frontend never knows or cares about the backend's internals (Sheets vs. a real DB). Swapping the backend later requires changing only `GAS_WEB_APP_URL`.
- The mock fallback means development, testing, and demos work with zero infrastructure. This protects the "no friction" standard.
- All profile operations send the *entire* `state` object, so future fields (collection, theme, template, versions) flow through automatically without new endpoints.

---

## 11. Google Sheets Integration

**Role:** Google Sheets is the current persistence store, accessed *only* through the Apps Script layer. The frontend never touches Sheets directly (CORS, auth, and structure are all hidden behind the script).

**Data shape:** Each saved profile becomes a row (or a serialized JSON blob in a column) keyed by `id`. The script assigns/returns `id` on save.

**Why Sheets (current choice):** Zero-cost, zero-infra persistence for an MVP, with a familiar admin surface. It is explicitly a starting point, not a permanent constraint — the action-based backend means migrating to Firestore/Postgres later is a backend-only change.

---

## 12. Google Apps Script Responsibilities

The script (deployed as a Web App) owns:
- Receiving `action`-typed POSTs and routing to `doPost` handlers.
- `saveProfile`: upsert by `id`; return `{ success, id }`.
- `loadProfile` / `deleteProfile` / `listProfiles`: CRUD over the Sheet.
- `uploadImage`: accept base64 + filename; store (Drive or Sheet) and return a public `url`.
- CORS headers (`Access-Control-Allow-Origin`, etc.) so the browser fetch succeeds.

**Why this boundary:** The script is the *only* place backend logic lives. Frontend engineers never write Sheets/DB code. This separation keeps the client pure and the backend replaceable.

---

## 13. Authentication Architecture

**Current state:** None implemented. The app is open; "save" mocks or writes anonymously keyed by a client-generated `id`.

**Intended future shape (planning only, not built):**
- Auth is a **backend concern**, not a frontend one. The frontend passes an optional `userId`/`token` in the `request` payload; the Apps Script (or future auth service) validates it.
- The frontend must not implement its own auth logic beyond attaching a token from a storage service. This preserves the "backend owns secrets" rule.
- Until auth exists, all saves are best-effort and client-scoped.

---

## 14. Future Payment Architecture

**Planning only — not implemented.** Payments (premium subscriptions, locked Collections, motion packs) follow the same action-based backend pattern:
- `BackendService` gains `createCheckout`, `verifyEntitlement`, `getPlan` actions.
- Entitlements are returned as part of the profile/account payload and stored in state as `state.plan` / `state.entitlements[]`.
- The UI gates locked Collections/Templates by checking entitlements against the Collection registry's `locked` flag.
- **Why:** Keeping entitlement as *data* (a flag on a registry entry + a plan on state) means locking a Collection is a one-line registry change, not a code branch. Payment processing (Stripe/Paddle) lives entirely behind the backend action, so the frontend never handles card data (PCI scope avoided).

---

## 15. Premium Feature Architecture

**Planning only.** Premium features (locked Collections, motion packs, team workspace, brand kits, cloud save, version history, AI suggestions, marketplace) are all expressed as **data + registry entries + optional service methods**:
- `COLLECTIONS` entries gain `locked: true` and a `requiredPlan`.
- `BackendService` gains the corresponding actions (e.g., `saveBrandKit`, `listTeam`, `listVersions`, `aiSuggest`).
- The frontend reads entitlements and renders locked states; it never hardcodes premium logic per feature.
- **Why:** The registry-driven approach means premium features scale by adding data, not by adding `if (premium)` branches throughout the codebase. This keeps the code maintainable and the WebWoven Standard (§23 of Design Bible) enforceable.

---

## 16. Licensing Architecture

**Planning only.** Licensing (per-seat team plans, white-label, redistribution rights for exported cards) is an attribute of the account/entitlement, evaluated by the backend at save/export time. The exported HTML may carry a non-visible generator marker (e.g., a comment or meta) for attribution where the plan requires it. Licensing decisions are backend-enforced; the frontend only reflects entitlement state.

---

## 17. Studio Architecture

**Definition (from Design Bible context):** A "Studio" is the top-level product brand — WebWoven Studios. Within it, **Collections** are the artistic directions. The Studio provides the shell, the standards (Design Bible §23), and the shared infrastructure (state, engines, export, backend). Collections are *tenants* of the Studio's system, not separate apps.

**Why a studio-of-collections model:** It lets the product present a unified premium identity while offering many distinct visual directions. Each Collection shares the Studio's rendering pipeline, so adding a Collection costs one CSS file + one registry entry, never a new application.

---

## 18. Collection Architecture

**Definition:** A Collection is a complete artistic direction — typography pairing, spacing rhythm, divider language, color mood, signature animation. It defines *art direction*, not layout (Templates) and not surface treatment (Themes).

**Representation (target — registry-driven, not yet in code):**
```js
// js/config/collections.js (planned)
export const COLLECTIONS = [
  {
    id: 'editorial',
    name: 'Editorial',
    description: '...',
    fonts: { display: '...', body: 'Inter', mono: '...' },
    themes: ['light', 'dark', 'noir'],
    templates: ['vertical', 'magazine', 'landing'],
    animationPack: 'editorial',
    tokens: { '--card-radius': '...', '--card-accent-2': '...' },
    locked: false
  },
  // ... executive, motion, luxury, creative, tech, minimal, organic, signature
];
```

**Rendering hook:** The Preview Engine sets `dataset.collection` on `#previewCard`. CSS under `[data-collection="editorial"]` provides the visual language. The export engine composes that collection's CSS into the standalone output.

**Why registry-driven:** New Collections are pure data + CSS. The engine, export, and email export read from the registry. Zero edits to existing components. This is the core scalability guarantee.

**Signature Collection:** The flagship house collection; the default. It must be instantly recognizable and not replicable by competitors. It doubles as the base card CSS (`preview.css`) so the default export path is stable.

---

## 19. Theme Architecture

**Definition:** A Theme modifies *appearance* (light/dark/surface treatment) **without changing layout or artistic direction**. A Collection sets the mood; a Theme picks the surface.

**Current implementation (verified):** `THEMES` is a flat list in `constants.js`; themes are applied as `[data-theme="x"]` CSS variable overrides in `preview.css` (light, dark, glass, dark-glass). All theme logic is CSS — no JS branch.

**Future shape:** Themes nest under Collections (`collection.themes`). Each theme is a pure CSS variable block: `--card-bg`, `--card-text`, `--card-surface`, plus glass/blur treatment. Examples: Light, Dark, Glass, Glass Dark, Frosted, Neon, Matte, Luxury, Editorial, Paper, Dynamic Gradient, Aurora, Cyber, Minimal, Premium White, Premium Black.

**Why CSS-only themes:** Theming via custom properties means switching themes is a single attribute flip with no layout recomputation and no JS. It is the cheapest possible variation and is inherently export-safe (the variables are inlined or composed into the standalone style block).

---

## 20. Template Architecture

**Definition:** A Template defines *structure/layout* (DOM arrangement + size/orientation defaults). Collections define art direction; Themes define surface; Templates define structure.

**Representation (target):** A `TemplateRegistry` maps `templateId` → a layout (CSS structure class set, optional DOM variant). The Preview Engine applies `dataset.template`; CSS handles structure.

**Examples:** Business Card, Signature, Vertical Card, Horizontal Card, Social Profile, Team Card, Executive Card (portrait-hero blend), Creator Card (image-dominant), QR Card, Landing Card.

**Why separate from Collection:** A user may want an "Executive" look (Collection) in a "Horizontal" structure (Template) with a "Dark" surface (Theme). Decoupling the three axes maximizes combination count from minimal code — the combinatorial product of Collections × Themes × Templates, all data-driven.

**Why separate from Theme:** Themes must not change layout (Design Bible §4 / Studio spec). Templates own layout so themes stay purely surface-level.

---

## 21. Animation Architecture

**Philosophy (from Design Bible §10–§12):** Motion communicates quality, never attention. Forbidden: bounce, shake, flash, continuous spin, aggressive movement. Allowed: fade, slide, float, breathe, reveal, expand, soft glow, subtle scale. Timing bands are fixed (micro 150–250ms, hover 200–300ms, page 350–500ms, backgrounds 8–30s, aurora 20–40s, breathing 6–10s).

**Implementation layers:**
1. **CSS keyframes** (`css/animations.css`): the primary mechanism. Named animations (Editorial Reveal, Text Reveal, Gradient Flow, Light Sweep, Premium Shine, Border Glow, Breathing, Glass Reflection, Liquid Morph, Cinematic Reveal, Hero Portrait Zoom). Attach via `data-animation` or collection-pack classes.
2. **Canvas effects** (optional, lazy): Particle Field, Aurora, Orbit, Interactive Mouse Light, for Collections that need them (Motion, Tech). Loaded only when the active Collection requires them and the device passes a performance budget.
3. **Global gate:** `state.animationsEnabled` (default true) + `@media (prefers-reduced-motion: reduce)`. When off or reduced-motion, all animations resolve to their final static state. This satisfies Design Bible §19 (accessibility) and §10 (motion as reward, not demand).

**Why CSS-first:** CSS animations are GPU-composited (transform/opacity), declarative, and exportable (inlined into standalone HTML when enabled). Canvas is reserved for effects CSS cannot do, and is isolated + lazy so it never burdens collections that don't need it.

**Email rule:** Animations are never included in Gmail export (§9).

---

## 22. Responsive Architecture

**Philosophy (Design Bible §20):** One fluid app, no separate mobile version. Components intelligently reflow.

**Current implementation (verified in `layout.css`):**
- App shell is `display:flex` column (header / main). `main` is sidebar + preview area side-by-side.
- At `max-width: 900px`, `main` becomes `column-reverse` (preview on top, sidebar below), sidebar goes full width.
- Cards use `max-width` + `min-height` tokens so they scale fluidly.

**Targets (Design Bible §20):** Mobile, Tablet, Laptop, Desktop, Ultra-wide, Embedded widgets, Email signatures, Iframe embeds, Popup previews.

**Why reflow-not-fork:** Maintaining one layout that adapts prevents the "two codebases drift" failure mode and keeps the premium consistency the Design Bible demands. Media queries adjust *arrangement and spacing*, never *behavior*.

**Export implication:** Standalone HTML includes the same responsive media queries (composed from collection CSS) so embedded/iframe cards stay responsive.

---

## 23. Design Token Architecture

**File:** `css/variables.css` (`:root` custom properties) plus per-theme/per-collection overrides.

**Token categories (verified + planned):**
- Brand: `--brand-primary` (WebWoven Orange), `--brand-secondary` (Deep Red), hover variants.
- Neutrals: `--bg-app`, `--bg-surface`, `--bg-surface-alt`, `--text-main`, `--text-muted`, `--text-light`, `--border-color`.
- Card: `--card-bg`, `--card-text`, `--card-text-muted`, `--card-surface`, `--card-accent`, `--card-radius`, `--card-shadow`.
- Typography: `--font-sans` (Inter), planned `--font-display`, `--font-mono`.
- Layout: `--sidebar-width`, `--header-height`, `--radius-sm/md/lg/full`, `--transition-fast/normal/slow`.

**Why tokens:** Centralizing values as custom properties means a Collection/Theme changes the *value*, not the *rule*. This is what makes theming and collection-switching instant and consistent, and what lets the export engine inline the same values.

**Rule:** No arbitrary hard-coded values in component CSS. Every spacing/radius/color references a token (Design Bible §6–§8).

---

## 24. CSS Architecture

**Layering (verified):**
1. `variables.css` — tokens.
2. `layout.css` — app shell (header, sidebar, preview area, step indicator, responsive breakpoints).
3. `components.css` — reusable UI (buttons, forms, option cards, notifications).
4. `preview.css` — card rendering (sizes, orientations, themes, card elements). This is also the base/default (Signature) collection CSS.

**Principles:**
- Attribute-driven: `.profile-card[data-theme="dark"] { ... }` etc. No JS layout.
- The card CSS is self-contained so it can be composed into the standalone export.
- Glass uses `backdrop-filter` with `-webkit-` fallback (verified).
- Keyframes are minimal (`fadeIn` in layout.css; card hover transitions).

**Future layering:** `collections/`, `themes/`, `templates/`, `animations/` as described in §3. Each Collection/Theme/Template is a self-contained CSS file consumed by the export composer.

**Why this layering:** Separation of "app shell" from "card" means the builder UI and the exported artifact never share fragile CSS; the card CSS is portable.

---

## 25. JavaScript Architecture

**Module system:** Native ES modules (`<script type="module">`), no bundler currently.

**Layer rules:**
- `config/` — state + constants (pure data/logic, no DOM).
- `components/` — DOM-bound engines (PreviewEngine, MultiStepForm); each owns its DOM region and subscribes to state.
- `services/` — backend/storage/share (I/O, mockable).
- `utils/` — pure helpers (dom queries, sanitization, export functions).
- `main.js` — the sole orchestrator wiring events to state/services.

**Why no framework:** The app's needs (state subscription, DOM projection, pure export functions) are fully met by native modules + a small StateManager. Avoiding a framework keeps the bundle minimal (Design Bible performance standard) and keeps the exported card's CSS reusable.

**Why single orchestrator:** `App` in `main.js` is the only place that binds *global* header/export buttons. Components bind only their own region. This prevents duplicate/competing event handlers.

---

## 26. Data Models

**Profile (state shape, from `DEFAULT_PROFILE` + runtime):**
```js
{
  id: "",                      // assigned by backend on save
  name, jobTitle, company,    // text
  email, phone, website,      // contact (validated/sanitized on render)
  imageUrl,                   // sanitized image URL or data:image
  socialLinks: [              // dynamic array
    { platform: "linkedin", url: "https://...", enabled: true }
  ],
  // Design selections:
  theme: "light",             // → data-theme
  accentColor: "#c92a2a",     // → --card-accent inline
  orientation: "vertical",    // → data-orientation
  size: "standard",           // → data-size
  alignment: "left",          // → data-alignment
  // Future (planned, data-only): collection, template, animationsEnabled, plan, entitlements, versions
  createdAt: null,
  lastUpdated: null,
  // Runtime-only:
  isLoading: false,
  error: null
}
```

**Social Link model:** `{ platform: string (SOCIAL_PLATFORMS id), url: string, enabled: boolean }`.

**Backend payload:** The entire profile object is POSTed as `{ action, profile }`. Future fields flow automatically.

**Why this shape:** Flat, serializable, and backend-agnostic. Adding `collection`/`template` is adding two string fields — no structural change. Social links as an array (not fixed fields) is what enables the dynamic social system (§33).

---

## 27. File Relationships

```
index.html
  └─ loads css/main.css (aggregator)
  └─ loads js/main.js (module entry)
        ├─ config/state.js  (appState)
        ├─ config/constants.js (DEFAULT_PROFILE, SOCIAL_PLATFORMS, THEMES, SIZES, ...)
        ├─ components/PreviewEngine.js  (imports dom.js, state.js, constants.js)
        ├─ components/MultiStepForm.js  (imports dom.js, state.js, constants.js)
        ├─ utils/export.js   (generateStandaloneHTML)
        ├─ utils/emailExporter.js (generateEmailHTML)
        └─ services/backend.js (BackendService)
              └─ utils/dom.js (sanitize helpers, shared)

dom.js ← imported by PreviewEngine, MultiStepForm, main.js (shared sanitization + selectors)
```

**Why this graph:** `dom.js` is the only cross-cutting utility (selectors + sanitizers). `state.js` is the only shared state. No circular dependencies: utils/services never import components; components never import main.js. This acyclic graph is what keeps the system testable and scalable.

---

## 28. Event Flow

1. User interacts with a DOM control (input, button, option card, file picker).
2. The owning module (`MultiStepForm` for step inputs; `App` for header/export/image) attaches a listener.
3. The listener validates (where needed) and calls `appState.update(...)`.
4. `StateManager.notify()` invokes all subscribers with the new state.
5. Subscribers react: PreviewEngine re-renders the card; MultiStepForm updates its own UI; App updates step-7 preview toggle.

**Why this flow:** Events never mutate the DOM directly for card content — they go through state. This eliminates "form says X but card shows Y" bugs and is the foundation of live preview.

---

## 29. Rendering Flow

```
state change
  → PreviewEngine.render(state)
      → set dataset.theme/size/orientation/alignment (CSS selectors drive layout)
      → set inline --card-accent (user accent override)
      → textContent for name/title/company (safe)
      → sanitizeImageURL → img.src (safe)
      → rebuild #cardContact (sanitizeURL + sanitizeHTML)
      → rebuild #cardSocial (sanitizeURL + rel=noopener, escape name)
```

CSS attribute selectors translate the `data-*` attributes into the visible card. No layout JavaScript exists.

---

## 30. Live Preview Flow

Live preview *is* the rendering flow — there is no separate preview mode. Because PreviewEngine subscribes to state, every keystroke/selection that updates state immediately re-projects the card. The preview area is always visible (Design Bible §14: "preview should remain visible throughout the workflow"). The email preview (`#emailPreviewCard`) is a secondary projection shown only when the email export format is selected (App toggles `display`).

**Why always-on preview:** Immediate feedback is what makes the tool feel like "designing a brand" rather than "filling a form" (Design Bible §1). The subscription model makes this free — no manual refresh calls.

---

## 31. Export Flow

**Web/HTML:**
```
App.downloadStandardHTML()
  → cardEl = #previewCard
  → html = generateStandaloneHTML(cardEl, state)
  → Blob → object URL → <a download> click → revoke
```
`generateStandaloneHTML` clones the sanitized live DOM and wraps it in a document with an inline style block.

**Email:**
```
App.downloadEmailHTML() / copyEmailHTML()
  → state = appState.get()
  → format = #emailFormatSelect value
  → html = generateEmailHTML(state, format)
  → download as .html OR ClipboardItem({ 'text/html': blob }) for rich paste
```
**Copy nuance:** Email copy attempts `ClipboardItem` rich HTML first, falls back to plain text on failure (some browsers/clipboards reject HTML).

**Why two paths:** See §7. Both read the same state; both sanitize; both are pure functions of input.

---

## 32. Save/Load Flow

**Save:**
```
App (#btnSave) → BackendService.saveProfile(appState.get())
  → POST { action:'saveProfile', profile }
  → mock or real → { success, id }
  → appState.update({ id })
```
`saveProfile` stamps `lastUpdated` (and `createdAt` if missing) before sending.

**Load (designed, partially mocked):** `BackendService.loadProfile(id)` returns the profile; the app would `appState.update(profile)`. Currently the UI does not surface a load UI, but the service method exists.

**Why send full state:** Future fields (collection, theme, template, versions) require no new endpoint — they ride inside `profile`.

---

## 33. Image Management Flow

**Two input methods (verified):**
1. **File upload** (`#imageUpload`): validated (type starts with `image/`, size ≤ 5MB), read via `FileReader` as `data:image/...` base64, sanitized (must start with `data:image/`) before `appState.update({ imageUrl })`. Optionally `BackendService.uploadImage(base64, name)` returns a hosted URL which replaces the base64.
2. **URL paste** (`#imageUrl`): stored directly as `imageUrl`; sanitized at render time via `sanitizeImageURL` (allows `https:` and `data:image/` only).

**Why validation at both points:** Client-side validation rejects bad files early (UX + performance); render-time sanitization is the security backstop (Defense in Depth, Design Bible + security standard). The DiceBear fallback ensures the card is never broken by a missing/invalid image.

---

## 34. Social Link System

**Model:** `state.socialLinks` is an array of `{ platform, url, enabled }`.

**Management (MultiStepForm):**
- `renderSocialLinks()` injects inputs for each link; add/remove/toggle/update via `appState` helpers.
- URL values are escaped with `sanitizeHTML` when injected into `value="..."` (verified fix).
- Platform options come from `SOCIAL_PLATFORMS` in `constants.js`.

**Rendering (PreviewEngine):** For each enabled link with a URL, `sanitizeURL(link.url)` is called; unsafe URLs are skipped; the anchor gets `target="_blank" rel="noopener noreferrer"`, and the platform name is escaped.

**Why array-not-fixed-fields:** Users can have any number/combination of social platforms. An array + registry (`SOCIAL_PLATFORMS`) scales to new platforms by adding one constant, not by changing component logic.

---

## 35. Future Plugin System

**Planning only.** A plugin is a Collection/Theme/Template/Animation pack delivered as a registry entry + CSS (± optional JS controller). Because the entire system is registry + `data-*` + CSS, a "plugin" is just a well-formed addition to `COLLECTIONS`/`THEMES`/`TEMPLATES` plus its asset files. No plugin API is needed for visual plugins — the architecture already supports them. JS-driven effects (canvas) register a controller the animation layer can lazy-load by `animationPack` id.

**Why no special plugin framework:** The registry pattern *is* the plugin system. Adding formalism later (dynamic remote registries) is an extension, not a rewrite.

---

## 36. Future API System

**Planning only.** The `BackendService.request(action, data)` protocol is already an API. A public/partner API means exposing those actions (or new ones) over an authenticated endpoint. The frontend already speaks action-based JSON, so exposing it externally requires only backend auth + documentation, not frontend changes.

---

## 37. Future Extension Strategy

The universal extension rule:
- **New visual direction** → add a CSS file + a registry entry. Engine unchanged.
- **New surface treatment** → add a theme CSS variable block. Engine unchanged.
- **New layout** → add a template CSS structure. Engine unchanged (add `data-template`).
- **New animation** → add a keyframe; gate by toggle + reduced-motion.
- **New backend capability** → add a `BackendService` static method + script handler.
- **New premium gate** → set `locked`/`requiredPlan` on a registry entry; read entitlement from state.

**Why this works:** Every extension point is *data + asset*, never *engine logic*. This is the single most important scalability property and the reason the vision (many Collections/Themes/Templates) is achievable without rewrite.

---

## 38. Scalability Strategy

- **Horizontal (more content):** registry-driven; adding Collections/Themes/Templates is O(1) file additions.
- **Vertical (more users):** client-side; backend is stateless action routing; Sheets can be swapped for a real DB behind the same script.
- **CSS payload:** per-collection CSS should be loaded on demand (dynamic `<link>` or build concatenation) so 9 collections don't ship to every user.
- **Export composition:** centralizing card CSS (§8 refactor) makes export scale with content instead of requiring a hardcoded block per variation.
- **No engine rewrite** is ever required to add a Collection/Theme/Template.

---

## 39. Performance Strategy

- **Animations:** CSS transform/opacity only (GPU-composited). Canvas effects lazy-loaded + device-budget-gated. `prefers-reduced-motion` + `animationsEnabled` disable all motion.
- **Fonts:** `display=swap`; preconnect to fonts.gstatic.com; load only the active collection's display font.
- **Images:** upload size-capped (5MB); `loading`/`decoding` attributes; avatar uses efficient SVG (DiceBear) fallback.
- **Rendering:** subscription-based re-render is cheap (attribute flips + small innerHTML rebuilds); avoids full repaints.
- **Payload:** native ES modules, no framework; minimal CSS.
- **Core Web Vitals:** LCP protected by limited above-the-fold CSS; CLS protected by fixed card sizing tokens; INP protected by event→state→render being synchronous and light.

---

## 40. Security Strategy

**Defense in depth (verified + enforced):**
- **Input sanitization at render boundary:** `sanitizeHTML`, `sanitizeURL` (allowlist `https:`, `mailto:`, `tel:`, `data:image/`, relative), `sanitizeImageURL` (allow `https:` + `data:image/`). Blocks `javascript:`, `vbscript:`, `file:`, and attribute-breakout payloads.
- **Email export sanitization:** all inputs HTML-escaped and URL-allowlisted at the generator entry; unsafe URLs become `''`.
- **External links:** `rel="noopener noreferrer"` on all `target="_blank"` anchors (social links).
- **File upload:** type + size validated client-side; base64 scheme re-checked before store.
- **CSP / headers:** declared via `<meta>` in `index.html` and enforced server-side in `_headers` (Content-Security-Policy, Referrer-Policy, X-Content-Type-Options, X-Frame-Options, Permissions-Policy, Strict-Transport-Security, X-XSS-Protection).
- **Export title escaping:** `state.name` escaped in standalone `<title>`.
- **No inline event handlers, no `eval`, no `innerHTML` of untrusted raw input** — all dynamic HTML is built from sanitized fragments.

**Why this posture:** The app renders user input into HTML constantly (names, URLs, social links). Sanitizing at the single render boundary means every consumer — including the export clone — inherits safety. CSP is the second layer in case a sanitizer is missed.

---

## 41. Coding Standards

- **Modules:** native ES modules; one class/major export per file; named exports preferred.
- **State:** only `appState` holds truth; never mutate DOM as source; never store derived UI state outside state.
- **Sanitization:** every user string entering HTML passes through `sanitizeHTML`; every URL through `sanitizeURL`/`sanitizeImageURL`. No exceptions.
- **Rendering:** attribute-driven; no layout JavaScript.
- **Export purity:** export functions are pure (state + DOM → string); no side effects.
- **No secrets in client:** backend URL/config stays server-side or mock; never embed credentials.
- **Accessibility:** every interactive control keyboard-reachable; reduced-motion respected; contrast met.
- **No framework, no bundler** unless a documented, approved migration occurs.

---

## 42. Naming Conventions

- **Files:** `kebab-case.js` / `kebab-case.css` (verified: `preview-engine` style not used — current is `PreviewEngine.js` PascalCase for classes; keep class files PascalCase, util files camelCase, CSS kebab-case).
- **State fields:** `camelCase` (`accentColor`, `imageUrl`).
- **CSS classes:** `kebab-case` (`profile-card`, `card-avatar`, `step-dot`).
- **Data attributes:** `kebab-case` (`data-theme`, `data-size`, `data-collection` planned).
- **Registry ids:** `kebab-case` (`editorial`, `gmail`).
- **Constants:** `UPPER_SNAKE` for constant arrays/objects (`THEMES`, `SOCIAL_PLATFORMS`).
- **Functions:** `camelCase` (`generateStandaloneHTML`, `sanitizeURL`).
- **CSS custom properties:** `--kebab-case` (`--card-accent`).

**Why consistent naming:** Predictable names let future devs locate the right file/selector without archaeology, supporting the WebWoven Standard's scalability clause.

---

## 43. Versioning Strategy

- **App:** semantic version in `package.json` + a `version` constant consumable by the backend/`loadProfile` for future migrations. Current app has no in-code version constant yet; when added, it rides inside the profile payload.
- **Documents:** `DESIGN_BIBLE.md` and `ARCHITECTURE.md` are versioned by their header (`Version 1.0`) and are locked; changes require explicit approval and a version bump.
- **Data migrations:** because the full profile is stored, adding a field is backward-compatible (new fields default via `DEFAULT_PROFILE` on load). Removing a field is a migration handled by the backend/default merge.
- **Export format:** standalone/email HTML includes enough structure that older exports remain valid; format changes are additive (new `data-*` attributes) not breaking.

---

## 44. Documentation Standards

- **Locked foundations:** `DESIGN_BIBLE.md` (design) and `ARCHITECTURE.md` (technical) are the two permanent governing documents. Neither is edited without approval.
- **Future companion:** a **Studio Bible** is the planned third foundation, defining each Collection's detailed design language, layouts, animations, and audience (called for explicitly in `DESIGN_BIBLE.md` §end). It is the creative foundation for templates.
- **Code comments:** explain *why* at architectural boundaries (sanitization, export constraints, registry intent), not *what* (code is self-evident).
- **Every architectural change** must be reflected back into `ARCHITECTURE.md` by proposal + approval, so the document never drifts from reality.
- **The WebWoven Standard (Design Bible §23)** applies to documentation too: clarity over volume; if a doc would make the platform less clear, it is redesigned.

---

## 45. The WebWoven Standard — Architectural Translation

Design Bible §23 requires every feature to pass eight questions. Architecturally, these translate to:

1. **More premium?** → Does it use tokens, restraint, and the established motion bands?
2. **Improves clarity?** → Does it reduce branching / centralize via registry or state?
3. **On-language?** → Does it use the existing `data-*` + CSS-variable + sanitization patterns?
4. **Scalable?** → Is it data + asset, not engine logic? (§37 rule)
5. **Future-proof?** → Does it avoid hardcoding and secrets-in-client?
6. **Elevates identity?** → Does the card (not the chrome) dominate?
7. **Consistent across sizes/layouts/exports?** → Does the change work in vertical/horizontal, all sizes, and both HTML + Gmail export?
8. **Implementable consistently?** → Can it be expressed as a registry entry + CSS?

A "no" at any point means redesign before implementation — never a silent workaround.

---

## 46. Final Architectural Invariants

These must hold for all future work:

1. `appState` is the only source of truth; the DOM is a projection.
2. Rendering is attribute-driven (`data-*`) + CSS variables; no layout JavaScript.
3. All user input is sanitized at the render boundary (`sanitizeHTML`/`sanitizeURL`/`sanitizeImageURL`).
4. Export is a pure function of state + sanitized DOM; web and email are separate engines.
5. New Collections/Themes/Templates are data + CSS, never engine edits.
6. External links use `rel="noopener noreferrer"`; email export is always static.
7. Motion is gated by `animationsEnabled` + `prefers-reduced-motion`.
8. No secrets in the client; backend is action-based and swappable.
9. `DESIGN_BIBLE.md` and `ARCHITECTURE.md` are locked; conflicts are resolved by proposal.

---

*End of Architecture Specification (Master Blueprint) v1.0. This document is locked. Future changes require explicit approval and a version bump.*
