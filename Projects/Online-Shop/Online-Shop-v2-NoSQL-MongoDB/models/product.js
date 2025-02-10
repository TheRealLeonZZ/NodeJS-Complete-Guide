const mongodb = require('mongodb');

const getDb = require('../util/database').getDb;

class Product {
	constructor(title, price, description, imageUrl, id) {
		this.title = title;
		this.price = price;
		this.description = description;
		this.imageUrl = imageUrl;
		this._id = id; //If I create a new one, dont pass this. If I want to edit, I will use this to check.
	}

	save() {
		const db = getDb();
		let dbOp;
		if (this._id) {
			//Update product
			dbOp = db
				.collection('products')
				.updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
		} else {
			dbOp = db
				.collection('products')
				.insertOne(this)
				.then()
				.catch((err) => console.log(err));
		}
		return dbOp;
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
