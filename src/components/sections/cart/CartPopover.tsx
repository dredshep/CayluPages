import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useCartStore } from "@/store/useCartStore";

export default function CartPopover({ onClose }: { onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { cart, removeProduct } = useCartStore();

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  const handleCheckout = () => {
    if (!cart || cart.products.length === 0) {
      alert("El carrito está vacío");
      return;
    }
    
    const checkoutData = {
      company_id: cart.company_id,
      products: cart.products,
      total: cart.products.reduce((sum, product) => sum + product.price * product.quantity, 0),
    };
    alert(JSON.stringify(checkoutData, null, 2));
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Carrito</h2>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            X
          </button>
        </div>
        <div className="mb-4">
          {cart && cart.products.length > 0 ? (
            cart.products.map((product) => (
              <div
                key={product.p_id}
                className="flex items-center justify-between py-2 border-b border-gray-200 hover:bg-gray-100"
              >
                <div className="w-10 h-10 bg-gray-300 rounded"></div>
                <div className="ml-4 flex-grow">
                  <span className="block font-semibold">{product.name}</span>
                  <span className="block text-gray-500">
                    ${product.price} x {product.quantity}
                  </span>
                </div>
                <div
                  className="cursor-pointer p-2 hover:text-red-500"
                  onClick={() => removeProduct(product.p_id)}
                >
                  X
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">El carrito está vacío</div>
          )}
        </div>
        {cart && cart.products.length > 0 && (
          <>
            <div className="text-right font-bold text-lg mb-4">
              Total: ${cart.products.reduce((sum, product) => sum + product.price * product.quantity, 0)}
            </div>
            <button
              className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600"
              onClick={handleCheckout}
            >
              Ir a Pagar
            </button>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
