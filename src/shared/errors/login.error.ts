import { Request, Response } from "express";
import { ApiResponse } from "../../types/User";

export const unauthorizedHandler = (req: Request, res: Response): void => {
    const response: ApiResponse<null> = {
        message: `Unauthorized access to ${req.originalUrl}`,
        success: false,
        error: 'User is not authorized to access this resource'
    };

    res.status(401).json(response);
};