import express, { Request, Response, Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  uploadProductsExcel,
  searchProductsPrompt
} from '../controllers/product';




import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() }); // Use memory instead of disk

const router: Router = express.Router();

router.post('/create', async (req: Request, res: Response) => {
    await createProduct(req, res);
});

router.get('/get', async (req: Request, res: Response) => {
    await getAllProducts(req, res);
});

router.get('/get/:id', async (req: Request, res: Response) => {
    await getProductById(req, res);
});

router.post('/upload/excel', upload.single('file'), async (req: Request, res: Response) => {
  await uploadProductsExcel(req, res);
});;

router.post('/search', async (req: Request, res: Response) => {
  await searchProductsPrompt(req, res);
});



export default router;
