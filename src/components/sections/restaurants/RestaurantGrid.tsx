import styled from "styled-components";
import RestaurantCard from "@components/cards/RestaurantCard";
import restaurantCardData from "@/dummyData/restaurantsCardData";
import Link from "next/link";
import useFetch from "@/components/meta/hooks/useFetch";
import { companies } from "@prisma/client";
import getPlaceholderImageUrl from "@/utils/getPlaceholderImageUrl";
import { JoinedCompany } from "@/pages/api/companies";

const gridWidth = 492;
const gapY = 56;
const gapX = 104;
const gridCols = 3;
const maxWidth = gridWidth * gridCols + gapX * (gridCols - 1);

const GridContainer = styled.div`
  max-width: ${maxWidth}px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  gap: ${gapY}px ${gapX}px;
  grid-template-columns: repeat(2, 1fr);

  @media (max-width: 1440px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1440px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const RestaurantGrid = () => {
  const comps = useFetch<JoinedCompany[]>("/api/companies");
  return (
    comps && (
      <GridContainer>
        <Grid>
          {comps.map((data, index) => (
            <Link href={`/restaurantes/menu`} key={index}>
              <RestaurantCard
                key={index}
                imageUrl={getPlaceholderImageUrl({
                  width: 492,
                  height: 400,
                  bgColor: "skyblue",
                  textColor: "white",
                })}
                altText={data.description || ""}
                name={data.name}
                rating={5}
                cuisineType={data.type_company.replace(/_/g, " ")}
                deliveryTime={"5 mins"}
              />
            </Link>
          ))}
        </Grid>
      </GridContainer>
    )
  );
};

export default RestaurantGrid;
