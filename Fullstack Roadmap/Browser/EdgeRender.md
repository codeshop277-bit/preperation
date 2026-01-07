# Edge Render
Edge Rendering = HTML generated at CDN(Cloudfront) edge locations (near the user), not at a central server

# CDN
AWS calls them CloudFront Edge Locations (PoPs)
City-level servers (Bangalore, Chennai, Mumbai, etc.)
Not EC2, not Lambda region

Request FLow 
User (India)
 ↓
CloudFront Edge (Bangalore)
 ↓
EC2 (us-east-1)
 ↓
HTML rendered
 ↓
Response back to India
❌ Request still travels to US-Virginia
❌ No edge rendering

# CloudFront is only a proxy + cache, not a renderer.

| Scenario                          | Goes to US? |
| --------------------------------- | ----------- |
| Static assets (.js, .css, images) | ❌           |
| SSG page                          | ❌           |
| ISR (cache hit)                   | ❌           |
| ISR revalidation                  | ✅           |
| SSR (`getServerSideProps`)        | ✅           |
| API routes                        | ✅           |


Best Possible on AWS 
User
 ↓
CloudFront Edge
 ├─ CloudFront Function (auth / geo / redirects)
 ├─ Cache hit → respond
 └─ Cache miss
        ↓
     Lambda / EC2 (SSR)


True Edge Rendering
User (India)
 ↓
Edge Runtime (Bangalore)
 ↓
HTML rendered HERE
 ↓
Immediate response

PLatforms support edge rendering
| Platform             | Edge Rendering | Next.js Native |
| -------------------- | -------------- | -------------- |
| **Vercel**           | ✅              | ✅              |
| **Cloudflare Pages** | ✅              | ⚠️             |
| **Netlify**          | ✅              | ⚠️             |
| **Fastly**           | ✅              | ❌              |
| **AWS (EC2/Lambda)** | ❌              | ❌              |

Vercel config
export const runtime = "edge";

export default function Page({ cookies }) {
  return <h1>Hello from the edge</h1>;
}
✔ HTML rendered at city-level edge
✔ No central server

# AWS edge services actually allow
🔹 AWS CloudFront
Caching
Routing
CDN delivery

🔹 CloudFront Functions
Ultra-fast
Redirects
Header & cookie logic
A/B testing

🔹 Lambda@Edge
Auth validation
Request/response mutation
Conditional routing
❌ NONE can render React HTML