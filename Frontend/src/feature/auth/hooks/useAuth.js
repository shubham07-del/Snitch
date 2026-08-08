import { setError, setLoading, setUser } from "../state/auth.slice";
import { login, register, getMe } from "../service/auth.api";
import {useDispatch} from "react-redux"
export const useAuth = ()=>{

    const dispatch = useDispatch()

    async function handleRegister({email, contact, password, fullname, isSeller = false}) {
        dispatch(setLoading(true))
        try {
            const data = await register({email, contact, password, fullname, isSeller})
            dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setError(error.message))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({email, password}) {
        dispatch(setLoading(true))
        try {
            const data = await login({email, password})
            dispatch(setUser(data.user))
            return data.user
        } catch (error) {
            console.error("[useAuth] handleLogin error:", error)
            dispatch(setError(error.message))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetMe() {
        dispatch(setLoading(true))
        try {
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch {
            dispatch(setUser(null))
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {handleRegister, handleLogin, handleGetMe}
}