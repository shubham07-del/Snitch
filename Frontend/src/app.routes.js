import {createBrowserRouter} from "react-router-dom"
import Register from "./feature/auth/pages/Register"
import Login from "./feature/auth/pages/Login"

export const router = createBrowserRouter([
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/",
        element:<main><h1>hello</h1></main>
    }
])