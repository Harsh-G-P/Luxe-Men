"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Cart() {

  const [openId, setOpenId] = useState<string | null>(null);
  const qtyRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [removeId, setRemoveId] = useState<string | null>(null);

  /* ---------------- CART ITEMS SAFE ---------------- */

  const [items, setItems] = useState([
    {
      _id: "1",
      productId: "STYLE-001",
      title: "Classic Leather Jacket",
      image: "/product1.jpg",
      price: 450,
      quantity: 1,
      selectedAttributes: {
        Size: "M",
        Color: "Black",
      },
    },
    {
      _id: "2",
      productId: "STYLE-002",
      title: "Premium Sneakers",
      image: "/product2.jpg",
      price: 220,
      quantity: 2,
      selectedAttributes: {
        Size: "42",
        Color: "White",
      },
    },
    {
      _id: "3",
      productId: "STYLE-002",
      title: "Premium Sneakers",
      image: "/product2.jpg",
      price: 220,
      quantity: 2,
      selectedAttributes: {
        Size: "42",
        Color: "White",
      },
    },
    {
      _id: "4",
      productId: "STYLE-002",
      title: "Premium Sneakers",
      image: "/product2.jpg",
      price: 220,
      quantity: 2,
      selectedAttributes: {
        Size: "42",
        Color: "White",
      },
    },
  ]);


  /* ---------------- CLOSE DROPDOWN ---------------- */


  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const clickedOutside = openId && qtyRefs.current[openId] && !qtyRefs.current[openId]!.contains(e.target as Node);
      if (clickedOutside) setOpenId(null);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [openId]);


  /* ---------------- HANDLERS ---------------- */

  const handleQtyChange = (itemId: string, qty: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === itemId ? { ...item, quantity: qty } : item
      )
    );
    setOpenId(null);
  };

  const handleDelete = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item._id !== itemId));
  };

  if (!items.length)
    return <p className="text-center mt-20">Your shopping bag is empty.</p>;

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      <div className="relative w-full h-80 ">

        {/* Background Video */}
        <div className="fixed top-0 left-0 w-full h-100 -z-10 sm:mt-16 mt-14">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover object-center"
          >
            <source src="/videos/cart2.mp4" type="video/mp4" />
          </video>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Hero Text */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pt-24">
          <div className="text-center text-white">

            <p className="mb-5 text-xs tracking-[0.5em] uppercase text-white/80">
              LUXE MEN
            </p>

            <h1 className="font-serif text-4xl md:text-5xl tracking-[0.35em] uppercase font-light">
              Shopping Bag
            </h1>

          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative w-full bg-gray-100">

        {/* Center Logo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-14 h-14 bg-black border border-black rotate-45 flex items-center justify-center">
            <div className="-rotate-45">
              <Image
                src="/Avatar/cat.png"
                alt="Logo"
                width={60}
                height={60}
                className="object-contain"
              />
            </div>
          </div>
        </div>


        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-20">

          {/* LEFT */}
          <div>
            <h2 className="text-xs font-bold tracking-widest mb-3">YOUR SELECTIONS</h2>

            <div className="space-y-12">
              {items.map(item => {

                return (
                  <div
                    key={item._id}
                    className="flex flex-col md:flex-row gap-6 md:gap-10 border-b border-gray-200 py-6 md:py-8 first:border-t"
                  >

                    {/* IMAGE */}
                    <div className="relative w-full md:w-44 h-36 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain"
                      />
                    </div>

                    {/* DETAILS */}
                    <div className="flex-1 space-y-2 text-sm mt-4 md:mt-0">
                      <p className="text-base font-medium">{item.title}</p>
                      <p className="text-xs text-gray-500">
                        Style #{item.productId}
                      </p>

                      <div className="text-xs text-gray-500 space-y-1">
                        {Object.entries(item.selectedAttributes).map(
                          ([key, value]) => (
                            <p key={key}>{key}: {value}</p>
                          )
                        )}
                      </div>

                      <p className="text-xs text-gray-600 mt-2">
                        Available for delivery or collect in store
                      </p>

                      <button
                        onClick={() => setRemoveId(item._id!)}
                        className="relative text-xs mt-3 tracking-widest text-black after:absolute after:-bottom-0.5 after:left-0 after:w-full after:h-px after:bg-black after:origin-left after:scale-x-100 after:transition-transform after:duration-300 hover:after:scale-x-0 after:transform hover:font-bold"
                      >
                        REMOVE
                      </button>


                      {removeId && (
                        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                          <div className="bg-white w-[90%] max-w-105 p-6 sm:p-10 text-center shadow-2xl animate-fadeIn">
                            <h3 className="text-sm tracking-widest font-semibold uppercase mb-4">
                              Remove Item
                            </h3>
                            <p className="text-xs text-gray-500 mb-8">
                              Are you sure you want to remove this item from your shopping bag?
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                              <button
                                onClick={() => setRemoveId(null)}
                                className="flex-1 border border-gray-300 py-3 text-xs tracking-widest hover:bg-gray-100 transition"
                              >
                                CANCEL
                              </button>
                              <button
                                onClick={() => {
                                  handleDelete(removeId!);
                                  setRemoveId(null);
                                }}
                                className="flex-1 bg-black text-white py-3 text-xs tracking-widest hover:bg-gray-900 transition"
                              >
                                REMOVE
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* RIGHT: QTY & PRICE (unchanged for all screens) */}
                    <div className="flex items-center justify-between w-60 gap-4 text-sm mt-4 md:mt-0">
                      {/* QTY */}
                      <div
                        ref={(el: HTMLDivElement | null) => {
                          qtyRefs.current[item._id!] = el;
                        }}
                        className="relative w-28 h- text-xs"
                      >
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenId(prev => prev === item._id ? null : item._id!);
                          }}
                          className="flex items-center gap-2 p-3 border border-gray-200 cursor-pointer bg-white"
                        >
                          <span className="text-gray-500 flex-1 font-semibold text-center">
                            QTY: {item.quantity}
                          </span>
                          <svg
                            className={`w-3 h-3 transition-transform text-black ${openId === item._id ? "rotate-180" : ""
                              }`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>

                        {openId === item._id && (
                          <div
                            className="absolute w-full bg-white border shadow border-gray-200 z-50 max-h-40 overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {Array.from({ length: 99 }, (_, i) => i + 1).map(q => (
                              <div
                                key={q}
                                onClick={() => handleQtyChange(item._id!, q)}
                                className={`p-3 text-center cursor-pointer hover:bg-gray-100 ${q === item.quantity ? "bg-gray-200 font-semibold" : ""
                                  }`}
                              >
                                {q}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* PRICE */}
                      <p className="whitespace-nowrap">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>


          {/* RIGHT SUMMARY */}
          <div className="border border-gray-200 p-10 h-125 bg-white max-w-md mx-auto">
            {/* Header */}
            <h3 className="text-xs tracking-widest mb-2 font-semibold text-gray-800 uppercase">
              ORDER SUMMARY
            </h3>
            <p className="text-[10px] font-semibold text-gray-400 mb-6 tracking-wide">
              USCART420125655
            </p>
            <div className="h-px w-full bg-gray-300 mb-4"></div>
            {/* Subtotal */}
            <div className="flex justify-between mb-3">
              <span className="text-gray-500 uppercase tracking-wide text-xs">Subtotal</span>
              <span className="text-gray-900 text-xs font-medium">${totalPrice.toLocaleString()}</span>
            </div>

            {/* Shipping */}
            <div className="flex justify-between mb-3">
              <span className="text-gray-500 uppercase tracking-wide text-xs">Shipping</span>
              <span className="text-gray-700 text-xs">Free (Premium Express)</span>
            </div>

            {/* Estimated Tax */}
            <div className="flex justify-between mb-3">
              <span className="text-gray-500 uppercase tracking-wide text-xs">Estimated Tax</span>
              <button className="text-gray-700 text-xs underline">Calculate</button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300 pt-4 flex justify-between items-center mb-3">
              <span className="uppercase tracking-widest font-bold text-gray-800 text-xs">Estimated Total</span>
              <span className="text-xs font-bold text-gray-900">${totalPrice.toLocaleString()}</span>
            </div>

            {/* View Details */}
            <button className="text-gray-700 text-xs underline mb-4">
              VIEW DETAILS
            </button>

            {/* Info note */}
            <p className="text-[10px] text-gray-400 tracking-wide">
              You will be charged at the time of shipment. If this is a personalized or made-to-order purchase, you will be charged at the time of purchase.
            </p>

            {/* Checkout Button */}
            <Link href="/checkout">
              <button className="mt-8 w-full bg-black text-white py-4 text-sm tracking-widest uppercase shadow-lg hover:bg-gray-900 transition-all duration-300">
                CHECKOUT
              </button>
            </Link>

            {/* Optional Gold Accent Line */}
            <div className="mt-6 h-0.5 w-full bg-linear-to-r from-transparent via-yellow-500 to-transparent"></div>
          </div>

        </div>

      </div>
    </>
  );
}
