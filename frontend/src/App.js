import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div
      className="App"
      style={{
        display: "flex-column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Router>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
