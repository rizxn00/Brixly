import React, { useState, useEffect, useRef, useMemo } from 'react';
import { User, ArrowRight, Search, Mic, Hammer, Building, X, Layers3, TreeDeciduous, Lamp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg'
import { motion, AnimatePresence } from 'framer-motion';


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

// --- Helper component for the new Brixly Logo ---
const BrixlyLogo: React.FC = () => (
    <img src={logo} alt='brixly-logo' height='120' width='120' className='p-2' />
);

// --- MODIFIED Header Component ---
const Header: React.FC = () => {
    return (
        <header className="flex items-center justify-between p-4 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
            <BrixlyLogo />
            <User className="w-6 h-6 text-gray-300" />
        </header>
    );
};

// --- MODIFIED Hero Section Component ---
const HeroSection = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [showPermissionGuide, setShowPermissionGuide] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const recognitionRef = useRef(null);

    const placeholders = [
        'I need exotic marble ranges for 10...',
        'waterproof plywoods for bathroom...',
        'textured wall panels for living room...',
    ];

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error("Speech Recognition is not supported by this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setShowPermissionGuide(false);
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setSearchQuery(transcript);
            handleSearch(transcript);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            if (event.error === 'not-allowed') {
                setShowPermissionGuide(true);
            }
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;

    }, []);

    const handleSearch = async (queryToSearch) => {
        if (!queryToSearch.trim()) return;

        setIsLoading(true);

        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}/products/search`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: queryToSearch }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const searchResults = await response.json();
            navigate('/SearchResultsPage', {
                state: { results: searchResults, query: queryToSearch },
            });
        } catch (error) {
            console.error('Search failed:', error);
            setIsLoading(false);
        }
    };

    const handleMicClick = () => {
        if (!recognitionRef.current) return;

        if (showPermissionGuide) {
            setShowPermissionGuide(false);
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setSearchQuery('');
            recognitionRef.current.start();
        }
    };

    return (
        <div className="text-center px-4 pt-16 pb-12 relative">
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
                {showPermissionGuide && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-[calc(100%+2rem)] mb-4 bg-gray-800 border border-orange-500/50 rounded-lg p-4 text-left shadow-lg z-10">
                        <button onClick={() => setShowPermissionGuide(false)} className="absolute top-2 right-2 text-gray-500 hover:text-white">
                            <X size={18} />
                        </button>
                        <p className="text-sm font-semibold text-white">Microphone is Blocked</p>
                        <p className="text-xs text-gray-400 mt-1">
                            To use voice search, click the lock icon 🔒 in your address bar and set Microphone to "Allow". Then, click the mic icon again.
                        </p>
                    </div>
                )}

                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-amber-500 rounded-full blur opacity-75"></div>
                <div className="relative flex items-center bg-gray-800 border border-gray-700 rounded-full px-4 py-3 shadow-lg">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                        className="w-full bg-transparent text-white placeholder-gray-500 text-sm pl-3 focus:outline-none"
                    />
                    {!searchQuery && !isListening && (
                        <div className="absolute left-12 top-1/2 -translate-y-1/2 pointer-events-none">
                            <AnimatedPlaceholder placeholders={placeholders} className="text-gray-500 text-sm" />
                        </div>
                    )}
                    <button onClick={handleMicClick} title="Search with voice" className="p-1 rounded-full transition-colors">
                        <Mic className={`w-5 h-5 ml-2 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-white'}`} />
                    </button>
                </div>
                {isListening && <p className="text-orange-400 text-sm mt-2">Listening...</p>}
            </div>

            {/* NEW Dynamic Loader Component */}
            <SearchLoader isLoading={isLoading} />
        </div>
    );
};

const SearchLoader = ({ isLoading }) => {
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [, setElapsedTime] = useState(0);
    const [progress, setProgress] = useState(0);

    // Initial messages and a secondary set for long waits
    const initialMessages = useMemo(() => [
        'Curating premium products',
        'Sourcing quality materials',
        'Refining your search',
        'Connecting with suppliers',
        'Crafting your solution'
    ], []);

    const longWaitMessages = useMemo(() => [
        'Still searching...',
        'Almost there...',
        'Thank you for waiting'
    ], []);

    // Function to pick a random message
    const getRandomMessage = (messageArray) => {
        const randomIndex = Math.floor(Math.random() * messageArray.length);
        return messageArray[randomIndex];
    };

    useEffect(() => {
        if (isLoading) {
            setMessages(initialMessages);
            setCurrentMessage(getRandomMessage(initialMessages));
            setElapsedTime(0);
            setProgress(0);
        }
    }, [isLoading, initialMessages]);

    useEffect(() => {
        let messageInterval;
        let timeInterval;
        let progressInterval;

        if (isLoading) {
            // Timer for changing messages
            messageInterval = setInterval(() => {
                setCurrentMessage(getRandomMessage(messages));
            }, 3000);

            // Timer for elapsed time
            timeInterval = setInterval(() => {
                setElapsedTime((prevTime) => {
                    const newTime = prevTime + 1;
                    if (newTime >= 6 && messages !== longWaitMessages) {
                        setMessages(longWaitMessages);
                        setCurrentMessage(getRandomMessage(longWaitMessages));
                    }
                    return newTime;
                });
            }, 2000);

            // Smooth progress animation
            progressInterval = setInterval(() => {
                setProgress((prev) => {
                    const increment = Math.random() * 1.5 + 0.3;
                    return Math.min(prev + increment, 95);
                });
            }, 250);

            return () => {
                clearInterval(messageInterval);
                clearInterval(timeInterval);
                clearInterval(progressInterval);
            };
        }
    }, [isLoading, messages, longWaitMessages]);

    return (
        <motion.div
            className={`fixed inset-0 bg-gray-900/98 backdrop-blur-[2px] flex flex-col items-center justify-center transition-opacity duration-500 ${isLoading ? 'opacity-100 z-50' : 'opacity-0 -z-10'
                }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Ultra-minimal grid */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
                        backgroundSize: '60px 60px'
                    }}
                />
            </div>

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center max-w-lg mx-auto px-8">

                {/* Progress indicator - ultra thin line */}
                <div className="w-64 h-[1px] bg-white/10 mb-16 relative overflow-hidden">
                    <motion.div
                        className="absolute left-0 top-0 h-full bg-white/80"
                        initial={{ width: '0%' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                </div>

                {/* Main typography */}
                <AnimatePresence mode="wait">
                    <motion.h2
                        key={currentMessage}
                        className="text-white text-2xl md:text-3xl font-extralight tracking-[0.2em] text-center mb-8 leading-relaxed"
                        initial={{
                            y: 30,
                            opacity: 0,
                            filter: 'blur(4px)'
                        }}
                        animate={{
                            y: 0,
                            opacity: 1,
                            filter: 'blur(0px)'
                        }}
                        exit={{
                            y: -30,
                            opacity: 0,
                            filter: 'blur(4px)'
                        }}
                        transition={{
                            duration: 0.8,
                            ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                    >
                        {currentMessage}
                    </motion.h2>
                </AnimatePresence>

                {/* Minimal status indicator */}
                <motion.div
                    className="flex items-center space-x-4 text-white/40 text-xs font-mono tracking-[0.3em] uppercase"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                >
                    <span>{Math.round(progress)}%</span>
                    <div className="w-1 h-1 bg-white/40 rounded-full animate-pulse" />
                    <span>Processing</span>
                </motion.div>
            </div>

            {/* Breathing accent element */}
            <motion.div
                className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                    opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />
        </motion.div>
    );
};

// --- NEW Featured Categories Section (Replaces StatsSection) ---
const FeaturedCategoriesSection: React.FC = () => {
    const categories = [
        {
            icon: Layers3,
            title: 'Premium Tiles',
            description: 'Discover a world of marble, ceramic, and granite.'
        },
        {
            icon: TreeDeciduous,
            title: 'Hardwood Flooring',
            description: 'Elegant and durable options for any interior.'
        },
        {
            icon: Lamp,
            title: 'Designer Lighting',
            description: 'Illuminate your space with our modern collection.'
        },
    ];
    return (
        <div className="px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {categories.map((cat, index) => (
                    <div key={index} className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/50 text-center hover:bg-gray-800 transition-colors">
                        <cat.icon className="w-10 h-10 mx-auto text-orange-400 mb-4" />
                        <h3 className="text-lg font-semibold text-white">{cat.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">{cat.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Journey Section Component ---
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

const JourneyCard: React.FC<{ icon: React.ElementType, title: string }> = ({ icon: Icon, title }) => (
    <div className="bg-gray-800 p-6 rounded-2xl flex items-center gap-4 border border-gray-700 hover:border-orange-500 transition-colors">
        <div className="bg-gray-700 p-3 rounded-full">
            <Icon className="w-6 h-6 text-orange-400" />
        </div>
        <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
    </div>
);

// --- Daily Inspiration Section ---
const DailyInspirationSection: React.FC = () => {
    const navigate = useNavigate();
    const inspirationData = [
        {
            id: 1,
            title: 'Fabric Wall Panels',
            brand: 'Rivacase',
            product: 'Grey Water',
            imageUrl: 'https://images.unsplash.com/photo-1635647331438-94444d1dd7a5?q=60&w=400&auto=format&fm=webp&fit=crop'
        },
        {
            id: 2,
            title: 'Wooden Accent Wall',
            brand: 'Nordic Designs',
            product: 'Oak Serenity',
            imageUrl: 'https://images.unsplash.com/photo-1739918559783-ed40311fc814?q=60&w=400&auto=format&fm=webp&fit=crop'
        },
        {
            id: 3,
            title: 'Modern Ceiling Panels',
            brand: 'Urban Interiors',
            product: 'White Horizon',
            imageUrl: 'https://images.unsplash.com/photo-1733760746685-99dcd3a6009e?q=60&w=400&auto=format&fm=webp&fit=crop'
        },
        {
            id: 4,
            title: 'Textured Wall Tiles',
            brand: 'Artisan Crafts',
            product: 'Stone Wave',
            imageUrl: 'https://plus.unsplash.com/premium_photo-1675370609851-af2f2cf08c82?q=60&w=400&auto=format&fm=webp&fit=crop'
        },
        {
            id: 5,
            title: 'Glass Panel Walls',
            brand: 'Crystal Designs',
            product: 'Clear Vision',
            imageUrl: 'https://images.unsplash.com/photo-1655258104134-35ea5ef8647c?q=60&w=400&auto=format&fm=webp&fit=crop'
        },
    ];


    const handleKnowMore = (title: string): void => {
        const productData = inspirationData.find(p => p.title === title);
        navigate('/product-detail', { state: { product: productData } });
    };

    return (
        <div className="px-4 py-12">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Daily Inspiration</h2>
            <CardStack cards={inspirationData} onKnowMore={handleKnowMore} />
        </div>
    );
};

// --- Card Stack Component ---
interface CardStackProps {
    cards: Array<{ id: number; title: string; brand: string; product: string; imageUrl: string; }>;
    onKnowMore: (title: string) => void;
}

const CardStack: React.FC<CardStackProps> = ({ cards, onKnowMore }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isSwipePrevented, setIsSwipePrevented] = useState<boolean>(false);
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);
    const swipeThreshold = 90;

    const nextCard = () => setCurrentIndex((prev) => (prev + 1) % cards.length);
    const prevCard = () => setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);

    const handleSwipe = (action: 'start' | 'end', value?: number) => {
        if (action === 'start' && value !== undefined) {
            touchStartX.current = value;
            touchEndX.current = value;
            setIsSwipePrevented(false);
        }

        if (action === 'end') {
            if (isSwipePrevented) return;

            const swipeDistance = touchEndX.current - touchStartX.current;
            const swipeVelocity = Math.abs(swipeDistance);

            if (swipeVelocity >= swipeThreshold) {
                if (swipeDistance > 0) {
                    prevCard();
                } else {
                    nextCard();
                }
            }

            touchStartX.current = 0;
            touchEndX.current = 0;
        }
    };

    const handleTouchMove = (value: number) => {
        touchEndX.current = value;
    };

    const handleButtonTouch = () => {
        setIsSwipePrevented(true);
    };

    return (
        <div className="relative max-w-md mx-auto h-[280px]">
            {/* Navigation Buttons for Large Screens - Positioned Outside */}
            <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 w-[calc(100%+120px)] -left-[60px] justify-between z-20 pointer-events-none">
                <button
                    onClick={prevCard}
                    className="w-8 h-8 bg-gray-800/40 backdrop-blur-sm border border-gray-700/30 rounded-full flex items-center justify-center text-white/60 hover:bg-gray-800/60 hover:text-white hover:border-orange-500/20 transition-all duration-300 pointer-events-auto group opacity-60 hover:opacity-100"
                    aria-label="Previous card"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:text-orange-400 transition-colors" />
                </button>

                <button
                    onClick={nextCard}
                    className="w-8 h-8 bg-gray-800/40 backdrop-blur-sm border border-gray-700/30 rounded-full flex items-center justify-center text-white/60 hover:bg-gray-800/60 hover:text-white hover:border-orange-500/20 transition-all duration-300 pointer-events-auto group opacity-60 hover:opacity-100"
                    aria-label="Next card"
                >
                    <ChevronRight className="w-4 h-4 group-hover:text-orange-400 transition-colors" />
                </button>
            </div>

            {/* Card Stack */}
            <div className="relative h-[240px] select-none [perspective:1000px]">
                {cards.map((card, index) => {
                    const isActive = index === currentIndex;

                    let offset = index - currentIndex;
                    if (offset < -Math.floor(cards.length / 2)) offset += cards.length;
                    if (offset > Math.floor(cards.length / 2)) offset -= cards.length;

                    const translateX = offset * 40;
                    const translateY = Math.abs(offset) * 10;
                    const scale = 1 - Math.abs(offset) * 0.05;
                    const blur = isActive ? "blur-0" : "blur-sm";

                    return (
                        <div
                            key={card.id}
                            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${blur}`}
                            style={{
                                transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
                                zIndex: cards.length - Math.abs(offset),
                                opacity: Math.abs(offset) > 3 ? 0 : 1,
                                pointerEvents: isActive ? "auto" : "none",
                            }}
                        >
                            <Card
                                title={card.title}
                                brand={card.brand}
                                product={card.product}
                                imageUrl={card.imageUrl}
                                onKnowMore={() => {
                                    handleButtonTouch();
                                    onKnowMore(card.title);
                                }}
                                onSwipe={handleSwipe}
                                onTouchMove={handleTouchMove}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Dot Indicators */}
            <div className="flex justify-center mt-6 space-x-3">
                {cards.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'bg-orange-500 scale-125'
                                : 'bg-gray-600 hover:bg-gray-500'
                            }`}
                        aria-label={`Go to card ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

// --- Card Component ---
interface CardProps {
    title: string;
    brand: string;
    product: string;
    imageUrl: string;
    onKnowMore: () => void;
    onSwipe: (action: 'start' | 'end', value?: number) => void;
    onTouchMove: (value: number) => void;
}

const Card: React.FC<CardProps> = ({ title, brand, product, imageUrl, onKnowMore, onSwipe, onTouchMove }) => {
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
                <div className="w-1/2 bg-gray-700/50 flex items-center justify-center">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover rounded-r-lg"
                        loading="lazy"
                    />
                </div>
            </div>
        </div>
    );
};

// --- Helper component for sparkle icon ---
const SparkleIcon: React.FC<{ className?: string }> = ({ className }) => (
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
                <FeaturedCategoriesSection />
                <JourneySection />
                <DailyInspirationSection />
            </main>
        </div>
    );
};

export default HomePage;