import React from 'react'
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


const LandingRoutes = () => {
  return (
    <Routes>
      <Route path={"/"} element={<LandingPage />} />
      <Route path={"splash"} element={<SplashScreen />} />
      <Route path={"login"} element={<SignInPage />} />
      <Route path={"signup"} element={<SignUpPage />} />
      <Route path={"forget-password/:token"} element={<ForgetPasswordPage />} />
      <Route path={"change-password"} element={<CreateNewPasswordPage />} />
      <Route path={"verify-account/:token"} element={<VerifyAccountPage />} />
      <Route path={"password-verification"} element={<ResetPaswordPage />} />
    </Routes>
  );
}

export default LandingRoutes
