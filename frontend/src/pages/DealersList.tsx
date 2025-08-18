import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Phone, MessageSquare } from 'lucide-react';

// Define a type for a single dealer for better code safety
interface Dealer {
    id: number;
    name: string;
    location: string;
    phone: string;
    city: string;
}

export default function DealersList() {
    const navigate = useNavigate();

    // Expanded dealer data for a more realistic look
    const dealers: Dealer[] = [
        {
            id: 1,
            name: "ABC Corporation",
            location: "MG Road, Thrissur",
            city: "Kerala",
            phone: "+91 98765 43210",
        },
        {
            id: 2,
            name: "Fortlight Plaza",
            location: "South Bazar, Kannur",
            city: "Kerala",
            phone: "+91 99887 76655",
        },
        {
            id: 3,
            name: "Prestige Emporium",
            location: "Koramangala, Bengaluru",
            city: "Karnataka",
            phone: "+91 91234 56789",
        },
        {
            id: 4,
            name: "Urban Materials Co.",
            location: "Indiranagar, Bengaluru",
            city: "Karnataka",
            phone: "+91 98765 12345",
        },
    ];

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            {/* --- Header --- */}
            <header className="sticky top-0 z-20 p-4 flex items-center justify-between bg-black/80 backdrop-blur-sm border-b border-gray-800">
                <button onClick={() => navigate(-1)} className="p-2">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-semibold absolute left-1/2 -translate-x-1/2">
                    Dealer's List
                </h1>
                {/* A placeholder for potential right-side icons */}
                <div className="w-8"></div>
            </header>

            {/* --- Main Content --- */}
            <main className="p-4">
                <p className="text-gray-400 mb-6">Find authorized dealers near you</p>

                <div className="space-y-4">
                    {dealers.map((dealer) => (
                        <DealerCard key={dealer.id} dealer={dealer} />
                    ))}
                </div>
            </main>
        </div>
    );
}

// --- Dealer Card Component ---
const DealerCard: React.FC<{ dealer: Dealer }> = ({ dealer }) => {
    // Function to handle calling the dealer
    const handleCall = (phoneNumber: string) => {
        // Removes spaces and creates a tel: link
        window.location.href = `tel:${phoneNumber.replace(/\s/g, '')}`;
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 transition-colors hover:border-orange-500/50">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                {/* Dealer Info */}
                <div className="flex-1">
                    <p className="text-xs text-orange-400 font-semibold mb-1">{dealer.city}</p>
                    <h2 className="text-xl font-bold text-white mb-3">{dealer.name}</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                            <MapPin size={14} className="text-gray-500" />
                            <span>{dealer.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <Phone size={14} className="text-gray-500" />
                            <span>{dealer.phone}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex sm:flex-col justify-start items-start gap-3 border-t border-gray-800 sm:border-t-0 sm:border-l sm:pl-4 pt-4 sm:pt-0">
                    <button 
                        onClick={() => handleCall(dealer.phone)}
                        className="w-full text-center bg-orange-500 text-black px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <Phone size={16} />
                        Call Now
                    </button>
                     <button className="w-full text-center bg-gray-700 text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                        <MessageSquare size={16} />
                        Message
                    </button>
                </div>
            </div>
        </div>
    );
};
