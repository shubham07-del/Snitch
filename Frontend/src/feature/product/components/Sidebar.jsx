import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  {
    to: "/seller/createProduct",
    label: "Create Product",
    description: "List a new item",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    ),
  },
  {
    to: "/seller/products",
    label: "My Listings",
    description: "View your products",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
        />
      </svg>
    ),
  },
];

/**
 * Sidebar
 * @param {boolean} isOpen   - controlled from SellerLayout (mobile only)
 * @param {Function} onClose - close callback (mobile only)
 */
const Sidebar = ({ isOpen, onClose }) => {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30
        w-64 h-screen
        bg-neutral-950 border-r border-neutral-800/60
        flex flex-col
        font-[Inter,sans-serif]
        overflow-hidden
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:z-auto
      `}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-[-30%] right-[-30%] w-64 h-64 rounded-full opacity-[0.08] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #ffffff 0%, transparent 70%)",
        }}
      />

      {/* Fabric texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            #ffffff 10px,
            #ffffff 11px
          )`,
        }}
      />

      {/* Brand Header */}
      <div className="relative z-10 px-5 pt-7 pb-6 border-b border-neutral-800/60">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] text-neutral-600 uppercase tracking-[4px] mb-0.5">
              Seller Studio
            </p>
            <h2 className="text-xl font-bold text-white tracking-[6px]">
              SNITCH
            </h2>
            <div className="mt-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
              <span className="text-[11px] text-neutral-500">
                Dashboard active
              </span>
            </div>
          </div>

          {/* Close button — only visible on mobile */}
          <button
            onClick={onClose}
            className="md:hidden flex items-center justify-center w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-white hover:border-neutral-700 transition-all mt-0.5 shrink-0"
            aria-label="Close sidebar"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex-1 px-3 py-5 space-y-1">
        <p className="px-2 mb-3 text-[10px] text-neutral-600 uppercase tracking-[3px]">
          Products
        </p>

        {navItems.map(({ to, label, description, icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose} // auto-close on mobile after navigation
            className={({ isActive }) =>
              `group flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-white text-neutral-950"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Icon badge */}
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-all ${
                    isActive
                      ? "bg-neutral-200 text-neutral-950"
                      : "bg-neutral-900 text-neutral-500 group-hover:bg-neutral-800 group-hover:text-white border border-neutral-800 group-hover:border-neutral-700"
                  }`}
                >
                  {icon}
                </span>

                {/* Label + description */}
                <div className="flex flex-col min-w-0">
                  <span
                    className={`text-sm font-semibold leading-tight ${
                      isActive ? "text-neutral-950" : ""
                    }`}
                  >
                    {label}
                  </span>
                  <span className="text-[11px] leading-tight truncate text-neutral-600">
                    {description}
                  </span>
                </div>

                {/* Active dot */}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-neutral-500 shrink-0" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="relative z-10 px-5 py-4 border-t border-neutral-800/60">
        <div
          className="absolute top-0 left-5 right-5 h-px opacity-[0.15]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 4px, transparent 4px, transparent 8px)",
          }}
        />
        <p className="text-[10px] text-neutral-700 leading-relaxed">
          Manage your catalogue, track listings, and grow your store.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;