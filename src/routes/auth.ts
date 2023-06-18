import { NextFunction, Request, Response, Router } from 'express';
const router: Router = Router();
import { login, logout, refreshToken, register, upgradeAccount } from '../controllers/authController';

router.post('/login', (req: Request, res: Response, next: NextFunction): void => {
    void login(req, res).catch(next);
});
router.post('/register', (req: Request, res: Response, next: NextFunction): void => {
    void register(req, res).catch(next);
});
router.get('/refresh-token', (req: Request, res: Response, next: NextFunction): void => {
    void refreshToken(req, res).catch(next);
});
router.get('/logout', (req: Request, res: Response, next: NextFunction): void => {
    void logout(req, res).catch(next);
});
router.put('/upgrade', (req: Request, res: Response, next: NextFunction): void => {
    void upgradeAccount(req, res).catch(next);
});

export default router;  