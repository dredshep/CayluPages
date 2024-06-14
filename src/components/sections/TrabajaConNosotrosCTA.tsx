import Image from "next/image";
import table from "@/assets/frontpage/restaurant-table.png";
import biker from "@/assets/frontpage/biker-road.png";

export default function TrabajaconNosotrosCTA() {
  return (
    <div className="py-20 flex">
      {/* <div className="flex mx-auto items-center gap-[186px] max-w-max py-20">
        <Image
          className="w-[623px] h-[632px] object-cover"
          // src="https://via.assets.so/img.jpg?w=492&h=307&tc=coral&bg=lightgray"
          src={ciclista}
          width={623}
          height={632}
          alt="delivery guy vector"
          quality={100}
        />

        <div className="w-[710px] h-[476px] flex flex-col items-center">
          <div className="text-black 2xl:text-6xl 3xl:text-[70px] font-bold text-nowrap">
            ¡Trabaja con nosotros!
          </div>
          <div className="text-black text-[55px] font-normal whitespace-nowrap text-center">
            Contamos con un excelente equipo
            <br /> de trabajo.
          </div>
          <div className="flex flex-col gap-[31px] mt-[52px]">
            <div className="w-[345px] h-[116px] bg-orange-500 rounded-[16px] flex items-center justify-center font-bold py-30 px-27 ">
              <div className="text-black text-[39px] font-semibold whitespace-nowrap ">
                Regístrate acá
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="flex-1 relative">
        <Image src={table} alt="table" className="object-cover" style={{ width: "100%", height: "100%" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-60">
          <div className="text-3xl 3xl:text-5xl font-bold text-white text-center">Afilia tu comercio</div>
          <div className="flex justify-center mt-4">
            <div className="bg-[#F76A25] rounded-2xl py-3 px-28">
              <div className="text-black font-semibold">Información</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 relative">
        <Image src={biker} alt="biker" className="object-cover" style={{ width: "100%", height: "100%" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-60">
          <div className="text-3xl 3xl:text-5xl font-bold text-white text-center">¿Quieres trabajar de repartidor?</div>
          <div className="flex justify-center mt-4">
            <div className="bg-[#F76A25] rounded-2xl py-3 px-28">
              <div className="text-black font-semibold">Información</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
