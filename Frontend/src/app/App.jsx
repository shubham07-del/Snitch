import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes";
import { useAuth } from "../feature/auth/hooks/useAuth";

import { Toaster } from "react-hot-toast";

const AppContent = () => {
  const { handleGetMe } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    handleGetMe();
  }, []);

  return <RouterProvider router={router} />;
};

const App = () => {
  return (
    <>
      <AppContent />
      <Toaster position="top-right" />
    </>
  );
};

export default App;
