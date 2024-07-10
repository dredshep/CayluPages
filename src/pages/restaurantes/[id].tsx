import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { JoinedCompany } from "@/types/JoinedCompany";
import useFetch from "@/components/meta/hooks/useFetch";
import { useCartStore } from "@/store/useCartStore";
import AppNavbar from "@/components/sections/AppNavbar";
import Footer from "@/components/sections/Footer";
import CartSummary from "@/components/sections/company/CartSummary";
import CompanyHeader from "@/components/sections/company/CompanyHeader";
import FeaturedProducts from "@/components/sections/company/FeaturedProducts";
import ProductCategories from "@/components/sections/company/ProductCategories";
import getPlaceholderImageUrl from "@/utils/getPlaceholderImageUrl";
import useBusinessHours from "@/backend/hooks/useBusinessHours";
import { formatBusinessHours } from "@/backend/utils/formatBusinessHours";
import { handleAddToCart } from "@/utils/handleAddToCart";

export default function RestaurantMenu() {
  const router = useRouter();
  const { id } = router.query;
  const company = useFetch<JoinedCompany[]>(`/api/companies/${id}`);
  const [hours, setHours] = useState<string>("");
  const hoursObject = useBusinessHours(company?.[0] ?? null);

  useEffect(() => {
    if (company && company.length > 0) {
      const formattedHours = formatBusinessHours(hoursObject);
      setHours(formattedHours ?? "");
    }
  }, [company]);

  const banner = getPlaceholderImageUrl({
    width: 1685,
    height: 368,
    bgColor: "skyblue",
    textColor: "white",
  });
  const currentCompany = company?.[0];

  return currentCompany === undefined ? (
    <div>Company not found</div>
  ) : (
    <div className="bg-white min-h-screen max-w-[1685px] mx-auto pb-[194px]">
      <Head>
        <title>{currentCompany.name} - Restaurant Menu</title>
      </Head>
      <AppNavbar />
      <Image
        src={banner}
        width={1685}
        height={368}
        alt="Restaurant menu cover image"
      />
      <CompanyHeader company={currentCompany} hours={hours} />
      <CartSummary />
      <hr className="w-full h-0.5 bg-neutral-400 mt-[35px]" />
      <div className="mt-[55px] flex gap-[198px]">
        <ProductCategories
          categories={currentCompany.category_products || []}
        />
        <FeaturedProducts products={currentCompany.products || []} />
      </div>
    </div>
  );
}
