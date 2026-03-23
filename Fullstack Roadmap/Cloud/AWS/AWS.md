Amazon Web Services offers EC2 (Elastic Compute Cloud) — which is basically a virtual machine in the cloud.
Think of EC2 like:
“Renting a remote computer where you can install Node.js, run your React build, host APIs, run Docker, etc.”
Instead of buying a physical server, you launch an EC2 instance in minutes.
🖥️ What Happens When You Launch an EC2?
You choose:
OS (Ubuntu, Amazon Linux, Windows)
CPU + RAM
Storage
Security rules
SSH key to access it
Then AWS gives you:
A public IP
A virtual machine running in their data center
You SSH into it and deploy your app.

⚙️ Instance Types (Very Important)
Instance type = how powerful your virtual machine is
AWS groups them by use case:
Examples:
t2.micro
t3.micro
t3.medium
m5.large
Best for:
Web apps
Small APIs
Development servers
👉 For example, hosting a small Node.js backend for your React app → t3.micro is common.
2️⃣ Compute Optimized
Examples:
c5.large
c6g.large
Best for:
Heavy CPU tasks
Data processing
High-performance servers
3️⃣ Memory Optimized
Examples:
r5.large
Best for:
Large in-memory databases
Caching systems
4️⃣ Storage Optimized
Examples:
i3.large
Best for:
High disk I/O workloads
🔎 What Does t2.micro Mean?
t2.micro =
t → family
micro → size (small CPU + small RAM)
Free tier eligible usually includes t2.micro or t3.micro.
🔐 Security Groups
Security Group = Firewall for your EC2
It controls:
Who can access your server
On which port
From which IP
Example: Hosting a React app on EC2
You’d allow:
| Port | Purpose                           |
| ---- | --------------------------------- |
| 22   | SSH (to connect from your laptop) |
| 80   | HTTP                              |
| 443  | HTTPS                             |
If port 80 is blocked → your site won’t open.
Security groups are:
Stateful
Attached to instance
Allow rules only (no deny rules)
Think:
Security group = “Gatekeeper”
🔑 Key Pairs
When launching EC2, AWS asks for a Key Pair.
This is for:
Secure SSH login
Password-less authentication
It generates:
.pem file (private key)
Public key stored in AWS
To connect:
ssh -i my-key.pem ubuntu@<public-ip>
Without key pair → you cannot SSH into the instance.
Very important:
Keep .pem safe
Don’t commit it to GitHub
Now imagine this scenario:
Your app gets:
50 users → fine
10,000 users → server crashes 😅
This is where Auto Scaling comes in.
What is Auto Scaling?
It automatically:
Launches new EC2 instances when traffic increases
Terminates instances when traffic drops
How It Works (Basic Flow)
You define:
Min instances (e.g., 1)
Max instances (e.g., 5)
CPU threshold (e.g., 70%)
If CPU > 70%:
Launch new instance
If CPU < 20%:
Terminate extra instances
Real Production Setup
You usually combine:
EC2 instances
Load Balancer
Auto Scaling Group
Flow:
User → Load Balancer → EC2 Instance 1 / 2 / 3
The load balancer distributes traffic evenly.
🧠 Simple Mental Model
| Concept        | Think of it as                       |
| -------------- | ------------------------------------ |
| EC2            | A rented computer                    |
| Instance Type  | How powerful that computer is        |
| Security Group | Firewall                             |
| Key Pair       | SSH password replacement             |
| Auto Scaling   | Automatic cloning when traffic grows |

# S3
S3 is basically:
An object storage service where you store files.
Not servers.
Not databases.
Just files.
You store:
Images
Videos
PDFs
React build files
Backups
Logs
Mental Model
Bucket = Folder (top level container)
Object = File
Key = File path
Example:
my-app-bucket/
   ├── index.html
   ├── main.js
   └── images/logo.png
You can host a full React app using just S3.
How it works:
Run:
npm run build
Upload /build folder to S3 bucket
Enable:
"Static Website Hosting"
Set:
index document → index.html
error document → index.html (for SPA routing)
Now S3 gives you a public website URL.
When to Use S3 Static Hosting?
React / Next.js static export
Landing pages
Portfolio sites
Documentation sites
Cheap + scalable + no server maintenance.
🔐 Bucket Policies
Bucket Policy = Permission rules for the entire bucket.
It’s JSON-based and defines:
Who can access
What actions are allowed
On which resources
Example: Make Bucket Public (for static hosting)
{
  "Effect": "Allow",
  "Principal": "*",
  "Action": "s3:GetObject",
  "Resource": "arn:aws:s3:::my-bucket/*"
}
This means:
Anyone
Can read files
From this bucket
| Feature       | Controls                    |
| ------------- | --------------------------- |
| Bucket Policy | Whole bucket permissions    |
| IAM Policy    | User/role permissions       |
| Object ACL    | Individual file permissions |
🔏 Signed URLs (Very Powerful Feature)
Now imagine:
You store:
Premium PDFs
Private videos
User invoices
You don’t want them public.
But you want:
Temporary access
That’s where Signed URLs come in.
What is a Signed URL?
A temporary URL that:
Gives access to a private object
Expires after some time
Example:
https://bucket.s3.amazonaws.com/file.pdf?X-Amz-Signature=abc123...
This URL:
Works for 10 minutes
Then becomes invalid
Real Example Flow (Node.js Backend)
User logs in
Backend verifies user
Backend generates signed URL
Frontend uses it to download file
Example (Node):
const command = new GetObjectCommand({
  Bucket: "my-bucket",
  Key: "private/invoice.pdf"
});
const url = await getSignedUrl(s3Client, command, { expiresIn: 600 });
# CDN
CDN Usage (Very Important in Production)
Now let’s level up.
If users from:
India
US
Europe
All access your S3 bucket in one region (say Mumbai), latency increases.
Solution?
Use a CDN.
CloudFront + S3
Amazon CloudFront is AWS’s CDN.
It:
Caches your S3 files
Distributes them worldwide
Reduces latency
Reduces S3 cost
Adds HTTPS + security
| Direct S3              | S3 + CloudFront         |
| ---------------------- | ----------------------- |
| Public bucket required | Can keep bucket private |
| No global caching      | Global edge caching     |
| Limited security       | Advanced security + WAF |
| Concept        | Meaning                 |
| -------------- | ----------------------- |
| S3             | File storage            |
| Bucket         | Container of files      |
| Static Hosting | Host frontend directly  |
| Bucket Policy  | Access control          |
| Signed URL     | Temporary secure access |
| CloudFront     | CDN for global delivery |

# Amazon Web Services provides IAM (Identity and Access Management).
IAM controls:
Who can access AWS and what they can do.
It answers 2 questions:
Who are you?
What are you allowed to do?
Without IAM, AWS would be chaos.
👤 IAM Users vs 👥 IAM Roles
This is where most people get confused.
👤 IAM User
An IAM User is:
A permanent identity for a human or system.
Example:
You (developer)
DevOps engineer
CI/CD bot
They have:
Username
Password (for console login)
Access keys (for CLI / API)
Example
You create:
User: balaji-dev
Attach policies:
EC2 access
S3 read access
Now that user can log in and perform those actions.
When to Use IAM Users?
Small teams
Direct console access
Personal developer accounts
But…
In production companies, IAM users are minimized.
👥 IAM Roles (Very Important)
IAM Role is:
A temporary identity that AWS services or users can assume.
Roles DO NOT have:
Passwords
Permanent access keys
Instead:
They are assumed temporarily
AWS provides temporary credentials
Example 1: EC2 accessing S3
You have:
EC2 instance
Private S3 bucket
You attach an IAM Role to EC2:
Role: S3ReadOnlyRole
Now EC2 can access S3 securely.
No hardcoded keys.
No storing secrets in code.
🔥 This is best practice.
Example 2: Cross-account access
Account A wants to access Account B.
Instead of sharing credentials:
Account A assumes a role in Account B.
Secure + clean.

| IAM User                        | IAM Role                        |
| ------------------------------- | ------------------------------- |
| Permanent identity              | Temporary identity              |
| For humans or long-term systems | For services & temporary access |
| Has credentials                 | No long-term credentials        |
| Manual login                    | Assumed dynamically             |
📜 IAM Policies
Now the real power.
A Policy defines:
What actions are allowed or denied.
Policies are written in JSON.
Basic Policy Structure
{
  "Effect": "Allow",
  "Action": "s3:GetObject",
  "Resource": "arn:aws:s3:::my-bucket/*"
}
It says:
Allow
Download files
From this bucket
Policy Types
1️⃣ Managed Policies
Created by AWS or you.
Example:
AmazonS3FullAccess
AmazonEC2ReadOnlyAccess
Reusable across users/roles.
2️⃣ Inline Policies
Attached directly to one user or role.
Not reusable.
| Service | Action                  |
| ------- | ----------------------- |
| S3      | s3:GetObject            |
| EC2     | ec2:StartInstances      |
| RDS     | rds:DescribeDBInstances |
# Principle of Least Privilege (Super Important)
This is a security mindset.
It means:
Give only the permissions required. Nothing extra.
❌ Bad Example
You give:
AdministratorAccess
To:
Backend server
Now if hacked → attacker controls entire AWS account.
Disaster.
✅ Good Example
Backend server only needs:
Read from S3
Write logs to CloudWatch
So policy should allow:
s3:GetObject
logs:PutLogEvents
Nothing more.
Real-World Scenario
Let’s say you deploy a Node.js app on EC2.
What it needs:
Read images from S3
Access RDS
It DOES NOT need:
Delete buckets
Create IAM users
Modify VPC
So don’t allow those.

# Lamda
Lambda (Serverless)
AWS Lambda is completely different.
Lambda =
Run code without managing servers.
You just upload a function:
exports.handler = async (event) => {
  return "Hello world";
};
AWS:
Runs it when triggered
Scales automatically
Stops it after execution
Charges only for execution time
No server to manage.
🧠 Core Difference
| EC2               | Lambda                   |
| ----------------- | ------------------------ |
| Server-based      | Serverless               |
| Runs continuously | Runs only when triggered |
| You manage infra  | AWS manages infra        |
| Pay for uptime    | Pay per execution        |
| Full control      | Limited environment      |
💰 Cost Model
EC2
You pay:
Even if no one uses your app
Example:
t3.micro → pay 24/7
Lambda
You pay:
Only when function runs
Based on execution time + memory
If no traffic → almost ₹0 cost.
🧪 Example: Simple API
EC2 Flow
User → Load Balancer → EC2 → Express server → Response
Lambda Flow
User → API Gateway → Lambda → Response
Much simpler infra.

# S3 steps
🪣 STEP 1 — Create S3 Bucket
Go to AWS → S3 → Create bucket
Important Settings:
Bucket name: your-domain.com
Region: same as most of your infra
Uncheck “Block all public access”
Acknowledge warning
After creation:
Enable Static Hosting
Bucket → Properties → Static website hosting → Enable
Index document: index.html
Error document: index.html (important for SPA routing)
🔓 STEP 2 — Add Bucket Policy
Go to Bucket → Permissions → Bucket Policy
Add:
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-domain.com/*"
    }
  ]
}
This allows public reads.
📤 STEP 3 — Upload Your Build
Upload all files inside /out, not the folder itself.
Now your app is technically live via S3 URL
(but don’t use this in production — no HTTPS, no CDN).
🚀 STEP 4 — Create CloudFront Distribution
Go to CloudFront → Create Distribution
Origin Settings
Origin domain → Select your S3 bucket
Origin access → Use Origin Access Control (OAC) (recommended)
Default Behavior
Viewer protocol policy → Redirect HTTP to HTTPS
Allowed methods → GET, HEAD
Default root object
Set:
index.html
Create distribution.
Wait 5–10 minutes.
🔐 STEP 5 — Add HTTPS (ACM Certificate)
Go to:
AWS Certificate Manager
IMPORTANT:
Certificate must be created in us-east-1 region (for CloudFront).
Request certificate
Add your domain (e.g. app.yoursite.com)
Validate via DNS
Once issued:
CloudFront → Edit distribution →
Attach ACM certificate.
🌍 STEP 6 — Connect Custom Domain
If using:
Amazon Route 53
Create:
Record type: A
Alias → CloudFront distribution
Now:
https://yourdomain.com works.
🧠 IMPORTANT: SPA Routing Fix (Very Important)
Without this, refreshing /dashboard gives 404.
In CloudFront:
Go to → Error Pages → Create custom error response:
HTTP error code: 403
Customize response: Yes
Response page path: /index.html
HTTP response code: 200
Repeat for:
404
This makes SPA routing work properly.
⚡ STEP 7 — Caching Optimization (Pro Tip)
Create 2 cache behaviors:
For static assets:
_next/static/*
Cache TTL: 1 year
For index.html:
Cache TTL: 0 or very low
This ensures:
JS/CSS cached heavily
App updates reflect quickly

AWS Identity and Access Management (IAM) allows you to manage access to AWS services securely. It lets you create and manage AWS users, groups, and roles, and use permissions to allow or deny access.
IAM roles allow AWS resources to act on behalf of users or services. Roles have specific permissions and can be assumed by trusted entities.
IAM policies are JSON documents that define permissions. They can be attached to users, groups, or roles to grant or deny actions on resources.

Enable CloudTrail for API logs, use CloudWatch Logs for application/system logs, and set alarms or dashboards.
AWS CodeDeploy automates code deployments to any instance, including EC2, Lambda, or on-premise servers.

AWS CodeBuild is a fully managed continuous integration service that compiles source code, runs tests, and produces packages ready for deployment.

AWS CodePipeline is a fully managed continuous integration and continuous delivery (CI/CD) service for fast and reliable application and infrastructure updates.