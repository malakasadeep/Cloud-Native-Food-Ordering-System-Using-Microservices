import  { verifyToken } from '../utils/jwt.js';

export const authenticate = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.access_token;

  if (cookieToken) {
    token = cookieToken;
  } else if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }

  try {
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};