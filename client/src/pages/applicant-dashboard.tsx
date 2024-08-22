import { useGetApplicantAssessments } from '@/api/applicants/use-getApplicantAssesment';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { useApplicantAuth } from '@/hooks/useApplicantAuth';
import { logOutSession } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface Exam {
  examId: string;
  name: string;
  status: string;
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

  const handleStart = (positionId: string, examId: string) => {
    console.log(`Starting exam with id: ${examId}`);
    navigate(`/instructions/${positionId}/exam/${examId}`);
  };

  const handleLogout = () => {
    logOutSession();
    window.location.href = '/applicant-login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-gray-100 p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-xl p-6 md:p-8 mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-2xl md:text-4xl font-extrabold text-gray-900">
            Welcome, {firstName} {lastName}
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 md:mt-0 px-6 py-3 bg-red-500 text-white font-bold rounded-full shadow-md hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>
        <div className="text-gray-700 mt-4">
          <span className="font-semibold">Email:</span> {email} | <span className="font-semibold">Phone:</span> {phone}
        </div>
      </div>

      <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 md:mb-12">
        Your Assessments
      </h1>

      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-6 md:p-8">
        <ul className="flex flex-col gap-8">
          {assessments?.length > 0 ? (
            assessments.map((assessment: Assessment) => (
              <li
                key={assessment.id}
                className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 transition-transform transform duration-300"
              >
                <div className="text-2xl font-bold text-gray-800 mb-4">
                  {assessment.position_name}
                </div>
                <ul className="space-y-4">
                  {assessment.exams.length > 0 ? (
                    assessment.exams.map((exam) => (
                      <li
                        key={exam.examId}
                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md border border-gray-200 transition-colors hover:bg-gray-100 duration-300"
                      >
                        <div className="text-lg text-gray-800 font-medium flex items-center">
                          <span className="mr-2">📄</span> {exam.name}
                        </div>
                        {exam?.status === "PENDING" && (
                          <Button
                            onClick={() => handleStart(assessment.id, exam.examId)}
                            className="px-6 py-2 font-semibold rounded-full shadow-md transition duration-300 bg-blue-500 text-white hover:bg-blue-600"
                          >
                            Start
                          </Button>
                        )}
                        {exam?.status === "IN_PROGRESS" && (
                          <Button
                            onClick={() => handleStart(assessment.id, exam.examId)}
                            className="px-6 py-2 font-semibold rounded-full shadow-md transition duration-300 bg-blue-500 text-white hover:bg-blue-600"
                          >
                            Continue
                          </Button>
                        )}
                        {exam?.status === "COMPLETED" && (
                          <Button
                            className="px-6 py-2 font-semibold rounded-full shadow-md transition duration-300 bg-green-500 text-white hover:bg-green-600"
                          >
                            Completed
                          </Button>
                        )}
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
