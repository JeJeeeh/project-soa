import { NextFunction, Request, Response, Router } from 'express';
import { getVerse, getVerses } from '../controllers/verseController';

const router: Router = Router();

router.get('/:bibleId/chapters/:chapterId/verses', (req: Request, res: Response, next: NextFunction): void => {
    void getVerses(req, res).catch(next);
});

router.get('/:bibleId/verses/:verseId', (req: Request, res: Response, next: NextFunction): void => {
    void getVerse(req, res).catch(next);
});
  
export default router;