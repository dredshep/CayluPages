import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useCartStore2 } from "@/store/useCartStore2";
import { CartProduct, Additional } from "@/types/CartProduct";
import getPlaceholderImageUrl from "@/utils/getPlaceholderImageUrl";
import Image from "next/image";

interface AddProductModalProps {
  product: CartProduct;
  onClose: () => void;
}

export default function AddProductModal({
  product,
  onClose,
}: AddProductModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { cart, addProduct, updateProductQuantity, updateProductAdditionals } =
    useCartStore2();
  const existingProduct = cart?.products?.find((p) => p.p_id === product.p_id);
  const [quantity, setQuantity] = useState<number>(
    existingProduct ? existingProduct.quantity : 1
  );
  const [additionalQuantities, setAdditionalQuantities] = useState<{
    [key: string]: number;
  }>(
    existingProduct
      ? existingProduct.additionals.reduce((acc, additional) => {
          acc[additional.id.toString()] = additional.quantity || 0;
          return acc;
        }, {} as { [key: string]: number })
      : {}
  );

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleAdditionalChange = (additionalId: bigint, change: number) => {
    setAdditionalQuantities((prev) => ({
      ...prev,
      [additionalId.toString()]: Math.max(
        0,
        (prev[additionalId.toString()] || 0) + change
      ),
    }));
  };

  const calculateTotalPrice = () => {
    const basePrice = product.price * quantity;
    const additionalsPrice = product.additionals.reduce((sum, additional) => {
      const quantity = additionalQuantities[additional.id.toString()] || 0;
      return sum + Number(additional.price) * quantity;
    }, 0);
    return basePrice + additionalsPrice;
  };

  const handleAddOrUpdateProduct = () => {
    const updatedAdditionals: Additional[] = product.additionals.map(
      (additional) => ({
        ...additional,
        quantity: additionalQuantities[additional.id.toString()] || 0,
      })
    );

    const updatedProduct = {
      ...product,
      quantity,
      additionals: updatedAdditionals,
    };

    if (existingProduct) {
      updateProductQuantity(product.p_id, quantity);
      updateProductAdditionals(product.p_id, updatedAdditionals);
    } else {
      addProduct(product.company_id, updatedProduct);
    }
    onClose();
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity duration-300">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl w-11/12 max-w-md p-6 animate-fade-in-up"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
          <button
            className="text-gray-500 hover:text-red-500 transition-colors duration-200"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex justify-center items-center mb-4">
          <Image
            src={
              product.image ||
              getPlaceholderImageUrl({
                width: 300,
                height: 200,
                bgColor: "e0e0e0",
                textColor: "757575",
              })
            }
            alt="Product"
            className="rounded-lg shadow-sm max-w-full h-auto"
            width={300}
            height={200}
          />
        </div>
        <div
          className={`flex items-center justify-between py-3 px-4 mb-4 ${
            existingProduct ? "bg-blue-400" : "bg-gray-100"
          } rounded-lg`}
        >
          <span className="text-lg font-medium text-gray-700">Quantity:</span>
          <div className="flex items-center">
            <button
              className="text-lg font-bold text-gray-600 hover:text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              onClick={() => handleQuantityChange(-1)}
            >
              -
            </button>
            <span className="mx-4 text-xl font-semibold">{quantity}</span>
            <button
              className="text-lg font-bold text-gray-600 hover:text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              onClick={() => handleQuantityChange(1)}
            >
              +
            </button>
          </div>
        </div>
        <div className="mb-4">
          {product.additionals.map((additional) => (
            <div
              key={additional.id.toString()}
              className="flex items-center justify-between py-2 px-4 mb-2 bg-gray-100 rounded-lg gap-3"
            >
              <span className="text-lg font-medium text-gray-700 flex justify-between items-center w-full">
                <span>{additional.name}</span>
                <span>
                  {additional.price.toString() +
                    " " +
                    (() => {
                      const curr = additional.currency;
                      switch (curr) {
                        case "EUR":
                          return "€";
                        case "USD":
                          return "$";
                        case "COP":
                          return "COL$";
                        default:
                          return curr;
                      }
                    })()}
                </span>
              </span>
              <div className="flex items-center">
                <button
                  className="text-lg font-bold text-gray-600 hover:text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => handleAdditionalChange(additional.id, -1)}
                >
                  -
                </button>
                <span className="mx-4 text-xl font-semibold">
                  {additionalQuantities[additional.id.toString()] || 0}
                </span>
                <button
                  className="text-lg font-bold text-gray-600 hover:text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  onClick={() => handleAdditionalChange(additional.id, 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-4 text-lg font-medium text-gray-700">
          Total Price: {calculateTotalPrice()} {product.currency}
        </div>
        <button
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 text-lg font-medium"
          onClick={handleAddOrUpdateProduct}
        >
          {existingProduct ? "Update Quantity" : "Add to Cart"}
        </button>
      </div>
    </div>,
    document.body
  );
}
