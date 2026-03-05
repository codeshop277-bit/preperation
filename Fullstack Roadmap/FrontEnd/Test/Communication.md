# WebSockets
WebSockets create a persistent full-duplex connection between client and server.
HTTP → request → response → connection closes
WebSocket → connection stays open
Both client and server can send messages anytime

Protocol:
ws://
wss:// (secure)

This removes the need for repeated HTTP requests.

When it is used (Real Examples)
1. Chat applications
Example: WhatsApp / Slack

Flow:
Client connects → socket open
User A sends message
Server pushes message instantly to User B

2. Live dashboards
Example: trading dashboards
Server pushes price updates every second
Client UI updates without polling

3. Multiplayer games
Players' movements are sent instantly.

4. Live notifications
Example: GitHub notifications.

Architecture
Client (React)
      │
      │ WebSocket connection
      ▼
WebSocket Server (Node)
      │
      ▼
Database / Message Queue

Actual Code – Node.js WebSocket Server

Install:

npm install ws

```js
//Server
// server.js
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.send(JSON.stringify({ message: "Welcome client!" }));

  ws.on("message", (data) => {
    console.log("Received:", data.toString());

    ws.send(
      JSON.stringify({
        message: "Server received your message",
      })
    );
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

//Client
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("Connected");

      socket.send(
        JSON.stringify({ message: "Hello from client" })
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Server says:", data);
    };

    socket.onclose = () => {
      console.log("Connection closed");
    };

    return () => socket.close();
  }, []);

  return <h1>WebSocket Demo</h1>;
}

export default App;
```

# Webhooks
A Webhook is an HTTP callback triggered by an event.
Instead of:
Client asks server → "Did something happen?"

Webhook does:
Server → automatically notify another server
It is event-driven HTTP communication.
When it is used (Real Examples)

1. Payment gateways
Example: Stripe
User pays
Stripe → sends webhook → your backend
Backend → mark order as paid

2. GitHub CI/CD
Developer pushes code
GitHub → webhook → Jenkins
Jenkins → start build

3. Slack notifications
Deployment completed
Server → webhook → Slack channel

Architecture
Your Backend
      │
      │ registers webhook
      ▼
Third Party Service (Stripe/GitHub)

Event happens
      │
      ▼
POST request sent to your webhook endpoint

Actual Code – Express Webhook Receiver

Install:

npm install express

```js
//Server
import express from "express";

const app = express();

app.use(express.json());

app.post("/webhook", (req, res) => {
  const event = req.body;

  console.log("Webhook received:", event);

  if (event.type === "payment_success") {
    console.log("Update database → payment completed");
  }

  res.status(200).send("Webhook received");
});

app.listen(3000, () => {
  console.log("Webhook server running on port 3000");
});

Example Webhook Request

Service sends:

POST /webhook

Body:

{
  "type": "payment_success",
  "orderId": "12345"
}
```

# Polling
Polling means client repeatedly asks server for updates at intervals.

Client → request
Server → response
(wait 5 seconds)

Client → request again
Types:
Short polling
Long polling

When it is used
1. Order status tracking
Example: Amazon order

Client asks every 10 seconds
"Has order shipped?"

2. Build status
Example: CI pipeline UI
Client polls server for build progress

3. Legacy systems
Where WebSockets are unavailable.

React Polling Example
```js
import { useEffect, useState } from "react";

function Orders() {
  const [status, setStatus] = useState("");

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/order-status");
      const data = await res.json();

      setStatus(data.status);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return <div>Order Status: {status}</div>;
}
```
Long Polling Example
Server holds request until data changes.
Client:
```js
async function longPoll() {
  const res = await fetch("/updates");
  const data = await res.json();

  console.log("Update received:", data);

  longPoll();
}

longPoll();

//Server
app.get("/updates", (req, res) => {
  setTimeout(() => {
    res.json({ message: "New update available" });
  }, 10000);
});
```

# Pub/Sub (Publish Subscribe)
Pub/Sub is a messaging pattern where:

Publisher → sends message
Subscriber → receives message
Broker → routes messages

Publisher and subscriber do not know each other.

Architecture
Publisher
   │
   ▼
Message Broker (Redis / Kafka / RabbitMQ)
   │
   ▼
Subscribers

When it is used
1. Microservices communication
Order Service → publishes event
Inventory Service → subscribes
Notification Service → subscribes

2. Live notifications
Server publishes notification
All subscribed clients receive it

3. Distributed systems
Example:
User created event
Multiple services react

Pub/Sub Example using Redis

Install:

npm install redis
```js
//Publisher
import { createClient } from "redis";

const publisher = createClient();
await publisher.connect();

await publisher.publish("orders", "New order created");

//Subscriber
import { createClient } from "redis";

const subscriber = createClient();

await subscriber.connect();

await subscriber.subscribe("orders", (message) => {
  console.log("Received:", message);
});
```
| Feature       | WebSocket             | Webhook          | Polling               | Pub/Sub                 |
| ------------- | --------------------- | ---------------- | --------------------- | ----------------------- |
| Communication | Persistent connection | HTTP callback    | Repeated HTTP request | Message broker          |
| Direction     | Bidirectional         | Server → Server  | Client → Server       | Publisher → Subscribers |
| Real-time     | Yes                   | Near real-time   | Delayed               | Yes                     |
| Used for      | chat, live data       | payments, GitHub | order status          | microservices           |


How Broker Knows Consumer Is Online

A device (or service representing it) must create an active connection to the broker.
| System       | Connection Type              |
| ------------ | ---------------------------- |
| Kafka        | TCP connection               |
| Redis PubSub | TCP connection               |
| RabbitMQ     | AMQP connection              |
| MQTT         | persistent device connection |

When connected:

Consumer connects
Broker registers subscription
Broker sends messages

When disconnected:

Connection closed
Broker stops sending

. Example Flow (Device Offline → Online)
Step 1 — Device Offline
Publisher sends event
        ↓
Broker stores message
        ↓
No consumer connected
        ↓
Message stays in queue/topic

Device Comes Online

Device reconnects.

Device connects → backend
Backend reconnects → broker
Broker resumes delivering messages

# Real Production Architecture

Most apps do NOT connect frontend devices directly to brokers.
Publisher → Broker → Backend subscriber → WebSocket → Client
The backend maintains connection state of clients.

Example with Redis Pub/Sub + WebSocket
Step 1 — Redis Subscriber
```js
import { createClient } from "redis";

const subscriber = createClient();

await subscriber.connect();

await subscriber.subscribe("notifications", (message) => {
  broadcastToClients(message);
});

//Step 2 — WebSocket Server
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

const clients = new Set();

wss.on("connection", (ws) => {
  clients.add(ws);

  ws.on("close", () => {
    clients.delete(ws);
  });
});

function broadcastToClients(message) {
  clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}
// Step 3 — React Client Connects
const socket = new WebSocket("ws://localhost:8080");

socket.onmessage = (event) => {
  console.log("Notification:", event.data);
};
```
When the browser reconnects, it automatically starts receiving messages again.