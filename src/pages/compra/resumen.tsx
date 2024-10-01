import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { useCartStore2 } from "@/store/useCartStore2";
import { CartProduct } from "@/types/CartProduct";
import AppNavbar from "@/components/sections/AppNavbar";
import getPlaceholderImageUrl from "@/utils/getPlaceholderImageUrl";
import { createOrder } from "@/services/orderService";

export default function OrderSummary() {
  const router = useRouter();
  const { cart } = useCartStore2();
  const [isLoaded, setIsLoaded] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      router.push("/");
    } else {
      setIsLoaded(true);
    }
  }, [cart, router]);

  const calculateRestaurantTotal = (): number => {
    if (!cart || !cart.products) return 0;
    return cart.products.reduce(
      (sum, product) => sum + calculateProductTotal(product),
      0
    );
  };

  const calculateProductTotal = (product: CartProduct): number => {
    const basePrice = product.price * product.quantity;
    const additionalsPrice =
      product.additionals?.reduce(
        (sum, additional) =>
          sum + Number(additional.price) * (additional.quantity || 0),
        0
      ) || 0;
    return basePrice + additionalsPrice;
  };

  const restaurantTotal = calculateRestaurantTotal();
  const deliveryFee = 3.4;
  const taxableAmount = restaurantTotal + deliveryFee;
  const foodIVA = restaurantTotal * 0.1;
  const deliveryIVA = deliveryFee * 0.21;
  const totalIVA = foodIVA + deliveryIVA;
  const total = taxableAmount + totalIVA;

  const handleProceedToPayment = async () => {
    if (!cart || !cart.products || cart.products.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    const checkoutData = {
      company_id: cart.company_id,
      products: cart.products,
    };

    const result = await createOrder(checkoutData);

    if (result.success) {
      alert(`Order created successfully with ID: ${result.orderId}`);
      useCartStore2.getState().clearCart();
      router.push("/compra/pago");
    } else {
      alert(`Error creating order: ${result.error}`);
    }
  };

  const handleApplyPromoCode = () => {
    // Implement promo code logic here
    console.log("Applying promo code:", promoCode);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>Resumen del Pedido - Derby</title>
      </Head>
      <AppNavbar />
      {isLoaded && cart && cart.products && (
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
            Resumen del Pedido
          </h1>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Detalles del Pedido
              </h2>
              {cart.products.map((product) => (
                <div
                  key={product.p_id}
                  className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200"
                >
                  <div className="flex items-center">
                    <Image
                      src={
                        product.image ||
                        getPlaceholderImageUrl({
                          width: 50,
                          height: 50,
                          bgColor: "e0e0e0",
                          textColor: "757575",
                        })
                      }
                      alt={product.name}
                      width={50}
                      height={50}
                      className="rounded-md mr-4"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Cantidad: {product.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-800">
                    €{calculateProductTotal(product).toFixed(2)}
                  </p>
                </div>
              ))}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Subtotal Restaurante</span>
                  <span className="font-semibold text-gray-800">
                    €{restaurantTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Gastos de envío</span>
                  <span className="font-semibold text-gray-800">
                    €{deliveryFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">IVA Comida (10%)</span>
                  <span className="font-semibold text-gray-800">
                    €{foodIVA.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">IVA Envío (21%)</span>
                  <span className="font-semibold text-gray-800">
                    €{deliveryIVA.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold text-gray-800 mt-6">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Código promocional"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  onClick={handleApplyPromoCode}
                  className="bg-teal-500 text-white px-4 py-2 rounded-r-md hover:bg-teal-600 transition duration-150 ease-in-out"
                >
                  Aplicar
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              <button
                onClick={handleProceedToPayment}
                className="w-full bg-teal-500 text-white py-3 rounded-md hover:bg-teal-600 transition duration-150 ease-in-out text-lg font-semibold"
              >
                Proceder al Pago
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
