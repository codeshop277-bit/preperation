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
// for(let i=1; i<=b; i++){
//     for (let j =1; j<=i; j++){
//         process.stdout.write(j.toString())
//     }
//     for(let j=1; j<=2*b-2*i; j++){
//         process.stdout.write("*")
//     }
//     for(let j=i; j>=1; j--){
//         process.stdout.write(j.toString())
//     }
//     console.log()
// }