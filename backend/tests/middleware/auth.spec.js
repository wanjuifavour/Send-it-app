const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/auth');

describe('Auth Middleware', () => {
    let mockRequest
    let mockResponse
    let nextFn = jest.fn();

    test('should validate JWT token', () => {
        mockRequest = {
            headers: {
                authorization: 'Bearer valid.token.here'
            }
        };
        jwt.verify = jest.fn().mockReturnValue({ userId: 1 });

        authMiddleware(mockRequest, mockResponse, nextFn);

        expect(nextFn).toHaveBeenCalled();
    });

    test('should reject invalid token', () => {
        mockRequest = { headers: {} };

        authMiddleware(mockRequest, mockResponse, nextFn);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
    });
});