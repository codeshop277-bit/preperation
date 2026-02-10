# CI - Continuous Integration
How It Flows in Reality
Imagine you push to GitHub.
GitHub Actions / GitLab CI / Jenkins will:
Checkout code
Install dependencies
Build
Run tests
Run lint
Deploy if all green ✅
If any step fails:
Pipeline stops immediately.
No half-broken deployments.
Why CI Is Important
Without CI:
“It works on my machine bro”
Manual testing
Late bug discovery
Production disasters
With CI:
Automatic verification
Faster feedback
Safe refactoring
Team scalability
Important CI Concepts
🔹 Pipeline
The full sequence of steps (Build → Test → Lint → Deploy)
🔹 Jobs
Individual tasks inside pipeline.
🔹 Stages
Logical grouping (build stage, test stage, deploy stage)
🔹 Artifacts
Outputs saved between stages (e.g., build folder)
🔹 Fail Fast
Stop pipeline on first error.

# Github Actions
GitHub Actions is GitHub’s built-in CI/CD automation tool.
It lets you:
Run tests automatically
Build your project
Deploy to servers
Run scripts on PRs
Automate literally anything on repo events
All directly inside GitHub.
name: CI Pipeline

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Run Tests
        run: npm test

      - name: Build
        run: npm run build

# CD
CD = after CI passes, code is automatically released to an environment.
There are two flavors:
Continuous Delivery → Automatically deploy to staging, manual approval to prod
Continuous Deployment → Automatically deploy to production
So CD answers:
“How do we release safely without breaking users?”
And that’s where these strategies come in 👇
🔵🟢 Blue-Green Deployment
🧠 Idea
Run two identical production environments:
🟦 Blue → Current live version
🟩 Green → New version
Only one receives user traffic.
🔄 How It Works
Blue is live.
Deploy new version to Green.
Test Green internally.
Switch traffic via load balancer.
Green becomes live.
Blue becomes standby.
Switching traffic is usually done via:
Load balancer
DNS switch
Kubernetes service update
✅ Pros
Instant rollback (just switch traffic back)
No downtime
Clean separation
❌ Cons
Double infrastructure cost
Needs good DB migration strategy
💡 Where It’s Used
Common with:
Amazon
Netflix
Very common in Kubernetes environments.
🐤 Canary Release
🧠 Idea
Instead of switching all users at once…
Release new version to a small percentage first.
Like sending a “canary” into a coal mine 🐤
🔄 How It Works
Example rollout:
5% users → new version
20%
50%
100%
If errors spike → stop rollout.
✅ Pros
Low risk
Real production testing
Gradual confidence
❌ Cons
Harder monitoring
Requires traffic routing setup
💡 Real Use Case
Imagine your React app has new payment flow.
Instead of risking 100% users:
Show it to 10%
Monitor errors
Increase gradually
Used heavily by:
Google
Meta
🔄 Rollbacks
🧠 Idea
If something breaks in production:
Go back to last stable version immediately.
Rollback is your safety net.
🛠 Rollback Types
1️⃣ Infrastructure Rollback
Switch traffic back (Blue-Green).
2️⃣ Version Rollback
Redeploy previous Docker image tag.
Example:
myapp:v1.2.3
Instead of:
myapp:v1.2.4
3️⃣ Database Rollback (Hardest)
Schema migrations need:
Backward compatibility
Safe migrations
Versioned migrations
🚨 Important Rule
Always deploy in a way that rollback is possible.
If rollback is hard → deployment strategy is bad.