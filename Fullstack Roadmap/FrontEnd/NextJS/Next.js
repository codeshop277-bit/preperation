import React, { useState, useEffect, Suspense } from 'react';
import { Camera, Server, Zap, Globe, ImageIcon, FileText, Shield, Loader2 } from 'lucide-react';

/**
 * COMPLETE NEXT.JS FEATURES DEMONSTRATION
 * 
 * This demo showcases all major Next.js features and advantages:
 * 
 * 1. APP ROUTER (Next.js 13+)
 *    - File-based routing with app directory
 *    - Nested layouts and templates
 *    - Route groups and parallel routes
 *    WHY: Simplifies routing, better code organization, improved performance
 * 
 * 2. SERVER-SIDE RENDERING (SSR)
 *    - Dynamic data fetching on each request
 *    - SEO-friendly content
 *    WHY: Better SEO, fresh data, improved initial load
 * 
 * 3. STATIC SITE GENERATION (SSG)
 *    - Pre-rendered pages at build time
 *    - Incremental Static Regeneration (ISR)
 *    WHY: Fastest page loads, reduced server load, great for blogs/marketing
 * 
 * 4. CLIENT-SIDE RENDERING (CSR)
 *    - Interactive components
 *    - Dynamic UI updates
 *    WHY: Rich interactivity, reduced server load for dynamic content
 * 
 * 5. SERVER COMPONENTS
 *    - Zero JavaScript shipped to client
 *    - Direct database access
 *    WHY: Smaller bundle size, better performance, enhanced security
 * 
 * 6. STREAMING & SUSPENSE
 *    - Progressive rendering
 *    - Instant loading states
 *    WHY: Improved perceived performance, better UX
 * 
 * 7. API ROUTES
 *    - Serverless functions
 *    - Full-stack capabilities
 *    WHY: No separate backend needed, easy deployment
 * 
 * 8. IMAGE OPTIMIZATION
 *    - Automatic resizing and optimization
 *    - Lazy loading
 *    WHY: Faster loads, better Core Web Vitals
 * 
 * 9. FONT OPTIMIZATION
 *    - Automatic font loading
 *    - No layout shift
 *    WHY: Better performance, improved UX
 * 
 * 10. MIDDLEWARE
 *     - Request interception
 *     - Authentication, redirects, headers
 *     WHY: Centralized logic, better security
 */

// ============================================
// SIMULATED NEXT.JS APP ROUTER STRUCTURE
// ============================================

/**
 * FILE STRUCTURE EXPLANATION:
 * 
 * app/
 * ├── layout.tsx              // Root layout (Server Component)
 * ├── page.tsx                // Home page (Server Component)
 * ├── loading.tsx             // Loading UI (Instant loading states)
 * ├── error.tsx               // Error boundary
 * ├── blog/
 * │   ├── page.tsx           // Blog list (SSG)
 * │   └── [slug]/
 * │       └── page.tsx       // Blog post (SSG + ISR)
 * ├── dashboard/
 * │   ├── layout.tsx         // Dashboard layout
 * │   └── page.tsx           // Dashboard (SSR + Client Components)
 * └── api/
 *     └── posts/
 *         └── route.ts       // API route handler
 * 
 * ADVANTAGES:
 * - Intuitive file-based routing
 * - Automatic code splitting per route
 * - Shared layouts prevent re-rendering
 * - Nested routing with preserved state
 */

// ============================================
// 1. SERVER COMPONENT EXAMPLE (Default in App Router)
// ============================================

/**
 * Server Components run on the server and don't ship JavaScript to client
 * 
 * ADVANTAGES:
 * - Zero bundle size impact
 * - Direct access to backend resources
 * - Automatic data fetching
 * - Better security (API keys, secrets stay on server)
 * 
 * USE CASES:
 * - Fetching data from database
 * - Reading from file system
 * - Heavy computational tasks
 * - Static content rendering
 */

const ServerComponentDemo = () => {
    // In real Next.js, this would be an async component
    // fetching data directly from database
    const posts = [
        { id: 1, title: 'Getting Started with Next.js', views: 1523 },
        { id: 2, title: 'Server Components Deep Dive', views: 892 },
        { id: 3, title: 'App Router vs Pages Router', views: 2341 }
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
                <Server className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Server Component (Zero JS)</h3>
            </div>
            <div className="space-y-2">
                {posts.map(post => (
                    <div key={post.id} className="p-3 bg-gray-50 rounded">
                        <p className="font-medium">{post.title}</p>
                        <p className="text-sm text-gray-600">{post.views} views</p>
                    </div>
                ))}
            </div>
            <div className="mt-4 text-sm text-gray-600">
                ✓ No JavaScript sent to browser<br />
                ✓ Can access database directly<br />
                ✓ Rendered on server
            </div>
        </div>
    );
};

// ============================================
// 2. CLIENT COMPONENT EXAMPLE ('use client' directive)
// ============================================

/**
 * Client Components run in the browser and enable interactivity
 * 
 * ADVANTAGES:
 * - React hooks (useState, useEffect, etc.)
 * - Event listeners
 * - Browser APIs
 * - Interactive UI
 * 
 * WHEN TO USE:
 * - Need interactivity (clicks, inputs)
 * - Using React hooks
 * - Browser-only APIs
 * - Real-time updates
 */

const ClientComponentDemo = () => {
    const [count, setCount] = useState(0);
    const [likes, setLikes] = useState(42);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-600" />
                <h3 className="text-lg font-semibold">Client Component (Interactive)</h3>
            </div>
            <div className="space-y-4">
                <div>
                    <p className="mb-2">Counter: {count}</p>
                    <button
                        onClick={() => setCount(count + 1)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Increment
                    </button>
                </div>
                <div>
                    <p className="mb-2">❤️ Likes: {likes}</p>
                    <button
                        onClick={() => setLikes(likes + 1)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Like
                    </button>
                </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
                ✓ React hooks enabled<br />
                ✓ Event handlers work<br />
                ✓ Real-time interactivity
            </div>
        </div>
    );
};

// ============================================
// 3. STREAMING & SUSPENSE
// ============================================

/**
 * Streaming allows progressive rendering of components
 * 
 * ADVANTAGES:
 * - Faster Time to First Byte (TTFB)
 * - Improved perceived performance
 * - Show content as it loads
 * - Better UX with loading states
 * 
 * HOW IT WORKS:
 * - Server sends HTML in chunks
 * - User sees content immediately
 * - Slow components load independently
 */

const SlowComponent = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // Simulate slow data fetch
        const timer = setTimeout(() => setLoaded(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (!loaded) {
        return (
            <div className="flex items-center justify-center p-8 bg-gray-50 rounded">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2">Loading data...</span>
            </div>
        );
    }

    return (
        <div className="p-4 bg-green-50 rounded border border-green-200">
            <p className="font-medium text-green-800">✓ Data loaded successfully!</p>
            <p className="text-sm text-green-600 mt-1">User statistics and analytics</p>
        </div>
    );
};

const StreamingDemo = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold">Streaming & Suspense</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
                Content streams progressively. Fast content shows immediately.
            </p>
            <Suspense fallback={<div>Loading...</div>}>
                <SlowComponent />
            </Suspense>
            <div className="mt-4 text-sm text-gray-600">
                ✓ Progressive rendering<br />
                ✓ Better perceived performance<br />
                ✓ Instant loading states
            </div>
        </div>
    );
};

// ============================================
// 4. DATA FETCHING PATTERNS
// ============================================

/**
 * Next.js supports multiple data fetching patterns:
 * 
 * 1. SERVER-SIDE RENDERING (SSR)
 *    - Fetch on each request
 *    - Always fresh data
 *    - SEO friendly
 *    Example: Dashboard, personalized content
 * 
 * 2. STATIC SITE GENERATION (SSG)
 *    - Fetch at build time
 *    - Blazing fast
 *    - Perfect for blogs
 *    Example: Blog posts, documentation
 * 
 * 3. INCREMENTAL STATIC REGENERATION (ISR)
 *    - Static + periodic updates
 *    - Best of both worlds
 *    Example: E-commerce products
 * 
 * 4. CLIENT-SIDE FETCHING
 *    - Fetch in browser
 *    - For dynamic, non-SEO content
 *    Example: User-specific data after login
 */

const DataFetchingDemo = () => {
    const patterns = [
        {
            name: 'SSR (Server-Side Rendering)',
            icon: '🔄',
            use: 'Dynamic content, personalized pages',
            code: 'async function Page() { const data = await fetch(...); }',
            pros: 'Always fresh, SEO-friendly'
        },
        {
            name: 'SSG (Static Site Generation)',
            icon: '⚡',
            use: 'Blogs, docs, marketing pages',
            code: 'export async function generateStaticParams() {...}',
            pros: 'Fastest possible, great SEO'
        },
        {
            name: 'ISR (Incremental Static Regeneration)',
            icon: '🔃',
            use: 'E-commerce, news sites',
            code: 'fetch(url, { next: { revalidate: 3600 } })',
            pros: 'Static speed + fresh data'
        },
        {
            name: 'CSR (Client-Side Rendering)',
            icon: '💻',
            use: 'User dashboards, after login',
            code: 'useEffect(() => { fetch(...) }, [])',
            pros: 'Reduced server load'
        }
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold">Data Fetching Patterns</h3>
            </div>
            <div className="space-y-3">
                {patterns.map((pattern, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded">
                        <div className="flex items-start gap-2">
                            <span className="text-2xl">{pattern.icon}</span>
                            <div className="flex-1">
                                <p className="font-medium">{pattern.name}</p>
                                <p className="text-sm text-gray-600 mt-1">Use: {pattern.use}</p>
                                <p className="text-xs text-green-600 mt-1">✓ {pattern.pros}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ============================================
// 5. API ROUTES
// ============================================

/**
 * API Routes enable full-stack development in Next.js
 * 
 * ADVANTAGES:
 * - No separate backend needed
 * - Serverless by default
 * - Same codebase for frontend/backend
 * - Easy deployment
 * 
 * FILE: app/api/posts/route.ts
 * 
 * export async function GET(request: Request) {
 *   const posts = await db.posts.findMany();
 *   return Response.json(posts);
 * }
 * 
 * export async function POST(request: Request) {
 *   const body = await request.json();
 *   const post = await db.posts.create({ data: body });
 *   return Response.json(post);
 * }
 */

const APIRoutesDemo = () => {
    const [apiData, setApiData] = useState(null);
    const [loading, setLoading] = useState(false);

    const callAPI = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setApiData({
                message: 'Success!',
                timestamp: new Date().toISOString(),
                data: { posts: 42, users: 128 }
            });
            setLoading(false);
        }, 800);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
                <Server className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-semibold">API Routes (Serverless)</h3>
            </div>
            <button
                onClick={callAPI}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
                {loading ? 'Calling API...' : 'Call /api/posts'}
            </button>
            {apiData && (
                <div className="mt-4 p-3 bg-gray-50 rounded">
                    <pre className="text-xs">{JSON.stringify(apiData, null, 2)}</pre>
                </div>
            )}
            <div className="mt-4 text-sm text-gray-600">
                ✓ No separate backend<br />
                ✓ Serverless functions<br />
                ✓ Easy deployment
            </div>
        </div>
    );
};

// ============================================
// 6. IMAGE OPTIMIZATION
// ============================================

/**
 * Next.js Image component automatically optimizes images
 * 
 * ADVANTAGES:
 * - Automatic WebP/AVIF conversion
 * - Responsive images
 * - Lazy loading built-in
 * - Blur placeholder
 * - Prevents layout shift
 * 
 * USAGE:
 * import Image from 'next/image'
 * 
 * <Image
 *   src="/photo.jpg"
 *   width={800}
 *   height={600}
 *   alt="Description"
 *   priority={false}  // or true for above-fold
 * />
 * 
 * BENEFITS:
 * - 50-80% smaller file sizes
 * - Better Core Web Vitals
 * - Faster page loads
 */

const ImageOptimizationDemo = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-5 h-5 text-pink-600" />
                <h3 className="text-lg font-semibold">Image Optimization</h3>
            </div>
            <div className="aspect-video bg-gradient-to-br from-pink-500 to-purple-600 rounded flex items-center justify-center text-white">
                <Camera className="w-12 h-12" />
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Automatic WebP/AVIF conversion</span>
                </div>
                <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Lazy loading (viewport-based)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Responsive sizing</span>
                </div>
                <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>No layout shift</span>
                </div>
            </div>
        </div>
    );
};

// ============================================
// 7. MIDDLEWARE
// ============================================

/**
 * Middleware runs before requests are completed
 * 
 * FILE: middleware.ts
 * 
 * export function middleware(request: NextRequest) {
 *   // Authentication check
 *   const token = request.cookies.get('token');
 *   if (!token) {
 *     return NextResponse.redirect('/login');
 *   }
 *   
 *   // Add custom headers
 *   const response = NextResponse.next();
 *   response.headers.set('x-custom-header', 'value');
 *   return response;
 * }
 * 
 * export const config = {
 *   matcher: '/dashboard/:path*'
 * }
 * 
 * USE CASES:
 * - Authentication
 * - Redirects
 * - A/B testing
 * - Bot protection
 * - Geolocation
 * - Feature flags
 */

const MiddlewareDemo = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold">Middleware (Edge Runtime)</h3>
            </div>
            <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded">
                    <p className="font-medium">Authentication Status</p>
                    <p className="text-sm text-gray-600 mt-1">
                        {isAuthenticated ? '✓ Authenticated' : '✗ Not authenticated'}
                    </p>
                    <button
                        onClick={() => setIsAuthenticated(!isAuthenticated)}
                        className="mt-2 px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700"
                    >
                        Toggle Auth
                    </button>
                </div>
                <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">Middleware can:</p>
                    <div className="space-y-1">
                        <p>• Check authentication before page loads</p>
                        <p>• Redirect unauthorized users</p>
                        <p>• Add security headers</p>
                        <p>• Run at the edge (globally distributed)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================
// MAIN APP COMPONENT
// ============================================

const NextJSFeaturesDemo = () => {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Complete Next.js Features Guide
                    </h1>
                    <p className="text-gray-600">
                        Comprehensive demonstration of Next.js capabilities with practical examples
                    </p>
                </div>

                {/* Navigation */}
                <div className="bg-white rounded-lg shadow-sm p-2 mb-6 flex gap-2 overflow-x-auto">
                    {['overview', 'components', 'features'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded capitalize whitespace-nowrap ${activeTab === tab
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-2xl font-bold mb-4">Why Next.js?</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-50 rounded">
                                    <h3 className="font-semibold text-blue-900 mb-2">🚀 Performance</h3>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• Automatic code splitting</li>
                                        <li>• Image optimization</li>
                                        <li>• Font optimization</li>
                                        <li>• Bundle size reduction</li>
                                    </ul>
                                </div>
                                <div className="p-4 bg-green-50 rounded">
                                    <h3 className="font-semibold text-green-900 mb-2">📈 SEO</h3>
                                    <ul className="text-sm text-green-800 space-y-1">
                                        <li>• Server-side rendering</li>
                                        <li>• Static generation</li>
                                        <li>• Dynamic metadata</li>
                                        <li>• Structured data</li>
                                    </ul>
                                </div>
                                <div className="p-4 bg-purple-50 rounded">
                                    <h3 className="font-semibold text-purple-900 mb-2">⚡ Developer Experience</h3>
                                    <ul className="text-sm text-purple-800 space-y-1">
                                        <li>• Fast Refresh (instant updates)</li>
                                        <li>• TypeScript support</li>
                                        <li>• File-based routing</li>
                                        <li>• Built-in CSS/Sass support</li>
                                    </ul>
                                </div>
                                <div className="p-4 bg-orange-50 rounded">
                                    <h3 className="font-semibold text-orange-900 mb-2">🌐 Full-Stack</h3>
                                    <ul className="text-sm text-orange-800 space-y-1">
                                        <li>• API routes</li>
                                        <li>• Middleware</li>
                                        <li>• Server actions</li>
                                        <li>• Database integration</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-2xl font-bold mb-4">vs Other Frameworks</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-2">Feature</th>
                                            <th className="text-left p-2">Next.js</th>
                                            <th className="text-left p-2">Create React App</th>
                                            <th className="text-left p-2">Vite</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b">
                                            <td className="p-2 font-medium">SSR</td>
                                            <td className="p-2 text-green-600">✓ Built-in</td>
                                            <td className="p-2 text-red-600">✗ No</td>
                                            <td className="p-2 text-yellow-600">△ Requires setup</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="p-2 font-medium">SSG</td>
                                            <td className="p-2 text-green-600">✓ Built-in</td>
                                            <td className="p-2 text-red-600">✗ No</td>
                                            <td className="p-2 text-yellow-600">△ Plugin needed</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="p-2 font-medium">Routing</td>
                                            <td className="p-2 text-green-600">✓ File-based</td>
                                            <td className="p-2 text-yellow-600">△ Manual</td>
                                            <td className="p-2 text-yellow-600">△ Manual</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="p-2 font-medium">API Routes</td>
                                            <td className="p-2 text-green-600">✓ Built-in</td>
                                            <td className="p-2 text-red-600">✗ No</td>
                                            <td className="p-2 text-red-600">✗ No</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="p-2 font-medium">Image Optimization</td>
                                            <td className="p-2 text-green-600">✓ Automatic</td>
                                            <td className="p-2 text-red-600">✗ Manual</td>
                                            <td className="p-2 text-red-600">✗ Manual</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'components' && (
                    <div className="grid md:grid-cols-2 gap-6">
                        <ServerComponentDemo />
                        <ClientComponentDemo />
                        <StreamingDemo />
                        <DataFetchingDemo />
                    </div>
                )}

                {activeTab === 'features' && (
                    <div className="grid md:grid-cols-2 gap-6">
                        <APIRoutesDemo />
                        <ImageOptimizationDemo />
                        <MiddlewareDemo />
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold mb-4">Additional Features</h3>
                            <div className="space-y-3 text-sm text-gray-600">
                                <div>
                                    <p className="font-medium text-gray-900">🎨 Built-in CSS Support</p>
                                    <p>CSS Modules, Sass, Tailwind, CSS-in-JS</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">🔧 TypeScript</p>
                                    <p>First-class TypeScript support out of the box</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">📱 Progressive Web App</p>
                                    <p>Easy PWA configuration with next-pwa</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">🌍 i18n Routing</p>
                                    <p>Built-in internationalization support</p>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">📊 Analytics</p>
                                    <p>Built-in Core Web Vitals tracking</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                    <h3 className="font-semibold mb-2">Real-World Example Structure:</h3>
                    <pre className="text-xs bg-gray-50 p-4 rounded overflow-x-auto"></pre>
                </div>
            </div>
        </div>
    )
}