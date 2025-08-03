import { Schema, model, Document, Types } from "mongoose";

export interface IProduct extends Document {
    _id: Types.ObjectId;
    name: string;
    description: string;
    brandId: Types.ObjectId;
    category: string;
    subCategory?: string;
    brandName: string; // Optional, for easier search and display
    // Product Images
    images: string[];
    thumbnailImage: string;
    specifications?:  [String];
    // Product Specifications
    productSize: {
        length?: number;
        width?: number;
        height?: number;
        thickness?: number;
        unit: string;
    };

    materialUsed: string[];

    // Product Features
    easeOfAssemble: boolean;
    valueForMoney: boolean;
    productQuality: boolean;

    // Installation Details
    installationType: string;
    installationDifficulty: string;
    toolsRequired: string[];
    installationInstructions?: string;

    // Pricing
    basePrice: number;
    currency: string;
    discountPercentage?: number;
    discountedPrice?: number;
    priceUnit: string;

    // Inventory
    stock: number;
    lowStockThreshold: number;
    sku: string;
    barcode?: string;

    // Product Attributes
    colors: string[];
    finishes: string[];
    pattern?: string;
    style?: string;
    waterResistant?: boolean;
    scratchResistant?: boolean;
    stainResistant?: boolean;
    durability?: string;
    warranty?: string;

    // SEO and Marketing
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    slug: string;

    // Product Status
    status: string;
    isAvailable: boolean;
    isFeatured: boolean;

    // Ratings and Reviews
    averageRating: number;
    reviewCount: number;

    // Additional Info
    weight?: number;
    dimensions?: string;
    careInstructions?: string[];
    applicationAreas?: string[];
}

const ProductSchema = new Schema<IProduct>({
    name: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    brandId: {
        type: Schema.Types.ObjectId,
        ref: 'Brand',
    },
    brandName: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        trim: true
    },
    subCategory: {
        type: String,
        trim: true
    },

    // Product Images
    images: {
        type: [String],
    },
    thumbnailImage: {
        type: String,
    },

    // Product Specifications
    productSize: {
        length: { type: Number },
        width: { type: Number },
        height: { type: Number },
        thickness: { type: Number },
        unit: {
            type: String,
            default: 'cm'
        }
    },

    materialUsed: {
        type: [String],
    },

    // Product Features
    easeOfAssemble: {
        type: Boolean,
        default: false
    },
    valueForMoney: {
        type: Boolean,
        default: false
    },
    productQuality: {
        type: Boolean,
        default: false
    },

    // Installation Details
    installationType: {
        type: String,
        default: 'Standard'
    },
    installationDifficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    toolsRequired: {
        type: [String],
        default: []
    },
    installationInstructions: { type: String },

    // Pricing
    basePrice: {
        type: Number,
        min: 0
    },
    currency: {
        type: String,
        default: 'USD'
    },
    discountPercentage: {
        type: Number,
        min: 0,
        max: 100
    },
    discountedPrice: { type: Number },
    priceUnit: {
        type: String,
        default: 'per piece'
    },

    // Inventory
    stock: {
        type: Number,
        min: 0
    },
    lowStockThreshold: {
        type: Number,
        default: 10
    },
    sku: {
        type: String,
    },
    barcode: { type: String },

    // Product Attributes
    colors: {
        type: [String],
        default: []
    },
    finishes: {
        type: [String],
        default: []
    },
    pattern: { type: String },
    style: { type: String },
    waterResistant: { type: Boolean },
    scratchResistant: { type: Boolean },
    stainResistant: { type: Boolean },
    durability: { type: String },
    warranty: { type: String },
    specifications: {
        type: [String],
    },
        // default:""},
    // SEO and Marketing
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: {
        type: [String],
        default: []
    },
    slug: {
        type: String,
        unique: true
    },

    // Product Status
    status: {
        type: String,
        enum: ['active', 'inactive', 'discontinued', 'coming-soon'],
        default: 'active'
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },

    // Ratings and Reviews
    averageRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    },

    // Additional Info
    weight: { type: Number },
    dimensions: { type: String },
    careInstructions: {
        type: [String],
        default: []
    },
    applicationAreas: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

// Indexes for better performance
ProductSchema.index({ brandId: 1 });
ProductSchema.index({ category: 1, subCategory: 1 });
ProductSchema.index({ slug: 1 });
ProductSchema.index({ sku: 1 });
ProductSchema.index({ status: 1, isAvailable: 1 });
ProductSchema.index({ createdAt: -1 });

const ProductModel = model<IProduct>("products", ProductSchema);

export default ProductModel;