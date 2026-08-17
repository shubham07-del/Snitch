import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  address: {
    fullname: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  },
};

const addressSlice = createSlice({
  name: "address",
  initialState,

  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    clearAddress: (state) => {
      state.address = initialState.address;
    },
  },
});

export const { setAddress, clearAddress } = addressSlice.actions;

export default addressSlice.reducer;