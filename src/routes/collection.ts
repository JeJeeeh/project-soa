import { Router, Response, Request } from 'express';
const router: Router = Router();
import { bearerToken } from '../middlewares/middewares';

router.get('/collections', bearerToken, (req: Request, res: Response) => {
    res.send('collections');
});

export default router;