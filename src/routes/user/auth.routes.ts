import { Router } from 'express';
import { AuthController } from '../../controllers/user/auth.controller';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/send-otp', (req, res) => authController.sendOTP(req, res));
authRouter.post('/verify-otp', (req, res) => authController.verifyOTP(req, res));

export default authRouter;
