import casaValencia from "@/assets/restaurants/casa_valencia.png";
import chinatown from "@/assets/restaurants/chinatown.png";
import elArabito from "@/assets/restaurants/el_arabito.png";
import granNapoles from "@/assets/restaurants/gran_napoles.png";
import kyoto from "@/assets/restaurants/kyoto.png";
import primeBurger from "@/assets/restaurants/prime_burger.png";
import rodeoGrill from "@/assets/restaurants/rodeo_grill.png";
import sandersChicken from "@/assets/restaurants/sanders_chicken.png";
import vivaMexico from "@/assets/restaurants/viva_mexico.png";

import { RestaurantData } from "./frontpageCardData";

const restaurantCardData = [
  {
    imageUrl: rodeoGrill,
    altText: "Rodeo Grill",
    name: "Rodeo Grill",
    rating: 4.5,
    cuisineType: "Parrilla y variedad",
    deliveryTime: "15-20min",
  },
  {
    imageUrl: primeBurger,
    altText: "Prime Burger",
    name: "Prime Burger",
    rating: 4.5,
    cuisineType: "Parrilla y variedad",
    deliveryTime: "12-20min",
  },
  {
    imageUrl: sandersChicken,
    altText: "Sander’s Chicken",
    name: "Sander’s Chicken",
    rating: 4.5,
    cuisineType: "Parrilla y variedad",
    deliveryTime: "12-20min",
  },
  {
    imageUrl: vivaMexico,
    altText: "Viva Mexico",
    name: "Viva Mexico",
    rating: 4.5,
    cuisineType: "Comida mexicana",
    deliveryTime: "10-14min",
  },
  {
    imageUrl: granNapoles,
    altText: "Gran Napoles",
    name: "Gran Napoles",
    rating: 4.5,
    cuisineType: "Comida italiana",
    deliveryTime: "12-15min",
  },
  {
    imageUrl: casaValencia,
    altText: "Casa Valencia",
    name: "Casa Valencia",
    rating: 4.5,
    cuisineType: "Comida española",
    deliveryTime: "15-24min",
  },
  {
    imageUrl: chinatown,
    altText: "Chinatown",
    name: "Chinatown",
    rating: 4.5,
    cuisineType: "Comida china",
    deliveryTime: "15-20min",
  },
  {
    imageUrl: elArabito,
    altText: "El Arabito",
    name: "El Arabito",
    rating: 4.5,
    cuisineType: "Comida arabe",
    deliveryTime: "12-20min",
  },
  {
    imageUrl: kyoto,
    altText: "Kyoto",
    name: "Kyoto",
    rating: 4.5,
    cuisineType: "Comida japonesa",
    deliveryTime: "12-20min",
  },
] as RestaurantData[];

export default restaurantCardData;
