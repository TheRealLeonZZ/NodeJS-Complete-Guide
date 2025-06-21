import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import sinon from 'sinon'; // Importing sinon for mocking

import authMiddleware from '../middleware/is-auth.js';

describe('Auth Middleware', () => {
	it('should throw an error if no atuhorization header is present', () => {
		const req = {
			get: function () {
				return null; // Simulate no Authorization header
			},
		};
		expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
			'Not authenticated.'
		);
	});

	it('should throw an error if authorization header is only one string', () => {
		const req = {
			get: function () {
				return 'xyz'; // Simulate invalid Authorization header
			},
		};
		expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
	});

	it('should throw an error if token is not verified', () => {
		const req = {
			get: function () {
				return 'Bearer xyz'; // Simulate invalid token
			},
		};
		expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
	});

	it('should yield a userId after decoding the token', () => {
		const req = {
			get: function () {
				return 'Bearer asfsafsafsa'; // Simulate invalid Authorization header
			},
		};
		sinon.stub(jwt, 'verify'); // Stub jwt.verify to control its behavior
		jwt.verify.returns({ userId: '12345' }); // Simulate a decoded token
		authMiddleware(req, {}, () => {}); // Call the middleware
		expect(jwt.verify.called).to.be.true; // Check if jwt.verify was called
		expect(req).to.have.property('userId'); // Check if userId was set
		jwt.verify.restore(); // Restore the original jwt.verify method
	});
});
