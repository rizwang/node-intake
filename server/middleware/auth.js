/**
 * Basic Authentication Middleware
 * 
 * Protects admin routes using HTTP Basic Auth.
 * Password is read from ADMIN_PASSWORD environment variable.
 */

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required. Use HTTP Basic Auth.'
    });
  }

  // Extract credentials from Basic Auth header
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return res.status(500).json({
      error: 'Server Error',
      message: 'Admin password not configured'
    });
  }

  // For simplicity, we accept any username but require correct password
  // In production, you'd validate username too
  if (password !== adminPassword) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid credentials'
    });
  }

  next();
}

