import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AppNavbar from "@/components/sections/AppNavbar";

export default function PaymentPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  useEffect(() => {
    // Simulate payment processing
    if (isProcessing) {
      const timer = setTimeout(() => {
        setIsProcessing(false);
        setPaymentComplete(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isProcessing]);

  const handlePayment = () => {
    setIsProcessing(true);
  };

  const handleReturnHome = () => {
    router.push("/");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>Pago - Derby</title>
      </Head>
      <AppNavbar />
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Pago</h1>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6">
          {!paymentComplete ? (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Resumen del Pedido
              </h2>
              {/* Add order summary details here */}
              <div className="mt-8">
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className={`w-full bg-teal-500 text-white py-3 rounded-md hover:bg-teal-600 transition duration-150 ease-in-out text-lg font-semibold ${
                    isProcessing ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isProcessing ? "Procesando..." : "Realizar Pago"}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-green-600 mb-6">
                ¡Pago Completado!
              </h2>
              <p className="text-gray-600 mb-6">
                Gracias por tu compra. Tu pedido ha sido procesado con éxito.
              </p>
              <button
                onClick={handleReturnHome}
                className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 transition duration-150 ease-in-out"
              >
                Volver a la Página Principal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
