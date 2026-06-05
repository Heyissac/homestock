import { Router } from 'express';
import { authMiddleware } from '../../../middleware/auth.middleware';
import {
    createSpaceHandler,
    getUserSpacesHandler,
    getSpaceByIdHandler,
    updateSpaceHandler,
    deleteSpaceHandler,
} from '../controllers/space.controller';

const router = Router();

router.use(authMiddleware);

router.post('/', createSpaceHandler);
router.get('/', getUserSpacesHandler);
router.get('/:id', getSpaceByIdHandler);
router.put('/:id', updateSpaceHandler);
router.delete('/:id', deleteSpaceHandler);

export default router;