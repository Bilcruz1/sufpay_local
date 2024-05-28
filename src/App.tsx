import "./App.css";
import { Route, Routes } from "react-router-dom";
import { SplashScreen, LandingPage } from "./pages";

function App() {
  return <div className="App">
    <Routes>
      <Route path={'/splash'} element={<SplashScreen />} />
      <Route path={'/' } element={<LandingPage />} />
    </Routes>
  </div>;
}

export default App;
