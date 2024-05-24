import styled from "styled-components";
import RestaurantCard from "@components/cards/RestaurantCard";
import restaurantCardData from "@/dummyData/restaurantsCardData";

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

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const RestaurantGrid = () => {
  return (
    <GridContainer>
      <Grid>
        {restaurantCardData.map((data, index) => (
          <RestaurantCard
            key={index}
            imageUrl={data.imageUrl}
            altText={data.altText}
            name={data.name}
            rating={data.rating}
            cuisineType={data.cuisineType}
            deliveryTime={data.deliveryTime}
          />
        ))}
      </Grid>
    </GridContainer>
  );
};

export default RestaurantGrid;
