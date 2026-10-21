export const errorMiddleware = (err, req, res, next) => {
    // 1. Log the error (for debugging)
    console.error(`[ERROR] ${new Date().toISOString()}`);
    console.error(`  Method: ${req.method}`);
    console.error(`  Path: ${req.originalUrl}`);
    console.error(`  Message: ${err.message}`);
    console.error(`  Stack: ${err.stack}`);
    
    // 2. Determine status code (default 500)
    const statusCode = err.statusCode || 500;
    
    // 3. Send error response
    res.status(statusCode).json({
      success: false,
      error: {
        message: err.message,
        statusCode: statusCode,
        timestamp: new Date().toISOString()
      }
    });
  };
  