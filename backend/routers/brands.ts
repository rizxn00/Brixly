import express, { Request, Response, Router } from 'express';
import {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  searchBrands,
//   getBrandsByCategory,
//   getBrandsByCountry,
//   getActiveBrands,
//   getFeaturedBrands,
//   uploadBrandsExcel,
//   downloadBrandTemplate,
//   exportBrandsToExcel,
//   bulkCreateBrands,
//   bulkUpdateBrands,
//   bulkDeleteBrands
} from '../controllers/brand';
// import { upload } from '../middleware/uploadMiddleware';
// import verifyTokenMiddleware from '../middleware/authVerification';

const router: Router = express.Router();

// Basic CRUD
router.get('/get', async (req: Request, res: Response) => {
  await getAllBrands(req, res);
});

router.get('/get/:id', async (req: Request, res: Response) => {
  await getBrandById(req, res);
});

router.post('/create', async (req: Request, res: Response) => {
  await createBrand(req, res);
});

router.put('/update/:id', async (req: Request, res: Response) => {
  await updateBrand(req, res);
});

router.delete('/delete/:id', async (req: Request, res: Response) => {
  await deleteBrand(req, res);
});

// Search & Filters
router.get('/search/:query', async (req: Request, res: Response) => {
  await searchBrands(req, res);
});

// router.get('/filter/category/:category', async (req: Request, res: Response) => {
//   await getBrandsByCategory(req, res);
// });

// router.get('/filter/country/:country', async (req: Request, res: Response) => {
//   await getBrandsByCountry(req, res);
// });

// router.get('/filter/active', async (req: Request, res: Response) => {
//   await getActiveBrands(req, res);
// });

// router.get('/filter/featured', async (req: Request, res: Response) => {
//   await getFeaturedBrands(req, res);
// });

// // Excel
// router.post('/upload/excel', async (req: Request, res: Response) => {
//   await uploadBrandsExcel(req, res);
// });

// router.get('/download/template', async (req: Request, res: Response) => {
//   await downloadBrandTemplate(req, res);
// });

// router.get('/export/excel', async (req: Request, res: Response) => {
//   await exportBrandsToExcel(req, res);
// });

// // Bulk Operations
// router.post('/bulk/create', async (req: Request, res: Response) => {
//   await bulkCreateBrands(req, res);
// });

// router.put('/bulk/update', async (req: Request, res: Response) => {
//   await bulkUpdateBrands(req, res);
// });

// router.delete('/bulk/delete', async (req: Request, res: Response) => {
//   await bulkDeleteBrands(req, res);
// });

export default router;
