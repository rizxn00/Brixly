import React, { useState, useEffect, useRef } from 'react';
import { Menu, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Header Component
const Header: React.FC = () => {
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

// Animated Placeholder Component
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

// Featured Card Component
const FeaturedCard: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState<string>('');

    const placeholders: string[] = [
        "Yellow wall panel with wooden texture...",
        "Modern minimalist ceiling design...",
        "Rustic brick wall with warm lighting...",
        "Elegant marble flooring patterns...",
        "Contemporary glass partition ideas..."
    ];

    const handleSearch = (): void => {
        console.log('Search:', searchQuery);
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
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">Fri, 10 Jul 2015</span>
                    </div>
                </div>
                <div className="flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xs font-medium whitespace-nowrap">Architectural Needs, One Prompt Away</h2>
                        <ArrowRight className="w-5 h-5" />
                    </div>
                    <div className="relative w-full sm:w-[420px]">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-white/30 rounded-full px-4 py-3 text-black text-xs pr-12"
                            />
                            {!searchQuery && (
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <AnimatedPlaceholder
                                        placeholders={placeholders}
                                        className="text-gray-400 text-xs"
                                    />
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black rounded-xl px-3 py-2"
                        >
                            <svg
                                width="11"
                                height="10"
                                viewBox="0 0 11 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M4.725 9.1125C4.48 9.1125 4.3575 9.025 4.3575 8.85V6.624C4.3575 6.568 4.3645 6.5085 4.3785 6.4455C4.3925 6.3755 4.445 6.3265 4.536 6.2985L7.434 5.2065V4.7865L4.536 3.705C4.445 3.67 4.3925 3.621 4.3785 3.558C4.3645 3.495 4.3575 3.432 4.3575 3.369V1.1535C4.3575 0.978499 4.48 0.890999 4.725 0.890999H5.544C5.67 0.890999 5.768 0.890999 5.838 0.890999C5.915 0.890999 6.006 0.936499 6.111 1.0275L9.8385 4.0515C9.9435 4.1425 10.0065 4.209 10.0275 4.251C10.0485 4.286 10.059 4.3595 10.059 4.4715V5.5215C10.059 5.6335 10.0485 5.7105 10.0275 5.7525C10.0065 5.7945 9.9435 5.8575 9.8385 5.9415L6.111 8.976C6.006 9.06 5.915 9.1055 5.838 9.1125C5.768 9.1125 5.67 9.1125 5.544 9.1125H4.725ZM0.7035 5.4375C0.5285 5.4375 0.441 5.35 0.441 5.175V4.8285C0.441 4.6535 0.5285 4.566 0.7035 4.566H4.4415C4.6165 4.566 4.704 4.6535 4.704 4.8285V5.175C4.704 5.35 4.6165 5.4375 4.4415 5.4375H0.7035Z"
                                    fill="white"
                                />
                            </svg>
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
    onSwipe: (action: 'start' | 'move' | 'end' | 'left' | 'right', value?: number) => void;
}

const Card: React.FC<CardProps> = ({ title, brand, product, onKnowMore, onSwipe }) => {
    const lastTap = useRef<number>(0);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const now = new Date().getTime();
        const DOUBLE_TAP_DELAY = 300;
        if (now - lastTap.current < DOUBLE_TAP_DELAY) {
            onKnowMore();
        } else {
            const rect = event.currentTarget.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const cardWidth = rect.width;
            if (clickX < cardWidth / 2) {
                onSwipe('right');
            } else {
                onSwipe('left');
            }
        }
        lastTap.current = now;
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        onSwipe('start', e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        onSwipe('move', e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        onSwipe('end');
    };

    return (
        <div
            className="relative bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer select-none mt-2"
            onClick={handleClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="flex h-[240px] w-full overflow-hidden gap-px bg-black">
                <div className="w-1/2 bg-black text-white p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">{title}</h3>
                        <div className="space-y-2 text-xs sm:text-sm">
                            <div>
                                <span className="text-orange-400 text-xs sm:text-sm">Brand - </span>
                                <span className="font-medium text-xs sm:text-sm">{brand}</span>
                            </div>
                            <div>
                                <span className="text-white/90 text-xs sm:text-sm">Product - </span>
                                <span className="text-white/90 text-xs sm:text-sm">{product}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            onKnowMore();
                        }}
                        className="flex items-center gap-2 text-white text-xs sm:text-sm font-medium hover:text-orange-300 transition-colors bg-gray-800 px-2 py-2 rounded-lg w-fit mt-1"
                    >
                        Know more
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="w-2/3 border rounded-l-xl flex items-center justify-center">
                    <div className="bg-gray-200 rounded-lg w-[calc(100%-2rem)] h-[calc(100%-2rem)] relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg">
                            <div className="absolute inset-0 bg-gradient-to-b from-gray-300 to-gray-500 rounded-lg"></div>

                            <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2">
                                <div className="w-12 h-2 bg-orange-300 rounded-full"></div>
                            </div>
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
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);

    const nextCard = (): void => {
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    };

    const prevCard = (): void => {
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    };

    const handleSwipe = (action: 'start' | 'move' | 'end' | 'left' | 'right', value?: number): void => {
        if (action === 'start' && value !== undefined) {
            touchStartX.current = value;
        } else if (action === 'move' && value !== undefined) {
            touchEndX.current = value;
        } else if (action === 'end') {
            const swipeDistance = touchEndX.current - touchStartX.current;
            const SWIPE_THRESHOLD = 50;
            if (swipeDistance > SWIPE_THRESHOLD) {
                prevCard();
            } else if (swipeDistance < -SWIPE_THRESHOLD) {
                nextCard();
            }
        } else if (action === 'left') {
            nextCard();
        } else if (action === 'right') {
            prevCard();
        }
    };

    return (
        <div className="relative max-w-md mx-auto h-[280px]">
            <div className="flex justify-center mb-4 space-x-2">
                {cards.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-gray-800' : 'bg-gray-300'
                            }`}
                    />
                ))}
            </div>
            <div className="relative h-[240px] select-none">
                {cards.map((card, index) => {
                    const isActive = index === currentIndex;
                    const isNext = index === (currentIndex + 1) % cards.length;
                    const isPrev = index === (currentIndex - 1 + cards.length) % cards.length;

                    let zIndex: number = 0;
                    let transform: string = '';
                    let opacity: number = 0;
                    let pointerEvents: 'auto' | 'none' = 'none';
                    let transition: string = 'all 0.5s ease-out';

                    if (isActive) {
                        zIndex = 30;
                        transform = 'translateY(0) rotateX(0deg) scale(1)';
                        opacity = 1;
                        pointerEvents = 'auto';
                    } else if (isNext) {
                        zIndex = 20;
                        transform = 'translateY(-20px) rotateX(10deg) scale(0.95)';
                        opacity = 0.8;
                        pointerEvents = 'none';
                    } else if (isPrev) {
                        zIndex = 20;
                        transform = 'translateY(-20px) rotateX(-10deg) scale(0.95)';
                        opacity = 0.8;
                        pointerEvents = 'none';
                    } else {
                        zIndex = 10;
                        transform = 'translateY(-30px) rotateX(0deg) scale(0.9)';
                        opacity = 0.6;
                        pointerEvents = 'none';
                    }

                    return (
                        <div
                            key={card.id}
                            className="absolute inset-0 transition-all duration-500 ease-out"
                            style={{
                                zIndex,
                                transform,
                                opacity,
                                pointerEvents,
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            <Card
                                title={card.title}
                                brand={card.brand}
                                product={card.product}
                                onKnowMore={() => onKnowMore(card.title)}
                                onSwipe={handleSwipe}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Daily Inspiration Section Component
const DailyInspirationSection: React.FC = () => {
    const navigate = useNavigate();

    const inspirationData: Array<{
        id: number;
        title: string;
        brand: string;
        product: string;
    }> = [
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

    const handleKnowMore = (title: string): void => {
        console.log(`Know more clicked for: ${title}`);
        navigate('/product-detail');
    };

    return (
        <div className="px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Inspiration</h2>
            <CardStack cards={inspirationData} onKnowMore={handleKnowMore} />
        </div>
    );
};

// Home Page Component
const HomePage: React.FC = () => {
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
const App: React.FC = () => {
    return (
        <div className="App">
            <HomePage />
        </div>
    );
};

export default App;