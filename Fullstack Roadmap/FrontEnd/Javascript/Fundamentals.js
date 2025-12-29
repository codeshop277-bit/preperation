 //Call stack - maintains the order of executions

//Execution Context
// Everything in js is run by execution context. Initiaally creates a global execution context when a js file runs, this will contain this, window
//document properties
// Exceution context creates 2 main components 
// 1, Memory - this is where memeory for each variables are allocated. 
// 2, Code - Code Execution 
// There are 2 phases in execution context,
// 1, Memory creation phase - all variables are assigned in memory, Initially all variables are initialized as undefined
// and all functions are allocated with all the lines of code in it inside memory
// 2, Code Execution Phase - in this phase varavibles are reassigned with actual value
// ANd for each function a separate instance execution context will be created.Once the program returns the value. COntext gets deleted.

let n = 2;
function square(num){//Here num is called parameter
    return num* num;
}
let squareOf4 = square(4)//Here 4 is called the argument passed to the function

//Hoisting

// It is a javascript behavior where variable and function declarations are allocated in memory before code execution.
// var variables are hoisted and initialized to undefined.
console.log(ab)
var ab=10
// Var will not throw any error simply returns undefined. Also var is function scoped
//While let and const are hoisted but remain in temporal dead zone until initialized
// Temporal dead zone:
//             Time between a variable is initialized and entering the scope
//             During this time, variable exists but cannot be accessed. Accessing it throws ReferenceError
//             It exits to prevent bugs caused by accidental access before initialization
//console.log(abc)
// here abc will be uninitalized in creation phase
let abc=10
//Let and const are block scoped

//When a function is normally declared, the whole function codes are allocated in memory So it works
sayHi();

function sayHi() {
  console.log("Hi");
}
//But when a function is declared using variable or arrow function only the variable is hoisted, not funtion itself
start()
const start = () => {
    console.log('start')
}


//Closures
// A closure is created when a function retains access to its lexical scope even after  the outer scope has finished execution.
// They are possible due to lexical scoping. They don't store values they store references

// Lexical Scope - Scope is determined by hwere the code is written, not where it is called
let x = 10;

function outer() {
  let x = 20;

  function inner() {
    console.log(x);
  }

  inner();
}

outer(); // 20
//inner -> outer -> global
//inner is written inside outer. So its lexical parent is outer
//For outer, a separate lexical env/ execution scope is created
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}

    // here var creates a single shared variable,(loop finishes first and all logs are exucted with shared variable value)
    //  since it is function scope while let creates a new binding per block

//Scope chain
// current scope
//    ↓
// outer scope
//    ↓
// outer of outer
//    ↓
// global scope
//    ↓
// ReferenceError
// If JS can’t find a variable in the current scope, it walks up the scope chain
// Js uses scope chain to resolve identifiers, searching from current scope outward to global scope

function test() {
  if (true) {
    var x = 10;
  }
  console.log(x); // 10
}

test();
//Variables declared with var are scoped to entire function not only to blocks(if, for)


Async/await
//Async function always returns a promise
// await pauses the function execution, not the js thread
// it suspends the function and keeps running other code
async function test() {
  console.log("A");

  await Promise.resolve();

  console.log("B");
}

console.log("Start");
test();
console.log("End");
//once a promise is registered function returns a microtask
//await splits function into 2 before wait - 'synchronous" after await 'microtasks'

//async/await is just promise.then()
async function test() {
  await fetchData();
  console.log("Done");
}//both are same
function test() {
  return fetchData().then(() => {
    console.log("Done");
  });
}


await Promise.all([fetchA(), fetchB()]); //Parallel execution
//Async actually creates
1, wrap the function in a Promise
2, allow the function to pause at await
3, schedule the rest of the function as microtask

without it Which async execution context am I supposed to suspend? Js does not have ans to this so throws syntax error
This is why await cannot be used with async declartion

