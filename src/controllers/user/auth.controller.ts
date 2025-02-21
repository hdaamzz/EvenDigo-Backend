import { Request, Response } from 'express';
import { AuthService } from '../../services/user/auth.service';
import { ILogin } from '../../interfaces/auth.interface';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async sendOTP(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      console.log("Param",name, email, password);
      
      const result = await this.authService.sendOTP({
        name,
        email,
        password
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP'
      });
    }
  }

  async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      
      
      const result = await this.authService.verifyOTP(email, otp);
      
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to verify OTP'
      });
    }
  }

  async verifyUser(req: Request, res: Response): Promise<void> {
    try {
      const loginData: ILogin = req.body;
      if (!loginData.email || !loginData.password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
        return;
      }
  
      const result = await this.authService.login(loginData);
      if (!result.success) {
        res.status(401).json(result);
        return;
      }
  
      
      const token = result.token;
  
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
      });
  
      res.status(200).json(result);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }



  isAuthenticated = (req: Request, res: Response): void => {
    if (!req.user) {
      res.status(401).json({
        isAuthenticated: false,
        message: 'User not authenticated'
      });
      return;
    }
  
    res.status(200).json({
      isAuthenticated: true,
      user: req.user
    });
  };

  isLogout = (_req: Request, res: Response): void => {
    try {
      res.clearCookie('token');
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to logout'
      });
    }
  };





}