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
import { ApiCompany } from "../api/companies/[id]";

type RestaurantMenuProps = {
  company: ApiCompany | null;
  hours: string;
};

export default function RestaurantMenu({
  company,
  hours,
}: RestaurantMenuProps) {
  if (!company) {
    return <div>Company not found</div>;
  }

  const banner = getPlaceholderImageUrl({
    width: 1685,
    height: 368,
    bgColor: "skyblue",
    textColor: "white",
  });

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
      <CompanyHeader company={company} hours={hours} />
      <CartSummary />
      <hr className="w-full h-0.5 bg-neutral-400 mt-[35px]" />
      <div className="mt-[55px] flex gap-[198px]">
        <ProductCategories categories={company.category_products || []} />
        <FeaturedProducts products={company.products || []} />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const { req } = context;

  if (!id) {
    return {
      notFound: true,
    };
  }

  try {
    // Get the host (e.g., localhost:3000, caylu-deployment-commit12451243.vercel.app)
    const host = req.headers.host;
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const baseUrl = `${protocol}://${host}`;

    // Use the base URL to construct the full API endpoint
    const res = await fetch(`${baseUrl}/api/companies/${id}`);

    if (!res.ok) {
      return {
        notFound: true,
      };
    }

    const company: ApiCompany = await res.json();
    const hoursObject = formatBusinessHours(company.business_hours[0]);

    return {
      props: {
        company: company ?? null,
        hours: hoursObject ?? "",
      },
    };
  } catch (error) {
    console.error("Error fetching company data:", error);
    return {
      notFound: true,
    };
  }
};
