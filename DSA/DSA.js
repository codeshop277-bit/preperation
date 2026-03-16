function debounce(fn, delay){
    let timer;
    return function (...args){
        clearTimeout(timer)
        timer = setTimeout(() => fn.apply(this, args), delay)
    }
}

const searcCall = () => {

}
const debouncedSearch = debounce(searcCall, 500)

function throttle(fn, interval){
    let last = 0;
    return function(...args){
        let now = new Date.now()
        if(now - last >= interval){
            last = now
            fn.apply(this, args)
        }
    }
}

function throttle(fn, interval){
    let last = 0
    return function(...args){
        let now = new Date.now()
        if(now - last >= interval){
            last = now
            fn.apply(this, args)
        }
    }
}