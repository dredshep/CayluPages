import Head from "next/head";
import Image from "next/image";
import AppNavbar from "@/components/sections/AppNavbar";
import CartSummary from "@/components/sections/company/CartSummary";
import CompanyHeader from "@/components/sections/company/CompanyHeader";
import FeaturedProducts from "@/components/sections/company/FeaturedProducts";
import ProductCategories from "@/components/sections/company/ProductCategories";
import getPlaceholderImageUrl from "@/utils/getPlaceholderImageUrl";
import { formatBusinessHours } from "@/backend/utils/formatBusinessHours";
import { GetServerSideProps } from "next";
import { ApiCompany, ApiProduct } from "../api/companies/[id]";
import { useEffect } from "react";
import { useCompanyStore } from "@/store/company/useCompanyStore";
import { useProductStore } from "@/store/product/useProductStore";

type RestaurantMenuProps = {
  companyId: number;
};

export default function RestaurantMenu({ companyId }: RestaurantMenuProps) {
  const { fetchCompany } = useCompanyStore();
  const { fetchProducts, products, checkAvailability } = useProductStore();

  useEffect(() => {
    const loadData = async () => {
      await fetchCompany(companyId);
      await fetchProducts(companyId);
      await checkAvailability(companyId);
    };
    loadData();
  }, [companyId]);

  const company = useCompanyStore((state) =>
    state.companies.find((c) => c.id === companyId)
  );
  const companyProducts = products[companyId] || [];

  if (!company) {
    return <div>Loading...</div>;
  }

  const banner = getPlaceholderImageUrl({
    width: 1685,
    height: 368,
    bgColor: "skyblue",
    textColor: "white",
  });

  const hours = formatBusinessHours(company.business_hours[0]);

  return (
    <div className="bg-white min-h-screen max-w-[1685px] mx-auto pb-[194px]">
      <Head>
        <title>{String(`${company.name} - Restaurant Menu`)}</title>
      </Head>
      <AppNavbar />
      <Image
        src={banner}
        width={1685}
        height={368}
        alt="Restaurant menu cover image"
      />
      <CompanyHeader company={company} hours={hours || ""} />
      <CartSummary />
      <hr className="w-full h-0.5 bg-neutral-400 mt-[35px]" />
      <div className="mt-[55px] flex gap-[198px]">
        <ProductCategories categories={company.category_products} />
        <FeaturedProducts products={companyProducts} categoryProducts={{}} />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  if (!id || typeof id !== "string") {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      companyId: parseInt(id),
    },
  };
};
