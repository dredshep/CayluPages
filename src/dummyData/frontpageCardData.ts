import prime_burger from "@/assets/restaurants/prime_burger.png";
import rodeo_grill from "@/assets/restaurants/rodeo_grill.png";
import sanders_chicken from "@/assets/restaurants/sanders_chicken.png";

import tacos from "@/assets/platos/tacos.png";
import pizza from "@/assets/platos/pizza.png";
import paella from "@/assets/platos/paella.png";
import { StaticImageData } from "next/image";

export interface RestaurantData {
  imageUrl: string | StaticImageData;
  altText: string;
  name: string;
  rating: number;
  cuisineType: string;
  deliveryTime: string;
}

const popularEnTuZona: RestaurantData[] = [
  {
    imageUrl: rodeo_grill,
    altText: "Rodeo Grill",
    name: "Rodeo Grill",
    rating: 4.5,
    cuisineType: "Parilla y variedad",
    deliveryTime: "15-20min",
  },
  {
    imageUrl: prime_burger,
    altText: "Prime Burger",
    name: "Prime Burger",
    rating: 4.5,
    cuisineType: "Parilla y variedad",
    deliveryTime: "12-20min",
  },
  {
    imageUrl: sanders_chicken,
    altText: "Sander’s Chicken",
    name: "Sander’s Chicken",
    rating: 4.5,
    cuisineType: "Parilla y variedad",
    deliveryTime: "12-20min",
  },
];

const ofertasDeHoy: RestaurantData[] = [
  {
    imageUrl: tacos,
    altText: "Tacos de mar",
    name: "Tacos de mar",
    rating: 4.5,
    cuisineType: "La taquería de Enrique",
    deliveryTime: "10-14min",
  },
  {
    imageUrl: pizza,
    altText: "Pizza Napolitana",
    name: "Pizza Napolitana",
    rating: 4.5,
    cuisineType: "Little Venice",
    deliveryTime: "12-15min",
  },
  {
    imageUrl: paella,
    altText: "Paella de mar",
    name: "Paella de mar",
    rating: 4.5,
    cuisineType: "Casa Valencia",
    deliveryTime: "15-24min",
  },
];

export { popularEnTuZona, ofertasDeHoy };
