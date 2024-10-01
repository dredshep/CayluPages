import { useState, Fragment } from "react";
import { useRouter } from "next/router";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useCartStore2 } from "@/store/useCartStore2";
import { CartProduct } from "@/types/CartProduct";
import AddProductModal from "@/components/sections/cart/AddProductModal";

export default function CartPopover({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { cart, removeProduct } = useCartStore2();
  const [selectedProduct, setSelectedProduct] = useState<CartProduct | null>(
    null
  );

  const handleGoToSummary = () => {
    onClose(); // Close the cart popover
    router.push("/compra/resumen"); // Navigate to the summary page
  };

  const openProductModal = (product: CartProduct) => {
    setSelectedProduct(product);
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

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40" onClose={onClose}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Carrito
                  </Dialog.Title>
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
                          {product.additionals &&
                            product.additionals.length > 0 && (
                              <div className="pl-10 pr-2 py-2">
                                {product.additionals.map((additional) => (
                                  <div
                                    key={additional.id.toString()}
                                    className="text-sm text-gray-600"
                                  >
                                    {additional.name}: $
                                    {additional.price.toString()} x{" "}
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
                            Subtotal: $
                            {calculateProductTotal(product).toFixed(2)}
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
                        onClick={handleGoToSummary}
                      >
                        Ir a Resumen
                      </button>
                    </>
                  )}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      <AddProductModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </>
  );
}
