import {createSlice} from "@reduxjs/toolkit"

export const productSlice = createSlice({
    name:"product",
    initialState:{
        sellerProduct:[],
        products:[],
        loading:false,
        productDetails:null
    },
    reducers:{
        setSellerProduct:(state, action)=>{
            state.sellerProduct = action.payload
        },
        setProducts:(state, action)=>{
            state.products = action.payload
        },
        setLoading:(state, action)=>{
            state.loading = action.payload
        },
        setProductDetails:(state, action)=>{
            state.productDetails = action.payload
        }
    }
}) 

export const {setSellerProduct, setProducts, setLoading, setProductDetails} = productSlice.actions
export default productSlice.reducer