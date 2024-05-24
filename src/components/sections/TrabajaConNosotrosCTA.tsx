import Image from "next/image";
import ciclista from "@/assets/frontpage/ciclista.svg";

export default function TrabajaconNosotrosCTA() {
  return (
    <div className="bg-teal-400 py-20">
      <div className="flex mx-auto items-center gap-[186px] max-w-max py-20">
        <Image
          className="w-[623px] h-[632px]"
          // src="https://via.assets.so/img.jpg?w=492&h=307&tc=coral&bg=lightgray"
          src={ciclista}
          width={623}
          height={632}
          alt="delivery guy vector"
          quality={100}
        />

        <div className="w-[710px] h-[476px] flex flex-col items-center">
          <div className="text-black text-[70px] font-bold text-nowrap">
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
      </div>
    </div>
  );
}
