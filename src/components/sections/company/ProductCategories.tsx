import { FC } from "react";

interface ProductCategoriesProps {
  categories: { name: string }[];
}

const ProductCategories: FC<ProductCategoriesProps> = ({ categories }) => {
  return (
    <ul className="w-[300px] flex flex-col gap-[29px] text-[32px] font-semibold">
      {categories.map((category, index) => (
        <li key={index} className="cursor-pointer">{category.name}</li>
      ))}
    </ul>
  );
};

export default ProductCategories;
