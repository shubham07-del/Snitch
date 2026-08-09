import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { productDetails, loading } = useSelector((state) => state.product);
  const { handleGetProductDetails } = useProduct();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [activeVariant, setActiveVariant] = useState(null);

  useEffect(() => {
    handleGetProductDetails(productId);
  }, [productId]);

  useEffect(() => {
    setActiveImage(0);
  }, [activeVariant]);

  // Derive available attributes from variants
  const availableAttributes = React.useMemo(() => {
    if (!productDetails?.variants) return {};
    const attrs = {};
    productDetails.variants.forEach((variant) => {
      Object.entries(variant.attributes || {}).forEach(([key, value]) => {
        if (!attrs[key]) attrs[key] = new Set();
        attrs[key].add(value);
      });
    });
    Object.keys(attrs).forEach((key) => {
      attrs[key] = Array.from(attrs[key]);
    });
    return attrs;
  }, [productDetails]);

  const handleAttributeClick = (key, value) => {
    setSelectedAttributes(prev => {
      // Toggle off if already selected
      if (prev[key] === value) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: value };
    });
  };

  useEffect(() => {
    const variants = productDetails?.variants || [];
    if (Object.keys(selectedAttributes).length === 0) {
      setActiveVariant(null);
      return;
    }
    // Find a variant that matches all currently selected attributes
    const matchingVariant = variants.find(v => {
      return Object.entries(selectedAttributes).every(([k, val]) => v.attributes?.[k] === val);
    });
    setActiveVariant(matchingVariant || null);
  }, [selectedAttributes, productDetails?.variants]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  if (!productDetails) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-gray-50 text-gray-800">
        <h2 className="mb-4 text-3xl font-bold">Product Not Found</h2>
        <button 
          onClick={() => navigate('/')} 
          className="rounded-lg cursor-pointer bg-black px-6 py-2 text-white transition-all hover:bg-gray-800"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  const { productName, description, price, images, variants } = productDetails;
  
  const currentImages = activeVariant?.images?.length > 0 ? activeVariant.images : (images || []);
  const currentPrice = activeVariant?.price || price;
  
  // Format price
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currentPrice?.currency || 'INR',
    maximumFractionDigits: 0,
  }).format(currentPrice?.amount || 0);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Navigation Bar / Breadcrumb */}
      <nav className="border-b border-gray-200 px-6 py-4 lg:px-12">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center cursor-pointer text-sm font-medium text-gray-500 transition-colors hover:text-black"
        >
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse lg:flex-row lg:items-start lg:gap-x-4">
            {/* Thumbnails (if multiple images) */}
            {currentImages?.length > 1 && (
              <div className="mt-6 flex w-full gap-4 overflow-x-auto lg:mt-0 lg:w-34 lg:flex-col lg:h-[600px] lg:overflow-y-auto custom-scrollbar pr-1">
                {currentImages.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`relative flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase outline-none hover:bg-gray-50 focus:ring focus:ring-black focus:ring-opacity-50 focus:ring-offset-4 ${activeImage === idx ? 'ring-2 ring-black' : 'ring-1 ring-gray-200'}`}
                  >
                    <span className="sr-only">Image {idx + 1}</span>
                    <span className="absolute inset-0 overflow-hidden rounded-md">
                      <img src={img.url} alt="" className="h-full w-full object-cover object-center" />
                    </span>
                  </button>
                ))}
              </div>
            )}
            

            {/* Main Image */}
            <div className="relative aspect-[4/5] w-full bg-gray-100 sm:rounded-lg lg:flex-1 overflow-hidden group">
              {currentImages && currentImages.length > 0 ? (
                <>
                  <img
                    src={currentImages[activeImage]?.url}
                    alt={productName}
                    className="h-full w-full object-cover object-center"
                  />
                  
                  {/* Left / Right Swipe Navigation */}
                  {currentImages.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImage((prev) => (prev === 0 ? currentImages.length - 1 : prev - 1));
                        }}
                        className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md opacity-100 transition-opacity hover:bg-white hover:text-black lg:opacity-0 lg:group-hover:opacity-100"
                        aria-label="Previous image"
                      >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImage((prev) => (prev === currentImages.length - 1 ? 0 : prev + 1));
                        }}
                        className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md opacity-100 transition-opacity hover:bg-white hover:text-black lg:opacity-0 lg:group-hover:opacity-100"
                        aria-label="Next image"
                      >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">
                  <svg className="h-24 w-24 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="mt-10 px-4 sm:px-0 lg:mt-0 lg:max-w-xl lg:col-span-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">{productName}</h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">{formattedPrice}</p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6 text-base text-gray-700 leading-relaxed">
                <p>{description}</p>
              </div>
            </div>

            {variants && variants.length > 0 && Object.keys(availableAttributes).length > 0 && (
              <div className="mt-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Options</h3>
                </div>

                {/* Original Product Button */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedAttributes({})}
                    className={`flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium uppercase outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors ${
                      Object.keys(selectedAttributes).length === 0
                        ? 'border-transparent bg-black text-white hover:bg-gray-800 cursor-pointer'
                        : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    Original Product
                  </button>
                </div>

                {Object.entries(availableAttributes).map(([attrKey, attrValues]) => (
                  <div key={attrKey} className="flex flex-col gap-3">
                    <h4 className="text-sm font-medium text-gray-900 capitalize">{attrKey}</h4>
                    <div className="flex flex-wrap gap-3">
                      {attrValues.map((val) => {
                        const isSelected = selectedAttributes[attrKey] === val;
                        
                        // Check if this option is available given the OTHER selected attributes
                        const otherSelectedAttrs = { ...selectedAttributes };
                        delete otherSelectedAttrs[attrKey];
                        
                        const isAvailable = variants.some(v => {
                          const hasVal = v.attributes?.[attrKey] === val;
                          const matchesOther = Object.entries(otherSelectedAttrs).every(([k, vVal]) => v.attributes?.[k] === vVal);
                          return hasVal && matchesOther;
                        });

                        return (
                          <button
                            key={val}
                            disabled={!isAvailable && !isSelected}
                            onClick={() => handleAttributeClick(attrKey, val)}
                            className={`flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium uppercase outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors ${
                              isSelected
                                ? 'border-transparent bg-black text-white hover:bg-gray-800 cursor-pointer'
                                : !isAvailable && !isSelected
                                ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                                : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50 cursor-pointer'
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button className="flex cursor-pointer w-full flex-1 items-center justify-center rounded-md border border-transparent bg-black px-8 py-3 text-base font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-gray-50">
                Add to bag
              </button>
              
              <button className="flex cursor-pointer w-full flex-1 items-center justify-center rounded-md border border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-gray-50">
                Buy now
              </button>
            </div>

            <section className="mt-12 border-t border-gray-200 pt-8">
              <h3 className="text-sm font-medium text-gray-900">Delivery & Returns</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <svg className="h-5 w-5 shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="ml-3 text-sm text-gray-500">Free standard shipping on orders over ₹10,000</p>
                </div>
                <div className="flex items-start">
                  <svg className="h-5 w-5 shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="ml-3 text-sm text-gray-500">Free 30-day returns</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
