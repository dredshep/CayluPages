import Link from "next/link";
import HamburgerIcon from "@components/icons/navbar/HamburgerIcon";
import LocationIcon from "@components/icons/navbar/LocationIcon";
import MagnifyingGlassIcon from "@components/icons/navbar/MagnifyingGlassIcon";
import CartIcon from "@components/icons/navbar/CartIcon";

export default function AppNavbar() {
  return (
    <div className="flex justify-between items-center text-[21px] max-w-[1685px] mx-auto pt-[32px] pb-[29px]">
      <div className="flex gap-10">
        {/* Hamburger Icon */}
        <HamburgerIcon stroke="black" />
        {/* Location */}
        <Link href="/" className="flex gap-2 items-center">
          <LocationIcon />
          Pontevedra
        </Link>
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
      <div className="relative">
        <CartIcon />
        <div className="absolute -top-2 -right-2 bg-teal-400 h-[31px] w-[31px] text-black font-bold rounded-full flex items-center justify-center">
          0
        </div>
      </div>
      {/* Sign up and Sign in */}
      <Link href="/signup" className="text-black">
        Regístrate
      </Link>
      <Link
        href="/signin"
        className="text-black bg-teal-400 rounded-full px-[26px] py-[13px]"
      >
        Iniciar sesión
      </Link>
    </div>
  );
}
