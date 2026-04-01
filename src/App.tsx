import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import SignupPage from "./pages/SignupPage"
import SigninPage from "./pages/SigninPage";
import SigninPageAdmin from "./pages/SigninPageAdmin";
import SigninPageTeacher from "./pages/SigninPageTeacher";
import HomePageStudent from "./pages/HomePageStudent";
import HomePageTeacher from "./pages/HomePageTeacher";

function App() {
  return (
    <>
      <Toaster richColors />

      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signin/admin" element={<SigninPageAdmin />} />
          <Route path="/signin/teacher" element={<SigninPageTeacher/>}/>
          <Route path="/teacher" element={<HomePageTeacher/>}/>
          <Route path="/" element={<HomePageStudent />} />
          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
