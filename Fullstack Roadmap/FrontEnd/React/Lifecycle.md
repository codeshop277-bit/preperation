/**
 * React Functional Component Lifecycle — FULL DEMO
 *
 * This file demonstrates:
 * 1. Mounting
 * 2. Updating
 * 3. Unmounting
 *
 * Along with:
 * - What happens in DOM
 * - What happens in memory
 * - When render vs effects run
 *
 * Open browser console to observe logs.
 */

import React, { useEffect, useState } from "react";

/**
 * -----------------------------
 * CHILD COMPONENT
 * -----------------------------
 */
function Child({ value }) {
  /**
   * RENDER PHASE (runs on every render)
   *
   * - Function executes
   * - Hooks are read from memory
   * - JSX is returned
   * - NO DOM mutation here
   */
  console.log("Child Render → value:", value);

  /**
   * MOUNT + UPDATE EFFECT
   *
   * Runs:
   * - After first DOM paint (mount)
   * - After every update when `value` changes
   */
  useEffect(() => {
    console.log("Child Effect → DOM is painted, value:", value);

    /**
     * CLEANUP
     *
     * Runs:
     * - Before next effect (update)
     * - On unmount
     *
     * Important for:
     * - Memory cleanup
     * - Removing listeners
     * - Cancelling API calls
     */
    return () => {
      console.log("Child Cleanup → previous value:", value);
    };
  }, [value]);

  return <h2>Child Value: {value}</h2>;
}

/**
 * -----------------------------
 * PARENT COMPONENT
 * -----------------------------
 */
export default function LifecycleDemo() {
  const [count, setCount] = useState(0);
  const [showChild, setShowChild] = useState(true);

  /**
   * RENDER PHASE
   *
   * Happens when:
   * - Component mounts
   * - State updates
   *
   * What happens:
   * - Function re-executes
   * - New virtual DOM created
   * - Old render is discarded
   */
  console.log("Parent Render → count:", count);

  /**
   * MOUNT EFFECT (componentDidMount equivalent)
   *
   * - Runs once
   * - After DOM is inserted & painted
   */
  useEffect(() => {
    console.log("Parent Mounted → DOM ready");

    return () => {
      console.log("Parent Unmounted → cleanup");
    };
  }, []);

  /**
   * UPDATE EFFECT (componentDidUpdate equivalent)
   *
   * Runs:
   * - After DOM updates caused by `count` change
   */
  useEffect(() => {
    console.log("Parent Update Effect → count:", count);
  }, [count]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>React Lifecycle Demo</h1>

      <button onClick={() => setCount((c) => c + 1)}>
        Increment Count
      </button>

      <button
        onClick={() => setShowChild((s) => !s)}
        style={{ marginLeft: "10px" }}
      >
        Toggle Child
      </button>

      <hr />

      {showChild && <Child value={count} />}
    </div>
  );
}

/**
 * ---------------------------------
 * LIFECYCLE SUMMARY (MENTAL MODEL)
 * ---------------------------------
 *
 * MOUNTING
 * --------
 * 1. Component function runs
 * 2. Hooks allocate memory
 * 3. Virtual DOM created
 * 4. Real DOM inserted
 * 5. Browser paints
 * 6. useEffect runs
 *
 * UPDATING
 * --------
 * 1. State update queued
 * 2. Component function re-runs
 * 3. New virtual DOM created
 * 4. Diffing (reconciliation)
 * 5. Minimal DOM updates
 * 6. Cleanup runs
 * 7. New effect runs
 *
 * UNMOUNTING
 * ----------
 * 1. Component removed from DOM
 * 2. Cleanup functions run
 * 3. Memory references released
 *
 * IMPORTANT RULES
 * ---------------
 * - Render must be pure (no side effects)
 * - Effects run AFTER paint
 * - Cleanup prevents memory leaks
 * - Every render is a fresh function execution
 */


Traditional lifecycle in react 
he Traditional 4 React Lifecycles

Used mainly for class components, but still the conceptual foundation for React.

1️⃣ Initialization
2️⃣ Mounting
3️⃣ Updating
4️⃣ Unmounting

(There is a 5th — Error Handling — but it’s usually excluded from the “traditional 4”)

All of this is from React’s early design.

1️⃣ Initialization (Birth preparation 🍼)
What it means

Component is being created

State & props are set up

Happens only once

Class component methods
constructor(props) {
  super(props);
  this.state = { count: 0 };
}

What happens internally

Memory allocated for state

Props attached to component instance

No DOM yet ❌

📌 In functional components, this is replaced by:

useState(initialValue);

2️⃣ Mounting (Component enters the DOM 🌍)
What it means

Component is rendered for the first time

DOM nodes are created and attached

Class lifecycle order
constructor
↓
render
↓
componentDidMount

Key methods
componentDidMount() {
  // API calls
  // subscriptions
}

What happens internally

Virtual DOM created

Real DOM inserted

Browser paints UI

Side effects run

📌 Functional equivalent:

useEffect(() => {
  // runs once after mount
}, []);

3️⃣ Updating (Re-render 🔁)
What triggers it

setState

new props

parent re-render

Class lifecycle order
render
↓
componentDidUpdate


(Optional optimization hooks exist)

Key methods
componentDidUpdate(prevProps, prevState) {
  // respond to changes
}

What happens internally

Component function/class runs again

New virtual DOM created

Diffing (reconciliation)

Minimal DOM updates

Effects re-run

📌 Functional equivalent:

useEffect(() => {
  // runs on dependency change
}, [deps]);

4️⃣ Unmounting (Component leaves ☠️)
What it means

Component removed from DOM

Cleanup happens

Class lifecycle method
componentWillUnmount() {
  // cleanup
}

What happens internally

DOM nodes removed

Event listeners cleaned

Memory released

📌 Functional equivalent:

useEffect(() => {
  return () => {
    // cleanup logic
  };
}, []);

🧠 Traditional Lifecycle Summary Table (Interview Gold)
Lifecycle	Purpose	Class Method	Functional Hook
Initialization	Setup state	constructor	useState
Mounting	First render	componentDidMount	useEffect([])
Updating	Re-render	componentDidUpdate	useEffect([deps])
Unmounting	Cleanup	componentWillUnmount	cleanup function