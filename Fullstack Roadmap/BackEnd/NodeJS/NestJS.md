NestJS is a progressive, opinionated Node.js framework for building scalable, maintainable, enterprise-grade backend applications.
built on top of: Node.js, Express.js (default)

1️⃣ Why NestJS Exists (The Problem It Solves)
Express/Fastify are:
Minimal
Flexible
But…
❌ No enforced structure
❌ Hard to scale in large teams
❌ Dependency management becomes messy
NestJS solves this by providing:
✅ Strong architecture
✅ Dependency Injection
✅ Modular design
✅ Built-in best practices
Client
  ↓
HTTP Request
  ↓
Controller
  ↓
Service (Business Logic)
  ↓
Repository / DB / External API
  ↓
Response

# Modules(Application Structure)
@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [DatabaseModule],
})
export class UserModule {}  

Purpose:
Organize code by feature
Control dependency scope
Enable lazy loading

# Controllers(Handles Incoming HTTP requests)
@Controller('users')
export class UserController {
  @Get()
  getUsers() {
    return [];
  }
}
Controller depends on UserService
Controller does not know how data is fetched
UserController → UserService → DatabaseService


# Providers and services (Business Logic)
@Injectable()
export class UserService {
  findAll() {
    return [];
  }
}
Request
 ↓
Middleware(Same concept as express-request modification)
 ↓
Guards (Auth / Roles)
 ↓
Interceptors (Before)
 ↓
Pipes (Validation / Transform)
 ↓
Controller
 ↓
Service
 ↓
Interceptors (After)
 ↓
Exception Filters
 ↓
Response

# Guards(Authorization Layer)
Used for authentication & authorization.
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context) {
    return true;
  }
}
JWT validation
Role-based access control
Permission checks

# Pipes
@Post()
createUser(@Body(new ValidationPipe()) dto: CreateUserDto) {}

Used for Input validation
Type conversion
Data sanitization

# Interceptors
@Injectable()
export class LoggingInterceptor {
  intercept(context, next) {
    return next.handle();
  }
}
Used for:
Logging
Response mapping
Performance monitoring
Caching

# Exceptional Filters
@Catch(HttpException)
export class HttpErrorFilter {
  catch(exception, host) {}
}
Centralized error handling
Clean controllers
Consistent error responses

Built-in Support:
REST APIs
GraphQL
WebSockets
gRPC
Microservices (Kafka, RabbitMQ, Redis)
Cron jobs

| Feature              | Express  | NestJS     |
| -------------------- | -------- | ---------- |
| Structure            | ❌ None   | ✅ Enforced |
| Dependency Injection | ❌ Manual | ✅ Built-in |
| Learning Curve       | Easy     | Medium     |
| Enterprise Ready     | ❌        | ✅          |
| Scalability          | Manual   | Built-in   |
Express → faster start, harder to scale teams
NestJS → slower start, safer long-term growth
DI & modules slightly reduce raw performance
But massively improve maintainability


# Opinionated vs Unopinionated Frameworks
An opinionated framework enforces a specific way to structure your app, write code, and solve common problems.
Key Characteristics
Fixed project structure
Built-in solutions for routing, state management, DI, testing
Strong conventions → less decision-making
Easier for large teams to stay consistent

An unopinionated framework gives you building blocks, but you decide how to assemble them.
Key Characteristics
Minimal rules
You choose libraries (routing, state, data fetching)
Maximum flexibility
Architecture decisions are yours

