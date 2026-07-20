export const DEFAULT_PROFILE = {
  id: "",
  name: "John Doe",
  jobTitle: "Senior Software Engineer",
  company: "Tech Solutions Inc.",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  website: "https://johndoe.dev",
  imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  
  // Dynamic Social Links Array
  socialLinks: [
    { platform: "linkedin", url: "https://linkedin.com/in/johndoe", enabled: true },
    { platform: "twitter", url: "https://twitter.com/johndoe", enabled: true },
    { platform: "github", url: "https://github.com/johndoe", enabled: true }
  ],
  
  // Design defaults
  theme: "light",
  accentColor: "#c92a2a",
  orientation: "vertical",
  size: "standard",
  alignment: "left",
  
  // Collection / Template metadata (future-ready extension points).
  // Default collection 'signature' reproduces the current application look exactly.
  // Default template 'standard' reproduces the current card structure exactly.
  collection: "signature",
  template: "standard",
  animationsEnabled: true,
  
  // Metadata
  createdAt: null,
  lastUpdated: null
};

export const SOCIAL_PLATFORMS = [
  { id: "website", name: "Website", icon: "🌐" },
  { id: "linkedin", name: "LinkedIn", icon: "󰌻" },
  { id: "twitter", name: "X (Twitter)", icon: "󰆚" },
  { id: "facebook", name: "Facebook", icon: "󰈄" },
  { id: "instagram", name: "Instagram", icon: "󰈏" },
  { id: "tiktok", name: "TikTok", icon: "󰈓" },
  { id: "youtube", name: "YouTube", icon: "󰈗" },
  { id: "github", name: "GitHub", icon: "󰊤" },
  { id: "gitlab", name: "GitLab", icon: "󰊢" },
  { id: "behance", name: "Behance", icon: "󰈁" },
  { id: "dribbble", name: "Dribbble", icon: "󰈈" },
  { id: "medium", name: "Medium", icon: "󰈒" },
  { id: "devto", name: "Dev.to", icon: "󰈊" },
  { id: "discord", name: "Discord", icon: "󰈉" },
  { id: "telegram", name: "Telegram", icon: "󰈕" },
  { id: "whatsapp", name: "WhatsApp", icon: "󰈙" },
  { id: "snapchat", name: "Snapchat", icon: "󰈖" },
  { id: "pinterest", name: "Pinterest", icon: "󰈔" },
  { id: "reddit", name: "Reddit", icon: "󰈑" },
  { id: "threads", name: "Threads", icon: "󰈘" },
  { id: "twitch", name: "Twitch", icon: "󰈜" },
  { id: "stackoverflow", name: "Stack Overflow", icon: "󰈛" },
  { id: "custom", name: "Custom Platform", icon: "󰈍" }
];

export const SIZES = [
  { id: "standard", name: "Standard (400px)" },
  { id: "compact", name: "Compact (320px)" },
  { id: "large", name: "Large (600px)" },
  { id: "signature", name: "Email Signature" }
];

export const ORIENTATIONS = [
  { id: "vertical", name: "Vertical" },
  { id: "horizontal", name: "Horizontal" }
];

export const ALIGNMENTS = [
  { id: "left", name: "Left Aligned" },
  { id: "center", name: "Center Aligned" }
];

/**
 * COLLECTIONS — the central registry of artistic directions (Design Bible §17, ARCHITECTURE §18).
 *
 * A Collection defines art direction (typography mood, color language, signature motion),
 * NOT layout (that is a Template) and NOT surface (that is a Theme).
 *
 * Adding a future Collection = register via StudioManager (one entry + one CSS file).
 * The Preview Engine, Export Engine, and Gmail exporter read from the Studio Manager.
 * No engine rewrite is required (ARCHITECTURE §37). This is the single source of
 * truth for every Collection.
 *
 * `signature` is the WebWoven Studios flagship and the DEFAULT. Its tokens
 * (accent #c92a2a, secondary #e85d04, radius 20px) exactly match css/cards/base.css +
 * css/collections/signature.css, so the default rendering and export are unchanged.
 *
 * METADATA SHAPE (every Collection defines these):
 *   id, name, description      — identity / display
 *   philosophy                  — the design belief behind the collection
 *   bestFor                     — recommended use cases (array of strings)
 *   motionLevel                  — 'static' | 'subtle' | 'moderate' | 'rich'
 *   layouts                    — card structure variants this collection offers
 *   templates                  — template ids supported (subset of TEMPLATES)
 *   supportedThemes           — theme ids valid for this collection (subset of THEMES)
 *   supportedAnimations       — animation pack ids available to this collection
 *   animationPack             — default animation pack id ('' = none / static)
 *   fonts                     — { display, body, mono } font roles
 *   tokens                    — CSS custom properties (collection art-direction)
 *   css                       — path to the collection's standalone CSS partial
 *   exportRules               — { html: 'full'|'static', gmail: 'static' } render policy
 *   thumbnail / preview / cover — asset refs for the future selection UI (Task 7)
 *   version                    — collection schema version
 *   premium                   — whether this collection is gated behind a plan
 *   locked                    — UI lock state (paired with premium / requiredPlan)
 */
export const COLLECTIONS = [
  {
    id: "signature",
    name: "Signature",
    description: "The WebWoven Studios flagship collection. Clean, premium, timeless — the quality benchmark for every card.",
    philosophy: "The person is the product. Restraint, craft, and editorial calm expressed through considered spacing, hierarchy, and a single confident accent.",
    bestFor: ["Professionals", "Founders", "Consultants", "Agencies", "General premium identity"],
    motionLevel: "static",
    layouts: ["standard", "compact", "large", "signature", "horizontal"],
    templates: ["standard", "compact", "large", "signature", "horizontal"],
    supportedThemes: ["light", "dark", "glass", "dark-glass"],
    supportedAnimations: ["signature-reveal"],
    animationPack: "",
    motionLabel: "Minimal Motion",
    fonts: { display: "Inter", body: "Inter", mono: "monospace" },
    tokens: {
      "--card-accent": "#c92a2a",
      "--card-accent-2": "#e85d04",
      "--card-radius": "20px"
    },
    css: "",
    exportRules: { html: "full", gmail: "static" },
    thumbnail: "",
    preview: "",
    cover: "",
    version: "2.0.0",
    premium: false,
    locked: false
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Luxury magazine editorial identity — oversized typography, asymmetric layout, elegant whitespace, cinematic reveals.",
    philosophy: "The person as a cover story. Editorial calm, confident hierarchy, and a single accent against generous negative space.",
    bestFor: ["Writers", "Consultants", "Founders", "Creative directors", "Thought leaders"],
    motionLevel: "moderate",
    layouts: ["standard", "large", "horizontal", "signature"],
    templates: ["standard", "large", "horizontal", "signature"],
    supportedThemes: ["light", "dark", "glass", "dark-glass"],
    supportedAnimations: ["editorial-reveal"],
    animationPack: "editorial-reveal",
    motionLabel: "Cinematic Reveal",
    fonts: { display: "Georgia, 'Times New Roman', serif", body: "Inter", mono: "monospace" },
    tokens: {
      "--card-accent": "#c92a2a",
      "--card-accent-2": "#1a1a1a"
    },
    css: "collections/editorial.css",
    exportRules: { html: "full", gmail: "static" },
    thumbnail: "",
    preview: "",
    cover: "",
    version: "1.0.0",
    premium: false,
    locked: false
  },
  {
    id: "executive",
    name: "Executive",
    description: "Corporate-luxury identity for leaders — large portrait, executive spacing, premium typography, subtle gradients, refined borders.",
    philosophy: "Authority through restraint. A confident portrait, disciplined hierarchy, and a single refined accent communicate leadership without noise.",
    bestFor: ["CEOs", "Founders", "Consultants", "Lawyers", "Executives", "Board members"],
    motionLevel: "subtle",
    layouts: ["standard", "large", "horizontal", "signature"],
    templates: ["standard", "large", "horizontal", "signature"],
    supportedThemes: ["light", "dark", "glass", "dark-glass"],
    supportedAnimations: ["executive"],
    animationPack: "executive",
    motionLabel: "Light Sweep",
    fonts: { display: "Inter", body: "Inter", mono: "monospace" },
    tokens: {
      "--card-accent": "#b8924a",
      "--card-accent-2": "#1c2230"
    },
    css: "collections/executive.css",
    exportRules: { html: "full", gmail: "static" },
    thumbnail: "",
    preview: "",
    cover: "",
    version: "1.0.0",
    premium: false,
    locked: false
  },
  {
    id: "luxury",
    name: "Luxury",
    description: "Bespoke premium branding — matte surfaces, restrained gold, elegant serif, and a single soft light reflection. Understated prestige.",
    philosophy: "Identity as a luxury house. Matte depth, a single restrained gold accent, generous spacing, and a quiet sheen communicate heritage and exclusivity without spectacle.",
    bestFor: ["Luxury brands", "Consultants", "Founders", "Hospitality", "High-end creatives", "Executives"],
    motionLevel: "subtle",
    layouts: ["standard", "large", "horizontal", "signature", "compact"],
    templates: ["standard", "large", "horizontal", "signature", "compact"],
    supportedThemes: ["light", "dark", "glass", "dark-glass"],
    supportedAnimations: ["luxury-shine"],
    animationPack: "luxury-shine",
    motionLabel: "Soft Shine",
    fonts: { display: "Georgia, 'Times New Roman', serif", body: "Inter", mono: "monospace" },
    tokens: {
      "--card-accent": "#a9853f",
      "--card-accent-2": "#d8b878"
    },
    css: "collections/luxury.css",
    exportRules: { html: "full", gmail: "static" },
    thumbnail: "",
    preview: "",
    cover: "",
    version: "1.0.0",
    premium: true,
    locked: false
  },
  {
    id: "motion",
    name: "Motion",
    description: "Movement as identity — floating gradients, aurora backgrounds, breathing layout, and liquid shapes. Calm, elegant, alive.",
    philosophy: "Motion is the material. Soft aurora fields, gentle floating, and breathing depth make the card feel alive while obeying restraint — quality, never attention.",
    bestFor: ["Creatives", "Product designers", "Agencies", "Musicians", "Storytellers", "Brands in motion"],
    motionLevel: "rich",
    layouts: ["standard", "large", "horizontal", "signature"],
    templates: ["standard", "large", "horizontal", "signature"],
    supportedThemes: ["light", "dark", "glass", "dark-glass"],
    supportedAnimations: ["aurora-flow"],
    animationPack: "aurora-flow",
    motionLabel: "Aurora Flow",
    fonts: { display: "Inter", body: "Inter", mono: "monospace" },
    tokens: {
      "--card-accent": "#6d5efc",
      "--card-accent-2": "#22d3ee"
    },
    css: "collections/motion.css",
    exportRules: { html: "full", gmail: "static" },
    thumbnail: "",
    preview: "",
    cover: "",
    version: "1.0.0",
    premium: false,
    locked: false
  },
  {
    id: "creative",
    name: "Creative",
    description: "Expressive but composed — bold typography, asymmetric composition, overlapping elements, and layered depth. A design-studio signature.",
    philosophy: "Confident self-expression within structure. Asymmetry, overlapping planes, and bold type create energy; disciplined spacing keeps it from chaos.",
    bestFor: ["Design studios", "Art directors", "Photographers", "Portfolio sites", "Agencies", "Illustrators"],
    motionLevel: "moderate",
    layouts: ["standard", "large", "horizontal", "signature", "compact"],
    templates: ["standard", "large", "horizontal", "signature", "compact"],
    supportedThemes: ["light", "dark", "glass", "dark-glass"],
    supportedAnimations: ["creative-reveal"],
    animationPack: "creative-reveal",
    motionLabel: "Creative Reveal",
    fonts: { display: "'Archivo Black', 'Arial Black', sans-serif", body: "Inter", mono: "monospace" },
    tokens: {
      "--card-accent": "#ff5a3c",
      "--card-accent-2": "#ffd23f"
    },
    css: "collections/creative.css",
    exportRules: { html: "full", gmail: "static" },
    thumbnail: "",
    preview: "",
    cover: "",
    version: "1.0.0",
    premium: false,
    locked: false
  },
  {
    id: "tech",
    name: "Tech",
    description: "Precision and future — sharp spacing, neon accents, subtle glows, orbital detail, and clean geometry. Built for AI, SaaS, and developer tools.",
    philosophy: "Digital precision as identity. A faint engineering grid, a single neon accent, and a slow orbital glow signal a product built for what comes next.",
    bestFor: ["AI startups", "SaaS", "Developer tools", "Cybersecurity", "Futurists", "Hardware brands"],
    motionLevel: "subtle",
    layouts: ["standard", "large", "horizontal", "signature"],
    templates: ["standard", "large", "horizontal", "signature"],
    supportedThemes: ["light", "dark", "glass", "dark-glass"],
    supportedAnimations: ["tech-pulse"],
    animationPack: "tech-pulse",
    motionLabel: "Tech Pulse",
    fonts: { display: "'Space Grotesk', 'Segoe UI', sans-serif", body: "Inter", mono: "'JetBrains Mono', monospace" },
    tokens: {
      "--card-accent": "#13f1c6",
      "--card-accent-2": "#0ea5e9"
    },
    css: "collections/tech.css",
    exportRules: { html: "full", gmail: "static" },
    thumbnail: "",
    preview: "",
    cover: "",
    version: "1.0.0",
    premium: false,
    locked: false
  },
  {
    id: "organic",
    name: "Organic",
    description: "Soft, natural, human — paper textures, warm tones, organic blobs, and Scandinavian calm. Handcrafted, never clinical.",
    philosophy: "Warmth through imperfection. Paper grain, gentle blobs, and a humanist rhythm make the identity feel made-by-hand rather than machine-made.",
    bestFor: ["Wellness", "Lifestyle brands", "Photographers", "Coaches", "Nature brands", "Makers"],
    motionLevel: "subtle",
    layouts: ["standard", "large", "horizontal", "signature", "compact"],
    templates: ["standard", "large", "horizontal", "signature", "compact"],
    supportedThemes: ["light", "dark", "glass", "dark-glass"],
    supportedAnimations: ["organic-drift"],
    animationPack: "organic-drift",
    motionLabel: "Organic Drift",
    fonts: { display: "'Georgia', 'Iowan Old Style', serif", body: "Inter", mono: "monospace" },
    tokens: {
      "--card-accent": "#c2683f",
      "--card-accent-2": "#7f9e6e"
    },
    css: "collections/organic.css",
    exportRules: { html: "full", gmail: "static" },
    thumbnail: "",
    preview: "",
    cover: "",
    version: "1.0.0",
    premium: false,
    locked: false
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Almost nothing. Maximum whitespace, typography-first, near-invisible decoration, restrained color. Timeless and exact.",
    philosophy: "Subtract until only meaning remains. One typeface, vast space, a single hairline — the person's name carries the entire design.",
    bestFor: ["Minimalists", "Writers", "Architects", "Swiss-design fans", "Executives", "Anyone who values calm"],
    motionLevel: "static",
    layouts: ["standard", "large", "horizontal", "signature", "compact"],
    templates: ["standard", "large", "horizontal", "signature", "compact"],
    supportedThemes: ["light", "dark", "glass", "dark-glass"],
    supportedAnimations: ["minimal-fade"],
    animationPack: "minimal-fade",
    motionLabel: "Minimal Fade",
    fonts: { display: "Inter", body: "Inter", mono: "monospace" },
    tokens: {
      "--card-accent": "#111111",
      "--card-accent-2": "#868e96"
    },
    css: "collections/minimal.css",
    exportRules: { html: "full", gmail: "static" },
    thumbnail: "",
    preview: "",
    cover: "",
    version: "1.0.0",
    premium: false,
    locked: false
  },
  {
    id: "hero",
    name: "Hero",
    description: "The portrait is the design. Your image becomes a full-bleed cinematic background while your name leads and contacts float in glass panels.",
    philosophy: "Identity as a stage. The person's photograph carries the entire composition; typography and glass panels are layered on top with cinematic restraint, never competing with the face.",
    bestFor: ["Photographers", "Actors", "Speakers", "Founders", "Creators", "Anyone whose face is the brand"],
    motionLevel: "moderate",
    layouts: ["standard", "large", "horizontal", "signature", "compact"],
    templates: ["standard", "large", "horizontal", "signature", "compact"],
    supportedThemes: ["light", "dark", "glass", "dark-glass"],
    supportedAnimations: ["hero-reveal"],
    animationPack: "hero-reveal",
    motionLabel: "Cinematic Reveal",
    fonts: { display: "Inter", body: "Inter", mono: "monospace" },
    tokens: {
      "--card-accent": "#ffffff",
      "--card-accent-2": "#ffd27d"
    },
    css: "collections/hero.css",
    exportRules: { html: "full", gmail: "static" },
    thumbnail: "",
    preview: "",
    cover: "",
    version: "1.0.0",
    premium: false,
    locked: false
  }
  // Future collections are registered here via StudioManager.registerCollection(). Engine code does NOT change.
];

/**
 * THEMES — the scalable registry of surface treatments (ARCHITECTURE §19).
 *
 * A Theme modifies appearance (light/dark/surface) WITHOUT changing layout or art direction.
 * Themes are pure CSS variable blocks (css/themes/<id>.css); switching is a single
 * data-attribute flip on the card. The registry supports unlimited themes.
 *
 * METADATA SHAPE (every Theme defines these):
 *   id, name, description      — identity / display
 *   colorTokens                — semantic color overrides ({ bg, text, textMuted, surface })
 *   typographyTokens          — font / weight overrides for the surface
 *   shadowTokens               — elevation overrides
 *   borderTokens               — border style/width/color overrides
 *   glass                      — { enabled, blur, transparency, borderOpacity } behavior
 *   background                 — { type: 'solid'|'gradient'|'mesh'|'texture', value }
 *   compatibility              — { collections: [], exports: ['html','gmail'] }
 */
export const THEMES = [
  {
    id: "light", name: "Light", file: "themes/light.css",
    description: "Clean, bright, highest-contrast surface.",
    colorTokens: { bg: "#ffffff", text: "#1a1a1a", textMuted: "#666666", surface: "#f8f9fa" },
    typographyTokens: {}, shadowTokens: {}, borderTokens: { color: "rgba(0,0,0,0.05)" },
    glass: { enabled: false }, background: { type: "solid", value: "#ffffff" },
    compatibility: { collections: ["signature", "editorial", "executive", "luxury", "motion", "creative", "tech", "organic", "minimal", "hero"], exports: ["html", "gmail"] }
  },
  {
    id: "dark", name: "Dark", file: "themes/dark.css",
    description: "Premium dark surface with soft contrast.",
    colorTokens: { bg: "#121212", text: "#ffffff", textMuted: "#a0a0a0", surface: "#1e1e1e" },
    typographyTokens: {}, shadowTokens: {}, borderTokens: { color: "rgba(255,255,255,0.1)" },
    glass: { enabled: false }, background: { type: "solid", value: "#121212" },
    compatibility: { collections: ["signature", "editorial", "executive", "luxury", "motion", "creative", "tech", "organic", "minimal", "hero"], exports: ["html", "gmail"] }
  },
  {
    id: "glass", name: "Glass", file: "themes/glass.css",
    description: "Physical glassmorphism with soft blur and thin borders.",
    colorTokens: { bg: "rgba(255,255,255,0.7)", text: "#1a1a1a", textMuted: "#444444", surface: "rgba(255,255,255,0.4)" },
    typographyTokens: {}, shadowTokens: {}, borderTokens: { color: "rgba(255,255,255,0.3)" },
    glass: { enabled: true, blur: "20px", transparency: 0.7, borderOpacity: 0.3 },
    background: { type: "solid", value: "rgba(255,255,255,0.7)" },
    compatibility: { collections: ["signature", "editorial", "executive", "luxury", "motion", "creative", "tech", "organic", "minimal", "hero"], exports: ["html"] }
  },
  {
    id: "dark-glass", name: "Dark Glass", file: "themes/dark-glass.css",
    description: "Dark glassmorphism for moody, premium surfaces.",
    colorTokens: { bg: "rgba(18,18,18,0.7)", text: "#ffffff", textMuted: "#cccccc", surface: "rgba(255,255,255,0.05)" },
    typographyTokens: {}, shadowTokens: {}, borderTokens: { color: "rgba(255,255,255,0.1)" },
    glass: { enabled: true, blur: "20px", transparency: 0.7, borderOpacity: 0.1 },
    background: { type: "solid", value: "rgba(18,18,18,0.7)" },
    compatibility: { collections: ["signature", "editorial", "executive", "luxury", "motion", "creative", "tech", "organic", "minimal", "hero"], exports: ["html"] }
  }
  // Future themes (Frosted, Luxury, Editorial, Matte, Minimal, Neon, Aurora, Cyber,
  // Premium White, Premium Black) are added as additional entries. Unlimited.
];

/**
 * TEMPLATES — the scalable registry of card structures (ARCHITECTURE §20).
 *
 * A Template defines layout/structure (DOM arrangement + size/orientation defaults).
 * Collections define art direction; Themes define surface; Templates define structure.
 * The registry supports unlimited templates.
 *
 * METADATA SHAPE (every Template defines these):
 *   id, name, file             — identity + css/templates/<id>.css partial
 *   orientation                 — 'vertical' | 'horizontal' | 'both'
 *   size                        — default size id applied when selected
 *   layoutType                  — 'card' | 'signature' | 'banner' | 'hero' | 'magazine'
 *   compatibleCollections      — collection ids this template is valid for (subset)
 *   compatibleThemes          — theme ids this template supports
 *   responsive                 — { behavior: 'fluid'|'fixed', breakpoints: [] }
 *   exportBehavior             — { html: 'full', gmail: 'static'|'none' }
 */
export const TEMPLATES = [
  {
    id: "standard", name: "Standard Card", file: "templates/standard.css",
    orientation: "vertical", size: "standard", layoutType: "card",
    compatibleCollections: ["signature", "editorial", "executive", "luxury", "motion", "creative", "tech", "organic", "minimal", "hero"], compatibleThemes: ["light", "dark", "glass", "dark-glass"],
    responsive: { behavior: "fluid", breakpoints: [600, 900] },
    exportBehavior: { html: "full", gmail: "static" }
  },
  {
    id: "compact", name: "Compact Card", file: "templates/compact.css",
    orientation: "vertical", size: "compact", layoutType: "card",
    compatibleCollections: ["signature", "editorial", "executive", "luxury", "motion", "creative", "tech", "organic", "minimal", "hero"], compatibleThemes: ["light", "dark", "glass", "dark-glass"],
    responsive: { behavior: "fluid", breakpoints: [600, 900] },
    exportBehavior: { html: "full", gmail: "static" }
  },
  {
    id: "large", name: "Large Card", file: "templates/large.css",
    orientation: "vertical", size: "large", layoutType: "card",
    compatibleCollections: ["signature", "editorial", "executive", "luxury", "motion", "creative", "tech", "organic", "minimal", "hero"], compatibleThemes: ["light", "dark", "glass", "dark-glass"],
    responsive: { behavior: "fluid", breakpoints: [600, 900] },
    exportBehavior: { html: "full", gmail: "static" }
  },
  {
    id: "signature", name: "Email Signature", file: "templates/signature.css",
    orientation: "horizontal", size: "signature", layoutType: "signature",
    compatibleCollections: ["signature", "editorial", "executive", "luxury", "motion", "creative", "tech", "organic", "minimal", "hero"], compatibleThemes: ["light", "dark", "glass", "dark-glass"],
    responsive: { behavior: "fluid", breakpoints: [600] },
    exportBehavior: { html: "full", gmail: "static" }
  },
  {
    id: "horizontal", name: "Horizontal Card", file: "templates/horizontal.css",
    orientation: "horizontal", size: "standard", layoutType: "card",
    compatibleCollections: ["signature", "editorial", "executive", "luxury", "motion", "creative", "tech", "organic", "minimal", "hero"], compatibleThemes: ["light", "dark", "glass", "dark-glass"],
    responsive: { behavior: "fluid", breakpoints: [600, 900] },
    exportBehavior: { html: "full", gmail: "static" }
  }
  // Future templates (Social, Executive, Magazine, Hero, Banner, Vertical) added later.
];

/**
 * ANIMATION_PACKS — the scalable registry of motion packs (ARCHITECTURE §21, Design Bible §10–§12).
 *
 * An Animation Pack is an INDEPENDENT MODULE attached to a card via a collection's
 * `animationPack` id. The AnimationEngine reads it from the Studio Manager and reflects
 * it as `data-animation-pack="<id>"` on the card; the keyframes live in
 * css/animations/<id>.css and only activate when a pack is assigned.
 *
 * This phase establishes the FRAMEWORK only. Premium motion packs
 * (Editorial Reveal, Aurora, Liquid Morph, Shimmer, Spotlight, Glass Reflection,
 * Floating Gradient, etc.) are added later as keyframe/selector definitions + entries here.
 * None are implemented now (the engine is a no-op for collections without a pack).
 *
 * METADATA SHAPE (every Animation Pack defines these):
 *   id, name                    — identity
 *   motionPhilosophy           — the feeling the motion communicates
 *   intensity                  — 'subtle' | 'moderate' | 'rich' (Design Bible §10)
 *   durationPresets           — { micro, hover, page, background, breathing } in ms
 *   trigger                    — 'load' | 'hover' | 'scroll' | 'interaction'
 *   reducedMotionFallback    — 'static' | 'reduced' (always resolves safely)
 *   exportCompatible          — whether the pack can ship in HTML export (gmail is always static)
 *   gpuAccelerated           — true when only transform/opacity are used
 */
export const ANIMATION_PACKS = [
  {
    id: "", name: "None (Static)",
    motionPhilosophy: "No motion. Maximum calm and compatibility.",
    intensity: "subtle", durationPresets: {}, trigger: "none",
    reducedMotionFallback: "static", exportCompatible: true, gpuAccelerated: true
  },
  {
    id: "editorial-reveal", name: "Editorial Reveal",
    motionPhilosophy: "Cinematic but restrained: fade, rise, line-draw, gentle grain. Communicates craft, never demands attention.",
    intensity: "moderate",
    durationPresets: { micro: 150, hover: 250, page: 500, background: 24000, breathing: 0 },
    trigger: "load",
    reducedMotionFallback: "static",
    exportCompatible: true,
    gpuAccelerated: true
  },
  {
    id: "executive", name: "Executive",
    motionPhilosophy: "Corporate calm: soft light sweep, slow breathing glow, gentle reveal, very subtle hover depth.",
    intensity: "subtle",
    durationPresets: { micro: 150, hover: 250, page: 500, background: 0, breathing: 7000 },
    trigger: "load",
    reducedMotionFallback: "static",
    exportCompatible: true,
    gpuAccelerated: true
  },
  {
    id: "luxury-shine", name: "Soft Shine",
    motionPhilosophy: "Quiet prestige: a slow light sweep across a matte surface, a soft breathing glow, and a gentle reveal. Never sparkles.",
    intensity: "subtle",
    durationPresets: { micro: 150, hover: 250, page: 600, background: 0, breathing: 7000 },
    trigger: "load",
    reducedMotionFallback: "static",
    exportCompatible: true,
    gpuAccelerated: true
  },
  {
    id: "aurora-flow", name: "Aurora Flow",
    motionPhilosophy: "Alive but calm: drifting aurora background, gentle floating of the card, slow breathing depth, and a soft glow. Movement is the identity.",
    intensity: "rich",
    durationPresets: { micro: 150, hover: 300, page: 700, background: 28000, breathing: 8000 },
    trigger: "load",
    reducedMotionFallback: "static",
    exportCompatible: true,
    gpuAccelerated: true
  },
  {
    id: "creative-reveal", name: "Creative Reveal",
    motionPhilosophy: "Expressive reveal: staggered slide-up of planes, overlapping layers easing into place, a confident fade. Energy within discipline.",
    intensity: "moderate",
    durationPresets: { micro: 150, hover: 250, page: 550, background: 0, breathing: 0 },
    trigger: "load",
    reducedMotionFallback: "static",
    exportCompatible: true,
    gpuAccelerated: true
  },
  {
    id: "tech-pulse", name: "Tech Pulse",
    motionPhilosophy: "Digital precision: a soft glow pulse on accents, a faint grid settling in, and a slow orbital glow. Engineered calm.",
    intensity: "subtle",
    durationPresets: { micro: 120, hover: 200, page: 500, background: 0, breathing: 6000 },
    trigger: "load",
    reducedMotionFallback: "static",
    exportCompatible: true,
    gpuAccelerated: true
  },
  {
    id: "organic-drift", name: "Organic Drift",
    motionPhilosophy: "Handcrafted calm: organic blobs drift slowly, the surface breathes gently, a soft fade reveals content. Warm, never mechanical.",
    intensity: "subtle",
    durationPresets: { micro: 150, hover: 250, page: 600, background: 22000, breathing: 9000 },
    trigger: "load",
    reducedMotionFallback: "static",
    exportCompatible: true,
    gpuAccelerated: true
  },
  {
    id: "minimal-fade", name: "Minimal Fade",
    motionPhilosophy: "Almost still: a single gentle fade-in of the content. Restraint as the statement.",
    intensity: "static",
    durationPresets: { micro: 150, hover: 200, page: 500, background: 0, breathing: 0 },
    trigger: "load",
    reducedMotionFallback: "static",
    exportCompatible: true,
    gpuAccelerated: true
  },
  {
    id: "hero-reveal", name: "Cinematic Reveal",
    motionPhilosophy: "Cinematic: the portrait breathes with subtle parallax, content rises in, the profession divider draws in, and glass panels breathe. Portrait-led, never aggressive.",
    intensity: "moderate",
    durationPresets: { micro: 150, hover: 250, page: 700, background: 0, breathing: 7000 },
    trigger: "load",
    reducedMotionFallback: "static",
    exportCompatible: true,
    gpuAccelerated: true
  }
  // Future packs (aurora, liquid-morph, shimmer, spotlight, glass-reflection,
  // floating-gradient, breathe, particle-field) added here.
  // The AnimationEngine already resolves them by id; no engine change required.
];

/**
 * Registry lookup helpers. These centralize "find by id" so the rest of the app never
 * hardcodes collection/theme/template logic. Returns undefined if not found (callers
 * must default gracefully to preserve current behavior).
 */
export const getCollection = (id) => COLLECTIONS.find(c => c.id === id);
export const getTheme = (id) => THEMES.find(t => t.id === id);
export const getTemplate = (id) => TEMPLATES.find(t => t.id === id);

/**
 * Resolve the effective token set for a given collection.
 * Returns the collection's tokens, or an empty object if the collection is unknown.
 * Used by the Preview Engine (inline custom properties) and the Export Engine (composed CSS).
 * Defaults to the signature collection so unknown/legacy ids fall back to the current look.
 */
export const getCollectionTokens = (id) => {
  const collection = getCollection(id) || getCollection("signature");
  return collection ? (collection.tokens || {}) : {};
};
