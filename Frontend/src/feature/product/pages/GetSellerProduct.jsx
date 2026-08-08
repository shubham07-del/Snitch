import React, { useEffect, useState } from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import ThemeToggle from "../../../app/ThemeToggle";

const CURRENCY_SYMBOLS = {
  INR: "₹",
  USD: "$",
  JPY: "¥",
  GBP: "£",
  EUR: "€",
};

const GetSellerProduct = () => {
  const { handleGetSellerProduct } = useProduct();
  const products = useSelector((state) => state.product?.sellerProduct ?? []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await handleGetSellerProduct();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="seller w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Page heading */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[10px] text-muted uppercase tracking-[4px] mb-1">
            Seller Studio
          </p>
          <h2 className="text-xl font-bold text-primary tracking-widest">
            My Listings
          </h2>
          <div className="w-8 h-px bg-divider mt-2" />
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle size="sm" />
          <Link
            to="/seller/createProduct"
            className="flex items-center gap-2 h-9 px-4 bg-btn-primary-bg hover:bg-btn-primary-hover active:scale-[0.98] text-btn-primary-text text-[12px] font-bold tracking-widest uppercase rounded-xl transition-all"
            style={{ boxShadow: "0 4px 20px var(--color-btn-primary-shadow)" }}
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            New
          </Link>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <Loader/>
      )}

      {/* Empty state */}
      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center border"
            style={{
              backgroundColor: "var(--color-empty-icon-bg)",
              borderColor: "var(--color-empty-icon-border)",
            }}
          >
            <svg
              className="w-6 h-6"
              style={{ color: "var(--color-empty-icon-text)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-primary mb-1">
              No products yet
            </p>
            <p className="text-[12px] text-secondary">
              Start by listing your first product.
            </p>
          </div>
          <Link
            to="/seller/createProduct"
            className="mt-1 h-9 px-5 flex items-center gap-2 bg-btn-primary-bg hover:bg-btn-primary-hover text-btn-primary-text text-[12px] font-bold tracking-widest uppercase rounded-xl transition-all"
          >
            Create Product
          </Link>
        </div>
      )}

      {/* Product grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="group bg-surface-card border border-border-theme rounded-2xl overflow-hidden hover:border-border-focus transition-all duration-200"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] bg-surface overflow-hidden">
                {product.images?.[0]?.url ? (
                  <img
                    src={product.images[0].url}
                    alt={product.productName}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-divider"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                      />
                    </svg>
                  </div>
                )}
                {/* Image count badge */}
                {product.images?.length > 1 && (
                  <span
                    className="absolute bottom-2 right-2 text-[10px] font-medium rounded-md px-1.5 py-0.5"
                    style={{
                      color: "var(--color-image-badge-text)",
                      backgroundColor: "var(--color-image-badge-bg)",
                      border: "1px solid var(--color-image-badge-border)",
                    }}
                  >
                    +{product.images.length - 1}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-primary truncate mb-1">
                  {product.productName}
                </h3>
                <p className="text-[12px] text-secondary line-clamp-2 mb-3 leading-relaxed">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">
                    {CURRENCY_SYMBOLS[product.price?.currency] ?? ""}
                    {Number(product.price?.amount).toLocaleString()}
                    <span className="ml-1 text-[10px] font-normal text-secondary">
                      {product.price?.currency}
                    </span>
                  </span>
                  <span className="text-[10px] text-muted uppercase tracking-wider">
                    {new Date(product.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GetSellerProduct;
