import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload & {
            userId?: unknown;
            role?: unknown;
        };

        if (typeof payload.userId !== 'number' || typeof payload.role !== 'string') {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = {
            userId: payload.userId,
            role: payload.role,
        };

        next();
    } catch (_err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};