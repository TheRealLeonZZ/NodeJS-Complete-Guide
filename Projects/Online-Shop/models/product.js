const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '..', 'data', 'products.json');

const getProductsFromFile = (cb) => {
	fs.readFile(p, (err, fileContent) => {
		if (err) {
			cb([]);
		} else {
			const products = JSON.parse(fileContent);
			cb(products);
		}
	});
};

module.exports = class Product {
	constructor(id, title, imageUrl, description, price) {
		this.id = id;
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
	}

	save() {
		getProductsFromFile((products) => {
			if (this.id) {
				// Updating Mode
				const existingProductIndex = products.findIndex(
					(prod) => prod.id === this.id
				);
				const updatedProducts = [...products];
				updatedProducts[existingProductIndex] = this;
				fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
					console.log(err);
				});
			} else {
				// Adding Mode
				this.id = Math.random().toString();
				products.push(this);
				fs.writeFile(p, JSON.stringify(products), (err) => {
					console.log(err);
				});
			}
		});
	}

	static fetchAll(cb) {
		getProductsFromFile(cb);
	}

	static findById(id, cb) {
		getProductsFromFile((products) => {
			const product = products.find((p) => p.id === id);
			cb(product);
		});
	}
};
