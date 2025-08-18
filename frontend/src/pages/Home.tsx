import React, { useState, useEffect, useRef } from 'react';
import { Menu, User, ArrowRight, Search, Mic, FileText, Zap, TrendingUp, Hammer, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// No changes needed for this functional component
interface AnimatedPlaceholderProps {
  placeholders: string[];
  className?: string;
}

const AnimatedPlaceholder: React.FC<AnimatedPlaceholderProps> = ({ placeholders, className }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [displayText, setDisplayText] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    const currentPlaceholder = placeholders[currentIndex];
    const delay = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentPlaceholder.length) {
          setDisplayText(currentPlaceholder.substring(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.substring(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % placeholders.length);
        }
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, placeholders]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse text-gray-500">|</span>
    </span>
  );
};

// --- NEW Header Component ---
const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <Menu className="w-6 h-6 text-gray-300" />
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-white tracking-wider">Brixly</span>
        <button className="bg-gradient-to-r from-orange-500 to-amber-400 text-black px-3 py-1 rounded-full text-xs font-bold">
          Pro
        </button>
      </div>
      <User className="w-6 h-6 text-gray-300" />
    </header>
  );
};

// --- NEW Hero Section Component ---
const HeroSection: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState<string>('');

    const placeholders: string[] = [
        'I need exotic marble ranges for 10...',
        'waterproof plywoods for bathroom...',
        'textured wall panels for living room...',
    ];

    const handleSearch = async (): Promise<void> => {
        if (!searchQuery.trim()) return;

        try {
            console.log('Search:', searchQuery);
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

            const response = await fetch(`${API_BASE_URL}/products/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: searchQuery }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const searchResults = await response.json();
            navigate('/SearchResultsPage', {
                state: { results: searchResults, query: searchQuery },
            });
        } catch (error) {
            console.error('Search failed:', error);
        }
    };

    return (
        <div className="text-center px-4 pt-16 pb-12">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white">Brixly</h1>
            <div className="flex items-center justify-center gap-2 mt-4">
                <SparkleIcon />
                <h2 className="text-lg font-medium text-white">The Future of Architecture Sourcing</h2>
                <SparkleIcon className="transform -scale-x-100" />
            </div>
            <p className="text-gray-400 max-w-lg mx-auto mt-4 text-sm sm:text-base">
                Connect with premium suppliers, discover cutting-edge materials, and transform your architectural vision into reality
            </p>
            <div className="relative max-w-xl mx-auto mt-8">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-amber-500 rounded-full blur opacity-75"></div>
                <div className="relative flex items-center bg-gray-800 border border-gray-700 rounded-full px-4 py-3 shadow-lg">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full bg-transparent text-white placeholder-gray-500 text-sm pl-3 focus:outline-none"
                    />
                    {!searchQuery && (
                        <div className="absolute left-12 top-1/2 -translate-y-1/2 pointer-events-none">
                            <AnimatedPlaceholder placeholders={placeholders} className="text-gray-500 text-sm" />
                        </div>
                    )}
                    <Mic className="w-5 h-5 text-gray-400 ml-2" />
                </div>
            </div>
        </div>
    );
};

// --- NEW Stats Section Component ---
const StatsSection: React.FC = () => {
    const stats = [
        { icon: FileText, value: '10K+', label: 'Premium Suppliers' },
        { icon: Zap, value: '50K+', label: 'Quality Materials' },
        { icon: TrendingUp, value: '99%', label: 'Client Satisfaction' },
    ];
    return (
        <div className="px-4 py-8">
            <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-gray-800/50 p-4 rounded-2xl text-center border border-gray-700/50">
                        <stat.icon className="w-8 h-8 mx-auto text-orange-400 mb-2" />
                        <p className="text-xl sm:text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-xs text-gray-400">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- NEW Journey Section Component ---
const JourneySection: React.FC = () => {
    return (
        <div className="px-4 py-12">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Start Your Journey</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <JourneyCard icon={Hammer} title="Find Materials" />
                <JourneyCard icon={Building} title="Create a Project" />
            </div>
        </div>
    );
};

const JourneyCard: React.FC<{icon: React.ElementType, title: string}> = ({ icon: Icon, title }) => (
    <div className="bg-gray-800 p-6 rounded-2xl flex items-center gap-4 border border-gray-700 hover:border-orange-500 transition-colors">
        <div className="bg-gray-700 p-3 rounded-full">
            <Icon className="w-6 h-6 text-orange-400" />
        </div>
        <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
    </div>
);


// --- UPDATED Daily Inspiration Section ---
// This re-uses the original logic but applies the new dark theme styling
const DailyInspirationSection: React.FC = () => {
    const navigate = useNavigate();
    const inspirationData = [
      { id: 1, title: 'Fabric Wall Panels', brand: 'Rivacase', product: 'Grey Water' },
      { id: 2, title: 'Wooden Accent Wall', brand: 'Nordic Designs', product: 'Oak Serenity' },
      { id: 3, title: 'Modern Ceiling Panels', brand: 'Urban Interiors', product: 'White Horizon' },
      { id: 4, title: 'Textured Wall Tiles', brand: 'Artisan Crafts', product: 'Stone Wave' },
      { id: 5, title: 'Glass Panel Walls', brand: 'Crystal Designs', product: 'Clear Vision' },
    ];

    const handleKnowMore = (title: string): void => {
        console.log(`Know more clicked for: ${title}`);
        navigate('/product-detail');
    };

    return (
        <div className="px-4 py-12">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Daily Inspiration</h2>
            <CardStack cards={inspirationData} onKnowMore={handleKnowMore} />
        </div>
    );
};

// --- UPDATED Card Stack Component ---
interface CardStackProps {
    cards: Array<{ id: number; title: string; brand: string; product: string; }>;
    onKnowMore: (title: string) => void;
}

const CardStack: React.FC<CardStackProps> = ({ cards, onKnowMore }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);

    const nextCard = () => setCurrentIndex((prev) => (prev + 1) % cards.length);
    const prevCard = () => setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);

    const handleSwipe = (action: 'start' | 'end', value?: number) => {
        if (action === 'start' && value !== undefined) touchStartX.current = value;
        if (action === 'end') {
            const swipeDistance = touchEndX.current - touchStartX.current;
            if (swipeDistance > 50) prevCard();
            else if (swipeDistance < -50) nextCard();
        }
    };
    
    const handleTouchMove = (value: number) => {
      touchEndX.current = value;
    }

    return (
        <div className="relative max-w-md mx-auto h-[280px]">
            <div className="relative h-[240px] select-none [perspective:1000px]">
                {cards.map((card, index) => {
                    const isActive = index === currentIndex;
                    const offset = currentIndex - index;
                    const transform = `translateZ(${-Math.abs(offset) * 50}px) rotateY(${offset * -10}deg) translateX(${offset * 10}%)`;

                    return (
                        <div
                            key={card.id}
                            className="absolute inset-0 transition-transform duration-500 ease-out"
                            style={{
                                zIndex: cards.length - Math.abs(offset),
                                opacity: isActive ? 1 : 0.5,
                                transform: isActive ? 'none' : transform,
                                pointerEvents: isActive ? 'auto' : 'none',
                            }}
                        >
                            <Card
                                title={card.title}
                                brand={card.brand}
                                product={card.product}
                                onKnowMore={() => onKnowMore(card.title)}
                                onSwipe={handleSwipe}
                                onTouchMove={handleTouchMove}
                            />
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-center mt-6 space-x-2">
                {cards.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-orange-500' : 'bg-gray-600'}`}
                    />
                ))}
            </div>
        </div>
    );
};

// --- UPDATED Card Component ---
interface CardProps {
    title: string;
    brand: string;
    product: string;
    onKnowMore: () => void;
    onSwipe: (action: 'start' | 'end', value?: number) => void;
    onTouchMove: (value: number) => void;
}

const Card: React.FC<CardProps> = ({ title, brand, product, onKnowMore, onSwipe, onTouchMove }) => {
    return (
        <div
            className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-lg cursor-pointer select-none h-full touch-pan-y"
            onTouchStart={(e) => onSwipe('start', e.targetTouches[0].clientX)}
            onTouchMove={(e) => onTouchMove(e.targetTouches[0].clientX)}
            onTouchEnd={() => onSwipe('end')}
        >
            <div className="flex h-full w-full">
                <div className="w-1/2 p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">{title}</h3>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-orange-400">Brand - </span>
                                <span className="font-medium">{brand}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">Product - </span>
                                <span className="text-gray-300">{product}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onKnowMore}
                        onTouchStart={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 text-white text-sm font-medium hover:text-orange-300 transition-colors w-fit mt-4"
                    >
                        Know more <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="w-1/2 bg-gray-700/50 flex items-center justify-center p-4">
                    <div className="w-full h-full bg-gray-900 rounded-lg">
                        {/* Placeholder for an image */}
                    </div>
                </div>
            </div>
        </div>
    );
};


// Helper component for sparkle icon
const SparkleIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20.24L12 17.27L7.09 20.24L8.45 13.97L4 9.27L9.91 8.26L12 2Z" fill="url(#sparkle-gradient)" />
        <defs>
            <linearGradient id="sparkle-gradient" x1="12" y1="2" x2="12" y2="20.24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F97316" />
                <stop offset="1" stopColor="#FBBF24" />
            </linearGradient>
        </defs>
    </svg>
);


// --- Main Home Page Component ---
const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <JourneySection />
        <DailyInspirationSection />
      </main>
    </div>
  );
};

export default HomePage;
