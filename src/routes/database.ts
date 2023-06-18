import { Router, Response, Request } from 'express';
import { seed, seedDailyBread } from '../controllers/databaseController';
const router: Router = Router();

router.post('/seed', (req: Request, res: Response): void => {
  void seed(req, res);
});

router.post('/seeddailybread', (req: Request, res: Response): void => {
  void seedDailyBread(req, res);
});

export default router;