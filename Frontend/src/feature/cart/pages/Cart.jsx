import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCart } from "../hooks/useCart";
import { useAddress } from "../../address/hooks/useAddress";
import { useNavigate } from "react-router-dom";
import { useRazorpay } from "react-razorpay";
import { clearCart } from "../state/cart.slice";
const Cart = () => {
  const { error, isLoading, Razorpay } = useRazorpay();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state) => state.cart);
  const user = useSelector(state=>state.auth.user);
  const address = useSelector((state) => state.address?.address);

  const {
    handleGetCart,
    handleIncrementCartItem,
    handleDecrementCartItem,
    handleCreateCartOrder,
    handleVerifyOrder,
    handleRemoveCartItem
  } = useCart();
  const { handleGetAddress } = useAddress();
  const navigate = useNavigate();

  useEffect(() => {
    handleGetCart();
    handleGetAddress();
  }, []);

  const formatPrice = (amount, currency = "INR") =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);

  const subtotal = total ?? 0;

  const getVariantDetails = (item) => item.product?.variants ?? null;

  const getItemImage = (item) => {
    const variant = getVariantDetails(item);
    if (variant?.images?.length > 0) return variant.images[0].url;
    if (item.product?.images?.length > 0) return item.product.images[0].url;
    return null;
  };

  const getVariantAttributes = (item) => {
    const variant = getVariantDetails(item);
    if (!variant?.attributes) return [];
    return Object.entries(variant.attributes);
  };

  const handleCheckout = () => {
    const hasAddress =
      address?.fullname &&
      address?.phone &&
      address?.address &&
      address?.city &&
      address?.state &&
      address?.pincode;

    if (hasAddress) {
      navigate("/checkout", { state: { isCart: true } });
    } else {
      navigate("/address");
    }
  };


  if (!items) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
      </div>
    );
  }

  return (
    <div className="bg-[#f8f7f5] font-sans text-gray-900">
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* ─── Empty State ─── */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-36 text-center">
            <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm">
              <svg
                className="h-12 w-12 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Your bag is empty
            </h2>
            <p className="text-sm text-gray-500 mb-10 max-w-xs">
              Discover our collection and add the pieces you love.
            </p>
            <button
              onClick={() => navigate("/")}
              className="rounded-full bg-gray-900 px-10 py-3.5 text-sm font-semibold text-white transition-all hover:bg-gray-700 hover:scale-[1.02] active:scale-100 shadow-lg shadow-black/10"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-10 xl:gap-14">
            {/* ─── Left: Items ─── */}
            <div className="space-y-3">
              {/* Header row */}
              <div
                className="hidden md:grid items-center gap-6 px-5 pb-1"
                style={{ gridTemplateColumns: "1fr 120px 100px" }}
              >
                <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Product
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 text-center">
                  Quantity
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 text-right">
                  Price
                </span>
              </div>

              {items.map((item, idx) => {
                const imgUrl = getItemImage(item);
                const attrs = getVariantAttributes(item);
                const qty = item.quantity ?? 1;
                const linePrice = formatPrice(
                  (item.price?.amount ?? 0) * qty,
                  item.price?.currency,
                );

                // Detect seller price change after item was added to cart
                const variantDetails = getVariantDetails(item);
                const currentVariantPrice =
                  variantDetails?.price?.amount ?? item.price?.amount ?? 0;
                const cartPrice = item.price?.amount ?? 0;
                const priceDiff = currentVariantPrice - cartPrice;
                const priceChanged = priceDiff !== 0;

                return (
                  <div
                    key={item._id}
                    className="group relative rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    {/* Outer grid: Product info | Qty | Price */}
                    <div
                      className="md:grid md:items-center md:gap-6 flex gap-5"
                      style={{ gridTemplateColumns: "1fr 120px 100px" }}
                    >
                      {/* Col 1: Image + Info */}
                      <div className="flex gap-4 min-w-0 flex-1">
                        {/* Image */}
                        <div
                          className="relative h-36 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100 cursor-pointer"
                          onClick={() =>
                            navigate(`/product/${item.product?._id}`)
                          }
                        >
                          {imgUrl ? (
                            <>
                              <img
                                src={imgUrl}
                                alt={item.product?.productName}
                                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                            </>
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-300">
                              <svg
                                className="h-10 w-10"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1"
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex flex-col justify-center min-w-0 flex-1">
                          <h3
                            onClick={() =>
                              navigate(`/product/${item.product?._id}`)
                            }
                            className="text-[15px] font-bold text-gray-900 cursor-pointer hover:text-gray-600 transition-colors truncate leading-snug"
                          >
                            {item.product?.productName}
                          </h3>
                          <p className="mt-1 text-xs text-gray-400 font-medium">
                            {formatPrice(
                              item.price?.amount,
                              item.price?.currency,
                            )}{" "}
                            / item
                          </p>

                          {/* Attributes */}
                          {attrs.length > 0 && (
                            <div className="mt-2.5 flex flex-wrap gap-1.5">
                              {attrs.map(([key, val]) => (
                                <span
                                  key={key}
                                  className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] font-medium text-gray-600 capitalize"
                                >
                                  <span className="text-gray-400">{key}:</span>{" "}
                                  {val}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Mobile: Qty stepper + line price */}
                          <div className="mt-3 flex w-full items-center justify-between md:hidden">
                            <div className="flex items-center rounded-full border border-gray-200 bg-gray-50 overflow-hidden">
                              <button
                                onClick={() => {
                                  handleDecrementCartItem({
                                    productId: item.product._id,
                                    variantId: item.variant,
                                  });
                                }}
                                className="flex h-8 w-8 items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
                              >
                                <svg
                                  className="h-3.5 w-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2.5"
                                    d="M20 12H4"
                                  />
                                </svg>
                              </button>
                              <span className="w-8 text-center text-sm font-bold text-gray-900 select-none">
                                {qty}
                              </span>
                              <button
                                onClick={() => {
                                  handleIncrementCartItem({
                                    productId: item.product._id,
                                    variantId: item.variant,
                                  });
                                }}
                                className="flex h-8 w-8 items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
                              >
                                <svg
                                  className="h-3.5 w-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2.5"
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                              </button>
                            </div>
                            <p className="ml-auto text-right text-[15px] font-bold text-gray-900">
                              {linePrice}
                            </p>
                          </div>

                          {/* Remove button — always visible, bottom left of info */}
                          <button
                          onClick={()=>handleRemoveCartItem({productId:item.product._id,variantId:item.variant})}
                          className="mt-3 flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-500 cursor-pointer transition-colors">
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Remove
                          </button>
                          {priceChanged && (
                            <div
                              className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                priceDiff < 0
                                  ? "bg-green-50 text-green-700 border border-green-200"
                                  : "bg-red-50 text-red-600 border border-red-200"
                              }`}
                            >
                              {priceDiff < 0 ? (
                                <svg
                                  className="h-3 w-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2.5"
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="h-3 w-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2.5"
                                    d="M5 15l7-7 7 7"
                                  />
                                </svg>
                              )}
                              {priceDiff < 0
                                ? "Price dropped to"
                                : "Price increased to"}{" "}
                              <span className="font-bold">
                                {formatPrice(
                                  currentVariantPrice,
                                  item.price?.currency,
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Col 2: Qty stepper */}
                      <div className="hidden md:flex flex-col items-center gap-2">
                        <div className="flex items-center rounded-full border border-gray-200 bg-gray-50 overflow-hidden">
                          <button
                            onClick={() => {
                              handleDecrementCartItem({
                                productId: item.product._id,
                                variantId: item.variant,
                              });
                            }}
                            className="flex h-8 w-8 items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
                          >
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-gray-900 select-none">
                            {qty}
                          </span>
                          <button
                            onClick={() => {
                              handleIncrementCartItem({
                                productId: item.product._id,
                                variantId: item.variant,
                              });
                            }}
                            className="flex h-8 w-8 items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
                          >
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Col 3: Price */}
                      <div className="hidden md:flex justify-end">
                        <p className="text-[15px] font-bold text-gray-900">
                          {linePrice}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Promo / Trust strip */}
              <div className="mt-2 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-5">
                {[
                  { svg: "M5 13l4 4L19 7", label: "30-day free returns" },
                  {
                    svg: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                    label: "Secure checkout",
                  },
                  {
                    svg: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8",
                    label: "Original packaging",
                  },
                ].map(({ svg, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 text-xs text-gray-500 font-medium"
                  >
                    <svg
                      className="h-4 w-4 shrink-0 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d={svg}
                      />
                    </svg>
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Right: Order Summary ─── */}
            <div className="mt-10 lg:mt-0">
              <div className="sticky top-24 rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/60 overflow-hidden">
                {/* Summary header */}
                <div className="bg-gray-900 px-6 py-5">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-white">
                    Order Summary
                  </h2>
                  <p className="mt-1 text-xs text-gray-400">
                    {items.length} {items.length === 1 ? "item" : "items"} in
                    your bag
                  </p>
                </div>

                <div className="px-6 py-6 space-y-4">
                  {/* Line items summary */}
                  <div className="max-h-48 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                    {items.map((item) => {
                      const imgUrl = getItemImage(item);
                      return (
                        <div key={item._id} className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            {imgUrl ? (
                              <img
                                src={imgUrl}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-gray-200" />
                            )}
                          </div>
                          <div className="flex flex-1 min-w-0 items-center justify-between gap-2">
                            <p className="truncate text-xs font-medium text-gray-700">
                              {item.product?.productName}
                            </p>
                            <p className="shrink-0 text-xs font-semibold text-gray-900">
                              {formatPrice(
                                item.price?.amount * item.quantity,
                                item.price?.currency,
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="h-px bg-gray-100" />

                  {/* Price breakdown */}
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span className="font-medium text-gray-800">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Shipping</span>
                      <span className="font-medium text-emerald-600">Free</span>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100" />

                  <div className="flex justify-between">
                    <span className="text-base font-extrabold text-gray-900">
                      Total
                    </span>
                    <span className="text-base font-extrabold text-gray-900">
                      {formatPrice(total)}
                    </span>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={handleCheckout}
                    className="w-full cursor-pointer rounded-2xl bg-gray-900 py-4 text-sm font-bold tracking-wide text-white transition-all hover:bg-gray-700 hover:scale-[1.01] active:scale-100 shadow-lg shadow-black/15 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                  >
                    Proceed to Checkout
                    <svg
                      className="ml-2 inline-block h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      navigate(-1);
                    }}
                    className="w-full cursor-pointer rounded-2xl bg-gray-50 border border-gray-300 py-4 text-sm font-bold tracking-wide text-black transition-all hover:scale-[1.01] active:scale-100 shadow-lg shadow-black/15 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                  >
                    Continue Shopping
                    <svg
                      className="ml-2 inline-block h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </button>

                  {/* Secure notice */}
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    256-bit SSL encrypted & secure
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
