function Pattern(a) {
    for (let i = 1; i <= 2 * a - 1; i++) {
        for (let j = 1; j <= 2 * a - 1; j++) {
            let top = i;
            let left = j;
            let right = 2 * a - j;
            let bottom = 2 * a - i;
            let val = Math.min(Math.min(top, bottom), Math.min(left, right));
            process.stdout.write(`${a - val + 1}`)
        }
        console.log()
    }
    return "";
}

console.log(Pattern(5)); //3