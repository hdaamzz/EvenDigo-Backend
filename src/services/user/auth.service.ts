import { AuthRepository } from '../../repositories/auth.repository';
import { generateOTP, hashPassword, sendEmail } from '../../utils/helpers';
import { IUser, OTPVerificationData, ServiceResponse } from '../../interfaces/auth.interface';
import { UserRepository } from '../../repositories/user.repository';

export class AuthService {
  private authRepository: AuthRepository;
  private userRepository: UserRepository;
  
  constructor() {
    this.authRepository = new AuthRepository();
    this.userRepository = new UserRepository();
  }

  async sendOTP(userData: IUser): Promise<{ success: boolean; message: string }> {
    try {
      const otp = generateOTP(); 
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        return {
          success: false,
          message: 'Email already registered'
        };
      }
      
      await this.authRepository.storeOTPData(userData.email, otp, userData);
      
      await sendEmail({
        to: userData.email,
        subject: 'Registration OTP',
        text: `Hi ${userData.name} ,  Your OTP for registration is: ${otp}`
      });
      
      
      return {
        success: true,
        message: 'OTP sent successfully'
      };
    } catch (error) {
      console.error('Send OTP error:', error);
      throw new Error('Failed to send OTP');
    }
  }

  async verifyOTP(email: string, otp: string): Promise<ServiceResponse<OTPVerificationData>> {
    try {
      const otpData = await this.authRepository.getOTPData(email);
      
      if (!otpData) {
        return {
          success: false,
          message: 'OTP expired or invalid'
        };
      }

      if (otpData.otp !== otp.toString()) {
        return {
          success: false,
          message: 'Invalid OTP'
        };
      }

      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        return {
          success: false,
          message: 'Email already registered'
        };
      }

      const hashedPassword = await hashPassword(otpData.userData.password);
      
      try {
        const user = await this.userRepository.createUser({
          ...otpData.userData,
          password: hashedPassword,
          role:"user",
        });

        
        await this.authRepository.deleteOTPData(email);
        
        return {
          success: true,
          message: 'Registration successful',
          data: {
            userId: user._id,
            email: user.email
          }
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
        return {
          success: false,
          message: errorMessage
        };
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      return {
        success: false,
        message: 'Failed to verify OTP'
      };
    }
  }
}