import { Router } from 'express';
const router: Router = Router();
import { injectApiKey } from '../middlewares/middewares';

router.get('/bibles', injectApiKey, () => {
    console.log('bibles');
});

export default router;