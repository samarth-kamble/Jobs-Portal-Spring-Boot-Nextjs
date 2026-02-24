import { Card, CardContent } from "@/components/ui/card";
import { Users, Briefcase, FileCheck, CheckCircle2, XCircle } from "lucide-react";

interface DashboardMetricsProps {
  totalJobs: number;
  totalApplicants: number;
  interviewing: number;
  hired: number;
  rejected: number;
}

export const DashboardMetrics = ({
  totalJobs,
  totalApplicants,
  interviewing,
  hired,
  rejected,
}: DashboardMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
      <Card className="border-border bg-card/60 backdrop-blur-xl">
        <CardContent className="p-6 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-bold">{totalJobs}</span>
          </div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Total Jobs
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/60 backdrop-blur-xl">
        <CardContent className="p-6 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-2xl font-bold">{totalApplicants}</span>
          </div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Total Applicants
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/60 backdrop-blur-xl">
        <CardContent className="p-6 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <FileCheck className="w-6 h-6 text-amber-500" />
            </div>
            <span className="text-2xl font-bold">{interviewing}</span>
          </div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Interviewing
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/60 backdrop-blur-xl">
        <CardContent className="p-6 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <span className="text-2xl font-bold">{hired}</span>
          </div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Hired
          </p>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/60 backdrop-blur-xl">
        <CardContent className="p-6 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-destructive/10 rounded-xl">
              <XCircle className="w-6 h-6 text-destructive" />
            </div>
            <span className="text-2xl font-bold">{rejected}</span>
          </div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Rejected
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
