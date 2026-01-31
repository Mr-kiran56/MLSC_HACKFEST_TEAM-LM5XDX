import { Routes, Route } from "react-router-dom";
import VoiceAgent from "./VoiceAgent";
import FarmerDetail from "./pages/farmerDetail"

function App() {
  return (
    <Routes>
      
      <Route path="/" element={<FarmerDetail />} />
      <Route path="/dashboard" element={<VoiceAgent />} />
    </Routes>
  );
}

export default App;