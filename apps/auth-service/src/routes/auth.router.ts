import express, { Router } from "express";
import {
  loginUser,
  userForgotPassword,
  userRegistration,
  verifyUser,
  resetUserPassword,
  verifyUserForgotPassword,
  refreshToken,
  getLoggedInUser,
} from "../controller/auth.controller";
import isAuthenticated from "../../../../packages/middleware/isAuthenticated";

const router: Router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "Auth Service",
    timestamp: new Date().toISOString(),
  });
});

router.post("/user-registration", userRegistration);
router.post("/verify-user", verifyUser);
router.post("/login-user", loginUser);
router.post("/refresh-token-user", refreshToken);
router.get("/logged-in-user", isAuthenticated, getLoggedInUser);
router.post("/forgot-password-user", userForgotPassword);
router.post("/reset-password-user", resetUserPassword);
router.post("/verify-forgot-password-user", verifyUserForgotPassword);

export default router;
