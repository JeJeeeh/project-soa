import { NextFunction, Request, Response, Router } from 'express';
import middlewares from '../middlewares';
import { getChapter, getChapters } from '../controllers/chapterController';
const router: Router = Router();

router.get('/:bibleId/books/:bookId/chapters', middlewares.hasValidBearerToken, middlewares.hasApiHits, (req: Request, res: Response, next: NextFunction): void => {
    void getChapters(req, res).catch(next);
});
router.get('/:bibleId/chapters/:chapterId', middlewares.hasValidBearerToken, middlewares.hasApiHits, (req: Request, res: Response, next: NextFunction): void => {
    void getChapter(req, res).catch(next);
});

export default router;