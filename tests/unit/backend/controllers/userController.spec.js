const { anything, deepEqual, instance, mock, reset, verify, when } = require('ts-mockito');
const { signup, login, createAdmin } = require('../controllers/userController');
const { executeStoredProcedure } = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('User Controller', () => {
    let mockRequest;
    let mockResponse;
    let mockExecute;

    beforeEach(() => {
        mockExecute = mock(executeStoredProcedure);
        mockRequest = {
            body: {},
            headers: {}
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        process.env.JWT_SECRET = 'test-secret';
    });

    describe('signup', () => {
        it('should return 409 if email exists', async () => {
            when(mockExecute('sp_GetUserByEmail', anything())).thenResolve({ recordset: [{}] });
            mockRequest.body = { email: 'exists@test.com' };

            await signup(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(409);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Email already exists' });
        });

        it('should create new user with hashed password', async () => {
            when(mockExecute('sp_GetUserByEmail', anything())).thenResolve({ recordset: [] });
            when(mockExecute('sp_CreateUser', anything())).thenResolve({
                recordset: [{ id: 1, isAdmin: false }]
            });

            mockRequest.body = {
                username: 'testuser',
                email: 'test@test.com',
                password: 'password123'
            };

            await signup(mockRequest, mockResponse);

            expect(bcrypt.hash).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(jwt.sign).toHaveBeenCalled();
        });
    });

    describe('login', () => {
        it('should return 401 for invalid password', async () => {
            when(mockExecute('sp_GetUserByEmail', anything())).thenResolve({
                recordset: [{ password: 'hashed' }]
            });
            mockRequest.body = { email: 'test@test.com', password: 'wrong' };

            await login(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
        });
    });

    describe('createAdmin', () => {
        it('should create admin user with isAdmin=true', async () => {
            when(mockExecute('sp_GetUserByEmail', anything())).thenResolve({ recordset: [] });
            when(mockExecute('sp_CreateUser', anything())).thenResolve({
                recordset: [{ id: 1, isAdmin: true }]
            });

            mockRequest.body = {
                username: 'admin',
                email: 'admin@test.com',
                password: 'admin123'
            };

            await createAdmin(mockRequest, mockResponse);

            verify(mockExecute('sp_CreateUser', deepEqual({ isAdmin: true }))).once();
        });
    });
});