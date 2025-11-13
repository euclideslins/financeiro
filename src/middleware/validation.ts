import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../types/User';

export const validateCreateUser = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    const response: ApiResponse<null> = {
      message: 'Invalid name',
      success: false,
      error: 'Name is required and must be a non-empty string'
    };
    res.status(400).json(response);
    return;
  }

  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    const response: ApiResponse<null> = {
      message: 'Invalid email',
      success: false,
      error: 'Email is required and must be a valid email address'
    };
    res.status(400).json(response);
    return;
  }

  if (!password || typeof password !== 'string' || !isValidPassword(password)) {
    const response: ApiResponse<null> = {
      message: 'Invalid password',
      success: false,
      error: 'Password is required and must be at least 6 characters long'
    };
    res.status(400).json(response);
    return;
  }

  next();
};

export const validateUpdateUser = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, password } = req.body;

  if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
    const response: ApiResponse<null> = {
      message: 'Invalid name',
      success: false,
      error: 'Name must be a non-empty string'
    };
    res.status(400).json(response);
    return;
  }

  if (email !== undefined && (typeof email !== 'string' || !isValidEmail(email))) {
    const response: ApiResponse<null> = {
      message: 'Invalid email',
      success: false,
      error: 'Email must be a valid email address'
    };
    res.status(400).json(response);
    return;
  }

  if (password !== undefined && (typeof password !== 'string' || !isValidPassword(password))) {
    const response: ApiResponse<null> = {
      message: 'Invalid password',
      success: false,
      error: 'Password must be at least 6 characters long'
    };
    res.status(400).json(response);
    return;
  }

  if (name === undefined && email === undefined && password === undefined) {
    const response: ApiResponse<null> = {
      message: 'No fields to update',
      success: false,
      error: 'At least one field (name, email or password) must be provided'
    };
    res.status(400).json(response);
    return;
  }

  next();
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateCreateCategory = (req: Request, res: Response, next: NextFunction): void => {
  const { name, kind } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    const response: ApiResponse<null> = {
      message: 'Invalid category name',
      success: false,
      error: 'Category name is required and must be a non-empty string'
    };
    res.status(400).json(response);
    return;
  }

  if (!kind || !['expense', 'income'].includes(kind)) {
    const response: ApiResponse<null> = {
      message: 'Invalid category kind',
      success: false,
      error: 'Category kind must be either "expense" or "income"'
    };
    res.status(400).json(response);
    return;
  }

  next();
};

export const validateUpdateCategory = (req: Request, res: Response, next: NextFunction): void => {
  const { name, kind } = req.body;

  if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
    const response: ApiResponse<null> = {
      message: 'Invalid category name',
      success: false,
      error: 'Category name must be a non-empty string'
    };
    res.status(400).json(response);
    return;
  }

  if (kind !== undefined && !['expense', 'income'].includes(kind)) {
    const response: ApiResponse<null> = {
      message: 'Invalid category kind',
      success: false,
      error: 'Category kind must be either "expense" or "income"'
    };
    res.status(400).json(response);
    return;
  }

  if (name === undefined && kind === undefined) {
    const response: ApiResponse<null> = {
      message: 'No fields to update',
      success: false,
      error: 'At least one field (name or kind) must be provided'
    };
    res.status(400).json(response);
    return;
  }

  next();
};
