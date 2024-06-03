import "./App.css";
import { Route, Routes } from "react-router-dom";
import {
  CreateNewPasswordPage,
  ForgetPasswordPage,
  SignInPage,
  SignUpPage,
  SplashScreen,
} from "./pages";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path={"/splash"}
          element={<SplashScreen />} />
        <Route
          path={"/login"}
          element={<SignInPage />} />
        <Route
          path={"/signup"}
          element={<SignUpPage />} />
        <Route
          path={"/forget-password-page"}
          element={<ForgetPasswordPage />} />
        <Route
          path={"/change-password"}
          element={<CreateNewPasswordPage />} />
      </Routes>
    </div>
  );
}

export default App;
