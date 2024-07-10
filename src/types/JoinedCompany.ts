import {
  companies,
  business_hours,
  additionals,
  category_products,
  cities,
  company_holidays,
  geolocations,
  offers,
  order_purchases,
  orders,
  products,
  states,
} from "@prisma/client";

export type JoinedCompany = companies & {
  business_hours: business_hours[];
  additionals: additionals[];
  category_products: category_products[];
  cities: cities;
  company_holidays: company_holidays[];
  geolocations: geolocations;
  offers: offers[];
  order_purchases: order_purchases[];
  orders: orders[];
  products: products[];
  states: states;
};
