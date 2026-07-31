import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes";
import { useAuth } from "../feature/auth/hooks/useAuth";

const AppContent = () => {
  const { handleGetMe } = useAuth();

  useEffect(() => {
    handleGetMe();
  }, []);

  return <RouterProvider router={router} />;
};

const App = () => {
  return <AppContent />;
};

export default App;
