import { useGetAnalytics } from "@/api/use-getAnalytics"
import { Chart } from "@/components/chart"
import { DatePickerWithRange } from "@/components/DatePickerWithRange"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { subDays } from "date-fns"
import { BookOpenCheck, Check } from "lucide-react"
import React from "preact/compat"
import { DateRange } from "react-day-picker"
import { FaSuitcase } from "react-icons/fa"
import { TbUsers } from "react-icons/tb"

export const DashboardPage = () => {
    const today = new Date();
    const oneMonthAgo = subDays(today, 30);

    const [date, setDate] = React.useState<DateRange | undefined>({
        from: oneMonthAgo,
        to: today,
    })


    const { data, isLoading } = useGetAnalytics(date)

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="px-6 -mt-4">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Dashboard</CardTitle>
                        <div className="flex gap-4">
                            <DatePickerWithRange
                                date={date}
                                setDate={setDate}
                            />
                            <Button>Download</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-y-6">
                    <div className="flex justify-between w-full gap-6">
                        <Card className="flex-1 h-28 ">
                            <CardHeader>
                                <div className="flex justify-between">
                                    <CardTitle className="tracking-tight text-sm font-medium">Total Applicants</CardTitle>
                                    <TbUsers />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+
                                    {
                                        data?.applicants
                                    }
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="flex-1 h-28 ">
                            <CardHeader>
                                <div className="flex justify-between">
                                    <CardTitle className="tracking-tight text-sm font-medium">Job Positions</CardTitle>
                                    <FaSuitcase size={18} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+
                                    {
                                        data?.positions
                                    }
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="flex-1 h-28 ">
                            <CardHeader>
                                <div className="flex justify-between">
                                    <CardTitle className="tracking-tight text-sm font-medium">Exams</CardTitle>
                                    <BookOpenCheck size={18} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+
                                    {
                                        data?.exams
                                    }
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="flex-1 h-28 ">
                            <CardHeader>
                                <div className="flex justify-between">
                                    <CardTitle className="tracking-tight text-sm font-medium">Exams Conducted</CardTitle>
                                    <Check size={18} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+{""}
                                    {
                                        data?.examsConducted
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="flex gap-4">
                        <Chart
                            data={
                                data?.positionsData
                            }
                        />

                        <Card className="min-w-[500px]">
                            <CardHeader>

                                <CardTitle>Recent Applicants</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    {
                                        data?.recentApplicants?.length > 0 ? <div>
                                            {data?.recentApplicants?.map((item: any) => (
                                                <div className="flex justify-between items-center space-y-8">
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium leading-none">{item?.applicant?.firstName} {item?.applicant?.lastName}</p>
                                                        <span className="text-sm text-muted-foreground">{item?.applicant?.email}</span>
                                                    </div>
                                                    <div>
                                                        <p className="ml-auto font-medium">{item?.position?.positionName}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div> : <div className="text-sm text-muted-foreground">No Applicants</div>
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}
