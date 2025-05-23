const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
	title: { type: String, required: true },
	price: { type: Number, required: true },
	description: { type: String, required: true },
	imageUrl: { type: String, required: true },
	userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Product', productSchema);

// const mongodb = require('mongodb');

// const getDb = require('../util/database').getDb;

// class Product {
// 	constructor(title, price, description, imageUrl, id, userId) {
// 		this.title = title;
// 		this.price = price;
// 		this.description = description;
// 		this.imageUrl = imageUrl;
// 		this._id = id ? new mongodb.ObjectId(id) : null; //If I create a new one, dont pass this. If I want to edit, I will use this to check.
// 		this.userId = userId;
// 	}

// 	save() {
// 		const db = getDb();
// 		let dbOp;
// 		if (this._id) {
// 			//Update product
// 			dbOp = db
// 				.collection('products')
// 				.updateOne({ _id: this._id }, { $set: this });
// 		} else {
// 			dbOp = db
// 				.collection('products')
// 				.insertOne(this)
// 				.then()
// 				.catch((err) => console.log(err));
// 		}
// 		return dbOp;
// 	}

// 	static fetchAll() {
// 		const db = getDb();
// 		return db
// 			.collection('products')
// 			.find()
// 			.toArray()
// 			.then((products) => {
// 				return products;
// 			})
// 			.catch((err) => console.log(err)); //Fetch all products to array and not by cursor, do it only for small datasets
// 	}

// 	static findById(prodId) {
// 		const db = getDb();
// 		return db
// 			.collection('products')
// 			.find({ _id: new mongodb.ObjectId(prodId) })
// 			.next()
// 			.then((product) => {
// 				return product;
// 			})
// 			.catch((err) => console.log(err));
// 	}

// 	static deleteById(prodId) {
// 		const db = getDb();
// 		return db
// 			.collection('products')
// 			.deleteOne({ _id: new mongodb.ObjectId(prodId) })
// 			.then()
// 			.catch((err) => console.log(err));
// 	}
// }

// module.exports = Product;
