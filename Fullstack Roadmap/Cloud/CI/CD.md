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

# What is Secrets Management?
A secret is anything sensitive:
API keys
DB passwords
JWT secrets
OAuth client secrets
AWS credentials
Secrets management =
Storing and injecting sensitive data securely without hardcoding it.
If secrets are inside your repo → you’ve already lost.
🌍 ENV Injection (Environment Variables)
This is the most common method.
Instead of:
const password = "superSecret123";
You do:
const password = process.env.DB_PASSWORD;
Then the value is injected at runtime.
🧠 How ENV Injection Works
Flow:
Secret stored in secure place
CI/CD injects it as environment variable
App reads it using process.env
Secret never lives in code
Where ENV Injection Happens
Local machine
Docker container
CI pipeline
Kubernetes pod
Cloud provider
Example in Docker:
docker run -e DB_PASSWORD=mysecret app
Or in Dockerfile:
ENV NODE_ENV=production
Important difference:
ENV → runtime variable
ARG → build-time variable
Never pass real secrets as Docker ARG — they get baked into image layers.
🟣 GitHub Secrets
If you’re using GitHub Actions, secrets live here:
Repo → Settings → Secrets and variables
They are:
Encrypted at rest
Masked in logs
Only accessible inside workflow
Example usage:
env:
  DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
Then your app can read:
process.env.DB_PASSWORD
🔐 GitHub Secrets Levels
Repository secrets
Environment secrets (staging/prod separation)
Organization secrets
Best practice:
Use environment-specific secrets.
Prod should not share staging credentials.
🧨 .env Pitfalls
Now we get spicy 😬
.env files are convenient but dangerous if misused.
🚨 Pitfall 1: Accidentally Committing .env
You MUST add:
.env
to .gitignore.
If you push secrets once:
They are permanently in Git history.
Even if deleted later.
🚨 Pitfall 2: Frontend Exposure
In React / Next.js:
Only variables prefixed with:
NEXT_PUBLIC_
are exposed to browser.
But anything in frontend build:
IS visible to users.
You cannot hide secrets in frontend code.
If it’s in browser → it’s public.
Period.
🚨 Pitfall 3: Using .env in Production
.env is fine for local dev.
In production:
Secrets should come from:
CI/CD
Cloud secret manager
Container runtime injection
Not from a static file on server.
🚨 Pitfall 4: Reusing Same Secrets Everywhere
Bad:
Same DB password for dev, staging, prod
Good:
Different secrets per environment
Least privilege access

Fetching secret from AWS Secretmanager
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({ region: "ap-south-1" });

async function loadSecrets() {
  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: "my-app-secrets"
    })
  );

  const secrets = JSON.parse(response.SecretString);

  process.env.DB_PASSWORD = secrets.DB_PASSWORD;
  process.env.JWT_SECRET = secrets.JWT_SECRET;
}

await loadSecrets();

# Method 2 CI/CD fetches secret
Step 2: IAM Role for GitHub (Important)

Instead of storing AWS keys in GitHub (bad practice), use OIDC.

You create:

IAM Role

Trust policy for GitHub OIDC

Permission policy allowing:

secretsmanager:GetSecretValue

Now GitHub can securely assume role.
name: Deploy to EC2

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    permissions:
      id-token: write
      contents: read

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Configure AWS Credentials (OIDC)
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/github-actions-role
          aws-region: ap-south-1

      - name: Fetch Secrets
        id: secrets
        run: |
          SECRET=$(aws secretsmanager get-secret-value \
            --secret-id my-prod-app-secrets \
            --query SecretString \
            --output text)

          echo "DB_PASSWORD=$(echo $SECRET | jq -r .DB_PASSWORD)" >> $GITHUB_ENV
          echo "JWT_SECRET=$(echo $SECRET | jq -r .JWT_SECRET)" >> $GITHUB_ENV
          echo "PORT=$(echo $SECRET | jq -r .PORT)" >> $GITHUB_ENV

      - name: Build Docker Image
        run: docker build -t myapp:latest .

      - name: Deploy to EC2
        run: |
          ssh ec2-user@your-ec2-ip "
            docker stop myapp || true &&
            docker rm myapp || true &&
            docker run -d \
              -e DB_PASSWORD=$DB_PASSWORD \
              -e JWT_SECRET=$JWT_SECRET \
              -e PORT=$PORT \
              -p 80:5000 \
              --name myapp \
              myapp:latest
          "

Step A

GitHub assumed AWS role securely.

Step B

CLI fetched secret from AWS.

Step C

We extracted JSON values using jq.

Step D

We added them to $GITHUB_ENV.

Step E

Docker container started with -e flags.