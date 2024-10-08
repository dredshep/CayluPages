import { useUserStore } from "@/store/useUserStore";
import { FiEdit2, FiTrash2, FiCheck } from "react-icons/fi";

interface AddressListProps {
  onEdit: (id: number) => void;
  onAddNew: () => void;
}

export default function AddressList({ onEdit, onAddNew }: AddressListProps) {
  const { addresses, selectedAddressId, setSelectedAddressId, deleteAddress } =
    useUserStore();

  const handleDelete = async (id: number) => {
    try {
      await deleteAddress(id);
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  return (
    <div className="mb-4">
      <ul className="space-y-2">
        {addresses &&
          Array.isArray(addresses) &&
          addresses.map((address) => (
            <li
              key={address.id}
              className={`bg-white border ${
                selectedAddressId === address.id
                  ? "border-blue-500"
                  : "border-gray-200"
              } rounded-lg p-3 transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-800 truncate max-w-[60%]">
                  {address.address}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(address.id)}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100 transition-colors duration-200"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors duration-200"
                  >
                    <FiTrash2 size={18} />
                  </button>
                  <button
                    onClick={() => setSelectedAddressId(address.id)}
                    className={`${
                      selectedAddressId === address.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    } p-1 rounded-full transition-colors duration-200 hover:opacity-80`}
                  >
                    <FiCheck size={18} />
                  </button>
                </div>
              </div>
            </li>
          ))}
      </ul>
      <button
        onClick={onAddNew}
        className="mt-4 w-full flex justify-center items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
      >
        Add New Address
      </button>
    </div>
  );
}
