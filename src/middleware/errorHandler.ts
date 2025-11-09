import { NextFunction, Request, Response } from 'express';
import { AppError } from '../shared/errors/AppError';
import { ApiResponse } from '../types/User';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', error);

  if (error instanceof AppError) {
    const response: ApiResponse<null> = {
      message: error.message,
      success: false,
      error: error.message
    };

    res.status(error.statusCode).json(response);
    return;
  }

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
