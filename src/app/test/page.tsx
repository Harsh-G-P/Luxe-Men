"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";



export default function ProductPage() {

    const product = {
  _id: "1",
  title: "Luxury Silk Dress",
  price: 1200,
  salePrice: 999,

  images: [
    "/products/product1.jpg",
    "/products/product2.jpg",
    "/products/product3.jpg",
    "/products/product4.jpg",
  ],

  description:
    "A premium handcrafted piece designed with timeless elegance and modern comfort.",

  details: [
    "Handcrafted luxury finish",
    "Elegant silhouette",
    "Premium quality fabric",
  ],

  materialAndCare:
    "Made with high-quality fabric. Dry clean only. Store in a cool dry place.",

  commitment:
    "We focus on sustainable craftsmanship and responsible production.",

  categoryId: {
    attributes: [
      {
        attributeName: "Size",
        values: ["S", "M", "L", "XL"],
      },
      {
        attributeName: "Color",
        values: ["Black", "White", "Gold"],
      },
    ],
  },
};

  
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [openOption, setOpenOption] = useState<string | null>(null);

  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    details: false,
    material: false,
    commitment: false,
  });


  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAllThumbnails, setShowAllThumbnails] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [zoomed, setZoomed] = useState<{
    [key: number]: { active: boolean; originX?: number; originY?: number };
  }>({});
  

const relatedProducts = [
  {
    _id: "2",
    title: "Classic Jacket",
    price: 800,
    salePrice: 650,
    images: ["/products/related1.jpg"],
  },
  {
    _id: "3",
    title: "Luxury Coat",
    price: 1500,
    salePrice: null,
    images: ["/products/related2.jpg"],
  },
];




  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mainImages = isMobile
    ? [product.images[currentIndex]]
    : currentIndex === 0
      ? [product.images[0]]
      : [product.images[currentIndex - 1], product.images[currentIndex]];

  const maxVisible = 4;

  const handleAddToCart = async () => {
    // 1. Validate attribute selection
    const requiredAttrs = product.categoryId?.attributes || [];

    const isAllSelected = requiredAttrs.every(
      (attr) => selectedOptions[attr.attributeName]
    );

    if (!isAllSelected) {
      toast.error("Please select all options");
      return;
    }

    // 2. Prepare payload (same as Collection logic)
    const payload = {
      productId: product._id,
      quantity: 1,
      price: product.salePrice || product.price,
      selectedAttributes: selectedOptions,
    };

    toast.success( "Product added to cart!");
  };


  const prevImage = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  const nextImage = () =>
    setCurrentIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );

  const toggle = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const contentVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
  };

  const handleSelectOption = (category: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [category]: value }));
  };

  // Zoom handler
  const handleZoom = (
    index: number,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const originX = ((e.clientX - rect.left) / rect.width) * 100;
    const originY = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomed((prev) => {
      const prevZoom = prev[index];
      if (prevZoom?.active) {
        // Zoom out
        return { ...prev, [index]: { active: false, originX: prevZoom.originX, originY: prevZoom.originY } };
      } else {
        // Zoom in
        return { ...prev, [index]: { active: true, originX, originY } };
      }
    });
  };

  return (
    <div className="w-full flex flex-col items-center">

      {/* Main Image Section */}
      <div className="relative w-full md:h-[72vh] h-[62vh] flex justify-center items-center gap-1 select-none overflow-hidden">
        {mainImages.map((img, index) => (
          <div
            key={index}
            className="relative w-full h-full overflow-hidden cursor-zoom-in"
            onClick={(e) => handleZoom(index, e)}
          >
            <Image
              src={img}
              alt={`Main ${index}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="eager"
              draggable={false}
              className={'select-none object-cover transition-transform duration-300 ease-in-out'}
              style={{
                transform: zoomed[index]?.active ? "scale(3)" : "scale(1)",
                transformOrigin: zoomed[index]
                  ? `${zoomed[index].originX}% ${zoomed[index].originY}%`
                  : "center center",
              }}
            />
          </div>
        ))}

        {/* Mobile Navigation Buttons & Indicators */}
        {isMobile && (
          <>
            {/* Image Counter */}
            <div className="absolute bottom-4 right-2 text-black px-2 py-1 rounded text-xs font-medium">
              {currentIndex + 1}/{product.images.length}
            </div>

            {/* Progress Line */}
            <div className="absolute bottom-2 left-2 right-2 h-0.5 bg-black/30 rounded-full">
              <div
                className="h-0.5 bg-black rounded-full transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / product.images.length) * 100}%`,
                }}
              />
            </div>

            {/* Navigation Buttons */}
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-zinc-300 p-2 rounded-full"
              onClick={prevImage}
            >
              <ChevronLeftIcon className="w-6 h-6 text-white" />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-zinc-300 p-2 rounded-full"
              onClick={nextImage}
            >
              <ChevronRightIcon className="w-6 h-6 text-white" />
            </button>
          </>
        )}


        {/* Desktop Thumbnails + Arrows */}
        {!isMobile && (
          <div className="absolute bottom-8 right-4 flex items-center">
            <div className="flex items-center gap-1">
              {(showAllThumbnails
                ? product.images
                : product.images.slice(0, maxVisible)
              ).map((img, index) => {
                if (currentIndex > 0 && index === currentIndex - 1) {
                  return (
                    <div
                      key={index}
                      className="h-9 border rounded overflow-hidden flex w-20 relative"
                      onClick={() => setCurrentIndex(index)}
                    >
                      <Image
                        src={product.images[currentIndex - 1]}
                        alt={`Thumb ${currentIndex - 1}`}
                        width={24}
                        height={48}
                        className="object-cover w-1/2 h-full"
                      />
                      <Image
                        src={product.images[currentIndex]}
                        alt={`Thumb ${currentIndex}`}
                        width={24}
                        height={48}
                        className="object-cover w-1/2 h-full"
                      />
                    </div>
                  );
                }

                if (currentIndex > 0 && index === currentIndex) return null;

                return (
                  <div
                    key={index}
                    className="w-7 h-9 border rounded overflow-hidden relative cursor-pointer"
                    onClick={() => setCurrentIndex(index)}
                  >
                    <Image
                      src={img}
                      alt={`Thumb ${index}`}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                    {currentIndex !== index && (
                      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
                    )}
                  </div>
                );
              })}

              {!showAllThumbnails && product.images.length > maxVisible && (
                <div
                  className="w-7 h-9 border rounded flex items-center justify-center cursor-pointer bg-gray-200 text-black font-bold text-sm"
                  onClick={() => setShowAllThumbnails(true)}
                >
                  +{product.images.length - maxVisible}
                </div>
              )}
            </div>

            {/* Arrows */}
            <div className="flex ml-2 gap-1">
              <button
                className="bg-zinc-300 p-2 rounded-full hover:scale-90 transition-transform duration-150 flex items-center justify-center"
                onClick={prevImage}
              >
                <ChevronLeftIcon className="w-3 h-3 text-white" />
              </button>

              <button
                className="bg-zinc-300 p-2 rounded-full hover:scale-90 transition-transform duration-150 flex items-center justify-center"
                onClick={nextImage}
              >
                <ChevronRightIcon className="w-3 h-3 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="w-full px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_0.6fr] gap-24">

          {/* LEFT SIDE – TEXT DETAILS */}
          <div className="space-y-10 max-w-2xl">

            {/* Title & Price */}
            <div>
              <h1 className="text-sm font-serif mb-3">{product.title}</h1>
              <p className="text-gray-600 mt-1 text-sm">
                ${product.salePrice ?? product.price}
                {product.salePrice && (
                  <span className="line-through text-red-400 ml-2">${product.price}</span>
                )}
              </p>
            </div>

            <p className="text-gray-600 text-xs leading-relaxed">
              {product.description}
            </p>

            {!isMobile && (
              <div className="space-y-10 max-w-2xl">

                {/* PRODUCT DETAILS */}
                <div className="relative group mb-10">
                  <button
                    onClick={() => toggle("details")}
                    className="w-full flex justify-between items-center text-xs tracking-widest font-semibold pb-3"
                  >
                    PRODUCT DETAILS
                    <span className="text-2xl font-medium">{openSections.details ? "˰" : "˯"}</span>
                  </button>

                  <span
                    className={`absolute bottom-[-20] left-0 h-[1px] bg-black transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${openSections.details ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                  />

                  <AnimatePresence>
                    {openSections.details && (
                      <motion.ul
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden mt-4 list-disc ml-5 text-xs text-gray-700 space-y-1"
                      >
                        {product.details.map((detail, index) => (
                          <li key={index}>{detail}</li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                {/* MATERIAL & CARE */}
                <div className="relative group mb-10">
                  <button
                    onClick={() => toggle("material")}
                    className="w-full flex justify-between items-center text-xs tracking-widest font-semibold pb-3"
                  >
                    MATERIAL & CARE
                    <span className="text-2xl font-medium">{openSections.material ? "˰" : "˯"}</span>
                  </button>

                  <span
                    className={`absolute bottom-[-20]  left-0 h-[1px] bg-black transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${openSections.material ? "w-full" : "w-0 group-hover:w-full"}`}
                  />

                  <AnimatePresence>
                    {openSections.material && (
                      <motion.p
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden mt-4 text-xs text-gray-700 max-w-xl"
                      >
                        {product.materialAndCare}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* OUR COMMITMENT */}
                <div className="relative group mb-10">
                  <button
                    onClick={() => toggle("commitment")}
                    className="w-full flex justify-between items-center text-xs tracking-widest font-semibold pb-3"
                  >
                    OUR COMMITMENT
                    <span className="text-2xl font-medium">{openSections.commitment ? "˰" : "˯"}</span>
                  </button>

                  <span
                    className={`absolute bottom-[-20]  left-0 h-[1px] bg-black transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${openSections.commitment ? "w-full" : "w-0 group-hover:w-full"}`}
                  />

                  <AnimatePresence>
                    {openSections.commitment && (
                      <motion.p
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden mt-4 text-xs text-gray-700"
                      >
                        {product.commitment}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            )}

          </div>

          {/* RIGHT SIDE – ACTIONS */}
          <div className="relative flex flex-col gap-4 max-w-md mt-[-54] sm:mt-0">

            {product.categoryId?.attributes.map((attr) => (
              <button
                key={attr.attributeName}
                className="w-full py-3 border border-black text-xs tracking-widest hover:bg-black hover:text-white transition"
                onClick={() => setOpenOption(attr.attributeName)}
              >
                SELECT {attr.attributeName.toUpperCase()}
              </button>
            ))}


            {/* Only show Add to Cart if both selected */}
            {product.categoryId?.attributes.every(
              (attr) => selectedOptions[attr.attributeName]
            ) && (
                <button className="w-full py-3 bg-black text-white text-xs tracking-widest hover:opacity-90 transition"
                  onClick={handleAddToCart}
                >
                  ADD TO CART
                </button>
              )}


            {/* Sliding Panel */}
            <AnimatePresence>
              {openOption && (
                <>
                  {/* Backdrop */}
                  {!isMobile && (
                    <motion.div
                      className="fixed inset-0 z-40 backdrop-blur-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setOpenOption(null)}
                    />
                  )}

                  {/* Sliding Panel */}
                  <motion.div
                    initial={
                      isMobile
                        ? { y: "100%" }        // mobile slide from bottom
                        : { x: "100%" }        // desktop slide from right
                    }
                    animate={{ x: 0, y: 0 }}   // final position
                    exit={
                      isMobile
                        ? { y: "100%" }        // mobile slide to bottom
                        : { x: "100%" }        // desktop slide to right
                    }
                    transition={{ type: "tween", duration: 0.5 }}
                    className={`fixed bg-white shadow-lg z-50 flex flex-col gap-6 overflow-y-auto p-6 ${isMobile ? "bottom-0 left-0 w-full h-full rounded-t-xl border-t border-gray-200" : "top-0 right-0 w-[550px] h-full border-l border-gray-200"}`}
                  >
                    <button
                      className="self-end font-bold text-gray-500 hover:text-black"
                      onClick={() => setOpenOption(null)}
                    >
                      ✕
                    </button>

                    {openOption && (
                      <>
                        {product.categoryId?.attributes
                          .filter((attr) => attr.attributeName === openOption)
                          .map((attr) => (
                            <div key={attr.attributeName} className="flex flex-col">
                              <h3 className="font-semibold tracking-widest mb-2">
                                {attr.attributeName.toUpperCase()}
                              </h3>

                              {attr.values.map((value) => (
                                <div
                                  key={value}
                                  className={`w-full px-4 py-5 cursor-pointer text-sm font-medium border-b ${selectedOptions[attr.attributeName] === value
                                    ? "bg-black text-white"
                                    : "hover:bg-gray-100"
                                    }`}
                                  onClick={() => {
                                    handleSelectOption(attr.attributeName, value)
                                    setOpenOption(null);
                                  }}
                                >
                                  {value}
                                </div>
                              ))}
                            </div>
                          ))}
                      </>
                    )}


                  </motion.div>
                </>
              )}
            </AnimatePresence>


            <div className="mt-6 space-y-3">
              <p className="text-xs font-li text-gray-500">
                Complimentary shipping and returns. Signature Saiki packaging included.
              </p>

              <p className="text-xs text-gray-500">
                Estimated complimentary Express delivery or Collect in Store:
                Wed, Dec 17 – Thu, Dec 18
              </p>

              <p className="text-xs text-gray-500">
                <span className="underline cursor-pointer">Contact Us</span><br />
                Our Client Advisors are available to help you.
              </p>

              <p className="text-xs text-gray-500">
                Saiki Services: Complimentary Shipping, Complimentary Exchanges & Returns,
                Secure Payments and Signature Packaging.
              </p>
            </div>

          </div>

          {isMobile && (
            <div className="space-y-10 max-w-2xl">

              {/* PRODUCT DETAILS */}
              <div className="relative group mb-10">
                <button
                  onClick={() => toggle("details")}
                  className="w-full flex justify-between items-center text-xs tracking-widest font-semibold pb-3"
                >
                  PRODUCT DETAILS
                  <span className="text-2xl font-medium">{openSections.details ? "˰" : "˯"}</span>
                </button>

                <span
                  className={`absolute bottom-[-20] left-0 h-[1px] bg-black transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${openSections.details ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                />

                <AnimatePresence>
                  {openSections.details && (
                    <motion.ul
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden mt-4 list-disc ml-5 text-xs text-gray-700 space-y-1"
                    >
                      {product.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {/* MATERIAL & CARE */}
              <div className="relative group mb-10">
                <button
                  onClick={() => toggle("material")}
                  className="w-full flex justify-between items-center text-xs tracking-widest font-semibold pb-3"
                >
                  MATERIAL & CARE
                  <span className="text-2xl font-medium">{openSections.material ? "˰" : "˯"}</span>
                </button>

                <span
                  className={`absolute bottom-[-20]  left-0 h-[1px] bg-black transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${openSections.material ? "w-full" : "w-0 group-hover:w-full"}`}
                />

                <AnimatePresence>
                  {openSections.material && (
                    <motion.p
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden mt-4 text-xs text-gray-700 max-w-xl"
                    >
                      {product.materialAndCare}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* OUR COMMITMENT */}
              <div className="relative group mb-10">
                <button
                  onClick={() => toggle("commitment")}
                  className="w-full flex justify-between items-center text-xs tracking-widest font-semibold pb-3"
                >
                  OUR COMMITMENT
                  <span className="text-2xl font-medium">{openSections.commitment ? "˰" : "˯"}</span>
                </button>

                <span
                  className={`absolute bottom-[-20]  left-0 h-[1px] bg-black transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${openSections.commitment ? "w-full" : "w-0 group-hover:w-full"}`}
                />

                <AnimatePresence>
                  {openSections.commitment && (
                    <motion.p
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden mt-4 text-xs text-gray-700"
                    >
                      {product.commitment}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

            </div>
          )}

        </div>
      </div>

      

    </div>
  );
}
