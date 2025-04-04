const deleteProduct = (btn) => {
	const prodId = btn.parentNode.querySelector('[name=productId]').value;
	const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

	const productElement = btn.closest('article');

	fetch('/admin/product/' + prodId, {
		method: 'DELETE',
		headers: {
			'csrf-token': csrf,
		},
	})
		.then((result) => {
			return result.json();
		})
		.then(() => {
			productElement.parentNode.removeChild(productElement); // Remove the product element from the DOM
		})
		.catch((err) => {
			console.log(err);
		});
};
