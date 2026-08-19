import { setAddress, clearAddress } from "../state/address.slice";
import { createAddress, getAddress, getAllAddresses, updateAddress, deleteAddress } from "../service/address.api";
import { useDispatch } from "react-redux";

export const useAddress = () => {
  const dispatch = useDispatch();

  const handleCreateAddress = async (addressData) => {
    try {
      const data = await createAddress(addressData);
      dispatch(setAddress(data.address));
      return data.address;
    } catch (error) {
      console.error("Create address error:", error);
      throw error;
    }
  };

  const handleGetAddress = async () => {
    try {
      const data = await getAddress();
      dispatch(setAddress(data.address));
      return data.address;
    } catch (error) {
      console.error("Get address error:", error);
      throw error;
    }
  };

  const handleGetAllAddresses = async () => {
    try {
      const data = await getAllAddresses();
      return data.addresses;
    } catch (error) {
      console.error("Get all addresses error:", error);
      throw error;
    }
  };

  const handleUpdateAddress = async (id, addressData) => {
    try {
      const data = await updateAddress(id, addressData);
      return data.address;
    } catch (error) {
      console.error("Update address error:", error);
      throw error;
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const data = await deleteAddress(id);
      return data;
    } catch (error) {
      console.error("Delete address error:", error);
      throw error;
    }
  };

  return {
    handleCreateAddress,
    handleGetAddress,
    handleGetAllAddresses,
    handleUpdateAddress,
    handleDeleteAddress,
  };
};
