const mongodb = require('mongodb');

const getDb = require('../util/database').getDb;

class Product {
	constructor(title, price, description, imageUrl) {
		this.title = title;
		this.price = price;
		this.description = description;
		this.imageUrl = imageUrl;
	}

	save() {
		const db = getDb();
		return db
			.collection('products')
			.insertOne(this)
			.then()
			.catch((err) => console.log(err));
	}

	static fetchAll() {
		const db = getDb();
		return db
			.collection('products')
			.find()
			.toArray()
			.then((products) => {
				return products;
			})
			.catch((err) => console.log(err)); //Fetch all products to array and not by cursor, do it only for small datasets
	}

	static findById(prodId) {
		const db = getDb();
		return db
			.collection('products')
			.find({ _id: new mongodb.ObjectId(prodId) })
			.next()
			.then((product) => {
				return product;
			})
			.catch((err) => console.log(err));
	}
}

module.exports = Product;
