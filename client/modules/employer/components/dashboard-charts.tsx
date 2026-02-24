"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface DashboardChartsProps {
  funnelData: { name: string; value: number; color: string }[];
  activeJobsData: { name: string; applicants: number }[];
}

export const DashboardCharts = ({ funnelData, activeJobsData }: DashboardChartsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Funnel Donut Chart */}
      <Card className="border-border bg-card/60 backdrop-blur-xl h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Candidate Pipeline Funnel</CardTitle>
          <p className="text-sm text-muted-foreground">
            Distribution of applicants across all your active jobs.
          </p>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={funnelData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                  return (
                    <text
                      x={x}
                      y={y}
                      fill="white"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-xs font-bold shadow-md"
                    >
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
              >
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(24, 24, 27, 0.9)",
                  borderColor: "rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#fff",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                }}
                itemStyle={{ color: "#fff", fontWeight: "bold" }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ paddingTop: "20px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Active Jobs Bar Chart */}
      <Card className="border-border bg-card/60 backdrop-blur-xl h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Most Active Jobs</CardTitle>
          <p className="text-sm text-muted-foreground">
            Top job postings mapped by total applicant volume.
          </p>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center min-h-[300px]">
          {activeJobsData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activeJobsData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="rgba(255,255,255,0.5)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "rgba(255,255,255,0.7)" }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "rgba(255,255,255,0.7)" }}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{
                    backgroundColor: "rgba(24, 24, 27, 0.9)",
                    borderColor: "rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                  }}
                />
                <Bar dataKey="applicants" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50}>
                  {activeJobsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? "#3b82f6" : "#60a5fa"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex items-center justify-center h-full text-muted-foreground">
               Not enough data to display.
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
