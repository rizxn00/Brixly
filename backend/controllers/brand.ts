import { Request, Response } from 'express';
import BrandModel from '../models/brand';
import * as XLSX from 'xlsx';
import path from 'path';

export const getAllBrands = async (req: Request, res: Response): Promise<Response> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';
    if (req.query.isFeatured !== undefined) filter.isFeatured = req.query.isFeatured === 'true';
    if (req.query.country) filter.country = new RegExp(req.query.country as string, 'i');
    if (req.query.category) filter.categories = { $in: [req.query.category] };

    const brands = await BrandModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await BrandModel.countDocuments(filter);

    return res.json({
      status: 'success',
      data: brands,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: 'Error fetching brands', error: error.message });
  }
};

export const getBrandById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const brand = await BrandModel.findById(req.params.id);
    if (!brand) return res.status(404).json({ status: 'error', message: 'Brand not found' });
    return res.json({ status: 'success', data: brand });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: 'Error fetching brand', error: error.message });
  }
};

export const createBrand = async (req: Request, res: Response): Promise<Response> => {
  try {
    const slug = req.body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const brand = new BrandModel({ ...req.body, slug });
    await brand.save();
    return res.status(201).json({ status: 'success', message: 'Brand created successfully', data: brand });
  } catch (error: any) {
    const message = error.code === 11000 ? 'Brand name or slug already exists' : 'Error creating brand';
    return res.status(400).json({ status: 'error', message, error: error.message });
  }
};

export const updateBrand = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (req.body.name) req.body.slug = req.body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const brand = await BrandModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!brand) return res.status(404).json({ status: 'error', message: 'Brand not found' });
    return res.json({ status: 'success', message: 'Brand updated successfully', data: brand });
  } catch (error: any) {
    return res.status(400).json({ status: 'error', message: 'Error updating brand', error: error.message });
  }
};

export const deleteBrand = async (req: Request, res: Response): Promise<Response> => {
  try {
    const brand = await BrandModel.findByIdAndDelete(req.params.id);
    if (!brand) return res.status(404).json({ status: 'error', message: 'Brand not found' });
    return res.json({ status: 'success', message: 'Brand deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: 'Error deleting brand', error: error.message });
  }
};

export const searchBrands = async (req: Request, res: Response): Promise<Response> => {
  try {
    const query = req.params.query;
    const brands = await BrandModel.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { categories: { $regex: query, $options: 'i' } },
        { specialties: { $regex: query, $options: 'i' } }
      ]
    }).limit(20);
    return res.json({ status: 'success', data: brands });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: 'Error searching brands', error: error.message });
  }
};

export const uploadBrandsExcel = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.file) return res.status(400).json({ status: 'error', message: 'No file uploaded' });

    const workbook = XLSX.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const brands = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i] as any;
      try {
        const slug = row.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const brand = new BrandModel({ ...row, slug });
        await brand.save();
        brands.push(brand);
      } catch (err: any) {
        errors.push({ row: i + 1, error: err.message });
      }
    }

    return res.json({
      status: 'success',
      message: `${brands.length} brands uploaded successfully`,
      data: { created: brands.length, errors: errors.length, errorDetails: errors }
    });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: 'Error uploading brands', error: error.message });
  }
};

// Other utility functions like getBrandsByCategory, getBrandsByCountry, exportBrandsToExcel, etc. can be refactored similarly
