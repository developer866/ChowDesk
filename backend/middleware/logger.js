
// ANSI color codes — no extra dependency needed
const colors = {
  reset:  "\x1b[0m",
  gray:   "\x1b[90m",
  green:  "\x1b[32m",
  yellow: "\x1b[33m",
  red:    "\x1b[31m",
  blue:   "\x1b[34m",
  cyan:   "\x1b[36m",
};

// Color the HTTP method based on what it does
const methodColor = (method) => {
  switch (method) {
    case "GET":    return colors.blue;
    case "POST":   return colors.green;
    case "PATCH":
    case "PUT":    return colors.yellow;
    case "DELETE": return colors.red;
    default:       return colors.reset;
  }
};

// Color the status code based on success/failure
const statusColor = (status) => {
  if (status >= 500) return colors.red;
  if (status >= 400) return colors.yellow;
  if (status >= 300) return colors.cyan;
  return colors.green;
};

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();

    const method = req.method.padEnd(6);
    const url = req.originalUrl;
    const status = res.statusCode;

    console.log(
      `${colors.gray}[${timestamp}]${colors.reset} ` +
      `${methodColor(req.method)}${method}${colors.reset} ` +
      `${url}  ` +
      `${statusColor(status)}${status}${colors.reset}  ` +
      `${colors.gray}${duration}ms${colors.reset}`
    );
  });

  next();
};