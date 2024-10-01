import Image, { StaticImageData } from "next/image";
import StarIcon from "@components/icons/StarIcon";
import { HTMLAttributes } from "react";
import cn from "classnames";
import moment from "moment";
import { useCompanyStore } from "@/store/company/useCompanyStore";

interface CommonDivProps extends HTMLAttributes<HTMLDivElement> {
  additionalClasses?: string;
}

const SecondaryText: React.FC<CommonDivProps> = ({
  children,
  additionalClasses,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn(
        "text-neutral-500 text-[22px] 3xl:text-[28px]",
        additionalClasses
      )}
    >
      {children}
    </div>
  );
};

interface RestaurantCardProps {
  imageUrl: string | StaticImageData;
  altText: string;
  name: string;
  rating: number;
  cuisineType: string;
  deliveryTime: string;
  height?: number;
  width?: number;
  companyId: number;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  imageUrl,
  altText,
  name,
  rating,
  cuisineType,
  deliveryTime,
  height = 409,
  width = 492,
  companyId,
}) => {
  const { availableCompanies } = useCompanyStore();
  const company = availableCompanies.find((c) => c.id === companyId);
  const isAvailable = !!company;

  const getTimeInfo = () => {
    if (!company) return { openTime: "", closeTime: "", closingSoon: "" };
    const now = moment();
    const openTime = moment(company.business_hours[0].open, "HH:mm:ss");
    const closeTime = moment(company.business_hours[0].close, "HH:mm:ss");
    const minutesUntilClose = closeTime.diff(now, "minutes");
    const closingSoon =
      minutesUntilClose <= 60 ? `Closing in ${minutesUntilClose} minutes` : "";
    return {
      openTime: openTime.format("HH:mm"),
      closeTime: closeTime.format("HH:mm"),
      closingSoon,
    };
  };

  const { openTime, closeTime, closingSoon } = getTimeInfo();

  return (
    <div className={`flex flex-col ${!isAvailable ? "opacity-50" : ""}`}>
      <div className="overflow-hidden rounded-[14px] shadow-xl relative">
        <Image
          className="w-full rounded-[14px] scale-[111%] bg-red-400"
          src={imageUrl}
          alt={altText}
          width={width}
          height={Math.ceil(height * 0.75)}
          quality={100}
        />
        {/* {!isAvailable && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              Currently Unavailable
            </span>
          </div>
        )} */}
      </div>
      <div className="max-h-max leading-5 3xl:leading-[1.324] flex flex-col items-center mt-3 gap-2">
        <div className="flex justify-between w-full flex-row">
          <div className="text-black leading-[36px] text-[40px] font-bold whitespace-nowrap">
            {name}
          </div>
          <div className="flex justify-end items-center">
            <SecondaryText>{rating.toFixed(1)}</SecondaryText>
            <StarIcon width="18" height="18" className="ml-2" />
          </div>
        </div>
        <div className="flex flex-row w-full justify-between">
          <SecondaryText additionalClasses="whitespace-nowrap">
            {cuisineType}
          </SecondaryText>
          <SecondaryText additionalClasses="justify-self-end place-self-end">
            {deliveryTime}
          </SecondaryText>
        </div>
        {isAvailable && (
          <>
            <SecondaryText additionalClasses="w-full">
              Open: {openTime} - {closeTime}
            </SecondaryText>
            {closingSoon && (
              <SecondaryText additionalClasses="w-full text-red-500">
                {closingSoon}
              </SecondaryText>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RestaurantCard;
