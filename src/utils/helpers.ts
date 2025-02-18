import bcryptjs from 'bcryptjs';
import nodemailer from 'nodemailer';

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
};

export const sendEmail = async ({ to, subject, text }: {
  to: string;
  subject: string;
  text: string;
}): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });  
  console.log(to,subject,text);
  
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    text
  });
  
};