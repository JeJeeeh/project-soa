import { Router } from 'express';
const router = Router();
import { login, register } from '../controllers/sharedController';

router.post('/login', login);
router.post('/register', register)

module.exports = router;  