import "./App.css";
import { Route, Routes } from "react-router-dom";
import { ForgetPasswordPage, SignInPage, SplashScreen } from "./pages";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path={"/splash"} element={<SplashScreen />} />
        <Route path={"/login"} element={<SignInPage />} />
        <Route path={"/forget-password-page"} element={<ForgetPasswordPage />} />
      </Routes>
    </div>
  );
}

export default App;
