import React from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";

// Define TypeScript types for the data
interface ChartData {
    position: string;
    applicants: number;
}

interface ChartProps {
    data: ChartData[];
}

const tickFormatter = (value: number) => {
    return value % 10 === 0 ? value.toString() : '';
};

export const Chart: React.FC<ChartProps> = ({ data }) => {
    return (
        <Card className="rounded-md bg-white p-4 shadow-md flex-1">
            <CardHeader>
                <CardTitle>Overview</CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <XAxis
                        dataKey="position"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={tickFormatter}
                        ticks={[0, 10, 20, 30, 40, 50]} // Define specific ticks up to 50
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#f0f0f0",
                            border: "1px solid #e0e0e0",
                            color: "#333",
                        }}
                    />
                    <Legend wrapperStyle={{ color: "#333", fontSize: "12px" }} />
                    <Bar
                        dataKey="applicants"
                        fill="#3182ce"
                        radius={[4, 4, 0, 0]}
                        name="Total Applicants"
                    />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
};
