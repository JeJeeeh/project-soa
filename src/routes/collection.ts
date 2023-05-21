import { Router, Response, Request } from 'express';
const router: Router = Router();
import middlewares from '../middlewares';

router.get('/collections', middlewares.hasBearerToken, (req: Request, res: Response) => {
    res.send('collections');
});

export default router;