# Next.js & React Production Configuration Guide

A comprehensive reference for every configuration file found in a production-grade Next.js / React project — what each file does, why it exists, and how to configure it correctly.

---

## Table of Contents

- [Overview](#overview)
- [1. Build & Framework](#1-build--framework)
  - [next.config.js](#nextconfigjs)
  - [tsconfig.json](#tsconfigjson)
  - [craco.config.js](#cracoconfigjs)
- [2. Code Quality](#2-code-quality)
  - [.eslintrc.js](#eslintrcjs)
  - [.prettierrc](#prettierrc)
  - [.editorconfig](#editorconfig)
- [3. Environment Variables](#3-environment-variables)
- [4. Testing](#4-testing)
  - [jest.config.js](#jestconfigjs)
  - [jest.setup.ts](#jestsetupts)
  - [cypress.config.ts](#cypressconfigts)
- [5. CI / CD](#5-ci--cd)
  - [Jenkinsfile](#jenkinsfile)
  - [GitHub Actions (.github/workflows/ci.yml)](#github-actions-githubworkflowsciyml)
- [6. Containerization](#6-containerization)
  - [Dockerfile](#dockerfile)
  - [docker-compose.yml](#docker-composeyml)
  - [.dockerignore](#dockerignore)
- [7. Security & Headers](#7-security--headers)
- [8. Deployment](#8-deployment)
  - [vercel.json](#verceljson)
- [9. package.json Scripts](#9-packagejson-scripts)
- [Quick Reference](#quick-reference)

---

## Overview

Every configuration file in a production project answers one of four fundamental questions:

| Question | Files that answer it |
|---|---|
| **What can go wrong?** | `.eslintrc.js`, `tsconfig.json`, security headers |
| **Does it still work after I changed it?** | `jest.config.js`, `cypress.config.ts`, coverage thresholds |
| **Is it the same everywhere?** | `Dockerfile`, `.nvmrc`, `.env` hierarchy |
| **Who can touch what, and what happens when it breaks?** | `Jenkinsfile`, GitHub Actions, deployment config |

Production is adversarial — real users, real attackers, real load. Configuration is how you bring production-level rigor into development, as early and cheaply as possible.

---

## 1. Build & Framework

### `next.config.js`

**Purpose:** The single source of truth for how Next.js compiles, serves, and optimizes your app. Without it, Next.js runs safe defaults that are correct for development but leave significant performance and security gains on the table.

**Key settings explained:**

| Setting | Why it matters |
|---|---|
| `output: 'standalone'` | Bundles only files needed to run — reduces Docker image size by up to 90% |
| `swcMinify: true` | Uses Rust-based SWC instead of Terser — 5–20× faster builds, identical output |
| `images.formats: ['avif', 'webp']` | AVIF/WebP are 50–80% smaller than JPEG/PNG; Next.js serves the right format per browser |
| `reactStrictMode: true` | Catches side effects and deprecated APIs in development before they become production bugs |

> **Without proper next.config.js:** Docker images are huge, images are unoptimized, security headers are absent, and you have no control over caching.

```js
// next.config.js
const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',

  images: {
    domains: ['cdn.yourapp.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' blob: data: https://cdn.yourapp.com",
              "connect-src 'self' https://api.yourapp.com",
            ].join('; '),
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: '/old-page', destination: '/new-page', permanent: true },
    ];
  },

  env: {
    APP_VERSION: process.env.npm_package_version,
  },
};

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  org: 'your-org',
  project: 'your-project',
});
```

---

### `tsconfig.json`

**Purpose:** TypeScript's compiler is only as strict as you configure it. A permissive `tsconfig` catches almost nothing. A strict one eliminates entire categories of bugs at compile time — before a single line runs in production.

**Key settings explained:**

| Setting | Why it matters |
|---|---|
| `strict: true` | Enables all strict checks at once — eliminates "undefined is not a function" at compile time |
| `noUnusedLocals` | Fails the build on dead code — prevents accumulation of unused variables over time |
| `paths (@/*)` | Allows `@/components/Button` instead of `../../../components/Button` — eliminates broken relative imports when files move |

> **Teams with `strict: true` catch ~30% more bugs at compile time, before any code review or testing.**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@lib/*": ["./src/lib/*"],
      "@hooks/*": ["./src/hooks/*"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

### `craco.config.js`

**Purpose:** Create React App (CRA) hides webpack config to keep things simple. But production apps need custom optimization — code splitting, bundle analysis, compression. CRACO lets you extend webpack without ejecting and losing CRA's update path.

> **Only needed for CRA projects. Next.js projects use `next.config.js` instead.**

**Key settings explained:**

| Setting | Why it matters |
|---|---|
| `drop_console: true` | Strips all `console.log()` from production builds — prevents data leaks, reduces bundle size |
| `splitChunks` | Separates vendor code into a separate chunk — returning users have it cached and skip re-downloading |

```js
// craco.config.js
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
    configure: (webpackConfig, { env }) => {
      if (env === 'production') {
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          minimizer: [
            new TerserPlugin({
              terserOptions: {
                compress: { drop_console: true },
              },
            }),
          ],
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
              },
            },
          },
        };
        webpackConfig.plugins.push(
          new CompressionPlugin({ algorithm: 'gzip' })
        );
      }
      return webpackConfig;
    },
  },
};
```

---

## 2. Code Quality

### `.eslintrc.js`

**Purpose:** ESLint is an automated code reviewer that runs in milliseconds. It enforces consistency rules that humans forget, catches known bug patterns, and blocks dangerous practices — all before code reaches review. Think of it as a reviewer who never gets tired and never misses a pattern.

**Key settings explained:**

| Plugin / Rule | Why it matters |
|---|---|
| `no-console: warn` | Developers forget `console.log` constantly — this flags every one in CI so they can't reach production |
| `jsx-a11y` | Catches images without alt text, buttons without labels, invalid ARIA — affects users with disabilities and can be legal liability |
| `security` plugin | Detects `eval()`, unsafe `innerHTML`, prototype pollution — catches security mistakes structurally |
| `import/order` | Enforces import ordering — prevents circular dependency issues and cleans up code review diffs |

> **ESLint with security + a11y plugins is the cheapest security and accessibility audit you can run — it costs nothing per build.**

```js
// .eslintrc.js
module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:security/recommended',
    'prettier',                           // Must be last
  ],
  plugins: ['@typescript-eslint', 'jsx-a11y', 'security', 'import'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
      },
    ],
    'react/self-closing-comp': 'error',
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx'],
      env: { jest: true },
      rules: { '@typescript-eslint/no-explicit-any': 'off' },
    },
  ],
};
```

---

### `.prettierrc`

**Purpose:** Code formatting debates waste engineering time and pollute git diffs. Prettier ends the debate by auto-formatting everything identically. The specific values matter less than the whole team using the same ones consistently.

**Key settings explained:**

| Setting | Why it matters |
|---|---|
| `endOfLine: 'lf'` | Prevents Windows developers from committing CRLF endings that show as full-file changes in git diffs |
| `trailingComma: 'es5'` | Trailing commas on multiline structures make diffs cleaner — adding a new item shows only one changed line |
| `printWidth: 100` | Controls line wrapping — wider means fewer JSX line breaks, but too wide hurts readability on split screens |

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

---

### `.editorconfig`

**Purpose:** Works at the editor level, before any tool runs. Ensures every developer's editor uses the same indentation, charset, and line endings — even those who don't run Prettier. It's the lowest-friction consistency tool available.

```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false

[Makefile]
indent_style = tab
```

---

## 3. Environment Variables

**Purpose:** Environment files solve a core problem — your app needs different behavior in different environments (local, staging, production) without changing code. The hierarchy also protects secrets by keeping sensitive values out of git entirely.

### File hierarchy

| File | Committed to git | Purpose |
|---|---|---|
| `.env` | Yes | Safe non-sensitive defaults for all environments |
| `.env.local` | **No** | Personal developer overrides — DB connections, local API keys |
| `.env.development` | Yes | Values applied during `next dev` |
| `.env.production` | Yes (if no secrets) | Values applied during `next build` and production runtime |
| `.env.*.local` | **No** | Personal environment-specific overrides |

### The `NEXT_PUBLIC_` security boundary

```bash
# SAFE — bundled into browser JavaScript (anyone can see this)
NEXT_PUBLIC_API_URL=https://api.yourapp.com
NEXT_PUBLIC_APP_NAME=MyApp

# SAFE — server-side only, never exposed to browsers
DATABASE_URL=postgresql://user:password@host:5432/myapp
STRIPE_SECRET_KEY=sk_live_...
JWT_SECRET=your-secret-key

# NEVER do this — exposes secrets to every user
NEXT_PUBLIC_DATABASE_URL=postgresql://...   # WRONG
NEXT_PUBLIC_STRIPE_SECRET_KEY=sk_live_...  # WRONG
```

> **The most common production security incident is a secret API key accidentally committed to git. A proper `.gitignore` + env hierarchy prevents this entirely.**

---

## 4. Testing

### `jest.config.js`

**Purpose:** Jest is your safety net against regressions. Every time you change code, Jest instantly verifies that nothing already built has broken. Without configuration, it runs with minimal coverage and no enforcement — tests become optional suggestions rather than gates.

**Key settings explained:**

| Setting | Why it matters |
|---|---|
| `coverageThreshold` | Makes the build fail if coverage drops below a minimum — without this, coverage reports are purely informational |
| `moduleNameMapper` | Mirrors `tsconfig` paths in Jest — without this, every test using `@/` path aliases fails immediately |
| `testEnvironment: jsdom` | Simulates a browser DOM in Node.js — required for testing React components |
| `setupFilesAfterFramework` | Runs before every test file — where you configure MSW mock servers, testing-library matchers, global mocks |

> **Without coverage thresholds, "we have tests" means nothing. Coverage can sit at 12% and CI still passes.**

```js
// jest.config.js
const nextJest = require('next/jest');
const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const config = {
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(config);
```

---

### `jest.setup.ts`

**Purpose:** Runs once before all tests. Configures global test infrastructure — mock service worker (MSW) server lifecycle, custom matchers, and global test utilities.

```ts
// jest.setup.ts
import '@testing-library/jest-dom';
import { server } from './src/mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

### `cypress.config.ts`

**Purpose:** Unit tests verify individual pieces work. Cypress verifies the whole system works together — real browser, real interactions, real user flows. It catches integration failures that unit tests structurally cannot.

**Key settings explained:**

| Setting | Why it matters |
|---|---|
| `retries: { runMode: 2 }` | Distinguishes flaky tests (timing issues) from real failures — critical so developers don't start ignoring CI |
| `video: false` | Recording video of every run consumes gigabytes of CI storage — disable globally, enable on failure when debugging |
| `baseUrl` | All `cy.visit('/login')` calls resolve relative to this — change once here instead of in every test file |

> **E2E tests are the only tests that catch problems at the seam between your frontend, API, and auth system simultaneously.**

```ts
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    video: false,
    screenshotOnRunFailure: true,
    retries: { runMode: 2, openMode: 0 },
    env: {
      apiUrl: process.env.CYPRESS_API_URL || 'http://localhost:3001',
    },
  },
  component: {
    devServer: { framework: 'next', bundler: 'webpack' },
  },
});
```

---

## 5. CI / CD

**Purpose:** CI/CD is the enforcement mechanism for every standard you set. You can have perfect ESLint rules, TypeScript, and tests — but if developers can push directly to main and bypass them, they don't count. CI makes quality checks unavoidable.

> **Without CI, code quality rules are guidelines. With CI, they are enforced contracts. The difference is whether your standards survive a deadline crunch.**

### `Jenkinsfile`

**Key concepts explained:**

| Concept | Why it matters |
|---|---|
| `parallel` stages | Lint and type-check run simultaneously — a 3+3 minute sequence becomes 3 minutes total |
| `credentials()` | Secrets are never written in the Jenkinsfile itself — they're fetched from Jenkins credential store at runtime |
| `post { failure { slackSend } }` | Silent CI failures are worse than no CI — immediate notification means the team knows within seconds |
| `kubectl rollout status` | Waits and verifies the deployment succeeded before marking the pipeline green — catches deployment failures |

```groovy
pipeline {
  agent { docker { image 'node:20-alpine' } }

  environment {
    NPM_TOKEN    = credentials('npm-token')
    DOCKER_CREDS = credentials('docker-hub-creds')
  }

  stages {
    stage('Install') {
      steps { sh 'npm ci --prefer-offline' }
    }

    stage('Lint & Type Check') {
      parallel {
        stage('ESLint')     { steps { sh 'npm run lint' } }
        stage('TypeScript') { steps { sh 'npm run type-check' } }
      }
    }

    stage('Test') {
      steps {
        sh 'npm run test:ci -- --coverage'
        junit 'coverage/junit.xml'
        publishHTML([
          reportDir: 'coverage/lcov-report',
          reportFiles: 'index.html',
          reportName: 'Coverage Report',
        ])
      }
    }

    stage('Build') {
      when { branch 'main' }
      steps {
        sh 'npm run build'
        sh "docker build -t myapp:${env.BUILD_NUMBER} ."
        sh "docker push myapp:${env.BUILD_NUMBER}"
      }
    }

    stage('Deploy') {
      when { branch 'main' }
      steps {
        sh "kubectl set image deployment/myapp app=myapp:${env.BUILD_NUMBER}"
        sh "kubectl rollout status deployment/myapp"
      }
    }
  }

  post {
    always  { cleanWs() }
    failure { slackSend(color: 'danger', message: "Build failed: ${env.BUILD_URL}") }
    success { slackSend(color: 'good',   message: "Deployed: ${env.BUILD_URL}") }
  }
}
```

---

### GitHub Actions (`.github/workflows/ci.yml`)

**Key concepts explained:**

| Concept | Why it matters |
|---|---|
| `npm ci` vs `npm install` | `npm ci` is deterministic — installs exactly what's in `package-lock.json`. `npm install` can silently update dependencies, causing mysterious environment differences |
| `cache: type=gha` | Docker layer caching — a cold build takes 8 min, a cached build takes 90 seconds. Layers that don't change are reused |
| `environment: production` | GitHub's environment protection rules — require manual approvals, restrict who can trigger deploys, maintain an audit log |

```yaml
name: CI / CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test:ci
      - uses: codecov/codecov-action@v3

  build-and-push:
    needs: quality
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            NEXT_PUBLIC_API_URL=${{ vars.API_URL }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: production
    steps:
      - run: |
          kubectl set image deployment/myapp \
            app=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
```

---

## 6. Containerization

### `Dockerfile`

**Purpose:** A Dockerfile solves the most expensive class of bugs — environment differences. "Works in staging but not production" almost always means the two environments differ invisibly. Docker makes environments identical and verifiable.

**Key concepts explained:**

| Concept | Why it matters |
|---|---|
| Multi-stage build | Three stages: `deps` → `builder` → `runner`. The final image has zero build tools, zero devDependencies, zero source code — only compiled output. Typical size: 2GB → 200MB |
| `USER nextjs` (non-root) | If a vulnerability allows code execution in your container, root access = host access. Non-root contains the blast radius |
| `COPY package.json` first | Docker caches each layer. Copying `package.json` before source files means the `npm ci` layer is only invalidated when dependencies change — not on every code change. Saves minutes per build |
| `COPY .next/standalone` | Works with `output: 'standalone'` — includes a pre-built Node server, no Next.js install needed in the container |

> **The combination of multi-stage builds + standalone output is the current gold standard for Next.js containers. Most teams see 80–90% image size reduction.**

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Stage 3: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser  --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

---

### `docker-compose.yml`

**Purpose:** Spins up your entire stack — app + database + cache + reverse proxy — with a single command. Creates production parity locally so "works on my machine, breaks in prod" bugs almost disappear.

**Key concepts explained:**

| Concept | Why it matters |
|---|---|
| `healthcheck` | Waits for Postgres to truly accept connections before starting the app — without this, the app crashes on startup intermittently |
| `depends_on: condition: service_healthy` | Makes startup order verified, not just declared |
| `resources.limits.memory` | Prevents a memory leak in one container from taking down the entire host machine |

```yaml
version: '3.9'

services:
  app:
    build:
      context: .
      target: runner
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
    ports:
      - '3000:3000'
    environment:
      DATABASE_URL: ${DATABASE_URL}
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${DB_USER}']
      interval: 10s
      timeout: 5s
      retries: 5

  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on: [app]

volumes:
  pg_data:
```

---

### `.dockerignore`

**Purpose:** Prevents local files from being copied into the Docker build context. Without it, `node_modules`, `.git`, `.env.local`, and build artifacts bloat the image and risk leaking secrets.

```
node_modules
.next
.git
.env*.local
coverage
*.log
.DS_Store
README.md
```

---

## 7. Security & Headers

**Purpose:** HTTP security headers are your app's security posture declaration. They tell browsers exactly what they're allowed to do with your content. Without them, browsers apply permissive defaults — which is exactly what attackers exploit.

**Header explanations:**

| Header | Attack it prevents | How |
|---|---|---|
| `X-Frame-Options: DENY` | Clickjacking | Prevents your app from being embedded in an iframe on attacker-controlled sites |
| `X-Content-Type-Options: nosniff` | MIME-type sniffing | Prevents browsers from executing a `.jpg` file that actually contains JavaScript |
| `Content-Security-Policy` | XSS (Cross-Site Scripting) | Whitelists every allowed script/style/image source — injected scripts from unauthorized domains are blocked before running |
| `Strict-Transport-Security` | SSL stripping | Tells browsers to only ever use HTTPS for 2 years — prevents downgrade attacks |
| `Cache-Control: immutable` | Unnecessary re-fetches | Next.js hashes static asset filenames — content never changes for a given URL, so browsers can cache forever |

> **Security headers take 30 minutes to configure. A single XSS vulnerability from missing CSP can expose every user's session. The ROI is extraordinary.**

All security headers are configured in `next.config.js` — see the [next.config.js](#nextconfigjs) section above for the full implementation.

---

## 8. Deployment

### `vercel.json`

**Purpose:** Translates infrastructure requirements into version-controlled declarations. Instead of clicking through dashboards (which can't be reviewed or audited), every routing rule, header, and cron job is a line of code in git.

**Key concepts explained:**

| Setting | Why it matters |
|---|---|
| `regions` | Pins serverless functions to specific geographic regions — prevents high latency from functions being deployed far from your database |
| `crons` | Scheduled jobs declared in code — if configured in a dashboard UI, they disappear when someone recreates the project |
| `rewrites` (API proxy) | Proxies `/api/*` to your backend — attackers never see the actual backend URL |

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["sin1", "syd1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-store" }
      ]
    }
  ],
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://api.yourapp.com/:path*" }
  ],
  "crons": [
    { "path": "/api/cron/revalidate", "schedule": "0 * * * *" }
  ]
}
```

---

## 9. `package.json` Scripts

**Purpose:** Standardizes how every developer (and CI) interacts with the project. When scripts are defined here, `npm run build` means the same thing for every developer and every CI runner — no tribal knowledge required.

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint --max-warnings 0",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest --watch",
    "test:ci": "jest --ci --runInBand --forceExit",
    "test:coverage": "jest --coverage",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open",
    "analyze": "ANALYZE=true npm run build",
    "prepare": "husky install",
    "precommit": "lint-staged"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

**Script notes:**

- `--max-warnings 0` on lint makes any warning a build failure — warnings that are tolerated become permanent
- `--ci --runInBand` on Jest disables parallelism in CI (flaky in constrained environments) and enables deterministic output
- `--forceExit` ensures Jest doesn't hang on open handles in CI
- `ANALYZE=true` triggers bundle analysis via webpack-bundle-analyzer — run this before every major release

---

## Quick Reference

| Priority | File | Category | What breaks without it |
|---|---|---|---|
| Must-have | `next.config.js` | Framework | Oversized images, missing security headers, huge Docker images |
| Must-have | `tsconfig.json` | Type safety | Runtime type errors that could have been compile-time |
| Must-have | `.eslintrc.js` | Code quality | Security bugs, accessibility failures, style drift |
| Must-have | `.env` hierarchy | Configuration | Secrets in git, wrong API URLs per environment |
| Must-have | `Dockerfile` | Deployment | Non-reproducible deployments, environment differences |
| Must-have | `jest.config.js` | Testing | Regressions ship undetected |
| Must-have | CI config | Automation | Quality standards become optional under deadline pressure |
| Recommended | `cypress.config.ts` | Testing | Integration failures only caught in production |
| Recommended | `vercel.json` / k8s | Deployment | Infrastructure config lives in dashboards instead of git |
| Recommended | `.prettierrc` | Code style | Formatting debates, messy diffs |
| Recommended | `docker-compose.yml` | Local dev | "Works on my machine" bugs |
| Recommended | `.editorconfig` | Cross-editor | Encoding and indentation inconsistencies |

---

*Generated for Next.js 14+ / React 18+ production projects.*

# Publish config - nexus registry
Nexus Repository Manager is a private artifact/package registry that companies run internally. Instead of your developers and CI servers pulling packages directly from the public registry.npmjs.org, they pull from your company's own Nexus server

** package.json — declares where to publish
The publishConfig.registry field tells npm publish where to push your package. It answers: "When I run npm publish, where does this package go?"
It has no effect on npm install. It is purely a publish-time instruction.

.npmrc — declares how to authenticate and where to fetch from
The .npmrc answers: "When I run npm install, where do I fetch packages from, and how do I authenticate?"    

Nexus typically serves three repository types, often grouped behind one URL:
npm-internal — your company's own private packages (@mycompany/design-system, @mycompany/auth-utils). Published via publishConfig, consumed via .npmrc.
npm-proxy — a transparent cache of registry.npmjs.org. The first time someone installs react, Nexus fetches it from public npm and caches it. Every install after that is served from Nexus. This means your builds never depend on public npm availability.
npm-group — a virtual URL that merges both of the above. This is usually what you point .npmrc at — one URL that serves both internal packages and cached public ones.

Without Nexus, every npm install in CI reaches out to the public internet. That creates several risks:

A malicious package with a name similar to your internal package can be published to public npm and get installed instead (dependency confusion attack)
A popular package getting unpublished from npm breaks your builds (the left-pad incident)
Builds are slower because packages are fetched from across the internet on every CI run

With Nexus as your registry, Nexus controls what packages are allowed into your builds, everything is cached locally on your network, and you can audit every package that enters your supply chain.