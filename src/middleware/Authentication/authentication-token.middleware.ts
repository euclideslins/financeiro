import { NextFunction, Request, Response } from 'express';
import jsonwebToken from 'jsonwebtoken';
import { unauthorizedHandler } from '../../shared/errors/login.error';

export class AuthenticationTokenMiddleware {
    public use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const clearToken = token.replace('Bearer ', '');

        jsonwebToken.verify(clearToken, process.env.JWT_SECRET as string, (err, decoded) => {
            if (err) {
                console.log(err);

                return unauthorizedHandler(req, res);
            }

            req.user = decoded
            next();
        });
    }
}