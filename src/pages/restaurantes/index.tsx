import Link from "next/link";
import CaretLeft from "@components/icons/restaurantes/CaretLeft";
import CaretRight from "@components/icons/restaurantes/CaretRight";
import ChineseFoodIcon from "@components/icons/restaurantes/foodCategories/ChineseFoodIcon";
import AmericanFoodIcon from "@components/icons/restaurantes/foodCategories/AmericanFoodIcon";
import DessertsIcon from "@components/icons/restaurantes/foodCategories/DessertsIcon";
import SushiIcon from "@components/icons/restaurantes/foodCategories/SushiIcon";
import ArrocesIcon from "@components/icons/restaurantes/foodCategories/ArrocesIcon";
import PuntosSuspensivosIcon from "@components/icons/restaurantes/foodCategories/PuntosSuspensivosIcon";
import RestaurantGrid from "@components/sections/restaurants/RestaurantGrid";
import Footer from "@/components/sections/Footer";
import AppNavbar from "@/components/sections/AppNavbar";

function RoundCategory({
  href,
  Icon,
  caption,
}: Readonly<{
  href: string;
  Icon: React.ReactNode;
  caption: string;
}>) {
  return (
    <div className="flex flex-col items-center">
      <Link
        className="w-[175.43px] h-[175.43px] bg-teal-400 rounded-full flex items-center justify-center"
        href={href}
      >
        {Icon}
      </Link>
      <p className="text-center mt-2 text-[21px] font-semibold">{caption}</p>
    </div>
  );
}

export default function Restaurantes() {
  return (
    <div className="bg-white min-h-screen pb-[106px]">
      <AppNavbar />
      <div className="flex items-center justify-between mt-[calc(142px-32px)]">
        <CaretLeft />
        <RoundCategory
          href="#"
          Icon={<ChineseFoodIcon />}
          caption="Comida china"
        />
        <RoundCategory
          href="#"
          Icon={<AmericanFoodIcon />}
          caption="Americana"
        />
        <RoundCategory href="#" Icon={<DessertsIcon />} caption="Postres" />
        <RoundCategory href="#" Icon={<SushiIcon />} caption="Sushi" />
        <RoundCategory href="#" Icon={<ArrocesIcon />} caption="Arroces" />
        <RoundCategory
          href="#"
          Icon={<PuntosSuspensivosIcon />}
          caption="Ver todas"
        />

        <CaretRight />
      </div>
      <div className="h-[132px]"></div>
      <RestaurantGrid />
    </div>
  );
}
