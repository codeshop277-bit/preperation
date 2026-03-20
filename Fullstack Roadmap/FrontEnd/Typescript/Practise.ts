// TypeScript Generics — 10 Practice Problems
// Implement the types and generics for each function.
// Do not change the function body — only fill in the blanks marked with ???

// ============================================================
// Problem 1
// A function that returns the last element of any array.
//
// Usage:
// last([1, 2, 3])          → 3
// last(["a", "b", "c"])    → "c"
// last([])                 → undefined
// ============================================================

const last = <T>(items: T[]): T => {
  return items[items.length - 1];
}




// ============================================================
// Problem 2
// A function that merges two objects together.
// The return type should reflect both objects combined.
//
// Usage:
// merge({ name: "Priya" }, { age: 25 })
// → { name: "Priya", age: 25 }
//
// merge({ id: 1 }, { role: "admin", active: true })
// → { id: 1, role: "admin", active: true }
// ============================================================

const merge = <T, U>(a: T, b: U): T & U => {
  return { ...a, ...b };
};




// ============================================================
// Problem 3
// A function that filters an array by a specific key and value.
//
// Usage:
// const users = [
//   { id: 1, role: "admin" },
//   { id: 2, role: "editor" },
//   { id: 3, role: "admin" },
// ]
// filterBy(users, "role", "admin")
// → [{ id: 1, role: "admin" }, { id: 3, role: "admin" }]
//
// filterBy(users, "ghost", "x") → type error
// ============================================================

const filterBy = <T extends object, K extends keyof T>(items: T[], key: K, value: T[K]): T[] => {
  return items.filter(item => item[key] === value);
};




// ============================================================
// Problem 4
// A function that takes an array and returns a new array
// with duplicate values removed.
//
// Usage:
// unique([1, 2, 2, 3, 3, 3])        → [1, 2, 3]
// unique(["a", "b", "a", "c"])      → ["a", "b", "c"]
// unique([true, false, true, true]) → [true, false]
// ============================================================

const unique = <T>(items: T[]): T[] => {
  return [...new Set(items)];
};




// ============================================================
// Problem 5
// A function that converts an array of objects into a
// lookup map keyed by a specific field.
//
// Usage:
// const users = [
//   { id: 1, name: "Priya" },
//   { id: 2, name: "Arjun" },
// ]
// toMap(users, "id")
// → { 1: { id: 1, name: "Priya" }, 2: { id: 2, name: "Arjun" } }
//
// toMap(users, "ghost") → type error
// ============================================================

const toMap = <T, K extends keyof T>(items: T[], key: K): Record<Extract<T[K], PropertyKey>, T> => {
  return items.reduce((acc, item) => {
    const mapKey = item[key] as Extract<T[K], PropertyKey>;
    acc[mapKey] = item;
    return acc;
  }, {} as  Record<Extract<T[K], PropertyKey>, T>);
};




// ============================================================
// Problem 6
// A function that takes an object and returns a new object
// with only the keys where the value passes a predicate.
//
// Usage:
// const user = { id: 1, name: "Priya", age: 25, score: 0 }
//
// filterKeys(user, (value) => Boolean(value))
// → { id: 1, name: "Priya", age: 25 }  ← score removed (0 is falsy)
//
// filterKeys(user, (value) => typeof value === "number")
// → { id: 1, age: 25, score: 0 }
// ============================================================

const filterKeys = <T extends object>(obj: T , predicate: (value: T[keyof T]) => boolean): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => predicate(value))
  ) as Partial<T>;
};




// ============================================================
// Problem 7
// A function that retries an async function up to n times
// if it throws. Returns whatever the async function returns.
//
// Usage:
// const user = await retry(() => apiFetch<User>("/users/1"), 3)
// → User
//
// const posts = await retry(() => apiFetch<Post[]>("/posts"), 5)
// → Post[]
// ============================================================

const retry = async <T> (fn: () => Promise<T>, times: number): Promise<T> => {
  let lastError: unknown;
  for (let i = 0; i < times; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
};




// ============================================================
// Problem 8
// A function that takes an object and an array of keys,
// and returns a new object with those keys omitted.
// (Opposite of pick)
//
// Usage:
// const user = { id: 1, name: "Priya", passwordHash: "abc", role: "admin" }
//
// omit(user, ["passwordHash"])
// → { id: 1, name: "Priya", role: "admin" }
//
// omit(user, ["id", "role"])
// → { name: "Priya", passwordHash: "abc" }
//
// omit(user, ["ghost"]) → type error
// ============================================================

const omit = <T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as ???))
  ) as Omit<T, K>;
};




// ============================================================
// Problem 9
// A function that takes two arrays and returns only the
// elements that exist in both (intersection).
//
// Usage:
// intersect([1, 2, 3, 4], [2, 4, 6])           → [2, 4]
// intersect(["a", "b", "c"], ["b", "c", "d"])  → ["b", "c"]
//
// intersect([1, 2, 3], ["a", "b"]) → type error — different types
// ============================================================

const intersect = <T>(a: T[], b: T[]): T[] => {
  return a.filter(item => b.includes(item));
};




// ============================================================
// Problem 10
// A function that takes a value and a list of transformer
// functions, and pipes the value through each one in order.
// Each transformer receives the output of the previous one.
//
// Usage:
// pipe(
//   "  hello world  ",
//   (s) => s.trim(),           // "hello world"
//   (s) => s.toUpperCase(),    // "HELLO WORLD"
//   (s) => s.split(" "),       // ["HELLO", "WORLD"]
//   (arr) => arr.length        // 2
// )
// → 2
//
// Hint: This one is hard. Think about what type flows
// through each transformer step.
// ============================================================

const pipe = <T, R>(value: T, ...fns: Array<(arg: any) => any> ): R =>{
  return fns.reduce((acc, fn) => fn(acc), value as Array<R(arg: any) => any> ));
};