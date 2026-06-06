import { Router } from 'express';
import { authMiddleware } from '../../../middleware/auth.middleware';
import {
    getProductsHandler,
    getProductByIdHandler,
    createProductHandler,
    updateProductHandler,
    deleteProductHandler,
} from '../controllers/product.controller';

const router = Router({ mergeParams: true }); // mergeParams es clave aquí

router.use(authMiddleware);

router.get('/', getProductsHandler);
router.get('/:productId', getProductByIdHandler);
router.post('/', createProductHandler);
router.put('/:productId', updateProductHandler);
router.delete('/:productId', deleteProductHandler);

export default router;