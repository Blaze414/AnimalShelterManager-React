import { Download, FileText } from "lucide-react";
import { useReports } from "@/hooks/use-shelter-api";

const Reports = () => {
  const { data: reports, isLoading, isError, error } = useReports();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <button className="flex items-center gap-2 bg-card border border-border text-foreground px-4 py-2 rounded-md text-sm hover:bg-secondary transition-colors">
          <Download className="h-4 w-4" />
          Export All
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Available Reports</h2>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading reports...</p>
        ) : isError ? (
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load reports."}
          </p>
        ) : (
          <div className="space-y-3">
            {reports?.map((report) => (
              <div key={`${report.title}-${report.date}`} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{report.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {report.category} · {report.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border ${
                      report.status === "Ready"
                        ? "border-border text-foreground"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {report.status}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full border border-border text-foreground">
                    {report.format}
                  </span>
                  {report.status === "Ready" && (
                    <button className="text-muted-foreground hover:text-foreground">
                      <Download className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
