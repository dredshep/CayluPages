import getPlaceholderImageUrl from "@/utils/getPlaceholderImageUrl";

export interface RestaurantData {
  imageUrl: string;
  altText: string;
  name: string;
  rating: number;
  cuisineType: string;
  deliveryTime: string;
}

const popularEnTuZona: RestaurantData[] = [
  {
    imageUrl: getPlaceholderImageUrl({
      width: 492,
      height: 307,
    }),
    altText: "Rodeo Grill",
    name: "Rodeo Grill",
    rating: 4.5,
    cuisineType: "Parilla y variedad",
    deliveryTime: "15-20min",
  },
  {
    imageUrl: getPlaceholderImageUrl({
      width: 492,
      height: 307,
    }),
    altText: "Prime Burger",
    name: "Prime Burger",
    rating: 4.5,
    cuisineType: "Parilla y variedad",
    deliveryTime: "12-20min",
  },
  {
    imageUrl: getPlaceholderImageUrl({
      width: 492,
      height: 307,
    }),
    altText: "Sander’s Chicken",
    name: "Sander’s Chicken",
    rating: 4.5,
    cuisineType: "Parilla y variedad",
    deliveryTime: "12-20min",
  },
];

const ofertasDeHoy: RestaurantData[] = [
  {
    imageUrl: getPlaceholderImageUrl({
      width: 492,
      height: 307,
    }),
    altText: "Tacos de mar",
    name: "Tacos de mar",
    rating: 4.5,
    cuisineType: "La taquería de Enrique",
    deliveryTime: "10-14min",
  },
  {
    imageUrl: getPlaceholderImageUrl({
      width: 492,
      height: 307,
    }),
    altText: "Pizza Napolitana",
    name: "Pizza Napolitana",
    rating: 4.5,
    cuisineType: "Little Venice",
    deliveryTime: "12-15min",
  },
  {
    imageUrl: getPlaceholderImageUrl({
      width: 492,
      height: 307,
    }),
    altText: "Paella de mar",
    name: "Paella de mar",
    rating: 4.5,
    cuisineType: "Casa Valencia",
    deliveryTime: "15-24min",
  },
];

export { popularEnTuZona, ofertasDeHoy };
