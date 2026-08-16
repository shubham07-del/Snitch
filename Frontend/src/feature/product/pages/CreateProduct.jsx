import React, { useState, useRef } from "react";
import { useProduct } from "../hooks/useProduct";
import { useNavigate } from "react-router-dom";



const CURRENCIES = ["INR", "USD", "JPY", "GBP", "EUR"];

const CURRENCY_SYMBOLS = {
  INR: "₹",
  USD: "$",
  JPY: "¥",
  GBP: "£",
  EUR: "€",
};

const CreateProduct = () => {
  const { handleCreateProduct } = useProduct();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
    stock: "",
    images: [], // File objects
  });

  const [attributes, setAttributes] = useState([{ key: "", value: "" }]);
  const [previews, setPreviews] = useState([]); // base64 preview URLs
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAttributeChange = (index, field, value) => {
    const newAttributes = [...attributes];
    newAttributes[index][field] = value;
    setAttributes(newAttributes);
  };

  const addAttribute = () => {
    setAttributes([...attributes, { key: "", value: "" }]);
  };

  const removeAttribute = (index) => {
    if (attributes.length > 1) {
      setAttributes(attributes.filter((_, i) => i !== index));
    } else {
      setAttributes([{ key: "", value: "" }]);
    }
  };

  const MAX_IMAGES = 7;

  const addFiles = (files) => {
    const remaining = MAX_IMAGES - formData.images.length;
    if (remaining <= 0) return;
    const newFiles = Array.from(files).slice(0, remaining);
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...newFiles] }));

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e) => {
    addFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) addFiles(files);
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("productName", formData.productName);
      data.append("description", formData.description);
      data.append("priceAmount", formData.priceAmount);
      data.append("priceCurrency", formData.priceCurrency);
      data.append("stock", formData.stock);
      
      const attrsObj = {};
      attributes.forEach((attr) => {
        if (attr.key.trim() && attr.value.trim()) {
          attrsObj[attr.key.trim()] = attr.value.trim();
        }
      });
      data.append("attributes", JSON.stringify(attrsObj));

      formData.images.forEach((file) => {
        data.append("images", file);
      });

      await handleCreateProduct(data);
      navigate("/seller/products");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4 sm:px-8">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-[10px] text-muted uppercase tracking-[4px] mb-1">New Listing</p>
          <h2 className="text-xl font-bold text-primary tracking-widest">Create Product</h2>
          <div className="w-8 h-px bg-divider mt-2" />
        </div>
      </div>

      <div className="bg-surface-card border border-border-theme rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="productName"
              className="block text-[11px] font-medium text-secondary uppercase tracking-wider mb-1"
            >
              Product Name
            </label>
            <input
              id="productName"
              name="productName"
              type="text"
              placeholder="e.g. Oversized Drop-Shoulder Tee"
              value={formData.productName}
              onChange={handleChange}
              required
              className="w-full h-9 bg-surface-input border border-border-input rounded-lg px-3.5 text-sm text-primary placeholder-placeholder outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus/20 transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-[11px] font-medium text-secondary uppercase tracking-wider mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Describe the material, fit, or style of this piece..."
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full bg-surface-input border border-border-input rounded-lg px-3.5 py-2.5 text-sm text-primary placeholder-placeholder outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus/20 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-secondary uppercase tracking-wider mb-1">
              Price
            </label>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  id="priceCurrency"
                  name="priceCurrency"
                  value={formData.priceCurrency}
                  onChange={handleChange}
                  className="h-9 bg-surface-input border border-border-input rounded-lg pl-3 pr-7 text-sm text-primary outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus/20 transition-all appearance-none cursor-pointer"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19 9-7 7-7-7"
                  />
                </svg>
              </div>

              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-secondary select-none">
                  {CURRENCY_SYMBOLS[formData.priceCurrency]}
                </span>
                <input
                  id="priceAmount"
                  name="priceAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.priceAmount}
                  onChange={handleChange}
                  required
                  className="w-full h-9 bg-surface-input border border-border-input rounded-lg pl-7 pr-3.5 text-sm text-primary placeholder-placeholder outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus/20 transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="stock"
              className="block text-[11px] font-medium text-secondary uppercase tracking-wider mb-1"
            >
              Quantity (Stock)
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              placeholder="e.g. 100"
              value={formData.stock}
              onChange={handleChange}
              required
              className="w-full h-9 bg-surface-input border border-border-input rounded-lg px-3.5 text-sm text-primary placeholder-placeholder outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus/20 transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-medium text-secondary uppercase tracking-wider">
                Variant Attributes
              </label>
            </div>
            <div className="space-y-2">
              {attributes.map((attr, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Key (e.g. Size)"
                    value={attr.key}
                    onChange={(e) => handleAttributeChange(index, "key", e.target.value)}
                    className="flex-1 min-w-0 h-9 bg-surface-input border border-border-input rounded-lg px-3 text-sm text-primary placeholder-placeholder outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus/20 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. M)"
                    value={attr.value}
                    onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                    className="flex-1 min-w-0 h-9 bg-surface-input border border-border-input rounded-lg px-3 text-sm text-primary placeholder-placeholder outline-none focus:border-border-focus focus:ring-1 focus:ring-border-focus/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => removeAttribute(index)}
                    className="p-1.5 text-red-600 bg-red-200 cursor-pointer hover:text-red-500 hover:bg-red-50 rounded-md hover:border transition-colors"
                    title="Remove Attribute"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addAttribute}
                className="text-[12px] bg-zinc-900 text-white/80 p-2.5 rounded-lg font-medium text-primary hover:text-emerald-400 flex items-center gap-1 transition-colors mt-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Attribute
              </button>
            </div>
          </div>

          <div>
            {/* Label with live counter */}
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-medium text-secondary uppercase tracking-wider">
                Product Images
              </label>
              <span
                className={`text-[11px] font-semibold tabular-nums ${
                  formData.images.length >= MAX_IMAGES
                    ? "text-amber-500"
                    : "text-secondary"
                }`}
              >
                {formData.images.length} / {MAX_IMAGES}
              </span>
            </div>

            {/* Drop zone — disabled at limit */}
            {formData.images.length < MAX_IMAGES ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-7 cursor-pointer transition-all"
                style={{
                  borderColor: dragOver
                    ? "var(--color-drag-active-border)"
                    : "var(--color-drag-idle-border)",
                  backgroundColor: dragOver
                    ? "var(--color-drag-active-bg)"
                    : "var(--color-drag-idle-bg)",
                }}
              >
                <svg
                  className="w-7 h-7 transition-colors"
                  style={{
                    color: dragOver
                      ? "var(--color-drag-icon-active)"
                      : "var(--color-drag-icon)",
                  }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                  />
                </svg>
                <p className="text-[12px] text-secondary">
                  <span className="text-primary font-medium">Click to upload</span>{" "}
                  or drag & drop
                </p>
                <p className="text-[11px] text-muted">
                  PNG, JPG, WEBP &mdash; up to {MAX_IMAGES} images
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-amber-800/50 bg-amber-950/20 rounded-xl py-7">
                <svg
                  className="w-6 h-6 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
                <p className="text-[12px] text-amber-600 font-medium">Image limit reached</p>
                <p className="text-[11px] text-amber-800">Remove an image to upload another</p>
              </div>
            )}

            {previews.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {previews.map((src, i) => (
                  <div key={i} className="relative group aspect-square">
                    <img
                      src={src}
                      alt={`preview-${i}`}
                      className="w-full h-full object-cover rounded-lg border border-border-input"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-900/80 hover:border-red-700"
                      style={{
                        backgroundColor: "var(--color-remove-btn-bg)",
                        borderWidth: "1px",
                        borderColor: "var(--color-remove-btn-border)",
                      }}
                    >
                      <svg
                        className="w-2.5 h-2.5"
                        style={{ color: "var(--color-remove-btn-text)" }}
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
                ))}
              </div>
            )}
          </div>

          <div className="h-px bg-divider-subtle" />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 cursor-pointer bg-btn-primary-bg hover:bg-btn-primary-hover disabled:bg-neutral-700 disabled:text-neutral-400 text-btn-primary-text text-[13px] font-bold tracking-widest uppercase rounded-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            style={{ boxShadow: "0 4px 24px var(--color-btn-primary-shadow)" }}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Publishing...
              </>
            ) : (
              "Publish Product"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
