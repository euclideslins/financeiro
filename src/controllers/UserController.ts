import { NextFunction, Request, Response } from 'express';
import { AuthenticationService } from '../services/Authentication/authentication.service';
import { CreateUserService } from '../services/Users/create-user.service';
import { DeleteUserService } from '../services/Users/deleteUser.service';
import { GetUserService } from '../services/Users/getUser.service';
import { UpdateUserService } from '../services/Users/updateUser.service';
import { ApiResponse } from '../types/User';

export class UserController {
  private getUserService: GetUserService;
  private createUserService: CreateUserService;
  private updateUserService: UpdateUserService;
  private deleteUserService: DeleteUserService;
  private authenticationService: AuthenticationService;

  constructor() {
    this.getUserService = new GetUserService();
    this.createUserService = new CreateUserService();
    this.updateUserService = new UpdateUserService();
    this.deleteUserService = new DeleteUserService();
    this.authenticationService = new AuthenticationService();
  }

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.getUserService.getAllUsers();
      const response: ApiResponse<typeof users> = {
        data: users,
        message: 'Users retrieved successfully',
        success: true
      };
      res.json(response);
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      const response: ApiResponse<null> = {
        message: 'Failed to retrieve users',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  };

  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        const response: ApiResponse<null> = {
          message: 'Invalid user ID',
          success: false,
          error: 'User ID must be a number'
        };
        res.status(400).json(response);
        return;
      }

      const user = await this.getUserService.getUserById(id);

      if (!user) {
        const response: ApiResponse<null> = {
          message: 'User not found',
          success: false,
          error: 'No user found with the provided ID'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<typeof user> = {
        data: user,
        message: 'User retrieved successfully',
        success: true
      };
      res.json(response);
    } catch (error) {
      console.error('Error in getUserById:', error);
      const response: ApiResponse<null> = {
        message: 'Failed to retrieve user',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        const response: ApiResponse<null> = {
          message: 'Name, email and password are required',
          success: false,
          error: 'Missing required fields'
        };
        res.status(400).json(response);
        return;
      }

      const user = await this.createUserService.createUser({ name, email, password });
      const response: ApiResponse<typeof user> = {
        data: user,
        message: 'User created successfully',
        success: true
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const { name, email, password } = req.body;

      if (isNaN(id)) {
        const response: ApiResponse<null> = {
          message: 'Invalid user ID',
          success: false,
          error: 'User ID must be a number'
        };
        res.status(400).json(response);
        return;
      }

      const user = await this.updateUserService.updateUser(id, { name, email, password });

      if (!user) {
        const response: ApiResponse<null> = {
          message: 'User not found',
          success: false,
          error: 'No user found with the provided ID'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<typeof user> = {
        data: user,
        message: 'User updated successfully',
        success: true
      };
      res.json(response);
    } catch (error) {
      console.error('Error in updateUser:', error);
      const response: ApiResponse<null> = {
        message: 'Failed to update user',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        const response: ApiResponse<null> = {
          message: 'Invalid user ID',
          success: false,
          error: 'User ID must be a number'
        };
        res.status(400).json(response);
        return;
      }

      const deleted = await this.deleteUserService.deleteUser(id);

      if (!deleted) {
        const response: ApiResponse<null> = {
          message: 'User not found',
          success: false,
          error: 'No user found with the provided ID'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<null> = {
        message: 'User deleted successfully',
        success: true
      };
      res.json(response);
    } catch (error) {
      console.error('Error in deleteUser:', error);
      const response: ApiResponse<null> = {
        message: 'Failed to delete user',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  };

  loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        const response: ApiResponse<null> = {
          message: 'Email and password are required',
          success: false,
          error: 'Missing required fields'
        };
        res.status(400).json(response);
        return;
      }

      const user = await this.authenticationService.authenticateUser(email, password);

      if (!user) {
        const response: ApiResponse<null> = {
          message: 'Invalid credentials',
          success: false,
          error: 'Email or password is incorrect'
        };
        res.status(401).json(response);
        return;
      }

      const response: ApiResponse<typeof user> = {
        data: user,
        message: 'Login successful',
        success: true
      };
      res.json(response);
    } catch (error) {
      console.error('Error in loginUser:', error);
      const response: ApiResponse<null> = {
        message: 'Failed to authenticate user',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      res.status(500).json(response);
    }
  };
}
