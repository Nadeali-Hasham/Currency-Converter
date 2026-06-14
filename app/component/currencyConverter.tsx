"use client";
import React, { useEffect, useState } from "react";
import DropDown from "./dropDown";

interface CurrencyData {
  iso_code: string;
}

interface RateData {
  rate: number;
}

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("PKR");
  const [convertedAmount, setConvertedAmount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const convertCurrency = async () => {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      if (fromCurrency === toCurrency) {
        setConvertedAmount(`${amount.toFixed(2)} ${toCurrency}`);
        return;
      }

      const response = await fetch(
        `https://api.frankfurter.dev/v2/rate/${fromCurrency}/${toCurrency}`,
      );

      if (!response.ok) {
        throw new Error(`Unable to fetch exchange rate (${response.status})`);
      }

      const data: RateData = await response.json();

      if (typeof data.rate !== "number") {
        throw new Error("Invalid exchange rate response");
      }

      const convertedValue = amount * data.rate;
      setConvertedAmount(`${convertedValue.toFixed(2)} ${toCurrency}`);
    } catch (error) {
      console.error("Error fetching conversion rate:", error);
      setConvertedAmount("Error converting currency");
    } finally {
      setLoading(false);
    }
  };

  const swapCurrency = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setConvertedAmount(null);
  };

  const handleFavorite = (currency: string) => {
    if (favorites.includes(currency)) {
      setFavorites(favorites.filter((fav) => fav !== currency));
    } else {
      if (favorites.length < 5) {
        setFavorites([...favorites, currency]);
      } else {
        alert("You can only add up to 5 favorite currencies");
      }
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadCurrencies = async () => {
      try {
        const response = await fetch(
          "https://api.frankfurter.dev/v2/currencies",
        );

        if (!response.ok) {
          throw new Error(`Unable to load currencies (${response.status})`);
        }

        const data: CurrencyData[] = await response.json();

        if (!cancelled) {
          setCurrencies(data.map((item) => item.iso_code).sort());
        }
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    };

    void loadCurrencies();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Currency Converter
          </h1>
          <p className="text-gray-600">Convert your currencies easily</p>
        </div>

        <div className="space-y-6">
          {/* Amount Input */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
          </div>

          {/* Currency Dropdowns */}
          <div>
            <DropDown
              currencies={currencies}
              currency={fromCurrency}
              setCurrency={setFromCurrency}
              title="From Currency"
              favorites={favorites}
              handleFavorite={handleFavorite}
            />

            {/* Swap Button */}
            <div className="flex justify-center my-2">
              <button
                onClick={swapCurrency}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-full transition duration-300 transform hover:scale-105"
              >
                🔄 Swap
              </button>
            </div>

            <DropDown
              currencies={currencies}
              currency={toCurrency}
              setCurrency={setToCurrency}
              title="To Currency"
              favorites={favorites}
              handleFavorite={handleFavorite}
            />
          </div>

          {/* Convert Button */}
          <button
            onClick={convertCurrency}
            disabled={loading || !amount}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
              loading || !amount
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? "Converting..." : "Convert Currency"}
          </button>

          {/* Result Display */}
          {convertedAmount && (
            <div className="mt-6 p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
              <h2 className="text-lg font-semibold text-gray-700 mb-2 text-center">
                Converted Amount:
              </h2>
              <p className="text-2xl font-bold text-center text-blue-600">
                {convertedAmount}
              </p>
            </div>
          )}

          {/* Favorites Display */}
          {favorites.length > 0 && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                ⭐ Favorite Currencies:
              </h3>
              <div className="flex flex-wrap gap-2">
                {favorites.map((fav) => (
                  <span
                    key={fav}
                    className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                  >
                    {fav}
                    <button
                      onClick={() => handleFavorite(fav)}
                      className="ml-1 text-yellow-600 hover:text-yellow-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
