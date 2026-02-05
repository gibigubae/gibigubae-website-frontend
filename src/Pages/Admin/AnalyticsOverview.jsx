import { useDailyOverview } from "../../hooks/useAnalytics";
import LoadingPage from "../../Components/LoadingPage";
import ErrorPage from "../../Components/ErrorPage";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { BarChart3, RefreshCcw } from "lucide-react";
import "../../styles/Analytics.css";

ChartJS.register(ArcElement, ChartTooltip, Legend);

const AnalyticsOverview = () => {
  // Use React Query hook
  const { data, isLoading, error, isError, refetch } = useDailyOverview();

  if (isLoading) return <LoadingPage message="Fetching analytics..." />;
  if (isError)
    return (
      <ErrorPage
        title="Analytics Error"
        message={error?.response?.data?.message || error?.message || "Unable to load analytics"}
        onRetry={() => refetch()}
      />
    );

  const present = data.total_students_present_today || 0;
  const absent = data.total_students_absent_today || 0;
  const sessions = data.total_sessions_today || 0;
  const rate = Math.min(Math.max(data.today_rate || 0, 0), 100);

  // Recharts bar data
  const barData = [
    { name: "Present", value: present },
    { name: "Absent", value: absent },
    { name: "Sessions", value: sessions },
  ];

  // Chart.js doughnut data
  const doughnutData = {
    labels: ["Present Rate", "Remaining"],
    datasets: [
      {
        label: "Today Rate",
        data: [rate, 100 - rate],
        backgroundColor: ["#2e7d32", "#e0e0e0"],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  return (
    <div className="analytics-container">
      <div className="page-header">
        <div className="title-group">
          <BarChart3 size={24} />
          <h1>Daily Analytics Overview</h1>
        </div>
        <button className="refresh-btn" onClick={() => refetch()}>
          <RefreshCcw size={16} /> Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <p className="kpi-label">Present Rate</p>
          <p className="kpi-value">{rate}%</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Sessions Today</p>
          <p className="kpi-value">{sessions}</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Students Present</p>
          <p className="kpi-value">{present}</p>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Students Absent</p>
          <p className="kpi-value">{absent}</p>
        </div>
      </div>

      <div className="charts-grid">
        {/* Chart.js Doughnut */}
        <div className="chart-card">
          <h2>Today Attendance Rate</h2>
          <div className="chart-box">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="chart-card">
          <h2>Counts Overview</h2>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={barData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#1976d2" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
