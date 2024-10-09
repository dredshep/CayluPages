import React, { useState } from "react";

const PromoCodeInput: React.FC = () => {
  const [promoCode, setPromoCode] = useState("");

  const handleApplyPromoCode = () => {
    // Implement promo code logic here
    console.log("Applying promo code:", promoCode);
  };

  return (
    <div className="bg-gray-50 px-6 py-4">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Código promocional"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          onClick={handleApplyPromoCode}
          className="bg-teal-500 text-white px-4 py-2 rounded-r-md hover:bg-teal-600 transition duration-150 ease-in-out"
        >
          Aplicar
        </button>
      </div>
    </div>
  );
};

export default PromoCodeInput;
