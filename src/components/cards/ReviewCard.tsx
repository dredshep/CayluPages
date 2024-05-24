import React from "react";
import StarIcon from "@components/icons/StarIcon";

// Define the type for a review
export interface Review {
  avatarInitial: string;
  name: string;
  date: string;
  rating: number;
  reviewText: string;
}

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="h-[383px] w-[396px] shadow-xl shadow-neutral-300 rounded-[32px] p-6">
      <div className="flex gap-5">
        {/* Avatar circle */}
        <div className="w-[60px] h-[60px]">
          <div className="w-[60px] h-[60px] bg-green-600 rounded-full flex items-center justify-center">
            <div className="text-black text-[27px] font-normal">
              {review.avatarInitial}
            </div>
          </div>
        </div>
        {/* Name and date */}
        <div className="w-[110px] h-[43px] relative">
          <div className="left-0 top-0 absolute text-black text-[17px] font-bold whitespace-nowrap">
            {review.name}
          </div>
          <div className="left-0 top-[27px] absolute text-black text-xs font-normal">
            {review.date}
          </div>
        </div>
      </div>
      <div className="w-[93.57px] h-[36.36px] py-2.5 justify-center items-center gap-0.5 inline-flex">
        {[...Array(review.rating)].map((_, i) => (
          <StarIcon key={i} />
        ))}
      </div>
      <div>{review.reviewText}</div>
    </div>
  );
};

export default ReviewCard;
