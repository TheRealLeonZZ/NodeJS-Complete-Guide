import { expect } from 'chai';

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
});
