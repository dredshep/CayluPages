export interface AddressDetails {
  house_number?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
}

export interface GeocodingSuggestion {
  display_name: string;
  lat: string;
  lng: string;
  address: AddressDetails;
}
