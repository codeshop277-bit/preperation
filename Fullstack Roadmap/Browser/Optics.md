# Search Engine Optimization
SEO is the practice of making your website easy for search engines to discover, understand, and rank so it appears higher in search results. 

Search engines (like Google) do three main things:
Crawl – find your pages
Index – understand your content
Rank – decide where to show it in search results

How SEO works in React
Browser → index.html (almost empty)
        → JS loads
        → API calls
        → DOM updates
Search engine initially sees
<div id="root"></div>
Crawlers may not wait for the content to load.

By using react-helmet we can help in metadata not in html
import { Helmet } from "react-helmet";
<Helmet>
  <title>Best Shoes for Running</title>
  <meta name="description" content="Buy the best running shoes online" />
</Helmet>

SEO in nextjs
| Mode    | SEO  | When                     |
| ------- | ---- | ------------------------ |
| **SSG** | ⭐⭐⭐⭐ | Blogs, landing pages     |
| **SSR** | ⭐⭐⭐⭐ | Auth, personalized pages |
| **ISR** | ⭐⭐⭐⭐ | CMS + fresh content      |
| **CSR** | ⭐⭐   | Dashboards               |


# SSG
export async function generateStaticParams() {
  return [{ slug: "react-seo" }];
}

# SSR
export const dynamic = "force-dynamic";

# What is Metadata?
Metadata is non-visible information that tells search engines and social platforms what your page is about.
Key metadata:
<title>
<meta name="description">
<meta name="robots">

# React Handling Metadata
import { Helmet } from "react-helmet";
<Helmet>
  <title>SEO Guide</title>
  <meta name="description" content="Learn SEO in React and Next.js" />
</Helmet>
Problems:
Runs after JS loads
Crawlers may miss it
Duplication across routes is common

# Next.js Handling (Correct Way)
export const metadata = {
  title: "SEO Guide",
  description: "Learn SEO in React and Next.js",
};
✅ Generated on server
✅ Included in initial HTML
✅ No hydration mismatch

# Dynamice Metadata
Metadata that changes per page
Blog title
Product name
User-generated pages

Impact On SEO
Prevents duplicate titles
Improves keyword targeting
Critical for large content sites

# Open Graph & Twitter Cards
Metadata used by:
WhatsApp
Twitter (X)
LinkedIn
Slack

Impact
Better link previews
Higher CTR
Indirect SEO improvement

export const metadata = {
  openGraph: {
    title: "SEO Guide",
    description: "Complete SEO breakdown",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
  },
};
✅ Zero client JS
✅ Pre-rendered previews

# Canonical URLs
Tells Search engine which URL is the “main” version of a page.
<link rel="canonical" href="https://site.com/blog/seo" />
Impact
Prevents duplicate content penalties
Consolidates page ranking signals

Common Duplication Cases
/page
/page?ref=twitter
/page/
Nextjs handling
export const metadata = {
  alternates: {
    canonical: "https://site.com/blog/seo",
  },
};

# Sitemap
Helps search engines discover pages faster
<url>
  <loc>https://site.com/blog/seo</loc>
</url>

# Robots.txt
Controls crawl permissions
User-agent: *
Allow: /
Disallow: /admin

Impact
Faster indexing
Avoids crawling junk pages
Improves crawl budget

NextJs
export default function sitemap() {
  return [
    {
      url: "https://site.com",
      lastModified: new Date(),
    },
  ];
}
export default {
  rules: {
    userAgent: "*",
    allow: "/",
    disallow: "/admin",
  },
};

# Accessibility basics
 ARIA - Accessibility Rich Internet Application
 aria-label is used to provide an accessible name to an element when its visible text is missing, unclear, or not sufficient—especially for screen reader users.

 When to use vs NOT use aria-label
✅ Use aria-label when:
Button/link has no visible text
UI uses icons only
Custom components (dropdowns, modals, toggles)

❌ Avoid aria-label when:
There is clear visible text
A <label> can be used
You’re duplicating obvious content

Impact
Better crawlability
Improved Lighthouse SEO score

# SEO Pitfalls in Single Page Applications

| Problem           | Impact              |
| ----------------- | ------------------- |
| Empty HTML        | Page not indexed    |
| Client-only fetch | Content invisible   |
| JS-heavy          | Crawl budget wasted |
| Duplicate routes  | Ranking split       |

Search engines may:
Not wait for hydration
Time out
Skip indexing

Solution
✅ Use Next.js SSR / SSG
✅ Avoid client-only content for public pages

# Duplicate Content Issues
Same content under multiple URLs
Filters & pagination
Query params

Impact
Ranking dilution
Index bloat
Wrong page ranking

Fixes
Canonical URLs
noindex meta
Proper routing

# Lighthouse a tool by google to audit SEO, Performance and Accessibility

SEO Checks Include
Title & description
Crawlable links
Mobile friendliness
Indexability
ARIA & landmarks

Key Landmarks:
<header>
<nav>
<main>
<footer>

Typical SPA SEO Score
❌ 60–70

Typical Next.js SEO Score
✅ 90–100