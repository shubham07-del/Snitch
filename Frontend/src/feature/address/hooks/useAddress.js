import { setAddress, clearAddress } from "../state/address.slice";
import { createAddress, getAddress } from "../service/address.api";
import { useDispatch } from "react-redux";

export const useAddress = () => {
  const dispatch = useDispatch();

  const handleCreateAddress = async ({
    fullname,
    phone,
    email,
    address,
    city,
    state,
    pincode,
    country,
  }) => {
    try {
      const data = await createAddress({
        fullname,
        phone,
        email,
        address,
        city,
        state,
        pincode,
        country,
      });

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

  return {
    handleCreateAddress,
    handleGetAddress,
  };
};
