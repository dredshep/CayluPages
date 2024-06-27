import StarIcon from "@/components/icons/StarIcon";
import getPlaceholderImageUrl from "@/utils/getPlaceholderImageUrl";
import hamburguesas from "@/dummyData/hamburguesas";
import Image from "next/image";
import AppNavbar from "@/components/sections/AppNavbar";
import Footer from "@/components/sections/Footer";
import banner from "@/assets/hamburguesas/banner.png";

export default function RestaurantMenu() {
  return (
    <div className="bg-white min-h-screen max-w-[1685px] mx-auto pb-[194px]">
      <AppNavbar />
      <Image
        src={banner}
        width={1685}
        height={368}
        alt="Restaurant menu cover image"
      />
      <div className="mt-[37px] flex justify-between items-end">
        <div className="flex flex-col gap-[14px]">
          <h1 className="text-4xl font-bold">Prime Burger</h1>
          <p className="text-lg text-gray-400">
            Hamburguesas, perros calientes y comida rápida
          </p>
        </div>
        <div className="flex flex-col gap-4 items-end">
          <div className="text-gray-400 flex gap-3 items-center text-[29px]">
            <p className="">Abierto 24 horas</p>
            <div className="flex gap-1 items-center">
              4.5 <StarIcon />
            </div>
          </div>
          <div className="flex bg-[#d1d1d1] rounded-full items-center py-[5px] px-1.5 h-[53px] gap-1.5 select-none text-2xl">
            <div className="flex px-[56px] items-center h-[43px] rounded-full bg-white shadow-sm">
              Domicilio
            </div>
            <div className="flex px-[56px] items-center h-[43px] rounded-full hover:bg-gray-200 cursor-pointer transition-colors duration-300">
              Recogida
            </div>
          </div>
        </div>
      </div>
      <hr className="w-full h-0.5 bg-neutral-400 mt-[35px]" />
      <div className="mt-[55px] flex gap-[198px]">
        <ul className="w-[300px] flex flex-col gap-[29px] text-[32px] font-semibold">
          <li className="underline">Hamburguesas</li>
          <li className="cursor-pointer">Menus</li>
          <li className="cursor-pointer">Perros calientes</li>
          <li className="cursor-pointer">Bocadillos</li>
          <li className="cursor-pointer">Bebidas</li>
          <li className="cursor-pointer">Postres</li>
        </ul>
        <div>
          <div className="text-black text-5xl font-bold">Hamburguesas</div>
          <div className="flex gap-5 mt-[29px] gap-y-10 gap-x-[50px] flex-wrap">
            {hamburguesas.map((hamburguesa, index) => (
              <div
                key={index}
                className="flex gap-5 flex-1 justify-between rounded-[10px] border-2 border-zinc-500"
              >
                <div className="flex flex-col max-w-[300px] justify-center px-[25px]">
                  <h2 className="text-lg font-semibold">{hamburguesa.name}</h2>
                  <div className="flex gap-2 items-center">
                    <p className="text-base">{hamburguesa.price}</p>
                    <p className="text-gray-400 text-lg">€</p>
                  </div>
                  <p className="text-[13px] text-gray-400">
                    {hamburguesa.description}
                  </p>
                </div>
                <div className="w-[300px] h-[163px] bg-gray-300 rounded-r-[7px] shrink-0 overflow-hidden">
                  <Image
                    src={hamburguesa.imageUrl}
                    width={300}
                    height={163}
                    alt={hamburguesa.name}
                    className="object-cover object-center h-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
