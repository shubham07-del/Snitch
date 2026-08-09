import { setProducts, setSellerProduct,setLoading, setProductDetails } from "../state/product.slice";
import { createProduct, getAllProducts, getSellerProduct, getProductDetails, addProductVariant } from "../service/product.api";
import {useDispatch} from "react-redux"
export const useProduct = ()=>{
    const dispatch = useDispatch()

    async function handleCreateProduct(formData) {
        const data = await createProduct(formData)
        return data.product
    }

    async function handleGetSellerProduct() {
        const data = await getSellerProduct()
        dispatch(setSellerProduct(data.products))
        return data.products
    }

    async function handleGetProducts() {
        dispatch(setLoading(true))
        try{
            const data = await getAllProducts()
            dispatch(setProducts(data.products))
        }catch(err){
            console.log(err.message)
        }finally{
            dispatch(setLoading(false))
        }
    }

    async function handleGetProductDetails(productId){
        dispatch(setLoading(true))
        try{
            const data = await getProductDetails(productId)
            dispatch(setProductDetails(data.product))
            return data.product
        }catch(err){
            console.log(err.message)
        }finally{
            dispatch(setLoading(false))
        }
    }

    async function handleAddProductVariant(productId, newProductVariant) {
        const data = await addProductVariant(productId, newProductVariant)
        return data.variant
    }
    return {handleCreateProduct, handleGetSellerProduct, handleGetProducts, handleGetProductDetails, handleAddProductVariant}
} 