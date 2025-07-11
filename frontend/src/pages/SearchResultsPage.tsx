import { Menu, ChevronLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SearchResultsPage() {
    const navigate = useNavigate();
    const products = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
            title: "Wooden tile",
            brand: "Neuro",
            bgColor: "bg-gray-200",
            rating: 4.0
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
            title: "Wooden tile",
            brand: " Neuro",
            bgColor: "bg-red-400",
            rating: 4.5
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
            title: "Wooden tile",
            brand: "Neuro",
            bgColor: "bg-red-400",
            rating: 3.8
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
            title: "Wooden tile",
            brand: "Brand - Neuro",
            bgColor: "bg-gray-600",
            rating: 4.2
        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
            title: "Wooden tile",
            brand: "Brand - Neuro",
            bgColor: "bg-yellow-100",
            rating: 4.7
        },
        {
            id: 6,
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
            title: "Wooden tile",
            brand: "Neuro",
            bgColor: "bg-gray-100",
            rating: 4.1
        }
    ];
    const goBack = (): void => { 
        navigate('/')
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-50">
                <div className="flex items-center justify-between p-4 md:max-w-screen-md md:mx-auto">
                    <Menu className="w-6 h-6 text-gray-700" />
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">N</span>
                    </div>
                </div>
            </div>

            {/* Search bar */}
            <div className="px-4 py-3 bg-white border-b border-gray-100">
                <div className="flex items-center gap-3 md:max-w-screen-md md:mx-auto">
                    <ChevronLeft className="w-5 h-5 text-gray-600" onClick={goBack} />
                    <div className="flex-1 relative">
                        <div className="animated-border rounded-full">
                            <div className="flex items-center bg-white rounded-full px-4 py-2">
                                <span className="text-gray-500 text-sm flex-1">What are you looking for?</span>
                                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                                    <Search className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .animated-border {
                    position: relative;
                    padding: 2px;
                    border-radius: 50px;
                    background: linear-gradient(45deg, #fbbf24, #f59e0b, #d97706, #000000);
                    background-size: 400% 400%;
                    animation: gradientMove 3s ease infinite;
                }
                .animated-border::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    padding: 2px;
                    background: linear-gradient(45deg, #fbbf24, #f59e0b, #d97706, #000000);
                    background-size: 400% 400%;
                    border-radius: inherit;
                    animation: gradientMove 3s ease infinite;
                    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    mask-composite: exclude;
                }
                .animated-image-border {
                    position: relative;
                    padding: 1px;
                    border-radius: 8px;
                    background: linear-gradient(45deg, #F7CC47, #F7CC47, rgba(247, 204, 71, 0.3));
                    background-size: 200% 200%;
                    animation: imageGradientMove 4s ease infinite;
                }
                @keyframes gradientMove {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes imageGradientMove {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>

            {/* Results Header */}
            <div className="px-4 py-4 md:max-w-screen-md md:mx-auto">
                <h2 className="text-lg font-semibold text-gray-900">Results</h2>
            </div>

            {/* Results Grid */}
            <div className="px-4 pb-10 md:max-w-screen-md md:mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product, index) => (
                        <div key={product.id} className={index % 2 === 1 ? 'mt-8' : 'mb-8'}>
                            <div className="bg-black rounded-lg overflow-hidden shadow-sm h-full">
                                <div className="bg-black p-2">
                                    <div className="animated-image-border rounded-lg">
                                        <div className={`${product.bgColor} aspect-square relative overflow-hidden rounded-lg`}>
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-black px-3 pt-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-gray-700 h-0.5 rounded-full">
                                            <div
                                                className="bg-yellow-400 h-0.5 rounded-full"
                                                style={{ width: `${(product.rating / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-white text-xs">{product.rating}</span>
                                    </div>
                                </div>
                                <div className="bg-black px-3 pb-3 pt-2">
                                    <h3 className="text-white text-sm font-medium mb-1">{product.title}</h3>
                                    <p className="text-xs">
                                      <span className="text-white">Brand - </span>
                                      <span style={{ color: '#F8CC47' }}>{product.brand}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
