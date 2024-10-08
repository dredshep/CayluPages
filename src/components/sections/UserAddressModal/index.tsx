import { useState, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import ModalWrapper from "@/components/sections/UserAddressModal/ModalWrapper";
import AddressList from "@/components/sections/UserAddressModal/AddressList";
import AddressForm from "@/components/sections/UserAddressModal/AddressForm";

interface UserAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserAddressModal({
  isOpen,
  onClose,
}: UserAddressModalProps) {
  const {
    addresses,
    selectedAddressId,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setSelectedAddressId,
  } = useUserStore();
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleSubmit = async (formData: {
    address: string;
    lat: number;
    lng: number;
  }) => {
    try {
      if (editMode && editId) {
        await updateAddress({ id: editId, ...formData });
      } else {
        await createAddress(formData);
      }
      setEditMode(false);
      setEditId(null);
      onClose();
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAddress(id);
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={editMode ? "Edit Address" : "Your Addresses"}
    >
      {!editMode ? (
        <AddressList
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          onEdit={(id) => {
            setEditMode(true);
            setEditId(id);
          }}
          onDelete={handleDelete}
          onSelect={setSelectedAddressId}
          onAddNew={() => {
            setEditMode(true);
            setEditId(null);
          }}
        />
      ) : (
        <AddressForm
          editId={editId}
          addresses={addresses}
          onSubmit={handleSubmit}
          onCancel={() => {
            setEditMode(false);
            setEditId(null);
          }}
        />
      )}
    </ModalWrapper>
  );
}
