import { BrowserRouter, Route, Routes } from "react-router-dom"
import { HomePage } from "./pages/home"
import { LoginPage } from "./pages/login"
import { AssessmentPage } from "./pages/assesment"
import { InstructionPage } from "./pages/instructions"
import { SubmittedPage } from "./pages/submitted"

export const App = () => {
  return (
    <div className="font-hanken-grotesk">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/instructions" element={<InstructionPage />} />
          <Route path="/assesments" element={<AssessmentPage />} />
          <Route path="/submitted" element={<SubmittedPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
