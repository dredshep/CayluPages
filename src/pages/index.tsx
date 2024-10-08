import Link from "next/link";
import LocationIcon from "@components/icons/navbar/LocationIcon";
import HamburgerIcon from "@components/icons/navbar/HamburgerIcon";
import RestaurantCard from "@components/cards/RestaurantCard";
import { popularEnTuZona, ofertasDeHoy } from "@/dummyData/frontpageCardData";
import TrabajaconNosotrosCTA from "@components/sections/TrabajaConNosotrosCTA";
import ReviewCard from "@components/cards/ReviewCard";
import reviews from "@/dummyData/reviews";
import LoginModal from "@/components/sections/LoginForm/LoginModal";
import { useLoginModalStore } from "@/store/useLoginModalStore";
import useAuth from "@/hooks/useAuth";

function Navbar() {
  const { openModal } = useLoginModalStore();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav>
      <div className="flex justify-between h-32 items-center px-10">
        <div>
          <HamburgerIcon className="" />
        </div>
        <div className="flex gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="text-xl font-semibold bg-teal-400 rounded-full px-[26px] py-[13px] select-none cursor-pointer hover:brightness-110 transition-all duration-100">
                Mi Cuenta
              </div>
              <button
                onClick={logout}
                className="text-xl font-semibold bg-white rounded-full px-[26px] py-[13px] select-none hover:brightness-90 transition-all duration-100 cursor-pointer"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <>
              <div
                onClick={() => openModal("register")}
                className="text-xl font-semibold bg-white rounded-full px-[26px] py-[13px] select-none hover:brightness-90 transition-all duration-100 cursor-pointer"
              >
                Regístrate
              </div>
              <div
                onClick={() => openModal("login")}
                className="text-xl font-semibold bg-teal-400 rounded-full px-[26px] py-[13px] select-none cursor-pointer hover:brightness-110 transition-all duration-100"
              >
                Iniciar sesión
              </div>
            </>
          )}
        </div>
      </div>
      <LoginModal onClose={() => {}} />
    </nav>
  );
}

export default function Home() {
  return (
    <div className="bg-white">
      <div className="min-h-screen  bg-frontpage-banner bg-cover h-full">
        <Navbar />
        <div className="flex flex-col justify-center h-[calc(100vh-128px)] w-full px-[129px] gap-6">
          <h1 className="text-white text-5xl xl:text-6xl 2xl:text-7xl font-bold">
            Lo mejor, ¡cerca de ti!
          </h1>
          <div className="flex gap-5">
            <div className="flex bg-white">
              <div className="h-[97px] w-[97px] flex items-center justify-center">
                <LocationIcon className="text-black h-11 w-11" />
              </div>
              <input
                className="w-[600px] 2xl:w-[860px] h-[97px] bg-white text-[34px] outline-none"
                placeholder="Paseo Prai de Silgar, 3, Sanxenxo"
              />
            </div>
            <Link
              href="/restaurantes"
              className="bg-teal-400 text-black text-4xl py-[25px] px-[57px] rounded-[11px] flex items-center"
            >
              Buscar
            </Link>
          </div>
        </div>
      </div>
      <div className="pt-[88px] pb-[73px] flex flex-col justify-center h-full w-full px-[129px] gap-[71px]">
        <h1 className="text-black text-7xl font-bold mx-auto leading-normal">
          Popular en tu zona
        </h1>
        <div className="flex gap-5 flex-wrap">
          {popularEnTuZona.map((restaurant, index) => (
            <div key={index} className="flex-1 px-2 mb-4">
              <RestaurantCard {...restaurant} companyId={1} />
            </div>
          ))}
        </div>
      </div>
      <hr className="w-full h-0.5 bg-neutral-400" />

      <div className="flex flex-col justify-center h-full w-full px-[129px] gap-[71px] mt-[31px]">
        <h1 className="text-black text-7xl font-bold mx-auto leading-normal">
          Ofertas de hoy
        </h1>
        <div className="flex gap-5 flex-wrap">
          {ofertasDeHoy.map((restaurant, index) => (
            <div key={index} className="flex-1 px-2 mb-4">
              <RestaurantCard {...restaurant} companyId={1} />
            </div>
          ))}
        </div>
      </div>

      <hr className="w-full h-0.5 bg-neutral-400 mt-[51px]" />
      <TrabajaconNosotrosCTA />
      <div className="w-full mb-12">
        <div className="flex flex-col justify-center h-full w-full px-[129px] gap-[71px]">
          <h1 className="text-black text-7xl font-bold mx-auto">
            Nuestras reseñas
          </h1>
          <div className="flex gap-5 flex-wrap justify-center">
            {reviews.map((review, index) => (
              <ReviewCard review={review} key={index} />
            ))}
          </div>
          <button className="bg-teal-400 font-bold mx-auto text-black text-4xl p-[30px] rounded-[11px]">
            Déjanos un comentario
          </button>
        </div>
      </div>
    </div>
  );
}
