// console.log('Hello, VS Code!');

// // Create an Array
// const myNumbers = [4, 1, -20, -7, 5, 9, -6, 0];
// function isPositive(x) {
//   return x >= 0;
// }
// const removeNeg = function (myNumbers, callback) {
//   for (let num of myNumbers) {
//     if (callback(num)) console.log(`${num} ,`);
//   }
// };

// removeNeg(myNumbers, isPositive);

var promise= new Promise(

  // Executor
  function (res,rej) {
    res([
      {
        id:1,
        name:"JS"
      },
      {
        id:2,
        name:"Java"
      }
    ])
    rej("Failure")
  }

)

promise
    .then((res)=>{
         console.log(res);
         
    })
    .catch((rej)=>{
        console.log(rej);
        
    })
    .finally(()=>{
console.log("Done");

    })
