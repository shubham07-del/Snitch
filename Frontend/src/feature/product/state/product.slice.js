import {createSlice} from "@reduxjs/toolkit"

export const productSlice = createSlice({
    name:"product",
    initialState:{
        sellerProduct:[]
    },
    reducers:{
        setSellerProduct:(state, action)=>{
            state.sellerProduct = action.payload
        },
    }
}) 

export const {setSellerProduct} = productSlice.actions
export default productSlice.reducer