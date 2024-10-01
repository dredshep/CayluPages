import { FC, useState, useEffect } from "react";
import Image from "next/image";
import getPlaceholderImageUrl from "@/utils/getPlaceholderImageUrl";
import AddProductModal from "@/components/sections/cart/AddProductModal";
import ProductHoursModal from "@/components/sections/company/ProductHoursModal";
import { ApiProduct } from "@/pages/api/companies/[id]";
import { additionals, catalogue_sorts } from "@prisma/client";
import { useProductStore } from "@/store/product/useProductStore";
import moment from "moment";

interface FeaturedProductsProps {
  products: ApiProduct[];
  categoryProducts: { [key: string]: string };
}

const FeaturedProducts: FC<FeaturedProductsProps> = ({
  products,
  categoryProducts,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<ApiProduct | null>(
    null
  );
  const [productForHours, setProductForHours] = useState<ApiProduct | null>(
    null
  );
  const { products: storeProducts } = useProductStore();

  const handleOpenModal = (product: ApiProduct) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleOpenHoursModal = (product: ApiProduct) => {
    setProductForHours(product);
  };

  const handleCloseHoursModal = () => {
    setProductForHours(null);
  };

  return (
    <div className="flex gap-5 mt-[29px] gap-y-10 gap-x-[50px] flex-wrap">
      {products.map((product) => {
        const storeProduct = storeProducts[Number(product.company_id)]?.find(
          (p) => p.id === product.id
        );
        const isAvailable = storeProduct?.isAvailable ?? true;
        return (
          <div
            key={product.id.toString()}
            className="flex gap-5 flex-1 justify-between rounded-[10px] border-2 border-zinc-500 relative"
          >
            {!isAvailable && (
              <div className="absolute inset-0 bg-gray-500 bg-opacity-50 z-10 flex items-center justify-center rounded-[10px]">
                <span className="text-white font-bold">
                  Currently Unavailable
                </span>
              </div>
            )}
            <div className="flex flex-col max-w-[300px] justify-center px-[25px] relative z-20">
              <div
                className={`absolute top-0 left-0 rounded-lg text-gray-800 p-1 ${
                  product.additionals?.length && product.additionals?.length > 0
                    ? "bg-orange-400"
                    : "bg-gray-200"
                }`}
              >
                {product.additionals?.length} additionals
              </div>
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <div className="flex gap-2 items-center">
                <p className="text-base">{product.price.toString()}€</p>
              </div>
              <p className="text-[13px] text-gray-400">{product.description}</p>
              <button
                className={`mt-2 py-1 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                  !isAvailable ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => isAvailable && handleOpenModal(product)}
                disabled={!isAvailable}
              >
                Add to Cart
              </button>
              <button
                className="mt-2 py-1 px-4 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                onClick={() => handleOpenHoursModal(product)}
              >
                Show Product Hours
              </button>
            </div>
            <div className="w-[300px] h-[200px] rounded-r-[7px] overflow-hidden">
              <Image
                src={getPlaceholderImageUrl({
                  width: 300,
                  height: 200,
                  bgColor: "gray",
                  textColor: "black",
                })}
                width={300}
                height={200}
                alt={product.name}
                className="object-cover object-center h-full"
              />
            </div>
          </div>
        );
      })}
      {selectedProduct && (
        <AddProductModal
          product={{
            p_id: Number(selectedProduct.id),
            image: getPlaceholderImageUrl({
              width: 300,
              height: 200,
              bgColor: "e0e0e0",
              textColor: "757575",
            }),
            company_id: Number(selectedProduct.company_id),
            name: selectedProduct.name,
            price: parseFloat(selectedProduct.price.toString()),
            quantity: 1,
            currency: "EUR",
            additionals: selectedProduct.additionals?.map((apiAdditional) => ({
              ...apiAdditional,
              category_name: apiAdditional.category_products.name,
              category_id: Number(apiAdditional.category_products.id),
              sort: apiAdditional.catalogue_sorts?.sort,
            })),
          }}
          onClose={handleCloseModal}
        />
      )}
      {productForHours && (
        <ProductHoursModal
          productId={productForHours.id}
          companyId={productForHours.company_id}
          onClose={handleCloseHoursModal}
        />
      )}
    </div>
  );
};

export default FeaturedProducts;
