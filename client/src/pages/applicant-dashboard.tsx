import { useGetApplicantAssessments } from '@/api/applicants/use-getApplicantAssesment';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Card } from '@/components/ui/card';
import { useApplicantAuth } from '@/hooks/useApplicantAuth';
import { logOutSession } from '@/lib/utils';
import { ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Exam {
  examId: string;
  name: string;
  status: string;
  exam_type: "mcq" | "coding"
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

  const handleStart = (positionId: string, examId: string, type: "mcq" | "coding") => {
    console.log(`Starting exam with id: ${examId}`);
    if (type === "coding") {
      // Redirect to coding instructions page
      navigate(`/coding-instructions/${positionId}/exam/${examId}`);
      return;
    } else {
      navigate(`/instructions/${positionId}/exam/${examId}`);
    }
  };

  const handleLogout = () => {
    logOutSession();
    window.location.href = '/applicant-login';
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-12 flex flex-col items-center">
      <Card className="w-full max-w-5xl flex justify-between p-5 items-center">
        <div>
          <h2>Welcome, {firstName} {lastName}</h2>
          <p>
            <span className="font-semibold">Email:</span> {email} | <span className="font-semibold">Phone:</span> {phone}
          </p>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="bg-[#FC4C4C] text-white px-6 py-2 rounded-[38px]"
          >
            Logout
          </button>
        </div>
      </Card>

      <h1 className="text-3xl  mt-8 font-bold text-gray-900 mb-8 md:mb-12">
        Your Assessments
      </h1>

      <div className="w-full max-w-4xl -mt-3">
        <ul className="w-full flex flex-col gap-y-4">
          {
            assessments?.length > 0 ? (
              assessments.map((assessment: Assessment) => (
                <li className="bg-[#FBFBFB] flex flex-col gap-y-3 w-full py-8 rounded-lg" >
                  <h2 className="px-8 text-xl font-semibold">{assessment.position_name}</h2>
                  <div className="border-[#D7D7D7] border-b"></div>
                  <ul className="px-8 flex flex-col gap-y-6 mt-2">
                    {
                      assessment.exams.length > 0 ? (
                        assessment.exams.map(exam => (
                          <li className="w-full flex justify-between items-center">
                            <div className="flex items-center text-[#292D32] gap-2.5">
                              <ClipboardList size={24} />
                              <h4 className="font-normal capitalize text-lg" >{exam.name}</h4>
                            </div>
                            <div>
                              {
                                exam.status === "PENDING" && (
                                  <button
                                    onClick={() => handleStart(assessment.id, exam.examId, exam?.exam_type)}
                                    className="bg-[#000000] h-9 w-32 text-white rounded-[48px]"
                                  >Start</button>
                                )
                              }
                              {
                                exam.status === "INPROGRESS" && (
                                  <button
                                    onClick={() => handleStart(assessment.id, exam.examId, exam.exam_type)}
                                    className="bg-[#000000] h-9 w-32 text-white rounded-[48px]"
                                  >Continue</button>
                                )
                              }
                              {
                                exam.status == "COMPLETED" && (
                                  <button
                                    disabled
                                    className="bg-[#42BD5D] h-9 w-32 text-white rounded-[48px]">Completed</button>
                                )
                              }

                            </div>
                          </li>
                        ))
                      ) : (<li className="text-center text-gray-600">
                        No exams available.
                      </li>)
                    }
                  </ul>
                </li>
              ))
            ) : (
              <li className="text-center text-gray-600">
                No assessments available.
              </li>
            )
          }
        </ul>
      </div >

    </div >
  );
};
