import dotenv from 'dotenv';
dotenv.config();

import { expect } from 'chai';
import sinon from 'sinon'; // Importing sinon for mocking
import mongoose from 'mongoose'; // Importing mongoose for database operations

import User from '../models/user.js';
import authController from '../controllers/auth.js';

describe('Auth Controller', () => {
	before((done) => {
		mongoose
			.connect(process.env.MONGO_TEST_URI)
			.then(() => {
				const user = new User({
					email: 'test@test.com',
					password: 'abc123',
					name: 'Test User',
					posts: [],
					_id: '68223bc816700cd0e2fbb08b',
				});
				return user.save(); // Saving the user to the database
			})
			.then(() => {
				done();
			});
	});

	it('should throw an error with code 500 if accessing the database fails', (done) => {
		sinon.stub(User, 'findOne'); // Stubbing User.findOne method
		User.findOne.throws(); // Simulating a database access failure
		const req = {
			body: {
				email: 'test@test.com',
				password: 'abc123',
			},
		};

		authController
			.login(req, {}, () => {})
			.then((result) => {
				// console.log(result);
				expect(result).to.be.an('error'); // Expecting an error to be thrown
				expect(result).to.have.property('statusCode', 500); // Expecting status code 500
				done(); // Indicating that the test is done
			}); // Calling the login method

		User.findOne.restore(); // Restoring the original method after the test
	});

	it('should send a response with a valid user status for an existing user', (done) => {
		const req = {
			userId: '68223bc816700cd0e2fbb08b',
		};
		const res = {
			statusCode: 500,
			userStatus: null,
			status(code) {
				this.statusCode = code; // Setting the status code
				return this; // Returning the response object for chaining
			},
			json(data) {
				this.userStatus = data.status; // Setting the user status
			},
		};
		authController
			.getStatus(req, res, () => {})
			.then((result) => {
				console.log(result);
				expect(res.statusCode).to.equal(200); // Expecting status code 200
				expect(res.userStatus).to.equal('I am new!'); // Expecting user status to be 'I am new!'
				done(); // Indicating that the test is done
			});
	});
	after((done) => {
		User.deleteMany({})
			.then(() => {
				return mongoose.disconnect();
			})
			.then(() => {
				done(); // Indicating that the test is done
			}); // Cleaning up the database after the test
	});
});
