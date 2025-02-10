const mongodb = require('mongodb');

const getDb = require('../util/database').getDb;

class User {
	constructor(username, email, id) {
		this.username = username;
		this.email = email;
		this._id = id ? new mongodb.ObjectId(id) : null; //If I create a new one, dont pass this. If I want to edit, I will use this to check.
	}

	save() {
		const db = getDb();
		let dbOp;
		if (this._id) {
			//Update user
			dbOp = db
				.collection('users')
				.updateOne({ _id: this._id }, { $set: this });
		} else {
			db.collection('users')
				.insertOne(this)
				.then()
				.catch((err) => console.log(err));
		}
		return dbOp;
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
