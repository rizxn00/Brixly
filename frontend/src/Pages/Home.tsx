import { useState } from 'react';
import { Menu, Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

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

    const handleSearch = () => {
        console.log('Search:', searchQuery);
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

// Individual Card Component
interface CardProps {
    title: string;
    brand: string;
    product: string;
    onKnowMore: () => void;
}

const Card: React.FC<CardProps> = ({ title, brand, product, onKnowMore }) => {
    return (
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
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

// Card Stack Component
interface CardStackProps {
    cards: Array<{
        id: number;
        title: string;
        brand: string;
        product: string;
    }>;
    onKnowMore: (title: string) => void;
}

const CardStack: React.FC<CardStackProps> = ({ cards, onKnowMore }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const nextCard = () => {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    };

    const prevCard = () => {
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            nextCard();
        } else if (isRightSwipe) {
            prevCard();
        }
    };

    return (
        <div className="relative max-w-md mx-auto">
            {/* Navigation buttons */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={prevCard}
                    className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600">
                    {currentIndex + 1} / {cards.length}
                </span>
                <button
                    onClick={nextCard}
                    className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Card Stack */}
            <div 
                className="relative h-[280px] select-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {cards.map((card, index) => {
                    const isActive = index === currentIndex;
                    const isNext = index === (currentIndex + 1) % cards.length;
                    const isPrev = index === (currentIndex - 1 + cards.length) % cards.length;
                    
                    let zIndex = 0;
                    let transform = '';
                    let opacity = 0;

                    if (isActive) {
                        zIndex = 30;
                        transform = 'translateY(0px) rotate(0deg) scale(1)';
                        opacity = 1;
                    } else if (isNext) {
                        zIndex = 20;
                        transform = 'translateY(8px) rotate(3deg) scale(0.95)';
                        opacity = 0.8;
                    } else if (isPrev) {
                        zIndex = 10;
                        transform = 'translateY(16px) rotate(-3deg) scale(0.9)';
                        opacity = 0.6;
                    } else {
                        zIndex = 0;
                        transform = 'translateY(24px) rotate(0deg) scale(0.85)';
                        opacity = 0.4;
                    }

                    return (
                        <div
                            key={card.id}
                            className="absolute inset-0 transition-all duration-500 ease-out"
                            style={{
                                zIndex,
                                transform,
                                opacity,
                            }}
                        >
                            <Card
                                title={card.title}
                                brand={card.brand}
                                product={card.product}
                                onKnowMore={() => onKnowMore(card.title)}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center mt-6 space-x-2">
                {cards.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentIndex ? 'bg-gray-800' : 'bg-gray-300'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

// Daily Inspiration Section Component
const DailyInspirationSection = () => {
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
        {
            id: 5,
            title: 'Glass Panel Walls',
            brand: 'Crystal Designs',
            product: 'Clear Vision',
        },
    ];

    const handleKnowMore = (title: string) => {
        console.log(`Know more clicked for: ${title}`);
    };

    return (
        <div className="px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Inspiration</h2>
            <CardStack cards={inspirationData} onKnowMore={handleKnowMore} />
        </div>
    );
};

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

// Main App
function App() {
    return (
        <div className="App">
            <HomePage />
        </div>
    );
}

export default App;