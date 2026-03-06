Why Notifications Matter
Notifications drive real-time user engagement in modern applications.
Common examples:

Instant messaging alerts
E-commerce order updates
Banking transaction confirmations

Supported channels:

Push — instant, app-dependent (mobile/desktop)
SMS — reliable for non-app users and critical alerts
Email — rich content, asynchronous, good for summaries/reports

Key challenges:

Delivery reliability during failures
User consent and privacy
Handling millions of notifications per day
Cost management (especially SMS)

Goal: Build a generic, extensible notification platform.
Foundational Concepts Recap
The design builds on standard system design building blocks:

Client-server communication
Databases and load balancers
Proxies, CDNs, caching
Message queues (RabbitMQ, Kafka)
Horizontal scaling, sharding
Rate limiting
Unique ID generation
CAP theorem trade-offs

Message queues are especially critical for handling bursts and ensuring reliability.
Notification Types
All notifications share the goal of delivering event-based information, but delivery mechanics differ:

Push: Requires device tokens; fast but fails if app is not installed/open
SMS: Phone-number based; works offline but expensive and rate-limited
Email: Supports HTML, attachments; slower and prone to spam filters

The system should intelligently route messages to the appropriate channel(s) based on user preferences.
Requirement Gathering
Functional Requirements

Support SMS, email, push (iOS + Android)
Real-time delivery for urgent alerts (<5–10 seconds)
Scheduled and batched notifications
Multi-channel delivery for single event
User opt-in/opt-out and channel preferences
Frequency caps (e.g., max 10 SMS/day per user)

Non-Functional Requirements

High availability (99.9%+)
Low end-to-end latency
Handle peak loads (millions/day)
Compliance (GDPR consent, TCPA for SMS)
Cost awareness and monitoring

Basic High-Level Design
Core flow:

Application service detects an event → calls Notification API with payload
Notification service:
Fetches user profile (email, phone, device tokens, preferences)
Renders personalized message using templates
Decides channels to send

Routes formatted messages to third-party providers
Returns success/failure and logs delivery status

Third-party providers handle the actual delivery.
Third-Party Providers (Email & SMS)
Choose providers based on volume, pricing, deliverability, and features.
Email Providers















































ProviderKey StrengthsPricing ModelNotesMailchimpTemplates, automation, analyticsFree tier + pay-per-useMarketing-focused, good UIBrevo (Sendinblue)Transactional + marketing, SMS comboFree tier + low per-messageStrong EU complianceAmazon SESExtremely scalable, AWS-nativeVery cheap at volumeRequires warmup and domain verificationSendGridExcellent APIs, webhooks, suppressionFree tier + pay-per-useHigh deliverabilityMailgunInbound parsing, fast APIsPay-per-useDeveloper-friendlyPostmarkTransactional focus, fast deliveryFixed per 10K emailsVery reliable for critical emails
SMS Providers















































ProviderKey StrengthsPricing (US approx.)NotesTwilioGlobal, MMS, voice, programmable~$0.0075/messageMost popular, rich featuresVonage (Nexmo)Carrier-grade, WhatsApp integration~$0.006/messageGood analyticsPlivoLow latency, two-way messaging~$0.0055/messageCost-effectiveBird (MessageBird)Omnichannel, conversational flows~$0.007/messageStrong WhatsApp/SMS comboSinchRCS support, verification APIs~$0.0069/messageEnterprise-gradeBandwidthDirect carrier connections~$0.004/messageCheapest for US traffic
Push Providers

iOS: Apple Push Notification service (APNs)
Android: Firebase Cloud Messaging (FCM)

Both are platform-mandated and free at scale.
User Data Storage
Collect during signup/onboarding:

Email, phone number, country code
Push device tokens (rotated periodically)
Channel preferences and consent flags

Recommended Schema
Users table

user_id (PK)
email
phone
country_code
preferences (JSON: allowed channels, frequency limits)
consent flags

Devices table

device_token (unique)
user_id (FK)
platform (ios/android/web)
last_active

Use relational DB for consistency; cache frequently accessed records in Redis.
Improved High-Level Design

API endpoint: POST /notify {event_type, user_id, payload, template_id}
Rate limiting per user/channel (Redis counters)
Template engine for personalization
Multi-channel fan-out logic
Idempotency using unique event IDs

Reliability Layer: Queues & Retries
To handle failures and spikes:

Enqueue messages into channel-specific queues (e.g., sms_queue, email_queue, ios_push_queue)
Workers consume messages asynchronously
On send attempt:
Log "pending"
Call third-party API
On success → "sent" + delivery callback
On failure → exponential backoff retries (max 3–5 attempts)
Move persistent failures to dead-letter queue


This decouples the core app from delivery delays/outages.
Analytics & Tracking
Track full lifecycle:

Pending → Sent → Delivered → Opened/Clicked → Failed/Bounced
Store in time-series DB or logs
Use provider webhooks for accurate delivery/open rates
Metrics: delivery %, bounce rate, unsubscribe trends, cost per notification

Complete Architecture Summary

Event sources (services) → Notification API
Auth + rate limiting
User data lookup (DB + cache)
Message rendering
Channel decision + fan-out
Queues → Workers → Third-party providers
Delivery callbacks → Analytics & logs

Final Design Principles

Start simple, iterate toward reliability
Make the system channel-agnostic where possible
Prioritize user consent and experience
Monitor costs, especially SMS
Add extensibility for future channels (WhatsApp, in-app banners, etc.)

This draft can be used directly as notes, a blog post summary, or interview preparation material.
Let me know if you'd like any section expanded, shortened, or turned into bullet points/slides format.