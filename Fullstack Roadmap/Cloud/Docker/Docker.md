# Docker
Docker is a containerization platform that packages your application along with all its dependencies (runtime, libraries, configs, system tools) into a container.
A container runs the same way:
On your laptop
On staging
On production
On cloud servers
It eliminates environment mismatch problems.
1️⃣ Environment Consistency
Prevents:
“Works on my machine” problems
Your app runs identically everywhere.
2️⃣ Dependency Isolation
Different projects can use:
Different Node versions
Different Python versions
Different system libraries
Without conflict.
3️⃣ Simplified Deployment
Instead of configuring servers manually, you:
Build a Docker image
Deploy the container
Infrastructure becomes predictable.
4️⃣ Scalability & Microservices
Modern systems use:
Microservices
Kubernetes
Cloud-native architecture
Docker is the standard packaging unit for these systems.
5️⃣ Faster Onboarding
New developer just runs:
docker-compose up
No manual setup chaos.
🧠 In One Line
Docker ensures:
Your application runs consistently, predictably, and portably across all environments.

# Image VS Container
A Docker image is a static template containing the application and its dependencies, while a container is a running instance of that image.
| Docker Image        | Docker Container      |
| ------------------- | --------------------- |
| Static              | Running               |
| Blueprint           | Instance              |
| Read-only           | Writable layer        |
| Stored in registry  | Runs on Docker engine |
| Doesn’t consume CPU | Consumes CPU & RAM    |
You build an image:
docker build -t my-react-app .
Now you have:
my-react-app (image)
When you run:
docker run my-react-app
Now you have:
container #1 running
Run it again:
docker run my-react-app
Now you have:
container #2 running

# Docker Layer
A Docker image is built in layers.
Every instruction in your Dockerfile creates a new layer.
Example:
FROM node:20
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
Each of these lines = one layer.
So your image isn’t one big file.
It’s a stack of layered filesystems.
How Layers Work Internally
When Docker builds an image:
1️⃣ It pulls the base image (node:20) → base layer
2️⃣ Adds a layer for WORKDIR
3️⃣ Adds a layer for COPY package.json
4️⃣ Adds a layer for RUN npm install
5️⃣ Adds a layer for COPY . .
6️⃣ Adds a layer for RUN npm run build
Each layer:
Is immutable
Is cached
Is reused if unchanged
Why Layers Are Powerful
1️⃣ Caching (Huge for performance)
Let’s say you only change a React component.
Docker rebuild process:
Base image → cached
npm install → cached (because package.json didn’t change)
Only COPY . . and npm run build re-run
So build becomes FAST ⚡
This is why order in Dockerfile matters.
🔥 Layer Reuse Across Images
Here’s the cool part.
If two projects use:
FROM node:20
Docker does NOT download it twice.
That base layer is shared.
Same on your system:
Multiple images can share the same base layers.
Space efficient + bandwidth efficient.
📦 What Happens When a Container Runs?
When you start a container:
Docker adds one extra layer on top:
🟢 Writable layer
All runtime changes go there.
Example:
App writes logs
Temporary files created
Runtime cache
Those changes DO NOT modify the image.
Image remains clean.
Container gets its own writable layer.
🧩 Image = Read-only layers
📦 Container = Image layers + 1 writable layer
That’s the key architecture.
Why Deleting Containers Doesn’t Remove Images
Because:
Containers sit on top of images
Images are separate layered filesystem objects
You can:
Delete container → image still exists
Delete image → containers depending on it break

One-Line Interview Answer
Docker images are composed of multiple immutable layers created by each Dockerfile instruction. These layers are cached and shared, improving build performance and storage efficiency.
# Best Practices
1️⃣ Use a Small Base Image
Bad:
FROM node:latest
Better:
FROM node:20-alpine
Why?
Smaller image size
Faster pull
Less attack surface
Better security
Alpine = lightweight Linux.
2️⃣ Use Multi-Stage Builds (VERY Important)
For React / Node apps:
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
# Stage 2: Production
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
Why?
Dev dependencies don’t go to production
Smaller final image
More secure
Cleaner separation
This is industry standard.
3️⃣ Leverage Layer Caching Properly
Order matters.
Correct:
COPY package*.json ./
RUN npm ci
COPY . .
Wrong:
COPY . .
RUN npm ci
Why?
Because any file change forces npm install again. Slow builds.
4️⃣ Use .dockerignore
Very underrated.
Create .dockerignore:
node_modules
.git
dist
build
.env
Why?
Prevents unnecessary files from being copied
Smaller build context
Faster builds
More secure
5️⃣ Don’t Use latest Tag
Bad:
FROM node:latest
Better:
FROM node:20.10-alpine
Why?
latest changes unexpectedly → production breaks randomly.
Version pinning = predictable builds.
6️⃣ Use npm ci Instead of npm install
Why?
Faster
Uses lockfile strictly
Reproducible builds
Better for CI/CD
7️⃣ Run as Non-Root User (Security)
By default containers run as root. Not ideal.
Better:
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
Prevents privilege escalation if compromised.
Security teams love this.
8️⃣ Keep Image Small
Tips:
Remove unnecessary tools
Use multi-stage builds
Avoid installing build tools in production stage
Combine RUN commands:
Instead of:
RUN apk update
RUN apk add curl
Do:
RUN apk update && apk add curl
Fewer layers.
9️⃣ Use Health Checks
Example:
HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1
Why?
Kubernetes / ECS can detect unhealthy containers
Enables auto-restart
🔟 Keep Containers Stateless
Containers should not store:
Database data
Uploaded files
Use:
Volumes
S3
RDS
Containers should be disposable.

# 📦 Docker Volumes
❓ Why Do We Need Volumes?
By default:
Containers are ephemeral
When a container dies → its data is gone
That’s fine for:
Stateless apps
Frontend servers
Not fine for:
Databases
Uploaded files
Logs
Persistent storage
That’s where volumes come in.
🧠 What Is a Volume?
A volume is external storage managed by Docker that lives outside the container filesystem.
It survives:
Container restarts
Container deletion
🔥 Example: Without Volume (Bad for DB)
docker run mysql
You add data.
Container crashes → you remove it → all data gone 💀
✅ Example: With Volume (Correct)
docker run -v mydata:/var/lib/mysql mysql
Now:
mydata lives outside container
Container can be deleted
Data still exists
🏗️ Types of Storage in Docker
1️⃣ Named Volumes (Recommended)
docker volume create myvolume
Used like:
docker run -v myvolume:/app/data
Best for:
Databases
Production setups
2️⃣ Bind Mounts
docker run -v /host/path:/container/path
Maps host folder directly.
Best for:
Local development
Live code reload
But not ideal for production portability.
🧠 Mental Model
Image = Blueprint
Container = Running process
Volume = External hard drive attached

# Networking in Docker
By default, containers are isolated.
They don’t magically talk to each other.
Docker provides networking drivers.
🏗️ Default Network (Bridge)
When you run:
docker run nginx
Docker attaches container to a bridge network.
It gets:
Internal IP
Can talk to other containers in same network
🔥 Example: Backend + DB Communication
Instead of:
localhost:3306
In Docker:
If both are in same network:
mysql:3306
Docker provides internal DNS.
Container name = hostname.
🧪 Example with docker-compose
services:
  backend:
    build: .
    depends_on:
      - db
  db:
    image: mysql
Backend can connect to:
db:3306
Not localhost.
This is very important.
🌍 Networking Modes
1️⃣ Bridge (Default)
Isolated network
Containers talk internally
Most common
2️⃣ Host Mode
Container shares host network.
docker run --network host
No port mapping needed.
Used when:
Performance critical apps
Low latency systems
3️⃣ None
No network at all.
Security isolation use cases.
🧠 Port Mapping (Important)
This exposes container port to outside world:
docker run -p 3000:3000 myapp
Meaning:
Host:3000 → Container:3000
Without -p, container is internal only.