Builder Pattern is a creational pattern used when:
Object construction is complex and has many optional fields or configurations.
Instead of this nightmare:
```js
new User("Balaji", 25, "India", "admin", true, false, "dark", "en", true);
//We do:
new UserBuilder("Balaji")
  .setAge(25)
  .setCountry("India")
  .setRole("admin")
  .enableDarkMode()
  .build();
//Readable. Maintainable. Scalable.
```
Why Do We Need It?
In LLD, builder helps when:
Constructor has too many parameters
Many parameters are optional
Order of parameters becomes confusing
You want immutability after creation
You want validation before object creation
It solves the Telescoping Constructor Problem.
📍 When To Use Builder
Use when:
Object has many optional configs
Object creation involves validation
Object creation is step-by-step
You want clean readable construction
You want to prevent partially created objects

Real LLD Example (Backend-style JS)
Let’s build a Server Configuration Object
In real backend systems, server config might have:
host
ssl
timeout
logging
retryCount
cacheEnabled
cors
rateLimit
```js
//Without builder
class ServerConfig {
  constructor(host, port, ssl, timeout, logging, retryCount, cacheEnabled) {
    this.host = host;
    this.port = port;
    this.ssl = ssl;
    this.timeout = timeout;
    this.logging = logging;
    this.retryCount = retryCount;
    this.cacheEnabled = cacheEnabled;
  }
}
//Builder Pattern
//Step 1: Target class
class ServerConfig {
  constructor(builder) {
    this.host = builder.host;
    this.port = builder.port;
    this.ssl = builder.ssl;
    this.timeout = builder.timeout;
    this.logging = builder.logging;
    this.retryCount = builder.retryCount;
    this.cacheEnabled = builder.cacheEnabled;

    Object.freeze(this); // makes it immutable
  }
}
//Step 2: Builder class
class ServerConfigBuilder {
  constructor(host, port) {
    // required fields
    this.host = host;
    this.port = port;

    // default values
    this.ssl = false;
    this.timeout = 3000;
    this.logging = false;
    this.retryCount = 3;
    this.cacheEnabled = false;
  }

  enableSSL() {
    this.ssl = true;
    return this;
  }

  setTimeout(timeout) {
    this.timeout = timeout;
    return this;
  }

  enableLogging() {
    this.logging = true;
    return this;
  }

  setRetryCount(count) {
    this.retryCount = count;
    return this;
  }

  enableCache() {
    this.cacheEnabled = true;
    return this;
  }

  build() {
    if (!this.host || !this.port) {
      throw new Error("Host and Port are required");
    }

    return new ServerConfig(this);
  }
}
//Step3: Usage
const serverConfig = new ServerConfigBuilder("localhost", 8080)
  .enableSSL()
  .enableLogging()
  .setTimeout(5000)
  .setRetryCount(5)
  .enableCache()
  .build();

console.log(serverConfig);
//Also useful for API request builder
const request = new ApiRequestBuilder()
  .setMethod("POST")
  .setUrl("/users")
  .setBody({ name: "Balaji" })
  .setHeaders({ Authorization: "Bearer token" })
  .build();
