import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  let token;

  // Check if the authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract the token from the 'Bearer <token>' string
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the secret from the .env file
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the decoded user ID to the request object
      req.user = { id: decoded.id };
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};