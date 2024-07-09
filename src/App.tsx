import "./App.css";
import { Route, Routes } from "react-router-dom";
import {
  CreateNewPasswordPage,
  ForgetPasswordPage,
  ResetPaswordPage,
  SignInPage,
  SignUpPage,
  SplashScreen,
  VerifyAccountPage,
} from "./pages";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path={'/' } element={<LandingPage />} />
        <Route path={"/splash"} element={<SplashScreen />} />
        <Route path={"/login"} element={<SignInPage />} />
        <Route path={"/signup"} element={<SignUpPage />} />
        <Route
          path={"/forget-password-page"}
          element={<ForgetPasswordPage />}
        />
        <Route path={"/change-password"} element={<CreateNewPasswordPage />} />
        <Route path={"/verify-account"} element={<VerifyAccountPage />} />
        <Route path={"/password-verification"} element={<ResetPaswordPage />} />
      </Routes>
    </div>
  );
}

export default App;
