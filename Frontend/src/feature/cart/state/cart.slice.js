import {createSlice} from "@reduxjs/toolkit"

const cartSlice = createSlice({
    name:"cart",
    initialState:{
        loading:false,
        total:null,
        items:[]
    },
    reducers:{
        setItem:(state, action)=>{
            state.items = action.payload.items
            state.total = action.payload.total
        },
        addItem:(state, action)=>{
            state.items.push(action.payload)
        },
        incrementCartItemInState:(state, action)=>{
            state.items = state.items.map((item)=> item.product._id === action.payload.productId && item.variant === action.payload.variantId ? {...item, quantity: item.quantity + 1} : item)
        },
        decrementCartItemInState:(state, action)=>{
            state.items = state.items
                .map((item)=> item.product._id === action.payload.productId && item.variant === action.payload.variantId ? {...item, quantity: item.quantity - 1} : item)
                .filter((item)=> item.quantity > 0)
        }
    }
})

export const {setItem, addItem, incrementCartItemInState, decrementCartItemInState} = cartSlice.actions
export default cartSlice.reducer