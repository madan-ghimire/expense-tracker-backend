import winston from "winston";
import path from "path";
import fs from "fs";

// Ensure logs directory exists
const logDir = path.resolve("logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const { combine, timestamp, printf } = winston.format;

const logger = winston.createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
    new winston.transports.Console(),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, "exception.log"),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, "rejections.log"),
    }),
  ],
});

export default logger;
