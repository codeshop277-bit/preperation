
function MathProblems() {
    //Count all Digits of a Number
    let n = 2340
    let count = 0;
    while (n > 0) {
        count++;
        n = Math.floor(n / 10)
    }
    console.log(count)
}
function MathProblems1() {
    //Count all Digits of a Number
    let n = 2340
    let count = Math.floor(Math.log10(n) + 1);
    console.log(count)
}

function MathProblems2() {
    //Reverse a number
    let n = 10401
    let reversed = 0;
    while (n > 0) {
        let lastDigit = n % 10;
        n = Math.floor(n / 10);
        reversed = (reversed * 10) + lastDigit
    }
    console.log(reversed)
}


function MathProblems3(n) {
    //Check palindrome
    let intial = n
    let reversed = 0;
    while (n > 0) {
        let lastDigit = n % 10;
        n = Math.floor(n / 10);
        reversed = (reversed * 10) + lastDigit
    }
    if (intial == reversed) {
        console.log(true)
        return true
    } else {
        console.log(false)
        return false
    }
}

function MathProblems4(n) {
    let duplicate = n;
    //Armstrong number
    let calc = 0;
    while (n > 0) {
        let lastDigit = n % 10;
        n = Math.floor(n / 10);
        calc = calc + (lastDigit * lastDigit * lastDigit)
    }
    console.log(calc)
    if (duplicate == calc) {
        console.log('Armstrong no')
    } else {
        console.log("Not a armstorng no")
    }
}

function MathProblems5(n) {
    //Print al divisors
    let divisors = [];
    for (let i = 0; i <= n; i++) {
        if (n % i == 0) {
            divisors.push(i)
        }
    }
    console.log(divisors)
}

function MathProblems6(n) {
    //Print al divisors optimimized
    let divisors = [];
    for (let i = 0; i <= Math.sqrt(n); i++) {
        if (n % i == 0) {
            divisors.push(i)
            if (Math.floor(n / i) != i) {
                divisors.push(Math.floor(n / i))
            }
        }
    }
    console.log(divisors.sort((a, b) => a - b))
}

function MathProblems7(n) {
    //Prime
    let count = 0
    for (let i = 0; i <= n; i++) {
        if (n % i == 0) {
            count++
        }
    }
    if (count == 2) {
        console.log('Ptime')
    } else {
        console.log('not a prime')
    }
}
function MathProblems8(n) {
    //Prime
    let count = 0
    for (let i = 0; i*i < n; i++) {
        if (n % i == 0) {
            count++
            if((n/i) !=i){
                count++
            }
        }
    }
    if (count == 2) {
        console.log('Ptime')
    } else {
        console.log('not a prime')
    }
}


function MathProblems9(n) {
    let n1= 90; let n2=180;
    //GCD
    let gcd = 1
    for (let i = 0; i <= Math.min(n1, n2); i++) {
        if (n1 % i == 0 && n2%i ==0) {
            gcd =i
        }
    }
    console.log(gcd)
}


function MathProblems10(n) {
    let n1= 121; let n2=110;

    //Eucledian algorithm
    while(n1> 0 && n2>0){
        if (n1> n2) {
            n1 = n1 % n2
        }else{
            n2 = n2% n1
        }

        if(n1==0) {
            console.log(n2) 
            return n2
        }else{
            console.log(n1)
        return n1
        }
    }
   
}

MathProblems10(8)