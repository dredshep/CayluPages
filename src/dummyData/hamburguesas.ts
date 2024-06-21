import bocadilloJamonQueso from "@/assets/hamburguesas/bocadillo-jamon-serrano-queso.jpg";
import bocadilloMortadela from "@/assets/hamburguesas/bocadillo-mortadela.jpg";
import choripan from "@/assets/hamburguesas/choripan.jpg";
import clasica from "@/assets/hamburguesas/clasica.png";
import doble from "@/assets/hamburguesas/doble.png";
import pepsi from "@/assets/hamburguesas/pepsi.jpg";
import perrito from "@/assets/hamburguesas/perrito.png";
import picante from "@/assets/hamburguesas/picante.png";
import pollo from "@/assets/hamburguesas/pollo.png";
import zumoNaranja from "@/assets/hamburguesas/zumo-naranja.jpg";
import { StaticImageData } from "next/image";

interface Meal {
  name: string;
  price: string;
  description: string;
  imageUrl: string | StaticImageData;
}

const hamburguesas: Meal[] = [
  {
    name: "Hamburguesa con pollo",
    price: "14.00",
    description: "Carne de pollo, vegetales, y patatas",
    imageUrl: pollo,
  },
  {
    name: "Hamburguesa clásica",
    price: "14.00",
    description: "Carne de res, vegetales, y patatas",
    imageUrl: clasica,
  },
  {
    name: "Hamburguesa doble",
    price: "18.00",
    description: "Doble carne de res, vegetales, y patatas",
    imageUrl: doble,
  },
  {
    name: "Hamburguesa picante",
    price: "14.00",
    description: "Carne de res, vegetales, salsa picante y patatas",
    imageUrl: picante,
  },
  {
    name: "Perrito clásico",
    price: "10.00",
    description: "Salchicha de cerdo, mostaza y kétchup",
    imageUrl: perrito,
  },
  {
    name: "Choripan",
    price: "12.00",
    description: "Chorizo argentino, vegetales y salsas de la casa",
    imageUrl: choripan,
  },
  {
    name: "Bocadillo de jamón y queso",
    price: "10.00",
    description: "Pan fresco, jamón y queso",
    imageUrl: bocadilloJamonQueso,
  },
  {
    name: "Bocadillo de mortadela",
    price: "7.00",
    description: "Pan, mortadela y vegetales",
    imageUrl: bocadilloMortadela,
  },
  {
    name: "Pepsi",
    price: "4.00",
    description: "Pepsi",
    imageUrl: pepsi,
  },
  {
    name: "Zumo de naranja",
    price: "4.00",
    description: "Zumo de naranja",
    imageUrl: zumoNaranja,
  },
];

export default hamburguesas;
