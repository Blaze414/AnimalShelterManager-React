import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { useFinancialEntries } from "@/hooks/use-shelter-api";

const Financial = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const tabs = ["Overview", "Transactions", "Budget"];
  const tabKeys = ["overview", "transactions", "budget"];
  const { data: financialData, isLoading, isError, error } = useFinancialEntries();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Financial Management</h1>

      <div className="flex gap-1 bg-secondary rounded-md p-1 w-fit">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tabKeys[index])}
            className={`px-4 py-1.5 rounded text-sm transition-colors ${
              activeTab === tabKeys[index]
                ? "bg-card text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Financial Overview</h2>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading financial data...</p>
          ) : isError ? (
            <p className="text-sm text-destructive">
              {error instanceof Error ? error.message : "Failed to load financial data."}
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 18%)" />
                <XAxis dataKey="month" stroke="hsl(215 20% 55%)" fontSize={12} />
                <YAxis stroke="hsl(215 20% 55%)" fontSize={12} tickFormatter={(value) => `$${value}`} />
                <Legend />
                <Bar dataKey="Donations" fill="hsl(210 40% 90%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Adoptions" fill="hsl(215 20% 45%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Expenses" fill="hsl(0 50% 40%)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {activeTab === "transactions" && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">Transactions</h2>
          <p className="text-sm text-muted-foreground">Transactions are now ready to be backed by the same API layer.</p>
        </div>
      )}

      {activeTab === "budget" && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">Budget</h2>
          <p className="text-sm text-muted-foreground">Budget planning can now be added on top of the persisted financial dataset.</p>
        </div>
      )}
    </div>
  );
};

export default Financial;
