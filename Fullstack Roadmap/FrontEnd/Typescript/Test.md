# TypeScript — Practical Reference for Real Codebases

---

## 1. `Partial<T>` — Optional fields for update payloads

```ts
interface roleEnum{
    admin: "admin",
    editor: "editor",
    viewer: "viewer"
}
interface User {
  id: number;
  name: string;
  email: string;
  role: roleEnum;
}

// PATCH endpoint — only send what changed
type UpdateUserPayload = Partial<Omit<User, "id">>;
tpe Payload = Partial<Omit<User, "id">>
// Result: { name?: string; email?: string; role?: "admin" | "editor" | "viewer" }

async function updateUser(id: number, payload: UpdateUserPayload) {
  const res = await fetch(`/api/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return res.json() as Promise<User>;
}

updateUser(42, { name: "Priya" });         // ok — only name
updateUser(42, { role: "admin" });          // ok — only role
updateUser(42, { id: 1, name: "Priya" });  // type error — id was Omit-ted
```

**React form state:**

```ts
function useForm<T>(initial: T) {
  const [values, setValues] = useState<Partial<T>>(initial);

  function set<K extends keyof T>(key: K, val: T[K]) {
    setValues(prev => ({ ...prev, [key]: val }));
  }

  return { values, set };
}

const { values, set } = useForm<User>({ id: 0, name: "", email: "", role: "viewer" });
set("name", "Arjun");  // ok
set("ghost", "x");     // type error — not a key of User
```

---

## 2. `Pick<T, K>` — Give components only what they need

```ts
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  supplierId: number;
  createdAt: string;
  description: string;
}

// ProductCard only needs 3 fields
type ProductCardProps = Pick<Product, "id" | "name" | "price">;

function ProductCard({ id, name, price }: ProductCardProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>₹{price}</p>
      <a href={`/products/${id}`}>View</a>
    </div>
  );
}
```

**Avoid:**
```ts
// Bad — component is now coupled to every field of Product
// even though it only renders 3 of them
function ProductCard(props: Product) { ... }
```

---

## 3. `Omit<T, K>` — Strip server-generated fields from create payloads

```ts
interface Post {
  id: number;
  title: string;
  body: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

// Server generates id, createdAt, updatedAt
type CreatePostDTO = Omit<Post, "id" | "createdAt" | "updatedAt">;
// Result: { title: string; body: string; authorId: number }

async function createPost(payload: CreatePostDTO): Promise<Post> {
  const res = await fetch("/api/posts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.json();
}

createPost({ title: "Hello", body: "World", authorId: 1 }); // ok
createPost({ id: 5, title: "Hello", body: "...", authorId: 1 }); // type error
```

**Strip sensitive fields:**

```ts
interface UserRecord {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  internalNotes: string;
}

type PublicUser = Omit<UserRecord, "passwordHash" | "internalNotes">;

function toPublicUser(user: UserRecord): PublicUser {
  const { passwordHash, internalNotes, ...rest } = user;
  return rest;
}
```

---

## 4. `Record<K, V>` — Lookup maps and grouped data

```ts
type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

// If you add a new status to OrderStatus and forget to add it here — compile error
const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pending:   { label: "Pending",   color: "yellow" },
  confirmed: { label: "Confirmed", color: "blue"   },
  shipped:   { label: "Shipped",   color: "purple" },
  delivered: { label: "Delivered", color: "green"  },
  cancelled: { label: "Cancelled", color: "red"    },
};4const status: Record<OrderStatus, {label: 'string', color: string}>

function StatusBadge({ status }: { status: OrderStatus }) {
  const { label, color } = statusConfig[status];
  return <span style={{ color }}>{label}</span>;
}
```

**Group by / cache:**

```ts
function groupByUser(orders: Order[]): Record<number, Order[]> {
  return orders.reduce((acc, order) => {
    acc[order.userId] = acc[order.userId] ?? [];
    acc[order.userId].push(order);
    return acc;
  }, {} as Record<number, Order[]>);
}

const cache: Record<string, { data: unknown; expiresAt: number }> = {};
```

---

## 5. `ReturnType<T>` + `Awaited<T>` — Derive types from functions

```ts
// api/users.ts
async function fetchUser(id: number) {
  const res = await fetch(`/api/users/${id}`);
  return res.json() as Promise<{
    id: number;
    name: string;
    email: string;
    role: string;
  }>;
}

// Derive User — if fetchUser changes, this updates automatically
type User = Awaited<ReturnType<typeof fetchUser>>;
// { id: number; name: string; email: string; role: string }

function UserProfile({ user }: { user: User }) {
  return <h1>{user.name}</h1>;
}
```

**Avoid:**
```ts
// Bad — manually duplicating the return type
// If fetchUser changes shape, this silently goes stale
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}
```

---

## 6. `Extract<T, U>` + `Exclude<T, U>` — Filter union members

```ts
type AppEvent =
  | { type: "click"; x: number; y: number }
  | { type: "keydown"; key: string }
  | { type: "keyup"; key: string }
  | { type: "scroll"; deltaY: number };

// Only keyboard events
type KeyboardEvent = Extract<AppEvent, { type: "keydown" | "keyup" }>;

// Everything except keyboard events
type PointerEvent = Exclude<AppEvent, { type: "keydown" | "keyup" }>;

function handleKeyboard(e: KeyboardEvent) {
  console.log(e.key); // TS knows .key exists here
}

function handlePointer(e: PointerEvent) {
  if (e.type === "click") console.log(e.x, e.y); // TS knows .x and .y exist
}
```

---

## 7. Discriminated union — Type-safe async state

```ts
type FetchState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

function useFetch<T>(url: string) {
  const [state, setState] = useState<FetchState<T>>({ status: "idle" });

  useEffect(() => {
    setState({ status: "loading" });
    fetch(url)
      .then(r => r.json())
      .then(data => setState({ status: "success", data }))
      .catch(e => setState({ status: "error", message: e.message }));
  }, [url]);

  return state;
}

function UserPage({ id }: { id: number }) {
  const state = useFetch<User>(`/api/users/${id}`);

  if (state.status === "loading") return <Spinner />;
  if (state.status === "error")   return <p>{state.message}</p>;
  if (state.status === "success") return <h1>{state.data.name}</h1>;
  return null;
}
```

**Avoid:**
```ts
// Bad — parallel booleans. isLoading=true and data both exist simultaneously — invalid state
type BadState = {
  isLoading: boolean;
  data?: User;
  error?: string;
};
```

---

## 8. `as const` — Freeze literals, derive unions from arrays

```ts
const ROUTES = {
  home:     "/",
  login:    "/login",
  profile:  "/profile/:id",
  settings: "/settings",
} as const;

type RoutePath = typeof ROUTES[keyof typeof ROUTES];
// "/" | "/login" | "/profile/:id" | "/settings"

function navigate(path: RoutePath) {
  window.location.href = path;
}

navigate(ROUTES.home); // ok
navigate("/oops");     // type error
```

**Derive a union type from an array:**

```ts
const ROLES = ["admin", "editor", "viewer", "guest"] as const;
type Role = typeof ROLES[number];
// "admin" | "editor" | "viewer" | "guest"

// Validate at runtime using the array, type-safe at compile time via Role
function isValidRole(r: string): r is Role {
  return (ROLES as readonly string[]).includes(r);
}

interface User {
  name: string;
  role: Role; // only the 4 valid values — not any string
}
```

---

## 9. `satisfies` — Validate shape without widening literals

```ts
type AppConfig = {
  env: "development" | "production" | "test";
  port: number;
  features: Record<string, boolean>;
};

const config = {
  env: "production",
  port: 3000,
  features: {
    darkMode: true,
    betaSignup: false,
  },
} satisfies AppConfig;

config.env;              // type: "production"  ← literal preserved
config.port;             // type: 3000          ← literal preserved
config.features.darkMode // type: boolean

// Type error — "staging" is not in the union
const bad = { env: "staging", port: 3000, features: {} } satisfies AppConfig;
```

**The problem it solves:**
```ts
// With annotation — validates but widens
const config: AppConfig = { env: "production", port: 3000, features: {} };
config.env; // type: "development" | "production" | "test"  ← widened, literals lost

// Without annotation — keeps literals but no validation
const config = { env: "production", port: 3000, features: {} };
config.env; // type: "production" ✓ but { env: "staging" } silently passes
```

---

## 10. Constrained generics — Reusable utilities with shape requirements

```ts
// Works for User[], Product[], Order[] — anything with an id field
function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

const findBy = <T extends {id: number}>(items: T[], id: number): T || undefined => {

}
findById(users, 1);     // User | undefined
findById(products, 5);  // Product | undefined

// K must be a real key of T — no guessing
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map(item => item[key]);
}

const names  = pluck(users, "name");          // string[]
const prices = pluck(products, "price");      // number[]
pluck(users, "nonexistent");                  // type error
```

**Generic API wrapper:**

```ts
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

const user    = await apiFetch<User>("/users/1");
const posts   = await apiFetch<Post[]>("/posts");
const created = await apiFetch<Post>("/posts", {
  method: "POST",
  body: JSON.stringify({ title: "Hello" }),
});
```

---

## 11. Type guard functions — Narrow unknown types safely

```ts
interface ApiError   { code: number; message: string }
interface ApiSuccess<T> { data: T }
type ApiResponse<T>  = ApiSuccess<T> | ApiError;

function isApiError(res: ApiResponse<unknown>): res is ApiError {
  return "code" in res && "message" in res;
}

async function getUser(id: number) {
  const res: ApiResponse<User> = await apiFetch(`/users/${id}`);

  if (isApiError(res)) {
    console.error(res.message); // TS knows: res is ApiError
    return null;
  }

  return res.data; // TS knows: res is ApiSuccess<User>
}
```

---

## 12. Exhaustive `never` check — Catch missing cases at compile time

```ts
type Action =
  | { type: "INCREMENT" }
  | { type: "DECREMENT" }
  | { type: "RESET"; to: number };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case "INCREMENT": return state + 1;
    case "DECREMENT": return state - 1;
    case "RESET":     return action.to;
    default:
      // Add a new action type and forget a case above → compile error here
      const _: never = action;
      throw new Error(`Unhandled action: ${JSON.stringify(_)}`);
  }
}
```

**Avoid:**
```ts
// Bad — new action types silently fall into default and return stale state
switch (action.type) {
  case "INCREMENT": return state + 1;
  default: return state;
}
```

---

## 13. Branded types — Prevent ID mix-ups

```ts
type Brand<T, B extends string> = T & { readonly __brand: B };

type UserId    = Brand<number, "UserId">;
type ProductId = Brand<number, "ProductId">;
type OrderId   = Brand<number, "OrderId">;

const UserId    = (n: number): UserId    => n as UserId;
const ProductId = (n: number): ProductId => n as ProductId;

function getUser(id: UserId): Promise<User> {
  return apiFetch(`/users/${id}`);
}

const uid = UserId(1);
const pid = ProductId(1);

getUser(uid);  // ok
getUser(pid);  // type error — ProductId is not UserId
getUser(1);    // type error — raw number not accepted
```

**Avoid:**
```ts
// Bad — all IDs are just number, easy to swap silently
function deleteUser(userId: number, actorId: number) { }

deleteUser(actorId, userId); // args swapped — no error, data deleted
```

---

## 14. Mapped types — Derive related types from one source

```ts
interface LoginForm {
  email: string;
  password: string;
}

// Auto-generates { email?: string; password?: string }
type FormErrors<T> = { [K in keyof T]?: string };

function validateLogin(form: LoginForm): FormErrors<LoginForm> {
  const errors: FormErrors<LoginForm> = {};
  if (!form.email.includes("@")) errors.email = "Invalid email";
  if (form.password.length < 8)  errors.password = "Too short";
  return errors;
}
```

**Loading states from data shape:**

```ts
interface DashboardData {
  users: User[];
  revenue: number;
  orders: Order[];
}

// { users: boolean; revenue: boolean; orders: boolean }
type LoadingState<T> = { [K in keyof T]: boolean };

const loading: LoadingState<DashboardData> = {
  users: true,
  revenue: false,
  orders: true,
};
```

---

## 15. Template literal types — Generate string unions

```ts
type Entity = "user" | "product" | "order";
type Action = "created" | "updated" | "deleted";
type DomainEvent = `${Entity}.${Action}`;
// "user.created" | "user.updated" | "user.deleted"
// "product.created" | ... (9 combinations total)

class EventBus {
  private handlers: Partial<Record<DomainEvent, ((payload: unknown) => void)[]>> = {};

  on(event: DomainEvent, handler: (payload: unknown) => void) {
    this.handlers[event] ??= [];
    this.handlers[event]!.push(handler);
  }

  emit(event: DomainEvent, payload: unknown) {
    this.handlers[event]?.forEach(h => h(payload));
  }
}

const bus = new EventBus();
bus.on("user.created", payload => console.log(payload)); // ok
bus.on("user.banned", payload => {});                    // type error
```

fn: ()