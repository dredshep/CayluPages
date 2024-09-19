import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCartStore2 } from "@/store/useCartStore2";
import { CartProduct } from "@/types/CartProduct";
import AddProductModal from "@/components/sections/cart/AddProductModal";
import { createOrder } from "@/services/orderService";

export default function CartPopover({ onClose }: { onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { cart, removeProduct } = useCartStore2();
  const [selectedProduct, setSelectedProduct] = useState<CartProduct | null>(
    null
  );

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  // const handleCheckout = () => {
  //   if (!cart || !cart.products || cart.products.length === 0) {
  //     alert("El carrito está vacío");
  //     return;
  //   }

  //   const checkoutData = {
  //     company_id: cart.company_id,
  //     products: cart.products,
  //     total: calculateTotal(),
  //   };
  //   alert(JSON.stringify(checkoutData, null, 2));
  // };

  const handleCheckout = async () => {
    if (!cart || !cart.products || cart.products.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    const checkoutData = {
      company_id: cart.company_id,
      products: cart.products,
    };

    const result = await createOrder(checkoutData);

    if (result.success) {
      alert(`Order created successfully with ID: ${result.orderId}`);
      // Redirect to payment or order confirmation page
    } else {
      alert(`Error creating order: ${result.error}`);
    }
  };

  const calculateProductTotal = (product: CartProduct): number => {
    const basePrice = product.price * product.quantity;
    const additionalsPrice =
      product.additionals?.reduce((sum: number, additional) => {
        return sum + Number(additional.price) * (additional.quantity || 0);
      }, 0) || 0;
    return basePrice + additionalsPrice;
  };

  const calculateTotal = (): number => {
    if (!cart || !cart.products) {
      return 0;
    }
    return cart.products.reduce(
      (sum: number, product: CartProduct) =>
        sum + calculateProductTotal(product),
      0
    );
  };

  const openProductModal = (product: CartProduct) => {
    setSelectedProduct(product);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {selectedProduct && (
        <AddProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
      {createPortal(
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
              {cart && cart.products && cart.products.length > 0 ? (
                cart.products.map((product) => (
                  <div
                    key={product.p_id}
                    className="border-b border-gray-200 pb-2 mb-2"
                    onClick={() => openProductModal(product)}
                  >
                    <div className="flex items-center justify-between py-2 hover:bg-gray-100 cursor-pointer">
                      <div className="w-10 h-10 bg-gray-300 rounded"></div>
                      <div className="ml-4 flex-grow">
                        <span className="block font-semibold">
                          {product.name}
                        </span>
                        <span className="block text-gray-500">
                          ${product.price} x {product.quantity} = $
                          {product.price * product.quantity}
                        </span>
                      </div>
                      <div
                        className="cursor-pointer p-2 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the modal when deleting
                          removeProduct(product.p_id);
                        }}
                      >
                        X
                      </div>
                    </div>
                    {product.additionals && product.additionals.length > 0 && (
                      <div className="pl-10 pr-2 py-2">
                        {product.additionals.map((additional) => (
                          <div
                            key={additional.id.toString()}
                            className="text-sm text-gray-600"
                          >
                            {additional.name}: ${additional.price.toString()} x{" "}
                            {additional.quantity} = $
                            {(
                              Number(additional.price) *
                              (additional.quantity || 0)
                            ).toFixed(2)}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="text-right font-bold text-sm mt-2">
                      Subtotal: ${calculateProductTotal(product).toFixed(2)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  El carrito está vacío
                </div>
              )}
            </div>
            {cart && cart.products && cart.products.length > 0 && (
              <>
                <div className="text-right font-bold text-lg mb-4">
                  Total: ${calculateTotal().toFixed(2)}
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
      )}
    </>
  );
}
