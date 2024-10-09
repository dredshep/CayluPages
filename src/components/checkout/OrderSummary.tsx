import React from "react";
import Image from "next/image";
import { CartProduct } from "@/types/CartProduct";
import { useCartStore2 } from "@/store/useCartStore2";
import getPlaceholderImageUrl from "@/utils/getPlaceholderImageUrl";

interface OrderSummaryProps {
  cart: CartProduct[];
  deliveryFee: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cart, deliveryFee }) => {
  const restaurantTotal = cart.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );
  const taxableAmount = restaurantTotal + deliveryFee;
  const foodIVA = restaurantTotal * 0.1;
  const deliveryIVA = deliveryFee * 0.21;
  const totalIVA = foodIVA + deliveryIVA;
  const total = taxableAmount + totalIVA;

  return (
    <div>
      {cart.map((product) => (
        <div
          key={product.p_id}
          className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200"
        >
          <div className="flex items-center">
            <Image
              src={
                product.image ||
                getPlaceholderImageUrl({
                  width: 50,
                  height: 50,
                  bgColor: "e0e0e0",
                  textColor: "757575",
                })
              }
              alt={product.name}
              width={50}
              height={50}
              className="rounded-md mr-4"
            />
            <div>
              <h3 className="font-medium text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-600">
                Cantidad: {product.quantity}
              </p>
            </div>
          </div>
          <p className="font-semibold text-gray-800">
            €{(product.price * product.quantity).toFixed(2)}
          </p>
        </div>
      ))}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Subtotal Restaurante</span>
          <span className="font-semibold text-gray-800">
            €{restaurantTotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Gastos de envío</span>
          <span className="font-semibold text-gray-800">
            €{deliveryFee.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">IVA Comida (10%)</span>
          <span className="font-semibold text-gray-800">
            €{foodIVA.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">IVA Envío (21%)</span>
          <span className="font-semibold text-gray-800">
            €{deliveryIVA.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center text-xl font-bold text-gray-800 mt-6">
          <span>Total</span>
          <span>€{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
