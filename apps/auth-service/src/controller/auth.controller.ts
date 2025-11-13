import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import {
  checkOtpRestrictions,
  sendOtp,
  trackOtpRequest,
  validateRegistrationData,
  verifyOtp,
} from "../utils/auth.helper";
import prisma from "../../../../packages/libs/prisma";
import { ValidationError } from "../../../../packages/error-handler";
// Register a new user

export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validateRegistrationData(req.body, "user");

    const { email, name } = req.body;

    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return next(new ValidationError("Email already in use"));
    }
    await checkOtpRestrictions(email, next);
    await trackOtpRequest(email, next);
    await sendOtp(email, name, "user-activation-mail");

    res.status(200).json({
      message: "OTP Sent. Please check your email to verify your account.",
    });
  } catch (error) {
    return next(error);
  }
};

// varify user otp

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, password, name } = req.body;
    if (!email || !otp || !password || !name) {
      return next(new ValidationError("all fields are required"));
    }
    const exisistingUser = await prisma.users.findUnique({ where: { email } });
    if (exisistingUser) {
      return next(new ValidationError("User already exists with this email"));
    }
    await verifyOtp(email, otp, next);
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.users.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    return next(error);
  }
};
