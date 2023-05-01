import { NextFunction, Request, Response, Router } from 'express';
import { getBible, getBibles } from '../controllers/bibleController';
const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction): void => {
    void getBibles(req, res).catch(next);
});

router.get('/:bibleId', (req: Request, res: Response, next: NextFunction): void => {
    void getBible(req, res).catch(next);
});

export default router;