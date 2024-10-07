import React, { Fragment } from "react";
import { useState, useEffect } from "react";
import { useCartStore2 } from "@/store/useCartStore2";
import { CartProduct, CartAdditional } from "@/types/CartProduct";
import getPlaceholderImageUrl from "@/utils/getPlaceholderImageUrl";
import Image from "next/image";
import { Dialog, Transition, TransitionChild } from "@headlessui/react";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: CartProduct | null;
}

export default function AddProductModal({
  isOpen,
  onClose,
  product,
}: AddProductModalProps) {
  if (!product) return null;

  const { cart, addProduct, updateProductQuantity, updateProductAdditionals } =
    useCartStore2();
  const existingProduct = cart?.products?.find((p) => p.p_id === product.p_id);
  const [quantity, setQuantity] = useState<number>(
    existingProduct ? existingProduct.quantity : 1
  );

  const [additionalQuantities, setAdditionalQuantities] = useState<{
    [key: string]: number;
  }>(
    existingProduct?.additionals
      ? existingProduct.additionals.reduce((acc, additional) => {
          acc[additional.id.toString()] = additional.quantity || 0;
          return acc;
        }, {} as { [key: string]: number })
      : {}
  );

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleAdditionalChange = (additionalId: number, change: number) => {
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
    const additionalsPrice = (product.additionals || []).reduce(
      (sum, additional) => {
        const quantity = additionalQuantities[additional.id.toString()] || 0;
        return sum + Number(additional.price) * quantity;
      },
      0
    );
    return basePrice + additionalsPrice;
  };

  const handleAddOrUpdateProduct = () => {
    const updatedAdditionals: CartAdditional[] = (
      product.additionals || []
    ).map((additional) => ({
      ...additional,
      quantity: additionalQuantities[additional.id.toString()] || 0,
    }));

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
    if (isOpen) {
      setQuantity(existingProduct ? existingProduct.quantity : 1);
      setAdditionalQuantities(
        existingProduct?.additionals
          ? existingProduct.additionals.reduce((acc, additional) => {
              acc[additional.id.toString()] = additional.quantity || 0;
              return acc;
            }, {} as { [key: string]: number })
          : {}
      );
    }
  }, [isOpen, existingProduct]);

  // Group the additionals by category and sort them by catalogue_sorts.sort
  const groupedAdditionals = product.additionals?.reduce((acc, additional) => {
    const categoryName = additional.category_products.name || "Other";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(additional);
    return acc;
  }, {} as { [key: string]: CartAdditional[] });

  // Sort the additionals in each category by the sort number
  if (groupedAdditionals) {
    Object.keys(groupedAdditionals).forEach((categoryName) => {
      groupedAdditionals[categoryName].sort(
        (a, b) =>
          (a.catalogue_sorts[0]?.sort || 0) - (b.catalogue_sorts[0]?.sort || 0)
      );
    });
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {product.name}
                </Dialog.Title>
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
                  <span className="text-lg font-medium text-gray-700">
                    Quantity:
                  </span>
                  <div className="flex items-center">
                    <button
                      className="text-lg font-bold text-gray-600 hover:text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                      onClick={() => handleQuantityChange(-1)}
                    >
                      -
                    </button>
                    <span className="mx-4 text-xl font-semibold">
                      {quantity}
                    </span>
                    <button
                      className="text-lg font-bold text-gray-600 hover:text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                      onClick={() => handleQuantityChange(1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  {groupedAdditionals
                    ? Object.entries(groupedAdditionals).map(
                        ([categoryName, additionals], i) => (
                          <div key={categoryName}>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                              {categoryName}
                            </h3>
                            {additionals.map((additional) => (
                              <div
                                key={additional.id.toString()}
                                className="flex items-center justify-between py-2 px-4 mb-2 bg-gray-100 rounded-lg gap-3"
                              >
                                <span className="text-lg font-medium text-gray-700 flex justify-between items-center w-full">
                                  <span>{additional.name} </span>
                                  <span>
                                    {additional.price.toString() + " €"}
                                  </span>
                                </span>
                                <div className="flex items-center">
                                  <button
                                    className="text-lg font-bold text-gray-600 hover:text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                    onClick={() =>
                                      handleAdditionalChange(additional.id, -1)
                                    }
                                  >
                                    -
                                  </button>
                                  <span className="mx-4 text-xl font-semibold">
                                    {additionalQuantities[
                                      additional.id.toString()
                                    ] || 0}
                                  </span>
                                  <button
                                    className="text-lg font-bold text-gray-600 hover:text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                    onClick={() =>
                                      handleAdditionalChange(additional.id, 1)
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      )
                    : null}
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
              </Dialog.Panel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
