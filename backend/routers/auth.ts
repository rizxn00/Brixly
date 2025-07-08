import express, { Request, Response, Router } from 'express';
import verifyTokenMiddleware from '../middleware/authVerification';
import { register, login, changePassword, getCurrentUser, logout, refreshToken } from '../controllers/auth';

const router: Router = express.Router();

// Auth Routes
router.post('/signup', async (req: Request, res: Response) => {
  await register(req, res);
});

router.post('/signin', async (req: Request, res: Response) => {
  await login(req, res);
});

router.post('/logout', async (req: Request, res: Response) => {
  await logout(req, res);
});

router.post('/refresh', async (req: Request, res: Response) => {
  await refreshToken(req, res);
});

router.post('/resetpassword', verifyTokenMiddleware(), async (req: Request, res: Response) => {
  await changePassword(req, res);
});

router.get('/me', verifyTokenMiddleware(), async (req: Request, res: Response) => {
  await getCurrentUser(req, res);
});

export default router;
