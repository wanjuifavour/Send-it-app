const Queue = require('bull');
const nodemailer = require('nodemailer');
const emailQueue = require('../services/emailQueue');

jest.mock('bull');
jest.mock('nodemailer');

describe('Email Queue', () => {
    let mockAdd
    let mockProcess

    beforeEach(() => {
        mockAdd = jest.fn();
        mockProcess = jest.fn();
        Queue.mockImplementation(() => ({
            add: mockAdd,
            process: mockProcess
        }));
    });

    test('should add email job to queue', () => {
        const jobData = {
            to: 'test@test.com',
            subject: 'Test',
            html: '<p>Test</p>'
        };

        emailQueue.add(jobData);

        expect(mockAdd).toHaveBeenCalledWith(jobData);
    });

    test('should process email jobs', async () => {
        const mockSendMail = jest.fn().mockResolvedValue(true);
        nodemailer.createTransport.mockReturnValue({
            sendMail: mockSendMail
        });

        await emailQueue.process({
            data: {
                to: 'test@test.com',
                subject: 'Test',
                html: '<p>Test</p>'
            }
        });

        expect(mockSendMail).toHaveBeenCalled();
    });
});