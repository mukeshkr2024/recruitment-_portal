import { useGetApplicantsByPosition } from '@/api/applicants/use-get-applicationByPosition';
import { useGetAnalytics } from '@/api/use-getAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';

interface Position {
    id: string;
    positionName: string;
}

interface Applicant {
    applicant: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    }
}

export const DashboardPage: React.FC = () => {
    const [currentPosition, setCurrentPosition] = useState<string | null>(null);

    const { data: analytics, isLoading: isAnalyticsLoading, error: analyticsError } = useGetAnalytics();
    const { data: assesments, isLoading: isApplicantsLoading, error: applicantsError } = useGetApplicantsByPosition(currentPosition);

    // Update currentPosition when analytics data is available
    useEffect(() => {
        if (analytics?.job_positons?.length > 0 && currentPosition === null) {
            setCurrentPosition(analytics.job_positons[0].id);
        }
    }, [analytics?.job_positons, currentPosition]);

    const selectedPosition = analytics?.job_positons?.find((p: Position) => p.id === currentPosition);

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-blue-900">Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <CardHeader className="bg-blue-500 text-white">
                        <CardTitle className="text-lg">Total Job Positions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {isAnalyticsLoading ? (
                            <p className="text-gray-500">Loading...</p>
                        ) : analyticsError ? (
                            <p className="text-red-600">Error loading job positions.</p>
                        ) : (
                            <p className="text-2xl font-bold text-blue-700">{analytics?.job_positons?.length || 0}</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <CardHeader className="bg-green-500 text-white">
                        <CardTitle className="text-lg">Total Applicants</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {isAnalyticsLoading ? (
                            <p className="text-gray-500">Loading...</p>
                        ) : analyticsError ? (
                            <p className="text-red-600">Error loading total applicants.</p>
                        ) : (
                            <p className="text-2xl font-bold text-green-700">{analytics?.total_applicants || 0}</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <Card className="bg-white shadow-lg rounded-lg overflow-hidden flex-1">
                    <CardHeader className="bg-purple-600 text-white">
                        <CardTitle className="text-lg">Job Positions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {isAnalyticsLoading ? (
                            <p className="text-gray-500">Loading...</p>
                        ) : analyticsError ? (
                            <p className="text-red-600">Error loading job positions.</p>
                        ) : analytics?.job_positons?.length > 0 ? (
                            <ul className="space-y-4">
                                {analytics.job_positons.map((position: Position) => (
                                    <li
                                        key={position.id}
                                        className="px-4 py-3 border rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                                        onClick={() => setCurrentPosition(position.id)}
                                    >
                                        <h4 className="text-lg font-medium text-gray-800">{position.positionName}</h4>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No job positions available.</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-lg rounded-lg overflow-hidden flex-1">
                    <CardHeader className="bg-orange-600 text-white">
                        <CardTitle className="text-lg">Applicants for {selectedPosition?.positionName || "Select a Position"}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {isApplicantsLoading ? (
                            <p className="text-gray-500">Loading...</p>
                        ) : applicantsError ? (
                            <p className="text-red-600">Error loading applicants.</p>
                        ) : assesments?.length > 0 ? (
                            <div className="space-y-4">
                                {assesments.map((assesment: Applicant) => (
                                    <div
                                        key={assesment?.applicant?.id}
                                        className="p-4 border rounded-md bg-gray-50 hover:bg-gray-200 transition-colors duration-150"
                                    >
                                        <p className="font-semibold text-gray-800">{assesment?.applicant?.firstName} {assesment?.applicant?.lastName}</p>
                                        <p className="text-gray-700">{assesment?.applicant?.email}</p>
                                        <p className="text-gray-700">{assesment?.applicant?.phone}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No applicants available for this position.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
