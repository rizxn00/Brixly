  // middleware/authVerification.ts
  import { Request, Response, NextFunction } from 'express';
  import { verifyAccessToken } from '../services/tokenService';

  declare global {
    namespace Express {
      interface Request {
        user?: {
          id: string;
          email: string;
          username: string;
          isAdmin: boolean;
          [key: string]: any;
        };
      }
    }
  }

  const verifyTokenMiddleware = (requireAdmin: boolean = false) => 
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      let token = req.cookies.auth_access_token;

      if (!token) {
        res.status(401).json({ status: "error", message: 'Unauthorized' });
        return;
      }

      try {
        const decoded = verifyAccessToken(token);
        
        if (!decoded) {
          res.status(401).json({ status: "error", message: 'Token invalid or expired' });
          return;
        }

        if (requireAdmin && !decoded.isAdmin) {
          res.status(403).json({ status: "error", message: 'Forbidden: Admin access required' });
          return;
        }
        
        req.user = decoded;
        next();
      } catch (error) {
        res.status(401).json({ status: "error", message: 'Unauthorized' });
        return;
      }
    };

  export default verifyTokenMiddleware;