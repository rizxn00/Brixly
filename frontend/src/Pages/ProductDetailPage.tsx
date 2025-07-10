import { useState, useRef } from 'react';
import { Menu, ChevronDown, ChevronUp, MoreHorizontal, X } from 'lucide-react';

export default function WoodenTileProductPage() {
    const [expandedSection, setExpandedSection] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const lastTap = useRef(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const images = [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1618221710640-bff7203d1bdb?w=1200&h=800&fit=crop'
    ];

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const openPreview = () => {
        setIsPreviewOpen(true);
    };

    const closePreview = () => {
        setIsPreviewOpen(false);
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.changedTouches[0].screenX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = () => {
        const swipeDistance = touchEndX.current - touchStartX.current;
        const SWIPE_THRESHOLD = 50;
        if (swipeDistance > SWIPE_THRESHOLD) {
            setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
        } else if (swipeDistance < -SWIPE_THRESHOLD) {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }
    };

    const handleImageClick = (event) => {
        const now = new Date().getTime();
        const DOUBLE_TAP_DELAY = 300;
        if (now - lastTap.current < DOUBLE_TAP_DELAY) {
            openPreview();
        } else {
            const rect = event.currentTarget.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const imageWidth = rect.width;
            if (clickX < imageWidth / 2) {
                setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
            } else {
                setCurrentImageIndex((prev) => (prev + 1) % images.length);
            }
        }
        lastTap.current = now;
    };

    const handleMoreOptionsClick = () => {
        console.log('More options clicked');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between p-4 md:p-6">
                    <Menu className="w-6 h-6 text-gray-700 cursor-pointer hover:text-gray-900 transition-colors" />
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer">
                        <span className="text-white text-sm font-medium">N</span>
                    </div>
                </div>
            </div>

            {/* Product Image */}
            <div className="relative max-w-7xl mx-auto">
                <div className="relative overflow-hidden rounded-b-lg group">
                    <img
                        src={images[currentImageIndex]}
                        alt={`Wooden Tile ${currentImageIndex + 1}`}
                        className="w-full h-80 md:h-96 object-cover cursor-pointer select-none 
                                 transition-all duration-500 ease-out
                                 group-hover:scale-110 group-hover:brightness-110
                                 transform-gpu"
                        onClick={handleImageClick}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        draggable={false}
                    />

                    {/* Overlay for enhanced hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                        {images.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex
                                        ? 'bg-white shadow-lg scale-125'
                                        : 'bg-gray-400 hover:bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* More Options Button */}
                    <button
                        onClick={handleMoreOptionsClick}
                        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg 
                                 hover:bg-white hover:scale-110 transition-all duration-300 z-10
                                 border border-white/20"
                        title="More options"
                    >
                        <MoreHorizontal className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Image Preview Modal */}
            {isPreviewOpen && (
                <div
                    className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 
                             transition-all duration-300 ease-out"
                    onClick={closePreview}
                >
                    <div className="relative max-w-5xl w-full p-4" onClick={(e) => e.stopPropagation()}>
                        <div className="relative overflow-hidden rounded-lg group">
                            <img
                                src={images[currentImageIndex]}
                                alt={`Wooden Tile Preview ${currentImageIndex + 1}`}
                                className="w-full h-auto max-h-[85vh] object-contain shadow-2xl cursor-pointer 
                                         transition-all duration-500 ease-out
                                         group-hover:scale-105 transform-gpu"
                                onClick={handleImageClick}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                draggable={false}
                            />
                        </div>

                        <button
                            onClick={closePreview}
                            className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg 
                                     hover:bg-white hover:scale-110 transition-all duration-300
                                     border border-white/20"
                        >
                            <X className="w-6 h-6 text-gray-600" />
                        </button>

                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {images.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex
                                            ? 'bg-white shadow-lg scale-125'
                                            : 'bg-gray-400 hover:bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Product Content */}
            <div className="max-w-7xl mx-auto bg-white rounded-t-3xl -mt-6 relative z-10 px-6 md:px-12 pt-8 pb-12">
                {/* Product Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Wooden Tile</h1>

                {/* Product Description */}
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8">
                    Neuro Wood is one of the largest branded global chain of premium bath and light solutions; hardware, closomatic,
                    doors, tiles, sanitaryware, and home decor. We are the comprehensive one's own bathroom and lighting concept
                    development, product design and production, marketing and support that help make direct concepts into reality.
                </p>

                {/* Tags */}
                <div className="flex gap-3 mb-10">
                    <span className="bg-gray-100 text-gray-600 py-1.5 px-4 rounded-full text-xs md:text-sm 
                                   hover:bg-gray-200 transition-colors cursor-pointer">
                        Ease of assemble
                    </span>
                    <span className="bg-gray-100 text-gray-600 py-1.5 px-4 rounded-full text-xs md:text-sm
                                   hover:bg-gray-200 transition-colors cursor-pointer">
                        Value for money
                    </span>
                    <span className="bg-gray-100 text-gray-600 py-1.5 px-4 rounded-full text-xs md:text-sm
                                   hover:bg-gray-200 transition-colors cursor-pointer">
                        Product
                    </span>
                </div>

                {/* Expandable Sections */}
                <div className="space-y-6 mb-10">
                    {/* Product Size */}
                    <div className="border-b border-gray-200 pb-4">
                        <button
                            onClick={() => toggleSection('size')}
                            className="flex items-center justify-between w-full text-left hover:bg-gray-50 
                                     transition-colors p-2 rounded-lg -m-2"
                        >
                            <div className="flex items-center gap-4">
                                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 3.5H5C4.46957 3.5 3.96086 3.71071 3.58579 4.08579C3.21071 4.46086 3 4.96957 3 5.5V8.5M21 8.5V5.5C21 4.96957 20.7893 4.46086 20.4142 4.08579C20.0391 3.71071 19.5304 3.5 19 3.5H16M16 21.5H19C19.5304 21.5 20.0391 21.2893 20.4142 20.9142C20.7893 20.5391 21 20.0304 21 19.5V16.5M3 16.5V19.5C3 20.0304 3.21071 20.5391 3.58579 20.9142C3.96086 21.2893 4.46957 21.5 5 21.5H8" stroke="#8E8E8E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="text-gray-900 font-medium text-sm md:text-lg">Product Size</span>
                            </div>
                            {expandedSection === 'size' ? (
                                <ChevronUp className="w-5 h-5 text-gray-500 transition-transform duration-200" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-500 transition-transform duration-200" />
                            )}
                        </button>
                        {expandedSection === 'size' && (
                            <div className="mt-4 pl-12 text-gray-600 text-sm md:text-base animate-in slide-in-from-top-2 duration-300">
                                <p>Available sizes: 600x600mm, 800x800mm, 1200x600mm</p>
                                <p>Thickness: 8mm, 10mm, 12mm</p>
                            </div>
                        )}
                    </div>

                    {/* Material Used */}
                    <div className="border-b border-gray-200 pb-4">
                        <button
                            onClick={() => toggleSection('material')}
                            className="flex items-center justify-between w-full text-left hover:bg-gray-50 
                                     transition-colors p-2 rounded-lg -m-2"
                        >
                            <div className="flex items-center gap-4">
                                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 16.4999V8.4999C20.9996 8.14918 20.9071 7.80471 20.7315 7.50106C20.556 7.19742 20.3037 6.94526 20 6.7699L13 2.7699C12.696 2.59437 12.3511 2.50195 12 2.50195C11.6489 2.50195 11.304 2.59437 11 2.7699L4 6.7699C3.69626 6.94526 3.44398 7.19742 3.26846 7.50106C3.09294 7.80471 3.00036 8.14918 3 8.4999V16.4999C3.00036 16.8506 3.09294 17.1951 3.26846 17.4987C3.44398 17.8024 3.69626 18.0545 4 18.2299L11 22.2299C11.304 22.4054 11.6489 22.4979 12 22.4979C12.3511 22.4979 12.696 22.4054 13 22.2299L20 18.2299C20.3037 18.0545 20.556 17.8024 20.7315 17.4987C20.9071 17.1951 20.9996 16.8506 21 16.4999Z" stroke="#8E8E8E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M3.27 7.45996L12 12.51L20.73 7.45996" stroke="#8E8E8E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 22.58V12.5" stroke="#8E8E8E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="text-gray-900 font-medium text-sm md:text-lg">Material Used</span>
                            </div>
                            {expandedSection === 'material' ? (
                                <ChevronUp className="w-5 h-5 text-gray-500 transition-transform duration-200" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-500 transition-transform duration-200" />
                            )}
                        </button>
                        {expandedSection === 'material' && (
                            <div className="mt-4 pl-12 text-gray-600 text-sm md:text-base animate-in slide-in-from-top-2 duration-300">
                                <p>Premium engineered wood with protective coating</p>
                                <p>Water-resistant laminate surface</p>
                                <p>Anti-slip texture finish</p>
                            </div>
                        )}
                    </div>

                    {/* More Info */}
                    <div className="border-b border-gray-200 pb-4">
                        <button
                            onClick={() => toggleSection('info')}
                            className="flex items-center justify-between w-full text-left hover:bg-gray-50 
                                     transition-colors p-2 rounded-lg -m-2"
                        >
                            <div className="flex items-center gap-4">
                                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 22.5C17.5228 22.5 22 18.0228 22 12.5C22 6.97715 17.5228 2.5 12 2.5C6.47715 2.5 2 6.97715 2 12.5C2 18.0228 6.47715 22.5 12 22.5Z" stroke="#8E8E8E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 16.5V12.5" stroke="#8E8E8E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 8.5H12.01" stroke="#8E8E8E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="text-gray-900 font-medium text-sm md:text-lg">More Info</span>
                            </div>
                            {expandedSection === 'info' ? (
                                <ChevronUp className="w-5 h-5 text-gray-500 transition-transform duration-200" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-500 transition-transform duration-200" />
                            )}
                        </button>
                        {expandedSection === 'info' && (
                            <div className="mt-4 pl-12 text-gray-600 text-sm md:text-base animate-in slide-in-from-top-2 duration-300">
                                <p>Installation: Click-lock system for easy installation</p>
                                <p>Maintenance: Regular cleaning with damp cloth</p>
                                <p>Warranty: 5 years manufacturer warranty</p>
                                <p>Origin: Made in India</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="w-full bg-yellow-400 text-white py-4 rounded-full font-semibold 
                                     hover:bg-yellow-500 hover:scale-105 transition-all duration-300 
                                     text-base shadow-lg hover:shadow-xl">
                        Contact Dealer
                    </button>
                    <button className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-full 
                                     font-medium hover:bg-gray-50 hover:border-gray-300 hover:scale-105 
                                     transition-all duration-300 text-base shadow-lg hover:shadow-xl">
                        More From NEURO
                    </button>
                </div>
            </div>
        </div>
    );
}