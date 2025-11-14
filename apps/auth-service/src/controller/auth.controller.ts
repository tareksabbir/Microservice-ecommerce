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
import { AuthError, ValidationError } from "../../../../packages/error-handler";
import jwt from "jsonwebtoken";
import { setCookies } from "../utils/cookies/setCookies";

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

// login user

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ValidationError("Email and password are required"));
    }
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return next(new AuthError("User Dose not exist"));
    }
    // verufy password
    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      return next(new AuthError("Invalid email or password"));
    }

    // generate access token and refresh token
    const accessToken = jwt.sign(
      { id: user.id, role: "user" },
      process.env.JWT_ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: user.id, role: "user" },
      process.env.JWT_REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    // STORE REFRESH AND ACCESS TOKEN IN HTTP-ONLY COOKIE
    setCookies(res, accessToken, refreshToken);
    //  Send response to client
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    return next(error);
  }
};
