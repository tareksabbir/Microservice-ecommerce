"use client";

import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

const ForgotPassword = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [step, setStep] = useState<"email" | "otp" | "reset">("otp");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const password = watch("password");

  const setResendTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const requestOtpMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/forgot-password-user`,
        { email }
      );
      return res.data;
    },
    onSuccess: (_, { email }) => {
      setUserEmail(email);
      setStep("otp");
      setServerError(null);
      setCanResend(false);
      setTimer(60);
      setResendTimer();
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (
          error.response?.data as {
            message?: string;
          }
        )?.message || "Invalid OTP . Try again!";
      setServerError(errorMessage);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userEmail) return;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-forgot-password-user`,
        { email: userEmail, otp: otp.join("") }
      );
      return res.data;
    },
    onSuccess: () => {
      setServerError(null);
      setStep("reset");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (
          error.response?.data as {
            message?: string;
          }
        )?.message || "Invalid OTP. Try again!";
      setServerError(errorMessage);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      if (!password) return;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/reset-password-user`,
        { email: userEmail, newPassword: password }
      );
      return res.data;
    },
    onSuccess: () => {
      setServerError(null);
      setStep("email");
      toast.success("Password reset successfully", {
        description: "You can now login with your new password",
      });
      router.push("/login");
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (
          error.response?.data as {
            message?: string;
          }
        )?.message || "Invalid OTP . Try again!";
      setServerError(errorMessage || "Faild to reset password. Try again!");
    },
  });

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handelOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmitEmail = ({ email }: { email: string }) => {
    requestOtpMutation.mutate({ email });
  };

  const onSubmitPassword = ({ password }: { password: string }) => {
    resetPasswordMutation.mutate({ password });
  };

  return (
    <div className="w-full py-10 min-h-[85vh] md:mt-24">
      <div className="w-full flex justify-center">
        <div className="w-[90%] md:w-[480px] p-10 shadow rounded-2xl bg-white border">
          <Image
            src="/icon.svg"
            alt="logo"
            width={40}
            height={40}
            className="mx-auto mb-3"
          />
          <h3 className="text-[1.5rem] font-semibold text-center mb-2">
            {step === "email"
              ? "Forgot Password"
              : step === "otp"
              ? "Verify OTP"
              : "Reset Password"}
          </h3>

          <p className="text-center text-gray-500 mb-6">
            Go Back to{" "}
            <span
              className="text-primary cursor-pointer font-semibold"
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </p>

          {/* Server Error */}
          {serverError && (
            <p className="w-full bg-red-100 text-red-600 px-3 py-2 rounded mb-3 text-sm">
              {serverError}
            </p>
          )}

          {/* Step 1: Email Input */}
          {step === "email" && (
            <form onSubmit={handleSubmit(onSubmitEmail)} className="space-y-5">
              <div className="flex flex-col">
                <input
                  type="email"
                  placeholder="Enter your email for recive OTP"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
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
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-70"
                disabled={requestOtpMutation.isPending}
              >
                {requestOtpMutation.isPending ? (
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
                    Sending OTP please wait...
                  </span>
                ) : (
                  "Submit"
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === "otp" && (
            <div className="space-y-5">
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handelOtpKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:outline-none focus:border-primary"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-70"
                disabled={verifyOtpMutation.isPending}
                onClick={() => verifyOtpMutation.mutate()}
              >
                {verifyOtpMutation.isPending ? (
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
                    Sending OTP please wait...
                  </span>
                ) : (
                  "Verify OTP"
                )}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?{" "}
                  {canResend ? (
                    <span
                      onClick={() => {
                        if (userEmail) {
                          requestOtpMutation.mutate({ email: userEmail });
                        }
                      }}
                      className="text-primary font-semibold cursor-pointer hover:underline"
                    >
                      Resend OTP
                    </span>
                  ) : (
                    <span className="text-gray-400">Resend in {timer}s</span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Reset Password */}
          {step === "reset" && (
            <form
              onSubmit={handleSubmit(onSubmitPassword)}
              className="space-y-5"
            >
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

              {/* Confirm Password */}
              <div className="flex flex-col relative">
                <label className="font-medium mb-1">Confirm Password</label>
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  placeholder="Confirm your password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className="border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-primary"
                />

                <div
                  className="absolute right-4 top-[45px] cursor-pointer text-gray-500"
                  onClick={() =>
                    setConfirmPasswordVisible(!confirmPasswordVisible)
                  }
                >
                  {confirmPasswordVisible ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </div>

                {errors.confirmPassword && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-70"
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending ? (
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
                    Reseting Password please wait...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
