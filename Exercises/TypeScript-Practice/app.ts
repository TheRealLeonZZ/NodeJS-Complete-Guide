const num1Input = document.getElementById('num1') as HTMLInputElement;
const num2Input = document.getElementById('num2') as HTMLInputElement;
const button = document.querySelector('button')!;

const numResults: Array<number> = [];
const textResults: Array<string> = [];

type NumOrString = number | string;
type Result = { val: NumOrString; timestamp: Date };
interface ResultObject {
	val: NumOrString;
	timestamp: Date;
}

function add(num1: NumOrString, num2: NumOrString) {
	if (typeof num1 === 'number' && typeof num2 === 'number') {
		return num1 + num2;
	} else if (typeof num1 === 'string' && typeof num2 === 'string') {
		return num1 + ' ' + num2;
	}
	return +num1 + +num2;
}

function printResult(resultObj: Result) {
	console.log(resultObj.val);
	console.log(resultObj.timestamp);
}

button.addEventListener('click', () => {
	const num1 = num1Input.value;
	const num2 = num2Input.value;
	const result = add(+num1, +num2);
	numResults.push(result as number);
	const stringResult = add(num1, num2);
	textResults.push(stringResult as string);
	printResult({ val: result as number, timestamp: new Date() });
	console.log(numResults, textResults);
});

const myPromise = new Promise<string>((resolve, reject) => {
	setTimeout(() => {
		resolve('It worked!');
	}, 2000);
});
myPromise.then((result) => {
	console.log(result.split(' '));
});
