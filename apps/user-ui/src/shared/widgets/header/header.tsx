"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Heart, SearchIcon, ShoppingBag, User, Menu, X, ShieldCheck } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const navItems = [
    { name: "About", link: "/about" },
    { name: "My Account", link: "/my-account" },
    { name: "Wishlist", link: "/wishlist" },
    { name: "Orders", link: "/orders" },
  ];

  return (
    <section className="w-full bg-white border-b">
      <div className="w-[90%] md:w-[80%] mx-auto py-4 flex items-center justify-between">
        {/* Logo */}
        <div>
          <Link href="/">
            <img
              src="/logo.svg"
              alt="Logo"
              className="w-[140px] md:w-[176px] object-contain block"
            />
          </Link>
        </div>

        {/* Search bar - hidden on small screens */}
        <div className="hidden md:block md:w-[40%] relative">
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
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-4">
            <Link href={"/wishlist"} className="relative">
              <Heart className="w-6 h-6 text-gray-800 " />
              <span className="absolute -top-2 -right-3 w-5 h-5 rounded-full bg-[#099455] text-white text-xs flex items-center justify-center">
                0
              </span>
            </Link>
            <Link href="/wishlist" className="flex flex-col leading-tight">
              {/* <span className="block font-medium text-xs">Hello,</span> */}
              <span className="font-semibold text-sm">Wishlist</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href={"/cart"} className="relative">
              <ShoppingBag className="w-6 h-6 text-gray-800 " />
              <span className="absolute -top-2 -right-3 w-5 h-5 rounded-full bg-[#099455] text-white text-xs flex items-center justify-center">
                0
              </span>
            </Link>
            <Link href="/cart" className="flex flex-col leading-tight">
              {/* <span className="block font-medium text-xs">Hello,</span> */}
              <span className="font-semibold text-sm">Cart</span>
            </Link>
          </div>
          <div className="flex items-center gap-3 relative">
            <Link
              href="/login"
              className="border-2 w-[25px] h-[25px] flex items-center justify-center rounded-full border-gray-800 relative"
            >
              <User className="w-4 h-4 text-gray-800 " />
              <span className="absolute -top-2.5 -right-3.5 w-5 h-5 rounded-full bg-[#099455] text-white text-xs flex items-center justify-center">
                <ShieldCheck/>
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
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className="py-2 text-gray-800 font-medium hover:text-[#099455] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>

            {/* Quick action links */}
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
