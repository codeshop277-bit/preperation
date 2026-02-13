// 1️⃣ SRP — Single Responsibility Principle

// A component should have only one reason to change.

// ❌ Bad (UI + API + Business Logic mixed)
function UserProfile({ userId }) {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]);

  function calculateAge(dob) {
    return new Date().getFullYear() - new Date(dob).getFullYear();
  }

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Age: {calculateAge(user.dob)}</p>
    </div>
  );
}
// 🔴 Problems:

// Fetching logic

// Business logic

// UI rendering
// All inside one component.

// ✅ SRP Applied

// useUser.js
function useUser(userId) {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);

  return user;
}

// utils.js
export function calculateAge(dob) {
  return new Date().getFullYear() - new Date(dob).getFullYear();
}

// UserProfile.jsx
function UserProfile({ userId }) {
  const user = useUser(userId);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Age: {calculateAge(user.dob)}</p>
    </div>
  );
}

// ✔ Separation of concerns
// ✔ Easy to test
// ✔ Easier to maintain

// 2️⃣ OCP — Open/Closed Principle

// Open for extension, closed for modification.

// ❌ Bad (Conditional Rendering Hell)

function Button({ type, label }) {
  if (type === "primary") {
    return <button style={{ background: "blue" }}>{label}</button>;
  } else if (type === "secondary") {
    return <button style={{ background: "gray" }}>{label}</button>;
  } else if (type === "danger") {
    return <button style={{ background: "red" }}>{label}</button>;
  }
}
// dding new type → modify component ❌

// ✅ OCP Applied (Component Composition)

function Button({ children, className }) {
  return <button className={className}>{children}</button>;
}

// Usage
<>
<Button className="bg-blue-500">Primary</Button>
<Button className="bg-gray-500">Secondary</Button>
<Button className="bg-red-500">Danger</Button>
</>
// ✔ Extend styling without modifying Button
// ✔ Reusable
// ✔ Scalable


// 3️⃣ LSP — Liskov Substitution Principle

// Child components should behave like parent expectations.

// ❌ Bad
function Input({ value, onChange }) {
  return <input value={value} onChange={onChange} />;
}

function ReadOnlyInput({ value }) {
  return <input value={value} readOnly />;
}
// If parent expects onChange, passing ReadOnlyInput breaks behavior ❌
//LSP Applied
function Input({ value, onChange, readOnly = false }) {
  return (
    <input
      value={value}
      onChange={readOnly ? undefined : onChange}
      readOnly={readOnly}
    />
  );
}
// Now behavior remains predictable ✔

// 4️⃣ ISP — Interface Segregation Principle

// Don’t force components to accept props they don’t use.

// ❌ Bad
function Modal({ title, onClose, onSubmit, footer, size }) {
  return (
    <div>
      <h2>{title}</h2>
      {/* always renders footer even if not needed */}
      {footer}
    </div>
  );
}
// Simple info modal doesn’t need onSubmit, size, etc.

// ✅ ISP Applied

// Split into smaller components:

function BaseModal({ title, children }) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function ConfirmModal({ title, onConfirm }) {
  return (
    <BaseModal title={title}>
      <button onClick={onConfirm}>Confirm</button>
    </BaseModal>
  );
}
// ✔ Components only depend on what they use

// 5️⃣ DIP — Dependency Inversion Principle

// High-level components should not depend on low-level API details.

function UserList() {
  React.useEffect(() => {
    fetch("https://api.myapp.com/users")
      .then(res => res.json())
      .then(console.log);
  }, []);
}
// Component tightly coupled to fetch + URL ❌

// ✅ DIP Applied

// api.js
export function getUsers() {
  return fetch("/api/users").then(res => res.json());
}

// Component
function UserList({ userService }) {
  React.useEffect(() => {
    userService.getUsers().then(console.log);
  }, [userService]);
}
// Easy to mock in tests

// Switch API implementation easily

// ✔ Loose coupling ✔

// 6️⃣ DRY in React
// ❌ Repeated Fetch Logic Everywhere
fetch("/api/users").then(...)
fetch("/api/orders").then(...)
fetch("/api/products").then(...)

// ✅ DRY Applied (Custom Hook)
function useFetch(url) {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch(url).then(res => res.json()).then(setData);
  }, [url]);

  return data;
}

// Now reuse everywhere ✔

// 7️⃣ KISS in React
// ❌ Over-Engineered Counter
class CounterManager {
  constructor(initial) {
    this.state = { count: initial };
  }

  increment() {
    this.state.count += 1;
  }
}
// Used inside React unnecessarily ❌
//KISS Version
function Counter() {
  const [count, setCount] = React.useState(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      {count}
    </button>
  );
}
// ✔ Simple
// ✔ Clear
// ✔ React-native solution

// 8️⃣ YAGNI in React
// ❌ Overbuilding Form

const formConfig = {
  multiStep: false,
  supportsDarkMode: true,
  localization: true,
  auditTracking: true
};
// When requirement is just:

// “Simple login form”
// ✅ YAGNI Version

function LoginForm() {
  const [email, setEmail] = React.useState("");

  return (
    <input
      value={email}
      onChange={e => setEmail(e.target.value)}
      placeholder="Email"
    />
  );
}
```
| Principle | React Meaning                           |
| --------- | --------------------------------------- |
| SRP       | Separate UI, hooks, services            |
| OCP       | Use composition, not conditionals       |
| LSP       | Maintain predictable component behavior |
| ISP       | Smaller focused components              |
| DIP       | Inject services instead of direct fetch |
| DRY       | Reusable hooks, utils                   |
| KISS      | Don’t over-architect                    |
| YAGNI     | Don’t build future features today       |
```