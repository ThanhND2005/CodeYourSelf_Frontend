import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import SigninPage from "./pages/SigninPage";

function App() {

  return (
    <>
    <Toaster richColors />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SigninPage />} />
        <Route path="/signin" element={<SigninPage />} />
      </Routes>
    </BrowserRouter>
      
    </>
  );
}

export default App;
