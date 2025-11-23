"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const loginMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/login-user`,
        data,
        {
          withCredentials: true,
        }
      );
      return res.data;
    },
    onSuccess: () => {
      setServerError(null);
      router.push("/");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (
          error.response?.data as {
            message: string;
          }
        )?.message || "Invalid credentials";
      setServerError(errorMessage);
    },
  });

  const onSubmit = (data: FormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="w-full min-h-screen  flex items-center justify-center">
      <div className="w-full flex justify-center">
        <div className="w-[80%] md:w-[480px] p-10 shadow rounded-2xl bg-white border">
          <Image
            src="/icon.svg"
            alt="logo"
            width={40}
            height={40}
            className="mx-auto mb-3"
          ></Image>
          <h3 className="text-[1.5rem] font-semibold text-center mb-2">
            Seller Login
          </h3>

          <p className="text-center text-gray-500 mb-6">
            Don’t have an account?{" "}
            <span
              className="text-primary cursor-pointer font-semibold"
              onClick={() => router.push("/sign-up")}
            >
              Sign Up
            </span>
          </p>

          {/* Server Error */}
          {serverError && (
            <p className="w-full bg-red-100 text-red-600 px-3 py-2 rounded mb-3 text-sm">
              {serverError}
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Email is invalid",
                  },
                })}
                className="border rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
              />
              {errors.email && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col relative">
              <label className="font-medium mb-1">Password</label>
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter password Min 6 characters"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-primary"
              />

              <div
                className="absolute right-4 top-[45px] cursor-pointer text-gray-500"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>

              {errors.password && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-600">Remember Me</span>
              </div>

              <span
                className="text-primary text-sm cursor-pointer"
                onClick={() => router.push("/forgot-password")}
              >
                Forgot password?
              </span>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-70"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
