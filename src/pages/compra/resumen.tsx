import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useCartStore2 } from "@/store/useCartStore2";
import { useUserStore } from "@/store/useUserStore";
import AppNavbar from "@/components/sections/AppNavbar";
import AddressSelector from "@/components/checkout/AddressSelector";
import OrderSummary from "@/components/checkout/OrderSummary";
import PromoCodeInput from "@/components/checkout/PromoCodeInput";
import { createOrder } from "@/services/orderService";
import { calculateDeliveryFee } from "@/services/deliveryService";

export default function OrderSummaryPage() {
  const router = useRouter();
  const { cart, clearCart } = useCartStore2();
  const { addresses } = useUserStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<number>(0);
  const [deliveryFee, setDeliveryFee] = useState(0);

  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      router.push("/");
    } else {
      setIsLoaded(true);
    }
  }, [cart, router]);

  useEffect(() => {
    if (addresses.length > 0) {
      setSelectedAddress(addresses[0].id);
    }
  }, [addresses]);

  const handleAddressChange = async (addressId: number) => {
    setSelectedAddress(addressId);
    const fee = await calculateDeliveryFee(cart!.company_id, addressId);
    console.log("Delivery fee:", fee);
    setDeliveryFee(fee);
  };

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
      clearCart();
      router.push("/compra/pago");
    } else {
      alert(`Error creating order: ${result.error}`);
    }
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
              <AddressSelector
                addresses={addresses}
                selectedAddress={selectedAddress}
                onAddressChange={handleAddressChange}
              />
              <OrderSummary cart={cart.products} deliveryFee={deliveryFee} />
            </div>
            <PromoCodeInput />
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
