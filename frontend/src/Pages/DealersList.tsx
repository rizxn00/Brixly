import React from 'react';
import { Menu } from 'lucide-react';

export default function DealersList() {
    const dealers = [
        {
            id: 1,
            name: "ABC Corporation",
            location: "Thrissur, Kerala",
            phone: "+91 9876543210",
        },
        {
            id: 2,
            name: "Fortlight Plaza",
            location: "South Bazar, Kannur",
            phone: "+91 9988776655",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white shadow-lg border-b border-gray-200">
                <div className="max-w-7xl mx-auto flex items-center justify-between p-4 md:p-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-black rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200">
                        <span className="text-white text-lg font-bold">S</span>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <Menu className="w-6 h-6 text-gray-700" />
                    </button>
                </div>
            </div>

            {/* Title */}
            <div className="max-w-7xl mx-auto p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Dealer's List</h1>
                <p className="text-gray-600 mt-1 text-sm md:text-base">Find authorized dealers near you</p>
            </div>

            {/* Dealers List */}
            <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-6 pb-12">
                {dealers.map((dealer) => (
                    <div
                        key={dealer.id}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 hover:shadow-xl hover:scale-[1.01] transition-all duration-200 group"
                    >
                        <div className="flex items-start justify-between gap-6">
                            <div className="flex-1">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200">
                                    {dealer.name}
                                </h2>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                                        <div className="w-3 h-3 bg-white rounded-full"></div>
                                    </div>
                                    <span className="text-gray-700 font-medium text-sm md:text-base">
                                        {dealer.location}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-md flex items-center justify-center shadow-sm">
                                        <div className="w-3 h-3 bg-white rounded-full"></div>
                                    </div>
                                    <span className="text-gray-700 font-medium text-sm md:text-base">
                                        {dealer.phone}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                {/* Replaced placeholder with a smaller, generic image or logo */}
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-200 to-green-300 rounded-xl flex items-center justify-center mb-4 shadow-md hover:shadow-lg transition-shadow duration-200 group-hover:scale-105">
                                    <span className="text-green-600 font-bold text-lg"></span>
                                </div>
                                <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 px-6 py-2.5 md:py-3 rounded-xl font-bold text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-200">
                                    Contact Sales →
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}