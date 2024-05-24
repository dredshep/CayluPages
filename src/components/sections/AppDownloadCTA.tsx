import getPlaceholderImageUrl from "@/utils/getPlaceholderImageUrl";
import Image from "next/image";
import PlayStoreIcon from "../icons/PlaystoreIcon";
import AppleIcon from "../icons/AppleIcon";

export default function AppDownloadCTA() {
  return (
    <div className="py-20 relative mb-16">
      <div className="w-[1208px] h-[678px] flex justify-start mx-auto items-center gap-[186px] py-20 ">
        <svg
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 left-0 bg-white fill-teal-400 z-[-1] h-screen w-full"
        >
          <path d="M1920 0L-19 905H1920V0Z" />
        </svg>

        <div className="block">
          <Image
            className="w-[312px] h-[678px]"
            // src="https://via.assets.so/img.jpg?w=492&h=307&tc=coral&bg=lightgray"
            src={getPlaceholderImageUrl({ width: 312, height: 678 })}
            width={312}
            height={678}
            alt="phone"
            quality={100}
          />
        </div>
        <div className="w-[710px] h-[476px] flex flex-col items-center">
          <div className="text-black text-[70px] font-bold text-nowrap">
            Descarga nuestra app
          </div>
          <div className="text-black text-[55px] font-normal">
            ordena mas rápido
          </div>
          <div className="flex flex-col gap-[31px] mt-[52px]">
            <div className="w-[345px] h-[116px] bg-white rounded-[25px] border-2 border-black flex items-center justify-between px-[45px] ">
              <AppleIcon />
              <div className="text-black text-[32px] font-semibold whitespace-nowrap">
                Disponible <br />
                para Apple
              </div>
            </div>
            <div className="w-[345px] h-[116px] bg-white rounded-[25px] border-2 border-black flex items-center justify-between pl-[41px] pr-[28px]">
              <PlayStoreIcon />
              <div className="text-center text-black text-[32px] font-semibold whitespace-nowrap">
                Disponible <br />
                para Android
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
