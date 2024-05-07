import "./App.css";
import { Route, Routes } from "react-router-dom";
import { SplashScreen } from "./pages";

function App() {
  return <div className="App">
    <Routes>
      <Route path={'/'} element={<SplashScreen />} />
    </Routes>
  </div>;
}

export default App;
