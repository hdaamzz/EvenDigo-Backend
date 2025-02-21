import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
interface AuthenticatedRequest extends Request {
  user?: any; 
}

export const authenticateToken = (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): void => {
  const token = req.cookies.token;
  
  if (!token) {
    res.status(401).json({
      isAuthenticated: false,
      message: 'No authentication token provided'
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({
      isAuthenticated: false,
      message: 'Invalid authentication token'
    });
  }
};