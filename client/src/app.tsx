import { BrowserRouter, Route, Routes } from "react-router-dom"
import { HomePage } from "./pages/home"
import { LoginPage } from "./pages/login"

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}
