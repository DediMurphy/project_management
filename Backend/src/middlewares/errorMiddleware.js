import sendResponse from "./responseFormatter.js";

export const errorHandler = (err, req, res, next) => {
    console.log(err.stack);

    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

    sendResponse(res, {
        statusCode,
        success: false,
        message: err.message || 'Internal Server Error',
        data: process.env.NODE_ENV === 'production' ? null : { stack: err.stack },
    });    
}

export const NotFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
}