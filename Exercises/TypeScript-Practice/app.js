"use strict";
const num1Input = document.getElementById('num1');
const num2Input = document.getElementById('num2');
const button = document.querySelector('button');
const numResults = [];
const textResults = [];
function add(num1, num2) {
    if (typeof num1 === 'number' && typeof num2 === 'number') {
        return num1 + num2;
    }
    else if (typeof num1 === 'string' && typeof num2 === 'string') {
        return num1 + ' ' + num2;
    }
    return +num1 + +num2;
}
function printResult(resultObj) {
    console.log(resultObj.val);
    console.log(resultObj.timestamp);
}
button.addEventListener('click', () => {
    const num1 = num1Input.value;
    const num2 = num2Input.value;
    const result = add(+num1, +num2);
    numResults.push(result);
    const stringResult = add(num1, num2);
    textResults.push(stringResult);
    printResult({ val: result, timestamp: new Date() });
    console.log(numResults, textResults);
});
const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('It worked!');
    }, 2000);
});
myPromise.then((result) => {
    console.log(result.split(' '));
});
