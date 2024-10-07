import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AppNavbar from "@/components/sections/AppNavbar";
import { useCartStore2 } from "@/store/useCartStore2";

export default function DeliveryDetailsPage() {
  const router = useRouter();
  const { cart } = useCartStore2();
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    notes: "",
  });

  useEffect(() => {
    setIsClient(true);
    if (!cart || !cart.products || cart.products.length === 0) {
      router.push("/");
    }
  }, [cart, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the delivery details to your state or backend
    console.log("Delivery details:", formData);
    router.push("/compra/pago");
  };

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>Detalles de Entrega - Derby</title>
      </Head>
      <AppNavbar />
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
          Detalles de Entrega
        </h1>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-semibold mb-2"
              >
                Nombre Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="address"
                className="block text-gray-700 font-semibold mb-2"
              >
                Dirección de Entrega
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-gray-700 font-semibold mb-2"
              >
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold mb-2"
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="notes"
                className="block text-gray-700 font-semibold mb-2"
              >
                Notas Adicionales
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-3 rounded-md hover:bg-teal-600 transition duration-150 ease-in-out text-lg font-semibold"
            >
              Continuar al Pago
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
