/**
 * ============================================================
 *  50 TypeScript Type Interview Questions
 *  Target: Senior Frontend Developer (5 YOE)
 *  Focus:  Types, Generics, Utility Types, Mapped Types,
 *          Conditional Types, Infer, Template Literals & more
 * ============================================================
 *
 * Instructions:
 *   - Read the problem statement in each question's comment.
 *   - Write your solution in the space marked // YOUR SOLUTION.
 *   - Reference answers are intentionally omitted — work it out!
 *   - Run `tsc --strict typescript_interview_questions.ts` to verify.
 */

// ─────────────────────────────────────────────────────────────
//  SECTION 1 — CORE TYPE FUNDAMENTALS  (Q1 – Q10)
// ─────────────────────────────────────────────────────────────

/**
 * Q1 — Union & Intersection Basics
 *
 * Problem:
 *   You have two types: `Employee` (id, name, department) and
 *   `Manager` (id, name, reports: string[]).
 *   1. Create an `EmployeeOrManager` union type.
 *   2. Create an `EmployeeManager` intersection type that combines both.
 *   3. Write a type guard `isManager` that narrows a value to `Manager`.
 */

type Employee = {
  id: number;
  name: string;
  department: string;
};

type Manager = {
  id: number;
  name: string;
  reports: string[];
};

// YOUR SOLUTION — Q1
type EmployeeOrManager = Employee | Manager
type EmployeeManager = Employee & Manager
function isManager(person: EmployeeOrManager): person is Manager {
  // ...
  return "reports" in person
}


/**
 * Q2 — Discriminated Unions
 *
 * Problem:
 *   Model an API response that can be:
 *     - `{ status: "success"; data: T }`
 *     - `{ status: "error";   message: string; code: number }`
 *     - `{ status: "loading" }`
 *   Make `ApiResponse` generic over `T`.
 *   Write a function `handleResponse<T>` that exhaustively handles
 *   all three cases (hint: use `never` for exhaustiveness check).
 */

// YOUR SOLUTION — Q2
type SuccessResponse<T> = { status: "success"; data: T };
type ErrorResponse   = { status: "error"; message: string; code: number };
type LoadingResponse = { status: "loading" };
type ApiResponse<T> = SuccessResponse<T> | ErrorResponse | LoadingResponse

function handleResponse<T>(response: ApiResponse<T>): string {
  switch (response.status) {
    case "success":
      return "success"
    case "error":
      // ✅ TypeScript knows response.message and response.code exist here
      return `Error ${response.code}: ${response.message}`;

    case "loading":
      return "Loading...";
    default:
      const _exhaustive: never = response;
      return _exhaustive
  }
}


/**
 * Q3 — `unknown` vs `any` — Safe Data Parsing
 *
 * Problem:
 *   A JSON payload arrives from an untrusted source typed as `unknown`.
 *   Write a type guard `isUserPayload` that checks the value has
 *   `{ id: number; email: string }` shape without casting to `any`.
 *   Then write `parseUser` that returns a typed `UserPayload` or throws.
 */

type UserPayload = { id: number; email: string };

// YOUR SOLUTION — Q3
function isUserPayload(value: unknown): value is UserPayload {
  // ...
  return (
    typeof value == "object" && value != null && "id" in value && "email" in value
  )
}

function parseUser(raw: unknown): UserPayload {
  // ...
  if(isUserPayload(raw)){
    return raw
  }
  throw new Error('')
}


/**
 * Q4 — Literal Types & `const` Assertion
 *
 * Problem:
 *   Define a constant `HTTP_METHODS` tuple containing the string
 *   literals "GET", "POST", "PUT", "DELETE", "PATCH" using `as const`.
 *   Derive a union type `HttpMethod` from it without duplicating the values.
 *   Then write `makeRequest(url: string, method: HttpMethod): void`.
 */

// YOUR SOLUTION — Q4
const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"] as const
type HttpMethod = typeof HTTP_METHODS[number]

function makeRequest(url: string, method: HttpMethod): void {
  console.log(`${method} ${url}`);
} 


/**
 * Q5 — `never` Type — Exhaustive Switch
 *
 * Problem:
 *   Given the union `type Shape = "circle" | "square" | "triangle"`,
 *   write a function `describeShape(s: Shape): string` using a switch.
 *   Add an `assertNever` helper so that if a new variant is added later
 *   TypeScript forces you to handle it (compile-time guarantee).
 */

type Shape = "circle" | "square" | "triangle";

// YOUR SOLUTION — Q5
function assertNever(x: never): never {
  throw new Error('x')
}

function describeShape(s: Shape): string {
  // ...
  switch (s){
    case 'circle':
      return 'circle'
    case 'square':
      return 'square'
    case 'triangle':
      return 'triangle'
    default:
      
      return assertNever(s)
      
  }
}


/**
 * Q6 — Tuple Types & Variadic Tuples
 *
 * Problem:
 *   1. Define a `Pair<A, B>` type alias representing a 2-element tuple.
 *   2. Define a `Triplet<A, B, C>` type.
 *   3. Write a generic `zip<A, B>(as: A[], bs: B[]): Pair<A, B>[]`
 *      that zips two arrays into an array of pairs (type-only, no impl).
 *   4. Using variadic tuple types, define `Concat<T extends unknown[],
 *      U extends unknown[]>` that concatenates two tuple types.
 */

// YOUR SOLUTION — Q6
type Pair<A, B> = [A, B]
type Triplet<A, B, C> = [A, B, C]
declare function zip<A, B>(as: A[], bs: B[]): Pair<A, B>[];
type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U]

// Test:
type C1 = Concat<[1, 2], [3, 4]>; // should be [1, 2, 3, 4]


/**
 * Q7 — `keyof` and Indexed Access Types
 *
 * Problem:
 *   Given `Config = { host: string; port: number; ssl: boolean }`:
 *   1. Create `ConfigKey` — the union of Config's keys.
 *   2. Create `ConfigValue` — the union of Config's value types.
 *   3. Write `getConfig<K extends keyof Config>(cfg: Config, key: K): Config[K]`.
 *   4. Create `ReadonlyConfig` using an indexed access + mapped type
 *      (don't use the built-in Readonly utility).
 */

type Config = { host: string; port: number; ssl: boolean };

// YOUR SOLUTION — Q7
type ConfigKey = keyof Config
type ConfigValue = Config[ConfigKey]

function getConfig<K extends keyof Config>(cfg: Config, key: K): Config[K] {
  return cfg[key]
}

type ReadonlyConfig = {readonly [K in keyof Config]: Config[K]}


/**
 * Q8 — `typeof` in Type Position
 *
 * Problem:
 *   You have a function `createTheme` that returns a large config object
 *   (don't write the full object — just 3–4 properties suffice).
 *   Without separately declaring an interface, derive the return type
 *   `Theme` using `typeof` and `ReturnType`.
 *   Then write `applyTheme(theme: Theme): void`.
 */

// YOUR SOLUTION — Q8
function createTheme() {
  return {
    primaryColor: "#0057FF",
    fontSize: 16,
    borderRadius: 4,
    isDark: false,
  };
}

type Theme = ReturnType<typeof createTheme>

function applyTheme(theme: Theme): void {
  console.log(theme.primaryColor);
}


/**
 * Q9 — Void, Never & Strict Return Types
 *
 * Problem:
 *   Explain (via types, not prose) the difference between:
 *   a) A function that returns `void`
 *   b) A function that returns `undefined` explicitly
 *   c) A function that returns `never`
 *   Provide one typed declaration for each case.
 *   Write `processAll<T>(items: T[], fn: (item: T) => void): void`
 *   and show why `fn` can return any value even though its type is void.
 */

// YOUR SOLUTION — Q9
type FnVoid = () => void
type FnUndefined = () => undefined
type FnNever = () => never

const a: FnVoid =      () => { console.log("hi"); };  // no return needed
const b: FnUndefined = () => undefined;               // must return undefined
const c: FnNever =     () => { throw new Error(); };  

function processAll<T>(items: T[], fn: (item: T) => void): void {
  // ...
}


/**
 * Q10 — Template Literal Types
 *
 * Problem:
 *   Given `type EventName = "click" | "focus" | "blur"`,
 *   derive `EventHandlerName` which should be
 *   `"onClick" | "onFocus" | "onBlur"` (PascalCase with "on" prefix).
 *   Then derive `RemoveOn<T>` that strips the "on" prefix and lowercases
 *   the first letter to recover the original EventName.
 */

type EventName = "click" | "focus" | "blur";

// YOUR SOLUTION — Q10
type EventHandlerName = `on${EventName}`
type RemoveOn<T extends string> = T extends `on${infer Rest}` ?Uncapitalize<Rest> : never

// Test:
type E1 = RemoveOn<"onClick">; // "click"


// ─────────────────────────────────────────────────────────────
//  SECTION 2 — GENERICS  (Q11 – Q20)
// ─────────────────────────────────────────────────────────────

/**
 * Q11 — Generic Constraints with `extends`
 *
 * Problem:
 *   Write `pluck<T, K extends keyof T>(arr: T[], key: K): T[K][]`.
 *   It should extract the values of a property from an array of objects.
 *   TypeScript must reject invalid keys at compile time.
 *
 *   Test: pluck([{id:1,name:"a"},{id:2,name:"b"}], "name") → ["a","b"]
 */

// YOUR SOLUTION — Q11
function pluck<T, K extends keyof T>(arr: T[], key: K): T[K][] {
  // ...
}


/**
 * Q12 — Generic Default Types
 *
 * Problem:
 *   Build a generic `Stack<T = string>` class with:
 *   - `push(item: T): void`
 *   - `pop(): T | undefined`
 *   - `peek(): T | undefined`
 *   - `readonly size: number`
 *   The default type param means `new Stack()` is a `Stack<string>`.
 */

// YOUR SOLUTION — Q12
class Stack<T = string> {
  // ...
}


/**
 * Q13 — Generic Functions vs Generic Types
 *
 * Problem:
 *   Differentiate (with code) between:
 *   a) A generic function type: `type Identity = <T>(arg: T) => T`
 *   b) A generic type alias: `type Box<T> = { value: T }`
 *   Show a case where `a` can be assigned to a variable without
 *   specifying `T`, but `b` requires `T` to be specified.
 */

// YOUR SOLUTION — Q13
type IdentityFn = // ...  (generic function type)
type Box<T> = // ...      (generic type alias)

const myIdentity: IdentityFn = // ...
const strBox: Box<string> = // ...


/**
 * Q14 — Constrained Generic with Multiple Bounds
 *
 * Problem:
 *   Write a function `merge<T extends object, U extends object>(a: T, b: U): T & U`
 *   that merges two objects. The return type must be the intersection.
 *   Then write `mergeWithTimestamp<T extends object>(obj: T): T & { createdAt: Date }`.
 */

// YOUR SOLUTION — Q14
function merge<T extends object, U extends object>(a: T, b: U): T & U {
  // ...
}

function mergeWithTimestamp<T extends object>(obj: T): T & { createdAt: Date } {
  // ...
}


/**
 * Q15 — Generic Repository Pattern
 *
 * Problem:
 *   Define a generic `Repository<T extends { id: number }>` interface with:
 *   - `findById(id: number): Promise<T | null>`
 *   - `findAll(): Promise<T[]>`
 *   - `save(entity: Omit<T, "id">): Promise<T>`
 *   - `delete(id: number): Promise<void>`
 *   Implement a `MockRepository<T extends { id: number }>` class
 *   that satisfies the interface using an in-memory array.
 */

// YOUR SOLUTION — Q15
interface Repository<T extends { id: number }> {
  // ...
}

class MockRepository<T extends { id: number }> implements Repository<T> {
  // ...
}


/**
 * Q16 — Inferring Function Parameter Types
 *
 * Problem:
 *   Write a generic `memoize<T extends (...args: any[]) => any>(fn: T): T`
 *   that wraps a function and caches its results.
 *   The returned function must have the exact same signature as `fn`
 *   (same parameters, same return type) — not just `(...args: any[]) => any`.
 */

// YOUR SOLUTION — Q16
function memoize<T extends (...args: any[]) => any>(fn: T): T {
  // ...
}


/**
 * Q17 — Generic Event Emitter Types
 *
 * Problem:
 *   Design a type-safe `EventEmitter<Events>` where `Events` is a
 *   record mapping event names to their payload types.
 *   Example:
 *     type AppEvents = { login: { userId: string }; logout: void }
 *     const emitter = new EventEmitter<AppEvents>()
 *     emitter.on("login", (payload) => payload.userId) // ✅
 *     emitter.emit("login", { userId: "u1" })          // ✅
 *     emitter.emit("logout", { userId: "u1" })         // ❌ compile error
 */

// YOUR SOLUTION — Q17
type AppEvents = {
  login: { userId: string };
  logout: void;
};

class TypedEventEmitter<Events extends Record<string, any>> {
  // ...
}


/**
 * Q18 — Covariance & Contravariance in Generics
 *
 * Problem:
 *   Explain (via code comments + types) why:
 *   - `Array<Dog>` is NOT assignable to `Array<Animal>` in strict mode
 *     (invariance for mutable containers)
 *   - `() => Dog` IS assignable to `() => Animal` (covariance for return)
 *   - `(a: Animal) => void` IS assignable to `(d: Dog) => void` (contravariance)
 *   Write the type aliases that demonstrate each scenario.
 */

// YOUR SOLUTION — Q18
type Animal = { name: string };
type Dog = { name: string; breed: string };

// Demonstrate covariance (return types):
type AnimalProducer = // ...
type DogProducer = // ...
// const ok: AnimalProducer = ...

// Demonstrate contravariance (parameter types):
type AnimalConsumer = // ...
type DogConsumer = // ...
// const ok2: DogConsumer = ...


/**
 * Q19 — Generic Higher-Order Functions
 *
 * Problem:
 *   Write a fully typed `pipe` function that composes two functions:
 *   `pipe<A, B, C>(f: (a: A) => B, g: (b: B) => C): (a: A) => C`
 *   Then extend it to handle 3 functions:
 *   `pipe3<A,B,C,D>(f,g,h): (a:A) => D`
 *   Use function overloads if you want to unify them under one name.
 */

// YOUR SOLUTION — Q19
function pipe<A, B, C>(f: (a: A) => B, g: (b: B) => C): (a: A) => C;
function pipe<A, B, C, D>(
  f: (a: A) => B,
  g: (b: B) => C,
  h: (c: C) => D
): (a: A) => D;
function pipe(...fns: Function[]): Function {
  // ...
}


/**
 * Q20 — Generic React Component Props
 *
 * Problem:
 *   Write a generic `Table<T>` component type (no JSX needed, just the
 *   prop types) where:
 *   - `rows: T[]`
 *   - `columns: Array<{ key: keyof T; header: string; render?: (val: T[keyof T]) => string }>`
 *   - `onRowClick?: (row: T) => void`
 *   Ensure `key` is strictly a key of `T` and `render` gets the correct
 *   value type for that key.
 */

// YOUR SOLUTION — Q20
type Column<T, K extends keyof T = keyof T> = {
  key: K;
  header: string;
  render?: (val: T[K]) => string;
};

type TableProps<T> = {
  rows: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
};


// ─────────────────────────────────────────────────────────────
//  SECTION 3 — UTILITY TYPES  (Q21 – Q30)
// ─────────────────────────────────────────────────────────────

/**
 * Q21 — `Partial`, `Required`, `Readonly`
 *
 * Problem:
 *   Given `UserProfile = { id: number; name: string; bio?: string; avatar?: string }`:
 *   1. `UpdateUserDto`  — all fields optional except `id` (required).
 *   2. `FrozenProfile`  — fully readonly, all fields required.
 *   3. `PublicProfile`  — only `name` and `bio`, both required.
 *   Implement each WITHOUT using the built-in utilities for 1 and 3
 *   (but you may use them for 2).
 */

type UserProfile = {
  id: number;
  name: string;
  bio?: string;
  avatar?: string;
};

// YOUR SOLUTION — Q21
type UpdateUserDto = // ...  (manual, no Partial/Pick)
type FrozenProfile = // ...  (use built-ins OK)
type PublicProfile = // ...  (manual, no Pick/Required)


/**
 * Q22 — `Pick` & `Omit`
 *
 * Problem:
 *   Given the following, implement `Pick` and `Omit` from scratch
 *   using mapped types — do NOT use the built-in versions.
 *   Name them `MyPick<T, K>` and `MyOmit<T, K>`.
 */

// YOUR SOLUTION — Q22
type MyPick<T, K extends keyof T> = // ...
type MyOmit<T, K extends keyof T> = // ...

// Test:
type PickTest = MyPick<{ a: 1; b: 2; c: 3 }, "a" | "b">; // { a: 1; b: 2 }
type OmitTest = MyOmit<{ a: 1; b: 2; c: 3 }, "c">;       // { a: 1; b: 2 }


/**
 * Q23 — `Record`
 *
 * Problem:
 *   1. Build a `FeatureFlags` type using Record where keys are
 *      `"darkMode" | "betaFeatures" | "analytics"` and values are `boolean`.
 *   2. Build a `RouteMap` where keys are string paths and values are
 *      `{ component: string; exact: boolean }`.
 *   3. Implement `MyRecord<K extends keyof any, V>` from scratch.
 */

// YOUR SOLUTION — Q23
type FeatureFlags = // ...
type RouteMap = // ...
type MyRecord<K extends keyof any, V> = // ...


/**
 * Q24 — `Extract` & `Exclude`
 *
 * Problem:
 *   Given `type AllEvents = "click" | "keydown" | "focus" | "blur" | "scroll"`:
 *   1. `MouseEvents`   — only "click" and "scroll"
 *   2. `NonMouseEvents`— everything except MouseEvents
 *   Implement `MyExtract<T, U>` and `MyExclude<T, U>` from scratch
 *   using conditional types.
 */

type AllEvents = "click" | "keydown" | "focus" | "blur" | "scroll";

// YOUR SOLUTION — Q24
type MyExtract<T, U> = // ...
type MyExclude<T, U> = // ...

type MouseEvents = MyExtract<AllEvents, "click" | "scroll">;
type NonMouseEvents = MyExclude<AllEvents, MouseEvents>;


/**
 * Q25 — `NonNullable`
 *
 * Problem:
 *   1. Implement `MyNonNullable<T>` from scratch.
 *   2. Write a generic function `compact<T>(arr: (T | null | undefined)[]): T[]`
 *      whose return type is `T[]` (non-nullable), using `NonNullable` internally.
 *   3. Create `DeepNonNullable<T>` that recursively removes null/undefined
 *      from all nested properties.
 */

// YOUR SOLUTION — Q25
type MyNonNullable<T> = // ...

function compact<T>(arr: (T | null | undefined)[]): T[] {
  // ...
}

type DeepNonNullable<T> = // ...


/**
 * Q26 — `ReturnType` & `Parameters`
 *
 * Problem:
 *   Given an external function `fetchUser(id: number, options: { cache: boolean }): Promise<{ name: string }>`:
 *   1. Extract `FetchUserParams` using `Parameters`.
 *   2. Extract `FetchUserReturn` using `ReturnType` and then unwrap the
 *      Promise to get `FetchUserData` (the resolved type).
 *   3. Implement `MyReturnType<T>` and `MyParameters<T>` from scratch
 *      using `infer`.
 */

declare function fetchUser(
  id: number,
  options: { cache: boolean }
): Promise<{ name: string }>;

// YOUR SOLUTION — Q26
type FetchUserParams = // ...
type FetchUserReturn = // ...
type FetchUserData = // ...  (unwrapped Promise value)

type MyReturnType<T extends (...args: any[]) => any> = // ...
type MyParameters<T extends (...args: any[]) => any> = // ...


/**
 * Q27 — `ConstructorParameters` & `InstanceType`
 *
 * Problem:
 *   Given class `Logger`:
 *   1. Derive `LoggerArgs` using `ConstructorParameters`.
 *   2. Derive `LoggerInstance` using `InstanceType`.
 *   3. Write a generic factory `createInstance<T extends new (...args: any[]) => any>(
 *        ctor: T, ...args: ConstructorParameters<T>): InstanceType<T>`.
 */

class Logger {
  constructor(
    private readonly prefix: string,
    private readonly level: "info" | "warn" | "error"
  ) {}
  log(msg: string): void {
    console.log(`[${this.level}] ${this.prefix}: ${msg}`);
  }
}

// YOUR SOLUTION — Q27
type LoggerArgs = // ...
type LoggerInstance = // ...

function createInstance<T extends new (...args: any[]) => any>(
  ctor: T,
  ...args: ConstructorParameters<T>
): InstanceType<T> {
  // ...
}


/**
 * Q28 — `Awaited`
 *
 * Problem:
 *   1. Show how `Awaited` unwraps nested Promises:
 *      `Awaited<Promise<Promise<string>>>` → `string`
 *   2. Implement `MyAwaited<T>` recursively using `infer`.
 *   3. Write `awaitAll<T extends Promise<any>[]>(promises: [...T]): Promise<{ [K in keyof T]: Awaited<T[K]> }>`
 *      (typed wrapper around Promise.all).
 */

// YOUR SOLUTION — Q28
type MyAwaited<T> = // ...

// Test:
type A1 = MyAwaited<Promise<Promise<number>>>;  // number
type A2 = MyAwaited<string>;                    // string (non-promise passthrough)

declare function awaitAll<T extends Promise<any>[]>(
  promises: [...T]
): Promise<{ [K in keyof T]: Awaited<T[K]> }>;


/**
 * Q29 — `Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize`
 *
 * Problem:
 *   Using intrinsic string utility types:
 *   1. Create `ScreamingSnake<S extends string>` that converts
 *      a camelCase string type to SCREAMING_SNAKE_CASE at type level.
 *      (Hint: this is hard to do perfectly — do your best with
 *       template literals; handle at least single-word input.)
 *   2. Create `CamelToKebab<S extends string>` for kebab-case.
 *   3. Create `GetterName<K extends string>` that produces `get${Capitalize<K>}`.
 */

// YOUR SOLUTION — Q29
type GetterName<K extends string> = // ...

// Test:
type G1 = GetterName<"name">;  // "getName"
type G2 = GetterName<"id">;    // "getId"

// Bonus:
type CamelToKebab<S extends string> = // ...


/**
 * Q30 — Composing Multiple Utility Types
 *
 * Problem:
 *   Given:
 *     type ApiUser = { id: number; email: string; passwordHash: string;
 *                      createdAt: Date; updatedAt: Date; role: "admin"|"user" }
 *
 *   Derive the following in one line each (no interface declarations):
 *   1. `PublicUser`    — omit passwordHash, omit createdAt, omit updatedAt
 *   2. `AdminOnlyUser` — Pick only id, email, role where role is "admin" (narrow it)
 *   3. `PatchUser`     — Partial of Omit<ApiUser, "id" | "createdAt" | "updatedAt">
 *   4. `FrozenPublicUser` — Readonly<PublicUser>
 */

type ApiUser = {
  id: number;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  role: "admin" | "user";
};

// YOUR SOLUTION — Q30
type PublicUser = // ...
type AdminOnlyUser = // ...
type PatchUser = // ...
type FrozenPublicUser = // ...


// ─────────────────────────────────────────────────────────────
//  SECTION 4 — MAPPED TYPES  (Q31 – Q37)
// ─────────────────────────────────────────────────────────────

/**
 * Q31 — Custom Mapped Type from Scratch
 *
 * Problem:
 *   Implement `Mutable<T>` — the inverse of `Readonly<T>`:
 *   removes the `readonly` modifier from all properties.
 *   Then implement `Optional<T>` — adds `?` to all properties
 *   (same as Partial but written manually).
 *   Show how to add/remove modifiers with `+` and `-` syntax.
 */

// YOUR SOLUTION — Q31
type Mutable<T> = // ...
type Optional<T> = // ...


/**
 * Q32 — Mapped Types with Value Transformation
 *
 * Problem:
 *   Given `FormFields = { username: string; age: number; active: boolean }`:
 *   1. `Stringify<T>` — maps every value type to `string`.
 *   2. `Nullable<T>`  — wraps every value in `T[K] | null`.
 *   3. `Promisify<T>` — wraps every value in `Promise<T[K]>`.
 *   4. `Getters<T>`   — maps `{ foo: T }` to `{ getFoo: () => T }` for each key.
 */

type FormFields = { username: string; age: number; active: boolean };

// YOUR SOLUTION — Q32
type Stringify<T> = // ...
type Nullable<T> = // ...
type Promisify<T> = // ...
type Getters<T> = // ... (getFoo pattern using template literal + Capitalize)


/**
 * Q33 — Filtering Properties by Value Type
 *
 * Problem:
 *   Implement `PickByValue<T, V>` that picks only those keys from `T`
 *   whose value type is assignable to `V`.
 *   Implement `OmitByValue<T, V>` — the inverse.
 *
 *   Test:
 *     type Nums = PickByValue<{ a: string; b: number; c: number }, number>
 *     // { b: number; c: number }
 */

// YOUR SOLUTION — Q33
type PickByValue<T, V> = // ...
type OmitByValue<T, V> = // ...


/**
 * Q34 — Key Remapping with `as` in Mapped Types
 *
 * Problem:
 *   Using the `as` clause in mapped types (TS 4.1+):
 *   1. Create `Prefixed<T, P extends string>` that prefixes every key with P.
 *      e.g. `Prefixed<{ name: string }, "get">` → `{ getName: string }`
 *      (use Capitalize on the original key).
 *   2. Create `FilterKeys<T, K extends keyof T>` that removes keys of type K
 *      using `as` (remap to never to exclude).
 */

// YOUR SOLUTION — Q34
type Prefixed<T, P extends string> = // ...
type FilterKeys<T, K extends keyof T> = // ...

// Test:
type PrefixedUser = Prefixed<{ name: string; age: number }, "get">;
// { getName: string; getAge: number }


/**
 * Q35 — Recursive Mapped Types
 *
 * Problem:
 *   Implement `DeepReadonly<T>` that makes all nested object
 *   properties readonly recursively (handle arrays too).
 *   Implement `DeepPartial<T>` — the recursive Partial.
 */

// YOUR SOLUTION — Q35
type DeepReadonly<T> = // ...
type DeepPartial<T> = // ...

// Test:
type NestedObj = { user: { name: string; address: { city: string } } };
type ReadonlyNested = DeepReadonly<NestedObj>;
// ReadonlyNested["user"]["address"]["city"] should be readonly


/**
 * Q36 — Mapped Types for Validation Schemas
 *
 * Problem:
 *   Build a `ValidationSchema<T>` mapped type where each key of T
 *   maps to `{ required: boolean; validator: (val: T[K]) => boolean; errorMsg: string }`.
 *   The `validator` must be typed to accept exactly the value type of that key.
 */

// YOUR SOLUTION — Q36
type ValidationSchema<T> = // ...

// Test:
type UserSchema = ValidationSchema<{ name: string; age: number }>;
// {
//   name: { required: boolean; validator: (val: string) => boolean; errorMsg: string }
//   age:  { required: boolean; validator: (val: number) => boolean; errorMsg: string }
// }


/**
 * Q37 — Flattening Object Types
 *
 * Problem:
 *   Write `Flatten<T>` that merges a nested object one level deep.
 *   Given `{ a: { x: number; y: number }; b: string }`,
 *   produce `{ x: number; y: number; b: string }`.
 *   (Hint: use distributive mapped types + UnionToIntersection.)
 */

// YOUR SOLUTION — Q37
type UnionToIntersection<U> = // ...
type Flatten<T> = // ...

type FlatTest = Flatten<{ a: { x: number; y: number }; b: string }>;
// { x: number; y: number; b: string }


// ─────────────────────────────────────────────────────────────
//  SECTION 5 — CONDITIONAL TYPES & `infer`  (Q38 – Q45)
// ─────────────────────────────────────────────────────────────

/**
 * Q38 — Distributive Conditional Types
 *
 * Problem:
 *   Explain (in code) why `type ToArray<T> = T extends any ? T[] : never`
 *   distributes over unions but `type ToArray2<T> = [T] extends [any] ? T[] : never`
 *   does NOT.
 *   Write both types and show the difference by declaring test aliases.
 */

// YOUR SOLUTION — Q38
type ToArray<T> = // ...  (distributive)
type ToArrayNonDist<T> = // ...  (non-distributive)

type D1 = ToArray<string | number>;        // string[] | number[]
type D2 = ToArrayNonDist<string | number>; // (string | number)[]


/**
 * Q39 — Inferring with `infer` — Function Signatures
 *
 * Problem:
 *   1. `FirstParam<T>` — infer the type of the first parameter.
 *   2. `LastParam<T>`  — infer the type of the last parameter
 *      (hint: use variadic tuple `infer`).
 *   3. `UnwrapPromise<T>` — unwrap one level of Promise.
 *   4. `UnpackArray<T>` — if T is an array, return element type; else T.
 */

// YOUR SOLUTION — Q39
type FirstParam<T extends (...args: any[]) => any> = // ...
type LastParam<T extends (...args: any[]) => any> = // ...
type UnwrapPromise<T> = // ...
type UnpackArray<T> = // ...

// Tests:
type FP = FirstParam<(a: string, b: number) => void>; // string
type LP = LastParam<(a: string, b: number) => void>;  // number
type UP = UnwrapPromise<Promise<string>>;              // string
type UA = UnpackArray<number[]>;                       // number


/**
 * Q40 — Recursive Conditional Types
 *
 * Problem:
 *   1. `Depth<T, D extends number = 0>` — compute nesting depth of an
 *      object type (return as a number literal type, up to depth 4).
 *   2. `FlattenArray<T>` — recursively unwrap nested arrays.
 *      `FlattenArray<number[][][]>` → `number`.
 */

// YOUR SOLUTION — Q40
type FlattenArray<T> = T extends (infer U)[] ? FlattenArray<U> : T;

// Test:
type FA = FlattenArray<number[][][]>; // number


/**
 * Q41 — `infer` in Constructor Types
 *
 * Problem:
 *   Write `ConstructedType<T>` that infers the instance type from a
 *   class constructor type (similar to InstanceType but built manually).
 *   Write `ConstructorArgs<T>` that infers the constructor parameter types.
 */

// YOUR SOLUTION — Q41
type ConstructedType<T> = T extends new (...args: any[]) => infer R ? R : never;
type ConstructorArgs<T> = // ...


/**
 * Q42 — Conditional Types for API Safety
 *
 * Problem:
 *   Design a type `SafeGet<T, K>` such that:
 *   - If K is a key of T, return `T[K]`
 *   - Otherwise return `never`
 *   Then design `DeepGet<T, Path extends string>` that navigates dot-notation
 *   paths: `DeepGet<{ a: { b: { c: number } } }, "a.b.c">` → `number`.
 */

// YOUR SOLUTION — Q42
type SafeGet<T, K> = // ...

type DeepGet<T, Path extends string> =
  Path extends `${infer Key}.${infer Rest}`
    ? Key extends keyof T
      ? // ...
      : never
    : // ...

// Test:
type DG = DeepGet<{ a: { b: { c: number } } }, "a.b.c">; // number


/**
 * Q43 — Template Literal + Conditional: Event Map
 *
 * Problem:
 *   Given `type HttpVerb = "get" | "post" | "put" | "delete"` and
 *   `type Resource = "user" | "post" | "comment"`:
 *   Derive `ApiRoute` as all combinations like `"getUser" | "postUser" | ...`.
 *   Then derive `ApiRouteHandler` as a Record<ApiRoute, () => void>.
 */

type HttpVerb = "get" | "post" | "put" | "delete";
type Resource = "user" | "post" | "comment";

// YOUR SOLUTION — Q43
type ApiRoute = // ...
type ApiRouteHandler = // ...


/**
 * Q44 — Conditional Overloading via Generics
 *
 * Problem:
 *   Write `parseInput<T extends string | number>(input: T):
 *     T extends string ? number : string`
 *   so that passing a string returns a number type and vice versa.
 *   Show the call sites where TypeScript narrows the return type.
 */

// YOUR SOLUTION — Q44
function parseInput<T extends string | number>(
  input: T
): T extends string ? number : string {
  // ...
}

// Test (types must be inferred correctly):
const r1 = parseInput("hello"); // type: number
const r2 = parseInput(42);      // type: string


/**
 * Q45 — `infer` with Template Literals
 *
 * Problem:
 *   1. `TrimLeft<S>` — remove leading whitespace from a string literal type.
 *   2. `Split<S, D extends string>` — split a string literal type by delimiter
 *      into a tuple. e.g. `Split<"a.b.c", ".">` → `["a", "b", "c"]`.
 *   3. `Join<T extends string[], D extends string>` — inverse of Split.
 */

// YOUR SOLUTION — Q45
type TrimLeft<S extends string> =
  S extends ` ${infer R}` ? TrimLeft<R> : S;

type Split<S extends string, D extends string> = // ...

type Join<T extends string[], D extends string> = // ...

// Tests:
type SP = Split<"a.b.c", ".">;   // ["a", "b", "c"]
type JN = Join<["x", "y", "z"], "-">; // "x-y-z"


// ─────────────────────────────────────────────────────────────
//  SECTION 6 — ADVANCED PATTERNS  (Q46 – Q50)
// ─────────────────────────────────────────────────────────────

/**
 * Q46 — Declaration Merging & Module Augmentation
 *
 * Problem:
 *   1. Demonstrate interface merging: define `Window` with a custom
 *      property `analytics: { track(event: string): void }` using
 *      module augmentation (declare global / interface merging).
 *   2. Augment the `Array<T>` interface to add a `first()` method
 *      that returns `T | undefined`.
 *   (Declare only — no implementation needed for the built-in augmentation.)
 */

// YOUR SOLUTION — Q46
declare global {
  interface Window {
    // ...
  }

  interface Array<T> {
    // ...
  }
}

export {}; // keep file a module


/**
 * Q47 — Branded / Opaque Types
 *
 * Problem:
 *   TypeScript's structural typing means `type UserId = number` and
 *   `type ProductId = number` are interchangeable — a bug!
 *   Use a "brand" pattern to make them nominally distinct:
 *   1. Define `Brand<T, B>` utility type.
 *   2. Create `UserId`, `ProductId`, `OrderId` branded types.
 *   3. Write constructors `toUserId(n: number): UserId` etc.
 *   4. Show a compile error when mixing branded types.
 */

// YOUR SOLUTION — Q47
type Brand<T, B extends string> = // ...

type UserId = // ...
type ProductId = // ...

function toUserId(n: number): UserId {
  return n as UserId;
}

// This should be a compile error:
// const uid: UserId = toProductId(1); // ❌


/**
 * Q48 — Builder Pattern with Fluent Typing
 *
 * Problem:
 *   Implement a type-safe query builder for a simple SQL-like API:
 *   `QueryBuilder` that tracks (at type level) whether `.from()`,
 *   `.where()` and `.select()` have been called.
 *   Only allow `.build()` when both `.from()` and `.select()` have
 *   been called — enforced at compile time using generic state flags.
 */

// YOUR SOLUTION — Q48
type QueryState = {
  hasFrom: boolean;
  hasSelect: boolean;
};

class QueryBuilder<State extends QueryState = { hasFrom: false; hasSelect: false }> {
  from(table: string): QueryBuilder<State & { hasFrom: true }> {
    // ...
    return this as any;
  }

  select(...cols: string[]): QueryBuilder<State & { hasSelect: true }> {
    // ...
    return this as any;
  }

  // Only available when both hasFrom and hasSelect are true:
  build(
    this: QueryBuilder<{ hasFrom: true; hasSelect: true }>
  ): string {
    // ...
    return "";
  }
}


/**
 * Q49 — Mapped Types + Conditional: Form Validation Engine
 *
 * Problem:
 *   Build a compile-time-safe form type where:
 *   - `FormConfig<T>` takes a model type T and produces a schema type.
 *   - Each field has `{ defaultValue: T[K]; rules: Array<(v: T[K]) => string | null> }`.
 *   - `FormErrors<T>` maps each key to `string | null`.
 *   - `FormTouched<T>` maps each key to `boolean`.
 *   Write a type `FormState<T>` combining values, errors, and touched.
 */

// YOUR SOLUTION — Q49
type FormConfig<T> = {
  [K in keyof T]: {
    defaultValue: T[K];
    rules: Array<(value: T[K]) => string | null>;
  };
};

type FormErrors<T> = // ...
type FormTouched<T> = // ...
type FormState<T> = // ...


/**
 * Q50 — The Full Challenge: Build `StrictOmit` + `DeepMerge` + `OverrideProps`
 *
 * Problem:
 *   Implement each of the following without using built-in utilities
 *   except where explicitly noted:
 *
 *   1. `StrictOmit<T, K extends keyof T>` — same as Omit but K is
 *      constrained to actual keys of T (built-in Omit accepts any string).
 *
 *   2. `DeepMerge<T, U>` — recursively merges two object types.
 *      Properties in U override properties in T.
 *      If both T[K] and U[K] are objects, recurse.
 *
 *   3. `OverrideProps<T, U extends Partial<Record<keyof T, any>>>` —
 *      returns T but with the types of overlapping keys replaced by U's types.
 *
 *   Write test type aliases demonstrating each.
 */

// YOUR SOLUTION — Q50
type StrictOmit<T, K extends keyof T> = // ...

type DeepMerge<T, U> = {
  [K in keyof T | keyof U]:
    K extends keyof U
      ? K extends keyof T
        ? T[K] extends object
          ? U[K] extends object
            ? DeepMerge<T[K], U[K]>
            : U[K]
          : U[K]
        : U[K]
      : K extends keyof T
        ? T[K]
        : never;
};

type OverrideProps<T, U extends Partial<Record<keyof T, any>>> = // ...

// Tests:
type Base   = { name: string; age: number; meta: { active: boolean; score: number } };
type Patch  = { age: string;  meta: { score: string } };

type Merged  = DeepMerge<Base, Patch>;
// { name: string; age: string; meta: { active: boolean; score: string } }

type Overridden = OverrideProps<{ id: number; label: string }, { id: string }>;
// { id: string; label: string }