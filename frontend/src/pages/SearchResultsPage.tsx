import { ChevronLeft, Search, Star, LayoutGrid, List } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Define a type for a single product to prevent type-related errors
interface Product {
    id?: string;
    _id?: string;
    images?: string[];
    title?: string;
    name?: string;
    brandName?: string;
    brand?: string;
    category?: string;
    rating?: number | string;
    price?: number;
    currency?: string;
}

export default function SearchResultsPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // State is now strongly typed with the Product interface
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const categories = ["All", "Marble Tiles", "Wood Tiles", "Ceramic Tiles", "Granite"];
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        // Safely access location state
        if (location.state) {
            const { results, query = '' } = location.state as { results?: { results: Product[] }, query?: string };
            // Ensure the nested 'results' property is an array before setting state
            const productList = Array.isArray(results?.results) ? results.results : [];
            setProducts(productList);
            setSearchQuery(query);
        }
    }, [location.state]);

    const handleNewSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsLoading(true);
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        try {
            const response = await fetch(`${API_BASE_URL}/products/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: searchQuery }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const searchResults = await response.json();
            const productList = Array.isArray(searchResults?.results) ? searchResults.results : [];
            setProducts(productList);
        } catch (error) {
            console.error('Search failed:', error);
            setProducts([]); // Clear products on error for a clean slate
        } finally {
            setIsLoading(false);
        }
    };

    const goBack = () => navigate('/');

    // This is a simple client-side filter. For a large dataset,
    // this filtering logic should be handled by the API.
    const filteredProducts = activeCategory === "All"
        ? products
        : products.filter(p => 
            p.category?.toLowerCase().includes(activeCategory.split(' ')[0].toLowerCase())
          );

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            {/* Header with Search Bar */}
            <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm p-4 border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                    <ChevronLeft className="w-6 h-6 text-gray-300 cursor-pointer flex-shrink-0" onClick={goBack} />
                    <div className="flex-1 relative">
                        <label htmlFor="search-input" className="sr-only">Search products</label>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                        <input
                            id="search-input"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleNewSearch()}
                            placeholder="Search products..."
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                </div>
            </header>

            <main className="p-4">
                {/* Results Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Results</h1>
                        <p className="text-sm text-gray-400">{filteredProducts.length} products found</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 bg-orange-500 rounded-lg" aria-label="Grid view">
                            <LayoutGrid className="w-5 h-5 text-black" />
                        </button>
                        <button className="p-2 bg-gray-700 rounded-lg" aria-label="List view">
                            <List className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Filter Chips */}
                {/* Note: Requires a scrollbar-hiding utility if you don't want a visible scrollbar. 
                    You can add 'scrollbar-hide' if you have the 'tailwind-scrollbar-hide' plugin. */}
                <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                                activeCategory === category
                                    ? 'bg-orange-500 text-black'
                                    : 'bg-gray-800 text-white hover:bg-gray-700'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-400 text-lg">No products found</p>
                        <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id || product._id} product={product} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

// Extracted Product Card component for clarity and reusability
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const navigate = useNavigate();
    
    const handleCardClick = () => {
        navigate(`/product-detail`, { state: { product } });
    };

    const ratingValue = product.rating ? parseFloat(String(product.rating)).toFixed(1) : null;

    return (
        <div onClick={handleCardClick} className="bg-gray-800 rounded-lg overflow-hidden h-full flex flex-col cursor-pointer group">
            <div className="relative aspect-square w-full overflow-hidden">
                <img
                    src={product.images?.[0] || "https://placehold.co/400x400/1f2937/4b5563?text=Brixly"}
                    alt={product.title || product.name || 'Product Image'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x400/1f2937/4b5563?text=Error"; }}
                />
                <div className="absolute top-2 right-2 flex flex-col gap-1.5">
                    {ratingValue && (
                        <div className="bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
                            <Star size={10} className="text-yellow-400 fill-yellow-400"/>
                            <span>{ratingValue}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="p-3 flex-grow flex flex-col">
                <h3 className="text-white text-sm font-semibold mb-1 line-clamp-2 flex-grow">{product.title || product.name}</h3>
                <p className="text-xs text-gray-400 mb-2">{product.brandName || product.brand}</p>
                {product.price && (
                    <p className="text-sm font-bold text-orange-400">
                        {product.currency === 'INR' ? '₹' : '$'}{product.price}/sq ft
                    </p>
                )}
            </div>
        </div>
    );
};
