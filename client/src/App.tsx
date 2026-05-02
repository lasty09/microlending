import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import HowItWorks from "./pages/HowItWorks";
import Borrow from "./pages/Borrow";
import Lend from "./pages/Lend";
import { Container } from "@mui/material";

function App() {
  return (
    <div>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/borrow" element={<Borrow />} />
          <Route path="/lend" element={<Lend />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
