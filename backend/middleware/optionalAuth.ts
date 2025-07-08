// middleware/optionalAuth.ts
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

const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies?.auth_access_token
    if (!token) {
        return next();
    }

    try {
        const decoded = verifyAccessToken(token);
        if (!decoded) {
            res.status(401).json({ status: "error", message: 'Token invalid or expired' });
            return;
        }
        req.user = decoded;
        return next();
    } catch (err) {
        return next();
    }
};

export default optionalAuth;
