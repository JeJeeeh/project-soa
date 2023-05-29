import { NextFunction, Request, Response, Router } from 'express';
import middlewares from '../middlewares';
import { getBook, getBooks } from '../controllers/bookController';
const router: Router = Router();

router.get('/:bibleId/books', middlewares.hasValidBearerToken, (req: Request, res: Response, next: NextFunction): void => {
    void getBooks(req, res).catch(next);
});

router.get('/:bibleId/books/:bookId', middlewares.hasValidBearerToken, (req: Request, res: Response, next: NextFunction): void => {
    void getBook(req, res).catch(next);
});

export default router;