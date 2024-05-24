import Image from "next/image";
import StarIcon from "@components/icons/StarIcon";

// Define a type for the props that your component will accept
interface RestaurantCardProps {
  imageUrl: string;
  altText: string;
  name: string;
  rating: number;
  cuisineType: string;
  deliveryTime: string;
  height?: number; // Optional prop with default value
  width?: number; // Optional prop with default value
}

// Functional component using destructured props for better readability
const RestaurantCard: React.FC<RestaurantCardProps> = ({
  imageUrl,
  altText,
  name,
  rating,
  cuisineType,
  deliveryTime,
  height = 409, // Default height if not provided
  width = 492, // Default width if not provided
}) => {
  return (
    <div style={{ width: `${width}px` }} className="flex flex-col">
      <Image
        className="w-full rounded-[14px] shadow-xl"
        src={imageUrl}
        alt={altText}
        width={width}
        height={Math.ceil(height * 0.75)}
        quality={100}
      />
      <div className="max-h-max leading-[1.324]">
        <div className="flex flex-col items-center mt-3">
          <div className="flex justify-between w-full flex-row">
            <div className="text-black text-[40px] font-bold whitespace-nowrap">
              {name}
            </div>
            <div className="flex justify-end items-center">
              <div className="text-neutral-500 text-[28px]">
                {rating.toFixed(1)}
              </div>
              <StarIcon width="18" height="18" className="ml-2" />
            </div>
          </div>
          <div className="flex flex-row w-full justify-between">
            <div className="text-neutral-500 text-[28px] whitespace-nowrap">
              {cuisineType}
            </div>
            <div className="text-neutral-500 text-[28px] justify-self-end place-self-end">
              {deliveryTime}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
