import React, { useState } from 'react';
import { Menu, ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export default function WoodenTileProductPage() {
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    const navigate = useNavigate();

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="flex items-center justify-between p-4">
                    <Menu className="w-6 h-6 text-gray-700" />
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">N</span>
                    </div>
                </div>
            </div>

            {/* Product Image */}
            <div className="relative">
                <img
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
                    alt="Wooden Tile"
                    className="w-full h-64 object-cover"
                />

                {/* More Options Button */}
                <button className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-lg">
                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* Product Content */}
            <div className="bg-white rounded-t-3xl -mt-6 relative z-10 px-6 pt-6 pb-8">
                {/* Product Title */}
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Wooden Tile</h1>

                {/* Product Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    Neuro Wood is one of the largest branded global chain of premium bath and light solutions; hardware, closomatic,
                    doors, tiles, sanitaryware, and home decor. We are the comprehensive one's own bathroom and lighting concept
                    development, product design and production, marketing and support that help make direct concepts into reality.
                </p>

                {/* Tags */}
                <div className="flex gap-2 mb-8">
                    <span className="bg-gray-100 text-gray-600 py-1 px-3 rounded-full text-xs">
                        Ease of assemble
                    </span>
                    <span className="bg-gray-100 text-gray-600 py-1 px-3 rounded-full text-xs">
                        Value for money
                    </span>
                    <span className="bg-gray-100 text-gray-600 py-1 px-3 rounded-full text-xs">
                        Product
                    </span>
                </div>

                {/* Expandable Sections */}
                <div className="space-y-4 mb-8">
                    {/* Product Size */}
                    <div className="border-b border-gray-200 pb-4">
                        <button
                            onClick={() => toggleSection('size')}
                            className="flex items-center justify-between w-full text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                                </div>
                                <span className="text-gray-900 font-medium">Product Size</span>
                            </div>
                            {expandedSection === 'size' ? (
                                <ChevronUp className="w-5 h-5 text-gray-500" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-500" />
                            )}
                        </button>
                        {expandedSection === 'size' && (
                            <div className="mt-4 pl-11 text-gray-600 text-sm">
                                <p>Available sizes: 600x600mm, 800x800mm, 1200x600mm</p>
                                <p>Thickness: 8mm, 10mm, 12mm</p>
                            </div>
                        )}
                    </div>

                    {/* Material Used */}
                    <div className="border-b border-gray-200 pb-4">
                        <button
                            onClick={() => toggleSection('material')}
                            className="flex items-center justify-between w-full text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                                </div>
                                <span className="text-gray-900 font-medium">Material Used</span>
                            </div>
                            {expandedSection === 'material' ? (
                                <ChevronUp className="w-5 h-5 text-gray-500" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-500" />
                            )}
                        </button>
                        {expandedSection === 'material' && (
                            <div className="mt-4 pl-11 text-gray-600 text-sm">
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
                            className="flex items-center justify-between w-full text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                                </div>
                                <span className="text-gray-900 font-medium">More Info</span>
                            </div>
                            {expandedSection === 'info' ? (
                                <ChevronUp className="w-5 h-5 text-gray-500" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-500" />
                            )}
                        </button>
                        {expandedSection === 'info' && (
                            <div className="mt-4 pl-11 text-gray-600 text-sm">
                                <p>Installation: Click-lock system for easy installation</p>
                                <p>Maintenance: Regular cleaning with damp cloth</p>
                                <p>Warranty: 5 years manufacturer warranty</p>
                                <p>Origin: Made in India</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contact Dealer Button */}
                <button
                    onClick={() => navigate('/dealers-list')}
                    className="w-full bg-yellow-400 text-gray-900 py-4 rounded-full font-semibold text-lg mb-4 hover:bg-yellow-500 transition-colors"
                >
                    Contact Dealer
                </button>

                {/* More From NEURO Button */}
                <button className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-full font-medium hover:bg-gray-50 transition-colors">
                    More From NEURO
                </button>
            </div>
        </div>
    );
}