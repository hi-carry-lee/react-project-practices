import { Box } from "@chakra-ui/react";
import HomePage from "../pages/HomePage";
import CreatePage from "../pages/CreatePage";
import Navbar from "../components/Navbar";
import { Routes, Route } from "react-router-dom";
import { useColorModeValue } from "@chakra-ui/react";
import Health from "../pages/Health";
function App() {
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/health" element={<Health />} />
      </Routes>
    </Box>
  );
}

export default App;
