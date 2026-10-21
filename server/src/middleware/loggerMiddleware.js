export const loggerMiddleware = (req, res, next) => {
    // 1. Record when request starts
    const startTime = Date.now();
    
    // 2. Log the incoming request
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    
    // 3. Capture the original res.json to log when response is sent
    const originalJson = res.json;
    
    res.json = function(data) {
      // 4. Calculate time taken
      const timeTaken = Date.now() - startTime;
      
      // 5. Log the response
      console.log(`[${new Date().toISOString()}] Method: ${req.method} Path: ${req.originalUrl} Status Code: ${res.statusCode} Latency: (${timeTaken}ms)`);
  
      // 6. Call the original res.json to actually send the response
      return originalJson.call(this, data);
    };
    
    // 7. Pass control to the next middleware or handler
    next();
  };
  