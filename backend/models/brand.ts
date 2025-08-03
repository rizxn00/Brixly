import { Schema, model, Document, Types } from "mongoose";

export interface IBrand extends Document {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  establishedYear?: number;
  country?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  
  // Social Media
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  
  // Brand Status
  isActive: boolean;
  isFeatured: boolean;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  slug: string;
  
  // Brand Categories
  categories: string[];
  specialties: string[];
  
  // Business Info
  businessType?: string;
  registrationNumber?: string;
  taxId?: string;
  
  // Brand Stats
  totalProducts: number;
  averageRating: number;
  reviewCount: number;
}

const BrandSchema = new Schema<IBrand>({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  logo: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  establishedYear: {
    type: Number,
    min: 1800,
    max: new Date().getFullYear()
  },
  country: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    trim: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  
  // Social Media
  socialMedia: {
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    linkedin: { type: String }
  },
  
  // Brand Status
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // SEO
  metaTitle: { type: String },
  metaDescription: { type: String },
  keywords: {
    type: [String],
    default: []
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  
  // Brand Categories
  categories: {
    type: [String],
    default: []
  },
  specialties: {
    type: [String],
    default: []
  },
  
  // Business Info
  businessType: {
    type: String,
    enum: ['Manufacturer', 'Distributor', 'Retailer', 'Private Label', 'Other']
  },
  registrationNumber: { type: String },
  taxId: { type: String },
  
  // Brand Stats
  totalProducts: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better performance
BrandSchema.index({ name: 1 });
BrandSchema.index({ slug: 1 });
BrandSchema.index({ isActive: 1 });
BrandSchema.index({ isFeatured: 1 });
BrandSchema.index({ categories: 1 });
BrandSchema.index({ country: 1 });
BrandSchema.index({ createdAt: -1 });

const BrandModel = model<IBrand>("brands", BrandSchema);

export default BrandModel;