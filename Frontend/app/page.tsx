"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
} from "recharts";
import {
  LayoutDashboard,
  Activity,
  Hash,
  BarChart2,
  TrendingUp,
} from "lucide-react";
import { DashboardCard } from "./components/DashboardCard";
import Papa from "papaparse";
import ChatBot from "./components/ChatBot";

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#d946ef",
  "#f43f5e",
  "#0ea5e9",
  "#10b981",
];

const tabs = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Engagement", icon: Activity },
  { name: "Content", icon: BarChart2 },
  { name: "Performance", icon: TrendingUp },
  { name: "Hashtags", icon: Hash },
];

const App = function () {
  const [activeTab, setActiveTab] = useState("Overview");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/Data/socialMediaAnalytics.csv")
      .then((response) => response.text())
      .then((csv) => {
        const parsedData = Papa.parse(csv, { header: true }).data;
        setData(parsedData);
      });
  }, []);

  // Process data for visualizations
  const postTypeEngagement = data.reduce((acc, post) => {
    const type = post.post_type;
    if (!acc[type]) {
      acc[type] = {
        name: type,
        engagements: 0,
        count: 0,
        avgEngagement: 0,
      };
    }
    acc[type].engagements += Number(post.total_engagements);
    acc[type].count += 1;
    acc[type].avgEngagement = acc[type].engagements / acc[type].count;
    return acc;
  }, {});

  const genrePerformance = data.reduce((acc, post) => {
    const genre = post.genre;
    if (!acc[genre]) {
      acc[genre] = {
        name: genre,
        engagements: 0,
        posts: 0,
        avgEngagement: 0,
      };
    }
    acc[genre].engagements += Number(post.total_engagements);
    acc[genre].posts += 1;
    acc[genre].avgEngagement = acc[genre].engagements / acc[genre].posts;
    return acc;
  }, {});

  const sentimentAnalysis = data.reduce(
    (acc, post) => {
      acc.positive += Number(post.positive_sentiment_pct);
      acc.neutral += Number(post.neutral_sentiment_pct);
      acc.negative += Number(post.negative_sentiment_pct);
      acc.count += 1;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0, count: 0 }
  );

  const deviceUsage = data.reduce(
    (acc, post) => {
      // Convert percentage strings to numbers and handle invalid values
      const mobile = parseFloat(post.device_mobile_pct) || 0;
      const desktop = parseFloat(post.device_desktop_pct) || 0;
      const tablet = parseFloat(post.device_tablet_pct) || 0;

      acc.mobile += mobile;
      acc.desktop += desktop;
      acc.tablet += tablet;
      acc.total += 1;
      return acc;
    },
    { mobile: 0, desktop: 0, tablet: 0, total: 0 }
  );

  // Calculate average percentages
  const deviceData = [
    {
      name: "Mobile",
      value: deviceUsage.total > 0 ? deviceUsage.mobile / deviceUsage.total : 0,
    },
    {
      name: "Desktop",
      value:
        deviceUsage.total > 0 ? deviceUsage.desktop / deviceUsage.total : 0,
    },
    {
      name: "Tablet",
      value: deviceUsage.total > 0 ? deviceUsage.tablet / deviceUsage.total : 0,
    },
  ];

  const timeEngagement = data.reduce((acc, post) => {
    try {
      // Handle different date formats and validate date
      const dateStr = post.posted_at;
      let date;
      if (dateStr.includes("/")) {
        // Handle MM/DD/YYYY format
        const [month, day, year] = dateStr.split("/");
        date = new Date(year, month - 1, day);
      } else {
        // Try parsing as ISO or other formats
        date = new Date(dateStr);
      }

      // Validate if date is valid
      if (isNaN(date.getTime())) {
        return acc;
      }

      const key = date.toISOString().split("T")[0];
      if (!acc[key]) {
        acc[key] = {
          date: key,
          engagements: 0,
          posts: 0,
        };
      }
      acc[key].engagements += Number(post.total_engagements);
      acc[key].posts += 1;
    } catch (error) {
      console.warn("Invalid date:", post.posted_at);
    }
    return acc;
  }, {});

  return (
    <>
      <div className="min-h-screen bg-gray-950 text-white">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 h-full w-16 bg-gray-900 flex flex-col items-center py-8 space-y-8">
          {tabs.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => setActiveTab(name)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                activeTab === name
                  ? "bg-indigo-600 text-white"
                  : "text-gray-500 hover:text-indigo-500"
              }`}
            >
              <Icon className="w-6 h-6" />
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="ml-16 p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-5xl font-bold font-mono">Insighter...</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard title="Post Type Performance" className="col-span-2">
              <div className="h-80">
                <ResponsiveContainer>
                  <BarChart data={Object.values(postTypeEngagement)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                        color: "#ffffff",
                      }}
                    />
                    <Bar
                      name="Average Engagements"
                      dataKey="avgEngagement"
                      fill="#6366f1"
                    />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>

            <DashboardCard title="Content Genre Performance">
              <div className="h-80">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={Object.values(genrePerformance)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="avgEngagement"
                    >
                      {Object.values(genrePerformance).map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "none",
                        color: "#ffffff",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>

            <DashboardCard title="Engagement Over Time" className="col-span-2">
              <div className="h-80">
                <ResponsiveContainer>
                  <AreaChart
                    data={Object.values(timeEngagement).sort(
                      (a, b) => new Date(a.date) - new Date(b.date)
                    )}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                        color: "#ffffff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="engagements"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.5}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>

            <DashboardCard title="Device Distribution">
              <div className="h-80">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "none",
                        color: "#ffffff",
                      }}
                      formatter={(value) =>
                        `${(Number(value) * 100).toFixed(1)}%`
                      }
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>

            <DashboardCard
              title="Engagement vs. Completion Rate"
              className="col-span-2"
            >
              <div className="h-80">
                <ResponsiveContainer>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      type="number"
                      dataKey="engagement_rate"
                      name="Engagement Rate"
                      stroke="#9CA3AF"
                    />
                    <YAxis
                      type="number"
                      dataKey="completion_rate"
                      name="Completion Rate"
                      stroke="#9CA3AF"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "none",
                        color: "#ffffff",
                      }}
                    />
                    <Scatter name="Posts" data={data} fill="#6366f1" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
          </div>
        </div>
        <ChatBot />
      </div>
    </>
  );
};

export { App };
export default App;
