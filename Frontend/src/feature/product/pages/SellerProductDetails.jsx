import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProduct';

const SellerProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { productDetails, loading } = useSelector((state) => state.product);
  const { handleGetProductDetails, handleAddProductVariant } = useProduct();

  // Form toggle state
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Attributes UI state (array)
  const [attributeInputs, setAttributeInputs] = useState([]);

  // New variant state
  const [newVariant, setNewVariant] = useState({
    stock: 0,
    priceAmount: '',
    priceCurrency: 'INR',
    images: [],
    attributes: {} // Object format
  });

  useEffect(() => {
    handleGetProductDetails(productId);
  }, [productId]);

  useEffect(() => {
    const attrs = {};
    attributeInputs.forEach(attr => {
      if (attr.key) attrs[attr.key] = attr.value;
    });
    setNewVariant(prev => ({ ...prev, attributes: attrs }));
  }, [attributeInputs]);

  const handleAddAttribute = () => {
    setAttributeInputs(prev => [...prev, { key: '', value: '' }]);
  };

  const handleAttributeChange = (index, field, value) => {
    const updated = [...attributeInputs];
    updated[index][field] = value;
    setAttributeInputs(updated);
  };

  const handleRemoveAttribute = (index) => {
    setAttributeInputs(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + newVariant.images.length > 7) {
      alert("You can only upload a maximum of 7 images per variant.");
      e.target.value = "";
      return;
    }
    setNewVariant(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const handleRemoveImage = (index) => {
    setNewVariant(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleCreateVariant = async (e) => {
    e.preventDefault();
    try {
      // Find attributes that have comma-separated values to generate combinations
      const baseAttributes = { ...newVariant.attributes };
      
      const attrArrays = Object.entries(baseAttributes).map(([key, val]) => {
        return {
          key,
          values: val.split(',').map(v => v.trim()).filter(Boolean)
        };
      });

      // Helper to get cartesian product of all attribute options
      const getCombinations = (arrays) => {
        if (arrays.length === 0) return [{}];
        const result = [];
        const [first, ...rest] = arrays;
        const subCombos = getCombinations(rest);
        for (const val of first.values) {
          for (const sub of subCombos) {
            result.push({ [first.key]: val, ...sub });
          }
        }
        return result;
      };

      const combinations = getCombinations(attrArrays);

      if (combinations.length === 0) {
        // Case with no attributes
        await handleAddProductVariant(productId, newVariant);
      } else {
        // Create a variant for each combination
        for (const combo of combinations) {
          await handleAddProductVariant(productId, {
            ...newVariant,
            attributes: combo
          });
        }
      }
      
      // Reset form state and close
      setIsFormOpen(false);
      setNewVariant({
        stock: 0,
        priceAmount: '',
        priceCurrency: 'INR',
        images: [],
        attributes: {}
      });
      setAttributeInputs([]);
      
      // Refresh product details
      handleGetProductDetails(productId);
    } catch (error) {
      console.error("Failed to create variant:", error);
      alert("Failed to create variant. Please check the console for details.");
    }
  };

  const handleUpdateStock = (variantId, newStock) => {
    console.log("Updating stock for variant", variantId, "to", newStock);
    alert(`Update stock for ${variantId} to ${newStock} - to be connected to API`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  if (!productDetails) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-gray-800">
        <h2 className="mb-4 text-2xl font-bold">Product Not Found</h2>
        <button onClick={() => navigate('/seller/products')} className="rounded-lg bg-black px-6 py-2 text-white hover:bg-gray-800">
          Go Back
        </button>
      </div>
    );
  }

  const { productName, description, images, variants, price } = productDetails;

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900 md:p-10">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-sm font-medium text-gray-600 hover:text-black transition-colors"
      >
        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Products
      </button>

      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Top Product Section */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Images */}
            <div className="w-full md:w-5/12">
              <div className="aspect-[4/5] w-full rounded-xl bg-gray-100 overflow-hidden mb-4">
                {images?.[0]?.url ? (
                  <img src={images[0].url} alt={productName} className="h-full w-full object-cover object-center" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">No Image</div>
                )}
              </div>
              
              {/* Thumbnails */}
              {images?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <div key={img._id || idx} className="h-20 w-16 shrink-0 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 hover:border-black cursor-pointer transition-colors">
                      <img src={img.url} alt="Thumbnail" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="w-full md:w-7/12 flex flex-col justify-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{productName}</h1>
              <p className="text-lg font-semibold text-gray-800 mb-6">
                Base Price: {price?.amount} {price?.currency}
              </p>
              <p className="text-base text-gray-600 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </section>

        {/* Variants & Inventory Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Existing Variants ({variants?.length || 0})</h2>
            {!isFormOpen && (
              <button 
                onClick={() => setIsFormOpen(true)}
                className="rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 cursor-pointer"
              >
                + Create Variant
              </button>
            )}
          </div>

          {/* Create Variant Form */}
          {isFormOpen && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm mb-8">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-900">Create New Variant</h3>
                <button 
                  onClick={() => setIsFormOpen(false)} 
                  className="text-sm font-medium text-gray-500 hover:text-black transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleCreateVariant} className="space-y-6">
                
                {/* Images */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Variant Images (Max 7) (Optional)</label>
                  <input 
                    type="file" 
                    multiple 
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-200" 
                  />
                  {newVariant.images.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-4">
                      {newVariant.images.map((file, idx) => (
                        <div key={idx} className="relative h-20 w-20 rounded-md border border-gray-200 bg-gray-50 p-1">
                          <img src={URL.createObjectURL(file)} alt="preview" className="h-full w-full rounded object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow hover:bg-red-600 transition"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Price */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="mb-1 block text-sm font-medium text-gray-700">Price Amount (Optional)</label>
                      <input 
                        type="number" 
                        value={newVariant.priceAmount}
                        onChange={(e) => setNewVariant({...newVariant, priceAmount: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black" 
                        placeholder="e.g. 1299"
                      />
                    </div>
                    <div className="w-24 shrink-0">
                      <label className="mb-1 block text-sm font-medium text-gray-700">Currency</label>
                      <select 
                        value={newVariant.priceCurrency}
                        onChange={(e) => setNewVariant({...newVariant, priceCurrency: e.target.value})}
                        className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      >
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Initial Stock</label>
                    <input 
                      type="number" 
                      min="0"
                      required
                      value={newVariant.stock}
                      onChange={(e) => setNewVariant({...newVariant, stock: e.target.value})}
                      className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black" 
                    />
                  </div>
                </div>

                {/* Attributes */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Attributes</label>
                    <button 
                      type="button" 
                      onClick={handleAddAttribute}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      + Add Attribute
                    </button>
                  </div>
                  
                  {attributeInputs.length > 0 ? (
                    <div className="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-4">
                      {attributeInputs.map((attr, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Name (e.g. Size)" 
                            value={attr.key}
                            onChange={(e) => handleAttributeChange(idx, 'key', e.target.value)}
                            className="w-1/2 rounded-md border border-gray-300 p-2 text-sm focus:border-black focus:outline-none" 
                            required
                          />
                          <input 
                            type="text" 
                            placeholder="Value (e.g. S, M, L)" 
                            value={attr.value}
                            onChange={(e) => handleAttributeChange(idx, 'value', e.target.value)}
                            className="w-1/2 rounded-md border border-gray-300 p-2 text-sm focus:border-black focus:outline-none" 
                            required
                          />
                          <button 
                            type="button" 
                            onClick={() => handleRemoveAttribute(idx)}
                            className="flex h-9 w-9 items-center justify-center rounded-md text-gray-400 hover:bg-gray-200 hover:text-red-500 transition cursor-pointer"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">No attributes added (e.g., Size, Color).</p>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button 
                    disabled={loading}
                    type="submit" 
                    className="w-full sm:w-auto rounded-lg bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 cursor-pointer"
                  >
                    Save Variant
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List Existing Variants */}
          {variants?.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {variants.map((variant) => (
                <div key={variant._id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                  <div className="flex gap-5">
                    {/* Variant Image */}
                    <div className="h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {variant.images?.[0]?.url ? (
                        <img src={variant.images[0].url} alt="Variant" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400 text-xs">No img</div>
                      )}
                    </div>
                    
                    {/* Variant Details */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {variant.attributes && Object.entries(variant.attributes).map(([key, value]) => (
                          <span key={key} className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                            <span className="text-gray-500 mr-1">{key}:</span> {value}
                          </span>
                        ))}
                      </div>
                      
                      <div className="text-sm font-semibold text-gray-900 mb-4">
                        Price: {variant.price?.amount || 'N/A'} {variant.price?.currency}
                      </div>
                      
                      {/* Manage Stock */}
                      <div className="flex items-center gap-3 mt-auto">
                        <label className="text-sm text-gray-600">Stock:</label>
                        <input 
                          type="number" 
                          defaultValue={variant.stock}
                          className="w-20 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                          id={`stock-${variant._id}`}
                        />
                        <button 
                          onClick={() => {
                            const el = document.getElementById(`stock-${variant._id}`);
                            if (el) handleUpdateStock(variant._id, el.value);
                          }}
                          className="rounded-md bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-900 transition hover:bg-gray-200 cursor-pointer"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-gray-500">
              No variants created yet.
            </div>
          )}

        </section>
      </div>
    </div>
  );
};

export default SellerProductDetails;