import Image from "next/image";
import StarIcon from "@/components/icons/StarIcon";
import AppNavbar from "@/components/sections/AppNavbar";
import Footer from "@/components/sections/Footer";
import useFetch from "@/components/meta/hooks/useFetch";
import { JoinedCompany } from "../api/companies";
import { useRouter } from "next/router";
import getPlaceholderImageUrl from "@/utils/getPlaceholderImageUrl";
import Head from "next/head";
import useBusinessHours from "@/backend/hooks/useBusinessHours";
import { formatBusinessHours } from "@/backend/utils/formatBusinessHours";

export default function RestaurantMenu() {
  // const { data: company, isLoading, error } = useFetch("/api/companies");
  const router = useRouter();
  // id comes from /pages/restaurantes/[id].tsx
  const { id } = router.query;
  const rawCompany = useFetch<[JoinedCompany]>("/api/companies/" + id);

  const company = rawCompany?.[0];
  const hoursObject = useBusinessHours(company ?? null);
  const hours = formatBusinessHours(hoursObject);
  const isLoading = false;
  const error = false;
  const banner = getPlaceholderImageUrl({
    width: 1685,
    height: 368,
    bgColor: "skyblue",
    textColor: "white",
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading company details!</div>;
  if (!company) return <div>No company data available.</div>;
  console.log({ company });

  return (
    <div className="bg-white min-h-screen max-w-[1685px] mx-auto pb-[194px]">
      <Head>
        <title>{company.name ?? "Company has no name"} - Restaurant Menu</title>
      </Head>
      <AppNavbar />
      {banner && (
        <Image
          src={banner}
          width={1685}
          height={368}
          alt="Restaurant menu cover image"
        />
      )}
      <div className="mt-[37px] flex justify-between items-end">
        <div className="flex flex-col gap-[14px]">
          <h1 className="text-4xl font-bold">
            {company.name ?? "Company has no name"}
          </h1>
          <p className="text-lg text-gray-400">
            {company.description ?? "No description"}
          </p>
        </div>
        <div className="flex flex-col gap-4 items-end">
          <div className="text-gray-400 flex gap-3 items-center text-[29px]">
            <p>
              {hours} |
              {
                //?.open.toString() ?? "Company has no business hours set"}
              }
              {/* company.business_hours?.join(", ") ??
                "Company has no business hours set" */}
              {/* {JSON.stringify(company.business_hours) ??
                "Company has no business hours set"} */}
            </p>
            <div className="flex gap-1 items-center">
              {5.5} <StarIcon />
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
          {/* Dynamically create list items based on company's product categories */}
          {company.category_products?.map((category, index) => (
            <li key={index} className="cursor-pointer">
              {category.name}
            </li>
          )) ?? <li>No product categories available</li>}
        </ul>
        <div>
          <div className="text-black text-5xl font-bold">Featured Products</div>
          <div className="flex gap-5 mt-[29px] gap-y-10 gap-x-[50px] flex-wrap">
            {company.products?.map((product, index) => (
              <div
                key={index}
                className="flex gap-5 flex-1 justify-between rounded-[10px] border-2 border-zinc-500"
              >
                <div className="flex flex-col max-w-[300px] justify-center px-[25px]">
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <div className="flex gap-2 items-center">
                    <p className="text-base">{product.price.toString()}</p>
                    <p className="text-gray-400 text-lg">€</p>
                  </div>
                  <p className="text-[13px] text-gray-400">
                    {product.description}
                  </p>
                </div>
                <div className="w-[300px] h-[163px] bg-gray-300 rounded-r-[7px] shrink-0 overflow-hidden">
                  <Image
                    src={
                      product.image ||
                      getPlaceholderImageUrl({
                        width: 300,
                        height: 163,
                        bgColor: "gray",
                        textColor: "black",
                      })
                    }
                    width={300}
                    height={163}
                    alt={product.name}
                    className="object-cover object-center h-full"
                  />
                </div>
              </div>
            )) ?? <div>No products available</div>}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
