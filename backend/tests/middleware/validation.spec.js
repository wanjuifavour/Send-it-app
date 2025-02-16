const { validateSignup, validateLogin } = require('../middlewares/validation');
const Joi = require('joi');

describe('Validation Middleware', () => {
    let mockRequest
    let mockResponse
    let nextFn = jest.fn();

    beforeEach(() => {
        mockRequest = { body: {} };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    test('should reject invalid signup payload', () => {
        mockRequest.body = { email: 'invalid', password: 'short' };

        validateSignup(mockRequest, mockResponse, nextFn);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: expect.any(String) })
        );
    });

    test('should accept valid login payload', () => {
        mockRequest.body = {
            email: 'valid@test.com',
            password: 'validpassword'
        };

        validateLogin(mockRequest, mockResponse, nextFn);

        expect(nextFn).toHaveBeenCalled();
    });
});