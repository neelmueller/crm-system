import jwt, {JwtPayload} from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const authenticateHeader = req.headers.authorization;
    if (!authenticateHeader || !authenticateHeader.startsWith('Bearer ')){
        return res.status(401).json({ message: "Authorization header missing or malformed"});
    }
    const token = authenticateHeader.split(' ')[1];
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        (req as any).user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}