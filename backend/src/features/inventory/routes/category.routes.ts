import { Router } from 'express';
import { authMiddleware } from '../../../middleware/auth.middleware';
import {
    getCategoriesHandler,
    createCategoryHandler,
    updateCategoryHandler,
    deleteCategoryHandler,
} from '../controllers/category.controller';

const router = Router({ mergeParams: true });

router.use(authMiddleware);

router.get('/', getCategoriesHandler);
router.post('/', createCategoryHandler);
router.put('/:categoryId', updateCategoryHandler);
router.delete('/:categoryId', deleteCategoryHandler);

export default router;