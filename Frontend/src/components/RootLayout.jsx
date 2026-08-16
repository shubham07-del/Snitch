import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const RootLayout = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Navbar />
            <Outlet />
        </div>
    );
};

export default RootLayout;
