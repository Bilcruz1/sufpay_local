import "./App.css";
import { Route, Routes } from "react-router-dom";
import { DashboardTemplate, LandingTemplate } from "./components";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path={"/"} element={<LandingTemplate />} />
        <Route path={"/dashboard/*"} element={<DashboardTemplate />} />
      </Routes>
    </div>
  );
}

export default App;
