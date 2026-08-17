import React, { useEffect, useMemo } from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import { Link, useSearchParams } from "react-router-dom";
import Hero from "../components/Hero";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";

const CURRENCY_SYMBOLS = {
  INR: "₹",
  USD: "$",
  JPY: "¥",
  GBP: "£",
  EUR: "€",
};

/* ── Inline styles for Swiper cards inside product tiles ── */
const swiperStyles = `
  .product-card-swiper {
    width: 100%;
    height: 100%;
  }
  .product-card-swiper .swiper-slide {
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-surface-hover);
  }
  .product-card-swiper .swiper-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Products = () => {
  const { handleGetProducts } = useProduct();
  const { products, loading } = useSelector((state) => state.product);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("q") || "";

  useEffect(() => {
    handleGetProducts();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.productName?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [products, search]);

  return (
    <div className="min-h-screen bg-surface font-[Inter,sans-serif] relative">
      {/* Inject swiper card styles */}
      <style>{swiperStyles}</style>

      {/* ── Subtle background accent ── */}
      <div
        className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.06] pointer-events-none blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-glow) 0%, transparent 70%)" }}
      />
      <div
        className="fixed bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.04] pointer-events-none blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-glow) 0%, transparent 70%)" }}
      />


      {/* ── Hero Section ── */}
      <Hero />

      {/* ── Main content ── */}
      <main className="relative z-10 max-w-[1200px] mx-auto px-3 sm:px-5 pt-6 pb-16">
        {/* Category label + result count */}
        <div className="flex items-baseline justify-between mb-5 px-1">
          <div>
            <h2 className="text-xs text-muted uppercase tracking-[3px] mb-0.5">
              Collection
            </h2>
            <p className="text-xl font-semibold text-primary tracking-wide">
              {search ? `Results for "${search}"` : "All Products"}
            </p>
          </div>
          {!loading && (
            <span className="text-[11px] text-muted tabular-nums">
              {filtered.length} {filtered.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {/* ── Loading ── */}
        {loading && <Loader />}

        {/* ── Empty state ── */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-5">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "var(--color-empty-icon-bg)",
                border: "1px solid var(--color-empty-icon-border)",
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
                  d="M15.75 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-primary mb-1">
                {search ? "No results found" : "Nothing here yet"}
              </p>
              <p className="text-sm text-secondary max-w-xs">
                {search
                  ? "Try a different search term or browse the full collection."
                  : "New pieces are dropping soon — stay tuned."}
              </p>
            </div>
          </div>
        )}

        {/* ── Product grid ── */}
        {!loading && filtered.length > 0 && (
          <div id="products-grid" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filtered.map((product) => (
              <Link
                key={product._id}
                className="group cursor-pointer"
                to={`/product/${product._id}`}
              >
                {/* Image container — 3:4 portrait */}
                <div className="relative aspect-square overflow-hidden bg-surface-hover rounded-lg">
                  {product.images?.length > 1 ? (
                    /* ── Swiper card stack for multiple images ── */
                    <>
                      <Swiper
                        effect="cards"
                        grabCursor={true}
                        modules={[EffectCards]}
                        className="product-card-swiper"
                      >
                        {product.images.map((img, idx) => (
                          <SwiperSlide key={img._id || idx}>
                            <img
                              src={img.url}
                              alt={`${product.productName} — ${idx + 1}`}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      {/* Hint label */}
                      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 text-[9px] font-medium uppercase tracking-[1.5px] text-white pointer-events-none flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
                        Slide to view more
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </span>
                    </>
                  ) : product.images?.[0]?.url ? (
                    /* ── Single image — simple render ── */
                    <img
                      src={product.images[0].url}
                      alt={product.productName}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    />
                  ) : (
                    /* ── No image placeholder ── */
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-10 h-10"
                        style={{ color: "var(--color-empty-icon-text)" }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Product info — minimal, beneath image */}
                <div className="mt-2 px-0.5">
                  <h3 className="text-[12px] font-medium text-primary truncate leading-snug">
                    {product.productName}
                  </h3>
                  <p className="text-[11px] text-secondary truncate mt-0.5">
                    {product.description}
                  </p>
                  <p className="text-[12px] font-semibold text-primary mt-1">
                    {CURRENCY_SYMBOLS[product.price?.currency] ?? ""}
                    {Number(product.price?.amount).toLocaleString()}
                    <span className="ml-1 text-[9px] font-normal text-muted">
                      {product.price?.currency}
                    </span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
