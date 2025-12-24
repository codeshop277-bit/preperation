// * * * *
// * * * *
// * * * *
// * * * *
let a = 5;
let b = 4;
// for (let i=0; i<a; i++){
//     for (let j = 0; j<b; j++){
//         process.stdout.write("* "); 
//     }
//     console.log()
// }

// *
// * *
// * * *
// * * * *
// for (let i=0; i<=a; i++){
//     for (let j=0; j<=i; j++){
//         process.stdout.write("* ")
//     }
//     console.log()
// }

// 1
// 12
// 123
// 1234
// for (let i=1; i<=a; i++){
//     for (let j=1; j<=i; j++){
//         process.stdout.write(`${j.toString()} `)
//     }
//     console.log()
// }

// 1
// 2 2
// 3 3 3
// 4 4 4 4
// for (let i=1; i<=a; i++){
//     for (let j=1; j<=i; j++){
//         process.stdout.write(`${i.toString()} `)
//     }
//     console.log()
// }


// * * * * *
// * * * *
// * * *
// * *
// *

// for(let i=0; i<a; i++){
//     for(let j=a; j>i; j--){
//         process.stdout.write("* ")
//     }
//     console.log()
// }


// 12345
// 1234
// 123
// 12
// 1
// for(let i=0; i<=a; i++){
//     for(let j=a; j>i; j--){
//         process.stdout.write(`${(a-j+1).toString() }`)
//     }
//     console.log()
// }

//     *
//    ***
//   *****
//  *******
// *********
// for(let i=0; i<a; i++){
//     //space
//     for(let j=0; j< a-i-1; j++){
//         process.stdout.write(" ")
//     }
//     //star
//     for(let j=0; j< 2*i+1; j++){
//         process.stdout.write("*")
//     }
//     //space
//     for(let j=0; j< a-i-1; j++){
//         process.stdout.write(" ")
//     }
//     console.log()
// }
// *********
//  *******
//   *****
//    ***
//     *
// for(let i=0; i<a; i++){
//     //space
//     for(let j=0; j<i; j++){
//         process.stdout.write(" ")
//     }
//     //star
//     for(let j=0; j< (2*a) - (2*i +1); j++){
//         process.stdout.write("*")
//     }
//     //space
//     for(let j=0; j<i; j++){
//         process.stdout.write(" ")
//     }
//     console.log()
// }
// *
// **
// ***
// ****
// *****
// ****
// ***
// **
// *
// for(let i=1; i<=2*a-1; i++){
//     console.log(i)
//     let stars = i;
//     if(i>a) stars = 2*a-i

//     for(let j=0; j<stars; j++){
//         process.stdout.write("*")
//     }
//     console.log()
// }

// for(let i=0; i<a; i++){
//     let start = 1;
//      if(i % 2== 0){
//             start = 1
//         }else{
//             start = 0;
//         }
//     for (let j=0; j<=i; j++){
//         process.stdout.write(start.toString())
//         start = 1-start
//     }
//     console.log()
// }

// 1******1
// 12****21
// 123**321
// 12344321
// for(let i=1; i<=a; i++){
//     for (let j =1; j<=i; j++){
//         process.stdout.write(j.toString())
//     }
//     for(let j=1; j<=2*a-2*i; j++){
//         process.stdout.write(" ")
//     }
//     for(let j=i; j>=1; j--){
//         process.stdout.write(j.toString())
//     }
//     console.log()
// }

// let start = 1;
// for(let i =1; i<=a; i++){
//     for (let j = 1; j<=i; j++){
//         process.stdout.write(start.toString())
//         start = start +1
//     }
//     console.log()
// }

// for(let i =0; i<=a; i++){
//     for (let j = 0; j<=i; j++){
//         process.stdout.write(String.fromCharCode(65 + j) + " ")
//     }
//     console.log()
// }

// A B C D E 
// A B C D
// A B C
// A B
// A
// for(let i =0; i<=a; i++){
//     for (let j = 0; j<=a-i-1; j++){
//         process.stdout.write(String.fromCharCode(65 + j) + " ")
//     }
//     console.log()
// }

// A 
// B B 
// C C C 
// D D D D 
// E E E E E 
// F F F F F F 
// for(let i=0; i<=a; i++){
//     for(let j=0; j<=i; j++){
//         process.stdout.write(String.fromCharCode(65 + i) + " ")
//     }
//     console.log()
// }

//   A   
//   ABA
//  ABCBA
// ABCDCBA
// for(let i=0; i<b; i++){
//     //space/stars
//     for(let j=0; j< b-i-1; j++){
//         process.stdout.write(" ")
//     }
//      //chars
//      let breakpoint = (2*i+1)/2;
//     for(let j=0; j< 2*i+1; j++){
//         if(j<breakpoint){
//         process.stdout.write(String.fromCharCode(65 + j))
//         }else{
//         process.stdout.write(String.fromCharCode(65 + (2*i-j)))
//         }
//     }
//      //space/stars
//     for(let j=0; j< b-i-1; j++){
//         process.stdout.write(" ")
//     }
//     console.log()
// }

// E
// DE
// CDE
// BCDE
// ABCDE
// for(let i=0; i<=b; i++){
//         let start = b-i;
//     for(let j=0; j<=i ; j++){
//         process.stdout.write(String.fromCharCode(65 + start))
//         start++
//     }
//     console.log()
// }

// **********
// ****  ****
// ***    ***
// **      **
// *        *
// *        *
// **      **
// ***    ***
// ****  ****
// **********

// for(let i=0; i<a; i++){
//     //stars
//     for(let j=0; j<a-i; j++){
//         process.stdout.write("*")
//     }
//     //spaces
//     for(let j=0; j<2*i; j++){
//         process.stdout.write(" ")
//     }
//     //stars
//     for(let j=0; j<a-i; j++){
//         process.stdout.write("*")
//     }
//     console.log()
// }

// for(let i=1; i<=a; i++){
//     //stars
//     for(let j=1; j<=i; j++){
//         process.stdout.write("*")
//     }
//     //spaces
//     for(let j=1; j<=2*a-2*i; j++){
//         process.stdout.write(" ")
//     }
//     //stars
//     for(let j=1; j<=i; j++){
//         process.stdout.write("*")
//     }
//     console.log()
// // }
// let n = 5; 
// for(let i=1; i<=2*n-1; i++){
//     let starCount = n - i + 1; 
//     let spaceCount = 2*i - 2;

//     //adjust for second half
//     if(i > n){
//         starCount = i - n + 1;
//         spaceCount = 4*n - 2*i - 2;
//     }
    
//     //left stars
//     for(let j=1; j<=starCount; j++){
//         process.stdout.write("*")
//     }
//     //spaces
//     for(let j=1; j<=spaceCount; j++){
//         process.stdout.write(" ")
//     }
//     //right stars
//     for(let j=1; j<=starCount; j++){
//         process.stdout.write("*")
//     }
//     console.log()
// }

// *****
// *   *
// *   *
// *   *
// *****
// for(let i=0; i<=b; i++){
//     for(let j=0; j<=b; j++){
//         if(i==0 || j==0 || i==a-1 || j==a-1){
//             process.stdout.write("*")
//         }else{
//             process.stdout.write(" ")
//         }
//     }
//     console.log()
// }


// 4444444
// 4333334
// 4322234
// 4321234
// 4322234
// 4333334
// 4444444
// for(let i=0; i<(2*b-1); i++){
//     for(let j=0; j<(2*b-1); j++){
//       let top = i;
//       let left = j;
//       let bottom = 2*b-2-i;
//       let right = 2*b-2-j;
//       process.stdout.write(`${b- Math.min(Math.min(top, bottom), Math.min(left, right))}`)
//     }
//     console.log()
// }