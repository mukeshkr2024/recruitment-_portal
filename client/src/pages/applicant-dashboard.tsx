import { useGetApplicantAssessments } from '@/api/applicants/use-getApplicantAssesment';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useApplicantAuth } from '@/hooks/useApplicantAuth';
import { logOutSession } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface Exam {
  examId: string;
  name: string;
}

interface Assessment {
  id: string;
  position_name: string;
  exams: Exam[];
}

export const ApplicantDashboard = () => {
  const { data: assessments, isLoading } = useGetApplicantAssessments();
  const { applicant, loading } = useApplicantAuth();
  const navigate = useNavigate();

  if (isLoading || loading) {
    return <LoadingSpinner />;
  }

  // @ts-ignore
  const { firstName, lastName, email, phone } = applicant;

  const handleStart = (examId: string) => {
    console.log(`Starting exam with id: ${examId}`);
    navigate(`/instructions/${examId}`);
  };

  const handleLogout = () => {
    logOutSession();
    window.location.href = '/applicant-login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-4 md:p-6 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-2xl md:text-3xl font-bold text-gray-800">
            Welcome, {firstName} {lastName}
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 md:mt-0 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </div>
        <div className="text-gray-600 mt-2">
          Email: {email} | Phone: {phone}
        </div>
      </div>

      <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6 md:mb-10">
        Your Assessments
      </h1>

      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-4 md:p-8">
        <ul className="space-y-4">
          {assessments?.length > 0 ? (
            assessments.map((assessment: Assessment) => (
              <li
                key={assessment.id}
                className="bg-gray-50 rounded-lg shadow-sm p-4"
              >
                <div className="text-lg font-semibold text-gray-700 mb-2">
                  {assessment.position_name}
                </div>
                <ul className="space-y-2">
                  {assessment.exams.length > 0 ? (
                    assessment.exams.map((exam) => (
                      <li
                        key={exam.examId}
                        className="flex justify-between items-center p-2 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition duration-200"
                      >
                        <div className="text-gray-700">{exam.name}</div>
                        <button
                          onClick={() => handleStart(exam.examId)}
                          className="px-4 py-2 font-semibold rounded-lg shadow transition duration-200 bg-blue-500 text-white hover:bg-blue-600"
                        >
                          Start
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="text-center text-gray-600">
                      No exams available.
                    </li>
                  )}
                </ul>
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
