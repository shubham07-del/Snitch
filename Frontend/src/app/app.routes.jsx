import { createBrowserRouter } from "react-router-dom";
import Register from "../feature/auth/pages/Register";
import Login from "../feature/auth/pages/Login";
import CreateProduct from "../feature/product/pages/CreateProduct";
import GetSellerProduct from "../feature/product/pages/GetSellerProduct";
import SellerLayout from "../feature/product/components/SellerLayout";
import SellerRoute from "../feature/product/components/SellerRoute";

export const router = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <main></main>,
  },
  {
    // Seller area — sidebar persists across all children
    element: <SellerLayout />,
    children: [
      {
        path: "/seller/createProduct",
        element: <SellerRoute><CreateProduct /></SellerRoute>,
      },
      {
        path: "/seller/products",
        element: <SellerRoute><GetSellerProduct /></SellerRoute>
      },
    ],
  },
]);
