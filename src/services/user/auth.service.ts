import { AuthRepository } from '../../repositories/auth.repository';
import { generateOTP, hashPassword, reHash, sendEmail } from '../../utils/helpers';
import { IAuthResponse, ILogin, IUser, OTPVerificationData, ServiceResponse } from '../../interfaces/auth.interface';
import { UserRepository } from '../../repositories/user.repository';
import * as jwt from 'jsonwebtoken';

export class AuthService {
  private authRepository: AuthRepository;
  private userRepository: UserRepository;
  
  constructor() {
    this.authRepository = new AuthRepository();
    this.userRepository = new UserRepository();
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
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
            email: user.email,
            name:user.name
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

  

  async login(credentials:ILogin):Promise<IAuthResponse>{
    const user = await this.userRepository.findByEmail(credentials.email);

    if(!user){
      return{
        success:false,
        message:"Invalid email or password"
      }
    }

    const isPasswordMatch= await reHash(credentials.password,user.password)
    if (!isPasswordMatch) {
      return {
        success: false,
        message: "Invalid email or password"
      };
    }

    await this.userRepository.updateLastLogin(user._id);

    const token= jwt.sign({
      userId:user._id,
      email:user.email,
      name:user.name
    },
      process.env.JWT_SECRET!,
        { expiresIn: '24h' }
    );

    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name
    };
    return {
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    };
  }
}