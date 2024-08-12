import { useGetApplicantAssessments } from '@/api/applicants/use-getApplicantAssesment';
import { useNavigate } from 'react-router-dom';


export const ApplicantDashboard = () => {
  const { data: assessments } = useGetApplicantAssessments();

  const navigate = useNavigate();

  const handleStart = (id: string) => {
    // Handle start action here
    console.log(`Starting assessment with id: ${id}`);
    navigate(`/instructions/${id}`)
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Applicant Dashboard
      </h1>
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
        <ul className="space-y-4">
          {assessments?.map((assessment) => (
            <li key={assessment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200">
              <div className="text-lg font-semibold text-gray-700">
                {assessment?.position?.positionName}
              </div>
              <button
                onClick={() => handleStart(assessment?.id)}
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
              >
                Start
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
