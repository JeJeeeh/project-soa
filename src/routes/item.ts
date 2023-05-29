import { NextFunction, Request, Response, Router } from 'express';
import middlewares from '../middlewares';
import { addItem, deleteItem, getItems } from '../controllers/itemController';
const router: Router = Router();

router.get('/:collectionId/items', middlewares.hasValidBearerToken, (req: Request, res: Response, next: NextFunction): void => {
    void getItems(req, res).catch(next);
});

router.get('/:collectionId/items/:itemId', middlewares.hasValidBearerToken, (req: Request, res: Response, next: NextFunction): void => {
    // void getBook(req, res).catch(next);
});

router.post('/:collectionId/items', middlewares.hasValidBearerToken, (req: Request, res: Response, next: NextFunction): void => {
    void addItem(req, res).catch(next);
});

router.delete('/:collectionId/items/:itemId', middlewares.hasValidBearerToken, (req: Request, res: Response, next: NextFunction): void => {
    void deleteItem(req, res).catch(next);
});

export default router;