const mongodb = require('mongodb');

const getDb = require('../util/database').getDb;

class User {
	constructor(username, email, cart, id) {
		this.username = username;
		this.email = email;
		this.cart = cart;
		this._id = id ? new mongodb.ObjectId(id) : null; //If I create a new one, don't pass this. If I want to edit, I will use this to check.
	}

	save() {
		const db = getDb();
		return db
			.collection('users')
			.insertOne(this)
			.then()
			.catch((err) => console.log(err));
	}

	addToCart(product) {
		const cartProductIndex = this.cart.items.findIndex((cp) => {
			return cp.productId.toString() === product._id.toString();
		});
		let newQuantity = 1;
		const updatedCartItems = [...this.cart.items];

		if (cartProductIndex >= 0) {
			newQuantity = this.cart.items[cartProductIndex].quantity + 1;
			updatedCartItems[cartProductIndex].quantity = newQuantity;
		} else {
			updatedCartItems.push({
				productId: new mongodb.ObjectId(product._id),
				quantity: newQuantity,
			});
		}

		const updatedCart = {
			items: updatedCartItems,
		};

		const db = getDb();
		return db
			.collection('users')
			.updateOne(
				{
					_id: new mongodb.ObjectId(this._id),
				},
				{
					$set: { cart: updatedCart },
				}
			)
			.then()
			.catch((err) => console.log(err));
	}

	static findById(userId) {
		const db = getDb();
		return db
			.collection('users')
			.findOne({ _id: new mongodb.ObjectId(userId) })
			.then((user) => {
				return user;
			})
			.catch((err) => console.log(err));
	}
}
module.exports = User;
