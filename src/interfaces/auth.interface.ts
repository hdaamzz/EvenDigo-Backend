

export interface IUser {
    _id?: string;
    name:string;
    email:string;
    password:string;
    dateOfBirth?:Date;
    role?:string;
    phone?:string;
    profileImg?:string;
    gender?:string;
    status?:string;
}
  
export interface IOtpData {
    email: string;
    otp: string;
    userData: IUser;
}

export interface RegistrationResponse {
    success: boolean;
    message: string;
    data: {
      userId: string | undefined;
      email: string;
    };
  }

 export interface ServiceResponse<T = undefined> {
    success: boolean;
    message: string;
    data?: T;
  }
  
 export interface OTPVerificationData {
    userId: string | undefined;
    email: string;
  }