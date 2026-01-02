Introduction to TypeScript
TypeScript is a statically typed superset of JavaScript that compiles to plain JavaScript. It adds optional type annotations, interfaces, and other features to help catch errors during development.
Why TypeScript?

Early error detection - Catch bugs at compile time
Better IDE support - Autocomplete, refactoring, navigation
Code documentation - Types serve as inline documentation
Scalability - Easier to maintain large codebases
Refactoring confidence - Safe code changes


TypeScript Configuration
Basic tsconfig.json
json{
  "compilerOptions": {
    "target": "ES2020",                    // JavaScript version to compile to
    "module": "commonjs",                  // Module system (commonjs, es6, esnext)
    "lib": ["ES2020", "DOM"],             // Library files to include
    "outDir": "./dist",                    // Output directory
    "rootDir": "./src",                    // Input directory
    "strict": true,                        // Enable all strict type checking
    "esModuleInterop": true,              // Enable ES module interop
    "skipLibCheck": true,                  // Skip type checking of declaration files
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,            // Allow importing JSON files
    "declaration": true,                   // Generate .d.ts files
    "sourceMap": true,                     // Generate source maps for debugging
    "noImplicitAny": true,                // Error on expressions with implied 'any'
    "strictNullChecks": true,             // Strict null checking
    "strictFunctionTypes": true,          // Strict function type checking
    "noUnusedLocals": true,               // Error on unused local variables
    "noUnusedParameters": true,           // Error on unused parameters
    "noImplicitReturns": true,            // Error when not all code paths return
    "allowJs": true,                       // Allow JavaScript files
    "checkJs": false,                      // Type-check JavaScript files
    "moduleResolution": "node"            // Module resolution strategy
  },
  "include": ["src/**/*"],                // Files to include
  "exclude": ["node_modules", "dist"]     // Files to exclude
}
Advanced Configuration for React/Next.js
json{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "jsx": "react-jsx",                    // JSX support
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],                  // Path aliases
      "@components/*": ["./src/components/*"]
    }
  }
}

Basic Data Types
1. Primitive Types
typescript// String
let name: string = "John";
let message: string = `Hello ${name}`;

// Number
let age: number = 30;
let price: number = 99.99;
let hex: number = 0xf00d;
let binary: number = 0b1010;

// Boolean
let isActive: boolean = true;
let hasPermission: boolean = false;

// Null and Undefined
let nothing: null = null;
let notDefined: undefined = undefined;

// Symbol
let sym: symbol = Symbol("unique");

// BigInt
let big: bigint = 100n;
2. Any and Unknown
typescript// Any - disables type checking (avoid when possible)
let anything: any = "string";
anything = 123;
anything = true;

// Unknown - type-safe version of any
let unknown: unknown = "test";
// unknown.toUpperCase(); // Error: must type-check first

if (typeof unknown === "string") {
  console.log(unknown.toUpperCase()); // OK
}
3. Arrays
typescript// Array syntax
let numbers: number[] = [1, 2, 3, 4, 5];
let strings: Array<string> = ["a", "b", "c"];

// Multi-dimensional arrays
let matrix: number[][] = [[1, 2], [3, 4]];

// Mixed arrays (use union types)
let mixed: (string | number)[] = [1, "two", 3];
4. Tuples
typescript// Fixed-length array with known types
let person: [string, number] = ["John", 30];
let coordinate: [number, number, number?] = [10, 20]; // Optional element

// Named tuples (TypeScript 4.0+)
let user: [name: string, age: number] = ["Alice", 25];

// Rest elements in tuples
let tuple: [string, ...number[]] = ["test", 1, 2, 3];
5. Enums
typescript// Numeric enum
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right  // 3
}
let dir: Direction = Direction.Up;

// String enum
enum Status {
  Success = "SUCCESS",
  Error = "ERROR",
  Pending = "PENDING"
}

// Const enum (no runtime overhead)
const enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE"
}
let color: Color = Color.Red;

// Heterogeneous enum (mixed)
enum Mixed {
  No = 0,
  Yes = "YES"
}
6. Object Types
typescript// Object type
let user: { name: string; age: number } = {
  name: "John",
  age: 30
};

// Optional properties
let config: { 
  host: string; 
  port?: number;  // Optional
  timeout?: number;
} = {
  host: "localhost"
};

// Readonly properties
let point: { readonly x: number; readonly y: number } = {
  x: 10,
  y: 20
};
// point.x = 30; // Error: cannot assign to readonly property

// Index signatures
let dictionary: { [key: string]: string } = {
  name: "John",
  city: "NYC"
};
7. Void, Never, and Null/Undefined
typescript// Void - function returns nothing
function logMessage(msg: string): void {
  console.log(msg);
}

// Never - function never returns (throws or infinite loop)
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {}
}

// Null and Undefined as types
let n: null = null;
let u: undefined = undefined;

// Union with null/undefined
let optional: string | null = null;

Advanced Types
1. Union Types
typescript// Multiple possible types
let id: string | number;
id = "abc123";
id = 123;

// Union with literal types
let status: "success" | "error" | "pending" = "success";

// Function with union parameter
function formatValue(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return value.toFixed(2);
}
2. Intersection Types
typescript// Combine multiple types
type Person = {
  name: string;
  age: number;
};

type Employee = {
  employeeId: string;
  department: string;
};

type Staff = Person & Employee;

const staff: Staff = {
  name: "John",
  age: 30,
  employeeId: "E123",
  department: "IT"
};
3. Literal Types
typescript// String literal
let direction: "north" | "south" | "east" | "west" = "north";

// Numeric literal
let diceRoll: 1 | 2 | 3 | 4 | 5 | 6 = 3;

// Boolean literal
let isTrue: true = true;

// Combined literal types
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type StatusCode = 200 | 404 | 500;
4. Type Aliases
typescript// Simple alias
type ID = string | number;

// Object alias
type User = {
  id: ID;
  name: string;
  email: string;
  isActive: boolean;
};

// Function alias
type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (a, b) => a + b;
const subtract: MathOperation = (a, b) => a - b;
5. Type Assertions
typescript// as syntax (preferred)
let someValue: unknown = "this is a string";
let strLength: number = (someValue as string).length;

// Angle-bracket syntax (not in JSX)
let length: number = (<string>someValue).length;

// const assertions
let obj = { name: "John" } as const;
// obj.name = "Jane"; // Error: readonly property

let arr = [1, 2, 3] as const; // readonly [1, 2, 3]
6. Type Guards
typescript// typeof guard
function printValue(val: string | number) {
  if (typeof val === "string") {
    console.log(val.toUpperCase());
  } else {
    console.log(val.toFixed(2));
  }
}

// instanceof guard
class Dog {
  bark() { console.log("Woof!"); }
}
class Cat {
  meow() { console.log("Meow!"); }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.meow();
  }
}

// Custom type guard
interface Fish {
  swim: () => void;
}
interface Bird {
  fly: () => void;
}

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim();
  } else {
    pet.fly();
  }
}
7. Discriminated Unions (Tagged Unions)
typescriptinterface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}

type Shape = Circle | Square | Rectangle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    case "rectangle":
      return shape.width * shape.height;
  }
}

Interfaces vs Types
Interfaces
typescript// Basic interface
interface User {
  id: number;
  name: string;
  email: string;
}

// Optional properties
interface Config {
  host: string;
  port?: number;
}

// Readonly properties
interface Point {
  readonly x: number;
  readonly y: number;
}

// Method signatures
interface Calculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
}

// Interface extension
interface Animal {
  name: string;
  age: number;
}

interface Dog extends Animal {
  breed: string;
  bark(): void;
}

// Multiple inheritance
interface Flyable {
  fly(): void;
}

interface Swimmable {
  swim(): void;
}

interface Duck extends Flyable, Swimmable {
  quack(): void;
}

// Declaration merging (only interfaces)
interface Window {
  customProperty: string;
}

interface Window {
  anotherProperty: number;
}
// Window now has both properties
Types vs Interfaces
typescript// Types can use unions (interfaces cannot)
type StringOrNumber = string | number;
type Direction = "north" | "south" | "east" | "west";

// Types can use primitives (interfaces cannot)
type ID = string;

// Both can describe objects
interface IUser {
  name: string;
}

type TUser = {
  name: string;
};

// Types can use utility types
type ReadonlyUser = Readonly<TUser>;

// Types can create mapped types
type Flags = {
  [K in "option1" | "option2" | "option3"]: boolean;
};

// Recommendation:
// - Use interfaces for object shapes and classes
// - Use types for unions, intersections, and utility types

Generics
Basic Generics
typescript// Generic function
function identity<T>(arg: T): T {
  return arg;
}

let output1 = identity<string>("hello");
let output2 = identity<number>(42);
let output3 = identity("auto-inferred"); // Type inference

// Generic array function
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const first = firstElement([1, 2, 3]); // number | undefined
const firstStr = firstElement(["a", "b"]); // string | undefined
Generic Interfaces
typescriptinterface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface User {
  id: number;
  name: string;
}

const response: ApiResponse<User> = {
  data: { id: 1, name: "John" },
  status: 200,
  message: "Success"
};

const listResponse: ApiResponse<User[]> = {
  data: [{ id: 1, name: "John" }, { id: 2, name: "Jane" }],
  status: 200,
  message: "Success"
};
Generic Classes
typescriptclass DataStore<T> {
  private data: T[] = [];

  add(item: T): void {
    this.data.push(item);
  }

  get(index: number): T | undefined {
    return this.data[index];
  }

  getAll(): T[] {
    return this.data;
  }
}

const numberStore = new DataStore<number>();
numberStore.add(1);
numberStore.add(2);

const userStore = new DataStore<User>();
userStore.add({ id: 1, name: "John" });
Generic Constraints
typescript// Constraint: T must have length property
interface Lengthy {
  length: number;
}

function logLength<T extends Lengthy>(arg: T): void {
  console.log(arg.length);
}

logLength("hello"); // OK
logLength([1, 2, 3]); // OK
logLength({ length: 10 }); // OK
// logLength(123); // Error: number doesn't have length

// Using keyof constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "John", age: 30 };
const name = getProperty(person, "name"); // string
const age = getProperty(person, "age"); // number
// getProperty(person, "invalid"); // Error
Default Generic Types
typescriptinterface Response<T = any> {
  data: T;
  error?: string;
}

const response1: Response = { data: "anything" }; // T is any
const response2: Response<User> = { data: { id: 1, name: "John" } };

Utility Types
1. Partial<T>
typescript// Makes all properties optional
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; age?: number; }

function updateUser(id: number, updates: Partial<User>) {
  // Update only provided fields
}

updateUser(1, { name: "New Name" }); // Only update name
2. Required<T>
typescript// Makes all properties required
interface Config {
  host?: string;
  port?: number;
  timeout?: number;
}

type RequiredConfig = Required<Config>;
// { host: string; port: number; timeout: number; }
3. Readonly<T>
typescript// Makes all properties readonly
interface Mutable {
  x: number;
  y: number;
}

type Immutable = Readonly<Mutable>;
// { readonly x: number; readonly y: number; }

const point: Immutable = { x: 10, y: 20 };
// point.x = 30; // Error: cannot assign to readonly property
4. Pick<T, K>
typescript// Pick specific properties
interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

type TodoPreview = Pick<Todo, "title" | "completed">;
// { title: string; completed: boolean; }

const preview: TodoPreview = {
  title: "Learn TypeScript",
  completed: false
};
5. Omit<T, K>
typescript// Omit specific properties
type TodoWithoutDate = Omit<Todo, "createdAt">;
// { title: string; description: string; completed: boolean; }

type UserPublic = Omit<User, "password" | "email">;
6. Record<K, T>
typescript// Create object type with specific keys and value type
type PageInfo = {
  title: string;
  url: string;
};

type Pages = Record<"home" | "about" | "contact", PageInfo>;

const pages: Pages = {
  home: { title: "Home", url: "/" },
  about: { title: "About", url: "/about" },
  contact: { title: "Contact", url: "/contact" }
};

// Use with string index
type StringMap = Record<string, string>;
const translations: StringMap = {
  hello: "Hola",
  goodbye: "Adiós"
};
7. Exclude<T, U>
typescript// Exclude types from union
type All = "a" | "b" | "c" | "d";
type Subset = Exclude<All, "a" | "c">;
// "b" | "d"

type Primitive = string | number | boolean;
type NonString = Exclude<Primitive, string>;
// number | boolean
8. Extract<T, U>
typescript// Extract types from union
type T1 = Extract<"a" | "b" | "c", "a" | "f">;
// "a"

type T2 = Extract<string | number | (() => void), Function>;
// () => void
9. NonNullable<T>
typescript// Remove null and undefined
type T1 = NonNullable<string | number | null | undefined>;
// string | number

type T2 = NonNullable<string | null>;
// string
10. ReturnType<T>
typescript// Get return type of function
function getUser() {
  return { id: 1, name: "John" };
}

type UserReturnType = ReturnType<typeof getUser>;
// { id: number; name: string; }

type T1 = ReturnType<() => string>;
// string
11. Parameters<T>
typescript// Get parameter types as tuple
function createUser(name: string, age: number, isActive: boolean) {
  // ...
}

type CreateUserParams = Parameters<typeof createUser>;
// [name: string, age: number, isActive: boolean]

function wrapper(...args: CreateUserParams) {
  createUser(...args);
}
12. Awaited<T>
typescript// Unwrap Promise type
type A = Awaited<Promise<string>>;
// string

type B = Awaited<Promise<Promise<number>>>;
// number

async function getUser(): Promise<User> {
  // ...
}

type UserType = Awaited<ReturnType<typeof getUser>>;
// User

API Response Typing
Basic API Response
typescriptinterface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

// User API
interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// Usage
const result = await fetchUser(1);
if (result.success) {
  console.log(result.data.username); // Type-safe access
}
Paginated Response
typescriptinterface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
}

async function fetchPosts(
  page: number = 1
): Promise<PaginatedResponse<Post>> {
  const response = await fetch(`/api/posts?page=${page}`);
  return response.json();
}
Error Handling
typescriptinterface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

type ApiResult<T> = 
  | { success: true; data: T }
  | { success: false; error: ApiError };

async function fetchData<T>(url: string): Promise<ApiResult<T>> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const error: ApiError = await response.json();
      return { success: false, error };
    }
    
    const data: T = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: "Failed to fetch data"
      }
    };
  }
}

// Usage with type narrowing
const result = await fetchData<User>("/api/user/1");

if (result.success) {
  console.log(result.data.username); // Type-safe
} else {
  console.error(result.error.message); // Type-safe
}
REST API Client
typescriptinterface ApiConfig {
  baseUrl: string;
  headers?: Record<string, string>;
}

class ApiClient {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...this.config.headers,
      ...options?.headers
    };

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T, D = any>(endpoint: string, data: D): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data)
    });
  }

  async put<T, D = any>(endpoint: string, data: D): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Usage
const api = new ApiClient({ baseUrl: "https://api.example.com" });

interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}

const newUser = await api.post<User, CreateUserDto>("/users", {
  username: "john_doe",
  email: "john@example.com",
  password: "secret123"
});
GraphQL Typing
typescriptinterface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

interface UserQueryData {
  user: {
    id: string;
    name: string;
    email: string;
    posts: Array<{
      id: string;
      title: string;
    }>;
  };
}

async function queryGraphQL<T>(
  query: string,
  variables?: Record<string, any>
): Promise<GraphQLResponse<T>> {
  const response = await fetch("/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables })
  });
  
  return response.json();
}

// Usage
const result = await queryGraphQL<UserQueryData>(`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      posts {
        id
        title
      }
    }
  }
`, { id: "123" });

if (result.data) {
  console.log(result.data.user.name);
}

Event Handling
DOM Event Types
typescript// Mouse events
function handleClick(event: MouseEvent): void {
  console.log(event.clientX, event.clientY);
  console.log(event.button); // 0: left, 1: middle, 2: right
}

function handleMouseMove(event: MouseEvent): void {
  console.log(event.offsetX, event.offsetY);
}

// Keyboard events
function handleKeyPress(event: KeyboardEvent): void {
  console.log(event.key); // The actual key pressed
  console.log(event.code); // Physical key code
  console.log(event.ctrlKey, event.shiftKey, event.altKey);
  
  if (event.key === "Enter") {
    // Handle Enter key
  }
}

// Form events
function handleSubmit(event: Event): void {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
}

function handleInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  console.log(input.value);
}

// Focus events
function handleFocus(event: FocusEvent): void {
  const element = event.target as HTMLElement;
  element.style.border = "2px solid blue";
}
React Event Types
typescriptimport React from "react";

// Mouse events
function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
  console.log(event.currentTarget.value);
}

function handleDivClick(event: React.MouseEvent<HTMLDivElement>): void {
  console.log(event.clientX, event.clientY);
}

// Change events
function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
  console.log(event.target.value);
}

function handleSelectChange(
  event: React.ChangeEvent<HTMLSelectElement>
): void {
  console.log(event.target.value);
}

function handleTextareaChange(
  event: React.ChangeEvent<HTMLTextAreaElement>
): void {
  console.log(event.target.value);
}

// Form events
function handleFormSubmit(
  event: React.FormEvent<HTMLFormElement>
): void {
  event.preventDefault();
  // Process form
}

// Keyboard events
function handleKeyDown(
  event: React.KeyboardEvent<HTMLInputElement>
): void {
  if (event.key === "Enter") {
    // Handle Enter
  }
}

// Focus events
function handleBlur(event: React.FocusEvent<HTMLInputElement>): void {
  console.log("Input lost focus");
}

// Complete component example
interface FormProps {
  onSubmit: (data: { username: string; email: string }) => void;
}

const MyForm: React.FC<FormProps> = ({ onSubmit }) => {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ username, email });
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={handleUsernameChange}
      />
      <button type="submit">Submit</button>
    </form>
  );
};
Window Events
typescript// Window resize
window.addEventListener("resize", (event: UIEvent) => {
  console.log(window.innerWidth, window.innerHeight);
});

// Window scroll
window.addEventListener("scroll", (event: Event) => {
  console.log(window.scrollY);
});

// Window load
window.addEventListener("load", (event: Event) => {
  console.log("Page fully loaded");
});

// Before unload
window.addEventListener("beforeunload", (event: BeforeUnloadEvent) => {
  event.preventDefault();
  event.returnValue = ""; // Show confirmation dialog
});

// Custom events
interface CustomEventDetail {
  userId: number;
  action: string;
}

const customEvent = new CustomEvent<CustomEventDetail>("userAction", {
  detail: { userId: 123, action: "login" }
});

window.addEventListener("userAction", (event: Event) => {
  const customEvent = event as CustomEvent<CustomEventDetail>;
  console.log(customEvent.detail.userId);
});

window.dispatchEvent(customEvent);
Event Delegation with Types
typescriptfunction setupDelegation(container: HTMLElement): void {
  container.addEventListener("click", (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    
    // Type guard for button elements
    if (target.matches("button")) {
      const button = target as HTMLButtonElement;
      console.log("Button clicked:", button.textContent);
    }
    
    // Type guard for links
    if (target.matches("a")) {
      event.preventDefault();
      const link = target as HTMLAnchorElement;
      console.log("Link clicked:", link.href);
    }
  });
}

Common Interview Questions
1. What is TypeScript and why use it?
Answer: TypeScript is a statically typed superset of JavaScript that compiles to plain JavaScript. Benefits include:

Early error detection at compile time
Better IDE support with autocomplete and refactoring
Self-documenting code through types
Easier maintenance of large codebases
Safer refactoring

2. Difference between interface and type?
Answer:
typescript// Interfaces:
// - Can be extended and merged
// - Better for object shapes
// - Can be implemented by classes

interface User {
  name: string;
}
interface User {
  age: number;
} // Declaration merging works

// Types:
// - Cannot be reopened/merged
// - Can represent unions, intersections, primitives
// - More flexible for complex types

type ID = string | number; // Union
type Result = Success & Metadata; // Intersection
3. What is never type?
Answer: never represents values that never occur. Used for:
typescript// Functions that never return
function throwError(msg: string): never {
  throw new Error(msg);
}

// Exhaustive checks
type Shape = Circle | Square;
function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "square": return shape.size ** 2;
    default:
      const _exhaustive: never = shape; // Compile error if not exhaustive
      return _exhaustive;
  }
}
4. What are Generics?
Answer: Generics allow creating reusable components that work with multiple types:
typescript// Without generics - need separate functions
function numberIdentity(arg: number): number {
  return arg;
}

// With generics - one function for all types
function identity<T>(arg: T): T {
  return arg;
}

const num = identity<number>(42);
const str = identity("hello"); // Type inference
5. Explain keyof operator
Answer: keyof creates a union of an object's keys:
typescriptinterface User {
  id: number;
  name: string;
  email: string;
}

type UserKeys = keyof User; // "id" | "name" | "email"

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = { id: 1, name: "John", email: "john@example.com" };
const name = getProperty(user, "name"); // Type-safe
6. What is unknown vs any?
Answer:
typescript// any - disables type checking (unsafe)
let anything: any = "hello";
anything.foo(); // No error, but runtime crash

// unknown - requires type checking (safe)
let something: unknown = "hello";
// something.toUpperCase(); // Error
if (typeof something === "string") {
  something.toUpperCase(); // OK
}
7. Explain Utility Types
Utility types are built-in TypeScript helpers that transform existing types into new ones.

They help you:

Avoid rewriting types

Derive new types from existing ones

Keep types in sync with real code
Answer:
typescriptinterface User {
  id: number;
  name: string;
  email: string;
}

// Partial - all properties optional
type PartialUser = Partial<User>;

// Pick - select specific properties
type UserPreview = Pick<User, "id" | "name">;

// Omit - exclude specific properties
type UserWithoutEmail = Omit<User, "email">;

// Readonly - make all readonly
type ImmutableUser = Readonly<User>;

// Record - create object type
type UserMap = Record<string, User>;
map like object
type Role = "admin" | "user" | "guest";
type User = "id" || "name" || "email"


8. What are Mapped Types?
Answer:
typescript// Transform each property
Mapped types lets you create new types by iterating over the keys of another type
Answer:
type User {
  id: number;
  name: string;
  email: string;
}

instead of manually makin each field radonly we can iterate and make all fields readonly

type ReadOnlyUser = {
  readonly [k in key of User]: User[k]
}

also, 
type ReadOnly<T> = {
  readonly [k in key of T]: T[K]
}
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Optional<T> = {
  [P in keyof T]?: T[P];
};

// Custom mapped type
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

interface User {
  name: string;
  age: number;
}

type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number; }
9. What is Type Narrowing?
Answer: Narrowing is refining types within conditional blocks:
typescriptfunction process(value: string | number) {
  if (typeof value === "string") {
    // Type narrowed to string
    console.log(value.toUpperCase());
  } else {
    // Type narrowed to number
    console.log(value.toFixed(2));
  }
}

// Discriminated unions
type Success = { status: "success"; data: string };
type Error = { status: "error"; message: string };
type Result = Success | Error;

function handle(result: Result) {
  if (result.status === "success") {
    console.log(result.data); // Type narrowed
  } else {
    console.log(result.message); // Type narrowed
  }
}
10. Explain readonly vs const
Answer:
typescript// const - variable cannot be reassigned
const x = 10;
// x = 20; // Error

// readonly - property cannot be modified
interface Point {
  readonly x: number;
  readonly y: number;
}

const point: Point = { x: 10, y: 20 };
// point.x = 30; // Error

// readonly for arrays
const arr: readonly number[] = [1, 2, 3];
// arr.push(4); // Error
// arr[0] = 10; // Error
11. What is Type Inference?
Answer: TypeScript automatically determines types:
typescript// Variable inference
let x = 10; // inferred as number
let name = "John"; // inferred as string

// Function return type inference
function add(a: number, b: number) {
  return a + b; // inferred as number
}

// Context type inference
window.addEventListener("click", (event) => {
  // event inferred as MouseEvent
  console.log(event.clientX);
});

// Best common type
let arr = [1, 2, null]; // inferred as (number | null)[]
12. Explain as const
Answer:
typescript// Without as const
const obj = { name: "John", age: 30 };
// Type: { name: string; age: number }
obj.name = "Jane"; // Allowed

// With as const
const obj2 = { name: "John", age: 30 } as const;
// Type: { readonly name: "John"; readonly age: 30 }
// obj2.name = "Jane"; // Error

// Array example
const arr = [1, 2, 3] as const;
// Type: readonly [1, 2, 3]

// Use case: enum-like objects
const COLORS = {
  RED: "#FF0000",
  GREEN: "#00FF00",
  BLUE: "#0000FF"
} as const;

type Color = typeof COLORS[keyof typeof COLORS];
// "#FF0000" | "#00FF00" | "#0000FF"
13. What are Conditional Types?
Answer:
typescript// Basic conditional type
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false

// Practical example
type NonNullable<T> = T extends null | undefined ? never : T;

type C = NonNullable<string | null>; // string

// Infer keyword
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { id: 1, name: "John" };
}

type UserType = ReturnType<typeof getUser>;
// { id: number; name: string }
14. How to type async functions?
Answer:
typescript// Basic async function
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const user: User = await response.json();
  return user;
}

// Generic async function
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json();
}

const user = await fetchData<User>("/api/user/1");

// Error handling
async function safeData<T>(
  url: string
): Promise<{ data: T } | { error: string }> {
  try {
    const data = await fetchData<T>(url);
    return { data };
  } catch {
    return { error: "Failed to fetch" };
  }
}
15. What is the satisfies operator? (TypeScript 4.9+)
Answer:
typescript// Without satisfies - loses specific type info
const config = {
  endpoint: "/api",
  timeout: 3000
};
// Type: { endpoint: string; timeout: number }

// With satisfies - keeps literal types
type Config = {
  endpoint: string;
  timeout: number;
};

const config2 = {
  endpoint: "/api",
  timeout: 3000
} satisfies Config;
// Type: { endpoint: "/api"; timeout: 3000 }

// Catches errors but preserves specific types
const colors = {
  red: [255, 0, 0],
  green: "#00FF00",
  blue: [0, 0, 255]
} satisfies Record<string, string | number[]>;

colors.red; // [255, 0, 0] - not widened to (string | number[])

Best Practices

Enable strict mode in tsconfig.json
Avoid any - use unknown when type is truly unknown
Use type inference - don't over-annotate
Prefer interfaces for objects that might be extended
Use utility types instead of manually creating similar types
Create discriminated unions for better type narrowing
Use const assertions for literal types
Type your API responses for safer data handling
Use generics for reusable components
Leverage IDE features for refactoring and navigation


Summary
TypeScript provides powerful type safety for JavaScript applications. Key concepts include:

Basic types: primitives, arrays, tuples, enums, objects
Advanced types: unions, intersections, literals, type guards
Generics: reusable type-safe components
Utility types: transform existing types efficiently
Type narrowing: refine types in conditional blocks
Proper configuration: tsconfig.json for project needs
API typing: ensure type-safe data fetching
Event handling: type-safe DOM and framework events

Master these concepts through practice, and you'll write more maintainable, bug-free code!

Infer -> infer lets TypeScript capture a type from another type.
Built-in types using infer:
ReturnType<T>
Parameters<T>
Awaited<T>
ConstructorParameters<T>

function getUser() {
  return {
    id: 1,
    name: "Balaji",
    role: "admin"
  };
}
Now somewhere else in the app, you want:

👉 The exact return type of getUser,
❌ without manually duplicating it.

type ExtractReturn<T> = T extend Promise<infer, U> ? U: T
..Custom hook for type checks applicable for function and other
type User = ExtractREeturn<typeof getUser>

function createSession() {
  return {
    token: "abc123",
    expiresAt: Date.now() + 3600_000
  };
}

type Session = ReturnType<typeof createSession>
async function fetchProfile() {
  return {
    id: 10,
    email: "user@mail.com"
  };
}
type Profile = Awaited<ReturnType<typeof fetchProfile>>