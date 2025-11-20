import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import prisma from "../libs/prisma";

const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies.acces_token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized ! Token is Messing ",
      });
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET as string
    ) as { id: string; role: "user" | "seller" };

    if (!decoded) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized ! Invalid access token",
      });
    }
    const account = await prisma.users.findUnique({
      where: { id: decoded.id },
    });
    req.user = account;
    if (!account) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized ! User not found",
      });
    }
    return next();
  } catch (error) {
    return next(error);
  }
};

export default isAuthenticated;
