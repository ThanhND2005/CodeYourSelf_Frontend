import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import SignupPage from "./pages/SignupPage";
import SigninPage from "./pages/SigninPage";
import SigninPageAdmin from "./pages/SigninPageAdmin";
import SigninPageTeacher from "./pages/SigninPageTeacher";
import HomePageStudent from "./pages/HomePageStudent";
import HomePageTeacher from "./pages/HomePageTeacher";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import HomePageAdmin from "./pages/HomePageAdmin";



function App() {
  return (
    <>
      <Toaster richColors />

      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/signin/admin" element={<SigninPageAdmin />} />
          <Route path="/signin/teacher" element={<SigninPageTeacher />} />
          
          <Route element={<ProtectedRoute allowedRole="teacher" />}>
            <Route path="/teacher" element={<HomePageTeacher />} />
          </Route>
          <Route element={<ProtectedRoute allowedRole="student" />}>
            <Route path="/" element={<HomePageStudent />} />
          </Route>
          <Route element={<ProtectedRoute allowedRole="admin" />}>
            <Route path="/admin" element={<HomePageAdmin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
