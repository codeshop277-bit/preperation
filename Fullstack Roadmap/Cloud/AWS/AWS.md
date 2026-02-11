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
