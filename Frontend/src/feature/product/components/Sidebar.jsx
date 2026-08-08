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
        bg-surface border-r border-border-theme
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
          background: "radial-gradient(circle, var(--color-glow) 0%, transparent 70%)",
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
            var(--color-stitch) 10px,
            var(--color-stitch) 11px
          )`,
        }}
      />

      {/* Brand Header */}
      <div className="relative z-10 px-5 pt-7 pb-6 border-b border-border-theme">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] text-muted uppercase tracking-[4px] mb-0.5">
              Seller Studio
            </p>
            <h2 className="text-xl font-bold text-primary tracking-[6px]">
              SNITCH
            </h2>
            <div className="mt-3 flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: "var(--color-emerald-dot)",
                  boxShadow: "var(--color-emerald-glow)",
                }}
              />
              <span className="text-[11px] text-secondary">
                Dashboard active
              </span>
            </div>
          </div>

          {/* Close button — only visible on mobile */}
          <button
            onClick={onClose}
            className="md:hidden flex items-center justify-center w-7 h-7 rounded-lg bg-surface-input border border-border-input text-secondary hover:text-primary hover:border-border-focus transition-all mt-0.5 shrink-0"
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
        <p className="px-2 mb-3 text-[10px] text-muted uppercase tracking-[3px]">
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
                  ? "bg-active-nav-bg text-active-nav-text"
                  : "text-secondary hover:bg-nav-hover-bg hover:text-primary"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Icon badge */}
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-all ${
                    isActive
                      ? "bg-active-nav-icon-bg text-active-nav-text"
                      : "bg-nav-icon-bg text-nav-icon-text group-hover:bg-nav-hover-bg group-hover:text-primary border border-nav-icon-border group-hover:border-border-focus"
                  }`}
                >
                  {icon}
                </span>

                {/* Label + description */}
                <div className="flex flex-col min-w-0">
                  <span
                    className={`text-sm font-semibold leading-tight ${
                      isActive ? "text-active-nav-text" : ""
                    }`}
                  >
                    {label}
                  </span>
                  <span className="text-[11px] leading-tight truncate text-muted">
                    {description}
                  </span>
                </div>

                {/* Active dot */}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="relative z-10 px-5 py-4 border-t border-border-theme">
        <div
          className="absolute top-0 left-5 right-5 h-px opacity-[0.15]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, var(--color-stitch) 0px, var(--color-stitch) 4px, transparent 4px, transparent 8px)",
          }}
        />
        <p className="text-[10px] text-muted leading-relaxed">
          Manage your catalogue, track listings, and grow your store.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;