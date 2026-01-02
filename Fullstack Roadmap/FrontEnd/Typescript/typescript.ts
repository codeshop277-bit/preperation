/**
 * =============================================================================
 * COMPLETE TYPESCRIPT GUIDE: BEGINNER TO ADVANCED
 * =============================================================================
 * This file contains comprehensive TypeScript examples covering all concepts
 * from basic to advanced, including common interview questions.
 * =============================================================================
 */

// =============================================================================
// 1. BASIC DATA TYPES
// =============================================================================

// String
let userName: string = "John";
let message: string = `Hello ${userName}`;

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

// Any - disables type checking (avoid when possible)
let anything: any = "string";
anything = 123;
anything = true;

// Unknown - type-safe version of any
let unknown: unknown = "test";
// unknown.toUpperCase(); // Error: must type-check first

if (typeof unknown === "string") {
  console.log(unknown.toUpperCase()); // OK
}

// =============================================================================
// 2. ARRAYS AND TUPLES
// =============================================================================

// Array syntax
let numbers: number[] = [1, 2, 3, 4, 5];
let strings: Array<string> = ["a", "b", "c"];

// Multi-dimensional arrays
let matrix: number[][] = [[1, 2], [3, 4]];

// Mixed arrays (use union types)
let mixed: (string | number)[] = [1, "two", 3];

// Tuples - Fixed-length array with known types
let person: [string, number] = ["John", 30];
let coordinate: [number, number, number?] = [10, 20]; // Optional element

// Named tuples (TypeScript 4.0+)
let user: [name: string, age: number] = ["Alice", 25];

// Rest elements in tuples
let tuple: [string, ...number[]] = ["test", 1, 2, 3];

// =============================================================================
// 3. ENUMS
// =============================================================================

// Numeric enum
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

// =============================================================================
// 4. OBJECT TYPES
// =============================================================================

// Object type
let userObj: { name: string; age: number } = {
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

// =============================================================================
// 5. VOID, NEVER
// =============================================================================

// Void - function returns nothing
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

// =============================================================================
// 6. UNION AND INTERSECTION TYPES
// =============================================================================

// Union Types - Multiple possible types
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

// Intersection Types - Combine multiple types
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

// =============================================================================
// 7. LITERAL TYPES
// =============================================================================

// String literal
let direction: "north" | "south" | "east" | "west" = "north";

// Numeric literal
let diceRoll: 1 | 2 | 3 | 4 | 5 | 6 = 3;

// Boolean literal
let isTrue: true = true;

// Combined literal types
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type StatusCode = 200 | 404 | 500;

// =============================================================================
// 8. TYPE ALIASES
// =============================================================================

// Simple alias
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

// =============================================================================
// 9. TYPE ASSERTIONS
// =============================================================================

// as syntax (preferred)
let someValue: unknown = "this is a string";
let strLength: number = (someValue as string).length;

// Angle-bracket syntax (not in JSX)
let length: number = (<string>someValue).length;

// const assertions
let obj = { name: "John" } as const;
// obj.name = "Jane"; // Error: readonly property

let arr = [1, 2, 3] as const; // readonly [1, 2, 3]

// =============================================================================
// 10. TYPE GUARDS
// =============================================================================

// typeof guard
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

// =============================================================================
// 11. DISCRIMINATED UNIONS (TAGGED UNIONS)
// =============================================================================

interface Circle {
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

// =============================================================================
// 12. INTERFACES
// =============================================================================

// Basic interface
interface IUser {
  id: number;
  name: string;
  email: string;
}

// Optional properties
interface IConfig {
  host: string;
  port?: number;
}

// Readonly properties
interface IPoint {
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

interface IDog extends Animal {
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

// =============================================================================
// 13. GENERICS
// =============================================================================

// Generic function
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

// Generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface UserData {
  id: number;
  name: string;
}

const response: ApiResponse<UserData> = {
  data: { id: 1, name: "John" },
  status: 200,
  message: "Success"
};

// Generic class
class DataStore<T> {
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

const userStore = new DataStore<UserData>();
userStore.add({ id: 1, name: "John" });

// Generic constraints
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

const personData = { name: "John", age: 30 };
const nameVal = getProperty(personData, "name"); // string
const ageVal = getProperty(personData, "age"); // number
// getProperty(personData, "invalid"); // Error

// Default generic types
interface Response<T = any> {
  data: T;
  error?: string;
}

const response1: Response = { data: "anything" }; // T is any
const response2: Response<UserData> = { data: { id: 1, name: "John" } };

// =============================================================================
// 14. UTILITY TYPES
// =============================================================================

// Partial<T> - Makes all properties optional
interface FullUser {
  id: number;
  name: string;
  email: string;
  age: number;
}

type PartialUser = Partial<FullUser>;
// { id?: number; name?: string; email?: string; age?: number; }

function updateUser(id: number, updates: Partial<FullUser>) {
  // Update only provided fields
}

updateUser(1, { name: "New Name" }); // Only update name

// Required<T> - Makes all properties required
interface OptionalConfig {
  host?: string;
  port?: number;
  timeout?: number;
}

type RequiredConfig = Required<OptionalConfig>;
// { host: string; port: number; timeout: number; }

// Readonly<T> - Makes all properties readonly
interface Mutable {
  x: number;
  y: number;
}

type Immutable = Readonly<Mutable>;
// { readonly x: number; readonly y: number; }

const pointData: Immutable = { x: 10, y: 20 };
// pointData.x = 30; // Error: cannot assign to readonly property

// Pick<T, K> - Pick specific properties
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

// Omit<T, K> - Omit specific properties
type TodoWithoutDate = Omit<Todo, "createdAt">;
// { title: string; description: string; completed: boolean; }

// Record<K, T> - Create object type with specific keys and value type
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

// Exclude<T, U> - Exclude types from union
type All = "a" | "b" | "c" | "d";
type Subset = Exclude<All, "a" | "c">;
// "b" | "d"

type Primitive = string | number | boolean;
type NonString = Exclude<Primitive, string>;
// number | boolean

// Extract<T, U> - Extract types from union
type T1 = Extract<"a" | "b" | "c", "a" | "f">;
// "a"

type T2 = Extract<string | number | (() => void), Function>;
// () => void

// NonNullable<T> - Remove null and undefined
type T3 = NonNullable<string | number | null | undefined>;
// string | number

// ReturnType<T> - Get return type of function
function getUser() {
  return { id: 1, name: "John" };
}

type UserReturnType = ReturnType<typeof getUser>;
// { id: number; name: string; }

type T4 = ReturnType<() => string>;
// string

// Parameters<T> - Get parameter types as tuple
function createUser(name: string, age: number, isActive: boolean) {
  return { name, age, isActive };
}

type CreateUserParams = Parameters<typeof createUser>;
// [name: string, age: number, isActive: boolean]

function wrapper(...args: CreateUserParams) {
  createUser(...args);
}

// Awaited<T> - Unwrap Promise type
type A = Awaited<Promise<string>>;
// string

type B = Awaited<Promise<Promise<number>>>;
// number

async function getUserAsync(): Promise<UserData> {
  return { id: 1, name: "John" };
}

type UserType = Awaited<ReturnType<typeof getUserAsync>>;
// UserData

// =============================================================================
// 15. API RESPONSE TYPING
// =============================================================================

// Basic API Response
interface ApiResponseType<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

// User API
interface UserResponse {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

async function fetchUser(id: number): Promise<ApiResponseType<UserResponse>> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// Paginated Response
interface PaginatedResponse<T> {
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

async function fetchPosts(page: number = 1): Promise<PaginatedResponse<Post>> {
  const response = await fetch(`/api/posts?page=${page}`);
  return response.json();
}

// Error Handling
interface ApiError {
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
async function useApiData() {
  const result = await fetchData<UserResponse>("/api/user/1");

  if (result.success) {
    console.log(result.data.username); // Type-safe
  } else {
    console.error(result.error.message); // Type-safe
  }
}

// REST API Client
interface ApiConfig {
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

async function createNewUser() {
  const newUser = await api.post<UserResponse, CreateUserDto>("/users", {
    username: "john_doe",
    email: "john@example.com",
    password: "secret123"
  });
}

// GraphQL Typing
interface GraphQLResponse<T> {
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
async function getUserData() {
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
}

// =============================================================================
// 16. EVENT HANDLING
// =============================================================================

// DOM Event Types

// Mouse events
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

// Window Events
function setupWindowEvents(): void {
  // Window resize
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
}

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

// Event Delegation with Types
function setupDelegation(container: HTMLElement): void {
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

// =============================================================================
// 17. ADVANCED CONCEPTS
// =============================================================================

// Mapped Types
type ReadonlyType<T> = {
  readonly [P in keyof T]: T[P];
};

type Optional<T> = {
  [P in keyof T]?: T[P];
};

// Custom mapped type with key remapping
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

interface UserInfo {
  name: string;
  age: number;
}

type UserGetters = Getters<UserInfo>;
// { getName: () => string; getAge: () => number; }

// Conditional Types
type IsString<T> = T extends string ? true : false;

type TypeA = IsString<string>; // true
type TypeB = IsString<number>; // false

// Practical conditional type
type NonNullableType<T> = T extends null | undefined ? never : T;

type TypeC = NonNullableType<string | null>; // string

// Infer keyword
type ReturnTypeCustom<T> = T extends (...args: any[]) => infer R ? R : never;

function getUserInfo() {
  return { id: 1, name: "John" };
}

type UserInfoType = ReturnTypeCustom<typeof getUserInfo>;
// { id: number; name: string }

// Template Literal Types
type EventName = "click" | "scroll" | "mousemove";
type EventHandler = `on${Capitalize<EventName>}`;
// "onClick" | "onScroll" | "onMousemove"

type PropEventSource<Type> = {
  on<Key extends string & keyof Type>
    (eventName: `${Key}Changed`, callback: (newValue: Type[Key]) => void): void;
};

declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>;

const watchedPerson = makeWatchedObject({
  firstName: "John",
  lastName: "Doe",
  age: 30
});

// Type-safe event listener
watchedPerson.on("firstNameChanged", (newName) => {
  console.log(`New name: ${newName.toUpperCase()}`);
});

// as const for enum-like objects
const COLORS = {
  RED: "#FF0000",
  GREEN: "#00FF00",
  BLUE: "#0000FF"
} as const;

type ColorValue = typeof COLORS[keyof typeof COLORS];
// "#FF0000" | "#00FF00" | "#0000FF"

// satisfies operator (TypeScript 4.9+)
type ConfigType = {
  endpoint: string;
  timeout: number;
};

const configData = {
  endpoint: "/api",
  timeout: 3000
} satisfies ConfigType;
// Type: { endpoint: "/api"; timeout: 3000 }
// Keeps literal types while ensuring it satisfies ConfigType

// =============================================================================
// 18. INTERVIEW QUESTIONS EXAMPLES
// =============================================================================

// Q1: What is the difference between interface and type?
// Answer: Both can describe object shapes, but:
// - Interfaces can be extended and merged (declaration merging)
// - Types can represent unions, intersections, and primitives
// - Use interfaces for objects, types for complex compositions

interface IAnimal {
  name: string;
}
// Declaration merging works
interface IAnimal {
  age: number;
}

type TAnimal = {
  name: string;
};
// type TAnimal = { age: number; }; // Error: duplicate identifier

type StringOrNumber = string | number; // Type can do this, interface cannot

// Q2: What is never type?
// Answer: Represents values that never occur
function alwaysThrow(msg: string): never {
  throw new Error(msg);
}

// Exhaustive checks
type ShapeType = Circle | Square;
function getShapeArea(shape: ShapeType): number {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "square": return shape.sideLength ** 2;
    default:
      const _exhaustive: never = shape; // Compile error if not exhaustive
      return _exhaustive;
  }
}

// Q3: Explain keyof operator
interface UserKeys {
  id: number;
  name: string;
  email: string;
}

type UserKeysType = keyof UserKeys; // "id" | "name" | "email"

function getPropertyValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const userData: UserKeys = { id: 1, name: "John", email: "john@example.com" };
const userName = getPropertyValue(userData, "name"); // Type-safe

// Q4: What is unknown vs any?
// any disables type checking, unknown requires type checking
let anyValue: any = "hello";
anyValue.foo(); // No error, but runtime crash

let unknownValue: unknown = "hello";
// unknownValue.toUpperCase(); // Error
if (typeof unknownValue === "string") {
  unknownValue.toUpperCase(); // OK
}

// Q5: What is Type Narrowing?
function processValue(value: string | number) {
  if (typeof value === "string") {
    // Type narrowed to string
    console.log(value.toUpperCase());
  } else {
    // Type narrowed to number
    console.log(value.toFixed(2));
  }
}

// Discriminated unions
type SuccessResult = { status: "success"; data: string };
type ErrorResult = { status: "error"; message: string };
type ResultType = SuccessResult | ErrorResult;

function handleResult(result: ResultType) {
  if (result.status === "success") {
    console.log(result.data); // Type narrowed
  } else {
    console.log(result.message); // Type narrowed
  }
}

// Q6: Explain readonly vs const
// const - variable cannot be reassigned
const x = 10;
// x = 20; // Error

// readonly - property cannot be modified
interface PointReadonly {
  readonly x: number;
  readonly y: number;
}

const pointReadonly: PointReadonly = { x: 10, y: 20 };
// pointReadonly.x = 30; // Error

// readonly for arrays
const readonlyArr: readonly number[] = [1, 2, 3];
// readonlyArr.push(4); // Error
// readonlyArr[0] = 10; // Error

// Q7: What is Type Inference?
// TypeScript automatically determines types
let inferredX = 10; // inferred as number
let inferredName = "John"; // inferred as string

// Function return type inference
function addNumbers(a: number, b: number) {
  return a + b; // inferred as number
}

// Context type inference
window.addEventListener("click", (event) => {
  // event inferred as MouseEvent
  console.log(event.clientX);
});

// Q8: How to type async functions?
async function fetchUserData(id: number): Promise<UserData> {
  const response = await fetch(`/api/users/${id}`);
  const userData: UserData = await response.json();
  return userData;
}

// Generic async function
async function fetchGenericData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json();
}

const userDataResult = await fetchGenericData<UserData>("/api/user/1");

// =============================================================================
// 19. BEST PRACTICES
// =============================================================================

/**
 * 1. Enable strict mode in tsconfig.json
 * 2. Avoid any - use unknown when type is truly unknown
 * 3. Use type inference - don't over-annotate
 * 4. Prefer interfaces for objects that might be extended
 * 5. Use utility types instead of manually creating similar types
 * 6. Create discriminated unions for better type narrowing
 * 7. Use const assertions for literal types
 * 8. Type your API responses for safer data handling
 * 9. Use generics for reusable components
 * 10. Leverage IDE features for refactoring and navigation
 */

// =============================================================================
// 20. PRACTICAL PATTERNS
// =============================================================================

// Builder Pattern with TypeScript
class UserBuilder {
  private user: Partial<FullUser> = {};

  setId(id: number): this {
    this.user.id = id;
    return this;
  }

  setName(name: string): this {
    this.user.name = name;
    return this;
  }

  setEmail(email: string): this {
    this.user.email = email;
    return this;
  }

  setAge(age: number): this {
    this.user.age = age;
    return this;
  }

  build(): FullUser {
    if (!this.user.id || !this.user.name || !this.user.email || !this.user.age) {
      throw new Error("Missing required fields");
    }
    return this.user as FullUser;
  }
}

// Usage
const builtUser = new UserBuilder()
  .setId(1)
  .setName("John")
  .setEmail("john@example.com")
  .setAge(30)
  .build();

// Singleton Pattern
class Singleton {
  private static instance: Singleton;

  private constructor() {}

  static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }

  someMethod(): void {
    console.log("Singleton method");
  }
}

const singleton1 = Singleton.getInstance();
const singleton2 = Singleton.getInstance();
// singleton1 === singleton2 (true)

// Factory Pattern
interface Product {
  name: string;
  price: number;
}

class ProductFactory {
  createProduct(type: "digital" | "physical", name: string, price: number): Product {
    return { name, price };
  }
}

// Type-safe State Machine
type State = "idle" | "loading" | "success" | "error";
type Action = 
  | { type: "FETCH" }
  | { type: "SUCCESS"; payload: any }
  | { type: "ERROR"; error: string }
  | { type: "RESET" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH":
      return "loading";
    case "SUCCESS":
      return "success";
    case "ERROR":
      return "error";
    case "RESET":
      return "idle";
    default:
      return state;
  }
}

// =============================================================================
// END OF TYPESCRIPT GUIDE
// =============================================================================

export {};