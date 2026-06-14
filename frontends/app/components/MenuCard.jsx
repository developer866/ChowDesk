"use client";

import { Plus } from "lucide-react";


export default function MenuCard({ item, onAdd }) {
    
    const formattedPrice = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
    }).format(item.price);

    return (
        <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">

            {/* Image */}
            <div className="relative w-full h-44 overflow-hidden bg-gray-100">
                <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Category badge */}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-semibold text-(--color-neutral) px-2.5 py-1 rounded-full font-(family-name:--font-body)">
                    {item.category}
                </span>

                {/* Unavailable overlay */}
                {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold font-(family-name:--font-body)">
                            Currently Unavailable
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-(family-name:--font-headline) text-base font-bold text-gray-900 mb-1">
                    {item.name}
                </h3>

                <p className="font-(family-name:--font-body) text-sm text-gray-500 leading-relaxed mb-3 line-clamp-2">
                    {item.description}
                </p>

                <div className="flex items-center justify-between">
                    <span className="font-(family-name:--font-headline) text-lg font-extrabold text-(--color-primary)">
                        {formattedPrice}
                    </span>

                    <button
                        onClick={() => onAdd?.(item)}
                        disabled={!item.isAvailable}
                        className="flex items-center gap-1.5 bg-(--color-primary) hover:bg-(--color-secondary) disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-sm font-semibold px-3.5 py-2 rounded-full transition-colors duration-200 font-(family-name:--font-body)"
                    >
                        <Plus className="w-4 h-4" />
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}