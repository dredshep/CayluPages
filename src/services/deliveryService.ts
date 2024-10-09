import { ApiDeliveryRate } from "@/pages/api/delivery-rates/[companyId]";
import { ApiCompany } from "@/pages/api/companies/[id]";
import { measureDistance } from "@/utils/geo/geoUtils";
import { Coordinate } from "ol/coordinate";

export const calculateDeliveryFee = async (
  companyId: number,
  addressId: number,
) => {
  const companyResponse = await fetch(`/api/companies/${companyId}`);
  const companyData = (await companyResponse.json()) as ApiCompany;

  const companyLocation: Coordinate = [
    Number(companyData.geolocations.lng),
    Number(companyData.geolocations.lat),
  ];

  const addressResponse = await fetch(`/api/user/address/${addressId}`);
  const addressData = await addressResponse.json();

  const deliveryLocation: Coordinate = [
    Number(addressData.lat),
    Number(addressData.lng),
  ];
  console.log("Delivery location:", deliveryLocation);

  const distance = measureDistance(companyLocation, deliveryLocation);
  // distance in km
  const distanceInKm = distance / 1000;
  console.log(
    `Point A is the user address (${deliveryLocation}) and point B is the company address (${companyLocation})`,
  );
  console.log(
    `The distance between point A and point B is ${
      distanceInKm.toFixed(
        2,
      )
    } km`,
  );
  const ratesResponse = await fetch(`/api/delivery-rates/${companyId}`);
  const rates = (await ratesResponse.json()) as ApiDeliveryRate[];
  console.log("Rates:", rates);

  const applicableRate = rates.find(
    (rate) =>
      distanceInKm >= Number(rate.from_km) && distanceInKm < Number(rate.to_km),
  );

  console.log("Applicable rate:", applicableRate);

  return applicableRate ? Number(applicableRate.service_fee) : 0;
};
