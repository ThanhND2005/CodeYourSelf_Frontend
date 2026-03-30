import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import SignupPage from "./pages/SignupPage"
import SigninPage from "./pages/SigninPage";
import SigninPageAdmin from "./pages/SigninPageAdmin";
import SigninPageTeacher from "./pages/SigninPageTeacher";
import HomePageStudent from "./pages/HomePageStudent";
function App() {
  return (
    <>
      <Toaster richColors />

      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<SigninPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signin/admin" element={<SigninPageAdmin />} />
          <Route path="/signin/teacher" element={<SigninPageTeacher/>}/>
          <Route path="/student" element={<HomePageStudent />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
