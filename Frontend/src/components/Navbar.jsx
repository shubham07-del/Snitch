import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const cartItems = useSelector(state => state.cart?.items);
    const cartCount = cartItems?.length || 0;

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmed = searchQuery.trim();
        if (trimmed) {
            navigate(`/?q=${encodeURIComponent(trimmed)}`);
        } else {
            navigate("/");
        }
    };

    const handleClear = () => {
        setSearchQuery("");
        navigate("/");
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
            <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-3 sm:gap-6">

                    {/* ── Left: Brand & Back Button ── */}
                    <div className="flex items-center gap-3">
                        {location.pathname !== "/" && (
                            <button
                                onClick={() => navigate(-1)}
                                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300"
                            >
                                <svg className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}
                        <div
                            className="flex flex-col cursor-pointer shrink-0"
                            onClick={() => navigate("/")}
                        >
                            <span className="text-lg sm:text-xl font-black tracking-[0.25em] uppercase text-gray-900 leading-none">
                                AFTER
                            </span>
                            <span className="text-[8px] sm:text-[9px] font-medium tracking-[0.3em] uppercase text-gray-400 leading-none mt-0.5">
                                Wear your way
                            </span>
                        </div>
                    </div>

                    {/* ── Right: Search + Icons ── */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
                        {/* Search bar */}
                        <form onSubmit={handleSearch} className="relative flex-1 max-w-sm hidden sm:block">
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0013.15 13.15z" />
                            </svg>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="w-full h-9 rounded-full border border-gray-200 bg-gray-50 pl-9 pr-8 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-200"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer transition-colors"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </form>

                        {/* Mobile Search Icon (only visible on small screens) */}
                        <div className="sm:hidden block relative">
                           <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search..."
                                className="w-24 sm:w-32 h-9 rounded-full border border-gray-200 bg-gray-50 px-3 text-xs text-gray-800 outline-none transition-all focus:border-gray-400 focus:w-32"
                            />
                           </form>
                        </div>

                        {/* Profile icon */}
                        <button
                            onClick={() => navigate("/profile")}
                            className="relative flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300"
                        >
                            <svg className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </button>

                        {/* Cart icon */}
                        <button
                            onClick={() => navigate("/cart")}
                            className="relative flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300"
                        >
                            <svg className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-gray-900 text-[9px] sm:text-[10px] font-bold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
