import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import SigninPage from "./pages/SigninPage";
import SigninPageAdmin from "./pages/SigninPageAdmin";
import SigninPageTeacher from "./pages/SigninPageTeacher";
function App() {
  return (
    <>
      <Toaster richColors />

      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<SigninPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signin/admin" element={<SigninPageAdmin />} />
          <Route path="/signin/teacher" element={<SigninPageTeacher/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
