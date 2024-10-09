import { useEffect, useState, Fragment } from "react";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import HamburgerIcon from "@components/icons/navbar/HamburgerIcon";
import LocationIcon from "@components/icons/navbar/LocationIcon";
import MagnifyingGlassIcon from "@components/icons/navbar/MagnifyingGlassIcon";
import CartIcon from "@components/icons/navbar/CartIcon";
import CartPopover from "@components/sections/cart/CartPopover";
import { useCartStore2 } from "@/store/useCartStore2";
import useAuth from "@/hooks/useAuth";
import LoginModal from "@components/sections/LoginForm/LoginModal";
import { useLoginModalStore } from "@/store/useLoginModalStore";
import { useUserStore } from "@/store/useUserStore";
import UserAddressModal from "@components/sections/UserAddressModal";

export default function AppNavbar() {
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const cartProductCount = useCartStore2(
    (state) => state.cart?.products?.length ?? 0
  );
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { openModal } = useLoginModalStore();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const [browserSideCartProductCount, setBrowserSideCartProductCount] =
    useState<number>(0);

  useEffect(() => {
    setBrowserSideCartProductCount(cartProductCount ?? 0);
  }, [cartProductCount, browserSideCartProductCount, isAuthenticated]);

  const handleCartClick = () => {
    setPopoverVisible((prev) => !prev);
  };

  const handleClosePopover = () => {
    setPopoverVisible(false);
  };

  const handleOpenAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  return (
    <div className="flex justify-between items-center text-[21px] max-w-[1685px] mx-auto pt-[32px] pb-[29px]">
      <div className="flex gap-10">
        {/* Hamburger Icon */}
        <HamburgerIcon stroke="black" />
        {/* Location */}
        <div className="flex gap-2 items-center">
          <LocationIcon />
          Pontevedra
        </div>
      </div>
      {/* Pickup or Takeaway selection */}
      <div className="flex bg-[#d1d1d1] rounded-full items-center py-[5px] px-1.5 h-[53px] gap-1.5 select-none">
        <div className="flex px-[56px] items-center h-[43px] rounded-full bg-white shadow-sm">
          Domicilio
        </div>
        <div className="flex px-[56px] items-center h-[43px] rounded-full hover:bg-gray-200 cursor-pointer transition-colors duration-300">
          Recogida
        </div>
      </div>
      {/* Search bar */}
      <div className="flex bg-[#d1d1d1] rounded-full items-center py-[5px] h-[53px] gap-1.5 select-none px-[11px]">
        <MagnifyingGlassIcon />
        <input className="bg-[#d1d1d1] outline-none" placeholder="Buscar" />
      </div>
      {/* Cart */}
      <div
        className="relative cursor-pointer hover:opacity-70 transition-all duration-100"
        onClick={handleCartClick}
      >
        <CartIcon />
        <div className="absolute -top-2 -right-2 bg-teal-400 h-[31px] w-[31px] text-black font-bold rounded-full flex items-center justify-center">
          {browserSideCartProductCount}
        </div>
      </div>
      {isPopoverVisible && (
        <CartPopover isOpen={isPopoverVisible} onClose={handleClosePopover} />
      )}
      {/* Sign up and Sign in */}
      {isAuthenticated ? (
        <div className="flex items-center gap-4">
          <button
            onClick={handleOpenAddressModal}
            className="text-black hover:underline"
          >
            Welcome, {user?.name || user?.email}
          </button>
          <button
            onClick={logout}
            className="text-black bg-teal-400 rounded-full px-[26px] py-[13px] select-none hover:opacity-70 transition-all duration-100 cursor-pointer"
          >
            Logout
          </button>
        </div>
      ) : (
        <>
          <button onClick={() => openModal("register")} className="text-black">
            Regístrate
          </button>
          <button
            onClick={() => openModal("login")}
            className="text-black bg-teal-400 rounded-full px-[26px] py-[13px] select-none hover:opacity-70 transition-all duration-100 cursor-pointer"
          >
            Iniciar sesión
          </button>
        </>
      )}
      <LoginModal onClose={() => {}} />
      <UserAddressModal
        isOpen={isAddressModalOpen}
        onClose={handleCloseAddressModal}
      />
    </div>
  );
}
