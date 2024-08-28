import "./App.css";
import { Route, Routes } from "react-router-dom";
import { DashboardTemplate, LandingTemplate } from "./components";
import LandingRoutes from "./routes/LandingRoutes";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path={"/*"} element={<LandingRoutes />} />
        <Route path={"/dashboard/*"} element={<DashboardTemplate />} />
      </Routes>
    </div>
  );
}

export default App;
