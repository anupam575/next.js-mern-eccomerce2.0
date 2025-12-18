"use client";

import { useEffect, useState } from "react";
import API from "../../../../utils/axiosInstance";

// Components
import CustomShapeBarChart from "../../../components/Section/charts/Barchart";
import PieChartWithCustomizedLabel from "../../../components/Section/charts/Piechart";
import CustomizedDotLineChart from "../../../components/Section/charts/Linechart";

function UserChartsPage() {
  const [chartData, setChartData] = useState([]); // Bar chart data
  const [pieData, setPieData] = useState([]);     // Pie chart data
  const [lineData, setLineData] = useState([]);   // Line chart data

  useEffect(() => {
    fetchUsersData();
  }, []);

  const fetchUsersData = async () => {
    try {
      const { data } = await API.get("/admin/users/active");

      const users = data?.users || [];
      const totalUsers = data?.totalUsers || users.length;
      const currentUserCount = users.filter(u => u.currentUser).length;
      const otherActiveUsers = users.filter(u => u.isActive && !u.currentUser).length;

      const formattedBarData = [
        { name: "Total Users", value: totalUsers },
        { name: "Current User", value: currentUserCount },
        { name: "Other Active Users", value: otherActiveUsers },
      ];

      const formattedPieData = [
        { name: "Total Users", value: totalUsers },
        { name: "Current User", value: currentUserCount },
        { name: "Other Active Users", value: otherActiveUsers },
      ];

      const formattedLineData = [
        { name: "Total Users", uv: totalUsers, pv: totalUsers, value: totalUsers },
        { name: "Current User", uv: currentUserCount, pv: currentUserCount, value: currentUserCount },
        { name: "Other Active Users", uv: otherActiveUsers, pv: otherActiveUsers, value: otherActiveUsers },
      ];

      setChartData(formattedBarData);
      setPieData(formattedPieData);
      setLineData(formattedLineData);
    } catch (error) {
      console.log("Error loading user chart data:", error);
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">Users Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ✅ Pie chart */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 flex flex-col items-center justify-center h-[500px]">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-200 mt-10">User Distribution</h2>
          <PieChartWithCustomizedLabel data={pieData} />
        </div>

        {/* ✅ Bar chart */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 flex flex-col items-center justify-center h-[500px]">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-200">User Activity</h2>
          <CustomShapeBarChart data={chartData} />
        </div>

        {/* ✅ Line chart */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 flex flex-col items-center justify-center h-[500px] md:col-span-2">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-200">User Trends</h2>
          <CustomizedDotLineChart data={lineData} />
        </div>
      </div>
    </div>
  );
}

export default UserChartsPage;
