import { Router } from 'express';
const router: Router = Router();
import { login, register } from '../controllers/sharedController';

router.post('/login', login);
router.post('/register', register);

export default router;  