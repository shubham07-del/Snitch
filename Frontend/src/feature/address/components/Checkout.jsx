import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAddress } from "../hooks/useAddress";
import { useProduct } from "../../product/hooks/useProduct";
import { useCart } from "../../cart/hooks/useCart";
import { useRazorpay } from "react-razorpay";
import { clearCart } from "../../cart/state/cart.slice";
import toast from "react-hot-toast";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isCart = location.state?.isCart;
  const productId = location.state?.productId;
  const variantId = location.state?.variantId;

  const { handleGetAddress } = useAddress();
  const { handleGetProductDetails } = useProduct();
  const { error, isLoading, Razorpay } = useRazorpay();
  const { handleBuyNow, handleVerifyOrder, handleCreateCartOrder } = useCart();
  
  const address = useSelector((state) => state.address?.address);
  const { productDetails, loading: productLoading } = useSelector(
    (state) => state.product,
  );
  const { items: cartItems, total: cartTotal } = useSelector((state) => state.cart);

  const user = useSelector((state) => state.auth.user);

  const [addressLoading, setAddressLoading] = useState(true);

  // -----------------------------
  // Fetch Address
  // -----------------------------
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        await handleGetAddress();
      } catch (error) {
        console.error("Failed to fetch address:", error);
      } finally {
        setAddressLoading(false);
      }
    };

    fetchAddress();
  }, []);

  // -----------------------------
  // Fetch Product
  // -----------------------------
  useEffect(() => {
    if (isCart) return;
    if (!productId) return;

    handleGetProductDetails(productId);
  }, [productId, isCart]);
  // -----------------------------
  // Find Selected Variant
  // -----------------------------
  const selectedVariant = useMemo(() => {
    if (!productDetails?.variants || !variantId) {
      return null;
    }

    return productDetails.variants.find(
      (variant) => String(variant._id) === String(variantId),
    );
  }, [productDetails, variantId]);
  // -----------------------------
  // Price
  // -----------------------------
  const currentPrice = selectedVariant?.price || productDetails?.price;

  const subtotal = isCart ? (cartTotal || 0) : (currentPrice?.amount || 0);

  // Change this according to your delivery logic
  const deliveryCharge = 50;

  const total = subtotal + deliveryCharge;

  // -----------------------------
  // Address Check
  // -----------------------------
  const hasAddress =
    address?.fullname &&
    address?.phone &&
    address?.address &&
    address?.city &&
    address?.state &&
    address?.pincode;

  // -----------------------------
  // Loading
  // -----------------------------
  if (addressLoading || (!isCart && productLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <span className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

          <p className="text-sm text-gray-500">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Invalid Checkout
  // -----------------------------
  if (!isCart && (!productId || !variantId)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold">Invalid Checkout</h2>

        <p className="mt-2 text-sm text-gray-500">
          Product or variant information is missing.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-5 rounded-lg bg-black px-6 py-3 text-sm text-white"
        >
          Go Home
        </button>
      </div>
    );
  }

  if (!isCart && !productDetails) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold">Product Not Found</h2>

        <button
          onClick={() => navigate("/")}
          className="mt-5 rounded-lg bg-black px-6 py-3 text-sm text-white"
        >
          Go Home
        </button>
      </div>
    );
  }
  // -----------------------------
  // Payment
  // -----------------------------
  const handleBuyNowClick = async () => {
    if (!isCart && !variantId) {
      toast.error("Please select a variant before buying.");
      return;
    }
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      let order;
      if (isCart) {
        order = await handleCreateCartOrder();
      } else {
        order = await handleBuyNow({
          productId,
          variantId,
        });
      }

      if (!order) {
        toast.error("Failed to create order. Please try again.");
        return;
      }
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "AFTER",
        description: isCart ? "Cart Checkout" : productDetails?.productName,
        order_id: order.id,
        handler: async (response) => {
          const isValid = await handleVerifyOrder({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          if (isValid) {
            if (isCart) dispatch(clearCart());
            navigate(`/order-success?order_id=${response.razorpay_order_id}`);
          }
        },
        prefill: {
          name: user?.fullname,
          email: user?.email,
          contact: user?.contact,
        },
        theme: { color: "#111111", backdrop_color: "rgba(0,0,0,0.75)" },
      };
      const razorpayInstance = new Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error(err?.response?.data?.message ?? "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 text-black sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>

          <p className="mt-1 text-sm text-gray-500">
            Review your order and complete your purchase.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          {/* ================================= */}
          {/* LEFT - DELIVERY ADDRESS */}
          {/* ================================= */}

          <div className="rounded-2xl bg-[#E4E3E1] p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Delivery Address</h2>

                <p className="mt-1 text-sm text-gray-600">
                  Where should we deliver your order?
                </p>
              </div>

              {hasAddress && (
                <button
                  onClick={() => navigate("/address")}
                  className="text-sm font-medium underline underline-offset-4"
                >
                  Change
                </button>
              )}
            </div>

            {hasAddress ? (
              <div className="rounded-xl bg-white p-5">
                {/* Name */}
                <div className="mb-4">
                  <p className="text-base font-semibold">{address.fullname}</p>

                  <p className="mt-1 text-sm text-gray-600">{address.phone}</p>
                </div>

                {/* Address */}
                <div className="space-y-1 text-sm leading-6 text-gray-700">
                  <p>{address.address}</p>

                  <p>
                    {address.city}, {address.state}
                  </p>

                  <p>
                    {address.pincode}, {address.country}
                  </p>
                </div>

                {/* Email */}
                <div className="mt-4 border-t border-gray-200 pt-4">
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Email
                  </p>

                  <p className="mt-1 text-sm">{address.email}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-black/20 bg-white p-8 text-center">
                <h3 className="font-medium">No delivery address</h3>

                <p className="mt-1 text-sm text-gray-500">
                  Add an address to continue with your order.
                </p>

                <button
                  onClick={() => navigate("/address")}
                  className="mt-5 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  + Add Address
                </button>
              </div>
            )}
          </div>

          {/* ================================= */}
          {/* RIGHT - ORDER SUMMARY */}
          {/* ================================= */}

          <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Order Summary</h2>

            {/* Product */}
            <div className="mt-6 flex flex-col gap-4 border-b border-gray-200 pb-5 max-h-80 overflow-y-auto">
              {isCart ? (
                cartItems?.map((item) => {
                  let imgUrl = item.product?.images?.[0]?.url;
                  const variants = item.product?.variants;
                  if (Array.isArray(variants)) {
                    const found = variants.find((v) => String(v._id) === String(item.variant));
                    if (found?.images?.length) imgUrl = found.images[0].url;
                  } else if (variants?.images?.length) {
                    imgUrl = variants.images[0].url;
                  }
                  
                  return (
                    <div key={item._id} className="flex gap-4">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {imgUrl && <img src={imgUrl} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-medium">{item.product?.productName}</h3>
                        <p className="mt-1 text-xs text-gray-500">Qty: {item.quantity}</p>
                        <p className="mt-2 font-semibold">₹{((item.price?.amount || 0) * (item.quantity || 1)).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={
                        selectedVariant?.images?.[0]?.url || productDetails?.images?.[0]?.url
                      }
                      alt={productDetails?.productName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium">
                      {productDetails?.productName}
                    </h3>

                    {selectedVariant?.attributes && (
                      <div className="mt-2 space-y-1">
                        {Object.entries(selectedVariant.attributes).map(
                          ([key, value]) => (
                            <p key={key} className="text-xs text-gray-500">
                              {key}: {value}
                            </p>
                          ),
                        )}
                      </div>
                    )}

                    <p className="mt-2 font-semibold">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Price Details */}
            <div className="mt-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>

                <span className="font-medium">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery</span>

                <span className="font-medium">₹{deliveryCharge}</span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>

                  <span className="text-xl font-semibold">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Pay */}
            <button
              onClick={handleBuyNowClick}
              disabled={!hasAddress}
              className="mt-6 w-full rounded-xl bg-black px-5 py-4 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Pay ₹{total.toLocaleString("en-IN")}
            </button>

            {!hasAddress && (
              <p className="mt-3 text-center text-xs text-gray-500">
                Add a delivery address to continue.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
