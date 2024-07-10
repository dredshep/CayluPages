// src/components/sections/company/FeaturedProducts.tsx
import { FC, useState } from "react";
import Image from "next/image";
import { products as ProductType } from "@prisma/client";
import getPlaceholderImageUrl from "@/utils/getPlaceholderImageUrl";
import AddProductModal from "@/components/sections/cart/AddProductModal";

interface FeaturedProductsProps {
  products: ProductType[];
}

const FeaturedProducts: FC<FeaturedProductsProps> = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null
  );

  const handleOpenModal = (product: ProductType) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="flex gap-5 mt-[29px] gap-y-10 gap-x-[50px] flex-wrap">
      {products.map((product) => (
        <div
          key={product.id.toString()}
          className="flex gap-5 flex-1 justify-between rounded-[10px] border-2 border-zinc-500"
        >
          <div className="flex flex-col max-w-[300px] justify-center px-[25px]">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <div className="flex gap-2 items-center">
              <p className="text-base">{product.price.toString()}€</p>
            </div>
            <p className="text-[13px] text-gray-400">{product.description}</p>
            <button
              className="mt-2 py-1 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={() => handleOpenModal(product)}
            >
              Add to Cart
            </button>
          </div>
          <div className="w-[300px] h-[163px] rounded-r-[7px] overflow-hidden">
            <Image
              src={
                product.image ||
                getPlaceholderImageUrl({
                  width: 300,
                  height: 163,
                  bgColor: "gray",
                  textColor: "black",
                })
              }
              width={300}
              height={163}
              alt={product.name}
              className="object-cover object-center h-full"
            />
          </div>
        </div>
      ))}
      {selectedProduct && (
        <AddProductModal
          product={{
            p_id: Number(selectedProduct.id),
            image: selectedProduct.image ?? undefined,
            company_id: Number(selectedProduct.company_id),
            name: selectedProduct.name,
            price: parseFloat(selectedProduct.price.toString()),
            quantity: 1, // Default quantity, AddProductModal will handle actual quantity updates
            currency: "EUR", // Assume currency, modify as needed
            opts: {}, // Placeholder for additional options
          }}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default FeaturedProducts;
