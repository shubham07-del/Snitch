import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";
const SellerRoute = ({ children }) => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading && !user) {
    return <Loader/>;
  }
  if (!user) {
    return <Navigate to={"/login"} />;
  }
  if (user.role !== "seller") {
    return <Navigate to={"/"} />;
  }
  return children;
};

export default SellerRoute;
