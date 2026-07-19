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

export const THEMES = [
  { id: "light", name: "Light" },
  { id: "dark", name: "Dark" },
  { id: "glass", name: "Glass" },
  { id: "dark-glass", name: "Dark Glass" }
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
