import { Response } from "express";

export const setCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
 
  
  // Set Access Token Cookie
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  // Set Refresh Token Cookie
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};