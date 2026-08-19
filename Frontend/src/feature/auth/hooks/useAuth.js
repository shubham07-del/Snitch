import { setError, setLoading, setUser } from "../state/auth.slice";
import { login, register, getMe, logout, updateProfile } from "../service/auth.api";
import {useDispatch} from "react-redux"
import toast from "react-hot-toast";
export const useAuth = ()=>{

    const dispatch = useDispatch()

    async function handleRegister({email, contact, password, fullname, isSeller = false}) {
        dispatch(setLoading(true))
        try {
            const data = await register({email, contact, password, fullname, isSeller})
            dispatch(setUser(data.user))
            toast.success("Registered successfully!");
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error.message || "Registration failed";
            dispatch(setError(errorMessage))
            toast.error(errorMessage);
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({email, password}) {
        dispatch(setLoading(true))
        try {
            const data = await login({email, password})
            dispatch(setUser(data.user))
            toast.success("Logged in successfully!");
            return data.user
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error.message || "Login failed";
            console.error("[useAuth] handleLogin error:", error)
            dispatch(setError(errorMessage))
            toast.error(errorMessage);
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

    async function handleLogout() {
        dispatch(setLoading(true))
        try {
            const data = await logout()
            dispatch(setUser(null))
            toast.success("Logged out successfully!");
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error.message || "Logout failed";
            dispatch(setError(errorMessage))
            toast.error(errorMessage);
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleUpdateProfile({fullname, contact, email}) {
        dispatch(setLoading(true))
        try {
            const data = await updateProfile({fullname, contact, email})
            dispatch(setUser(data.user))
            toast.success("Profile updated successfully!");
            return data.user
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error.message || "Profile update failed";
            dispatch(setError(errorMessage))
            toast.error(errorMessage);
        } finally {
            dispatch(setLoading(false))
        }
    }
    return {handleRegister, handleLogin, handleGetMe, handleLogout, handleUpdateProfile}
}