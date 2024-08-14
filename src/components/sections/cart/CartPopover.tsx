import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useCartStore2 } from "@/store/useCartStore2";
import { Additional, CartProduct } from "@/types/CartProduct";

export default function CartPopover({ onClose }: { onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { cart, removeProduct, updateProductAdditionals } = useCartStore2();

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  const handleCheckout = () => {
    if (!cart || !cart.products || cart.products.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    const checkoutData = {
      company_id: cart.company_id,
      products: cart.products,
      total: calculateTotal(),
    };
    alert(JSON.stringify(checkoutData, null, 2));
  };

  const calculateProductTotal = (product: CartProduct): number => {
    const basePrice = product.price * product.quantity;
    const additionalsPrice =
      product.additionals?.reduce((sum: number, additional: Additional) => {
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

  const handleAdditionalQuantityChange = (
    productId: number,
    additionalId: bigint,
    change: number
  ) => {
    const product = cart?.products?.find((p) => p.p_id === productId);
    if (product) {
      const updatedAdditionals = product.additionals?.map((additional) =>
        additional.id === additionalId
          ? {
              ...additional,
              quantity: Math.max(0, (additional.quantity || 0) + change),
            }
          : additional
      );
      updateProductAdditionals(productId, updatedAdditionals || []);
    }
  };

  const handleRemoveAdditional = (productId: number, additionalId: bigint) => {
    const product = cart?.products?.find((p) => p.p_id === productId);
    if (product) {
      const updatedAdditionals = product.additionals?.filter(
        (additional) => additional.id !== additionalId
      );
      updateProductAdditionals(productId, updatedAdditionals || []);
    }
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
          {cart && cart.products && cart.products.length > 0 ? (
            cart.products.map((product) => (
              <div
                key={product.p_id}
                className="border-b border-gray-200 pb-2 mb-2"
              >
                <div className="flex items-center justify-between py-2 hover:bg-gray-100">
                  <div className="w-10 h-10 bg-gray-300 rounded"></div>
                  <div className="ml-4 flex-grow">
                    <span className="block font-semibold">{product.name}</span>
                    <span className="block text-gray-500">
                      ${product.price} x {product.quantity} = $
                      {product.price * product.quantity}
                    </span>
                  </div>
                  <div
                    className="cursor-pointer p-2 hover:text-red-500"
                    onClick={() => removeProduct(product.p_id)}
                  >
                    X
                  </div>
                </div>
                {product.additionals &&
                  product.additionals.length > 0 &&
                  product.additionals.map((additional) => (
                    <div
                      key={additional.id.toString()}
                      className="flex items-center justify-between pl-10 pr-2 py-2 hover:bg-gray-100"
                    >
                      <div className="flex-grow">
                        <span className="block text-sm font-medium text-gray-600">
                          {additional.name}
                        </span>
                        <span className="block text-sm text-gray-500">
                          ${additional.price.toString()} x {additional.quantity}{" "}
                          = $
                          {(
                            Number(additional.price) *
                            (additional.quantity || 0)
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-gray-600 hover:text-gray-800"
                          onClick={() =>
                            handleAdditionalQuantityChange(
                              product.p_id,
                              additional.id,
                              -1
                            )
                          }
                        >
                          -
                        </button>
                        <span className="text-sm">{additional.quantity}</span>
                        <button
                          className="text-gray-600 hover:text-gray-800"
                          onClick={() =>
                            handleAdditionalQuantityChange(
                              product.p_id,
                              additional.id,
                              1
                            )
                          }
                        >
                          +
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 ml-2"
                          onClick={() =>
                            handleRemoveAdditional(product.p_id, additional.id)
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
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
  );
}
