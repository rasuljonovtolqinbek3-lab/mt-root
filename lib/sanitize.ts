import "server-only";

// Server-side HTML sanitization
// Using a lightweight regex-based approach for Phase 4
// Production: replace with isomorphic-dompurify or sanitize-html

const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "s", "strike",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li", "blockquote", "pre", "code",
  "a", "img", "table", "thead", "tbody", "tr", "th", "td",
  "hr", "div", "span", "sup", "sub",
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel"]),
  img: new Set(["src", "alt", "width", "height", "loading"]),
  td: new Set(["colspan", "rowspan"]),
  th: new Set(["colspan", "rowspan", "scope"]),
  code: new Set(["class"]),
  pre: new Set(["class"]),
  div: new Set(["class"]),
  span: new Set(["class"]),
};

const ALLOWED_SCHEMES = new Set(["https:", "http:", "mailto:", "tel:"]);

function isAllowedUrl(value: string): boolean {
  try {
    const url = new URL(value, "http://localhost");
    return ALLOWED_SCHEMES.has(url.protocol) || value.startsWith("/") || value.startsWith("#");
  } catch {
    return value.startsWith("/") || value.startsWith("#");
  }
}

export function sanitizeHtml(dirty: string): string {
  if (!dirty) return "";

  // Remove script/style/iframe tags and their contents
  let clean = dirty
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[\s\S]*?>/gi, "");

  // Remove event handlers and javascript: URLs
  clean = clean
    .replace(/\son\w+=["']?[^"'>\s]*["']?/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/data:text\/html/gi, "")
    .replace(/expression\(/gi, "");

  // Parse and filter tags/attributes
  return clean.replace(/<\/?([\w-]+)([^>]*)>/g, (match, tagName, attrs) => {
    const lowerTag = tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(lowerTag)) return "";

    // Parse attributes
    const allowedAttrs = ALLOWED_ATTRS[lowerTag] || new Set();
    const attrMatches = attrs.match(/([\w-]+)(?:=["']([^"']*)["']|=[^\s]*|)/g) || [];
    const safeAttrs: string[] = [];

    for (const attr of attrMatches) {
      const [name, ...rest] = attr.split("=");
      const lowerName = name.trim().toLowerCase();
      if (!allowedAttrs.has(lowerName)) continue;

      let value = rest.join("=").trim();
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);

      if ((lowerName === "href" || lowerName === "src") && !isAllowedUrl(value)) continue;
      if (lowerName === "target" && value !== "_blank") continue;

      safeAttrs.push(`${lowerName}="${value.replace(/"/g, "&quot;")}"`);
    }

    if (match.startsWith("</")) {
      return `</${lowerTag}>`;
    }
    return `<${lowerTag}${safeAttrs.length > 0 ? " " + safeAttrs.join(" ") : ""}>`;
  });
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}

export function calculateReadingTime(content: string): number {
  const text = stripHtml(content);
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
