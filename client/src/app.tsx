import { QueryClient, QueryClientProvider } from "react-query"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AdminDashboardLayout } from "./components/layouts/admin-dashboard-layout"
import { ApplicantProtectLayout } from "./components/layouts/applicant-protect-layout"
import { Toaster } from "./components/ui/toaster"
import { AdminLoginPage } from "./pages/admin-login"
import { ApplicantDashboard } from "./pages/applicant-dashboard"
import { ApplicantsPage } from "./pages/applicants"
import { AssessmentPage } from "./pages/assesment"
import { DashboardPage } from "./pages/dashboard"
import { ExamDetail } from "./pages/exam-detail"
import { Exams } from "./pages/exams"
import { InstructionPage } from "./pages/instructions"
import { LoginPage } from "./pages/login"
import { JobPositionApplicants } from "./pages/position-applicants"
import { PositionPage } from "./pages/positions"
import { PositionDetailPage } from "./pages/postion-detail"
import { RegisterPage } from "./pages/register"
import { SubmittedPage } from "./pages/submitted"

const queryClient = new QueryClient()

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="font-hanken-grotesk">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AdminLoginPage />} />
            <Route path="/applicant-login" element={<LoginPage />} />
            <Route path="/applicant-register/:positionId" element={<RegisterPage />} />
            <Route element={<ApplicantProtectLayout />}>
              <Route path="/instructions/:assesmentId/exam/:examId" element={<InstructionPage />} />
              <Route path="/assesment/:assesmentId/exam/:examId" element={<AssessmentPage />} />
              <Route path="/submitted" element={<SubmittedPage />} />
              <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
            </Route>

            {/* Addmin Routes  */}
            <Route element={<AdminDashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/positions" element={<PositionPage />} />
              <Route path="/positions/:positionId" element={<PositionDetailPage />} />
              <Route path="/positions/:positionId/applicants" element={<JobPositionApplicants />} />
              <Route path="/positions/:positionId" element={<PositionDetailPage />} />
              <Route path="/exams/:examId" element={<ExamDetail />} />
              <Route path="/applicants" element={<ApplicantsPage />} />
              <Route path="/exams" element={<Exams />} />
            </Route>
            <Route />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </div>
    </QueryClientProvider>
  )
}
