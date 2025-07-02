const num1Input = document.getElementById('num1') as HTMLInputElement;
const num2Input = document.getElementById('num2') as HTMLInputElement;
const button = document.querySelector('button')!;

const numResults: number[] = [];
const textResults: string[] = [];

function add(num1: number | string, num2: number | string) {
	if (typeof num1 === 'number' && typeof num2 === 'number') {
		return num1 + num2;
	} else if (typeof num1 === 'string' && typeof num2 === 'string') {
		return num1 + ' ' + num2;
	}
	return +num1 + +num2;
}

function printResult(resultObj: { val: number | string; timestamp: Date }) {
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
