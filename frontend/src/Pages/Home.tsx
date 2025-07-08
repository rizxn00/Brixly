import React, { useState, useEffect } from 'react';
import { Menu, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';

// ===== COMPONENTS =====

// Header Component
const Header = () => {
    return (
        <header className="flex items-center justify-between p-4 bg-white">
            <Menu className="w-6 h-6 text-gray-700" />
            <button className="bg-gray-800 text-white px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2">
                Get Started
                <ArrowRight className="w-4 h-4" />
            </button>
        </header>
    );
};

// Featured Card Component
const FeaturedCard = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        navigate('/SearchResultsPage');
    };

    return (
        <div className="mx-4 mb-6">
            <div
                className="rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-between min-h-[260px] sm:min-h-[300px] max-w-full sm:max-w-[900px] mx-auto shadow-lg bg-gradient-to-b from-orange-500 to-gray-800"
                style={{
                    background: 'linear-gradient(180deg, #CA8E38 0%, #2F2F2F 100%)',
                }}
            >
                {/* Top Section - Date */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">Fri, 10 Jul 2015</span>
                    </div>
                </div>

                {/* Bottom Section - Prompt + Search (Left Aligned) */}
                <div className="flex flex-col items-start gap-2">
                    {/* Prompt Text + Icon */}
                    <div className="flex items-center gap-2">
                        <h2 className="text-xs font-medium whitespace-nowrap">Architectural Needs, One Prompt Away</h2>
                        <ArrowRight className="w-5 h-5" />
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-[420px]">
                        <input
                            type="text"
                            placeholder="Yellow wall panel with wooden texture..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-white/30 rounded-full px-4 py-3 text-black placeholder-gray-400 text-xs pr-12"
                        />
                        <button
                            onClick={handleSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black rounded-full p-2"
                        >
                            <ArrowRight className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Inspiration Card Component
interface InspirationCardProps {
    title: string;
    brand: string;
    product: string;
    onKnowMore: () => void;
}

const InspirationCard: React.FC<InspirationCardProps> = ({ title, brand, product, onKnowMore }) => {
    return (
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg z-10">
            <div className="flex">
                {/* Left side - Content */}
                <div className="w-1/2 bg-black text-white p-6 flex flex-col justify-between min-h-[240px]">
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">{title}</h3>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-orange-400">Brand - </span>
                                <span className="font-medium">{brand}</span>
                            </div>
                            <div>
                                <span className="text-white/90">Product - </span>
                                <span className="text-white/90">{product}</span>
                            </div>
                        </div>
                    </div>

                    {/* Know more button */}
                    <button
                        onClick={onKnowMore}
                        className="flex items-center gap-2 text-white text-sm font-medium hover:text-orange-300 transition-colors bg-gray-800 px-4 py-2 rounded-full w-fit"
                    >
                        Know more
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Right side - Image */}
                <div className="w-1/2 bg-gray-200 min-h-[240px] relative">
                    {/* Mock interior scene */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400">
                        {/* Simulated concrete wall texture */}
                        <div className="absolute inset-0 bg-gradient-to-b from-gray-300 to-gray-500"></div>

                        {/* Table representation */}
                        <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2">
                            <div className="w-12 h-2 bg-orange-300 rounded-full"></div>
                            <div className="w-1 h-6 bg-gray-600 mx-auto"></div>
                        </div>

                        {/* Chair representations */}
                        <div className="absolute bottom-1/4 left-1/4">
                            <div className="w-2 h-4 bg-orange-400 rounded-sm"></div>
                        </div>
                        <div className="absolute bottom-1/4 right-1/4">
                            <div className="w-2 h-4 bg-orange-400 rounded-sm"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Daily Inspiration Section Component
const DailyInspirationSection = () => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    // Dummy data for inspiration cards
    const inspirationData = [
        {
            id: 1,
            title: 'Fabric Wall Panels',
            brand: 'Rivacase',
            product: 'Grey Water',
        },
        {
            id: 2,
            title: 'Wooden Accent Wall',
            brand: 'Nordic Designs',
            product: 'Oak Serenity',
        },
        {
            id: 3,
            title: 'Modern Ceiling Panels',
            brand: 'Urban Interiors',
            product: 'White Horizon',
        },
        {
            id: 4,
            title: 'Textured Wall Tiles',
            brand: 'Artisan Crafts',
            product: 'Stone Wave',
        },
    ];

    // Duplicate data for infinite loop
    const extendedData = [...inspirationData, ...inspirationData];

    const handleKnowMore = (title: string) => {
        console.log(`Know more clicked for: ${title}`);
        navigate('/product-detail');
    };

    // Swipe handlers
    const handlers = useSwipeable({
        onSwipedLeft: () => {
            setCurrentIndex((prev) => prev + 1);
        },
        onSwipedRight: () => {
            setCurrentIndex((prev) => prev - 1);
        },
        trackMouse: true,
    });

    // Handle infinite loop logic
    useEffect(() => {
        if (currentIndex >= inspirationData.length) {
            setTimeout(() => {
                setCurrentIndex(currentIndex - inspirationData.length);
            }, 500); // Match transition duration
        } else if (currentIndex < 0) {
            setTimeout(() => {
                setCurrentIndex(currentIndex + inspirationData.length);
            }, 500);
        }
    }, [currentIndex, inspirationData.length]);

    return (
        <div className="px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Inspiration</h2>

            {/* Swipeable Card Container */}
            <div className="relative max-w-4xl mx-auto overflow-hidden text-xs" {...handlers}>
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                        transform: `translateX(-${(currentIndex % inspirationData.length) * (window.innerWidth >= 640 ? 50 : 100)}%)`,
                    }}
                >
                    {extendedData.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="w-full sm:w-1/2 flex-shrink-0 px-2 relative text-xs"
                        >
                            {/* Stack effect background cards */}
                            <div
                                className="absolute inset-0 bg-gray-200 rounded-2xl z-0 text-xs"
                                style={{
                                    transform: 'translateY(-12px) rotate(-3deg) scale(0.98)',
                                    opacity: 0.3,
                                }}
                            ></div>
                            <div
                                className="absolute inset-0 bg-gray-300 rounded-2xl z-0 text-xs"
                                style={{
                                    transform: 'translateY(-6px) rotate(3deg) scale(0.99)',
                                    opacity: 0.5,
                                }}
                            ></div>

                            {/* Main card with animation */}
                            <div
                                className="relative z-10 transition-transform duration-500 ease-in-out text-xs"
                                style={{
                                    transform: currentIndex % inspirationData.length === index % inspirationData.length ? 'scale(1)' : 'scale(0.95)',
                                    opacity: currentIndex % inspirationData.length === index % inspirationData.length ? 1 : 0.8,
                                }}
                            >
                                <InspirationCard
                                    title={item.title}
                                    brand={item.brand}
                                    product={item.product}
                                    onKnowMore={() => handleKnowMore(item.title)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ===== PAGES =====

// Home Page Component
const HomePage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="pb-8">
                <FeaturedCard />
                <DailyInspirationSection />
            </main>
        </div>
    );
};

// ===== MAIN APP =====

function App() {
    return (
        <div className="App">
            <HomePage />
        </div>
    );
}

export default App;