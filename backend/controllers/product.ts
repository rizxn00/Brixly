import { Request, Response } from 'express';
import ProductModel from '../models/product';
import BrandModel from '../models/brand';
import * as XLSX from 'xlsx';
import { Types } from 'mongoose';

// Create Product
export const createProduct = async (req: Request, res: Response): Promise<Response> => {
    try {
        const slug = req.body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const product = new ProductModel({ ...req.body, slug });
        await product.save();

        return res.status(201).json({ status: 'success', message: 'Product created successfully', data: product });
    } catch (error: any) {
        return res.status(400).json({ status: 'error', message: 'Error creating product', error: error.message });
    }
};

// Get All Products
export const getAllProducts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const products = await ProductModel.find().populate('brandId');
        return res.status(200).json({ status: 'success', data: products });
    } catch (error: any) {
        return res.status(500).json({ status: 'error', message: 'Error fetching products', error: error.message });
    }
};

// Get Product by ID
export const getProductById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const product = await ProductModel.findById(req.params.id).populate('brandId');
        if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });
        return res.status(200).json({ status: 'success', data: product });
    } catch (error: any) {
        return res.status(500).json({ status: 'error', message: 'Error fetching product', error: error.message });
    }
};

// Bulk Upload Products from Excel (with brand name to ObjectId resolution)
export const uploadProductsExcel = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.file || !req.file.buffer) {
            res.status(400).json({ status: 'error', message: 'No file uploaded' });
            //   return;
        }

        const workbook = XLSX.read(req.file?.buffer, { type: 'buffer' });


        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet);

        const products: any[] = [];
        const errors: any[] = [];

        for (let i = 0; i < data.length; i++) {
            const row = data[i] as any;
            try {
                var brand = await BrandModel.findOne({ name: new RegExp(`^${row.brandName}$`, 'i') });

                if (!brand) {
                  try {
                const brandSlug = row.brandName?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                
                brand = new BrandModel({
                    name: row.brandName,
                    slug: brandSlug,
                    // Add any other required brand fields with default values
                    description: `Auto-generated brand for ${row.brandName}`,
                    isActive: true
                });
                
                await brand.save();
                console.log(`Created new brand: ${row.brandName}`);
            } catch (brandError: any) {
                errors.push({ row: i + 2, error: `Failed to create brand '${row.brandName}': ${brandError.message}` });
                continue;
            }
                }

                const slug = row.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

                const productData = {
                    ...row,
                    brandId: brand._id,
                    brandName: brand.name, // Store brand name for easier search
                    slug,
                    images: row.images ? row.images.split(',').map((img: string) => img.trim()) : [],
                    materialUsed: row.materialUsed ? row.materialUsed.split(',').map((m: string) => m.trim()) : [],
                    colors: row.colors ? row.colors.split(',').map((c: string) => c.trim()) : [],
                    finishes: row.finishes ? row.finishes.split(',').map((f: string) => f.trim()) : [],
                    careInstructions: row.careInstructions ? row.careInstructions.split(',').map((c: string) => c.trim()) : [],
                    applicationAreas: row.applicationAreas ? row.applicationAreas.split(',').map((a: string) => a.trim()) : [],
                    keywords: row.keywords ? row.keywords.split(',').map((k: string) => k.trim()) : [],
                    specifications: row.specifications ? row.specifications.split(';').map((s: string) => s.trim()):[],
                };

                const product = new ProductModel(productData);
                await product.save();
                products.push(product);
            } catch (err: any) {
                errors.push({ row: i + 2, error: err.message });
            }
        }

        return res.json({
            status: 'success',
            message: `${products.length} products uploaded successfully`,
            data: { created: products.length, errors: errors.length, errorDetails: errors }
        });
    } catch (error: any) {
        return res.status(500).json({ status: 'error', message: 'Error uploading products', error: error.message });
    }


};

// Update Product Images from Excel using Brand Name
export const updateProductImagesExcel = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ status: 'error', message: 'No file uploaded' });
        }

        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet);

        const updatedProducts: any[] = [];
        const errors: any[] = [];

        for (let i = 0; i < data.length; i++) {
            const row = data[i] as any;
            
            try {
                // Validate required fields
                if (!row.brandName || !row['Photo link']) {
                    errors.push({ 
                        row: i + 2, 
                        error: 'Brand name and Photo link are required' 
                    });
                    continue;
                }

                const photoLink = row['Photo link'].trim();
                const brandName = row.brandName.trim();

                // Find products directly by brandName field (case-insensitive)
                const products = await ProductModel.find({ 
                    brandName: new RegExp(`^${brandName}$`, 'i') 
                });

                if (products.length === 0) {
                    errors.push({ 
                        row: i + 2, 
                        error: `No products found with brand name '${brandName}'` 
                    });
                    continue;
                }

                let updatedCount = 0;

                // Update images for all products with this brand name
                for (const product of products) {
                    let isModified = false;

                    // Check if image already exists to avoid duplicates
                    if (!product.images.includes(photoLink)) {
                        product.images.push(photoLink);
                        isModified = true;
                    }
                    
                    // Set as thumbnail if none exists
                    if (!product.thumbnailImage) {
                        product.thumbnailImage = photoLink;
                        isModified = true;
                    }
                    
                    if (isModified) {
                        await product.save();
                        updatedCount++;
                    }
                }

                updatedProducts.push({
                    brandName: brandName,
                    photoLink: photoLink,
                    totalProducts: products.length,
                    productsUpdated: updatedCount
                });

            } catch (err: any) {
                errors.push({ 
                    row: i + 2, 
                    error: `Error processing row: ${err.message}` 
                });
            }
        }

        return res.json({
            status: 'success',
            message: `Images updated for ${updatedProducts.length} brand entries`,
            data: {
                processed: updatedProducts.length,
                errors: errors.length,
                updatedBrands: updatedProducts,
                errorDetails: errors
            }
        });

    } catch (error: any) {
        return res.status(500).json({ 
            status: 'error', 
            message: 'Error updating product images', 
            error: error.message 
        });
    }
};



// export const searchProductsPrompt = async (req: Request, res: Response): Promise<Response> => {
//     try {
//         const prompt = req.body.prompt?.toLowerCase();
//         if (!prompt || prompt.length < 3) {
//             return res.status(400).json({ status: 'error', message: 'Invalid or missing prompt' });
//         }

//         // Step 1: Remove common stopwords
//         const stopWords = new Set([
//             'i', 'need', 'a', 'an', 'the', 'with', 'and', 'or', 'for', 'to', 'from', 'in', 'on', 'of', 'by',
//             'that', 'this', 'those', 'these', 'is', 'are', 'was', 'were', 'it', 'as', 'at', 'be', 'have', 'has'
//         ]);
//         const words = prompt.match(/\w+/g) || [];
//         const keywords = words.filter((word: any) => !stopWords.has(word));

//         if (keywords.length === 0) {
//             return res.status(400).json({ status: 'error', message: 'No relevant keywords found in prompt' });
//         }

//         // Step 2: Fetch all products
//         const allProducts = await ProductModel.find();

//         // Step 3: Score each product based on keyword matches
//         const scoredResults = allProducts.map(product => {
//             let score = 0;
//             const searchableFields = [
//                 product.name,
//                 product.description,
//                 ...(product.keywords || []),
//                 product.category,
//                 product.subCategory,
//                 ...(product.colors || []),
//                 ...(product.finishes || []),
//                 product.style,
//                 product.pattern,
//                 product?.productSize?.unit
//             ];

//             for (const word of keywords) {
//                 for (const field of searchableFields) {
//                     if (field && field.toString().toLowerCase().includes(word)) {
//                         score += 1;
//                         break; // Count each keyword only once per product
//                     }
//                 }
//             }

//             return { product, score };
//         });

//         // Step 4: Filter and sort
//         const filtered = scoredResults
//             .filter(entry => entry.score > 0)
//             .sort((a, b) => b.score - a.score)
//             .slice(0, 20); // Limit results

//         return res.json({
//             status: 'success',
//             keywords,
//             results: filtered.map(entry => entry.product)
//         });
//     } catch (error: any) {
//         return res.status(500).json({ status: 'error', message: 'Search failed', error: error.message });
//     }
// };
export const searchProductsPrompt = async (req: Request, res: Response): Promise<Response> => {
  try {
    const prompt = req.body.prompt?.toLowerCase()?.trim();
    console.log('Prompt:', prompt);

    if (!prompt || prompt.length < 2) {
      return res.status(400).json({ status: 'error', message: 'Invalid or missing prompt' });
    }

    // More comprehensive stop words list
    const stopWords = new Set([
      'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 
      'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'will', 
      'with', 'would', 'or', 'but', 'if', 'then', 'else', 'when', 'where', 'why', 
      'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 
      'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 
      'very', 'can', 'will', 'just', 'should', 'now', 'am', 'i', 'me', 'my', 
      'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 
      'yourself', 'yourselves', 'him', 'his', 'himself', 'she', 'her', 'hers', 
      'herself', 'they', 'them', 'their', 'theirs', 'themselves', 'this', 'these',
      'those', 'what', 'which', 'who', 'whom', 'whose', 'been', 'being', 'have',
      'had', 'having', 'do', 'does', 'did', 'doing', 'get', 'got', 'getting'
    ]);

    // Function to check if a word is meaningful
    const isMeaningfulWord = (word: string): boolean => {
      // Remove punctuation and check length
      const cleanWord = word.replace(/[^\w]/g, '');
      return cleanWord.length >= 2 && !stopWords.has(cleanWord);
    };

    // Split prompt and filter meaningful words
    const words = prompt.split(/\s+/).filter((word:any) => word.length > 0);
    const meaningfulWords = words.filter(isMeaningfulWord);

    // Check if we have meaningful content
    if (meaningfulWords.length === 0) {
      return res.json({ 
        status: 'success', 
        results: [],
        message: 'Please provide more specific search terms related to products.',
        summary: {
          products: 0,
          total: 0
        }
      });
    }

    // Reconstruct search query with meaningful words
    const searchQuery = meaningfulWords.join(' ');

    // Additional validation for minimum search quality
    if (searchQuery.length < 2) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'Search query too short after filtering common words.' 
      });
    }

    // console.log('Original prompt:', prompt);
    // console.log('Filtered search query:', searchQuery);
    // console.log('Meaningful words found:', meaningfulWords.length);

    // Search products with filtered query
    const productResults = await ProductModel.aggregate([
      {
        $search: {
          index: 'default',
          text: {
            query: searchQuery,
            path: ['name', 'description', 'category','brandName','specifications','materialUsed','applicationAreas'],
            fuzzy: { maxEdits: 1 }
          }
        }
      },
      {
        $addFields: {
          type: 'product'
        }
      },
      { $limit: 10 }
    ]);

    const combinedResults = [...productResults];

    return res.json({ 
      status: 'success', 
      results: combinedResults,
      searchInfo: {
        originalQuery: prompt,
        processedQuery: searchQuery,
        meaningfulWords: meaningfulWords
      },
      summary: {
        products: productResults.length,
        total: combinedResults.length
      }
    });

  } catch (error: any) {
    console.error('Search failed:', error);
    return res.status(500).json({ status: 'error', message: 'Search failed', error: error.message });
  }
};



