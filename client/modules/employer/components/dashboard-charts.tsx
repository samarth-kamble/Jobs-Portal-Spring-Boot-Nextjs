"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

export const DashboardPieChart = ({ funnelData }: { funnelData: any[] }) => {
  const pieConfig = {
    Applied: { label: "Applied", color: "var(--color-chart-1)" },
    Interviewing: { label: "Interviewing", color: "var(--color-chart-2)" },
    Hired: { label: "Hired", color: "var(--color-chart-3)" },
    Rejected: { label: "Rejected", color: "var(--color-chart-4)" },
    value: { label: "Count" },
  } satisfies ChartConfig;

  const mappedFunnelData = funnelData.map((d) => ({
    ...d,
    fill: d.color,
  }));

  return (
    <Card className="border-border bg-card/60 backdrop-blur-xl h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Candidate Pipeline</CardTitle>
        <CardDescription>Distribution of applicants.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center min-h-[300px] pb-4">
        <ChartContainer
          config={pieConfig}
          className="w-full aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={mappedFunnelData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
            >
              {mappedFunnelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent />}
              className="flex-wrap"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export const DashboardBarChart = ({
  activeJobsData,
}: {
  activeJobsData: any[];
}) => {
  const barConfig = {
    applicants: { label: "Applicants", color: "var(--color-chart-1)" },
  } satisfies ChartConfig;

  return (
    <Card className="border-border bg-card/60 backdrop-blur-xl h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Top Active Jobs</CardTitle>
        <CardDescription>
          Jobs with the highest applicant volume.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center min-h-[300px] pb-4">
        {activeJobsData.length > 0 ? (
          <ChartContainer
            config={barConfig}
            className="w-full aspect-auto h-[300px]"
          >
            <BarChart
              data={activeJobsData}
              margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                fontSize={12}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={{ fill: "rgba(0,0,0,0.1)" }}
                content={<ChartTooltipContent />}
              />
              <Bar
                dataKey="applicants"
                fill="var(--color-applicants)"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
            Not enough data to display.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const DashboardAreaChart = ({ trendData }: { trendData: any[] }) => {
  const areaConfig = {
    applications: { label: "Applications", color: "var(--color-chart-2)" },
  } satisfies ChartConfig;

  return (
    <Card className="border-border bg-card/60 backdrop-blur-xl h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Application Trends</CardTitle>
        <CardDescription>
          Monthly volume of new applications over time.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center min-h-[300px] pb-4">
        <ChartContainer
          config={areaConfig}
          className="w-full aspect-auto h-[300px]"
        >
          <AreaChart
            data={trendData || []}
            margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="fillApplications" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-applications)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-applications)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              fontSize={12}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="applications"
              stroke="var(--color-applications)"
              fillOpacity={1}
              fill="url(#fillApplications)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export const DashboardRadarChart = ({ radarData }: { radarData: any[] }) => {
  const radarConfig = {
    count: { label: "Count", color: "var(--color-chart-5)" },
  } satisfies ChartConfig;

  return (
    <Card className="border-border bg-card/60 backdrop-blur-xl h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Top Candidate Skills
        </CardTitle>
        <CardDescription>
          Most frequent skills among candidates.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center min-h-[300px] pb-4">
        {radarData.length > 0 ? (
          <ChartContainer
            config={radarConfig}
            className="w-full aspect-square max-h-[300px]"
          >
            <RadarChart
              data={radarData}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" fontSize={12} />
              <PolarRadiusAxis
                angle={30}
                domain={[0, "dataMax"]}
                tick={false}
                axisLine={false}
              />
              <Radar
                name="Candidates"
                dataKey="count"
                stroke="var(--color-count)"
                fill="var(--color-count)"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
            Not enough data to display.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/* ═══════════════════════════════════════════════════════════════════
 * AI ACCURACY DASHBOARD CHARTS
 * Charts for Match Score Distribution, Skill Gap Trends, and
 * Hiring Success Patterns.
 * ═══════════════════════════════════════════════════════════════════ */

/**
 * MatchScoreDistributionChart — Histogram showing how many applicants
 * fall into each AI match score bucket (0–20, 21–40, 41–60, 61–80, 81–100).
 */
export const MatchScoreDistributionChart = ({
  data,
}: {
  data: { range: string; count: number; fill: string }[];
}) => {
  const config = {
    count: { label: "Applicants", color: "var(--color-chart-1)" },
  } satisfies ChartConfig;

  return (
    <Card className="border-border bg-card/60 backdrop-blur-xl h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          📊 Match Score Distribution
        </CardTitle>
        <CardDescription>
          How AI match scores are distributed across all scanned applicants.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center min-h-[300px] pb-4">
        {data.length > 0 ? (
          <ChartContainer
            config={config}
            className="w-full aspect-auto h-[300px]"
          >
            <BarChart
              data={data}
              margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="range"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                fontSize={12}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={{ fill: "rgba(0,0,0,0.1)" }}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
            No scanned applicants yet. Run AI Scans to see data.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * SkillGapChart — Horizontal BarChart comparing required skills (demand)
 * vs candidate skills (supply) to reveal skill gaps.
 */
export const SkillGapChart = ({
  data,
}: {
  data: { skill: string; required: number; candidate: number }[];
}) => {
  const config = {
    required: { label: "Required (Demand)", color: "var(--color-chart-4)" },
    candidate: { label: "Candidate (Supply)", color: "var(--color-chart-2)" },
  } satisfies ChartConfig;

  return (
    <Card className="border-border bg-card/60 backdrop-blur-xl h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          🔍 Skill Gap Trends
        </CardTitle>
        <CardDescription>
          Required skills vs. what candidates actually have. Larger gaps indicate harder-to-fill roles.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center min-h-[300px] pb-4">
        {data.length > 0 ? (
          <ChartContainer
            config={config}
            className="w-full aspect-auto h-[340px]"
          >
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="skill"
                tickLine={false}
                axisLine={false}
                fontSize={11}
                width={90}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="required"
                fill="var(--color-required)"
                radius={[0, 4, 4, 0]}
                maxBarSize={18}
              />
              <Bar
                dataKey="candidate"
                fill="var(--color-candidate)"
                radius={[0, 4, 4, 0]}
                maxBarSize={18}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
            Not enough data to display.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * HiringSuccessChart — Grouped BarChart showing applicant outcomes
 * (Interviewing, Hired, Rejected) segmented by AI match score range
 * to reveal whether high scores correlate with hiring.
 */
export const HiringSuccessChart = ({
  data,
}: {
  data: { range: string; interviewing: number; hired: number; rejected: number }[];
}) => {
  const config = {
    interviewing: { label: "Interviewing", color: "var(--color-chart-2)" },
    hired: { label: "Hired", color: "var(--color-chart-3)" },
    rejected: { label: "Rejected", color: "var(--color-chart-4)" },
  } satisfies ChartConfig;

  return (
    <Card className="border-border bg-card/60 backdrop-blur-xl h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          🎯 Hiring Success Patterns
        </CardTitle>
        <CardDescription>
          Applicant outcomes grouped by AI match score range. Shows if higher scores lead to more hires.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center min-h-[300px] pb-4">
        {data.length > 0 ? (
          <ChartContainer
            config={config}
            className="w-full aspect-auto h-[300px]"
          >
            <BarChart
              data={data}
              margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="range"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                fontSize={12}
                allowDecimals={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="interviewing"
                fill="var(--color-interviewing)"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                dataKey="hired"
                fill="var(--color-hired)"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                dataKey="rejected"
                fill="var(--color-rejected)"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
            Not enough hiring data to display patterns.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

