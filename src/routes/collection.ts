import { Router, Response, Request } from 'express';
const router: Router = Router();
import middlewares from '../middlewares';

router.get('/', middlewares.hasValidBearerToken, (req: Request, res: Response) => {
    res.send(res.locals.user);
});

export default router;