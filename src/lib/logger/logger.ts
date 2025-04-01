import ansis from 'ansis';

enum LogEnum {
  INFO = 'INFO',
  ERROR = 'ERROR',
  WARN = 'WARN',
}

const colorText = (logLevel: LogEnum) => {
  if (logLevel === LogEnum.INFO) {
    return ansis.blue(logLevel);
  }
  if (logLevel === LogEnum.WARN) {
    return ansis.yellow(logLevel);
  }
  if (logLevel === LogEnum.ERROR) {
    return ansis.red(logLevel);
  }
};

type LoggingParams = {
  logLevel: LogEnum;
  message: string;
  details?: { [key: string]: any };
};
const logging = (params: LoggingParams) => {
  const { logLevel, message, details } = params || {};
  const date = new Date().toUTCString();
  const output = `[${date}] [${colorText(logLevel)}] - ${message} ${
    details ? '- Details:' : ''
  }`;
  console.log(output);
  details && console.log(JSON.stringify(details, null, 2));
};

export const logger = {
  /**
   * outputs into console with formatted date time and blue INFO tag
   * @param {string} message
   * @param {{ [key: string]: any } | undefined} details
   * @returns {void}
   */
  info: (message: string, details?: { [key: string]: any }): void => {
    logging({ logLevel: LogEnum.INFO, message, details });
  },

  /**
   * outputs into console with formatted date time and yellow WARN tag
   * @param {string} message
   * @param {{ [key: string]: any } | undefined} details
   * @returns {void}
   */
  warn: (message: string, details?: { [key: string]: any }): void => {
    logging({ logLevel: LogEnum.WARN, message, details });
  },

  /**
   * outputs into console with formatted date time and red ERROR tag
   * @param {string} message
   * @param {{ [key: string]: any } | undefined} details
   * @returns {void}
   */
  error: (message: string, details?: { [key: string]: any }): void => {
    logging({ logLevel: LogEnum.ERROR, message, details });
  },
};
