import { useState } from "react";
import { useAddress } from "../hooks/useAddress";

const Address = () => {
  const { handleCreateAddress } = useAddress();

  const [form, setForm] = useState({
    fullname: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await handleCreateAddress(form);

      // optional: reset form after successful submission
      setForm({
        fullname: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        country: "",
      });
    } catch (error) {
      console.error("Address submission failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E4E3E1] px-4 py-10 text-black">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            Delivery Address
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Enter your address details for delivery.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm"
        >
          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="fullname"
              value={form.fullname}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-black"
            />
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Phone
              </label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-black"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Address
            </label>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="House no., street, area"
              rows={3}
              required
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-black"
            />
          </div>

          {/* City + State */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                City
              </label>

              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Enter city"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                State
              </label>

              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="Enter state"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-black"
              />
            </div>
          </div>

          {/* Pincode + Country */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Pincode
              </label>

              <input
                type="text"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="Enter pincode"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Country
              </label>

              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Enter country"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-black"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving Address...
              </span>
            ) : (
              "Save Address"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Address;