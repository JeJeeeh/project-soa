import { Router, Response, Request, NextFunction } from 'express';
const router: Router = Router();
import middlewares from '../middlewares';
import { addCollection, getAllCollection, getSingleCollection, editCollection, deleteCollection } from '../controllers/collectionController';

router.get('/', middlewares.hasValidBearerToken, (req: Request, res: Response, next: NextFunction) => {
    void getAllCollection(req, res).catch(next);
});


router.post('/', middlewares.hasValidBearerToken, (req: Request, res: Response, next: NextFunction) => {
    void addCollection(req, res).catch(next);
});

router.get('/:id', middlewares.hasValidBearerToken, (req: Request, res: Response, next: NextFunction) => {
    void getSingleCollection(req, res).catch(next);
});

router.put('/:id', middlewares.hasValidBearerToken, (req: Request, res: Response, next: NextFunction) => {
    void editCollection(req, res).catch(next);
});

router.delete('/:id', middlewares.hasValidBearerToken, (req: Request, res: Response, next: NextFunction) => {
    void deleteCollection(req, res).catch(next);
});

export default router;
