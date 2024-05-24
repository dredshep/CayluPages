interface Meal {
  name: string;
  price: string;
  description: string;
  imageUrl: string; // Added to store the URL of the meal's image
}

const hamburguesas: Meal[] = [
  {
    name: "Hamburguesa con pollo",
    price: "14.00€",
    description: "Carne de pollo, vegetales, y patatas",
    imageUrl: "/path/to/hamburguesa-con-pollo.jpg",
  },
  {
    name: "Hamburguesa clásica",
    price: "14.00€",
    description: "Carne de res, vegetales, y patatas",
    imageUrl: "/path/to/hamburguesa-clasica.jpg",
  },
  {
    name: "Hamburguesa doble",
    price: "18.00€",
    description: "Doble carne de res, vegetales, y patatas",
    imageUrl: "/path/to/hamburguesa-doble.jpg",
  },
  {
    name: "Hamburguesa picante",
    price: "14.00€",
    description: "Carne de res, vegetales, salsa picante y patatas",
    imageUrl: "/path/to/hamburguesa-picante.jpg",
  },
  {
    name: "Perrito clásico",
    price: "10.00€",
    description: "Salchicha de cerdo, mostaza y kétchup",
    imageUrl: "/path/to/perrito-clasico.jpg",
  },
  {
    name: "Choripan",
    price: "12.00€",
    description: "Chorizo argentino, vegetales y salsas de la casa",
    imageUrl: "/path/to/choripan.jpg",
  },
  {
    name: "Bocadillo de jamón y queso",
    price: "10.00€",
    description: "Pan fresco, jamón y queso",
    imageUrl: "/path/to/bocadillo-jamon-queso.jpg",
  },
  {
    name: "Bocadillo de mortadela",
    price: "7.00€",
    description: "Pan, mortadela y vegetales",
    imageUrl: "/path/to/bocadillo-mortadela.jpg",
  },
  {
    name: "Pepsi",
    price: "4.00€",
    description: "Pepsi",
    imageUrl: "/path/to/pepsi.jpg",
  },
  {
    name: "Zumo de naranja",
    price: "4.00€",
    description: "Zumo de naranja",
    imageUrl: "/path/to/zumo-naranja.jpg",
  },
];

export default hamburguesas;
