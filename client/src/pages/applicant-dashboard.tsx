import { useGetApplicantAssessments } from '@/api/applicants/use-getApplicantAssesment';
import { useApplicantAuth } from '@/hooks/useApplicantAuth';
import { logOutSession } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export const ApplicantDashboard = () => {
  const { data: assessments } = useGetApplicantAssessments();
  const { applicant } = useApplicantAuth(); // Assuming logout is part of useApplicantAuth
  const navigate = useNavigate();

  // @ts-ignore
  const { firstName, lastName, email, phone } = applicant;

  const handleStart = (id: string) => {
    console.log(`Starting assessment with id: ${id}`);
    navigate(`/instructions/${id}`);
  };

  const handleLogout = () => {
    logOutSession()
    window.location.href = "/applicant-login";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-semibold text-gray-800">
            Welcome, {firstName} {lastName}
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </div>
        <div className="text-gray-600 mt-2">
          Email: {email} | Phone: {phone}
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Your Assessments
      </h1>

      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <ul className="space-y-4">
          {assessments?.length > 0 ? (
            assessments.map((assessment: any) => (
              <li key={assessment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200">
                <div className="text-lg font-semibold text-gray-700">
                  {assessment?.position?.positionName}
                </div>
                <button
                  onClick={() => handleStart(assessment?.id)}
                  disabled={assessment?.status !== "PENDING"}
                  className={`px-4 py-2 font-semibold rounded-lg shadow transition duration-200 ${assessment?.status === "PENDING"
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  {assessment?.status === "PENDING" ? "Start" : "Completed"}
                </button>
              </li>
            ))
          ) : (
            <li className="text-center text-gray-600">
              No assessments available.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
