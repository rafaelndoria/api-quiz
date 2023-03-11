import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthRequest extends Request {
    userId?: string;
    userEmail?: string;
}
  
export function Auth(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'not authorized' });
    }

    const [type, token] = authHeader.split(' ');
    
    if(type === 'Bearer') {
        try {
            const decodedToken = JWT.verify(token, process.env.JWT_SECRET_KEY as string) as { id: string, email: string };
            req.userId = decodedToken.id;
            req.userEmail = decodedToken.email;
            next();
        } catch (error) {
            return res.status(401).json({ error: 'invalid token' });
        }
    } else {
        return res.status(401).json({ error: 'only bearer type' });
    }
}
