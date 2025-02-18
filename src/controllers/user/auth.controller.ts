import { Request, Response } from 'express';
import { AuthService } from '../../services/user/auth.service';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async sendOTP(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      
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
}