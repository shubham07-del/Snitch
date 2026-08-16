import { createBrowserRouter } from "react-router-dom";
import Register from "../feature/auth/pages/Register";
import Login from "../feature/auth/pages/Login";
import CreateProduct from "../feature/product/pages/CreateProduct";
import GetSellerProduct from "../feature/product/pages/GetSellerProduct";
import SellerLayout from "../feature/product/components/SellerLayout";
import SellerRoute from "../feature/product/components/SellerRoute";
import Products from "../feature/product/pages/Products";
import ProductDetails from "../feature/product/pages/ProductDetails";
import SellerProductDetails from "../feature/product/pages/SellerProductDetails";
import Cart from "../feature/cart/pages/Cart";
import RootLayout from "../components/RootLayout";

export const router = createBrowserRouter([
  // ── Auth pages (no Navbar) ──
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },

  // ── Public & buyer pages (with shared Navbar) ──
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Products />,
      },
      {
        path: "/product/:productId",
        element: <ProductDetails />,
      },
      {
        path: "/cart",
        element: <SellerRoute><Cart /></SellerRoute>,
      },
    ],
  },

  // ── Seller area (sidebar layout, no global Navbar) ──
  {
    element: <SellerLayout />,
    children: [
      {
        path: "/seller/createProduct",
        element: <SellerRoute><CreateProduct /></SellerRoute>,
      },
      {
        path: "/seller/products",
        element: <SellerRoute><GetSellerProduct /></SellerRoute>,
      },
      {
        path: "/seller/product/:productId",
        element: <SellerRoute><SellerProductDetails /></SellerRoute>,
      },
    ],
  },
]);
