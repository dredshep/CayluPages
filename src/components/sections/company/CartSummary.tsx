import { FC } from "react";
import { useCartStore2 } from "@/store/useCartStore2";

const CartSummary: FC = () => {
  const cartArray = useCartStore2.getState().cart?.products ?? [];

  return (
    <div className="flex justify-between items-center mt-[35px]">
      <h2 className="text-3xl font-bold">Cart</h2>
      <div className="flex gap-2 items-center">
        <p className="text-[29px] font-semibold">{cartArray.length}</p>
        <p className="text-[29px] text-gray-400">items in cart</p>
      </div>
    </div>
  );
};

export default CartSummary;
