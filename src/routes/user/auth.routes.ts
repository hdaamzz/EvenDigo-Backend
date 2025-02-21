import { Router } from 'express';
import { AuthController } from '../../controllers/user/auth.controller';
import { authenticateToken } from '../../middlewares/auth.middleware';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/send-otp', (req, res) => authController.sendOTP(req, res));
authRouter.post('/verify-otp', (req, res) => authController.verifyOTP(req, res));
authRouter.post('/sign-in', (req, res) => authController.verifyUser(req, res));
authRouter.get('/status',authenticateToken,(req,res)=>authController.isAuthenticated(req,res))
authRouter.get('/logout',(req,res)=>authController.isLogout(req,res))

export default authRouter;
