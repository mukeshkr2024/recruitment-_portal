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
import { QueryClient, QueryClientProvider } from "react-query"
import { PositionDetailPage } from "./pages/postion-detail"
import { ApplicantProtectLayout } from "./components/layouts/applicant-protect-layout"
import { AdminLoginPage } from "./pages/admin-login"
import { ApplicantDashboard } from "./pages/applicant-dashboard"
import { RegisterPage } from "./pages/register"

const queryClient = new QueryClient()

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="font-hanken-grotesk">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AdminLoginPage />} />
            <Route path="/applicant-login" element={<LoginPage />} />
            <Route path="/applicant-register" element={<RegisterPage />} />
            <Route element={<ApplicantProtectLayout />}>
              <Route path="/instructions/:assesmentId" element={<InstructionPage />} />
              <Route path="/assesment/:assesmentId" element={<AssessmentPage />} />
              <Route path="/submitted" element={<SubmittedPage />} />
              <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
            </Route>

            {/* Addmin Routes  */}
            <Route element={<AdminDashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/positions" element={<PositionPage />} />
              <Route path="/positions/:positionId" element={<PositionDetailPage />} />
              <Route path="/applicants" element={<ApplicantsPage />} />
            </Route>
            <Route />
          </Routes>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  )
}
