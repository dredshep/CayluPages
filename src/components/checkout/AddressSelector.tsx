import React from "react";
import { Address } from "@/types/address";

interface AddressSelectorProps {
  addresses: Address[];
  selectedAddress: number;
  onAddressChange: (addressId: number) => void;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  addresses,
  selectedAddress,
  onAddressChange,
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Dirección de entrega
      </h3>
      {addresses.length > 0 ? (
        <select
          value={selectedAddress}
          onChange={(e) => onAddressChange(Number(e.target.value))}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {addresses.map((address) => (
            <option key={address.id} value={address.id.toString()}>
              {address.address}
            </option>
          ))}
        </select>
      ) : (
        <p>No hay direcciones guardadas.</p>
      )}
    </div>
  );
};

export default AddressSelector;
