import { expect } from 'chai';
import sinon from 'sinon'; // Importing sinon for mocking

import User from '../models/user.js';
import authController from '../controllers/auth.js';

describe('Auth Controller - Login', () => {
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
				console.log(result);
				expect(result).to.be.an('error'); // Expecting an error to be thrown
				expect(result).to.have.property('statusCode', 500); // Expecting status code 500
				done(); // Indicating that the test is done
			}); // Calling the login method

		User.findOne.restore(); // Restoring the original method after the test
	});
});
