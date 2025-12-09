import logger from "../config/Logger.js";

export const requestLogger = (req, res, next) => {
    logger.info(`Incoming Request: ${req.method} ${req.url} - IP: ${req.ip}`);
    next();
};