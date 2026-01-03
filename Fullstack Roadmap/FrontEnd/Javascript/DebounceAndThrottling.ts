
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