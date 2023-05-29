import { NextFunction, Request, Response, Router } from 'express';
import hasValidBearerToken from '../middlewares/hasValidBearerToken';
import { getDailyBread } from '../controllers/dailybreadController';
const router: Router = Router();

router.get('/dailybread', hasValidBearerToken, (req: Request, res: Response, next: NextFunction): void => {
  void getDailyBread(req, res).catch(next);
});