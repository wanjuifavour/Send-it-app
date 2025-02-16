const request = require('supertest');
const { connectDB } = require('../config/database');
const app = require('../server');

// Mock db connection and routes
jest.mock('../config/database');
jest.mock('../routes/userRoutes', () => require('express').Router());
jest.mock('../routes/parcelRoutes', () => require('express').Router());
jest.mock('../routes/locationRoutes', () => require('express').Router());

describe('Server Configuration', () => {
    let server;

    beforeAll(() => {
        process.env.NODE_ENV = 'test';
        process.env.PORT = '8085';
    });

    afterEach(async () => {
        if (server) await server.close();
    });

    test('should create express app with correct middlewares', async () => {
        const testApp = await app;
        expect(testApp).toHaveProperty('use');
        expect(testApp).toHaveProperty('listen');
    });

    test('should use CORS middleware', async () => {
        const testApp = await app;
        const middlewares = testApp._router.stack
            .map(layer => layer.name)
            .filter(name => name === 'corsMiddleware');

        expect(middlewares.length).toBeGreaterThan(0);
    });

    test('should connect to database on startup', async () => {
        connectDB.mockResolvedValue();
        const testApp = await app;
        expect(connectDB).toHaveBeenCalled();
    });

    test('should configure routes correctly', async () => {
        const testApp = await app;
        await request(testApp)
            .get('/api/users')
            .expect(404);

        await request(testApp)
            .get('/api/parcels')
            .expect(404);

        await request(testApp)
            .get('/api/locations')
            .expect(404);
    });

    test('should use error handler middleware', async () => {
        const testApp = await app;
        const errorMiddlewares = testApp._router.stack
            .filter(layer => layer.handle.length === 4);

        expect(errorMiddlewares.length).toBeGreaterThan(0);
    });

    test('should return 404 for unknown routes', async () => {
        const testApp = await app;
        const response = await request(testApp)
            .get('/non-existent-route')
            .expect(404);

        expect(response.body).toHaveProperty('message', 'Not Found');
    });

    test('should handle errors properly', async () => {
        const testApp = await app;
        // Force an error in a test route
        testApp.get('/test-error', () => {
            throw new Error('Test error');
        });

        const response = await request(testApp)
            .get('/test-error')
            .expect(500);

        expect(response.body).toHaveProperty('message', 'Something went wrong!');
    });

    test('should start on correct port', async () => {
        const testApp = await app;
        server = testApp.listen(process.env.PORT);
        expect(server.address().port).toBe(parseInt(process.env.PORT));
    });
});