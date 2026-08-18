import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import ContinueWithGoogle from "../components/ContinueWithGoogle";
import { useSelector } from "react-redux";
import Loader from "../../product/components/Loader";



const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();
  const {loading} = useSelector(state=>state.auth)


  const [form, setForm] = useState({
    fullname: "",
    email: "",
    contact: "",
    password: "",
    isSeller: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({
      email: form.email,
      contact: form.contact,
      password: form.password,
      fullname: form.fullname,
      isSeller: form.isSeller,
    });

    navigate("/login");
  };

  if(loading){
    return <Loader/>
  }
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-[Inter,sans-serif] relative overflow-hidden">



      {/* Background effects */}
      {/* Soft ambient glow */}
      <div
        className="absolute top-[-20%] right-[-10%] w-125 h-125 rounded-full opacity-[0.12]"
        style={{
          background: "radial-gradient(circle, var(--color-glow) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-15%] left-[-10%] w-100 h-100 rounded-full opacity-[0.08]"
        style={{
          background: "radial-gradient(circle, var(--color-glow) 0%, transparent 70%)",
        }}
      />

      {/* Diagonal fabric texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
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

      {/* Subtle horizontal stitch line */}
      <div
        className="absolute top-1/2 left-0 w-full h-px opacity-[0.15]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, var(--color-stitch) 0px, var(--color-stitch) 6px, transparent 6px, transparent 12px)",
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="mb-4 text-center">
          <p className="text-[10px] text-muted uppercase tracking-[4px] mb-1">
            Est. 2026
          </p>
          <h1 className="text-2xl font-bold text-primary tracking-[6px] leading-none">
            AFTER
          </h1>
          <p className="text-[11px] text-muted uppercase tracking-[3px] mt-2">
            Wear your way
          </p>
          <div className="w-8 h-px bg-divider mx-auto mt-3 mb-1"></div>
          <p className="text-secondary text-[13px]">Join the club</p>
        </div>

        {/* Card */}
        <div className="bg-surface-card border border-border-theme rounded-2xl p-5">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullname"
                className="block text-[11px] font-medium text-secondary uppercase tracking-wider mb-1"
              >
                Full Name
              </label>
              <input
                id="fullname"
                name="fullname"
                type="text"
                placeholder="John Doe"
                value={form.fullname}
                onChange={handleChange}
                required
                className="w-full h-9 bg-surface-input border border-border-input rounded-lg px-3.5 text-sm text-primary placeholder-placeholder outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus/20 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-[11px] font-medium text-secondary uppercase tracking-wider mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full h-9 bg-surface-input border border-border-input rounded-lg px-3.5 text-sm text-primary placeholder-placeholder outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus/20 transition-all"
              />
            </div>

            {/* Contact */}
            <div>
              <label
                htmlFor="contact"
                className="block text-[11px] font-medium text-secondary uppercase tracking-wider mb-1"
              >
                Contact Number
              </label>
              <input
                id="contact"
                name="contact"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="9876543210"
                value={form.contact}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setForm({ ...form, contact: val });
                }}
                required
                className="w-full h-9 bg-surface-input border border-border-input rounded-lg px-3.5 text-sm text-primary placeholder-placeholder outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus/20 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-[11px] font-medium text-secondary uppercase tracking-wider mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full h-9 bg-surface-input border border-border-input rounded-lg px-3.5 pr-10 text-sm text-primary placeholder-placeholder outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary transition-colors"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* isSeller Checkbox */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="checkbox"
                aria-checked={form.isSeller}
                onClick={() => setForm({ ...form, isSeller: !form.isSeller })}
                className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-all ${
                  form.isSeller
                    ? "border-border-input"
                    : "border-border-input hover:border-border-focus"
                }`}
                style={{
                  backgroundColor: form.isSeller
                    ? "var(--color-checkbox-checked-bg)"
                    : "var(--color-checkbox-unchecked-bg)",
                  borderColor: form.isSeller
                    ? "var(--color-checkbox-checked-border)"
                    : undefined,
                }}
              >
                {form.isSeller && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="var(--color-checkbox-check)"
                    className="w-3.5 h-3.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
              <label
                onClick={() => setForm({ ...form, isSeller: !form.isSeller })}
                className="text-sm text-secondary cursor-pointer select-none"
              >
                Register as a Seller
              </label>
            </div>

            {/* Submit */}
            <button
              disabled={loading}
              type="submit"
              className="w-full h-11 cursor-pointer bg-btn-primary-bg hover:bg-btn-primary-hover text-btn-primary-text text-[13px] font-bold tracking-widest uppercase rounded-xl active:scale-[0.99] transition-all"
              style={{ boxShadow: "0 4px 24px var(--color-btn-primary-shadow)" }}
            >
              Create Account
            </button>
                        {/* OR Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-divider" />
              <span className="text-[11px] text-muted font-medium tracking-widest uppercase">
                or
              </span>
              <div className="flex-1 h-px bg-divider" />
            </div>

            {/* Google Sign In — gradient border */}
            <ContinueWithGoogle />
          </form>
        </div>

        {/* Footer */}
        <p className="text-muted text-sm text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:text-secondary transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
