import { logger } from '.';

const mockAnsisRed = jest.fn();
const mockAnsisBlue = jest.fn();
const mockAnsisYellow = jest.fn();
jest.mock('ansis', () => ({
  red: (value: any) => mockAnsisRed(value),
  blue: (value: any) => mockAnsisBlue(value),
  yellow: (value: any) => mockAnsisYellow(value),
}));

describe('logger', () => {
  // cleanups
  const originalConsoleLog = console.log;
  afterAll(() => {
    console.log = originalConsoleLog;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  // mock constants
  const info = 'INFO';
  const warn = 'WARN';
  const error = 'ERROR';
  const mockLogMessage = 'test log';
  const mockJsonDetails = { mock: 'test' };
  const mockArrayDetails = ['mock', 'test'];
  const mockConsoleLog = jest.fn();
  console.log = mockConsoleLog;
  const mockDate = new Date('2020-01-01');
  const mockDateUtc = mockDate.toUTCString();
  jest.useFakeTimers().setSystemTime(mockDate);

  describe('logger.info', () => {
    test('console.log without details', () => {
      mockAnsisBlue.mockReturnValueOnce(info);
      logger.info(mockLogMessage);

      expect(mockAnsisRed).not.toHaveBeenCalled();
      expect(mockAnsisYellow).not.toHaveBeenCalled();
      expect(mockAnsisBlue).toHaveBeenCalledWith(info);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        `[${mockDateUtc}] [${info}] - ${mockLogMessage} `,
      );
    });

    test('console.log with json details', () => {
      mockAnsisBlue.mockReturnValueOnce(info);
      logger.info(mockLogMessage, mockJsonDetails);

      expect(mockAnsisRed).not.toHaveBeenCalled();
      expect(mockAnsisYellow).not.toHaveBeenCalled();
      expect(mockAnsisBlue).toHaveBeenCalledWith(info);
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        `[${mockDateUtc}] [${info}] - ${mockLogMessage} - Details:`,
      );
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        2,
        JSON.stringify(mockJsonDetails, null, 2),
      );
    });

    test('console.log with array details', () => {
      mockAnsisBlue.mockReturnValueOnce(info);
      logger.info(mockLogMessage, mockArrayDetails);

      expect(mockAnsisRed).not.toHaveBeenCalled();
      expect(mockAnsisYellow).not.toHaveBeenCalled();
      expect(mockAnsisBlue).toHaveBeenCalledWith(info);
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        `[${mockDateUtc}] [${info}] - ${mockLogMessage} - Details:`,
      );
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        2,
        JSON.stringify(mockArrayDetails, null, 2),
      );
    });
  });

  describe('logger.warn', () => {
    test('console.log without details', () => {
      mockAnsisYellow.mockReturnValueOnce(warn);
      logger.warn(mockLogMessage);

      expect(mockAnsisRed).not.toHaveBeenCalled();
      expect(mockAnsisBlue).not.toHaveBeenCalled();
      expect(mockAnsisYellow).toHaveBeenCalledWith(warn);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        `[${mockDateUtc}] [${warn}] - ${mockLogMessage} `,
      );
    });

    test('console.log with json details', () => {
      mockAnsisYellow.mockReturnValueOnce(warn);
      logger.warn(mockLogMessage, mockJsonDetails);

      expect(mockAnsisRed).not.toHaveBeenCalled();
      expect(mockAnsisBlue).not.toHaveBeenCalled();
      expect(mockAnsisYellow).toHaveBeenCalledWith(warn);
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        `[${mockDateUtc}] [${warn}] - ${mockLogMessage} - Details:`,
      );
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        2,
        JSON.stringify(mockJsonDetails, null, 2),
      );
    });

    test('console.log with array details', () => {
      mockAnsisYellow.mockReturnValueOnce(warn);
      logger.warn(mockLogMessage, mockArrayDetails);

      expect(mockAnsisRed).not.toHaveBeenCalled();
      expect(mockAnsisBlue).not.toHaveBeenCalled();
      expect(mockAnsisYellow).toHaveBeenCalledWith(warn);
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        `[${mockDateUtc}] [${warn}] - ${mockLogMessage} - Details:`,
      );
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        2,
        JSON.stringify(mockArrayDetails, null, 2),
      );
    });
  });

  describe('logger.error', () => {
    test('console.log without details', () => {
      mockAnsisRed.mockReturnValueOnce(error);
      logger.error(mockLogMessage);

      expect(mockAnsisYellow).not.toHaveBeenCalled();
      expect(mockAnsisBlue).not.toHaveBeenCalled();
      expect(mockAnsisRed).toHaveBeenCalledWith(error);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        `[${mockDateUtc}] [${error}] - ${mockLogMessage} `,
      );
    });

    test('console.log with json details', () => {
      mockAnsisRed.mockReturnValueOnce(error);
      logger.error(mockLogMessage, mockJsonDetails);

      expect(mockAnsisYellow).not.toHaveBeenCalled();
      expect(mockAnsisBlue).not.toHaveBeenCalled();
      expect(mockAnsisRed).toHaveBeenCalledWith(error);
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        `[${mockDateUtc}] [${error}] - ${mockLogMessage} - Details:`,
      );
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        2,
        JSON.stringify(mockJsonDetails, null, 2),
      );
    });

    test('console.log with array details', () => {
      mockAnsisRed.mockReturnValueOnce(error);
      logger.error(mockLogMessage, mockArrayDetails);

      expect(mockAnsisYellow).not.toHaveBeenCalled();
      expect(mockAnsisBlue).not.toHaveBeenCalled();
      expect(mockAnsisRed).toHaveBeenCalledWith(error);
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        `[${mockDateUtc}] [${error}] - ${mockLogMessage} - Details:`,
      );
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        2,
        JSON.stringify(mockArrayDetails, null, 2),
      );
    });
  });
});
