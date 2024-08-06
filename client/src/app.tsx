import { BrowserRouter, Route, Routes } from "react-router-dom"
import { HomePage } from "./pages/home"
import { LoginPage } from "./pages/login"
import { AssessmentPage } from "./pages/assesment"
import { InstructionPage } from "./pages/instructions"
import { SubmittedPage } from "./pages/submitted"
import { DashboardPage } from "./pages/dashboard"
import { AdminDashboardLayout } from "./components/layouts/admin-dashboard-layout"
import { PositionPage } from "./pages/positions"
import { ApplicantsPage } from "./pages/applicants"

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

          {/* Addmin Routes  */}
          <Route element={<AdminDashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/positions" element={<PositionPage />} />
            <Route path="/applicants" element={<ApplicantsPage />} />
          </Route>
          <Route />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
