- En la carpeta `pages/api`, crea un nuevo archivo llamado `pagos.ts` (o `pagos.js` si no estás usando TypeScript)

```ts
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

const MERCHANT_KEY = process.env.MERCHANT_KEY; // Asegúrate de configurar esta variable de entorno

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { amount, order, merchantCode } = req.body;

    // Crear el objeto de parámetros del comerciante
    const merchantParameters = {
      DS_MERCHANT_AMOUNT: amount,
      DS_MERCHANT_ORDER: order,
      DS_MERCHANT_MERCHANTCODE: merchantCode,
      DS_MERCHANT_CURRENCY: "978", // Euro
      DS_MERCHANT_TRANSACTIONTYPE: "0", // Autorización
      DS_MERCHANT_TERMINAL: "1",
      // Añade más parámetros según sea necesario
    };

    // Codificar los parámetros en Base64
    const merchantParametersBase64 = Buffer.from(
      JSON.stringify(merchantParameters)
    ).toString("base64");

    // Calcular la firma
    const key = Buffer.from(MERCHANT_KEY, "base64");
    const hmac = crypto.createHmac("sha256", key);
    hmac.update(merchantParametersBase64);
    const signature = hmac.digest("base64");

    // Devolver los datos necesarios para el formulario de pago
    res.status(200).json({
      Ds_SignatureVersion: "HMAC_SHA256_V1",
      Ds_MerchantParameters: merchantParametersBase64,
      Ds_Signature: signature,
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

4. Configurar variables de entorno:

En tu archivo `.env`, agrega la clave del comerciante:

```
MERCHANT_KEY=your_merchant_key_here
```

5. Crear un componente de formulario de pago:

   En `components/PaymentForm.tsx`, crea un componente que utilice la API:

```ts
import { useState } from "react";

export default function PaymentForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/pagos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: "1000", // 10.00 EUR
          order: "123456",
          merchantCode: "999008881",
        }),
      });

      if (!response.ok) throw new Error("Error en la respuesta del servidor");

      const data = await response.json();

      // Aquí deberías crear y enviar el formulario al TPV Virtual
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://sis-t.redsys.es:25443/sis/realizarPago"; // URL de pruebas

      for (const [key, value] of Object.entries(data)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Error:", error);
      // Maneja el error apropiadamente
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Añade campos del formulario si es necesario */}
      <button type="submit" disabled={loading}>
        {loading ? "Procesando..." : "Pagar"}
      </button>
    </form>
  );
}
```

6. Utilizar el componente de pago en una página:

   En `pages/checkout.tsx`, por ejemplo:

```ts
import PaymentForm from "../components/PaymentForm";
export default function Checkout() {
  return (
    <div>
      <h1>Checkout</h1>
      <PaymentForm />
    </div>
  );
}
```

7. Configurar la notificación de pago:

   Crea un nuevo endpoint en `pages/api/notificacion-pago.ts` para manejar las notificaciones del TPV Virtual.

---

Claro, aquí tienes un ejemplo de un archivo `.env.local` con detalles de prueba para la integración con el TPV Virtual de Redsys. Recuerda que estos son valores de prueba y no deben usarse en un entorno de producción.

```.env.local
# .env.local

# Clave del comercio (ejemplo)
MERCHANT_KEY=sq7HjrUOBfKmC576ILgskD5srU870gJ7

# Código de comercio de prueba
MERCHANT_CODE=999008881

# Terminal
MERCHANT_TERMINAL=1

# Moneda (978 para Euro)
MERCHANT_CURRENCY=978

# URLs de notificación (ajusta estas URLs a tu dominio)
MERCHANT_URL_OK=http://localhost:3000/pago-exitoso
MERCHANT_URL_KO=http://localhost:3000/pago-fallido
MERCHANT_URL_NOTIFICATION=http://localhost:3000/api/notificacion-pago

# Entorno (TEST para pruebas, LIVE para producción)
REDSYS_ENVIRONMENT=TEST

# URLs de Redsys (no cambiar a menos que Redsys proporcione nuevas URLs)
REDSYS_URL_TEST=https://sis-t.redsys.es:25443/sis/realizarPago
REDSYS_URL_PRODUCTION=https://sis.redsys.es/sis/realizarPago
```

Algunas notas importantes:

1. La `MERCHANT_KEY` es un ejemplo y deberías obtener una clave real de Redsys para tus pruebas.

2. El `MERCHANT_CODE` 999008881 es un código de comercio de prueba proporcionado por Redsys.

3. Las URLs de notificación (`MERCHANT_URL_OK`, `MERCHANT_URL_KO`, `MERCHANT_URL_NOTIFICATION`) deben ajustarse a tu dominio real cuando estés en producción. Para pruebas locales, puedes usar localhost como en el ejemplo.

4. El `REDSYS_ENVIRONMENT` está configurado como `TEST`. Cámbialo a `LIVE` cuando estés listo para producción.

5. Las URLs de Redsys (`REDSYS_URL_TEST` y `REDSYS_URL_PRODUCTION`) son las proporcionadas en la documentación. Asegúrate de que sean las más actuales según la documentación de Redsys.
