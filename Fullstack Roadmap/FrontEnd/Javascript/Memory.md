# Garbage Collection in JS
    Garbage collection is an automatic memory management process, where the runtime environment identifes and removes memory that is no
    longer used by the program.
    JS uses mark and sweep algorithm.
    Mark: The garbage collector starts from roots(gloable objects, currently executing functions) and marks all reachable objects
    Sweep: Any objects not marked are considered unreachable and their memory is freed.


```js
// GLOBAL SCOPE (Root)
const globalUser = { name: 'Alice', id: 1 };

function processOrder() {
  // LOCAL VARIABLES (Roots while function executes)
  const order = {
    id: 123,
    items: ['book', 'pen']
  };
  
  const customer = {
    name: 'Bob',
    address: { city: 'NYC', zip: '10001' }
  };
  
  // Orphaned object - no reference
  { data: 'I am lost' };
  
  const temp = { value: 'temporary' };
  
  return {
    orderId: order.id,
    customerName: customer.name
  };
}

const result = processOrder();

// Some unreachable objects
let forgotten = { secret: 'data' };
forgotten = null; // Now unreachable
```

## What Gets Marked (Step by Step)

### **Phase 1: Identify Roots**
The GC starts from:
- `globalUser` (global variable)
- `result` (global variable after function returns)
- Currently executing function's local variables (if any)

### **Phase 2: Mark Reachable Objects**

**Starting from `globalUser`:**
```
✓ Mark: { name: 'Alice', id: 1 }
```

**Starting from `result`:**
```
✓ Mark: { orderId: 123, customerName: 'Bob' }
```

**Objects NOT marked (will be collected):**
```
✗ { id: 123, items: ['book', 'pen'] } 
   ↳ 'order' was local, no longer referenced

✗ { name: 'Bob', address: {...} }
   ↳ 'customer' was local, no longer referenced

✗ { city: 'NYC', zip: '10001' }
   ↳ Was only reachable through 'customer.address'

✗ { data: 'I am lost' }
   ↳ Never had a reference

✗ { value: 'temporary' }
   ↳ 'temp' was local, no longer exists

✗ { secret: 'data' }
   ↳ 'forgotten' was set to null

```
# If an object can be traced through references from roots its kept in memory. Otherwise it is collected.

**Common JS Memory leaks

1. Accidental Global Variables
```js
function createLeak() {
  // Missing 'var', 'let', or 'const' creates global variable
  leakedVariable = 'This stays in memory forever';
}
createLeak();
// leakedVariable is now global and never collected

2.Forgotten Timers and Callbacks
const data = new Array(1000000).fill('leak');

setInterval(() => {
  // This callback references 'data', keeping it in memory forever
  console.log(data.length);
}, 1000);

// Should clear when done:
// clearInterval(intervalId);

3. Closures Holding References
function createUserProfile() {
  const userHistory = new Array(10000).fill('data'); // Large
  const userName = 'John Doe';
  const userAge = 30;
  const userEmail = 'john@example.com';
  
  // BAD: This closure "sees" all variables in scope
  return function displayName() {
    console.log(userName);
    // Even though we only use userName, JavaScript might keep
    // the entire scope alive in some engines
  };
}

const myClosure = createUserProfile();
// largeData stays in memory as long as myClosure exists

To prevent 
function createUserProfile() {
  const userHistory = new Array(10000).fill('data'); // Large
  const userName = 'John Doe';
  const userAge = 30;
  const userEmail = 'john@example.com';
  
  // BETTER: Extract and isolate what you need
  const name = userName;  // Primitive copy
  
  return function displayName() {
    console.log(name);
    // Only 'name' is in this closure's scope
    // userHistory, userAge, userEmail can be garbage collected
  };
}

4. Detached DOM Nodes
A detached DOM node is an element that is removed the DOM tree but still exists in javascript memory because something holds a reference to it
let detachedNodes = []; // Global array - this is the problem!

function createNodes() {
  // Step 1: Create a parent div (exists only in JavaScript memory)
  const parent = document.createElement('div');
  
  // Step 2: Create 100 child divs and add them to parent
  for (let i = 0; i < 100; i++) {
    const child = document.createElement('div');
    parent.appendChild(child);
  }
  // Now we have: parent with 100 children, all in memory only
  
  // Step 3: Add parent to the actual DOM (now visible on page)
  document.body.appendChild(parent);
  
  // Step 4: Store reference to parent in global array
  detachedNodes.push(parent);
  
  // Step 5: Remove parent from DOM (no longer visible on page)
  document.body.removeChild(parent);
  
  // ❌ PROBLEM: parent and all 100 children are still in memory!
  // They're "detached" - removed from DOM but referenced by detachedNodes array
}
To prevent either dont use detachedNodes array or cleanup after using it 


function cleanup() {
  // ✓ Clear the array to remove all references
  detachedNodes = [];
  // Now all those DOM nodes can be garbage collected
}

// Use it:
createNodes();
// ... later when you're done:
cleanup();

5. Event Listeners Not Removed
class Component {
  constructor() {
    this.data = new Array(100000).fill('data');
    this.element = document.getElementById('myButton');
    
    // Creates a reference from DOM to component
    this.element.addEventListener('click', () => {
      console.log(this.data.length);
    });
  }
  
  destroy() {
    // Forgot to remove listener - component stays in memory
    this.element.remove();
    // Should do: this.element.removeEventListener(...)
  }
}

6.Caches Without Limits
const cache = {};

function cacheData(key, value) {
  // Cache grows indefinitely
  cache[key] = value;
}

// Solution: Use WeakMap or implement size limits
const betterCache = new WeakMap();
// Objects used as keys are collected when no other references exist.

#Weakmap - Weak map and weakset hold weak refernces to objects, so when the object is no longer used elsewhere, garbage collector removes it 
automatically

const cache = new Map();

function computeUserScore(user) {
  if (cache.has(user)) {
    return cache.get(user);
  }

  const score = user.orders.reduce((sum, o) => sum + o.amount, 0);
  cache.set(user, score);
  return score;
}

function handleRequest() {
  let user = {
    id: 1,
    orders: [{ amount: 200 }, { amount: 300 }]
  };

  console.log(computeUserScore(user));
}

handleRequest();
❗ Problem

user object is no longer used after function ends

BUT Map still holds a strong reference

Garbage Collector ❌ cannot free it

📈 Over time:

Thousands of users → cache grows forever

Memory leak

Server slows / crashes

Using weakmap
const cache = new WeakMap();

function computeUserScore(user) {
  if (cache.has(user)) {
    return cache.get(user);
  }

  const score = user.orders.reduce((sum, o) => sum + o.amount, 0);
  cache.set(user, score);
  return score;
}
When user object goes out of scope

AND no other references exist

GC automatically deletes the cache entry

🧹 Zero manual cleanup
```
#React Speicif Memory Leaks

```js
function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Async operation
    fetch('/api/user')
      .then(res => res.json())
      .then(userData => {
        // ❌ Component might be unmounted by now!
        setUser(userData);
        setLoading(false);
        // Warning: "Can't perform a React state update on an unmounted component"
      })
      .
      catch(err => {
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>Loading...</div>;
  return <div>{user?.name}</div>;
}
The promise holds a reference to setUser and setLoading. If the component unmounts before the fetch completes, these references keep the component in memory.

To prevent  we can either use a flag or abort controller

AbortController allows React components to cancel in-flight async operations (like fetch requests) during unmount or dependency changes, preventing memory leaks, race conditions, and unnecessary state updates.

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const abortController = new AbortController();
    
    fetch('/api/user', { 
      signal: abortController.signal  // ✓ Pass abort signal
    })
      .then(res => res.json())
      .then(userData => {
        setUser(userData);
        setLoading(false);
      })
      .catch(err => {
        // ✓ Don't set error if request was aborted
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
        setLoading(false);
      });
    
    // ✓ Cancel request on unmount
    return () => {
      abortController.abort();
    };
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{user?.name}</div>;
}

Why is it important in React?

In React, components mount, re-render, and unmount frequently.

Without cancellation:

API responses may arrive after a component unmounts

React warns about state updates on unmounted components

You waste network + memory

You get race conditions when props/state change quickly

👉 AbortController solves all of this.

Window events.
like scroll, resize, keyup, keydown, blur, focus, beforeunload

when any of this event happens i want browser to exuecute the function

2. Event listeners not cleared
window.addEventListener('resize', handleResize);
window holds a reference to handleResize

What happens when the component unmounts (NO cleanup)

React does this:

Removes JSX from DOM

Marks component as unmounted

❌ But React cannot free memory, because:

The browser (window) still has a reference to handleResize

And handleResize still has a reference to React state.

This is called a retained closure.

When a component is unmounted and state request happens react throws
Can't perform a React state update on an unmounted component

3. TImers not cleared

function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);
    
    // ✓ Clear interval on unmount
    return () => {
      clearInterval(interval);
    };
  }, []);
  
  return <div>Count: {count}</div>;
}
4️⃣ What happens every second after unmount?
Every 1000ms:
Timer fires
Callback executes
setCount is called
React checks:
Component is unmounted
React ignores update (dev warning)

4. Subscriptions Not Unsubscribed Explore in detail later
5. Large Objects in State