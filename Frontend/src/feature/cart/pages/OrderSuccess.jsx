import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const circleRef = useRef(null);

  // Animate the checkmark circle on mount
  useEffect(() => {
    const el = circleRef.current;
    if (el) {
      el.style.strokeDashoffset = "0";
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f7f5] font-sans text-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">

        {/* ── Animated Checkmark ── */}
        <div className="flex justify-center mb-8">
          <div className="relative flex items-center justify-center w-28 h-28">
            {/* Pulsing ring */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-gray-900 opacity-10 animate-ping" />
            {/* Outer circle */}
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gray-900 shadow-2xl shadow-black/20">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Heading ── */}
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
          Order Confirmed
        </h1>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          Thank you for your purchase. Your order has been placed successfully
          and is being processed.
        </p>

        {/* ── Order ID Card ── */}
        {orderId && (
          <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 mb-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
              Order ID
            </p>
            <p className="text-sm font-mono font-semibold text-gray-800 break-all">
              {orderId}
            </p>
          </div>
        )}

        {/* ── Steps ── */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { icon: "✓", label: "Payment Received" },
            { icon: "⟳", label: "Processing" },
            { icon: "⬡", label: "Shipping Soon" },
          ].map((step, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all ${
                i === 0
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-400 border-gray-200"
              }`}
            >
              <span className="text-base">{step.icon}</span>
              <span>{step.label}</span>
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-gray-200 mb-8" />

        {/* ── Actions ── */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-full rounded-full bg-gray-900 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-gray-700 hover:scale-[1.02] active:scale-100 shadow-lg shadow-black/10"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="w-full rounded-full border border-gray-300 bg-white px-8 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:border-gray-400 hover:scale-[1.02] active:scale-100"
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;