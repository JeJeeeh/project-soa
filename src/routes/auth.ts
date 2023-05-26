import { NextFunction, Request, Response, Router } from 'express';
const router: Router = Router();
import { login, register } from '../controllers/authController';

router.post('/login', (req: Request, res: Response, next: NextFunction): void => {
    void login(req, res).catch(next);
});
router.post('/register', (req: Request, res: Response, next: NextFunction): void => {
    void register(req, res).catch(next);
});

export default router;  