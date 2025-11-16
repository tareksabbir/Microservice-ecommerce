"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Heart,
  SearchIcon,
  ShoppingBag,
  User,
  Menu,
  X,
  ShieldCheck,
  AlignLeft,
  ChevronDown,
  Headset,
} from "lucide-react";
import { NavItemsData } from "@/configs/constants";


const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handelScroll = () => {
      if (window.scrollY > 100) {
        setShow(true);
        setIsSticky(true); // Fix: Set sticky state
      } else {
        setShow(false);
        setIsSticky(false); // Fix: Remove sticky state
      }
    };
    window.addEventListener("scroll", handelScroll);
    return () => {
      window.removeEventListener("scroll", handelScroll);
    };
  }, []);

  return (
    <section
      className={`w-full bg-white transition-all duration-300 ${
        isSticky ? "shadow-md fixed top-0 left-0 z-50" : "relative"
      }`}
    >
      <div className="w-[90%] md:w-[80%] mx-auto py-4 flex items-center justify-between border-b">
        {/* Logo */}
        <div className="md:w-[15%]">
          <Link href="/">
            <img
              src="/logo.svg"
              alt="Logo"
              className="w-[140px] md:w-[176px] object-contain block"
            />
          </Link>
        </div>

        {/* Search bar - hidden on small screens */}
        <div className="hidden md:block  relative md:w-[45%]">
          <input
            type="text"
            placeholder="Search for products"
            className="w-full px-4 pr-12 font-medium border-[2.5px] border-[#099455] outline-none h-[45px] rounded-full"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#099455] rounded-full flex items-center justify-center cursor-pointer">
            <SearchIcon className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Desktop icons */}
        <div className="hidden md:flex items-center gap-8 ">
          <div className="flex items-center gap-4">
            <Link href={"/wishlist"} className="relative">
              <Heart className="w-6 h-6 text-gray-800" />
              <span className="absolute -top-2 -right-3 w-5 h-5 rounded-full bg-[#099455] text-white text-xs flex items-center justify-center">
                0
              </span>
            </Link>
            <Link href="/wishlist" className="flex flex-col leading-tight">
              <span className="font-semibold text-sm">Wishlist</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href={"/cart"} className="relative">
              <ShoppingBag className="w-6 h-6 text-gray-800" />
              <span className="absolute -top-2 -right-3 w-5 h-5 rounded-full bg-[#099455] text-white text-xs flex items-center justify-center">
                0
              </span>
            </Link>
            <Link href="/cart" className="flex flex-col leading-tight">
              <span className="font-semibold text-sm">Cart</span>
            </Link>
          </div>
          <div className="flex items-center gap-3 relative">
            <Link
              href="/login"
              className="border-2 w-[25px] h-[25px] flex items-center justify-center rounded-full border-gray-800 relative"
            >
              <User className="w-4 h-4 text-gray-800" />
              <span className="absolute -top-2.5 -right-3.5 w-5 h-5 rounded-full bg-[#099455] text-white text-xs flex items-center justify-center">
                <ShieldCheck />
              </span>
            </Link>
            <Link href="/login" className="flex flex-col leading-tight">
              <span className="font-semibold text-sm">Sign In</span>
            </Link>
          </div>
        </div>

        {/* Mobile icons - Search and Menu */}
        <div className="md:hidden flex items-center gap-4">
          <button
            className="text-gray-700 focus:outline-none"
            aria-label="Toggle search"
            onClick={() => {
              setMobileSearchOpen(!mobileSearchOpen);
              setMobileMenuOpen(false);
            }}
          >
            <SearchIcon className="w-6 h-6" />
          </button>
          <button
            className="text-gray-700 focus:outline-none"
            aria-label="Toggle menu"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setMobileSearchOpen(false);
            }}
          >
            {mobileMenuOpen ? (
              <X className="w-7 h-7" />
            ) : (
              <Menu className="w-7 h-7" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation section - Hidden on mobile */}
      <div className="hidden md:block border-b py-2">
        <div className="w-[90%] md:w-[80%] mx-auto flex items-center justify-between">
          {/* all dropdown */}
          <div
            className={`w-[260px] ${
              isSticky && "-mb-2"
            } cursor-pointer flex items-center justify-between px-5 h-[50px] bg-[#099455] relative`}
            onClick={() => {
              setShow(!show);
            }}
          >
            <div className="flex items-center gap-2">
              <AlignLeft color="white" />
              <span className="text-white font-semibold">All Categories</span>
            </div>
            <ChevronDown color="white" />
          </div>

          {/* Categories dropdown */}
          {show && (
            <div
              className={`absolute left-[5%] md:left-[10%] ${
                isSticky ? "top-[110px]" : "top-[130px]"
              } w-[260px] h-[400px] bg-green-50  z-50 border mt-3 `}
            >
              {/* Add your categories here */}
              <div className="p-4">
                <p className="text-gray-600">Categories will go here</p>
              </div>
            </div>
          )}

          {/* Navigation menu */}
          <div className="flex items-center ">
            {NavItemsData.map((i: NavItemsTypes, index: number) => (
              <Link
                href={i.href}
                key={index}
                className="px-5 py-2 font-semibold text-gray-800 hover:text-[#099455]"
              >
                {i.title} 
              </Link>
            ))}
          </div>

          {/* Empty space for layout balance */}
          <div className="flex items-center  gap-2 font-bold text-[#099455]">
            <Headset color="green" size={24} aria-hidden="true"/>
            <div>
              <h1 className="text-xl">+0123456789</h1>
              <p className="text-sm font-medium text-gray-600 ml-2">24/7 Support</p>
            </div>


          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      {mobileSearchOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="w-[90%] mx-auto py-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products"
                className="w-full px-4 pr-12 font-medium border-[2.5px] border-[#099455] outline-none h-[45px] rounded-full"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#099455] rounded-full flex items-center justify-center cursor-pointer">
                <SearchIcon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="w-[90%] mx-auto py-4 flex flex-col gap-4">
            {/* Navigation links */}
            {NavItemsData.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="py-2 text-gray-800 font-medium hover:text-[#099455] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}

            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>

            {/* Quick action links */}
            <Link
              href="/wishlist"
              className="py-2 text-gray-800 font-medium hover:text-[#099455] transition-colors flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Heart className="w-5 h-5" />
              Wishlist
              <span className="ml-auto w-5 h-5 rounded-full bg-[#099455] text-white text-xs flex items-center justify-center">
                0
              </span>
            </Link>

            <Link
              href="/cart"
              className="py-2 text-gray-800 font-medium hover:text-[#099455] transition-colors flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShoppingBag className="w-5 h-5" />
              Cart
              <span className="ml-auto w-5 h-5 rounded-full bg-[#099455] text-white text-xs flex items-center justify-center">
                0
              </span>
            </Link>

            <Link
              href="/login"
              className="py-2 text-gray-800 font-medium hover:text-[#099455] transition-colors flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User className="w-5 h-5" />
              Sign In
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default Header;
