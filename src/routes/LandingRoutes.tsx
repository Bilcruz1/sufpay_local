import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  CreateNewPasswordPage,
  ForgetPasswordPage,
  LandingPage,
  ResetPaswordPage,
  SignInPage,
  SignUpPage,
  SplashScreen,
  VerifyAccountPage,
} from "../pages";
import ResendOtpPage from "../pages/ResendOtpPage";
import ForgetPasswordOtpPage from "../pages/ForgetPasswordOtpPage";

const LandingRoutes = () => {
  return (
    <Routes>
      <Route path={"/"} element={<LandingPage />} />
      {/* <Route path={"splash"} element={<SplashScreen />} /> */}
      <Route path={"login"} element={<SignInPage />} />
      <Route path={"signup"} element={<SignUpPage />} />
      <Route path={"forget-password"} element={<ForgetPasswordPage />} />
      <Route path={"forget-password/:token"} element={<ResetPaswordPage />} />
      <Route
        path={"change-password/:token"}
        element={<CreateNewPasswordPage />}
      />
      <Route path={"verify-account/:token"} element={<VerifyAccountPage />} />
      {/* <Route path={"password-verification"} element={<ResetPaswordPage />} /> */}
      {/* routeto below whenn otp has expired */}
      <Route path={"resend-otp/:token"} element={<ResendOtpPage />} />
    </Routes>
  );
};

export default LandingRoutes;
