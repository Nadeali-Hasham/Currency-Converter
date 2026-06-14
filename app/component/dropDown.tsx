import React from "react";

interface DropDownProps {
  currencies: string[];
  currency: string;
  setCurrency: (currency: string) => void;
  favorites: string[];
  handleFavorite: (currency: string) => void;
  title: string;
}

const DropDown = ({
  currencies,
  currency,
  setCurrency,
  favorites,
  handleFavorite,
  title = "",
}: DropDownProps) => {
  // Agar currencies empty hain to loading show karo
  if (currencies.length === 0) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {title}
        </label>
        <div className="p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
          Loading currencies...
        </div>
      </div>
    );
  }

  // Sort currencies to show favorites first
  const sortedCurrencies = [...currencies].sort((a, b) => {
    const aIsFavorite = favorites.includes(a);
    const bIsFavorite = favorites.includes(b);
    if (aIsFavorite && !bIsFavorite) return -1;
    if (!aIsFavorite && bIsFavorite) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {title}
      </label>
      <div className="flex gap-2">
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="flex-1 p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {sortedCurrencies.map((curr) => (
            <option
              key={curr}
              value={curr}
              className={favorites.includes(curr) ? "bg-yellow-50" : ""}
            >
              {curr} {favorites.includes(curr) && "⭐"}
            </option>
          ))}
        </select>
        <button
          onClick={() => handleFavorite(currency)}
          className={`px-3 py-2 rounded-lg transition duration-300 ${
            favorites.includes(currency)
              ? "bg-yellow-400 hover:bg-yellow-500 text-yellow-900"
              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
          }`}
          title={
            favorites.includes(currency)
              ? "Remove from favorites"
              : "Add to favorites"
          }
        >
          {favorites.includes(currency) ? "★" : "☆"}
        </button>
      </div>
    </div>
  );
};

export default DropDown;
