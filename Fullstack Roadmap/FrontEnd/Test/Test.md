| Layer       | Purpose                 | Quantity |
| ----------- | ----------------------- | -------- |
| Unit        | Logic correctness       | Most     |
| Integration | Feature confidence      | Some     |
| E2E         | Business-critical flows | Few      |

Imagine a User Dashboard:
Unit
Reducer updates state correctly
Utility format function works

Integration
Dashboard renders API data
Filter changes list correctly

E2E
User logs in → sees dashboard → updates profile

# React Testing library
React Testing Library (RTL) is a testing library focused on:
🔥 Testing your app the way users use it.
Instead of testing internals, RTL focuses on:
DOM output
User interactions
Accessibility-based queries

```js
const Greeting = () => {
  return <h1>Hello User</h1>;
};

import { render, screen } from "@testing-library/react";

test("renders greeting", () => {
  render(<Greeting />);
  expect(screen.getByText("Hello User")).toBeInTheDocument();
});
```
Senior Insight
✔ Always prefer using screen
✔ Avoid destructuring render results unless needed

# Queries
Queries are how you find elements in the DOM.
RTL encourages accessibility-first queries.
getByRole ⭐ BEST
getByLabelText
getByPlaceholderText
getByText
getByTestId (LAST RESORT)

getBy*
Throws error if not found.
screen.getByText("Submit");

queryBy*
Returns null if not found.
expect(screen.queryByText("Error")).not.toBeInTheDocument();

findBy* (Async)
Used when UI updates later.
await screen.findByText("Loaded");

Example (Best Practice)
<button>Save</button>

Test:
screen.getByRole("button", { name: "Save" });
💡 This mimics how screen readers find elements.

# userEvent (Simulating Real Users)
userEvent simulates real user behavior better than fireEvent.
Install:
npm install @testing-library/user-event

```js
test("updates input value", async () => {
  render(<InputComponent />);

  const input = screen.getByPlaceholderText("Enter name");

  await userEvent.type(input, "John"); //Simulate user event

  expect(input).toHaveValue("John");
});
```
userEvent:
✔ triggers real keyboard events
✔ handles async naturally
✔ closer to browser behavior

# Testing Async Behavior
React apps are mostly async:
API calls
useEffect
loading states
delayed rendering

```js
const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  return (
    <>
      {users.length === 0 ? "Loading..." : users.map(u => <div key={u.id}>{u.name}</div>)}
    </>
  );
};

test("loads users", async () => {
  render(<Users />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  expect(await screen.findByText("John"))
    .toBeInTheDocument();
});
```
| Method                    | Use Case           |
| ------------------------- | ------------------ |
| findBy                    | Wait for element   |
| waitFor                   | Wait for condition |
| waitForElementToBeRemoved | Loading disappears |

# Mocking APIs (Very Common)
We usually mock APIs to:
Avoid real network calls
Make tests deterministic
Improve speed

```js
export const fetchUsers = () =>
  axios.get("/users");
  jest.mock("../api/userService");

  test("renders API users", async () => {
  fetchUsers.mockResolvedValue({
    data: [{ id: 1, name: "John" }]
  });

  render(<Users />);

  expect(await screen.findByText("John"))
    .toBeInTheDocument();
});
```
| Concept          | Purpose               |
| ---------------- | --------------------- |
| render           | Mount component       |
| queries          | Find elements         |
| userEvent        | Simulate user actions |
| findBy / waitFor | Async updates         |
| API mocks        | Controlled testing    |


Jest = Test Runner + Assertion + Mocking Framework
Jest
 ├── Runs tests
 ├── Asserts results
 ├── Mocks dependencies
 └── Handles lifecycle

React Testing Library
 ├── Renders UI
 ├── Finds elements
 └── Simulates user interaction

# Testing Behavior vs Implementation
 Core Idea
Test what the user experiences, NOT how the code works internally.
❌ Implementation Testing (Bad Practice)
Testing internal details:
state values
private functions
hook internals
exact function calls (when unnecessary)

Example Component
const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
};
❌ Bad Test (Implementation-focused)
expect(component.state.count).toBe(1);

Problems:
Relies on internal state
Breaks if implementation changes
Not user-centric

✅ Behavior Testing (Senior Approach)
Test what the user sees.
render(<Counter />);

await userEvent.click(
  screen.getByRole("button")
);

expect(
  screen.getByText("Count: 1")
).toBeInTheDocument();
Why this is better
✔ Works even if state logic changes
✔ Works if hooks change
✔ Works if Redux replaces local state
User only cares about UI output.
You should be able to completely refactor:
hooks → Redux
useState → useReducer
internal functions
…and tests should STILL pass.
Another Example
❌ Implementation Test
expect(fetchUsers).toHaveBeenCalled();
✅ Behavior Test
expect(await screen.findByText("John"))
  .toBeInTheDocument();
We care about result, not internal call.

# What is a brittle test?
A test that breaks when:
UI structure changes
CSS changes
Refactoring happens
Non-behavior changes occur

❌ Brittle Test Example
container.firstChild.firstChild.firstChild
OR
getByTestId("button-1")

Problems:
Fragile DOM dependency
Layout changes break tests
✅ Stable (Senior) Test
screen.getByRole("button", {
  name: "Submit"
});
Why stable?
Based on accessibility
User-facing behavior
Independent of DOM structure

🔥 Common Causes of Brittle Tests
1️⃣ Testing CSS
expect(button).toHaveStyle("color: red");
UI design changes → broken tests.
✔ Instead:
expect(button).toBeDisabled();