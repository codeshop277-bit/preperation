# How WhatsApp Link Previews Work (OG Tags, SPAs, Amazon Example)
When a URL is shared on WhatsApp, it often shows a preview card containing:
Page title
Description
Image
Domain

How WhatsApp Generates a Link Preview
Step-by-Step Flow

User pastes a URL in WhatsApp
https://www.amazon.in/dp/B0XXXXXX

WhatsApp servers fetch the URL
This is a server-side HTTP request
Not your browser
No JavaScript execution

WhatsApp parses the raw HTML response
Reads only <head> metadata
Ignores client-side rendering
Preview card is constructed-Image, Title, Description, Domain

What Metadata Does WhatsApp Use?
✅ Open Graph (OG) Tags

WhatsApp relies entirely on Open Graph metadata:
<meta property="og:title" content="Apple iPhone 15 (128 GB)" />
<meta property="og:description" content="Buy Apple iPhone 15 online" />
<meta property="og:image" content="https://example.com/image.jpg" />
<meta property="og:url" content="https://amazon.in/dp/B0XXXXXX" />
<meta property="og:type" content="product" />

Metadata by platform
| Platform    | Metadata Used                    |
| ----------- | -------------------------------- |
| WhatsApp    | Open Graph                       |
| Facebook    | Open Graph                       |
| LinkedIn    | Open Graph                       |
| Slack       | Open Graph                       |
| Twitter (X) | Twitter Cards (falls back to OG) |

Amazon uses a hybrid architecture:
Server-side rendering (SSR / Edge)
OG tags generated per product URL
Client-side hydration after first load

Why Typical SPAs Fail WhatsApp Previews
Problems:
OG tags injected after JS loads
WhatsApp does not execute JS
Result: ❌ No preview or incorrect preview

WhatsApp Caching Behavior
WhatsApp caches link previews
Metadata updates may take hours or days
Re-sharing may still show old preview