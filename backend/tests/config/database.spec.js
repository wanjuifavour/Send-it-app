const sql = require('mssql');
const { connectDB, executeStoredProcedure } = require('../config/database');

jest.mock('mssql');

describe('Database Config', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should connect to database successfully', async () => {
        sql.connect.mockResolvedValueOnce({});

        await connectDB();

        expect(sql.connect).toHaveBeenCalledWith(expect.objectContaining({
            user: process.env.DB_USER,
            database: process.env.DB_NAME
        }));
    });

    test('should handle connection errors', async () => {
        sql.connect.mockRejectedValueOnce(new Error('Connection failed'));

        await expect(connectDB()).rejects.toThrow();
    });

    test('should execute stored procedure with params', async () => {
        const mockRequest = {
            input: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValue({})
        };
        sql.connect.mockResolvedValueOnce({
            request: jest.fn(() => mockRequest)
        });

        await executeStoredProcedure('test_proc', { param1: 'value' });

        expect(mockRequest.input).toHaveBeenCalledWith('param1', expect.anything());
    });
});