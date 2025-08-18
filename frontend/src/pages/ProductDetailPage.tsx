import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Heart,
    Share2,
    MoreHorizontal,
    Star,
    ChevronDown,
    ChevronUp,
    Bookmark,
    Award,
    User,
    X
} from 'lucide-react';

// Define a type for the product data for better type safety and code completion.
interface Product {
    id?: string;
    _id?: string;
    images?: string[];
    image?: string; // Fallback for single image
    title?: string;
    name?: string;
    brandName?: string;
    brand?: string;
    category?: string;
    rating?: number | string;
    price?: number;
    currency?: string;
    description?: string;
    isAvailable?: boolean;
    locations?: string[];
    specifications?: string[];
    materialUsed?: string[];
    // Add other potential fields from your API
    [key: string]: any;
}

type SectionType = 'description' | 'size' | 'material' | null;

export default function ProductDetailPage() {
    const [expandedSection, setExpandedSection] = useState<SectionType>('description');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const location = useLocation();
    const navigate = useNavigate();
    
    // Safely get product from location state and assert its type
    const product: Product | undefined = location.state?.product;

    // Redirect to home if no product data is found
    useEffect(() => {
        if (!product) {
            navigate('/');
        }
    }, [product, navigate]);

    // Render a loading/error state while waiting for redirection
    if (!product) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <p className="text-gray-400">Loading product or redirecting...</p>
            </div>
        );
    }

    const images = (product.images && product.images.length > 0) ? product.images : (product.image ? [product.image] : []);
    const ratingValue = product.rating ? parseFloat(String(product.rating)).toFixed(1) : null;

    const toggleSection = (section: SectionType) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    // --- Handlers for Image Gallery ---
    const goToPrevious = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    const goToNext = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
    const handleTouchStart = (e: React.TouchEvent) => touchStartX.current = e.changedTouches[0].screenX;
    const handleTouchMove = (e: React.TouchEvent) => touchEndX.current = e.changedTouches[0].screenX;
    const handleTouchEnd = () => {
        const swipeDistance = touchEndX.current - touchStartX.current;
        if (swipeDistance > 50) goToPrevious();
        else if (swipeDistance < -50) goToNext();
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            {/* --- Header --- */}
            <header className="fixed top-0 left-0 right-0 z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
                <button onClick={() => navigate(-1)} className="p-2 bg-black/30 rounded-full backdrop-blur-sm">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-semibold absolute left-1/2 -translate-x-1/2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[50%]">
                    {product.title || product.name}
                </h1>
                <div className="flex items-center gap-2">
                    <button className="p-2 bg-black/30 rounded-full backdrop-blur-sm"><Heart className="w-5 h-5" /></button>
                    <button className="p-2 bg-black/30 rounded-full backdrop-blur-sm"><Share2 className="w-5 h-5" /></button>
                    <button className="p-2 bg-black/30 rounded-full backdrop-blur-sm"><MoreHorizontal className="w-5 h-5" /></button>
                </div>
            </header>

            <main>
                {/* --- Product Image Gallery --- */}
                <div 
                    className="relative w-full h-[60vh] bg-gray-900"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onClick={() => setIsPreviewOpen(true)}
                >
                    {images.length > 0 ? (
                        <img
                            src={images[currentImageIndex]}
                            alt={product.title || product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                    )}

                    {/* Overlays */}
                    <div className="absolute top-20 left-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                        {product.category || 'General'}
                    </div>
                    {ratingValue && (
                        <div className="absolute top-20 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                            <Star size={12} className="text-yellow-400 fill-yellow-400" />
                            <span>{ratingValue}</span>
                        </div>
                    )}

                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {images.map((_, index) => (
                            <div key={index} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`} />
                        ))}
                    </div>
                </div>

                {/* --- Product Info Section --- */}
                <div className="p-4 space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold">{product.title || product.name}</h2>
                        <p className="text-gray-400 mt-1">{product.brandName || product.brand}</p>
                    </div>
                    <p className="text-2xl font-bold text-orange-400">
                        {product.currency === 'INR' ? '₹' : '$'}{product.price || 'N/A'}/sq ft
                    </p>

                    <div className="flex items-center justify-between text-sm bg-gray-900 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="font-semibold text-green-400">{product.isAvailable ? 'In Stock' : 'Out of Stock'}</span>
                        </div>
                        <span className="text-gray-400">
                            {product.locations ? product.locations.join(', ') : 'Bengaluru'}
                        </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center text-xs">
                        <InfoChip icon={Bookmark} label="Save for later" />
                        <InfoChip icon={Award} label="Value for money" />
                        <InfoChip icon={User} label="Profile" />
                    </div>
                </div>

                {/* --- Expandable Sections --- */}
                <div className="p-4 space-y-2">
                    <ExpandableSection
                        title="Description"
                        content={[product.description || "No description available."]}
                        section="description"
                        expandedSection={expandedSection}
                        toggleSection={toggleSection}
                    />
                    <ExpandableSection
                        title="Product Size"
                        content={product.specifications || ["Size information not available."]}
                        section="size"
                        expandedSection={expandedSection}
                        toggleSection={toggleSection}
                    />
                     <ExpandableSection
                        title="Material Used"
                        content={product.materialUsed || ["Material information not available."]}
                        section="material"
                        expandedSection={expandedSection}
                        toggleSection={toggleSection}
                    />
                </div>
                
                {/* --- Action Button --- */}
                <div className="p-4 sticky bottom-0">
                    <button
                        onClick={() => navigate('/dealers-list')}
                        className="w-full bg-orange-500 text-black py-4 rounded-xl font-bold text-base hover:bg-orange-600 transition-colors"
                    >
                        Contact Dealer
                    </button>
                </div>
            </main>
            
            {/* --- Image Preview Modal --- */}
            {isPreviewOpen && images.length > 0 && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={() => setIsPreviewOpen(false)}>
                    <button onClick={(e) => { e.stopPropagation(); setIsPreviewOpen(false); }} className="absolute top-4 right-4 z-10 p-2 bg-white/20 rounded-full">
                        <X className="w-6 h-6 text-white" />
                    </button>
                    <div className="relative w-full max-w-4xl p-4" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={images[currentImageIndex]}
                            alt="Product Preview"
                            className="w-full h-auto max-h-[85vh] object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper component for info chips
const InfoChip: React.FC<{ icon: React.ElementType, label: string }> = ({ icon: Icon, label }) => (
    <div className="bg-gray-900 p-3 rounded-lg flex flex-col items-center gap-2">
        <Icon className="w-5 h-5 text-gray-400" />
        <span className="text-gray-300">{label}</span>
    </div>
);

// Restyled Expandable Section component
interface ExpandableSectionProps {
    title: string;
    content: string[];
    section: SectionType;
    expandedSection: SectionType;
    toggleSection: (section: SectionType) => void;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({ title, content, section, expandedSection, toggleSection }) => {
    const isOpen = expandedSection === section;
    return (
        <div className="bg-gray-900 rounded-lg">
            <button
                onClick={() => toggleSection(section)}
                className="flex items-center justify-between w-full text-left p-4"
            >
                <span className="text-base font-semibold text-white">{title}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {isOpen && (
                <div className="px-4 pb-4 text-gray-400 text-sm space-y-2">
                    {content.map((line, index) => (
                        <p key={index}>{line}</p>
                    ))}
                </div>
            )}
        </div>
    );
};
