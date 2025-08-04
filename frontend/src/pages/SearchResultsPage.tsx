import { Menu, ChevronLeft, Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function SearchResultsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false); 

    // Get data from navigation state
    useEffect(() => {
        if (location.state) {
            const { results = [], query = '' } = location.state;
            console.log('Received results:', results);
            setProducts(results.results);
            setSearchQuery(query);
        }
    }, [location.state]);

    // Fallback static data (keep your existing data as fallback)
    const fallbackProducts = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
            title: "Wooden tile",
            brand: "Neuro",
            bgColor: "bg-gray-200",
            rating: 4.0
        },
        // ... rest of your static products
    ];

    // Handle new search from the search bar
    const handleNewSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/products/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: searchQuery,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const searchResults = await response.json();
            setProducts(searchResults.results);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const goBack = () => {
        navigate('/');
    };

    // Use API products if available, otherwise fallback
    const displayProducts = products.length > 0 ? products : fallbackProducts;

    const getRandomBgColor = () => {
        const colors = ['bg-gray-200', 'bg-red-400', 'bg-gray-600', 'bg-yellow-100', 'bg-gray-100'];
        return colors[Math.floor(Math.random() * colors.length)];
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
                    <ChevronLeft className="w-5 h-5 text-gray-600 cursor-pointer" onClick={goBack} />
                    <div className="flex-1 relative">
                        <div className="animated-border rounded-full">
                            <div className="flex items-center bg-white rounded-full px-4 py-2">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleNewSearch()}
                                    placeholder="What are you looking for?"
                                    className="text-gray-900 text-sm flex-1 outline-none bg-transparent"
                                />
                                <div 
                                    className="w-8 h-8 bg-black rounded-full flex items-center justify-center cursor-pointer"
                                    onClick={handleNewSearch}
                                >
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
        pointer-events: none; /* This fixes the click issue */
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
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Results  {/* {searchQuery ? `Results for "${searchQuery}"` : 'Results'} */}
                    </h2>
                    <span className="text-sm text-gray-500">
                        {displayProducts.length} {displayProducts.length === 1 ? 'result' : 'results'}
                    </span>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                </div>
            )}

            {/* No Results */}
            {!isLoading && displayProducts.length === 0 && (
                <div className="text-center py-12 px-4">
                    <p className="text-gray-500 text-lg">No results found</p>
                    <p className="text-gray-400 text-sm mt-2">Try searching with different keywords</p>
                </div>
            )}

            {/* Results Grid */}
            {!isLoading && displayProducts.length > 0 && (
                <div className="px-4 pb-10 md:max-w-screen-md md:mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {displayProducts.map((product, index) => (
                            <div key={product.id} className={index % 2 === 1 ? 'mt-8' : 'mb-8'} onClick={() => navigate(`/product-detail`, { state: { product } })}>
                                <div className="bg-black rounded-lg overflow-hidden shadow-sm h-full">
                                    <div className="bg-black p-2">
                                        <div className="animated-image-border rounded-lg">
                                            <div className={`${product.bgColor || getRandomBgColor()} aspect-square relative overflow-hidden rounded-lg`}>
                                                <img
                                                    src={product.images?.[0] || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover rounded-lg"
                                                    // onError={(e) => {
                                                    //     e.target.src = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop";
                                                    // }}
                                                />
                                                {product.price && (
                                                    <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                                        {product.currency === 'INR' ? '₹' : '$'}{product.price}
                                                    </div>
                                                )}
                                                {!product.isAvailable && product.type == "product" && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                        <span className="text-white text-sm font-medium">Out of Stock</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-black px-3 pt-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-gray-700 h-0.5 rounded-full">
                                                <div
                                                    className="bg-yellow-400 h-0.5 rounded-full"
                                                    style={{ width: `${(parseFloat(product.rating) / 5) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-white text-xs">{product.rating}</span>
                                        </div>
                                    </div>
                                    <div className="bg-black px-3 pb-3 pt-2">
                                        <h3 className="text-white text-sm font-medium mb-1 line-clamp-2">{product.name}</h3>
                                        {product.type =="product" &&(
                                        <p className="text-xs">
                                            <span className="text-white">Brand - </span>
                                            <span style={{ color: '#F8CC47' }}>{product.brandName}</span>
                                        </p>
                                            )}
                                        {product.category && (
                                            <p className="text-xs text-gray-400 mt-1">{product.category}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}