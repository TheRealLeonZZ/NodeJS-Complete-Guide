const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	email: { type: String, required: true },
	password: { type: String, required: true },
	resetToken: String,
	resetTokenExpiration: Date,
	cart: {
		items: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					ref: 'Product',
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
				},
			},
		],
	},
});

userSchema.methods.addToCart = function (product) {
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
			productId: product._id,
			quantity: newQuantity,
		});
	}
	const updatedCart = {
		items: updatedCartItems,
	};
	this.cart = updatedCart;
	return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
	const updatedCartItems = this.cart.items.filter((item) => {
		return item.productId.toString() !== productId.toString();
	});
	this.cart.items = updatedCartItems;
	return this.save();
};

userSchema.methods.clearCart = function () {
	this.cart = { items: [] };
	return this.save();
};

module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');

// const getDb = require('../util/database').getDb;

// class User {
// 	constructor(username, email, cart, id) {
// 		this.username = username;
// 		this.email = email;
// 		this.cart = cart;
// 		this._id = id ? new mongodb.ObjectId(id) : null; //If I create a new one, don't pass this. If I want to edit, I will use this to check.
// 	}

// 	save() {
// 		const db = getDb();
// 		return db
// 			.collection('users')
// 			.insertOne(this)
// 			.then()
// 			.catch((err) => console.log(err));
// 	}

// 	addToCart(product) {
// 		const cartProductIndex = this.cart.items.findIndex((cp) => {
// 			return cp.productId.toString() === product._id.toString();
// 		});
// 		let newQuantity = 1;
// 		const updatedCartItems = [...this.cart.items];
// 		if (cartProductIndex >= 0) {
// 			newQuantity = this.cart.items[cartProductIndex].quantity + 1;
// 			updatedCartItems[cartProductIndex].quantity = newQuantity;
// 		} else {
// 			updatedCartItems.push({
// 				productId: new mongodb.ObjectId(product._id),
// 				quantity: newQuantity,
// 			});
// 		}
// 		const updatedCart = {
// 			items: updatedCartItems,
// 		};
// 		const db = getDb();
// 		return db
// 			.collection('users')
// 			.updateOne(
// 				{
// 					_id: new mongodb.ObjectId(this._id),
// 				},
// 				{
// 					$set: { cart: updatedCart },
// 				}
// 			)
// 			.then()
// 			.catch((err) => console.log(err));

// 		// INCASE USER IS BROKEN, COMMENT TILL HERE AND UNCOMMENT FROM HERE
// 		// const updatedCart = { items: [{ ...product, quantity: 1 }] };
// 		// const db = getDb();
// 		// return db
// 		// 	.collection('users')
// 		// 	.updateOne(
// 		// 		{
// 		// 			_id: new mongodb.ObjectId(this._id),
// 		// 		},
// 		// 		{
// 		// 			$set: { cart: updatedCart },
// 		// 		}
// 		// 	)
// 		// 	.then()
// 		// 	.catch((err) => console.log(err));
// 	}

// 	getCart() {
// 		const db = getDb();
// 		const productIds = this.cart.items.map((i) => {
// 			return i.productId;
// 		});
// 		return db
// 			.collection('products')
// 			.find({ _id: { $in: productIds } })
// 			.toArray()
// 			.then((products) => {
// 				return products.map((p) => {
// 					return {
// 						...p,
// 						quantity: this.cart.items.find((i) => {
// 							return i.productId.toString() === p._id.toString();
// 						}).quantity,
// 					};
// 				});
// 			})
// 			.catch((err) => console.log(err));
// 	}

// 	deleteItemFromCart(productId) {
// 		const updatedCartItems = this.cart.items.filter((item) => {
// 			return item.productId.toString() !== productId.toString();
// 		});

// 		const db = getDb();
// 		return db
// 			.collection('users')
// 			.updateOne(
// 				{
// 					_id: new mongodb.ObjectId(this._id),
// 				},
// 				{
// 					$set: { cart: { items: updatedCartItems } },
// 				}
// 			)
// 			.then()
// 			.catch((err) => console.log(err));
// 	}

// 	addOrder() {
// 		const db = getDb();
// 		return this.getCart()
// 			.then((products) => {
// 				const order = {
// 					items: products,
// 					user: {
// 						_id: new mongodb.ObjectId(this._id),
// 					},
// 				};
// 				return db.collection('orders').insertOne(order);
// 			})
// 			.catch((err) => console.log(err))
// 			.then((result) => {
// 				this.cart = { items: [] };
// 				return db
// 					.collection('users')
// 					.updateOne(
// 						{
// 							_id: new mongodb.ObjectId(this._id),
// 						},
// 						{
// 							$set: { cart: { items: [] } },
// 						}
// 					)
// 					.then()
// 					.catch((err) => console.log(err));
// 			})
// 			.catch((err) => console.log(err));
// 	}

// 	getOrders() {
// 		const db = getDb();
// 		return db
// 			.collection('orders')
// 			.find({ 'user._id': new mongodb.ObjectId(this._id) })
// 			.toArray();
// 	}

// 	static findById(userId) {
// 		const db = getDb();
// 		return db
// 			.collection('users')
// 			.findOne({ _id: new mongodb.ObjectId(userId) })
// 			.then((user) => {
// 				return user;
// 			})
// 			.catch((err) => console.log(err));
// 	}
// }
// module.exports = User;
