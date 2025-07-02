const num1Input = document.getElementById('num1') as HTMLInputElement;
const num2Input = document.getElementById('num2') as HTMLInputElement;
const button = document.querySelector('button')!;

function add(num1: number | string, num2: number | string) {
	if (typeof num1 === 'number' && typeof num2 === 'number') {
		return num1 + num2;
	} else if (typeof num1 === 'string' && typeof num2 === 'string') {
		return num1 + ' ' + num2;
	}
	return +num1 + +num2;
}

button.addEventListener('click', () => {
	const num1 = num1Input.value;
	const num2 = num2Input.value;
	const result = add(+num1, +num2);
	const stringResult = add(num1, num2);
	console.log(result);
	console.log(stringResult);
});
