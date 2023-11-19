import winston from 'winston';

const logLevels = {
  debug: 0,
  http: 1,
  info: 2,
  warning: 3,
  error: 4,
  fatal: 5,
};

winston.addColors({
  debug: 'blue',
  http: 'green',
  info: 'cyan',
  warning: 'yellow',
  error: 'red',
  fatal: 'magenta',
});

const developmentLogger = winston.createLogger({
  levels: logLevels,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console({ level: 'debug' })],
});

const productionLogger = winston.createLogger({
  levels: logLevels,
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'errors.log', level: 'error' }),
  ],
});

export { developmentLogger, productionLogger };
