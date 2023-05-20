import { Router, Response, Request } from 'express';
import { seed } from '../controllers/databaseController';
const router: Router = Router();

router.post('/seed', (req: Request, res: Response): void => {
  void seed(req, res);
});

export default router;