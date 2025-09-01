import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/User';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  const response: ApiResponse<null> = {
    message: 'Internal server error',
    success: false,
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  };

  res.status(500).json(response);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const response: ApiResponse<null> = {
    message: `Route ${req.originalUrl} not found`,
    success: false,
    error: 'The requested resource was not found'
  };
  
  res.status(404).json(response);
};
