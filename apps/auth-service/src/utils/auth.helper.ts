import crypto from "crypto";

import { NextFunction } from "express";

import { sendEmail } from "./sendMail";
import { ValidationError } from "../../../../packages/error-handler";
import redis from "../../../../packages/libs/redis";

export const validateRegistrationData = (
  data: any,
  userType: "user" | "seller"
) => {
  const { name, email, password, phone_number, country } = data;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !name ||
    !email ||
    !password ||
    (userType === "seller" && (!phone_number || !country))
  ) {
    throw new ValidationError("Missing required registration fields");
  }

  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email format");
  }
};

export const checkOtpRestrictions = async (
  email: string,
  next: NextFunction
) => {
  const lockOTP = await redis.get(`otp_lock:${email}`);
  const otpSpamLock = await redis.get(`otp_spam_lock:${email}`);
  const otpCooldown = await redis.get(`otp_cooldown:${email}`); // Check OTP cooldown
  if (lockOTP) {
    return next(
      new ValidationError(
        "Account locked due to multiple failed attempts. Please try again after 30 minutes."
      )
    );
  }

  if (otpSpamLock) {
    return next(
      new ValidationError(
        "Too many OTP requests. Please wait for 1 hour before requesting a new OTP."
      )
    );
  }
  if (otpCooldown) {
    return next(
      new ValidationError(
        "Please wait for a minute before requesting a new OTP."
      )
    );
  }
};

export const trackOtpRequest = async (email: string, next: NextFunction) => {
  const otpRequestCountKey = `otp_request_count:${email}`;
  const requests = parseInt((await redis.get(otpRequestCountKey)) || "0");

  if (requests >= 2) {
    // Lock further OTP requests for 1 hour
    await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600);

    return next(
      new ValidationError(
        "Too many OTP requests. Please wait for 1 hour before requesting a new OTP."
      )
    );
  }
  await redis.set(otpRequestCountKey, requests + 1, "EX", 3600); // Count resets after 1 hour or tracking request
};




export const sendOtp = async (
  email: string,
  name: string,
  template: string
) => {
  const otp = crypto.randomInt(100000, 999999).toString();
  await sendEmail(email, "Verify Your Email", template, { 
    name, 
    otp,
    companyName: process.env.COMPANY_NAME || 'The Team',
    year: new Date().getFullYear()
  });
  await redis.set(`otp:${email}`, otp, "EX", 300); // OTP valid for 5 minutes
  await redis.set(`otp_cooldown:${email}`, "true", "EX", 60); // OTP cooldown for 1 minute
};

export const verifyOtp = async (
  email: string,
  otp: string,
  next: NextFunction
) => {
  // Check if account is locked first
  const lockOTP = await redis.get(`otp_lock:${email}`);
  if (lockOTP) {
    return next(
      new ValidationError(
        "Account locked due to multiple failed attempts. Please try again after 30 minutes."
      )
    );
  }

  const storedOtp = await redis.get(`otp:${email}`);
  if (!storedOtp) {
    return next(
      new ValidationError("OTP has expired. Please request a new one.")
    );
  }

  if (storedOtp !== otp) {
    let failedAttempts = parseInt(
      (await redis.get(`otp_failed_attempts:${email}`)) || "0"
    );
    failedAttempts += 1;

    if (failedAttempts >= 2) {
      await redis.set(`otp_lock:${email}`, "locked", "EX", 1800); // 30 minutes
      await redis.del(`otp_failed_attempts:${email}`); // Clean up counter
      return next(
        new ValidationError(
          "Account locked due to multiple failed attempts. Please try again after 30 minutes."
        )
      );
    }

    await redis.set(
      `otp_failed_attempts:${email}`,
      failedAttempts.toString(),
      "EX",
      1800
    ); // 30 minutes
    
    return next(
      new ValidationError(
        `Invalid OTP. ${2 - failedAttempts} attempt(s) remaining.`
      )
    );
  }

  // OTP is valid, clear all related keys
  await redis.del(`otp_failed_attempts:${email}`);
  await redis.del(`otp:${email}`);
  await redis.del(`otp_cooldown:${email}`);
  await redis.del(`otp_request_count:${email}`);
  
  // Return success indication (important!)
  return true;
};