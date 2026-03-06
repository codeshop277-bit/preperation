
import React from 'react';
//Debounce delays executing a function until after a certain amount of time has
//  passed since it was last called. If the function is called again before the delay ends,
//  the timer resets. This is useful for waiting until a user has stopped typing before making an API call.

// tf user runs the query r and re next and has a delay of 500 ms
//Only after 500ms the search will trigger, r -> re  timer resets to 0 and query is updated to re

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
    let timerId: ReturnType<typeof setTimeout>;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
        let context = this;
        clearTimeout(timerId);

        timerId = setTimeout(() => {
            fn.apply(context, args)
        }, delay)
    }
};
const actualSearch = (query: string) => {
    console.log(`Searching for ${query}`);
}
const debouncedSearch = debounce((query: string) => actualSearch(query), 500);
const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    debouncedSearch(query)
}

// T extends (...args: any[]) => void
// Ensures fn is a function
// Captures argument types automatically

// (...args: Parameters<T>)
// Preserves the exact argument types of fn


//Throttling ensures a function is only called once in a specified time period,
// regardless of how many times it is triggered. This is useful for limiting the rate of events like window resizing or scrolling.

function throttle<T extends (...args:any[]) => void>(fn: T, delay: number): (...args:Parameters<T>) => void {
    let lastCallTime: number = 0;

    return function (...args: Parameters<T>) {
        const now = Date.now()
        if (now - lastCallTime >= delay) {
            lastCallTime = now
            fn(...args)
        }
    }
}

const handleScroll = throttle(() => {
    ///throttle lgong
}, 500)

//Key difference: Debounce waits for a pause in activity, while throttling executes at regular intervals during continuous activity.


//Debounce with trailing and leading
// User types → show first result immediately (leading)
// User stops typing → update results again (trailing)
function debounce(fn, delay, { leading = false, trailing = true } = {}) {
  let timer = null;

  return function (...args) {
    const context = this;

    const callNow = leading && !timer;

    clearTimeout(timer);

    timer = setTimeout(() => {
      if (trailing) fn.apply(context, args);
      timer = null;
    }, delay);

    if (callNow) fn.apply(context, args);
  };
}

// Debouncing limits how frequently a function runs by delaying execution until events stop firing. Leading execution runs the function immediately, while trailing execution runs it after the delay.

//Throttle
function throttle(fn, delay) {
  let lastCall = 0;

  return function (...args) {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}